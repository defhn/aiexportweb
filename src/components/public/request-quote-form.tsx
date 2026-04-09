"use client";

import { useState, type FormEvent } from "react";

import { TurnstileBox } from "@/components/public/turnstile-box";

type FormField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "file";
  required: boolean;
  placeholder?: string;
};

type RequestQuoteFormProps = {
  productOptions: Array<{ id: number; nameEn: string }>;
  formFields: FormField[];
};

export function RequestQuoteForm({ productOptions, formFields }: RequestQuoteFormProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "Submission failed.");
        return;
      }

      setMessage("Quote request submitted successfully.");
      event.currentTarget.reset();
    } finally {
      setPending(false);
    }
  }

  // Pre-filter so we can layout nice grids
  const genericInputFields = formFields.filter((f) => f.type !== "textarea" && f.type !== "file");
  const complexInputFields = formFields.filter((f) => f.type === "textarea" || f.type === "file");

  return (
    <form
      className="space-y-4 rounded-[var(--radius,1rem)] border border-stone-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      {/* We always keep the basic Name/Email hardcoded because the backend requires them */}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-stone-700">
            Full Name <span className="text-red-500">*</span>
          </span>
          <input
            className="rounded-[calc(var(--radius,1rem)-4px)] border border-stone-300 px-4 py-3 text-sm focus:border-[var(--brand,#000)] outline-none transition-all"
            name="name"
            placeholder="John Doe"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-stone-700">
            Email Address <span className="text-red-500">*</span>
          </span>
          <input
            className="rounded-[calc(var(--radius,1rem)-4px)] border border-stone-300 px-4 py-3 text-sm focus:border-[var(--brand,#000)] outline-none transition-all"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
          />
        </label>

        {/* Dynamically generated simple text fields from backend settings */}
        {genericInputFields.map((field) => (
          <label key={field.name} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </span>
            <input
              className="rounded-[calc(var(--radius,1rem)-4px)] border border-stone-300 px-4 py-3 text-sm focus:border-[var(--brand,#000)] outline-none transition-all"
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
            />
          </label>
        ))}

        <label className="flex flex-col gap-1.5 md:col-span-2 mt-2">
          <span className="text-sm font-medium text-stone-700">Select specific product (Optional)</span>
          <select
            className="rounded-[calc(var(--radius,1rem)-4px)] border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[var(--brand,#000)]"
            defaultValue=""
            name="productId"
          >
            <option value="">-- General Inquiry --</option>
            {productOptions.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nameEn}
              </option>
            ))}
          </select>
        </label>
      </div>

      {complexInputFields.map((field) => {
        if (field.type === "textarea") {
          return (
            <label key={field.name} className="mt-4 flex flex-col gap-1.5">
              <span className="text-sm font-medium text-stone-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </span>
              <textarea
                className="min-h-32 w-full rounded-[calc(var(--radius,1rem)-4px)] border border-stone-300 px-4 py-3 text-sm focus:border-[var(--brand,#000)] outline-none transition-all"
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
              />
            </label>
          );
        }
        if (field.type === "file") {
          return (
            <label key={field.name} className="mt-4 flex flex-col gap-1.5">
              <span className="text-sm font-medium text-stone-700">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </span>
              <input
                className="text-sm text-stone-600 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-stone-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--brand,#000)] hover:file:bg-stone-100"
                name={field.name}
                required={field.required}
                type="file"
              />
            </label>
          );
        }
        return null;
      })}
      
      {/* Fallback required backend fields explicitly mapped if missing in dynamic fields */}
      <input type="hidden" name="message" value="Mapped dynamically via JSON" />


      <div className="mt-6">
        <TurnstileBox inputId="quote-turnstile-token" widgetId="quote-turnstile-widget" />
      </div>

      {error ? (
        <p className="mt-4 rounded-[calc(var(--radius,1rem)-4px)] bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-4 rounded-[calc(var(--radius,1rem)-4px)] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      <div className="pt-4">
        <button
          className="rounded-[calc(var(--radius,1rem)-4px)] bg-[var(--brand,#000)] px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Submitting..." : "Submit Quote Request"}
        </button>
      </div>
    </form>
  );
}

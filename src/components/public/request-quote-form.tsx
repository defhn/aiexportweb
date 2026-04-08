"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { TurnstileBox } from "@/components/public/turnstile-box";

type RequestQuoteFormProps = {
  productOptions: Array<{ id: number; nameEn: string }>;
};

export function RequestQuoteForm({ productOptions }: RequestQuoteFormProps) {
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

  return (
    <form
      className="space-y-4 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          name="name"
          placeholder="Your name"
          required
        />
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          name="email"
          placeholder="Email"
          required
          type="email"
        />
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          name="companyName"
          placeholder="Company"
        />
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          name="country"
          placeholder="Country"
        />
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          name="whatsapp"
          placeholder="WhatsApp"
        />
        <select
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue=""
          name="productId"
        >
          <option value="">Select product</option>
          {productOptions.map((product) => (
            <option key={product.id} value={product.id}>
              {product.nameEn}
            </option>
          ))}
        </select>
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          name="productName"
          placeholder="Or type a custom product name"
        />
        <div className="grid grid-cols-[1fr_120px] gap-4">
          <input
            className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
            name="quantity"
            placeholder="Quantity"
          />
          <input
            className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
            defaultValue="pcs"
            name="unit"
            placeholder="Unit"
          />
        </div>
      </div>

      <textarea
        className="min-h-36 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
        name="message"
        placeholder="Share target specifications, trade terms, and delivery destination"
        required
      />
      <textarea
        className="min-h-24 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
        name="itemNotes"
        placeholder="Optional: special requirements for this item"
      />

      <input name="attachment" type="file" />
      <TurnstileBox inputId="quote-turnstile-token" widgetId="quote-turnstile-widget" />

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      <button
        className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Submitting..." : "Submit Quote Request"}
      </button>
    </form>
  );
}

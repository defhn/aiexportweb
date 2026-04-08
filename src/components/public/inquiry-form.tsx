"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type InquiryFormProps = {
  defaultProductName?: string;
  sourcePage: string;
  sourceUrl: string;
};

export function InquiryForm({
  defaultProductName,
  sourcePage,
  sourceUrl,
}: InquiryFormProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("sourcePage", sourcePage);
    formData.set("sourceUrl", sourceUrl);
    formData.set("turnstileToken", "test-pass");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setError(result.error ?? "Submission failed.");
        return;
      }

      setMessage("Inquiry submitted successfully.");
      form.reset();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="space-y-4 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Send Inquiry</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Share your requirement and upload drawings or reference files if needed.
        </p>
      </div>

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
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={defaultProductName}
          name="productName"
          placeholder="Product"
        />
      </div>

      <textarea
        className="min-h-36 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
        name="message"
        placeholder="Tell us what you need"
        required
      />

      <input name="attachment" type="file" />
      <input name="sourcePage" type="hidden" value={sourcePage} />
      <input name="sourceUrl" type="hidden" value={sourceUrl} />

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
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
        {pending ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}

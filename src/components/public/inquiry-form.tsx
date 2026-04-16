"use client";

import type { FormEvent } from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, UploadCloud } from "lucide-react";

import { TurnstileBox } from "@/components/public/turnstile-box";
import { getSavedTrackingParams } from "@/lib/tracking";
import { NdaTrustBadge } from "@/components/public/trust-compliance";

type InquiryFormProps = {
  defaultProductName?: string;
  productId?: number | null;
  sourcePage: string;
  sourceUrl: string;
  accentColor?: string;
  copy?: {
    eyebrow?: string;
    title?: string;
    successTitle?: string;
    successMessage?: string;
    securityNote?: string;
    uploadHint?: string;
    trustBadgeTitle?: string;
    trustBadgeDescription?: string;
  };
};

export function InquiryForm({
  defaultProductName,
  productId,
  sourcePage,
  sourceUrl,
  accentColor = "#2563eb",
  copy,
}: InquiryFormProps) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 防止重复提交
    if (submittingRef.current) return;
    submittingRef.current = true;

    setPending(true);
    setMessage("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("sourcePage", sourcePage);
    // Inject UTM tracking params from localStorage
    const trackingParams = getSavedTrackingParams();
    if (trackingParams.utm_source) formData.append("utmSource", trackingParams.utm_source);
    if (trackingParams.utm_medium) formData.append("utmMedium", trackingParams.utm_medium);
    if (trackingParams.utm_campaign) formData.append("utmCampaign", trackingParams.utm_campaign);
    if (trackingParams.utm_term) formData.append("utmTerm", trackingParams.utm_term);
    if (trackingParams.utm_content) formData.append("utmContent", trackingParams.utm_content);
    if (trackingParams.gclid) formData.append("gclid", trackingParams.gclid);
    formData.set("sourceUrl", sourceUrl);

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

      setMessage(
        copy?.successMessage ??
          "Thank you. Our team will review your request and contact you within 24 hours.",
      );
      form.reset();
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
      submittingRef.current = false;
    }
  }


  if (message) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="mb-4 text-2xl font-semibold text-stone-900">
          {copy?.successTitle ?? "Request Received"}
        </h2>
        <p className="leading-relaxed text-stone-500">{message}</p>
      </motion.div>
    );
  }

  return (
    <form className="space-y-8 p-8" onSubmit={handleSubmit}>
      <header>
        <h2 className="mb-2 text-sm font-black uppercase tracking-[0.4em] text-stone-400">
          {copy?.eyebrow ?? "Request Consultation"}
        </h2>
        <p className="text-2xl font-semibold tracking-tight text-stone-900">
          {copy?.title ?? "Start Project Review"}
        </p>
      </header>

      <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative group">
                <input
                className="w-full border-b-2 bg-transparent py-3.5 text-base font-medium text-stone-900 transition-all placeholder:text-stone-300 focus:outline-none"
                style={{ borderBottomColor: "rgba(120, 113, 108, 0.15)" }} // Adaptive stone-500/15
                onFocus={(e) => e.currentTarget.style.borderBottomColor = accentColor}
                onBlur={(e) => e.currentTarget.style.borderBottomColor = "rgba(120, 113, 108, 0.15)"}
                name="name"
                placeholder="Full Name"
                required
                />
            </div>
            <div className="relative group">
                <input
                className="w-full border-b-2 bg-transparent py-3.5 text-base font-medium text-stone-900 transition-all placeholder:text-stone-300 focus:outline-none"
                style={{ borderBottomColor: "rgba(120, 113, 108, 0.15)" }}
                onFocus={(e) => e.currentTarget.style.borderBottomColor = accentColor}
                onBlur={(e) => e.currentTarget.style.borderBottomColor = "rgba(120, 113, 108, 0.15)"}
                name="email"
                placeholder="Business Email"
                required
                type="email"
                />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
            className="w-full border-b-2 bg-transparent py-3.5 text-base font-medium text-stone-900 transition-all placeholder:text-stone-300 focus:outline-none"
            style={{ borderBottomColor: "rgba(120, 113, 108, 0.15)" }}
            onFocus={(e) => e.currentTarget.style.borderBottomColor = accentColor}
            onBlur={(e) => e.currentTarget.style.borderBottomColor = "rgba(120, 113, 108, 0.15)"}
            name="companyName"
            placeholder="Company"
            />
            <input
            className="w-full border-b-2 bg-transparent py-3.5 text-base font-medium text-stone-900 transition-all placeholder:text-stone-300 focus:outline-none"
            style={{ borderBottomColor: "rgba(120, 113, 108, 0.15)" }}
            onFocus={(e) => e.currentTarget.style.borderBottomColor = accentColor}
            onBlur={(e) => e.currentTarget.style.borderBottomColor = "rgba(120, 113, 108, 0.15)"}
            name="country"
            placeholder="Country"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
                className="w-full border-b-2 bg-transparent py-3.5 text-base font-medium text-stone-900 transition-all placeholder:text-stone-300 focus:outline-none"
                style={{ borderBottomColor: "rgba(120, 113, 108, 0.15)" }}
                onFocus={(e) => e.currentTarget.style.borderBottomColor = accentColor}
                onBlur={(e) => e.currentTarget.style.borderBottomColor = "rgba(120, 113, 108, 0.15)"}
                name="whatsapp"
                placeholder="WhatsApp (Optional)"
            />
            <input
                className="w-full border-b-2 bg-transparent py-3.5 text-base font-medium text-stone-900 transition-all placeholder:text-stone-300 focus:outline-none"
                style={{ borderBottomColor: "rgba(120, 113, 108, 0.15)" }}
                onFocus={(e) => e.currentTarget.style.borderBottomColor = accentColor}
                onBlur={(e) => e.currentTarget.style.borderBottomColor = "rgba(120, 113, 108, 0.15)"}
                defaultValue={defaultProductName}
                name="productName"
                placeholder="Interested Product"
            />
          </div>

          <textarea
            className="min-h-[120px] w-full resize-none border-b-2 bg-transparent py-3.5 text-base font-medium text-stone-900 transition-all placeholder:text-stone-300 focus:outline-none"
            style={{ borderBottomColor: "rgba(120, 113, 108, 0.15)" }}
            onFocus={(e) => e.currentTarget.style.borderBottomColor = accentColor}
            onBlur={(e) => e.currentTarget.style.borderBottomColor = "rgba(120, 113, 108, 0.15)"}
            name="message"
            placeholder="Technical requirements & Project scope..."
            required
          />
      </div>

      <div className="space-y-6">
          <div 
            className="relative flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-all hover:bg-stone-50 group"
            style={{ borderColor: "rgba(120, 113, 108, 0.15)" }}
          >
              <input 
                name="attachment" 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center">
                  <UploadCloud className="mx-auto h-8 w-8 text-stone-300 transition-colors group-hover:scale-110" style={{ color: accentColor }} />
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                    {copy?.uploadHint ?? "Attach references or requirement files"}
                  </p>
              </div>
          </div>

          <TurnstileBox inputId="inquiry-turnstile-token" widgetId="inquiry-turnstile-widget" />
      </div>

      <AnimatePresence>
        {error && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-xs font-bold uppercase tracking-widest text-red-600"
            >
                <AlertCircle className="w-4 h-4" />
                {error}
            </motion.div>
        )}
      </AnimatePresence>

      <NdaTrustBadge
        className="mb-4"
        description={copy?.trustBadgeDescription}
        title={copy?.trustBadgeTitle}
      />
      {copy?.securityNote ? (
        <p className="-mt-2 mb-4 text-xs leading-relaxed text-stone-500 italic">{copy.securityNote}</p>
      ) : null}
      <button
        className="group relative h-16 w-full overflow-hidden rounded-full text-xs font-black uppercase tracking-[0.2em] text-white transition-all active:scale-[0.98] disabled:opacity-50"
        disabled={pending}
        style={{ backgroundColor: accentColor, boxShadow: `0 10px 30px -10px ${accentColor}66` }}
        type="submit"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
            {pending ? "Transmitting..." : (
                <>
                    Submit For Review
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </>
            )}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-1 w-0 bg-white/35 transition-all duration-700 group-hover:w-full" />
      </button>
    </form>
  );
}

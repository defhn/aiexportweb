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
};

export function InquiryForm({
  defaultProductName,
  productId,
  sourcePage,
  sourceUrl,
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

      setMessage("Thank you! Our engineering team will review your request and contact you within 24 hours.");
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
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 font-black uppercase tracking-widest text-[#10b981]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Request Received</h2>
              <p className="text-stone-500 leading-relaxed italic">{message}</p>
          </motion.div>
      );
  }

  return (
    <form className="p-8 space-y-8" onSubmit={handleSubmit}>
      <header>
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-stone-400 mb-2">Request Consultation</h2>
        <p className="text-2xl font-bold tracking-tight text-stone-900">Start Project Analysis</p>
      </header>

      <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative group">
                <input
                className="w-full bg-transparent border-b-2 border-stone-100 py-3.5 text-base font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-stone-300"
                name="name"
                placeholder="Full Name"
                required
                />
            </div>
            <div className="relative group">
                <input
                className="w-full bg-transparent border-b-2 border-stone-100 py-3.5 text-base font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-stone-300"
                name="email"
                placeholder="Business Email"
                required
                type="email"
                />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
            className="w-full bg-transparent border-b-2 border-stone-100 py-3.5 text-base font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-stone-300"
            name="companyName"
            placeholder="Company"
            />
            <input
            className="w-full bg-transparent border-b-2 border-stone-100 py-3.5 text-base font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-stone-300"
            name="country"
            placeholder="Country"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
                className="w-full bg-transparent border-b-2 border-stone-100 py-3.5 text-base font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-stone-300"
                name="whatsapp"
                placeholder="WhatsApp (Optional)"
            />
            <input
                className="w-full bg-transparent border-b-2 border-stone-100 py-3.5 text-base font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-stone-300"
                defaultValue={defaultProductName}
                name="productName"
                placeholder="Interested Product"
            />
          </div>

          <textarea
            className="min-h-[120px] w-full bg-transparent border-b-2 border-stone-100 py-3.5 text-base font-medium text-stone-900 focus:outline-none focus:border-blue-600 transition-colors placeholder:text-stone-300 resize-none"
            name="message"
            placeholder="Technical requirements & Project scope..."
            required
          />
      </div>

      <div className="space-y-6">
          <div className="relative flex items-center justify-center p-6 border-2 border-dashed border-stone-100 rounded-2xl hover:bg-stone-50 transition-colors cursor-pointer group">
              <input 
                name="attachment" 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center">
                  <UploadCloud className="w-8 h-8 text-stone-300 mx-auto transition-colors group-hover:text-blue-500" />
                  <p className="mt-2 text-xs font-bold text-stone-400 uppercase tracking-widest">Upload Drawings (PDF/STEP)</p>
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
                className="flex items-center gap-2 p-4 bg-red-50 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest"
            >
                <AlertCircle className="w-4 h-4" />
                {error}
            </motion.div>
        )}
      </AnimatePresence>

            <NdaTrustBadge className="mb-4" />
<button
        className="w-full group relative h-16 rounded-full bg-stone-900 text-white font-bold tracking-widest uppercase text-xs overflow-hidden transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
        disabled={pending}
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
        <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 w-0 group-hover:w-full transition-all duration-700" />
      </button>
    </form>
  );
}

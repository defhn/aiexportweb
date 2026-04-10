"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { sendInquiryReply } from "@/features/inquiries/reply-actions";
import type { FeatureGate } from "@/features/plans/access";

type AiProvider = "gemini" | "deepseek" | "fallback";

type ReplyTemplate = {
  id: number;
  title: string;
  category: string | null;
  contentEn: string;
};

type InquiryReplyAssistantProps = {
  inquiryId: number;
  customerName: string;
  customerEmail: string;
  companyName?: string | null;
  productName?: string | null;
  message: string;
  specs: string[];
  templates: ReplyTemplate[];
  initialInquiryType?: string | null;
  replyGate: FeatureGate;
  classifyGate: FeatureGate;
};

const PROVIDER_LABELS: Record<AiProvider, string> = {
  gemini: "Gemini 2.5 Flash",
  deepseek: "DeepSeek",
  fallback: "Local fallback template",
};

const PROVIDER_COLORS: Record<AiProvider, string> = {
  gemini: "bg-blue-50 text-blue-700 border-blue-200",
  deepseek: "bg-purple-50 text-purple-700 border-purple-200",
  fallback: "bg-amber-50 text-amber-700 border-amber-200",
};

function fillTemplate(
  template: string,
  values: Record<string, string | null | undefined>,
) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const value = values[key];
    return value?.trim() || "";
  });
}

export function InquiryReplyAssistant({
  inquiryId,
  customerName,
  customerEmail,
  companyName,
  productName,
  message,
  specs,
  templates,
  initialInquiryType,
  replyGate,
  classifyGate,
}: InquiryReplyAssistantProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | "">("");
  const [draft, setDraft] = useState("");
  const [subject, setSubject] = useState(
    productName ? `Re: Inquiry about ${productName}` : "Re: Your Inquiry",
  );
  const [pending, setPending] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [detectedType, setDetectedType] = useState(initialInquiryType ?? "");
  const [error, setError] = useState("");
  const [replyRemaining, setReplyRemaining] = useState<number | null>(replyGate.remaining);
  const [classifyRemaining, setClassifyRemaining] = useState<number | null>(
    classifyGate.remaining,
  );
  const [replyProvider, setReplyProvider] = useState<AiProvider | null>(null);
  const [classifyProvider, setClassifyProvider] = useState<AiProvider | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) ?? null,
    [selectedTemplateId, templates],
  );

  const replyLocked =
    replyGate.status === "locked" ||
    (replyGate.status === "trial" && replyRemaining !== null && replyRemaining <= 0);
  const classifyLocked =
    classifyGate.status === "locked" ||
    (classifyGate.status === "trial" && classifyRemaining !== null && classifyRemaining <= 0);

  async function handleGenerateAiReply() {
    if (replyLocked) return;
    setPending(true);
    setError("");
    setReplyProvider(null);
    setSendResult(null);

    try {
      const response = await fetch("/api/ai/generate-inquiry-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          companyName,
          message,
          productName,
          specs,
          tone: "professional",
        }),
      });

      const result = (await response.json()) as {
        reply?: string;
        provider?: AiProvider;
        remaining?: number | null;
        error?: string;
      };

      if (typeof result.remaining === "number") setReplyRemaining(result.remaining);

      if (!response.ok) {
        setError(result.error ?? "Failed to generate AI reply.");
        return;
      }

      setDraft(result.reply ?? "");
      setReplyProvider(result.provider ?? "fallback");
    } finally {
      setPending(false);
    }
  }

  async function handleClassify() {
    if (classifyLocked) return;
    setClassifying(true);
    setError("");
    setClassifyProvider(null);

    try {
      const response = await fetch("/api/ai/classify-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId }),
      });

      const result = (await response.json()) as {
        inquiryType?: string;
        provider?: AiProvider;
        remaining?: number | null;
        error?: string;
      };

      if (typeof result.remaining === "number") setClassifyRemaining(result.remaining);

      if (!response.ok) {
        setError(result.error ?? "Failed to classify inquiry.");
        return;
      }

      setDetectedType(result.inquiryType ?? "");
      setClassifyProvider(result.provider ?? "fallback");
    } finally {
      setClassifying(false);
    }
  }

  function handleApplyTemplate(templateId: string) {
    const numericId = Number.parseInt(templateId, 10);

    if (!Number.isFinite(numericId)) {
      setSelectedTemplateId("");
      setDraft("");
      return;
    }

    setSelectedTemplateId(numericId);
    const template = templates.find((item) => item.id === numericId);
    if (!template) return;

    setDraft(
      fillTemplate(template.contentEn, {
        name: customerName,
        product_name: productName,
        company_name: companyName,
      }),
    );
    setReplyProvider(null);
    setSendResult(null);
  }

  async function copyDraft() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleSendEmail() {
    if (!draft || !customerEmail) return;
    setSending(true);
    setSendResult(null);

    try {
      const result = await sendInquiryReply({
        inquiryId,
        toEmail: customerEmail,
        toName: customerName,
        subject,
        bodyText: draft,
      });

      setSendResult({
        ok: result.ok,
        message: result.ok
          ? `Reply sent to ${customerEmail}${"simulated" in result && result.simulated ? " (simulated)" : ""}`
          : (result.error ?? "Failed to send reply."),
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="space-y-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-stone-950">Reply Assistant</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Use a template or generate an English draft with AI, then review it before sending.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {replyGate.status === "trial" && replyRemaining !== null ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            AI reply credits left: {replyRemaining}/{replyGate.limit}
          </span>
        ) : null}
        {classifyGate.status === "trial" && classifyRemaining !== null ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            AI classification credits left: {classifyRemaining}/{classifyGate.limit}
          </span>
        ) : null}
      </div>

      <label className="block text-sm font-medium text-stone-700">
        Choose a reply template
        <select
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          onChange={(e) => handleApplyTemplate(e.target.value)}
          value={selectedTemplateId}
        >
          <option value="">Select a template (optional)</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.title}
              {template.category ? ` / ${template.category}` : ""}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={pending || replyLocked}
          onClick={handleGenerateAiReply}
          type="button"
        >
          {pending ? "Generating..." : "Generate AI Reply"}
        </button>
        <button
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
          disabled={classifying || classifyLocked}
          onClick={handleClassify}
          type="button"
        >
          {classifying ? "Classifying..." : "Classify Inquiry"}
        </button>
      </div>

      {replyProvider !== null ? (
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${PROVIDER_COLORS[replyProvider]}`}
        >
          <span>Reply source: {PROVIDER_LABELS[replyProvider]}</span>
          {replyProvider === "fallback" ? (
            <span className="font-normal opacity-70">
              Configure `GEMINI_API_KEY` for a live AI-generated reply.
            </span>
          ) : null}
        </div>
      ) : null}

      {classifyProvider !== null ? (
        <div
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${PROVIDER_COLORS[classifyProvider]}`}
        >
          Classification source: {PROVIDER_LABELS[classifyProvider]}
        </div>
      ) : null}

      {replyLocked || classifyLocked ? (
        <div className="rounded-2xl bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <p className="font-medium">
            Your current plan has no remaining AI credits or this feature is not enabled.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white"
              href={replyGate.salesContactHref}
            >
              Contact Sales
            </Link>
            {replyGate.pricingHref ? (
              <Link
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                href={replyGate.pricingHref}
              >
                View Pricing
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {selectedTemplate ? (
        <p className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
          Current template: {selectedTemplate.title}
        </p>
      ) : null}

      {detectedType ? (
        <div
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classifyProvider ? PROVIDER_COLORS[classifyProvider] : "bg-amber-50 text-amber-800 border-amber-200"}`}
        >
          Classified as: {detectedType}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}

      <label className="block text-sm font-medium text-stone-700">
        Email Subject
        <input
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-stone-700">
        Reply Draft (EN)
        <textarea
          className="mt-2 min-h-64 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Use a template or AI to draft a reply, then review and edit it here."
          value={draft}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-100 pt-4">
        <button
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={!draft || !customerEmail || sending}
          onClick={handleSendEmail}
          type="button"
        >
          {sending ? "Sending..." : `Send to ${customerEmail}`}
        </button>
        <button
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
          disabled={!draft}
          onClick={copyDraft}
          type="button"
        >
          {copied ? "Copied" : "Copy Draft"}
        </button>
      </div>

      {sendResult !== null ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm ${sendResult.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-600"}`}
        >
          {sendResult.message}
        </p>
      ) : null}
    </section>
  );
}

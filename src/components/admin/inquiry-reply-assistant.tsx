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
  fallback: "本地模板（未配置 AI�?,
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
        setError(result.error ?? "AI 回复生成失败�?);
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
        setError(result.error ?? "AI 分类失败�?);
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
          ? `邮件已发送至 ${customerEmail}${"simulated" in result && result.simulated ? "（开发模式模拟）" : ""}`
          : (result.error ?? "发送失�?),
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="space-y-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-stone-950">回复助手</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          套用模板或用 AI 生成英文草稿，人工确认后直接发送至客户邮箱�?        </p>
      </div>

      {/* 额度徽章 */}
      <div className="flex flex-wrap gap-2">
        {replyGate.status === "trial" && replyRemaining !== null ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            AI 回复试用剩余 {replyRemaining}/{replyGate.limit}
          </span>
        ) : null}
        {classifyGate.status === "trial" && classifyRemaining !== null ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            AI 分类试用剩余 {classifyRemaining}/{classifyGate.limit}
          </span>
        ) : null}
      </div>

      {/* 模板选择 */}
      <label className="block text-sm font-medium text-stone-700">
        选择回复模板
        <select
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          onChange={(e) => handleApplyTemplate(e.target.value)}
          value={selectedTemplateId}
        >
          <option value="">请选择模板（可选）</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.title}
              {template.category ? ` / ${template.category}` : ""}
            </option>
          ))}
        </select>
      </label>

      {/* AI 操作按钮 */}
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={pending || replyLocked}
          onClick={handleGenerateAiReply}
          type="button"
        >
          {pending ? "AI 生成�?.." : "AI 生成英文回复"}
        </button>
        <button
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
          disabled={classifying || classifyLocked}
          onClick={handleClassify}
          type="button"
        >
          {classifying ? "AI 分类�?.." : "AI 判断询盘类型"}
        </button>
      </div>

      {/* AI 来源标签 */}
      {replyProvider !== null ? (
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${PROVIDER_COLORS[replyProvider]}`}
        >
          <span>回复来自：{PROVIDER_LABELS[replyProvider]}</span>
          {replyProvider === "fallback" ? (
            <span className="font-normal opacity-70">
              建议配置 GEMINI_API_KEY 获得真实 AI 回复
            </span>
          ) : null}
        </div>
      ) : null}

      {classifyProvider !== null ? (
        <div
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${PROVIDER_COLORS[classifyProvider]}`}
        >
          分类来自：{PROVIDER_LABELS[classifyProvider]}
        </div>
      ) : null}

      {/* 功能锁定提示 */}
      {replyLocked || classifyLocked ? (
        <div className="rounded-2xl bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <p className="font-medium">当前套餐�?AI 额度已用完或暂未开通�?/p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white"
              href={replyGate.salesContactHref}
            >
              联系我升�?            </Link>
            {replyGate.pricingHref ? (
              <Link
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                href={replyGate.pricingHref}
              >
                查看套餐对比
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* 分类结果 */}
      {selectedTemplate ? (
        <p className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
          当前模板：{selectedTemplate.title}
        </p>
      ) : null}

      {detectedType ? (
        <div
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classifyProvider ? PROVIDER_COLORS[classifyProvider] : "bg-amber-50 text-amber-800 border-amber-200"}`}
        >
          AI 分类结果：{detectedType}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}

      {/* 邮件主题 */}
      <label className="block text-sm font-medium text-stone-700">
        邮件主题
        <input
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>

      {/* 回复草稿 */}
      <label className="block text-sm font-medium text-stone-700">
        回复内容（英文）
        <textarea
          className="mt-2 min-h-64 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
          onChange={(e) => setDraft(e.target.value)}
          placeholder="这里会显示模板内容或 AI 生成的英文回复草稿，可手动编辑�?
          value={draft}
        />
      </label>

      {/* 发�?复制操作 */}
      <div className="flex flex-wrap items-center gap-3 border-t border-stone-100 pt-4">
        <button
          className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-60 hover:bg-blue-700"
          disabled={!draft || !customerEmail || sending}
          onClick={handleSendEmail}
          type="button"
        >
          {sending ? "发送中..." : `发送给 ${customerEmail}`}
        </button>
        <button
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
          disabled={!draft}
          onClick={copyDraft}
          type="button"
        >
          {copied ? "�?已复�? : "复制草稿"}
        </button>
      </div>

      {/* 发送结�?*/}
      {sendResult !== null ? (
        <p
          className={`rounded-2xl px-4 py-3 text-sm ${sendResult.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-600"}`}
        >
          {sendResult.ok ? "�?" : "�?"}
          {sendResult.message}
        </p>
      ) : null}
    </section>
  );
}

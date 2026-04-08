"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { FeatureGate } from "@/features/plans/access";

type ReplyTemplate = {
  id: number;
  title: string;
  category: string | null;
  contentEn: string;
};

type InquiryReplyAssistantProps = {
  inquiryId: number;
  customerName: string;
  companyName?: string | null;
  productName?: string | null;
  message: string;
  specs: string[];
  templates: ReplyTemplate[];
  initialInquiryType?: string | null;
  replyGate: FeatureGate;
  classifyGate: FeatureGate;
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
  const [pending, setPending] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [detectedType, setDetectedType] = useState(initialInquiryType ?? "");
  const [error, setError] = useState("");
  const [replyRemaining, setReplyRemaining] = useState<number | null>(replyGate.remaining);
  const [classifyRemaining, setClassifyRemaining] = useState<number | null>(
    classifyGate.remaining,
  );

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? null,
    [selectedTemplateId, templates],
  );

  const replyLocked =
    replyGate.status === "locked" ||
    (replyGate.status === "trial" && replyRemaining !== null && replyRemaining <= 0);
  const classifyLocked =
    classifyGate.status === "locked" ||
    (classifyGate.status === "trial" &&
      classifyRemaining !== null &&
      classifyRemaining <= 0);

  async function handleGenerateAiReply() {
    if (replyLocked) {
      return;
    }

    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/ai/generate-inquiry-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        remaining?: number | null;
        error?: string;
      };

      if (typeof result.remaining === "number") {
        setReplyRemaining(result.remaining);
      }

      if (!response.ok) {
        setError(result.error ?? "AI 回复生成失败。");
        return;
      }

      setDraft(result.reply ?? "");
    } finally {
      setPending(false);
    }
  }

  async function handleClassify() {
    if (classifyLocked) {
      return;
    }

    setClassifying(true);
    setError("");

    try {
      const response = await fetch("/api/ai/classify-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inquiryId }),
      });
      const result = (await response.json()) as {
        inquiryType?: string;
        remaining?: number | null;
        error?: string;
      };

      if (typeof result.remaining === "number") {
        setClassifyRemaining(result.remaining);
      }

      if (!response.ok) {
        setError(result.error ?? "AI 分类失败。");
        return;
      }

      setDetectedType(result.inquiryType ?? "");
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

    if (!template) {
      return;
    }

    setDraft(
      fillTemplate(template.contentEn, {
        name: customerName,
        product_name: productName,
        company_name: companyName,
      }),
    );
  }

  async function copyDraft() {
    await navigator.clipboard.writeText(draft);
  }

  return (
    <section className="space-y-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-stone-950">回复助手</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          可以先套用回复模板，再用 AI 生成英文草稿，最后人工修改后复制发送。
        </p>
      </div>

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

      <label className="block text-sm font-medium text-stone-700">
        选择回复模板
        <select
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          onChange={(event) => handleApplyTemplate(event.target.value)}
          value={selectedTemplateId}
        >
          <option value="">请选择模板</option>
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
          {pending ? "AI 生成中..." : "AI 生成英文回复"}
        </button>
        <button
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
          disabled={classifying || classifyLocked}
          onClick={handleClassify}
          type="button"
        >
          {classifying ? "AI 分类中..." : "AI 判断询盘类型"}
        </button>
        <button
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
          disabled={!draft}
          onClick={copyDraft}
          type="button"
        >
          复制草稿
        </button>
      </div>

      {replyLocked || classifyLocked ? (
        <div className="rounded-2xl bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <p className="font-medium">当前套餐的 AI 额度已用完或暂未开通。</p>
          <p className="mt-2 leading-6">
            升级到 AI 销售版后，可以继续使用 AI 英文回复和 AI 询盘分类。
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white"
              href={replyGate.salesContactHref}
            >
              联系我升级
            </Link>
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

      {selectedTemplate ? (
        <p className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600">
          当前模板：{selectedTemplate.title}
        </p>
      ) : null}

      {detectedType ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          AI 当前判断类型：{detectedType}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}

      <textarea
        className="min-h-72 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
        onChange={(event) => setDraft(event.target.value)}
        placeholder="这里会显示模板内容或 AI 生成的英文回复草稿。"
        value={draft}
      />
    </section>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { FeatureGate } from "@/features/plans/access";

type CategoryOption = {
  id: number;
  nameZh: string;
  nameEn: string;
  slug: string;
};

type ProductAiToolsProps = {
  categories: CategoryOption[];
  formId: string;
  gate: FeatureGate;
};

function setFieldValue(form: HTMLFormElement, name: string, value: string) {
  const field = form.elements.namedItem(name);

  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
    field.value = value;
  }
}

export function ProductAiTools({
  categories,
  formId,
  gate,
}: ProductAiToolsProps) {
  const [pendingMode, setPendingMode] = useState<"name" | "copy" | "seo" | null>(null);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(gate.remaining);

  const isLocked = useMemo(() => {
    if (gate.status === "locked") {
      return true;
    }

    return gate.status === "trial" && remaining !== null && remaining <= 0;
  }, [gate.status, remaining]);

  async function handleGenerate(mode: "name" | "copy" | "seo") {
    const form = document.getElementById(formId) as HTMLFormElement | null;

    if (!form || isLocked) {
      return;
    }

    setPendingMode(mode);
    setError("");

    const formData = new FormData(form);
    const categoryId = Number.parseInt(String(formData.get("categoryId") ?? ""), 10);
    const category = categories.find((item) => item.id === categoryId);
    const defaultFields: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value !== "string" || !key.endsWith("__valueEn")) {
        continue;
      }

      defaultFields[key.replace("field-", "").replace("__valueEn", "")] = value;
    }

    try {
      const response = await fetch("/api/ai/generate-product-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry: category?.nameEn || "industrial manufacturing",
          nameZh: String(formData.get("nameZh") ?? ""),
          shortDescriptionZh: String(formData.get("shortDescriptionZh") ?? ""),
          defaultFields,
        }),
      });
      const result = (await response.json()) as {
        nameEn?: string;
        shortDescriptionEn?: string;
        detailsEn?: string;
        seoTitle?: string;
        seoDescription?: string;
        remaining?: number | null;
        error?: string;
      };

      if (typeof result.remaining === "number") {
        setRemaining(result.remaining);
      }

      if (!response.ok) {
        setError(result.error ?? "AI 生成失败，请稍后重试。");
        return;
      }

      if (mode === "name") {
        setFieldValue(form, "nameEn", result.nameEn ?? "");
      }
      if (mode === "copy") {
        setFieldValue(form, "shortDescriptionEn", result.shortDescriptionEn ?? "");
        setFieldValue(form, "detailsEn", result.detailsEn ?? "");
      }
      if (mode === "seo") {
        setFieldValue(form, "seoTitle", result.seoTitle ?? "");
        setFieldValue(form, "seoDescription", result.seoDescription ?? "");
      }
    } finally {
      setPendingMode(null);
    }
  }

  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-stone-950">AI 智能文案工具</p>
        {gate.status === "trial" && remaining !== null ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            剩余次数 {remaining}/{gate.limit}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm leading-6 text-stone-600">
        {gate.status === "included"
          ? "您的套餐已包含 AI 生成功能。"
          : gate.status === "trial" && !isLocked
            ? "试用期间可免费使用 AI 生成功能，升级套餐解锁更多 AI 次数。"
            : "您的套餐不包含 AI 生成功能，请升级套餐以解锁此功能。"}
      </p>

      {!isLocked ? (
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
            disabled={pendingMode !== null}
            onClick={() => handleGenerate("name")}
            type="button"
          >
            {pendingMode === "name" ? "生成中..." : "生成英文产品名"}
          </button>
          <button
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
            disabled={pendingMode !== null}
            onClick={() => handleGenerate("copy")}
            type="button"
          >
            {pendingMode === "copy" ? "生成中..." : "生成英文描述与详情"}
          </button>
          <button
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
            disabled={pendingMode !== null}
            onClick={() => handleGenerate("seo")}
            type="button"
          >
            {pendingMode === "seo" ? "生成中..." : "生成英文 SEO 文案"}
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white"
            href={gate.salesContactHref}
          >
            联系销售升级
          </Link>
          {gate.pricingHref ? (
            <Link
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
              href={gate.pricingHref}
            >
              查看套餐说明
            </Link>
          ) : null}
        </div>
      )}

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

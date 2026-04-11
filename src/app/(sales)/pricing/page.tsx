import Link from "next/link";
import { notFound } from "next/navigation";

import { env } from "@/env";
import { getSalesContactHref } from "@/features/plans/access";
import {
  getComparisonSections,
  getPlanCardSummaries,
  isPricingPageEnabled,
} from "@/lib/plans";

/* ── icons ─────────────────────────────────────────────────── */
function IconCheck() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
      <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function IconX() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100">
      <svg className="h-3.5 w-3.5 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const planColors = {
  basic: {
    border: "border-stone-200",
    bg: "bg-white",
    badge: "",
    cta: "bg-stone-950 text-white hover:bg-stone-700",
    tag: null,
    priceColor: "text-stone-950",
    headerBg: "bg-stone-50",
  },
  growth: {
    border: "border-amber-400",
    bg: "bg-gradient-to-b from-amber-50 to-white",
    badge: "",
    cta: "bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-200",
    tag: "推荐",
    priceColor: "text-amber-700",
    headerBg: "bg-amber-50",
  },
  ai_sales: {
    border: "border-indigo-400",
    bg: "bg-gradient-to-b from-indigo-950 to-indigo-900",
    badge: "",
    cta: "bg-white text-indigo-950 hover:bg-indigo-50",
    tag: "AI 旗舰",
    priceColor: "text-white",
    headerBg: "bg-indigo-900",
  },
} as const;

/* ── section background stripe ─────────────── */
const sectionIcons: Record<string, string> = {
  "基础展示功能": "🌐",
  "成长营销功能": "📈",
  "智能化CRM": "🤝",
  "AI功能": "⚡",
};

export default function PricingPage() {
  if (!isPricingPageEnabled(env.ENABLE_PRICING_PAGE)) {
    notFound();
  }

  const salesContactHref = getSalesContactHref();
  const plans = getPlanCardSummaries();
  const sections = getComparisonSections();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="bg-white pb-16 pt-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
            Pricing Overview
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            外贸独立站建站套餐
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-500">
            整合官网展示、询盘直达、内容运营与 AI 销售辅助，为出口工厂打造完整获客闭环。
          </p>
        </div>
      </section>

      {/* ── Plan Cards ──────────────────────────────────────── */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const c = planColors[plan.key];
              const isDark = plan.key === "ai_sales";
              return (
                <article
                  key={plan.key}
                  className={`relative flex flex-col rounded-3xl border-2 p-8 shadow-sm transition-shadow hover:shadow-xl ${c.border} ${c.bg}`}
                >
                  {c.tag && (
                    <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-md ${plan.key === "growth" ? "bg-amber-600" : "bg-indigo-500"}`}>
                      {c.tag}
                    </span>
                  )}

                  {/* name */}
                  <div>
                    <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-stone-950"}`}>
                      {plan.nameZh}
                    </h2>
                    <p className={`text-sm ${isDark ? "text-indigo-300" : "text-stone-400"}`}>
                      {plan.nameEn}
                    </p>
                  </div>

                  {/* price */}
                  <div className="mt-6">
                    <span className={`text-5xl font-black ${c.priceColor}`}>
                      ¥{plan.price.toLocaleString()}
                    </span>
                    <span className={`ml-2 text-sm ${isDark ? "text-indigo-300" : "text-stone-400"}`}>
                      / 一次性交付
                    </span>
                  </div>

                  {/* tagline */}
                  <p className={`mt-2 text-sm font-semibold ${isDark ? "text-indigo-200" : "text-stone-600"}`}>
                    {plan.taglineZh}
                  </p>

                  {/* description */}
                  <p className={`mt-3 flex-1 text-sm leading-6 ${isDark ? "text-indigo-200" : "text-stone-500"}`}>
                    {plan.descriptionZh}
                  </p>

                  {/* cta */}
                  <Link
                    href={salesContactHref}
                    className={`mt-8 flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all active:scale-95 ${c.cta}`}
                  >
                    咨询 {plan.nameZh} 方案
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Feature Comparison Table ─────────────────────────── */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-stone-950">套餐功能详细对比</h2>
          <p className="mt-2 text-sm text-stone-500">
            每项功能所在套餐一目了然，帮助你选出最合适的方案。
          </p>

          <div className="mt-8 overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm">
            {sections.map((section, si) => (
              <div key={section.title}>
                {/* Section Header */}
                <div className={`flex items-center gap-2 px-6 py-4 ${si === 0 ? "" : "border-t border-stone-100"} bg-stone-50`}>
                  <span className="text-xl">{sectionIcons[section.title] ?? "📦"}</span>
                  <h3 className="font-bold text-stone-950">{section.title}</h3>
                </div>

                {/* Column Headers — shown once per section */}
                <div className="grid grid-cols-[1fr_100px_100px_100px] border-b border-stone-100 bg-stone-950 px-6 py-3 text-xs font-bold uppercase tracking-widest text-stone-400">
                  <span>功能项</span>
                  <span className="text-center text-stone-400">基础版</span>
                  <span className="text-center text-amber-400">成长版</span>
                  <span className="text-center text-indigo-400">AI销售版</span>
                </div>

                {/* Rows */}
                {section.rows.map((row, ri) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[1fr_100px_100px_100px] items-center gap-2 px-6 py-3.5 ${ri % 2 === 0 ? "bg-white" : "bg-stone-50/60"}`}
                  >
                    <span className="text-sm text-stone-700">{row.label}</span>
                    <div className="flex justify-center">
                      {row.basic ? <IconCheck /> : <IconX />}
                    </div>
                    <div className="flex justify-center">
                      {row.growth ? <IconCheck /> : <IconX />}
                    </div>
                    <div className="flex justify-center">
                      {row.ai_sales ? <IconCheck /> : <IconX />}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Legend Footer */}
            <div className="flex flex-wrap items-center gap-6 border-t border-stone-100 bg-stone-50 px-6 py-4 text-xs text-stone-500">
              <span className="flex items-center gap-2"><IconCheck /> 已包含</span>
              <span className="flex items-center gap-2"><IconX /> 未包含</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-stone-950">为什么采用顾问式报价？</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-600">
                <p>
                  B2B 建站不是标准商品，不同行业对品类架构、产品字段、下载资料、询盘流程的需求差异很大。
                </p>
                <p>
                  通过先沟通确认需求，可以避免交付后因范围不符而产生的返工成本，也能让你的网站从第一天起就真正符合目标买家的期望。
                </p>
                <p>
                  我们会在通话 / 微信沟通后，为你出具一份包含功能范围、交付周期和付款安排的正式方案书。
                </p>
              </div>
            </article>

            <article className="flex flex-col rounded-3xl bg-stone-950 p-8 text-white shadow-sm">
              <h2 className="text-xl font-bold">预约免费咨询</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-stone-300">
                告诉我们你的行业、主要产品和目标市场，我们将在 24 小时内回复并安排沟通。
              </p>
              <Link
                href={salesContactHref}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-stone-100 active:scale-95"
              >
                立即联系销售顾问 →
              </Link>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

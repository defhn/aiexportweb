import Link from "next/link";
import { notFound } from "next/navigation";

import { env } from "@/env";
import { getSalesContactHref } from "@/features/plans/access";
import {
  getComparisonSections,
  getPlanCardSummaries,
  isPricingPageEnabled,
} from "@/lib/plans";

function IconCheck() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
      <svg
        className="h-3.5 w-3.5 text-emerald-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function IconX() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100">
      <svg
        className="h-3.5 w-3.5 text-stone-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          d="M6 18L18 6M6 6l12 12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const sectionIcons: Record<string, string> = {
  基础展示功能: "🌐",
  成长营销功能: "📈",
  智能化CRM: "🤝",
  AI功能: "⚡",
};

export default function PricingPage() {
  if (!isPricingPageEnabled(env.ENABLE_PRICING_PAGE)) {
    notFound();
  }

  const salesContactHref = getSalesContactHref();
  const plans = getPlanCardSummaries();
  const sections = getComparisonSections();

  const planStyle = {
    basic: {
      borderColor: "#e7e5e4",
      bgClass: "bg-white",
      tagLabel: null as string | null,
      tagBg: "",
      priceClass: "text-stone-950",
      ctaClass: "bg-stone-950 text-white hover:bg-stone-800",
      textDark: false,
    },
    growth: {
      borderColor: "#f59e0b",
      bgClass: "bg-gradient-to-b from-amber-50 to-white",
      tagLabel: "推荐" as string | null,
      tagBg: "bg-amber-600",
      priceClass: "text-amber-700",
      ctaClass: "bg-amber-600 text-white hover:bg-amber-500",
      textDark: false,
    },
    ai_sales: {
      borderColor: "#818cf8",
      bgClass: "bg-gradient-to-b from-indigo-950 to-indigo-900",
      tagLabel: "AI 旗舰" as string | null,
      tagBg: "bg-indigo-500",
      priceClass: "text-white",
      ctaClass: "bg-white text-indigo-950 hover:bg-indigo-50",
      textDark: true,
    },
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      {/* Hero */}
      <section className="bg-white pb-16 pt-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
            Pricing Overview
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            外贸独立站建站套餐
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-500">
            整合官网展示、询盘直达、内容运营与 AI
            销售辅助，为出口工厂打造完整获客闭环。
          </p>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const s = planStyle[plan.key];
              return (
                <article
                  key={plan.key}
                  className={`relative flex flex-col rounded-3xl border-2 p-8 shadow-sm transition-shadow hover:shadow-xl ${s.bgClass}`}
                  style={{ borderColor: s.borderColor }}
                >
                  {s.tagLabel && (
                    <span
                      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-md ${s.tagBg}`}
                    >
                      {s.tagLabel}
                    </span>
                  )}

                  <h2
                    className="text-xl font-bold"
                    style={{ color: s.textDark ? "#ffffff" : "#0c0a09" }}
                  >
                    {plan.nameZh}
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: s.textDark ? "#a5b4fc" : "#a8a29e" }}
                  >
                    {plan.nameEn}
                  </p>

                  <div className="mt-6">
                    <span
                      className={`text-5xl font-black ${s.priceClass}`}
                    >
                      ¥{plan.price.toLocaleString()}
                    </span>
                    <span
                      className="ml-2 text-sm"
                      style={{ color: s.textDark ? "#a5b4fc" : "#a8a29e" }}
                    >
                      / 一次性交付
                    </span>
                  </div>

                  <p
                    className="mt-2 text-sm font-semibold"
                    style={{ color: s.textDark ? "#c7d2fe" : "#44403c" }}
                  >
                    {plan.taglineZh}
                  </p>

                  <p
                    className="mt-3 flex-1 text-sm leading-6"
                    style={{ color: s.textDark ? "#c7d2fe" : "#78716c" }}
                  >
                    {plan.descriptionZh}
                  </p>

                  <Link
                    href={salesContactHref}
                    className={`mt-8 flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all active:scale-95 ${s.ctaClass}`}
                  >
                    咨询 {plan.nameZh} 方案
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-stone-950">
            套餐功能详细对比
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            每项功能所在套餐一目了然，帮助你选出最合适的方案。
          </p>

          <div className="mt-8 overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm">
            {sections.map((section, si) => (
              <div key={section.title}>
                {/* Section Header */}
                <div
                  className={`flex items-center gap-2 px-6 py-4 bg-stone-50 ${si !== 0 ? "border-t border-stone-100" : ""}`}
                >
                  <span className="text-xl">
                    {sectionIcons[section.title] ?? "📦"}
                  </span>
                  <h3 className="font-bold text-stone-950">{section.title}</h3>
                </div>

                {/* Column Headers */}
                <div className="grid grid-cols-[1fr_100px_100px_100px] border-b border-stone-200 bg-stone-950 px-6 py-3 text-xs font-bold uppercase tracking-widest">
                  <span style={{ color: "#a8a29e" }}>功能项</span>
                  <span className="text-center" style={{ color: "#a8a29e" }}>
                    基础版
                  </span>
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

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 border-t border-stone-100 bg-stone-50 px-6 py-4 text-xs text-stone-500">
              <span className="flex items-center gap-2">
                <IconCheck /> 已包含
              </span>
              <span className="flex items-center gap-2">
                <IconX /> 未包含
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-stone-950">
                为什么采用顾问式报价？
              </h2>
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

            <article className="flex flex-col rounded-3xl p-8 shadow-sm" style={{ backgroundColor: "#0c0a09" }}>
              <h2 className="text-xl font-bold" style={{ color: "#ffffff" }}>
                预约免费咨询
              </h2>
              <p className="mt-3 flex-1 text-sm leading-7" style={{ color: "#d6d3d1" }}>
                告诉我们你的行业、主要产品和目标市场，我们将在 24 小时内回复并安排沟通。
              </p>
              <Link
                href={salesContactHref}
                className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-colors hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#ffffff", color: "#0c0a09" }}
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

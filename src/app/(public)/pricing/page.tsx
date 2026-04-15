import Link from "next/link";
import { notFound } from "next/navigation";

import { env } from "@/env";
import { getSalesContactHref } from "@/features/plans/access";
import { buildPricingPageContent } from "@/features/public/site-page-copy";
import { getSiteSettings } from "@/features/settings/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
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
        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const sectionIcons: Record<string, string> = {
  基础展示功能: "1",
  成长营销功能: "2",
  智能化CRM: "3",
  AI功能: "4",
};

const planStyle = {
  basic: {
    borderColor: "#e7e5e4",
    bgClass: "bg-white",
    accentClass: "text-stone-950",
    ctaClass: "bg-stone-950 text-white hover:bg-stone-800",
  },
  growth: {
    borderColor: "#f59e0b",
    bgClass: "bg-gradient-to-b from-amber-50 to-white",
    accentClass: "text-amber-700",
    ctaClass: "bg-amber-600 text-white hover:bg-amber-500",
  },
  ai_sales: {
    borderColor: "#818cf8",
    bgClass: "bg-gradient-to-b from-indigo-950 to-indigo-900",
    accentClass: "text-white",
    ctaClass: "bg-white text-indigo-950 hover:bg-indigo-50",
  },
} as const;

export default async function PricingPage() {
  if (!isPricingPageEnabled(env.ENABLE_PRICING_PAGE)) {
    notFound();
  }

  const currentSite = await getCurrentSiteFromRequest();
  const settings = await getSiteSettings(currentSite.seedPackKey, currentSite.id ?? null);
  const pageCopy = buildPricingPageContent(currentSite, settings);
  const salesContactHref = getSalesContactHref();
  const plans = getPlanCardSummaries();
  const sections = getComparisonSections();

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <section className="bg-white pb-14 pt-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600">
            {pageCopy.eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            {pageCopy.headline}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-500">{pageCopy.description}</p>
          <div className="mt-6 inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            {pageCopy.currentPlanLabel}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const style = planStyle[plan.key];
              const isCurrentPlan = currentSite.plan === plan.key;
              const textClass = plan.key === "ai_sales" ? "text-indigo-100" : "text-stone-500";

              return (
                <article
                  key={plan.key}
                  className={`relative flex flex-col rounded-3xl border-2 p-8 shadow-sm transition-shadow hover:shadow-xl ${style.bgClass}`}
                  style={{ borderColor: style.borderColor }}
                >
                  {isCurrentPlan ? (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-md">
                      Current Plan
                    </span>
                  ) : null}

                  <h2 className={`text-xl font-bold ${style.accentClass}`}>{plan.nameZh}</h2>
                  <p className={`text-sm ${textClass}`}>{plan.nameEn}</p>

                  <div className="mt-6">
                    <span className={`text-5xl font-black ${style.accentClass}`}>
                      ${plan.price.toLocaleString()}
                    </span>
                    <span className={`ml-2 text-sm ${textClass}`}>/ one-time setup</span>
                  </div>

                  <p className={`mt-2 text-sm font-semibold ${plan.key === "ai_sales" ? "text-indigo-200" : "text-stone-700"}`}>
                    {plan.taglineZh}
                  </p>
                  <p className={`mt-3 flex-1 text-sm leading-6 ${textClass}`}>{plan.descriptionZh}</p>

                  <Link
                    href={salesContactHref}
                    className={`mt-8 flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all active:scale-95 ${style.ctaClass}`}
                  >
                    {isCurrentPlan ? pageCopy.ctaLabel : `咨询 ${plan.nameZh}`}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-stone-950">套餐功能对比</h2>
          <p className="mt-2 text-sm text-stone-500">
            页面结构共用一套，但对外展示内容、当前套餐和可见能力都会跟随当前站点。
          </p>

          <div className="mt-8 overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm">
            {sections.map((section, index) => (
              <div key={section.title}>
                <div
                  className={`flex items-center gap-3 bg-stone-50 px-6 py-4 ${index !== 0 ? "border-t border-stone-100" : ""}`}
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-stone-700">
                    {sectionIcons[section.title] ?? "•"}
                  </span>
                  <h3 className="font-bold text-stone-950">{section.title}</h3>
                </div>

                <div className="grid grid-cols-[1fr_100px_100px_100px] border-b border-stone-200 bg-stone-950 px-6 py-3 text-xs font-bold uppercase tracking-widest text-stone-300">
                  <span>Feature</span>
                  <span className="text-center">Basic</span>
                  <span className="text-center text-amber-400">Growth</span>
                  <span className="text-center text-indigo-300">AI Sales</span>
                </div>

                {section.rows.map((row, rowIndex) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[1fr_100px_100px_100px] items-center gap-2 px-6 py-3.5 ${rowIndex % 2 === 0 ? "bg-white" : "bg-stone-50/60"}`}
                  >
                    <span className="text-sm text-stone-700">{row.label}</span>
                    <div className="flex justify-center">{row.basic ? <IconCheck /> : <IconX />}</div>
                    <div className="flex justify-center">{row.growth ? <IconCheck /> : <IconX />}</div>
                    <div className="flex justify-center">{row.ai_sales ? <IconCheck /> : <IconX />}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-stone-950">{pageCopy.consultationTitle}</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-stone-600">
              <p>{pageCopy.consultationBody}</p>
              <p>
                That means you can keep one deployable framework, then adjust site content, template fit,
                plan level, and add-on modules per client without splitting into separate projects.
              </p>
            </div>
          </article>

          <article className="flex flex-col rounded-3xl bg-stone-950 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-white">Book a consultation</h2>
            <p className="mt-3 flex-1 text-sm leading-7 text-stone-300">
              Tell us your industry, core products, and target market. We will use the current site
              setup as the starting point and refine the package around the real client delivery scope.
            </p>
            <Link
              href={salesContactHref}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-stone-100 active:scale-95"
            >
              {pageCopy.ctaLabel}
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}

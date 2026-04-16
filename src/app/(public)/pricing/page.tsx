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
import { getTemplateById, getTemplateTheme } from "@/templates";

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

  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);
  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";
  const cardBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,1)";
  const bgMain = isDark ? theme.surface : "#f5f5f4"; // stone-100 base for light mode

  return (
    <div className="min-h-screen pt-28 pb-32 transition-colors duration-500" style={{ backgroundColor: bgMain }}>
      <section className="relative px-6 py-20 overflow-hidden mx-4 rounded-[3rem] border shadow-xl" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
        <div className="absolute inset-0 opacity-10 texture-carbon mix-blend-overlay pointer-events-none" />
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${theme.accent}30` }} />
        
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
            {pageCopy.eyebrow}
          </p>
          <h1 className={`mt-6 max-w-4xl mx-auto text-4xl font-black tracking-tight md:text-5xl lg:text-6xl ${textColor}`}>
            {pageCopy.headline}
          </h1>
          <p className={`mt-6 max-w-3xl mx-auto text-lg leading-relaxed font-medium ${textMuted}`}>{pageCopy.description}</p>
          <div className="mt-10 inline-flex rounded-full border px-6 py-3 text-xs font-black uppercase tracking-widest" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", color: textColor }}>
            {pageCopy.currentPlanLabel}
          </div>
        </div>
      </section>

      <section className="py-20 relative z-20 -mt-10 mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const style = planStyle[plan.key];
            const isCurrentPlan = currentSite.plan === plan.key;
            // Adaptive card styling for dark mode
            const dynamicBorder = isDark ? (isCurrentPlan ? theme.accent : theme.border) : style.borderColor;
            const dynamicBg = isDark ? cardBg : style.bgClass;
            const dynamicAccent = isDark ? "text-white" : style.accentClass;
            const dynamicMuted = isDark ? "text-white/60" : "text-stone-500";
            const dynamicCta = isDark ? (isCurrentPlan ? "bg-white text-black" : "border text-white hover:bg-white/10") : style.ctaClass;

            return (
              <article
                key={plan.key}
                className={`relative flex flex-col rounded-[2.5rem] border-2 p-10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] ${!isDark ? dynamicBg : ''}`}
                style={isDark ? { borderColor: dynamicBorder, backgroundColor: dynamicBg } : { borderColor: dynamicBorder }}
              >
                {isCurrentPlan ? (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-xl" style={{ backgroundColor: theme.accent }}>
                    Current Plan
                  </span>
                ) : null}

                <h2 className={`text-2xl font-black tracking-tight ${dynamicAccent}`}>{plan.nameZh}</h2>
                <p className={`mt-1 text-xs font-bold uppercase tracking-widest ${dynamicMuted}`}>{plan.nameEn}</p>

                <div className="mt-8 border-b pb-8" style={{ borderColor: theme.border }}>
                  <span className={`text-5xl font-black ${dynamicAccent}`}>
                    ${plan.price.toLocaleString()}
                  </span>
                  <span className={`ml-2 text-sm font-medium ${dynamicMuted}`}>/ one-time setup</span>
                </div>

                <p className={`mt-6 text-sm font-black ${plan.key === "ai_sales" ? (isDark ? "text-white/90" : "text-indigo-200") : dynamicAccent}`}>
                  {plan.taglineZh}
                </p>
                <p className={`mt-4 flex-1 text-sm leading-relaxed font-medium ${dynamicMuted}`}>{plan.descriptionZh}</p>

                <Link
                  href={salesContactHref}
                  className={`mt-10 flex items-center justify-center rounded-xl px-6 py-4 text-sm font-black uppercase tracking-wider transition-all active:scale-95 ${!isDark ? dynamicCta : (isCurrentPlan ? 'text-white' : '')}`}
                  style={isDark && isCurrentPlan ? { backgroundColor: theme.accent, borderColor: "transparent" } : (isDark ? { borderColor: theme.border } : {})}
                >
                  {isCurrentPlan ? pageCopy.ctaLabel : `咨询 ${plan.nameZh}`}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className={`text-3xl font-black tracking-tight ${textColor}`}>套餐功能对比</h2>
          <p className={`mt-3 text-sm font-medium ${textMuted}`}>
            页面结构共用一套，但对外展示内容、当前套餐和可见能力都会跟随当前站点自动适配暗黑/明亮。
          </p>

          <div className="mt-12 overflow-x-auto rounded-[2.5rem] border shadow-2xl" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
            {sections.map((section, index) => (
              <div key={section.title}>
                <div
                  className={`flex items-center gap-4 px-8 py-5 ${index !== 0 ? "border-t" : ""}`}
                  style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm text-sm font-black text-stone-900 border" style={{ borderColor: theme.border }}>
                    {sectionIcons[section.title] ?? "•"}
                  </span>
                  <h3 className={`font-black text-lg ${textColor}`}>{section.title}</h3>
                </div>

                <div className="grid grid-cols-[1fr_100px_100px_100px] border-b px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/50" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "#0f172a" }}>
                  <span>Feature</span>
                  <span className="text-center">Basic</span>
                  <span className="text-center text-amber-400">Growth</span>
                  <span className="text-center text-indigo-300">AI Sales</span>
                </div>

                {section.rows.map((row, rowIndex) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1fr_100px_100px_100px] items-center gap-2 px-8 py-5 transition-colors hover:bg-white/5"
                    style={{ backgroundColor: rowIndex % 2 === 0 ? "transparent" : (isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)") }}
                  >
                    <span className={`text-sm font-medium ${textColor}`}>{row.label}</span>
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

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[3rem] border p-12 shadow-2xl transition-transform hover:-translate-y-1" style={{ borderColor: theme.border, backgroundColor: cardBg }}>
            <h2 className={`text-2xl font-black tracking-tight ${textColor}`}>{pageCopy.consultationTitle}</h2>
            <div className={`mt-6 space-y-4 text-sm leading-relaxed font-medium ${textMuted}`}>
              <p>{pageCopy.consultationBody}</p>
              <p>
                That means you can keep one deployable framework, then adjust site content, template fit,
                plan level, and add-on modules per client without splitting into separate projects.
              </p>
            </div>
          </article>

          <article className="relative flex flex-col overflow-hidden rounded-[3rem] p-12 shadow-2xl transition-transform hover:-translate-y-1" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border, borderWidth: 1 }}>
            <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon pointer-events-none" />
            <h2 className={`relative z-10 text-2xl font-black tracking-tight ${textColor}`}>Book a consultation</h2>
            <p className={`relative z-10 mt-5 flex-1 text-sm leading-relaxed font-medium ${textMuted}`}>
              Tell us your industry, core products, and target market. We will use the current site
              setup as the starting point and refine the package around the real client delivery scope.
            </p>
            <Link
              href={salesContactHref}
              className="relative z-10 mt-10 inline-flex items-center justify-center rounded-xl px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition-transform hover:scale-105 shadow-xl"
              style={{ backgroundColor: theme.accent }}
            >
              {pageCopy.ctaLabel}
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}

/**
 * template-01 首页
 * 行业：工业制造 / CNC 精密加工
 * 风格：深黑 + 蓝色科技感
 *
 * 此文件只负责 UI 渲染，业务数据从 props 传入（由 src/app/(public)/page.tsx 获取）。
 * 需要调整此模板外观时，只改 src/templates/template-01/ 目录即可，不影响其他模板。
 */

import Link from "next/link";
import { MoveRight } from "lucide-react";

import { CategoryGrid } from "@/components/public/category-grid";
import { FactoryEquipment } from "@/components/public/factory-equipment";
import { HeroSection } from "@/components/public/hero-section";
import { LatestInsights } from "@/components/public/latest-insights";
import { ProcessSteps } from "@/components/public/process-steps";
import { ProductCard } from "@/components/public/product-card";
import { QualityCertifications } from "@/components/public/quality-certifications";
import { StrengthsSection } from "@/components/public/strengths-section";
import { TrustedBrands } from "@/components/public/trusted-brands";

import type { HomePageProps } from "@/templates/types";

// ─── 工具函数 ─────────────────────────────────────────────────────────────

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function readStringArray(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

// ─── CTA Section（仅此模板使用的专属组件） ────────────────────────────────

function FinalCtaSection({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  theme,
  textColor,
  textMuted,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  theme: any;
  textColor: string;
  textMuted: string;
}) {
  return (
    <section className="relative overflow-hidden py-40" style={{ backgroundColor: theme.surface }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }} />
      <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon pointer-events-none" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]" style={{ backgroundColor: `${theme.accent}15` }} />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-10 inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest backdrop-blur-md" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt, color: theme.accent }}>
          <div className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: theme.accent }} />
          {eyebrow}
        </div>
        <h2 className={`text-4xl font-black tracking-tight ${textColor} md:text-6xl md:leading-[1.1]`}>
          {title}
        </h2>
        <p className={`mt-8 text-xl font-medium leading-relaxed ${textMuted}`}>{description}</p>
        <div className="mt-16 flex justify-center">
          <Link
            href={ctaHref}
            className="group relative inline-flex h-16 items-center gap-4 rounded-full px-10 text-lg font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105"
            style={{ backgroundColor: theme.accent, color: "#000", boxShadow: `0 40px 80px -20px ${theme.accent}40` }}
          >
            <span>{ctaLabel}</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black transition-transform group-hover:translate-x-1">
              <MoveRight className="h-5 w-5" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── 首页主组件 ──────────────────────────────────────────────────────────

import { getTemplateTheme } from "@/templates/theme";

export function Template01HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  const theme = getTemplateTheme("template-01");
  const isDark = true;
  const textColor = "text-white";
  const textMuted = "text-stone-400";
  const cardBg = "rgba(255,255,255,0.02)";

  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.surface }}>
      {modules.map((module) => {
        const payload = module.payloadJson ?? {};

        switch (module.moduleKey) {
          case "hero":
            return (
              <HeroSection
                key={module.moduleKey}
                eyebrow={readString(payload, "eyebrow") || "Precision CNC Manufacturing"}
                title={readString(payload, "title")}
                description={readString(payload, "description")}
                primaryCtaLabel={readString(payload, "primaryCtaLabel") || "Get a Quote"}
                primaryCtaHref={readString(payload, "primaryCtaHref") || "/request-quote"}
                secondaryCtaLabel={readString(payload, "secondaryCtaLabel") || "Browse Products"}
                secondaryCtaHref={readString(payload, "secondaryCtaHref") || "/products"}
              />
            );

          case "strengths":
            return (
              <div key={module.moduleKey} className="relative z-20 -mt-24">
                <StrengthsSection items={readStringArray(payload, "items")} />
              </div>
            );

          case "trust-signals":
            return (
              <TrustedBrands
                key={module.moduleKey}
                title={readString(payload, "title") || "Trusted by Industry Leaders Worldwide"}
                brands={readStringArray(payload, "items")}
              />
            );

          case "featured-categories": {
            const featuredSlugs = readStringArray(payload, "slugs");
            const featuredCategories =
              featuredSlugs.length > 0
                ? featuredSlugs
                    .map((slug) => categories.find((c) => c.slug === slug))
                    .filter((c): c is NonNullable<typeof c> => c !== undefined)
                : categories.filter((c) => c.isFeatured);

            return (
              <section key={module.moduleKey} className="relative py-32" style={{ backgroundColor: theme.surfaceAlt }}>
                <div className="absolute inset-0 opacity-10 texture-carbon mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 right-0 h-96 w-96 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${theme.accent}15`, transform: "translate(20%, -20%)" }} />
                <div className="relative z-10 mx-auto mb-24 max-w-7xl px-6 text-center">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
                    {readString(payload, "eyebrow") || "Core Expertise"}
                  </h2>
                  <p className={`mt-6 text-4xl font-black tracking-tight ${textColor} md:text-5xl lg:text-6xl`}>
                    {readString(payload, "title") || "Industry-Leading Solutions"}
                  </p>
                  {readString(payload, "description") ? (
                    <p className={`mx-auto mt-8 max-w-3xl text-lg font-medium leading-relaxed ${textMuted}`}>
                      {readString(payload, "description")}
                    </p>
                  ) : null}
                </div>
                <div className="relative z-10">
                  <CategoryGrid items={featuredCategories} accentColor={theme.accent} badgeLabel="Categories" />
                </div>
              </section>
            );
          }

          case "factory-capability":
            return (
              <FactoryEquipment
                key={module.moduleKey}
                eyebrow={readString(payload, "eyebrow")}
                title={readString(payload, "title")}
                description={readString(payload, "description")}
                features={readStringArray(payload, "items")}
                statOneValue={readString(payload, "statOneValue")}
                statOneLabel={readString(payload, "statOneLabel")}
                statTwoValue={readString(payload, "statTwoValue")}
                statTwoLabel={readString(payload, "statTwoLabel")}
              />
            );

          case "quality-certifications":
            return (
              <QualityCertifications
                key={module.moduleKey}
                eyebrow={readString(payload, "eyebrow")}
                title={readString(payload, "title")}
                description={readString(payload, "description")}
                items={readStringArray(payload, "items")}
              />
            );

          case "featured-products": {
            const featuredSlugs = readStringArray(payload, "slugs");
            const featuredProducts =
              featuredSlugs.length > 0
                ? featuredSlugs
                    .map((slug) => products.find((p) => p.slug === slug))
                    .filter((p): p is NonNullable<typeof p> => p !== undefined)
                : products.filter((p) =>
                    categories.some((c) => c.isFeatured && c.slug === p.categorySlug),
                  );

            return (
              <section key={module.moduleKey} className="py-32 relative border-t" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <div className="mx-auto mb-24 flex max-w-7xl flex-col gap-10 px-6 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
                      {readString(payload, "eyebrow") || "Featured Portfolio"}
                    </h2>
                    <p className={`mt-6 text-4xl font-black leading-tight tracking-tight ${textColor} md:text-5xl lg:text-6xl`}>
                      {readString(payload, "title") || "Precision Parts & Custom Components"}
                    </p>
                  </div>
                  <Link
                    href={readString(payload, "ctaHref") || "/products"}
                    className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-widest transition-all hover:opacity-80"
                    style={{ color: theme.accent }}
                  >
                    {readString(payload, "ctaLabel") || "View All Products"}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors shadow-xl group-hover:scale-105" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
                      <MoveRight className="h-5 w-5" />
                    </div>
                  </Link>
                </div>
                <div className="mx-auto max-w-7xl px-6">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredProducts.map((product) => (
                      <ProductCard
                        key={product.slug}
                        categorySlug={product.categorySlug}
                        slug={product.slug}
                        nameEn={product.nameEn}
                        shortDescriptionEn={product.shortDescriptionEn ?? ""}
                        imageUrl={product.coverImageUrl}
                        imageAlt={product.coverImageAlt}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          case "process-steps":
            return (
              <ProcessSteps
                key={module.moduleKey}
                eyebrow={readString(payload, "eyebrow")}
                title={readString(payload, "title")}
                items={readStringArray(payload, "items")}
              />
            );

          case "latest-insights":
            return (
              <LatestInsights
                key={module.moduleKey}
                eyebrow={readString(payload, "eyebrow")}
                title={readString(payload, "title")}
                posts={blogPosts.slice(0, 3).map((p) => ({
                  slug: p.slug,
                  titleEn: p.titleEn,
                  excerptEn: p.excerptEn ?? "",
                  coverImageUrl: p.coverImageUrl,
                  categorySlug: p.categorySlug,
                  publishedAt: p.publishedAt ?? undefined,
                }))}
              />
            );

          case "final-cta":
            return (
              <FinalCtaSection
                key={module.moduleKey}
                theme={theme}
                textColor={textColor}
                textMuted={textMuted}
                eyebrow={readString(payload, "eyebrow") || "Available for New Projects"}
                title={readString(payload, "title") || "Ready to manufacture with precision?"}
                description={
                  readString(payload, "description") ||
                  "Upload your 3D models or 2D drawings today for an instant professional quote and DFM analysis."
                }
                ctaLabel={readString(payload, "primaryCtaLabel") || "Start Your Quote"}
                ctaHref={readString(payload, "primaryCtaHref") || "/request-quote"}
              />
            );

          default:
            return null;
        }
      })}
    </main>
  );
}

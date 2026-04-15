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
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[150px] mix-blend-screen" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/80 backdrop-blur-md">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          {eyebrow}
        </div>
        <h2 className="text-4xl font-extrabold tracking-tighter text-white md:text-6xl md:leading-tight">
          {title}
        </h2>
        <p className="mt-6 text-xl font-medium text-stone-400/90">{description}</p>
        <div className="mt-12 flex justify-center">
          <Link
            href={ctaHref}
            className="group relative inline-flex h-16 items-center gap-3 rounded-full bg-white px-10 text-lg font-bold text-[#0a0a0a] shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all hover:scale-105 hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <span>{ctaLabel}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a0a0a] text-white transition-transform group-hover:translate-x-1">
              <MoveRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── 首页主组件 ──────────────────────────────────────────────────────────

export function Template01HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  return (
    <main className="min-h-screen bg-white">
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
              <section key={module.moduleKey} className="relative bg-white py-24">
                <div className="absolute left-0 right-0 top-0 h-64 bg-gradient-to-b from-stone-50 to-white" />
                <div className="relative z-10 mx-auto mb-20 max-w-7xl px-6 text-center">
                  <h2 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600 drop-shadow-sm">
                    {readString(payload, "eyebrow") || "Core Expertise"}
                  </h2>
                  <p className="mt-6 text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">
                    {readString(payload, "title") || "Industry-Leading Solutions"}
                  </p>
                  {readString(payload, "description") ? (
                    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-stone-500">
                      {readString(payload, "description")}
                    </p>
                  ) : null}
                </div>
                <div className="relative z-10">
                  <CategoryGrid items={featuredCategories} />
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
              <section key={module.moduleKey} className="bg-stone-50 py-32">
                <div className="mx-auto mb-20 flex max-w-7xl flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600">
                      {readString(payload, "eyebrow") || "Featured Portfolio"}
                    </h2>
                    <p className="mt-4 text-4xl font-bold leading-tight tracking-tight text-stone-900">
                      {readString(payload, "title") || "Precision Parts & Custom Components"}
                    </p>
                  </div>
                  <Link
                    href={readString(payload, "ctaHref") || "/products"}
                    className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-stone-900"
                  >
                    {readString(payload, "ctaLabel") || "View All Products"}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white transition-colors group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
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

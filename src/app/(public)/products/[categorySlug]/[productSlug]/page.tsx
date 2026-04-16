import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { FileDown, ChevronRight } from "lucide-react";

import { InquiryForm } from "@/components/public/inquiry-form";
import { JsonLdScript } from "@/components/public/json-ld-script";
import { ProductFaq } from "@/components/public/product-faq";
import { ProductCard } from "@/components/public/product-card";
import { SpecTable } from "@/components/public/spec-table";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById, getTemplateTheme } from "@/templates";
import {
  buildVisibleSpecRows,
  getProductDetailBySlugs,
} from "@/features/products/queries";
import {
  buildProductViewSessionId,
  recordProductView,
} from "@/features/products/views";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildProductJsonLd,
} from "@/lib/json-ld";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";

type ProductDetailPageProps = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const { categorySlug, productSlug } = await params;
  const product = await getProductDetailBySlugs(
    categorySlug,
    productSlug,
    currentSite.seedPackKey,
    siteId,
  );

  if (!product) {
    return buildPageMetadata({
      title: "Product Not Found",
      description: "The requested product page could not be found.",
      path: `/products/${categorySlug}/${productSlug}`,
    });
  }

  return buildPageMetadata({
    title: product.product.nameEn,
    description: product.shortDescriptionEn ?? product.product.nameEn,
    path: `/products/${categorySlug}/${productSlug}`,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const { categorySlug, productSlug } = await params;
  const product = await getProductDetailBySlugs(
    categorySlug,
    productSlug,
    currentSite.seedPackKey,
    siteId,
  );
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);

  if (!product) {
    notFound();
  }

  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";

  const requestHeaders = await headers();
  const fingerprint = [
    requestHeaders.get("user-agent") ?? "unknown-agent",
    requestHeaders.get("accept-language") ?? "unknown-language",
    requestHeaders.get("x-forwarded-for") ?? "unknown-ip",
  ].join("|");
  const requestCountryCode =
    requestHeaders.get("x-vercel-ip-country") ??
    requestHeaders.get("cf-ipcountry");

  if (product.product.id) {
    await recordProductView({
      productId: product.product.id,
      sessionId: buildProductViewSessionId(fingerprint),
      referer: requestHeaders.get("referer"),
      countryCode: requestCountryCode,
    });
  }

  const rows = buildVisibleSpecRows({
    defaultFields: product.defaultFields,
    customFields: product.customFields,
  });
  const productUrl = buildAbsoluteUrl(`/products/${categorySlug}/${productSlug}`);

  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.surface }}>
      <JsonLdScript
        value={buildProductJsonLd({
          name: product.product.nameEn,
          description: product.shortDescriptionEn ?? product.product.nameEn,
          category: categorySlug.replace(/-/g, " "),
          url: productUrl,
          specs: rows,
          faqs: product.faqs,
        })}
      />
      <JsonLdScript
        value={buildBreadcrumbJsonLd([
          { name: "Home", url: buildAbsoluteUrl("/") },
          { name: theme.productDetail.breadcrumbCatalogLabel, url: buildAbsoluteUrl("/products") },
          { name: categorySlug.replace(/-/g, " "), url: buildAbsoluteUrl(`/products/${categorySlug}`) },
          { name: product.product.nameEn, url: productUrl },
        ])}
      />
      <JsonLdScript value={buildFaqJsonLd(product.faqs)} />

      <div className="border-b py-5" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link href="/products" className="transition-opacity hover:opacity-80" style={{ color: theme.accent }}>
              {theme.productDetail.breadcrumbCatalogLabel}
            </Link>
            <ChevronRight className={`h-3 w-3 ${isDark ? "text-white/20" : "text-stone-300"}`} />
            <Link href={`/products/${categorySlug}`} className="capitalize transition-opacity hover:opacity-80" style={{ color: theme.accent }}>
              {categorySlug.replace(/-/g, " ")}
            </Link>
            <ChevronRight className={`h-3 w-3 ${isDark ? "text-white/20" : "text-stone-300"}`} />
            <span className={textColor}>{product.product.nameEn}</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-20">
          <div className="space-y-20">
            <header>
              <p className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: theme.accent }}>
                {theme.categoryTitle}
              </p>
              <h1 className={`mt-6 text-4xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl ${textColor}`}>
                {product.product.nameEn}
              </h1>
              <p className={`mt-8 max-w-3xl text-lg leading-relaxed font-medium ${textMuted}`}>
                {product.shortDescriptionEn}
              </p>
            </header>

            <div className="space-y-8">
              {product.coverImage && (
                <div className="group overflow-hidden rounded-[2.5rem] border shadow-2xl transition-all duration-700" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                  <div className="relative aspect-[16/9] sm:aspect-[21/9]">
                    <Image
                      alt={product.coverImage.alt}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                      priority
                      src={product.coverImage.url}
                      fill
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] pointer-events-none" />
                  </div>
                </div>
              )}

              {product.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {product.galleryImages.map((image) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-[2rem] border shadow-xl" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                      <Image
                        alt={image.alt}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        width={700}
                        height={525}
                        src={image.url}
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-16">
              <SpecTable
                accentColor={theme.accent}
                rows={rows}
                title={theme.productDetail.datasheetTitle}
              />

              {product.showDownloadButton && product.pdfUrl && (
                <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-transform hover:scale-[1.01]" style={{ backgroundColor: theme.surfaceAlt === "#ffffff" ? theme.surface : theme.surfaceAlt }}>
                  <div className="absolute inset-0 opacity-10 texture-carbon pointer-events-none" />
                  <div className="relative z-10 mb-6 sm:mb-0">
                    <h3 className="text-2xl font-black text-white">
                      {theme.productDetail.datasheetTitle}
                    </h3>
                    <p className="mt-2 text-base font-medium text-white/60">
                      {theme.productDetail.datasheetDescription}
                    </p>
                  </div>
                  <Link href={product.pdfUrl} className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-xl transition-all group-hover:scale-110" style={{ backgroundColor: theme.accent }}>
                    <FileDown className="h-7 w-7" />
                  </Link>
                </div>
              )}

              <div className="pt-12">
                <ProductFaq
                   accentColor={theme.accent}
                   items={product.faqs}
                   title={`${theme.productDetail.breadcrumbCatalogLabel} FAQ`}
                />
              </div>
            </div>
          </div>

          <aside className="relative">
            <div className="sticky top-24 space-y-16">
              <div className="sticky top-24 space-y-12">
              <div className="relative overflow-hidden rounded-[2.5rem] border p-1 shadow-2xl transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(249,115,22,0.15)]" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
                <div className="absolute inset-0 opacity-30 mix-blend-overlay texture-carbon pointer-events-none" />
                <div className="relative z-10 backdrop-blur-3xl rounded-[2.5rem]">
                  <InquiryForm
                    accentColor={theme.accent}
                    copy={{
                      eyebrow: theme.forms.inquiryEyebrow,
                      title: theme.forms.inquiryTitle,
                      successTitle: theme.forms.successTitle,
                      successMessage: theme.forms.successMessage,
                      securityNote: theme.forms.securityNote,
                      uploadHint: theme.forms.uploadHint,
                      trustBadgeTitle: theme.forms.trustBadgeTitle,
                      trustBadgeDescription: theme.forms.trustBadgeDescription,
                    }}
                    defaultProductName={product.product.nameEn}
                    productId={product.product.id}
                    sourcePage="product-detail"
                    sourceUrl={`/products/${categorySlug}/${productSlug}`}
                  />
                </div>
              </div>

              {product.relatedProducts.length > 0 && (
                <section className="px-4">
                  <h2 className={`mb-10 text-[10px] font-black uppercase tracking-[0.4em] ${textMuted}`}>
                    {theme.productDetail.relatedTitle}
                  </h2>
                  <div className="space-y-5">
                    {product.relatedProducts.slice(0, 4).map((related) => (
                      <Link
                        key={related.id}
                        href={`/products/${related.categorySlug || categorySlug}/${related.slug}`}
                        className={`group flex items-center gap-5 rounded-[2rem] border p-4 transition-all ${isDark ? "hover:bg-white/5" : "hover:bg-stone-50"}`}
                        style={{ borderColor: theme.border }}
                      >
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f4" }} />
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-black transition-colors group-hover:opacity-80 ${textColor}`}>{related.nameEn}</p>
                          <p className={`mt-1 text-[10px] font-black uppercase tracking-widest ${textMuted}`}>
                            {theme.productDetail.compareLabel}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

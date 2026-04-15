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
import { getActiveTemplate, getTemplateTheme } from "@/templates";
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
  const { categorySlug, productSlug } = await params;
  const product = await getProductDetailBySlugs(categorySlug, productSlug);

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
  const { categorySlug, productSlug } = await params;
  const product = await getProductDetailBySlugs(categorySlug, productSlug);
  const template = getActiveTemplate();
  const theme = getTemplateTheme(template.id);

  if (!product) {
    notFound();
  }

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
    <main className="min-h-screen bg-white">
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

      <div className="border-b py-4" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400">
            <Link href="/products" className="transition-colors hover:opacity-80" style={{ color: theme.accent }}>Catalog</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/products/${categorySlug}`} className="capitalize transition-colors hover:opacity-80" style={{ color: theme.accent }}>{categorySlug.replace(/-/g, " ")}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-stone-900">{product.product.nameEn}</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <aside className="relative order-first lg:order-last">
            <div className="sticky top-24 space-y-12">
              <div className="rounded-[2.5rem] border p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
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

              {product.relatedProducts.length > 0 && (
                <section>
                  <h2 className="mb-8 px-4 text-xs font-black uppercase tracking-[0.3em] text-stone-400">
                    {theme.productDetail.relatedTitle}
                  </h2>
                  <div className="space-y-4">
                    {product.relatedProducts.slice(0, 3).map((related) => (
                      <Link
                        key={related.id}
                        href={`/products/${related.categorySlug || categorySlug}/${related.slug}`}
                        className="group flex items-center gap-4 rounded-3xl border border-transparent p-4 transition-all hover:bg-stone-50"
                      >
                        <div className="h-16 w-16 flex-shrink-0 rounded-2xl bg-stone-100" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-stone-900 transition-colors group-hover:opacity-80">{related.nameEn}</p>
                          <p className="text-xs font-medium text-stone-400">
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

          <div className="space-y-16">
            <header>
              <p className="text-sm font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>{theme.categoryTitle}</p>
              <h1 className="mt-4 text-4xl font-black leading-[1.1] tracking-tight text-stone-900 md:text-5xl lg:text-6xl">{product.product.nameEn}</h1>
              <p className="mt-8 max-w-3xl text-lg leading-relaxed text-stone-500 md:text-xl">{product.shortDescriptionEn}</p>
            </header>

            <div className="space-y-6">
              {product.coverImage && (
                <div className="group overflow-hidden rounded-[3rem] bg-stone-100">
                  <Image alt={product.coverImage.alt} className="w-full object-cover transition-transform duration-700 group-hover:scale-105" priority src={product.coverImage.url} width={1200} height={800} />
                </div>
              )}

              {product.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {product.galleryImages.map((image) => (
                    <div key={image.id} className="group overflow-hidden rounded-[2rem] bg-stone-50">
                      <Image alt={image.alt} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" width={600} height={450} src={image.url} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-12">
              <SpecTable
                accentColor={theme.accent}
                rows={rows}
                title={theme.productDetail.datasheetTitle}
              />

              {product.showDownloadButton && product.pdfUrl && (
                <div className="group relative flex items-center justify-between overflow-hidden rounded-[2.5rem] p-6 shadow-2xl md:p-10" style={{ backgroundColor: theme.surface, color: "white" }}>
                  <div className="absolute inset-0 opacity-10 texture-carbon" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white">
                      {theme.productDetail.datasheetTitle}
                    </h3>
                    <p className="mt-2 text-sm text-white/70">
                      {theme.productDetail.datasheetDescription}
                    </p>
                  </div>
                  <Link href={product.pdfUrl} aria-label="Download PDF" title="Download PDF" className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full text-white transition-all group-hover:scale-110" style={{ backgroundColor: theme.accent }}>
                    <FileDown className="h-6 w-6" />
                  </Link>
                </div>
              )}
            </div>

            <ProductFaq
              accentColor={theme.accent}
              items={product.faqs}
              title={`${theme.productDetail.breadcrumbCatalogLabel} FAQ`}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

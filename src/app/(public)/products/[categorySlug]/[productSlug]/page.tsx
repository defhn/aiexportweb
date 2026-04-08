import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { FileDown, ChevronRight } from "lucide-react";

import { InquiryForm } from "@/components/public/inquiry-form";
import { JsonLdScript } from "@/components/public/json-ld-script";
import { ProductFaq } from "@/components/public/product-faq";
import { ProductCard } from "@/components/public/product-card";
import { SpecTable } from "@/components/public/spec-table";
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
          { name: "Products", url: buildAbsoluteUrl("/products") },
          {
            name: categorySlug.replace(/-/g, " "),
            url: buildAbsoluteUrl(`/products/${categorySlug}`),
          },
          { name: product.product.nameEn, url: productUrl },
        ])}
      />
      <JsonLdScript value={buildFaqJsonLd(product.faqs)} />

      {/* Breadcrumb Header */}
      <div className="bg-stone-50 border-b border-stone-100 py-4">
          <div className="mx-auto max-w-7xl px-6">
              <nav className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400">
                  <Link href="/products" className="hover:text-blue-600 transition-colors">Catalog</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link href={`/products/${categorySlug}`} className="hover:text-blue-600 transition-colors capitalize">{categorySlug.replace(/-/g, " ")}</Link>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-stone-900">{product.product.nameEn}</span>
              </nav>
          </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_400px]">
          {/* Main Content: Showcase */}
          <div className="space-y-16">
            <header>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.1]">
                {product.product.nameEn}
              </h1>
              <p className="mt-8 text-lg md:text-xl text-stone-500 max-w-3xl leading-relaxed">
                {product.shortDescriptionEn}
              </p>
            </header>

            {/* Media Gallery */}
            <div className="space-y-6">
                {product.coverImage && (
                    <div className="overflow-hidden rounded-[3rem] bg-stone-100 group">
                        <img
                            alt={product.coverImage.alt}
                            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="eager"
                            src={product.coverImage.url}
                        />
                    </div>
                )}

                {product.galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-6">
                        {product.galleryImages.map((image) => (
                            <div key={image.id} className="overflow-hidden rounded-[2rem] bg-stone-50 group">
                                <img
                                    alt={image.alt}
                                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    src={image.url}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Technical Hub */}
            <div className="space-y-12">
                <SpecTable rows={rows} />
                
                {product.showDownloadButton && product.pdfUrl && (
                    <div className="flex items-center justify-between p-10 bg-stone-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white">Technical Datasheet</h3>
                            <p className="mt-2 text-stone-400 text-sm">Download the full engineering specs in PDF format.</p>
                        </div>
                        <Link
                            href={product.pdfUrl}
                            aria-label="Download PDF"
                            title="Download PDF"
                            className="relative z-10 flex items-center justify-center h-14 w-14 rounded-full bg-blue-600 text-white transition-all group-hover:bg-blue-500 group-hover:scale-110"
                        >
                            <FileDown className="h-6 w-6" />
                        </Link>
                    </div>
                )}
            </div>

            <ProductFaq items={product.faqs} />
          </div>

          {/* Sticky Sidebar: Inquiry */}
          <aside className="relative">
            <div className="sticky top-24 space-y-12">
              <div className="p-1 border border-stone-100 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem]">
                  <InquiryForm
                      defaultProductName={product.product.nameEn}
                      productId={product.product.id}
                      sourcePage="product-detail"
                      sourceUrl={`/products/${categorySlug}/${productSlug}`}
                  />
              </div>

              {/* Related Products: Compact Style */}
              {product.relatedProducts.length > 0 && (
                  <section>
                      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400 mb-8 px-4">Compare Similar</h2>
                      <div className="space-y-4">
                          {product.relatedProducts.slice(0, 3).map((related) => (
                              <Link 
                                key={related.id}
                                href={`/products/${related.categorySlug || categorySlug}/${related.slug}`}
                                className="flex items-center gap-4 p-4 rounded-3xl border border-transparent hover:border-stone-100 hover:bg-stone-50 transition-all group"
                              >
                                  <div className="h-16 w-16 rounded-2xl bg-stone-100 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-stone-900 truncate group-hover:text-blue-600 transition-colors">{related.nameEn}</p>
                                      <p className="text-xs text-stone-400 font-medium">Precision Component</p>
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

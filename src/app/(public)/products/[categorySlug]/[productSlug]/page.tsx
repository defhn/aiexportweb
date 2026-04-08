import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

  const rows = buildVisibleSpecRows({
    defaultFields: product.defaultFields,
    customFields: product.customFields,
  });
  const productUrl = buildAbsoluteUrl(`/products/${categorySlug}/${productSlug}`);

  return (
    <>
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

      <section className="mx-auto max-w-6xl space-y-10 px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
                {categorySlug.replace(/-/g, " ")}
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950">
                {product.product.nameEn}
              </h1>
              <p className="mt-4 max-w-2xl text-slate-600">
                {product.shortDescriptionEn}
              </p>
            </div>

            <SpecTable rows={rows} />

            {product.showDownloadButton ? (
              <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-950">
                  Download
                </h2>
                <Link
                  className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
                  href={product.pdfUrl ?? "#"}
                >
                  Download PDF
                </Link>
              </section>
            ) : null}

            <ProductFaq items={product.faqs} />
          </div>

          <aside className="space-y-6">
            <InquiryForm
              defaultProductName={product.product.nameEn}
              sourcePage="product-detail"
              sourceUrl={`/products/${categorySlug}/${productSlug}`}
            />

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-950">
                Related Products
              </h2>
              {product.relatedProducts.map((related) => (
                <ProductCard
                  key={related.slug ?? String(related.id)}
                  categorySlug={related.categorySlug ?? categorySlug}
                  nameEn={related.nameEn}
                  shortDescriptionEn="Related item from the same demo industry pack."
                  slug={related.slug ?? productSlug}
                />
              ))}
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}

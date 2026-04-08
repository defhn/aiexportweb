import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductFaq } from "@/components/public/product-faq";
import { ProductCard } from "@/components/public/product-card";
import { SpecTable } from "@/components/public/spec-table";
import {
  buildVisibleSpecRows,
  getProductDetailBySlugs,
} from "@/features/products/queries";

type ProductDetailPageProps = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};

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

  return (
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
              <h2 className="text-2xl font-semibold text-slate-950">Download</h2>
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
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Send Inquiry</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Include this product in your inquiry and send drawings or target
              specs for faster quotation.
            </p>
            <Link
              className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
              href="/contact"
            >
              Contact Sales
            </Link>
          </section>

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
  );
}

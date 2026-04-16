import Link from "next/link";

import { ProductCard } from "@/components/public/product-card";
import { getProductsByCategorySlug } from "@/features/products/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById, getTemplateTheme } from "@/templates";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const { categorySlug } = await params;
  const products = await getProductsByCategorySlug(categorySlug, currentSite.seedPackKey, siteId);
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);
  const categoryName = products[0]?.categorySlug.replace(/-/g, " ") || categorySlug.replace(/-/g, " ");

  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";

  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.surface }}>
      <section className="relative overflow-hidden border-b py-24" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
        <div className="absolute inset-0 opacity-20 texture-carbon" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="mb-6 text-xs font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
            {theme.categoryTitle}
          </p>
          <h1 className={`text-4xl font-bold tracking-tight md:text-5xl capitalize ${textColor}`}>{categoryName}</h1>
          <p className={`mx-auto mt-8 max-w-3xl text-lg leading-relaxed ${textMuted}`}>{theme.categoryDescription}</p>
          <div className="mt-10 flex justify-center gap-3">
            <Link href="/products" className={`rounded-full border px-5 py-3 text-sm font-bold ${textColor} transition-opacity hover:opacity-80`} style={{ borderColor: theme.border }}>
              All Products
            </Link>
            <Link href="/contact" className="rounded-full px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-80" style={{ backgroundColor: theme.accent }}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                categorySlug={product.categorySlug}
                nameEn={product.nameEn}
                shortDescriptionEn={product.shortDescriptionEn}
                slug={product.slug}
                imageUrl={product.coverImageUrl}
                imageAlt={product.coverImageAlt}
                accentColor={theme.accent}
                linkLabel="View Details"
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="py-20 text-center">
              <p className={textMuted}>No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-6 mb-12 overflow-hidden rounded-[3.5rem] py-20 relative" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : theme.surface }}>
        <div className="absolute inset-0 opacity-10 texture-carbon" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center text-white">
          <h2 className="text-2xl font-bold">{theme.detailSupportTitle}</h2>
          <p className="mt-4 text-sm text-white/70">{theme.detailSupportDescription}</p>
        </div>
      </section>
    </main>
  );
}

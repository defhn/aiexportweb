import Link from "next/link";

import { CategoryGrid } from "@/components/public/category-grid";
import { ProductCard } from "@/components/public/product-card";
import { getAllCategories, getAllProducts } from "@/features/products/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById, getTemplateTheme } from "@/templates";

export default async function ProductsPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const [categories, products] = await Promise.all([
    getAllCategories(currentSite.seedPackKey, siteId),
    getAllProducts(currentSite.seedPackKey, siteId),
  ]);
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);

  // Simple heuristic for dark mode
  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";

  return (
    <main className="min-h-screen" style={{ backgroundColor: theme.surface }}>
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 opacity-20 texture-carbon" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${theme.accentSoft}, transparent)` }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.4em]" style={{ color: isDark ? "rgba(255,255,255,0.7)" : theme.accent }}>{theme.heroTag}</p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">{theme.catalogTitle}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">{theme.catalogDescription}</p>
          <div className="mx-auto mt-10 h-1 w-20 rounded-full" style={{ backgroundColor: theme.accent }} />
        </div>
      </section>

      <section className="border-b py-8" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white" style={{ backgroundColor: theme.accent }}>
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition-colors hover:opacity-80"
                style={{ borderColor: theme.border, color: textColor === "text-white" ? "rgba(255,255,255,0.8)" : "#475569" }}
              >
                {category.nameEn}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#fafaf9" }}>
        <CategoryGrid
          accentColor={theme.accent}
          badgeLabel={theme.categoryTitle}
          fallbackImage={theme.capabilities.highlights[0]?.image}
          items={categories}
          linkLabel="Explore Collection"
        />
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
                Portfolio
              </p>
              <h2 className={`mt-4 text-4xl font-bold tracking-tight ${textColor}`}>
                {theme.catalogTitle}
              </h2>
            </div>
            <p className={`max-w-xl text-sm leading-7 ${textMuted}`}>
              {theme.catalogDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                categorySlug={product.categorySlug}
                slug={product.slug}
                nameEn={product.nameEn}
                shortDescriptionEn={product.shortDescriptionEn}
                imageUrl={product.coverImageUrl}
                imageAlt={product.coverImageAlt}
                accentColor={theme.accent}
                linkLabel="View Details"
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="py-20 text-center">
              <p className={textMuted}>No products are available yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t py-20" style={{ borderColor: theme.border }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className={`${textMuted} italic`}>
            {theme.detailSupportDescription}
          </p>
        </div>
      </section>
    </main>
  );
}

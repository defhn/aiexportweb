import { CategoryGrid } from "@/components/public/category-grid";
import { ProductCard } from "@/components/public/product-card";
import { getAllCategories, getAllProducts } from "@/features/products/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById, getTemplateTheme } from "@/templates";
import Link from "next/link";

export default async function ProductsPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const [categories, products] = await Promise.all([
    getAllCategories(currentSite.seedPackKey, siteId),
    getAllProducts(currentSite.seedPackKey, siteId),
  ]);
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden py-32" style={{ backgroundColor: theme.surface }}>
        <div className="absolute inset-0 opacity-20 texture-carbon" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${theme.accentSoft}, transparent)` }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-6 text-sm font-black uppercase tracking-[0.4em] text-white/70">{theme.heroTag}</h1>
          <p className="mb-8 text-4xl font-bold tracking-tight text-white md:text-5xl">{theme.catalogTitle}</p>
          <p className="mx-auto max-w-2xl text-lg leading-8 text-white/70">{theme.catalogDescription}</p>
          <div className="mx-auto mt-10 h-1 w-20 rounded-full" style={{ backgroundColor: theme.accent }} />
        </div>
      </section>

      <section className="border-b bg-white py-8" style={{ borderColor: theme.border }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white" style={{ backgroundColor: theme.surface }}>
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition-colors"
                style={{ borderColor: theme.border, color: "#475569" }}
              >
                {category.nameEn}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-24">
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
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
                All Products
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">
                {theme.catalogTitle}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-stone-500">
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
              <p className="text-stone-400">No products are available yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t py-20" style={{ borderColor: theme.border }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-stone-500 italic">
            {theme.detailSupportDescription}
          </p>
        </div>
      </section>
    </main>
  );
}

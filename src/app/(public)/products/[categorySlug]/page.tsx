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
      <section className="relative overflow-hidden border-b py-32 md:py-40" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${theme.accent}15`, transform: "translate(20%, -20%)" }} />
        <div className="relative mx-auto max-w-5xl px-6 text-center z-10">
          <p className="mb-6 text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
            {theme.categoryTitle}
          </p>
          <h1 className={`text-5xl font-black tracking-tight md:text-7xl capitalize ${textColor}`}>{categoryName}</h1>
          <p className={`mx-auto mt-8 max-w-3xl text-xl font-medium leading-relaxed ${textMuted}`}>{theme.categoryDescription}</p>
          <div className="mt-12 flex justify-center gap-4">
            <Link href="/products" className={`rounded-xl border px-8 py-4 text-xs font-black uppercase tracking-widest ${textColor} transition-all hover:bg-white/5 hover:scale-105`} style={{ borderColor: theme.border }}>
              All Products
            </Link>
            <Link href="/contact" className="rounded-xl px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-105 shadow-xl" style={{ backgroundColor: theme.accent }}>
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

      <section className="mx-6 mb-16 mt-8 overflow-hidden rounded-[4rem] py-24 relative shadow-2xl ring-1 ring-white/10" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.03)" : theme.surfaceAlt }}>
        <div className="absolute inset-0 opacity-20 texture-carbon mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-white">
          <h2 className={`text-3xl lg:text-4xl font-black ${textColor}`}>{theme.detailSupportTitle}</h2>
          <p className={`mt-6 text-lg font-medium leading-relaxed ${textMuted}`}>{theme.detailSupportDescription}</p>
        </div>
      </section>
    </main>
  );
}

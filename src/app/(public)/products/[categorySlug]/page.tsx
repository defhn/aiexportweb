import { ProductCard } from "@/components/public/product-card";
import { getProductsByCategorySlug } from "@/features/products/queries";
import { getActiveTemplate, getTemplateTheme } from "@/templates";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const products = await getProductsByCategorySlug(categorySlug);
  const template = getActiveTemplate();
  const theme = getTemplateTheme(template.id);
  const categoryName = products[0]?.categorySlug.replace(/-/g, " ") || categorySlug.replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-white">
      <section className="py-24 border-b" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 text-xs font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
            {theme.categoryTitle}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 md:text-5xl capitalize">{categoryName}</h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-stone-500">{theme.categoryDescription}</p>
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
              <p className="text-stone-400">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mx-6 mb-12 overflow-hidden rounded-[3.5rem] py-20 relative" style={{ backgroundColor: theme.surface }}>
        <div className="absolute inset-0 opacity-10 texture-carbon" />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center text-white">
          <h2 className="text-2xl font-bold">{theme.detailSupportTitle}</h2>
          <p className="mt-4 text-sm text-white/70">{theme.detailSupportDescription}</p>
        </div>
      </section>
    </main>
  );
}

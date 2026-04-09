import { ProductCard } from "@/components/public/product-card";
import { getProductsByCategorySlug } from "@/features/products/queries";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const products = await getProductsByCategorySlug(categorySlug);
  const categoryName = products[0]?.categorySlug.replace(/-/g, " ") || categorySlug.replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-white">
      {/* Category Header */}
      <section className="bg-stone-50 py-24 border-b border-stone-200">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-6">
            Category Collection
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 capitalize">
            {categoryName}
          </h1>
          <p className="mt-8 text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Discover our comprehensive range of high-precision components and custom manufacturing solutions tailored for industrial excellence.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                categorySlug={product.categorySlug}
                nameEn={product.nameEn}
                shortDescriptionEn={product.shortDescriptionEn}
                slug={product.slug}
                imageUrl={product.coverImageUrl}
                imageAlt={product.coverImageAlt}
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

      {/* Support Box */}
      <section className="py-20 bg-stone-900 mx-6 mb-12 rounded-[3.5rem] overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 texture-carbon" />
          <div className="relative z-10 max-w-2xl mx-auto px-6 text-center text-white">
              <h2 className="text-2xl font-bold">Need a Custom Quote?</h2>
              <p className="mt-4 text-stone-400 text-sm">Send us your technical specifications and our team will get back to you with a detailed manufacturing feasibility report within 24 hours.</p>
          </div>
      </section>
    </main>
  );
}

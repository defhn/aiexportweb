import { CategoryGrid } from "@/components/public/category-grid";
import { ProductCard } from "@/components/public/product-card";
import { getAllCategories, getAllProducts } from "@/features/products/queries";
import Link from "next/link";

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getAllCategories(), getAllProducts()]);

  return (
    <main className="min-h-screen bg-white">
      {/* Sub-Hero Header */}
      <section className="relative bg-stone-900 py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 texture-carbon" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-400 mb-6">Product Catalog</h1>
            <p className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8">
              Explore Our Manufacturing Capabilities
            </p>
            <div className="mx-auto h-1 w-20 bg-blue-600 rounded-full" />
        </div>
      </section>

      <section className="border-b border-stone-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-stone-900 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white"
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/products/${category.slug}`}
                className="rounded-full border border-stone-200 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-stone-600 transition-colors hover:border-blue-200 hover:text-blue-600"
              >
                {category.nameEn}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-stone-50">
        <CategoryGrid items={categories} />
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.4em] text-blue-600">
                All Products
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">
                Browse Our CNC Product Portfolio
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-stone-500">
              Explore the full catalog directly from one page, then drill down into a category
              when you want to compare similar parts and capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                categorySlug={product.categorySlug}
                slug={product.slug}
                nameEn={product.nameEn}
                shortDescriptionEn={product.shortDescriptionEn}
                imageUrl={product.coverImageUrl}
                imageAlt={product.coverImageAlt}
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

      {/* Low-Level CTA */}
      <section className="py-20 border-t border-stone-100">
          <div className="mx-auto max-w-3xl px-6 text-center">
              <p className="text-stone-500 italic">
                Cannot find the specific part you are looking for? 
                Our engineers are ready to assist with custom project feasibility analysis.
              </p>
          </div>
      </section>
    </main>
  );
}

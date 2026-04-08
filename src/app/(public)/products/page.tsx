import { CategoryGrid } from "@/components/public/category-grid";
import { getAllCategories } from "@/features/products/queries";

export default async function ProductsPage() {
  const categories = await getAllCategories();

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Products
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">
          Explore our manufacturing categories
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Browse category-first product pages designed for SEO, inquiry
          generation, and export buyer trust-building.
        </p>
      </div>
      <CategoryGrid items={categories} />
    </section>
  );
}

import { ProductCard } from "@/components/public/product-card";
import { getProductsByCategorySlug } from "@/features/products/queries";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const products = await getProductsByCategorySlug(categorySlug);

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Category
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">
          {products[0]?.categorySlug.replace(/-/g, " ") ?? "Products"}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Category pages help buyers scan options faster and improve internal
          linking for SEO.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            categorySlug={product.categorySlug}
            nameEn={product.nameEn}
            shortDescriptionEn={product.shortDescriptionEn}
            slug={product.slug}
          />
        ))}
      </div>
    </section>
  );
}

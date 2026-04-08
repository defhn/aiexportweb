import { getAllCategories } from "@/features/products/queries";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">产品分类</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          当前先用演示数据展示分类结构，后续这里会接新增、排序、显隐和封面图管理。
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <article
            key={category.slug}
            className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              slug
            </p>
            <p className="mt-2 text-sm font-medium text-stone-700">
              {category.slug}
            </p>
            <h3 className="mt-4 text-xl font-semibold text-stone-950">
              {category.nameZh}
            </h3>
            <p className="mt-2 text-sm text-stone-600">{category.nameEn}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

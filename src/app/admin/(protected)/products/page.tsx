import Link from "next/link";

import { getAllProducts } from "@/features/products/queries";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950">产品管理</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            这里会逐步承接基础字段、自定义参数、PDF 下载开关和产品显隐状态。
          </p>
        </div>
        <Link
          className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
          href="/admin/products/new"
        >
          新增产品
        </Link>
      </section>

      <div className="space-y-4">
        {products.map((product, index) => (
          <article
            key={product.slug}
            className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-950">
                  {product.nameZh}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{product.nameEn}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500">
                  {product.slug}
                </p>
              </div>
              <Link
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                href={`/admin/products/${index + 1}`}
              >
                编辑
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

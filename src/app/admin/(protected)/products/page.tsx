import Link from "next/link";
import { ArrowUpRight, Filter, Package, Plus, Search, Trash2 } from "lucide-react";

import { deleteProduct } from "@/features/products/actions";
import { listAdminCategories, listAdminProducts } from "@/features/products/queries";

type AdminProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    status?: string;
  }>;
};

function formatStatus(status: "draft" | "published") {
  return status === "published" ? "已发布" : "草稿";
}

function formatDate(value?: string | null) {
  if (!value) {
    return "--";
  }

  return value.slice(0, 10);
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = (await searchParams) ?? {};
  const [categories, products] = await Promise.all([
    listAdminCategories(),
    listAdminProducts("cnc", {
      query: params.q,
      categorySlug: params.category,
      status:
        params.status === "draft" || params.status === "published" ? params.status : "",
    }),
  ]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.4em] text-stone-400">
            Inventory Management
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900">产品管理</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
            在这里搜索、筛选、编辑和删除产品，也可以查看封面图、状态和最后更新时间。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/import"
            className="h-12 rounded-full border border-stone-200 bg-white px-6 text-xs font-black uppercase tracking-widest text-stone-600 transition-colors hover:bg-stone-50"
          >
            批量导入
          </Link>
          <Link
            href="/admin/products/new"
            className="flex h-12 items-center gap-2 rounded-full bg-blue-600 px-8 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            新增产品
          </Link>
        </div>
      </header>

      <form className="grid gap-4 rounded-[2rem] border border-stone-100 bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] lg:grid-cols-[1.2fr_0.8fr_0.6fr_auto]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="搜索产品名称、英文名或 slug"
            className="h-14 w-full rounded-2xl border border-stone-100 bg-stone-50/70 pl-12 pr-4 text-sm font-medium text-stone-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600/10"
            type="text"
          />
        </label>

        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="h-14 rounded-2xl border border-stone-100 bg-stone-50/70 px-4 text-sm font-medium text-stone-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600/10"
        >
          <option value="">全部分类</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.nameZh} / {category.nameEn}
            </option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-14 rounded-2xl border border-stone-100 bg-stone-50/70 px-4 text-sm font-medium text-stone-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-600/10"
        >
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>

        <button
          type="submit"
          className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-stone-900 px-6 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-stone-800"
        >
          <Filter className="h-4 w-4" />
          筛选
        </button>
      </form>

      <section className="overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-stone-50 bg-stone-50/30">
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                产品详情
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                分类
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                状态
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                更新时间
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {products.map((product) => (
              <tr key={product.id} className="group transition-colors hover:bg-blue-50/30">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-stone-100 bg-stone-100">
                      {product.coverImageUrl ? (
                        <img
                          alt={product.coverImageAlt || product.nameEn}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          src={product.coverImageUrl}
                        />
                      ) : (
                        <Package className="h-6 w-6 text-stone-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900 transition-colors group-hover:text-blue-600">
                        {product.nameEn}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">{product.nameZh}</p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-stone-400">
                        {product.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-stone-500">
                    {product.categoryNameZh || product.categorySlug || "未分类"}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        product.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <span className="text-xs font-bold text-stone-700">
                      {formatStatus(product.status)}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-medium text-stone-400">
                    {formatDate(product.updatedAt)}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-blue-200 hover:text-blue-600"
                    >
                      编辑
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        删除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stone-50">
              <Package className="h-10 w-10 text-stone-200" />
            </div>
            <p className="font-medium text-stone-400">当前筛选条件下没有产品。</p>
          </div>
        )}
      </section>
    </div>
  );
}

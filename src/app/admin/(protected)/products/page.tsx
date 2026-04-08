import Link from "next/link";
import { ArrowUpRight, Filter, Package, Plus, Search, Trash2 } from "lucide-react";

import {
  bulkDeleteProducts,
  bulkMoveProductsToCategory,
  deleteProduct,
} from "@/features/products/actions";
import { listAdminCategories, listAdminProducts } from "@/features/products/queries";

type AdminProductsPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    status?: string;
    deleted?: string;
    imported?: string;
    saved?: string;
    error?: string;
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
        params.status === "draft" || params.status === "published"
          ? params.status
          : "",
    }),
  ]);

  const bulkFormId = "products-bulk-form";

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-stone-400">
              Product Management
            </p>
            <h1 className="text-3xl font-semibold text-stone-950">产品管理</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
              统一管理产品、封面图、分类、发布状态和资料下载。支持筛选、批量移动分类、批量删除和单个编辑。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/products/import"
              className="inline-flex h-11 items-center rounded-full border border-stone-300 px-5 text-sm font-medium text-stone-700"
            >
              批量导入
            </Link>
            <Link
              href="/admin/products/new"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              新建产品
            </Link>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {params.deleted ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">
              已删除 {params.deleted} 个产品
            </p>
          ) : null}
          {params.imported ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">
              已导入 {params.imported} 个产品
            </p>
          ) : null}
          {params.saved === "bulk-moved" ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">
              批量移动分类已完成
            </p>
          ) : null}
          {params.error === "no-selection" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">
              请先勾选要操作的产品
            </p>
          ) : null}
        </div>
      </section>

      <form className="grid gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr_0.6fr_auto]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="搜索产品名、英文名或 slug"
            className="h-14 w-full rounded-2xl border border-stone-300 pl-12 pr-4 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950"
            type="text"
          />
        </label>

        <select
          name="category"
          defaultValue={params.category ?? ""}
          className="h-14 rounded-2xl border border-stone-300 px-4 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950"
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
          className="h-14 rounded-2xl border border-stone-300 px-4 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950"
        >
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>

        <button
          type="submit"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-stone-950 px-6 text-sm font-medium text-white"
        >
          <Filter className="h-4 w-4" />
          筛选
        </button>
      </form>

      {products.length ? (
        <form
          id={bulkFormId}
          className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-stone-200 bg-white px-5 py-4 shadow-sm"
        >
          <select
            name="targetCategoryId"
            defaultValue=""
            className="rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-950"
          >
            <option value="">移动到未分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameZh} / {category.nameEn}
              </option>
            ))}
          </select>
          <button
            type="submit"
            formAction={bulkMoveProductsToCategory}
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
          >
            批量移动分类
          </button>
          <button
            type="submit"
            formAction={bulkDeleteProducts}
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
          >
            批量删除
          </button>
          <p className="text-xs text-stone-500">先勾选产品，再执行批量操作。</p>
        </form>
      ) : null}

      <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/70">
              <th className="w-16 px-4 py-4 text-center text-[11px] font-semibold text-stone-500">
                勾选
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold text-stone-500">
                产品
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold text-stone-500">
                分类
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold text-stone-500">
                状态
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-semibold text-stone-500">
                更新时间
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-semibold text-stone-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((product) => (
              <tr key={product.id} className="align-top transition-colors hover:bg-blue-50/30">
                <td className="px-4 py-5 text-center">
                  <input
                    form={bulkFormId}
                    name="selectedIds"
                    type="checkbox"
                    value={product.id}
                    className="h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-600/20"
                  />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                      {product.coverImageUrl ? (
                        <img
                          alt={product.coverImageAlt || product.nameEn}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          src={product.coverImageUrl}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-6 w-6 text-stone-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-stone-950">
                        {product.nameZh}
                      </p>
                      <p className="mt-1 truncate text-sm text-stone-600">{product.nameEn}</p>
                      <p className="mt-1 truncate text-xs text-stone-400">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                    {product.categoryNameZh || product.categorySlug || "未分类"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={[
                      "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                      product.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700",
                    ].join(" ")}
                  >
                    {formatStatus(product.status)}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-stone-500">
                  {formatDate(product.updatedAt)}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                    >
                      编辑
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
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

        {products.length === 0 ? (
          <div className="px-6 py-20 text-center text-sm text-stone-500">
            当前筛选条件下没有产品。
          </div>
        ) : null}
      </section>
    </div>
  );
}

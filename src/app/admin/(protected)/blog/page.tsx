import Link from "next/link";
import {
  ChevronDown,
  FolderTree,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";

import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import {
  bulkDeleteBlogPosts,
  bulkMoveBlogPostsToCategory,
  deleteBlogCategory,
  deleteBlogPost,
  deleteBlogTag,
  saveBlogCategory,
  saveBlogTag,
} from "@/features/blog/actions";
import {
  listAdminBlogCategories,
  listAdminBlogPosts,
  listAdminBlogTags,
} from "@/features/blog/queries";
import { getFeatureGate } from "@/features/plans/access";

type AdminBlogPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    categoryId?: string;
    saved?: string;
    deleted?: string;
    taxonomy?: string;
    error?: string;
  }>;
};

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
      已发布
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600">
      草稿
    </span>
  );
}

// 閸愬懓浠堥惃鍕翻閸忋儲顢嬮弽宄扮础閿涘牏鎻ｉ崙鎴礆
const inlineInput =
  "w-full rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-xs text-stone-900 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500/20";

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const gate = await getFeatureGate("blog_management");

  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }

  const params = (await searchParams) ?? {};
  const categoryId = Number.parseInt(params.categoryId ?? "", 10);
  const [posts, categories, tags] = await Promise.all([
    listAdminBlogPosts("cnc", {
      query: params.q,
      status:
        params.status === "draft" || params.status === "published"
          ? params.status
          : "",
      categoryId: Number.isFinite(categoryId) ? categoryId : null,
    }),
    listAdminBlogCategories(),
    listAdminBlogTags(),
  ]);

  const bulkFormId = "blog-post-bulk-form";

  // toast 濞戝牊浼?
  const toast = params.saved === "bulk-moved"
    ? { type: "info", msg: "批量移动分类已完成" }
    : params.deleted
      ? { type: "success", msg: `已删除 ${params.deleted} 篇文章` }
      : params.error === "no-selection"
        ? { type: "warn", msg: "请先选择要操作的文章" }
        : params.taxonomy === "category-saved"
          ? { type: "info", msg: "博客分类已保存" }
          : params.taxonomy === "category-deleted"
            ? { type: "info", msg: "博客分类已删除" }
            : params.taxonomy === "tag-saved"
              ? { type: "info", msg: "博客标签已保存" }
              : params.taxonomy === "tag-deleted"
                ? { type: "info", msg: "博客标签已删除" }
                : null;

  const toastColor =
    toast?.type === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : toast?.type === "warn"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <div className="space-y-5">

      {/* ... */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-950">博客管理</h1>
          <p className="mt-1 text-sm text-stone-500">
            管理博客文章、分类和标签，统一维护内容结构并支持批量操作。
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新建文章
        </Link>
      </div>

      {/* Toast */}
      {toast ? (
        <p className={`rounded-xl border px-4 py-2 text-sm ${toastColor}`}>
          {toast.msg}
        </p>
      ) : null}

      {/* 筛选栏：搜索框 + 批量操作区 */}
      <div className="rounded-2xl border border-stone-200 bg-white px-5 py-3.5 shadow-sm">
        <form className="flex flex-wrap items-center gap-3">
          {/* ... */}
          <label className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
            <input
              className="h-9 w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-3 text-sm text-stone-950 outline-none focus:border-stone-400"
              defaultValue={params.q}
              name="q"
              placeholder="搜索标题、摘要或 slug"
            />
          </label>

          {/* ... */}
          <div className="relative">
            <select
              className="h-9 appearance-none rounded-xl border border-stone-200 bg-stone-50 pl-3 pr-8 text-sm text-stone-700 outline-none focus:border-stone-400"
              defaultValue={params.categoryId ?? ""}
              name="categoryId"
            >
              <option value="">全部分类</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameZh}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
          </div>

          {/* 閻樿埖鈧?*/}
          <div className="relative">
            <select
              className="h-9 appearance-none rounded-xl border border-stone-200 bg-stone-50 pl-3 pr-8 text-sm text-stone-700 outline-none focus:border-stone-400"
              defaultValue={params.status ?? ""}
              name="status"
            >
              <option value="">全部状态</option>
              <option value="published">已发布</option>
              <option value="draft">草稿</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
          </div>

          <button
            className="h-9 rounded-xl bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800"
            type="submit"
          >
            筛选
          </button>

          {/* ... */}
          {posts.length ? (
            <>
              <span className="hidden h-5 w-px bg-stone-200 sm:block" />

              {/* 筛选栏：搜索框 + 批量操作区 */}
              <form id={bulkFormId} className="flex items-center gap-2">
                <div className="relative">
                  <select
                    name="targetCategoryId"
                    defaultValue=""
                    className="h-9 appearance-none rounded-xl border border-stone-200 bg-stone-50 pl-3 pr-8 text-sm text-stone-700 outline-none focus:border-stone-400"
                  >
                    <option value="">移动到分类</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameZh}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
                </div>
                <button
                  type="submit"
                  formAction={bulkMoveBlogPostsToCategory}
                  className="h-9 rounded-xl border border-stone-200 px-3 text-sm text-stone-600 hover:bg-stone-50"
                >
                  批量移动分类
                </button>
                <button
                  type="submit"
                  formAction={bulkDeleteBlogPosts}
                  className="h-9 rounded-xl border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                >
                  批量删除文章
                </button>
              </form>
            </>
          ) : null}
        </form>
      </div>

      {/* ... */}
      <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        {/* 鐞涖劌銇?*/}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3">
          <p className="text-sm font-semibold text-stone-900">
            文章列表
            <span className="ml-2 text-xs font-normal text-stone-400">
              共 {posts.length} 篇            </span>
          </p>
        </div>

        {/* ... */}
        <div className="divide-y divide-stone-100">
          {posts.length ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50/60 transition-colors"
              >
                {/* Checkbox */}
                <input
                  form={bulkFormId}
                  name="selectedIds"
                  type="checkbox"
                  value={post.id}
                  className="h-4 w-4 flex-none rounded border-stone-300 text-blue-600 focus:ring-blue-600/20"
                />

                {/* ... */}
                <div className="h-14 w-20 flex-none overflow-hidden rounded-lg bg-stone-100">
                  {post.coverImageUrl ? (
                    <img
                      alt={post.coverImageAlt || post.titleEn}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      src={post.coverImageUrl}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-stone-300">
                      无封面
                    </div>
                  )}
                </div>

                {/* ... */}
                <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
                  {/* 閺嶅洭顣芥稉顓熸瀮 */}
                  <p className="truncate text-sm font-semibold text-stone-900">
                    {post.titleZh}
                  </p>
                  {/* 閺嶅洭顣介懟杈ㄦ瀮 */}
                  <p className="truncate text-xs text-stone-500">{post.titleEn}</p>
                  {/* 閹芥顩?*/}
                  {post.excerptEn ? (
                    <p className="truncate text-xs text-stone-400">{post.excerptEn}</p>
                  ) : null}
                </div>

                {/* ... */}
                <div className="flex flex-none flex-col items-end gap-1.5 w-36 shrink-0">
                  <StatusBadge status={post.status} />
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {post.categoryNameZh ? (
                      <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500">
                        {post.categoryNameZh}
                      </span>
                    ) : null}
                    {post.publishedAt ? (
                      <span className="text-[10px] text-stone-400">
                        {post.publishedAt.slice(0, 10)}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* 閹垮秳缍旈幐澶愭尦 */}
                <div className="flex flex-none items-center gap-1.5">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                    title="编辑"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <form action={deleteBlogPost}>
                    <input name="id" type="hidden" value={post.id} />
                    <button
                      type="submit"
                      title="删除"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-10 text-center text-sm text-stone-400">
              当前没有符合条件的文章。            </div>
          )}
        </div>
      </section>

      {/* ... */}
      <div className="grid gap-5 xl:grid-cols-2">

        {/* ... */}
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          {/* 分类表头 + 新建按钮 */}
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-900">博客分类</h3>
              <span className="text-xs text-stone-400">{categories.length} 个</span>
            </div>
          </div>

          {/* 新建分类表单：inline 快速创建 */}
          <form action={saveBlogCategory} className="border-b border-stone-100 bg-stone-50/60 px-5 py-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">+ 新建分类</p>
            <div className="grid grid-cols-[1fr_1fr_80px_50px] gap-2 items-center">
              <input className={inlineInput} name="nameZh" placeholder="分类名称（中文）" required />
              <input className={inlineInput} name="nameEn" placeholder="分类名称（英文）" required />
              <input className={inlineInput} name="slug" placeholder="固定链接" />
              <input className={inlineInput} defaultValue={100} name="sortOrder" type="number" title="排序" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs text-stone-500">
                <input defaultChecked name="isVisible" type="checkbox" className="h-3.5 w-3.5" />
                前台可见
              </label>
              <button
                className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                type="submit"
              >
                保存
              </button>
            </div>
          </form>

          {/* ... */}
          <div className="divide-y divide-stone-100">
            {categories.length ? (
              categories.map((category) => (
                <div key={category.id} className="px-5 py-2.5">
                  <form action={saveBlogCategory}>
                    <input name="id" type="hidden" value={category.id} />
                    <div className="grid grid-cols-[1fr_1fr_80px_50px] gap-2 items-center">
                      <input
                        className={inlineInput}
                        defaultValue={category.nameZh}
                        name="nameZh"
                        required
                      />
                      <input
                        className={inlineInput}
                        defaultValue={category.nameEn}
                        name="nameEn"
                        required
                      />
                      <input
                        className={inlineInput}
                        defaultValue={category.slug}
                        name="slug"
                      />
                      <input
                        className={inlineInput}
                        defaultValue={category.sortOrder}
                        name="sortOrder"
                        type="number"
                        title="排序"
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-stone-500">
                          <input
                            defaultChecked={category.isVisible}
                            name="isVisible"
                            type="checkbox"
                            className="h-3.5 w-3.5"
                          />
                          前台可见
                        </label>
                        <span className="text-[10px] text-stone-400">
                          {category.postCount} 篇文章
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          className="rounded-lg border border-stone-200 px-3 py-1 text-xs text-stone-600 hover:bg-stone-50"
                          type="submit"
                        >
                          更新
                        </button>
                        <button
                          className="rounded-lg border border-red-100 px-3 py-1 text-xs text-red-500 hover:bg-red-50"
                          type="button"
                          formAction={deleteBlogCategory}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ))
            ) : (
              <p className="px-5 py-6 text-center text-xs text-stone-400">暂无分类</p>
            )}
          </div>
        </section>

        {/* ... */}
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-stone-400" />
              <h3 className="text-sm font-semibold text-stone-900">博客标签</h3>
              <span className="text-xs text-stone-400">{tags.length} 个</span>
            </div>
          </div>

          {/* 标签区块 */}
          <form action={saveBlogTag} className="border-b border-stone-100 bg-stone-50/60 px-5 py-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">+ 新建标签</p>
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 items-center">
              <input className={inlineInput} name="nameZh" placeholder="标签名称（中文）" required />
              <input className={inlineInput} name="nameEn" placeholder="标签名称（英文）" required />
              <input className={inlineInput} name="slug" placeholder="固定链接（可选）" />
            </div>
            <div className="mt-2 flex justify-end">
              <button
                className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                type="submit"
              >
                保存
              </button>
            </div>
          </form>

          {/* 标签编辑：内联排列 */}
          <div className="divide-y divide-stone-100">
            {tags.length ? (
              tags.map((tag) => (
                <div key={tag.id} className="px-5 py-2.5">
                  <form action={saveBlogTag}>
                    <input name="id" type="hidden" value={tag.id} />
                    <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 items-center">
                      <input
                        className={inlineInput}
                        defaultValue={tag.nameZh}
                        name="nameZh"
                        required
                      />
                      <input
                        className={inlineInput}
                        defaultValue={tag.nameEn}
                        name="nameEn"
                        required
                      />
                      <input
                        className={inlineInput}
                        defaultValue={tag.slug}
                        name="slug"
                      />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">
                        {tag.postCount} 篇文章
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          className="rounded-lg border border-stone-200 px-3 py-1 text-xs text-stone-600 hover:bg-stone-50"
                          type="submit"
                        >
                          更新
                        </button>
                        <button
                          className="rounded-lg border border-red-100 px-3 py-1 text-xs text-red-500 hover:bg-red-50"
                          type="button"
                          formAction={deleteBlogTag}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ))
            ) : (
              <p className="px-5 py-6 text-center text-xs text-stone-400">暂无标签</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

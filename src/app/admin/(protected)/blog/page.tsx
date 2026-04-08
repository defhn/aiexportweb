import Link from "next/link";
import { FolderTree, Plus, Search, Tag, Trash2 } from "lucide-react";

import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import {
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

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

type AdminBlogPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    categoryId?: string;
    saved?: string;
    deleted?: string;
    taxonomy?: string;
  }>;
};

function formatStatus(status: "draft" | "published") {
  return status === "published" ? "已发布" : "草稿";
}

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
        params.status === "draft" || params.status === "published" ? params.status : "",
      categoryId: Number.isFinite(categoryId) ? categoryId : null,
    }),
    listAdminBlogCategories(),
    listAdminBlogTags(),
  ]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-stone-950">博客管理</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
              在这里统一管理文章、分类和标签。文章编辑支持富文本、图库插图、本地上传和粘贴图片。
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
            href="/admin/blog/new"
          >
            <Plus className="h-4 w-4" />
            新增文章
          </Link>
        </div>

        {params.saved ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            文章已保存。
          </p>
        ) : null}
        {params.deleted ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            文章已删除。
          </p>
        ) : null}
        {params.taxonomy ? (
          <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {params.taxonomy === "category-saved" && "博客分类已保存。"}
            {params.taxonomy === "category-deleted" && "博客分类已删除。"}
            {params.taxonomy === "tag-saved" && "博客标签已保存。"}
            {params.taxonomy === "tag-deleted" && "博客标签已删除。"}
          </p>
        ) : null}
      </section>

      <form className="grid gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr_0.6fr_auto]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            className="h-14 w-full rounded-2xl border border-stone-300 pl-12 pr-4 text-sm"
            defaultValue={params.q}
            name="q"
            placeholder="搜索标题、slug 或分类"
          />
        </label>
        <select
          className="h-14 rounded-2xl border border-stone-300 px-4 text-sm"
          defaultValue={params.categoryId ?? ""}
          name="categoryId"
        >
          <option value="">全部分类</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameZh} / {category.nameEn}
            </option>
          ))}
        </select>
        <select
          className="h-14 rounded-2xl border border-stone-300 px-4 text-sm"
          defaultValue={params.status ?? ""}
          name="status"
        >
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
        <button
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
          type="submit"
        >
          筛选文章
        </button>
      </form>

      <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-stone-950">文章列表</h3>
            <p className="mt-2 text-sm text-stone-500">当前共 {posts.length} 篇文章。</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {posts.length ? (
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-[1.5rem] border border-stone-200 bg-stone-50/40 p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="h-20 w-28 overflow-hidden rounded-2xl bg-stone-100">
                      {post.coverImageUrl ? (
                        <img
                          alt={post.coverImageAlt || post.titleEn}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          src={post.coverImageUrl}
                        />
                      ) : null}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-stone-500">
                        <span>{formatStatus(post.status)}</span>
                        {post.publishedAt ? <span>{post.publishedAt.slice(0, 10)}</span> : null}
                        {post.categoryNameZh ? (
                          <span>{post.categoryNameZh}</span>
                        ) : null}
                      </div>
                      <h4 className="mt-3 text-xl font-semibold text-stone-950">{post.titleZh}</h4>
                      <p className="mt-2 text-sm text-stone-600">{post.titleEn}</p>
                      <p className="mt-3 text-sm leading-6 text-stone-600">{post.excerptEn}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                      href={`/admin/blog/${post.id}`}
                    >
                      编辑
                    </Link>
                    <form action={deleteBlogPost}>
                      <input name="id" type="hidden" value={post.id} />
                      <button
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        type="submit"
                      >
                        <Trash2 className="h-4 w-4" />
                        删除
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
              当前筛选条件下没有文章。
            </div>
          )}
        </div>
      </section>

      <section id="categories" className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <FolderTree className="h-5 w-5 text-stone-400" />
            <h3 className="text-lg font-semibold text-stone-950">博客分类</h3>
          </div>

          <form action={saveBlogCategory} className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              分类名（中文）
              <input className={inputClassName} name="nameZh" required />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Name (EN)
              <input className={inputClassName} name="nameEn" required />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Slug
              <input className={inputClassName} name="slug" placeholder="留空自动生成" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              排序
              <input className={inputClassName} defaultValue={100} name="sortOrder" type="number" />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 md:col-span-2">
              <input defaultChecked name="isVisible" type="checkbox" />
              前台可见
            </label>
            <div className="flex justify-end md:col-span-2">
              <button
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
                type="submit"
              >
                新建分类
              </button>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            {categories.map((category) => (
              <article key={category.id} className="rounded-2xl border border-stone-200 p-4">
                <form action={saveBlogCategory} className="grid gap-4 md:grid-cols-2">
                  <input name="id" type="hidden" value={category.id} />
                  <label className="block text-sm font-medium text-stone-700">
                    分类名（中文）
                    <input
                      className={inputClassName}
                      defaultValue={category.nameZh}
                      name="nameZh"
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium text-stone-700">
                    Name (EN)
                    <input
                      className={inputClassName}
                      defaultValue={category.nameEn}
                      name="nameEn"
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium text-stone-700">
                    Slug
                    <input className={inputClassName} defaultValue={category.slug} name="slug" />
                  </label>
                  <label className="block text-sm font-medium text-stone-700">
                    排序
                    <input
                      className={inputClassName}
                      defaultValue={category.sortOrder}
                      name="sortOrder"
                      type="number"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-stone-700 md:col-span-2">
                    <input defaultChecked={category.isVisible} name="isVisible" type="checkbox" />
                    前台可见
                  </label>
                  <div className="flex items-center justify-between gap-4 md:col-span-2">
                    <p className="text-xs text-stone-500">已关联文章：{category.postCount}</p>
                    <div className="flex gap-3">
                      <button
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                        type="submit"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </form>
                <form action={deleteBlogCategory} className="mt-3 flex justify-end">
                  <input name="id" type="hidden" value={category.id} />
                  <button
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                    type="submit"
                  >
                    删除分类
                  </button>
                </form>
              </article>
            ))}
          </div>
        </div>

        <div id="tags" className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-stone-400" />
            <h3 className="text-lg font-semibold text-stone-950">博客标签</h3>
          </div>

          <form action={saveBlogTag} className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              标签名（中文）
              <input className={inputClassName} name="nameZh" required />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Name (EN)
              <input className={inputClassName} name="nameEn" required />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              Slug
              <input className={inputClassName} name="slug" placeholder="留空自动生成" />
            </label>
            <div className="flex justify-end md:col-span-2">
              <button
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
                type="submit"
              >
                新建标签
              </button>
            </div>
          </form>

          <div className="mt-6 space-y-4">
            {tags.map((tag) => (
              <article key={tag.id} className="rounded-2xl border border-stone-200 p-4">
                <form action={saveBlogTag} className="grid gap-4 md:grid-cols-2">
                  <input name="id" type="hidden" value={tag.id} />
                  <label className="block text-sm font-medium text-stone-700">
                    标签名（中文）
                    <input className={inputClassName} defaultValue={tag.nameZh} name="nameZh" required />
                  </label>
                  <label className="block text-sm font-medium text-stone-700">
                    Name (EN)
                    <input className={inputClassName} defaultValue={tag.nameEn} name="nameEn" required />
                  </label>
                  <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                    Slug
                    <input className={inputClassName} defaultValue={tag.slug} name="slug" />
                  </label>
                  <div className="flex items-center justify-between gap-4 md:col-span-2">
                    <p className="text-xs text-stone-500">已关联文章：{tag.postCount}</p>
                    <button
                      className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                      type="submit"
                    >
                      保存
                    </button>
                  </div>
                </form>
                <form action={deleteBlogTag} className="mt-3 flex justify-end">
                  <input name="id" type="hidden" value={tag.id} />
                  <button
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                    type="submit"
                  >
                    删除标签
                  </button>
                </form>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

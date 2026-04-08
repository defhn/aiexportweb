import Link from "next/link";

import { getBlogPosts } from "@/features/blog/queries";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950">博客管理</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            中文后台编辑文章内容，前端继续输出英文博客，用于 SEO 和海外买家教育。
          </p>
        </div>
        <Link
          className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
          href="/admin/blog/new"
        >
          新增文章
        </Link>
      </section>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-950">
                  {post.titleZh}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{post.titleEn}</p>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {post.excerptEn}
                </p>
              </div>
              <Link
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                href={`/admin/blog/${index + 1}`}
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

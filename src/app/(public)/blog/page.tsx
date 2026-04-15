import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, FileText } from "lucide-react";

import { BlogCard } from "@/components/public/blog-card";
import { buildBlogCategoryFilters, filterBlogPosts } from "@/features/blog/filter";
import { getBlogPosts } from "@/features/blog/queries";
import { getFeatureGate } from "@/features/plans/access";
import { getSiteSettings } from "@/features/settings/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById, getTemplateTheme } from "@/templates";

import { buildAbsoluteUrl } from "@/lib/seo";

// ISR: 博客列表页每 1 小时重新生成，新文章发布后最多 60 分钟内全网生效
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const currentSite = await getCurrentSiteFromRequest();
  const settings = await getSiteSettings(currentSite.seedPackKey, currentSite.id ?? null);
  return {
    title: "Blog",
    description: settings.taglineEn || "Technical articles, DFM guides, and manufacturing strategies for global procurement.",
    alternates: { canonical: buildAbsoluteUrl("/blog") },
  };
}

type BlogListPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
  }>;
};

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const gate = await getFeatureGate("blog_management", currentSite.plan);

  if (gate.status === "locked") {
    notFound();
  }

  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);
  const params = (await searchParams) ?? {};
  const allPosts = await getBlogPosts(currentSite.seedPackKey, siteId);
  const categoryFilters = buildBlogCategoryFilters(allPosts);
  const filteredPosts = filterBlogPosts(allPosts, {
    query: params.q,
    categorySlug: params.category,
  });
  const featuredPost = filteredPosts[0] ?? null;
  const regularPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b pt-32 pb-24" style={{ backgroundColor: theme.surface }}>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon" />
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-white/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
              {theme.blog.eyebrow}
            </p>
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tighter text-white leading-[1.1] md:text-6xl">
              {theme.blog.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              {theme.blog.description}
            </p>
          </div>

          <form className="flex w-full flex-col gap-4 md:w-auto" method="get">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Search articles..."
                className="w-full rounded-full border bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              />
            </div>
            <div className="flex max-h-20 flex-wrap gap-2 overflow-y-hidden">
              <Link
                href="/blog"
                className={[
                  "rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                  !params.category ? "text-white" : "bg-white/5 text-white/60",
                ].join(" ")}
                style={!params.category ? { backgroundColor: theme.accent } : {}}
              >
                All
              </Link>
              {categoryFilters.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog?category=${tag.slug}`}
                  className={[
                    "rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                    params.category === tag.slug ? "text-white" : "bg-white/5 text-white/60",
                  ].join(" ")}
                  style={params.category === tag.slug ? { backgroundColor: theme.accent } : {}}
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </form>
        </div>
      </section>

      {featuredPost ? (
        <section className="py-12 -mt-16 relative z-20 mx-auto max-w-7xl px-6">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group flex flex-col overflow-hidden rounded-[2.5rem] border bg-white shadow-xl transition-all duration-500 hover:shadow-2xl"
            style={{ borderColor: theme.border }}
          >
            <div className="relative h-[400px] w-full overflow-hidden lg:h-[500px]" style={{ backgroundColor: theme.surface }}>
              <Image
                src={featuredPost.coverImageUrl || theme.about.featureImage}
                alt={featuredPost.titleEn}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="w-full p-10 lg:w-2/5 lg:p-16 flex flex-col justify-center">
              <div className="mb-6 flex items-center gap-4">
                <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm" style={{ backgroundColor: theme.accent }}>
                  Featured Guide
                </span>
                <span className="text-xs font-medium text-stone-400">Updated Recently</span>
              </div>
              <h3 className="mb-6 text-3xl font-bold leading-[1.2] text-stone-900 transition-colors group-hover:opacity-80 md:text-4xl">
                {featuredPost.titleEn}
              </h3>
              <p className="mb-8 line-clamp-4 text-lg leading-relaxed text-stone-500">
                {featuredPost.excerptEn}
              </p>
              <div className="mt-auto flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-stone-900 transition-colors group-hover:opacity-80">
                Read Full Article
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition-colors" style={{ borderColor: theme.border }}>
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-bold tracking-tight text-stone-900">Latest Articles</h3>
            <p className="text-sm text-stone-500">
              {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"} found
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  excerpt={post.excerptEn}
                  href={`/blog/${post.slug}`}
                  imageUrl={post.coverImageUrl || undefined}
                  category={post.categorySlug ? post.categorySlug.replace(/-/g, " ") : theme.blog.defaultCategoryLabel}
                  date={post.publishedAt.slice(0, 10)}
                  title={post.titleEn}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-stone-900">No matching articles found</p>
              <p className="mt-3 text-sm text-stone-500">
                Try a different keyword or switch back to all categories.
              </p>
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="inline-flex rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
                >
                  Reset filters
                </Link>
              </div>
            </div>
          )}

          <div className="relative mt-24 flex flex-col items-center justify-between gap-12 overflow-hidden rounded-[2.5rem] p-10 shadow-2xl md:flex-row md:p-16" style={{ backgroundColor: theme.surface }}>
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-[100px]" style={{ backgroundColor: theme.accentSoft }} />

            <div className="relative z-10 flex-1">
              <div className="mb-6 flex items-center gap-3">
                <FileText className="h-8 w-8" style={{ color: theme.accent }} />
                <span className="text-xs font-black uppercase tracking-widest text-white/50">
                  {theme.blog.supportEyebrow}
                </span>
              </div>
              <h3 className="mb-4 text-3xl font-extrabold tracking-tight text-white">
                {theme.blog.supportTitle}
              </h3>
              <p className="max-w-xl text-lg text-white/70">
                {theme.blog.supportDescription}
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/request-quote" className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-bold text-white transition-colors" style={{ backgroundColor: theme.accent }}>
                Request a Quote
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border px-8 py-4 text-sm font-bold text-stone-200 transition-colors hover:text-white" style={{ borderColor: "rgba(255,255,255,0.16)" }}>
                Contact Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

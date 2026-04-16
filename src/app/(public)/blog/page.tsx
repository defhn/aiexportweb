import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, FileText, Lock } from "lucide-react";

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
  const gate = await getFeatureGate("blog_management", currentSite.plan, siteId);
  
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);
  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";

  if (gate.status === "locked") {
    return (
      <main className="min-h-screen" style={{ backgroundColor: theme.surface }}>
        <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f4" }}>
            <Lock className="h-7 w-7 text-stone-500" />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>Blog Access</p>
          <h1 className={`mt-4 text-4xl font-bold tracking-tight md:text-5xl ${textColor}`}>Blog is available on higher plans</h1>
          <p className={`mt-4 max-w-2xl text-lg leading-8 ${textMuted}`}>
            This site can still show the blog layout, but publishing and managing articles is enabled on Growth plans and above.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link href="/contact" className="rounded-full px-8 py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: theme.accent }}>
              Contact Sales
            </Link>
            <Link href="/products" className="rounded-full border px-8 py-4 text-base font-bold transition-colors hover:bg-stone-50" style={{ borderColor: theme.border, color: textColor === "text-white" ? "white" : "inherit" }}>
              Browse Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

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
    <main className="min-h-screen" style={{ backgroundColor: theme.surface }}>
      <section className="relative overflow-hidden border-b pt-32 pb-24" style={{ backgroundColor: isDark ? theme.surface : "rgba(0,0,0,0.02)", borderColor: theme.border }}>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon" />
        <div className="absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${theme.accent}15` }} />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-12 px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-6 text-sm font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
              {theme.blog.eyebrow}
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white leading-[1.1] md:text-6xl">
              {theme.blog.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              {theme.blog.description}
            </p>
          </div>

          <form className="flex w-full flex-col gap-4 md:w-auto" method="get">
            <div className="relative focus-within:scale-[1.02] transition-transform">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Search articles..."
                className="w-full rounded-xl border bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 transition-all"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              />
            </div>
            <div className="flex max-h-20 flex-wrap gap-2 overflow-y-hidden">
              <Link
                href="/blog"
                className={[
                  "rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                  !params.category ? "text-white" : "bg-white/5 text-white/60 hover:bg-white/10",
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
                    "rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                    params.category === tag.slug ? "text-white" : "bg-white/5 text-white/60 hover:bg-white/10",
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
            className="group flex flex-col overflow-hidden rounded-[2.5rem] border shadow-2xl transition-all duration-500 hover:scale-[1.01]"
            style={{ borderColor: theme.border, backgroundColor: isDark ? theme.surfaceAlt : "#ffffff" }}
          >
            <div className="relative h-[400px] w-full overflow-hidden" style={{ backgroundColor: theme.surface }}>
              <Image
                src={featuredPost.coverImageUrl || theme.about.featureImage}
                alt={featuredPost.titleEn}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            <div className="w-full p-10 lg:p-14">
              <div className="mb-6 flex items-center gap-4">
                <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: theme.accent }}>
                  Featured Guide
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white/40" : "text-stone-400"}`}>Updated Recently</span>
              </div>
              <h3 className={`mb-6 text-3xl font-bold leading-[1.2] md:text-5xl transition-colors group-hover:opacity-80 ${isDark ? "text-white" : "text-stone-900"}`}>
                {featuredPost.titleEn}
              </h3>
              <p className={`mb-8 line-clamp-3 text-lg leading-relaxed ${isDark ? "text-white/60" : "text-stone-500"}`}>
                {featuredPost.excerptEn}
              </p>
              <div className={`mt-auto flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] transition-opacity group-hover:opacity-80 ${isDark ? "text-white" : "text-stone-900"}`}>
                Read Full Article
                <div className="flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#ffffff" }}>
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="py-24" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-center justify-between gap-4">
            <h3 className={`text-2xl font-black uppercase tracking-widest ${textColor}`}>Latest Articles</h3>
            <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>
              {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"}
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
                  accentColor={theme.accent}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed p-16 text-center" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "white" }}>
              <p className={`text-lg font-bold ${textColor}`}>No matching articles found</p>
              <p className={`mt-3 text-sm ${textMuted}`}>
                Try a different keyword or switch back to all categories.
              </p>
              <div className="mt-8">
                <Link
                  href="/blog"
                  className={`inline-flex rounded-full border px-8 py-3 text-xs font-black uppercase tracking-widest transition-all hover:bg-stone-50 ${textColor}`}
                  style={{ borderColor: theme.border }}
                >
                  Reset filters
                </Link>
              </div>
            </div>
          )}

          <div className="relative mt-24 flex flex-col items-center justify-between gap-12 overflow-hidden rounded-[3rem] p-12 shadow-2xl md:flex-row md:p-20" style={{ backgroundColor: theme.surfaceAlt === "#ffffff" ? theme.surface : theme.surfaceAlt }}>
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-[100px]" style={{ backgroundColor: `${theme.accent}20` }} />

            <div className="relative z-10 flex-1">
              <div className="mb-6 flex items-center gap-3">
                <FileText className="h-8 w-8" style={{ color: theme.accent }} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                  {theme.blog.supportEyebrow}
                </span>
              </div>
              <h3 className="mb-5 text-3xl font-black tracking-tight text-white md:text-5xl leading-tight">
                {theme.blog.supportTitle}
              </h3>
              <p className="max-w-xl text-lg text-white/60 leading-relaxed font-medium">
                {theme.blog.supportDescription}
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/request-quote" className="inline-flex h-14 items-center justify-center rounded-xl px-10 text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-105" style={{ backgroundColor: theme.accent }}>
                Request a Quote
              </Link>
              <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-xl border px-10 text-xs font-black uppercase tracking-widest text-stone-200 transition-all hover:text-white" style={{ borderColor: "rgba(255,255,255,0.16)" }}>
                Contact Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

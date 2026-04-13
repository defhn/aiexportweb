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

import { buildAbsoluteUrl } from "@/lib/seo";

// ISR: 博客列表页每 1 小时重新生成，新文章发布后最多 60 分钟内全网生效
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
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
  const gate = await getFeatureGate("blog_management");

  if (gate.status === "locked") {
    notFound();
  }

  const params = (await searchParams) ?? {};
  const allPosts = await getBlogPosts();
  const categoryFilters = buildBlogCategoryFilters(allPosts);
  const filteredPosts = filterBlogPosts(allPosts, {
    query: params.q,
    categorySlug: params.category,
  });
  const featuredPost = filteredPosts[0] ?? null;
  const regularPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <main className="min-h-screen bg-white">
      <section className="relative pt-32 pb-24 bg-stone-950 border-b border-stone-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between md:items-end gap-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.4em] text-blue-500 mb-6 drop-shadow-sm">
              TITAN CNC Hub
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white max-w-2xl leading-[1.1]">
              Engineering Insights &amp;{" "}<br className="hidden md:block" />
              DFM Guides
            </h1>
            <p className="mt-6 text-lg text-stone-400 max-w-xl">
              Publishing technical articles, material references, and manufacturing
              strategies to support your global procurement decisions.
            </p>
          </div>

          <form className="w-full md:w-auto flex flex-col gap-4" method="get">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-500" />
              <input
                type="text"
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Search technical guides..."
                className="w-full md:w-80 bg-stone-900 border border-stone-800 text-stone-300 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-2 flex-wrap max-h-20 overflow-y-hidden">
              <Link
                href="/blog"
                className={[
                  "text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-1 transition-colors",
                  !params.category
                    ? "bg-blue-600 text-white"
                    : "text-stone-400 bg-stone-900 border border-stone-800 hover:bg-stone-800",
                ].join(" ")}
              >
                All
              </Link>
              {categoryFilters.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog?category=${tag.slug}`}
                  className={[
                    "text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-1 transition-colors",
                    params.category === tag.slug
                      ? "bg-blue-600 text-white"
                      : "text-stone-400 bg-stone-900 border border-stone-800 hover:bg-stone-800",
                  ].join(" ")}
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
            className="group flex flex-col lg:flex-row bg-white rounded-[2.5rem] overflow-hidden border border-stone-200 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
          >
            <div className="relative w-full lg:w-3/5 h-[400px] lg:h-[500px] bg-stone-100 overflow-hidden">
              <Image
                src={featuredPost.coverImageUrl || "/images/blog_engineering_cover_1775635599853.png"}
                alt={featuredPost.titleEn}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="w-full lg:w-2/5 p-10 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                  Featured Guide
                </span>
                <span className="text-xs text-stone-400 font-medium">Updated Recently</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-stone-900 group-hover:text-blue-600 transition-colors leading-[1.2] mb-6">
                {featuredPost.titleEn}
              </h3>
              <p className="text-stone-500 leading-relaxed line-clamp-4 mb-8 text-lg">
                {featuredPost.excerptEn}
              </p>
              <div className="mt-auto flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-stone-900 group-hover:text-blue-600 transition-colors">
                Read Full Article
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 transition-colors group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white bg-white shadow-sm">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="py-24 bg-stone-50">
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
                  category={post.categorySlug ? post.categorySlug.replace(/-/g, " ") : "Engineering"}
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

          <div className="mt-24 p-10 md:p-16 rounded-[2.5rem] bg-stone-900 overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 border border-stone-800">
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />

            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-8 w-8 text-blue-500" />
                <span className="text-xs font-black uppercase tracking-widest text-stone-400">
                  Engineering Support
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mb-4">
                Need a technical review for your next RFQ?
              </h3>
              <p className="text-stone-400 max-w-xl text-lg">
                Share your drawings, target materials, and delivery destination. We will
                review manufacturability, tolerances, and lead time before you place an
                order.
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request-quote"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                Request a Quote
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-8 py-4 text-sm font-bold text-stone-200 transition-colors hover:border-stone-500 hover:text-white"
              >
                Contact Engineering
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

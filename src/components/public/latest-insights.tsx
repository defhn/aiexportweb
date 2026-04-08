import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BlogCard } from "@/components/public/blog-card";

type InsightPost = {
  slug: string;
  titleEn: string;
  excerptEn: string;
  coverImageUrl?: string | null;
  categorySlug?: string | null;
  publishedAt?: string;
};

type LatestInsightsProps = {
  eyebrow?: string;
  title?: string;
  posts?: InsightPost[];
};

export function LatestInsights({
  eyebrow = "Engineering Insights",
  title = "Industry Knowledge & News",
  posts = [],
}: LatestInsightsProps) {
  return (
    <section className="bg-stone-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h2 className="mb-4 text-sm font-black uppercase tracking-[0.4em] text-blue-600">
              {eyebrow}
            </h2>
            <h3 className="text-3xl font-bold leading-[1.1] tracking-tight text-stone-900 md:text-5xl">
              {title}
            </h3>
          </div>
          <Link
            href="/blog"
            className="group hidden items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-600 transition-colors hover:text-blue-600 md:flex"
          >
            Read All Articles
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.titleEn}
              excerpt={post.excerptEn}
              href={`/blog/${post.slug}`}
              imageUrl={post.coverImageUrl || undefined}
              category={post.categorySlug ? post.categorySlug.replace(/-/g, " ") : "Engineering"}
              date={post.publishedAt?.slice(0, 10) || "Today"}
            />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-600"
          >
            Read All Articles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

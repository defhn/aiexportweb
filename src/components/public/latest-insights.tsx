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
  accentColor?: string;
  defaultCategoryLabel?: string;
  theme?: { surface?: string; surfaceAlt?: string; border?: string; accent?: string };
};

export function LatestInsights({
  eyebrow = "Insights",
  title = "Latest News & Updates",
  posts = [],
  accentColor = "#2563eb",
  defaultCategoryLabel = "Sourcing",
  theme,
}: LatestInsightsProps) {
  const surface = theme?.surface ?? "#ffffff";
  const isDark = surface !== "#ffffff" && surface !== "#fffaf2" && surface !== "#f5f6ff" && surface !== "#fffaf4";
  const sectionBg = isDark ? (theme?.surfaceAlt ?? surface) : "#f5f5f4";
  const titleColor = isDark ? "#ffffff" : "#1c1917";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const cardBorder = isDark ? (theme?.border ?? "rgba(255,255,255,0.08)") : "#e7e5e4";
  const cardTitleColor = isDark ? "#f5f5f4" : "#1c1917";
  const cardTextColor = isDark ? "rgba(255,255,255,0.55)" : "#78716c";
  return (
    <section className="py-24" style={{ backgroundColor: sectionBg }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <h2 className="mb-4 text-sm font-black uppercase tracking-[0.4em]" style={{ color: accentColor }}>
              {eyebrow}
            </h2>
            <h3 className="text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl" style={{ color: titleColor }}>
              {title}
            </h3>
          </div>
          <Link
            href="/blog"
            className="group hidden items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-600 transition-colors md:flex"
            style={{ color: accentColor }}
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
              category={post.categorySlug ? post.categorySlug.replace(/-/g, " ") : defaultCategoryLabel}
              date={post.publishedAt?.slice(0, 10) || "Today"}
              accentColor={accentColor}
              cardBg={cardBg}
              cardBorder={cardBorder}
              titleColor={cardTitleColor}
              textColor={cardTextColor}
            />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            Read All Articles
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

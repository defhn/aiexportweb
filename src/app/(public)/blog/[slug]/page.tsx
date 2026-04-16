import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

import { JsonLdScript } from "@/components/public/json-ld-script";
import { getFeatureGate } from "@/features/plans/access";
import { getBlogPostBySlug, getBlogPosts } from "@/features/blog/queries";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById, getTemplateTheme } from "@/templates";

// ISR: 每篇文章每 1 小时重新生成
export const revalidate = 3600;

// 构建时预渲染已发布文章
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const gate = await getFeatureGate("blog_management", currentSite.plan, siteId);

  if (gate.status === "locked") {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      path: "/blog",
    });
  }

  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, currentSite.seedPackKey, siteId);

  if (!post) {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      path: `/blog/${slug}`,
    });
  }

  return buildPageMetadata({
    title: post.titleEn,
    description: post.excerptEn,
    path: `/blog/${slug}`,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const gate = await getFeatureGate("blog_management", currentSite.plan, siteId);

  if (gate.status === "locked") {
    notFound();
  }

  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, currentSite.seedPackKey, siteId);

  if (!post) {
    notFound();
  }

  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);
  const postUrl = buildAbsoluteUrl(`/blog/${post.slug}`);

  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";

  return (
    <>
      <JsonLdScript
        value={buildArticleJsonLd({
          headline: post.titleEn,
          description: post.excerptEn,
          url: postUrl,
          publishedAt: post.publishedAt,
          modifiedAt: post.updatedAt ?? post.publishedAt,
        })}
      />
      <JsonLdScript
        value={buildBreadcrumbJsonLd([
          { name: "Home", url: buildAbsoluteUrl("/") },
          { name: theme.blog.eyebrow, url: buildAbsoluteUrl("/blog") },
          { name: post.titleEn, url: postUrl },
        ])}
      />

      <article className="mx-auto min-h-screen" style={{ backgroundColor: theme.surface }}>
        <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
          <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
            {theme.blog.eyebrow}
          </p>
          <h1 className={`mt-6 text-4xl font-black md:text-5xl lg:text-6xl leading-[1.1] ${textColor}`}>
            {post.titleEn}
          </h1>
          <p className={`mt-8 text-xl font-medium leading-relaxed ${textMuted}`}>
            {post.excerptEn}
          </p>
          
          {post.coverImageUrl ? (
            <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] shadow-2xl" style={{ backgroundColor: theme.surfaceAlt }}>
              <Image 
                src={post.coverImageUrl} 
                alt={post.coverImageAlt || post.titleEn} 
                fill 
                sizes="(max-width: 1024px) 100vw, 1200px" 
                className="object-cover" 
                priority 
              />
            </div>
          ) : null}

          <div 
            className="mt-12 overflow-hidden rounded-[2.5rem] border p-8 md:p-14 lg:p-20 shadow-xl" 
            style={{ 
              borderColor: theme.border, 
              backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#ffffff" 
            }}
          >
            <div 
              className={`prose-export max-w-none text-base leading-relaxed ${isDark ? "prose-invert text-stone-300" : "text-stone-800"}`} 
              dangerouslySetInnerHTML={{ __html: post.contentEn }} 
            />
          </div>

          <div className="mt-20 flex flex-col items-center justify-between gap-10 rounded-[2.5rem] border border-dashed p-10 md:flex-row" style={{ borderColor: theme.border }}>
              <div className="flex-1">
                  <h4 className={`text-xl font-bold ${textColor}`}>{theme.blog.supportTitle}</h4>
                  <p className={`mt-2 text-sm ${textMuted}`}>{theme.blog.supportDescription}</p>
              </div>
              <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-xl px-10 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: theme.accent }}>
                  Contact Our Team
              </Link>
          </div>
        </div>
      </article>
    </>
  );
}

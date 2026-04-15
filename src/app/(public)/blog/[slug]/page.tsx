import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

import { JsonLdScript } from "@/components/public/json-ld-script";
import { getFeatureGate } from "@/features/plans/access";
import { getBlogPostBySlug, getBlogPosts } from "@/features/blog/queries";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { getActiveTemplate, getTemplateTheme } from "@/templates";

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
  const gate = await getFeatureGate("blog_management");

  if (gate.status === "locked") {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      path: "/blog",
    });
  }

  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

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
  const gate = await getFeatureGate("blog_management");

  if (gate.status === "locked") {
    notFound();
  }

  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const template = getActiveTemplate();
  const theme = getTemplateTheme(template.id);
  const postUrl = buildAbsoluteUrl(`/blog/${post.slug}`);

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

      <article className="mx-auto max-w-4xl px-6 pb-20 pt-28">
        <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>
          {theme.blog.eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">{post.titleEn}</h1>
        <p className="mt-6 text-base leading-7 text-slate-600">{post.excerptEn}</p>
        {post.coverImageUrl ? (
          <div className="relative mt-10 h-[200px] overflow-hidden rounded-[2rem] border bg-stone-100 sm:h-[360px]" style={{ borderColor: theme.border }}>
            <Image src={post.coverImageUrl} alt={post.coverImageAlt || post.titleEn} fill sizes="(max-width: 768px) 100vw, 896px" className="object-cover" priority />
          </div>
        ) : null}
        <div className="mt-10 rounded-[2rem] border bg-white p-8 shadow-sm" style={{ borderColor: theme.border }}>
          <div className="prose-export max-w-none text-sm leading-7 text-stone-700" dangerouslySetInnerHTML={{ __html: post.contentEn }} />
        </div>
      </article>
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

import { JsonLdScript } from "@/components/public/json-ld-script";
import { getFeatureGate } from "@/features/plans/access";
import { getBlogPostBySlug } from "@/features/blog/queries";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";

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
          { name: "Blog", url: buildAbsoluteUrl("/blog") },
          { name: post.titleEn, url: postUrl },
        ])}
      />

      <article className="mx-auto max-w-4xl px-6 pt-28 pb-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Blog
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">
          {post.titleEn}
        </h1>
        <p className="mt-6 text-base leading-7 text-slate-600">
          {post.excerptEn}
        </p>
        {post.coverImageUrl ? (
          <div className="relative mt-10 h-[200px] sm:h-[360px] overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-100">
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.titleEn}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        ) : null}
        <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <div
            className="prose-export max-w-none text-sm leading-7 text-stone-700"
            dangerouslySetInnerHTML={{ __html: post.contentEn }}
          />
        </div>
      </article>
    </>
  );
}

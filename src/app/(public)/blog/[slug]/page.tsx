import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { JsonLdScript } from "@/components/public/json-ld-script";
import { getBlogPostBySlug } from "@/features/blog/queries";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
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
        })}
      />
      <JsonLdScript
        value={buildBreadcrumbJsonLd([
          { name: "Home", url: buildAbsoluteUrl("/") },
          { name: "Blog", url: buildAbsoluteUrl("/blog") },
          { name: post.titleEn, url: postUrl },
        ])}
      />

      <article className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Blog
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">
          {post.titleEn}
        </h1>
        <p className="mt-6 text-base leading-7 text-slate-600">
          {post.excerptEn}
        </p>
        <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm leading-7 text-stone-700">{post.contentEn}</p>
        </div>
      </article>
    </>
  );
}

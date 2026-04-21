/**
 * Agent-5: SEO Packager + Content Injector
 *
 * Generates precise Title/Description and Schema.org JSON-LD,
 * then writes the article to the database and triggers ISR cache invalidation.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { type ArticleOutline } from "./agent-architect";

// --- Schema ---

export const SeoPackageSchema = z.object({
  titleTag: z.string().min(30).max(65),
  metaDescription: z.string().min(100).max(160),
  jsonLdType: z.enum(["BlogPosting", "Product", "FAQPage"]),
  jsonLd: z.record(z.string(), z.unknown()),
});

export type SeoPackage = z.infer<typeof SeoPackageSchema>;

// --- Build JSON-LD ---

function buildBlogPostingJsonLd(params: {
  title: string;
  description: string;
  slug: string;
  siteUrl: string;
  companyName: string;
  publishedAt: string;
  faqQuestions?: string[];
}): Record<string, unknown> {
  const { title, description, slug, siteUrl, companyName, publishedAt, faqQuestions } = params;

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": `${siteUrl}/blog/${slug}`,
    "datePublished": publishedAt,
    "dateModified": publishedAt,
    "author": { "@type": "Organization", "name": companyName },
    "publisher": { "@type": "Organization", "name": companyName },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${siteUrl}/blog/${slug}` },
  };

  if (faqQuestions && faqQuestions.length > 0) {
    base["@graph"] = [
      base,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqQuestions.map((q) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Contact our team for detailed information about this topic.",
          },
        })),
      },
    ];
  }

  return base;
}

// --- Agent-5: Generate SEO Package ---

export type SeoPackagerResult =
  | { success: true; package: SeoPackage }
  | { success: false; error: string };

export async function generateSeoPackage(params: {
  outline: ArticleOutline;
  markdown: string;
  slug: string;
  siteUrl: string;
  companyName: string;
}): Promise<SeoPackagerResult> {
  const { outline, slug, siteUrl, companyName } = params;

  try {
    let titleTag = outline.titleTag;
    if (titleTag.length > 60) {
      titleTag = titleTag.slice(0, 57) + "...";
    } else if (titleTag.length < 30) {
      titleTag = `${titleTag} | ${companyName}`.slice(0, 60);
    }

    let metaDescription = outline.metaDescriptionDraft;
    if (metaDescription.length > 155) {
      metaDescription = metaDescription.slice(0, 152) + "...";
    }

    const publishedAt = new Date().toISOString();
    const jsonLd = buildBlogPostingJsonLd({
      title: outline.h1,
      description: metaDescription,
      slug,
      siteUrl,
      companyName,
      publishedAt,
      faqQuestions: outline.faqQuestions,
    });

    const seoPackage: SeoPackage = {
      titleTag,
      metaDescription,
      jsonLdType: outline.faqQuestions.length > 0 ? "FAQPage" : "BlogPosting",
      jsonLd,
    };

    const validation = SeoPackageSchema.safeParse(seoPackage);
    if (!validation.success) {
      return {
        success: false,
        error: `SEO Package validation failed: ${validation.error.issues.map((i) => i.message).join("; ")}`,
      };
    }

    console.log(`[Agent-5 Packager] OK | title="${titleTag}" | descLen=${metaDescription.length}`);
    return { success: true, package: validation.data };

  } catch (err) {
    return {
      success: false,
      error: `SEO Package failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// --- Content Injector: Write to DB + Trigger ISR ---

export type InjectionResult =
  | { success: true; blogPostId: number; slug: string }
  | { success: false; error: string };

export async function injectBlogPost(params: {
  siteId: number | null;
  seedPackKey: string;
  outline: ArticleOutline;
  markdown: string;
  seoPackage: SeoPackage;
  sourceJobId: number;
  categorySlug?: string;
}): Promise<InjectionResult> {
  const { siteId, outline, markdown, seoPackage, sourceJobId, categorySlug } = params;

  try {
    const { getDb } = await import("@/db/client");
    const { blogPosts } = await import("@/db/schema");

    const db = getDb();

    const slug = outline.primaryKeyword
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80)
      + `-${Date.now().toString(36)}`;

    const publishedAt = new Date();

    const [inserted] = await db
      .insert(blogPosts)
      .values({
        siteId,
        slug,
        titleZh: outline.h1,
        titleEn: outline.h1,
        excerptEn: seoPackage.metaDescription,
        contentEn: markdown,
        bodyMarkdownEn: markdown,
        seoTitle: seoPackage.titleTag,
        seoDescription: seoPackage.metaDescription,
        seoMetaJson: {
          titleTag: seoPackage.titleTag,
          metaDescription: seoPackage.metaDescription,
          jsonLdType: seoPackage.jsonLdType,
          jsonLd: seoPackage.jsonLd,
          primaryKeyword: outline.primaryKeyword,
          sourceJobId,
        },
        status: "published",
        categorySlug: categorySlug ?? "manufacturing",
        publishedAt,
        createdAt: publishedAt,
        updatedAt: publishedAt,
      })
      .returning({ id: blogPosts.id });

    if (!inserted) throw new Error("blogPosts insert failed");

    console.log(`[Injector] OK | id=${inserted.id} | slug=${slug}`);

    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");

    return { success: true, blogPostId: inserted.id, slug };

  } catch (err) {
    console.error("[Injector] DB write failed:", err);
    return {
      success: false,
      error: `Injection failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

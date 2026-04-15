/**
 * 公共首页 — 数据获取层
 *
 * 此文件只负责：
 * 1. 从数据库获取数据（功能代码，所有模板共享）
 * 2. 调用当前激活模板的 HomePage 组件渲染 UI
 *
 * ⚠️  不要在此文件写任何 UI 代码。UI 在 src/templates/[template-id]/home-page.tsx 里。
 */

import type { Metadata } from "next";

import { getBlogPosts } from "@/features/blog/queries";
import { getPageModules } from "@/features/pages/queries";
import { getAllCategories, getAllProducts } from "@/features/products/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById } from "@/templates";
import { buildAbsoluteUrl } from "@/lib/seo";

// ─── SEO Metadata（所有模板共享同一套 SEO 逻辑） ──────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const [modules, settings] = await Promise.all([
    getPageModules("home", currentSite.seedPackKey, siteId),
    getSiteSettings(currentSite.seedPackKey, siteId),
  ]);
  const heroModule = modules.find((m) => m.moduleKey === "hero");
  const payload = heroModule?.payloadJson ?? {};
  const seoTitle = typeof payload["seoTitle"] === "string" ? payload["seoTitle"] : "";
  const seoDescription =
    typeof payload["seoDescription"] === "string" ? payload["seoDescription"] : "";

  return {
    title: seoTitle || settings.companyNameEn,
    description: seoDescription || settings.taglineEn || "B2B industrial export solutions.",
    alternates: { canonical: buildAbsoluteUrl("/") },
    openGraph: {
      type: "website",
      ...(settings.seoOgImageUrl
        ? {
            images: [
              {
                url: settings.seoOgImageUrl,
                width: 1200,
                height: 630,
                alt: seoTitle || settings.companyNameEn,
              },
            ],
          }
        : {}),
    },
  };
}

// ─── 首页组件（路由分发器） ────────────────────────────────────────────────

export default async function HomePage() {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  // 1️⃣ 并行获取所有数据（与 UI 无关，所有模板复用）
  const [modules, allCategories, allProducts, blogPosts, settings] = await Promise.all([
    getPageModules("home", currentSite.seedPackKey, siteId),
    getAllCategories(currentSite.seedPackKey, siteId),
    getAllProducts(currentSite.seedPackKey, siteId),
    getBlogPosts(currentSite.seedPackKey, siteId),
    getSiteSettings(currentSite.seedPackKey, siteId),
  ]);

  // 2️⃣ 将博客数据整理为模板标准格式（published 时 excerptEn/categorySlug/publishedAt 均已是 string）
  const blogPostsForTemplate = blogPosts.map((post) => ({
    slug: post.slug,
    titleEn: post.titleEn,
    excerptEn: post.excerptEn ?? "",
    coverImageUrl: post.coverImageUrl ?? null,
    categorySlug: post.categorySlug ?? null,
    publishedAt: typeof post.publishedAt === "string" ? post.publishedAt : null,
  }));

  // 3️⃣ 读取当前激活模板，渲染对应的 UI
  const { HomePage: TemplateHomePage } = getTemplateById(currentSite.templateId);

  return (
    <TemplateHomePage
      modules={modules}
      products={allProducts.map((p) => ({
        slug: p.slug,
        nameEn: p.nameEn,
        shortDescriptionEn: p.shortDescriptionEn ?? null,
        coverImageUrl: p.coverImageUrl ?? null,
        coverImageAlt: p.coverImageAlt ?? null,
        categorySlug: ("categorySlug" in p ? p.categorySlug : "") as string,
      }))}
      categories={allCategories}
      blogPosts={blogPostsForTemplate}
      settings={settings}
    />
  );
}

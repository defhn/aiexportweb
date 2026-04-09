import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/features/blog/queries";
import { getAllCategories, getAllProducts } from "@/features/products/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { buildAbsoluteUrl } from "@/lib/seo";

// force-dynamic：每次请求都重新生成，确保产品/博客上线后立即出现在 Sitemap
export const dynamic = "force-dynamic";
// 同时也设置 revalidate 0 兜底
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, posts] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
    getBlogPosts(),
  ]);

  const now = new Date();

  return [
    // 静态页面
    { url: buildAbsoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: buildAbsoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: buildAbsoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: buildAbsoluteUrl("/request-quote"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: buildAbsoluteUrl("/products"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    // 产品分类页（使用真实 updatedAt）
    ...categories.map((category) => ({
      url: buildAbsoluteUrl(`/products/${category.slug}`),
      // 优先使用 updatedAt，回退到当前时间
      lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // 产品详情页（使用真实 updatedAt）
    ...products.map((product) => ({
      url: buildAbsoluteUrl(`/products/${product.categorySlug}/${product.slug}`),
      lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),

    // 博客列表页
    { url: buildAbsoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.7 },

    // 博客文章页（使用真实 publishedAt）
    ...posts
      .filter((post) => post.status === "published")
      .map((post) => ({
        url: buildAbsoluteUrl(`/blog/${post.slug}`),
        lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}

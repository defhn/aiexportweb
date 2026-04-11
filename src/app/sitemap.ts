import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/features/blog/queries";
import { getAllCategories, getAllProducts } from "@/features/products/queries";
import { buildAbsoluteUrl } from "@/lib/seo";

// force-dynamic: 禁用静态缓存，每次请求都获取最新数据用于 Sitemap 生成
export const dynamic = "force-dynamic";
// 等效于 revalidate 0，禁用 ISR 缓存
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, posts] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
    getBlogPosts(),
  ]);

  // 静态页面使用固定日期，避免每次请求都触发 Google 重新抓取
  const staticDate = new Date("2025-01-01");

  return [
    // 静态页面（首页、关于、联系等）
    { url: buildAbsoluteUrl("/"), lastModified: staticDate, changeFrequency: "weekly", priority: 1.0 },
    { url: buildAbsoluteUrl("/about"), lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },
    { url: buildAbsoluteUrl("/contact"), lastModified: staticDate, changeFrequency: "monthly", priority: 0.6 },
    { url: buildAbsoluteUrl("/request-quote"), lastModified: staticDate, changeFrequency: "monthly", priority: 0.8 },
    { url: buildAbsoluteUrl("/products"), lastModified: staticDate, changeFrequency: "weekly", priority: 0.9 },
    { url: buildAbsoluteUrl("/capabilities"), lastModified: staticDate, changeFrequency: "monthly", priority: 0.7 },

    // 产品分类页面：使用 updatedAt 提供精确更新信号
    ...categories.map((category) => ({
      url: buildAbsoluteUrl(`/products/${category.slug}`),
      lastModified: (category as Record<string, unknown>).updatedAt
        ? new Date((category as Record<string, unknown>).updatedAt as string)
        : staticDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // 产品详情页面：使用 updatedAt 提供精确更新信号
    ...products.map((product) => ({
      url: buildAbsoluteUrl(`/products/${product.categorySlug}/${product.slug}`),
      lastModified: (product as Record<string, unknown>).updatedAt
        ? new Date((product as Record<string, unknown>).updatedAt as string)
        : staticDate,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),

    // 博客列表页
    { url: buildAbsoluteUrl("/blog"), lastModified: staticDate, changeFrequency: "daily", priority: 0.7 },

    // 博客文章，已发布的才入 sitemap，使用 publishedAt 为最后修改时间
    ...posts
      .filter((post) => post.status === "published")
      .map((post) => ({
        url: buildAbsoluteUrl(`/blog/${post.slug}`),
        lastModified: post.publishedAt ? new Date(post.publishedAt) : staticDate,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}

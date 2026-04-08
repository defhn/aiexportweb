import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/features/blog/queries";
import { getAllCategories, getAllProducts } from "@/features/products/queries";
import { buildAbsoluteUrl } from "@/lib/seo";

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, posts] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
    getBlogPosts(),
  ]);
  const now = new Date();

  return [
    { url: buildAbsoluteUrl("/"), lastModified: now },
    { url: buildAbsoluteUrl("/about"), lastModified: now },
    { url: buildAbsoluteUrl("/contact"), lastModified: now },
    { url: buildAbsoluteUrl("/products"), lastModified: now },
    ...categories.map((category) => ({
      url: buildAbsoluteUrl(`/products/${category.slug}`),
      lastModified: now,
    })),
    ...products.map((product) => ({
      url: buildAbsoluteUrl(`/products/${product.categorySlug}/${product.slug}`),
      lastModified: now,
    })),
    { url: buildAbsoluteUrl("/blog"), lastModified: now },
    ...posts.map((post) => ({
      url: buildAbsoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
    })),
  ];
}

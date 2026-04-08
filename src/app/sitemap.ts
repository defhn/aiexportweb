import type { MetadataRoute } from "next";

import { getSeedPack } from "@/db/seed";
import { getBlogPosts } from "@/features/blog/queries";
import { buildAbsoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pack = getSeedPack("cnc");
  const posts = await getBlogPosts();
  const now = new Date();

  return [
    { url: buildAbsoluteUrl("/"), lastModified: now },
    { url: buildAbsoluteUrl("/about"), lastModified: now },
    { url: buildAbsoluteUrl("/contact"), lastModified: now },
    { url: buildAbsoluteUrl("/products"), lastModified: now },
    ...pack.categories.map((category) => ({
      url: buildAbsoluteUrl(`/products/${category.slug}`),
      lastModified: now,
    })),
    ...pack.products.map((product) => ({
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

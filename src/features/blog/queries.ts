import { getSeedPack, type SeedPackKey } from "@/db/seed";
import { createExcerptFallback } from "@/lib/rich-text";

export async function getBlogCategories(seedPackKey: SeedPackKey = "cnc") {
  return getSeedPack(seedPackKey).blogCategories;
}

export async function getBlogPosts(seedPackKey: SeedPackKey = "cnc") {
  return getSeedPack(seedPackKey).blogPosts.map((post) => ({
    ...post,
    excerptEn: post.excerptEn || createExcerptFallback(post.contentEn),
  }));
}

export async function getBlogPostBySlug(
  slug: string,
  seedPackKey: SeedPackKey = "cnc",
) {
  const posts = await getBlogPosts(seedPackKey);
  return posts.find((post) => post.slug === slug) ?? null;
}

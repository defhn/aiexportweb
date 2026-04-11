import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";

import { getDb } from "@/db/client";
import { blogCategories, blogPostTags, blogPosts, blogTags, mediaAssets } from "@/db/schema";
import { getSeedPack, type SeedPackKey } from "@/db/seed";
import { createExcerptFallback } from "@/lib/rich-text";

function mapSeedBlogCategories(seedPackKey: SeedPackKey) {
  return getSeedPack(seedPackKey).blogCategories.map((category, index) => ({
    id: index + 1,
    nameZh: category.nameZh,
    nameEn: category.nameEn,
    slug: category.slug,
    sortOrder: (index + 1) * 10,
    isVisible: true,
  }));
}

function mapSeedBlogPosts(seedPackKey: SeedPackKey) {
  const categories = mapSeedBlogCategories(seedPackKey);
  const categoryIdMap = new Map(categories.map((category) => [category.slug, category.id]));

  return getSeedPack(seedPackKey).blogPosts.map((post, index) => ({
    id: index + 1,
    categoryId: categoryIdMap.get(post.categorySlug) ?? null,
    categoryNameZh:
      categories.find((category) => category.slug === post.categorySlug)?.nameZh ?? "",
    categoryNameEn:
      categories.find((category) => category.slug === post.categorySlug)?.nameEn ?? "",
    titleZh: post.titleZh,
    titleEn: post.titleEn,
    slug: post.slug,
    excerptZh: post.excerptZh || createExcerptFallback(post.contentZh),
    excerptEn: post.excerptEn || createExcerptFallback(post.contentEn),
    contentZh: post.contentZh,
    contentEn: post.contentEn,
    coverMediaId: null,
    coverImageUrl: null,
    coverImageAlt: post.titleEn,
    seoTitle: post.titleEn,
    seoDescription: post.excerptEn || createExcerptFallback(post.contentEn),
    status: "published" as const,
    publishedAt: post.publishedAt,
    updatedAt: post.publishedAt,
    categorySlug: post.categorySlug,
    tags: post.tags,
  }));
}

async function hasDatabasePosts() {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  const db = getDb();
  const [record] = await db.select({ id: blogPosts.id }).from(blogPosts).limit(1);
  return Boolean(record);
}

async function hasDatabaseCategories() {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  const db = getDb();
  const [record] = await db
    .select({ id: blogCategories.id })
    .from(blogCategories)
    .limit(1);
  return Boolean(record);
}

export async function getBlogCategories(seedPackKey: SeedPackKey = "cnc") {
  if (!process.env.DATABASE_URL) {
    return mapSeedBlogCategories(seedPackKey);
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.isVisible, true))
    .orderBy(asc(blogCategories.sortOrder), asc(blogCategories.id));

  if (rows.length) {
    return rows.map((row) => ({
      id: row.id,
      nameZh: row.nameZh,
      nameEn: row.nameEn,
      slug: row.slug,
      sortOrder: row.sortOrder,
      isVisible: row.isVisible,
    }));
  }

  if (await hasDatabaseCategories()) {
    return [];
  }

  return mapSeedBlogCategories(seedPackKey);
}

export async function getBlogCategoryOptions(seedPackKey: SeedPackKey = "cnc") {
  return getBlogCategories(seedPackKey);
}

export async function listAdminBlogCategories(seedPackKey: SeedPackKey = "cnc") {
  if (!process.env.DATABASE_URL) {
    return mapSeedBlogCategories(seedPackKey).map((category) => ({
      ...category,
      postCount: 0,
    }));
  }

  const db = getDb();
  const rows = await db
    .select({
      id: blogCategories.id,
      nameZh: blogCategories.nameZh,
      nameEn: blogCategories.nameEn,
      slug: blogCategories.slug,
      sortOrder: blogCategories.sortOrder,
      isVisible: blogCategories.isVisible,
      postCount: count(blogPosts.id),
    })
    .from(blogCategories)
    .leftJoin(blogPosts, eq(blogPosts.categoryId, blogCategories.id))
    .groupBy(
      blogCategories.id,
      blogCategories.nameZh,
      blogCategories.nameEn,
      blogCategories.slug,
      blogCategories.sortOrder,
      blogCategories.isVisible,
    )
    .orderBy(asc(blogCategories.sortOrder), asc(blogCategories.id));

  if (rows.length) {
    return rows;
  }

  return mapSeedBlogCategories(seedPackKey).map((category) => ({
    ...category,
    postCount: 0,
  }));
}

export async function listAdminBlogTags() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const db = getDb();
  return db
    .select({
      id: blogTags.id,
      nameZh: blogTags.nameZh,
      nameEn: blogTags.nameEn,
      slug: blogTags.slug,
      postCount: count(blogPostTags.id),
    })
    .from(blogTags)
    .leftJoin(blogPostTags, eq(blogPostTags.blogTagId, blogTags.id))
    .groupBy(blogTags.id, blogTags.nameZh, blogTags.nameEn, blogTags.slug)
    .orderBy(asc(blogTags.nameEn), asc(blogTags.id));
}

export async function getBlogPosts(seedPackKey: SeedPackKey = "cnc") {
  if (!process.env.DATABASE_URL) {
    return mapSeedBlogPosts(seedPackKey);
  }

  const db = getDb();
  const rows = await db
    .select({
      id: blogPosts.id,
      categoryId: blogPosts.categoryId,
      categorySlug: blogCategories.slug,
      titleZh: blogPosts.titleZh,
      titleEn: blogPosts.titleEn,
      slug: blogPosts.slug,
      excerptZh: blogPosts.excerptZh,
      excerptEn: blogPosts.excerptEn,
      contentZh: blogPosts.contentZh,
      contentEn: blogPosts.contentEn,
      coverMediaId: blogPosts.coverMediaId,
      coverImageUrl: mediaAssets.url,
      coverImageAlt: mediaAssets.altTextEn,
      seoTitle: blogPosts.seoTitle,
      seoDescription: blogPosts.seoDescription,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .leftJoin(mediaAssets, eq(blogPosts.coverMediaId, mediaAssets.id))
    .where(eq(blogPosts.status, "published"))
    .orderBy(asc(blogPosts.publishedAt), asc(blogPosts.id));

  if (rows.length) {
    return rows.map((row) => ({
      ...row,
      categorySlug: row.categorySlug ?? "",
      excerptZh: row.excerptZh || createExcerptFallback(row.contentZh ?? ""),
      excerptEn: row.excerptEn || createExcerptFallback(row.contentEn ?? ""),
      contentZh: row.contentZh ?? "",
      contentEn: row.contentEn ?? "",
      coverMediaId: row.coverMediaId ?? null,
      coverImageUrl: row.coverImageUrl ?? null,
      coverImageAlt: row.coverImageAlt ?? row.titleEn,
      seoTitle: row.seoTitle ?? row.titleEn,
      seoDescription:
        row.seoDescription ||
        row.excerptEn ||
        createExcerptFallback(row.contentEn ?? row.titleEn),
      publishedAt: row.publishedAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
    }));
  }

  if (await hasDatabasePosts()) {
    return [];
  }

  return mapSeedBlogPosts(seedPackKey);
}

export async function listAdminBlogPosts(
  seedPackKey: SeedPackKey = "cnc",
  filters?: {
    query?: string;
    status?: "draft" | "published" | "";
    categoryId?: number | null;
  },
) {
  if (!process.env.DATABASE_URL) {
    return mapSeedBlogPosts(seedPackKey);
  }

  try {
    const db = getDb();
    const conditions = [];

    if (filters?.query) {
      conditions.push(
        or(
          ilike(blogPosts.titleZh, `%${filters.query}%`),
          ilike(blogPosts.titleEn, `%${filters.query}%`),
          ilike(blogPosts.slug, `%${filters.query}%`),
          ilike(blogCategories.nameZh, `%${filters.query}%`),
          ilike(blogCategories.nameEn, `%${filters.query}%`),
        )!,
      );
    }

    if (filters?.status) {
      conditions.push(eq(blogPosts.status, filters.status));
    }

    if (filters?.categoryId) {
      conditions.push(eq(blogPosts.categoryId, filters.categoryId));
    }

    const query = db
      .select({
        id: blogPosts.id,
        categoryId: blogPosts.categoryId,
        categoryNameZh: blogCategories.nameZh,
        categoryNameEn: blogCategories.nameEn,
        categorySlug: blogCategories.slug,
        titleZh: blogPosts.titleZh,
        titleEn: blogPosts.titleEn,
        slug: blogPosts.slug,
        excerptZh: blogPosts.excerptZh,
        excerptEn: blogPosts.excerptEn,
        contentZh: blogPosts.contentZh,
        contentEn: blogPosts.contentEn,
        coverMediaId: blogPosts.coverMediaId,
        coverImageUrl: mediaAssets.url,
        coverImageAlt: mediaAssets.altTextEn,
        seoTitle: blogPosts.seoTitle,
        seoDescription: blogPosts.seoDescription,
        status: blogPosts.status,
        publishedAt: blogPosts.publishedAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .leftJoin(mediaAssets, eq(blogPosts.coverMediaId, mediaAssets.id))
      .orderBy(desc(blogPosts.updatedAt), desc(blogPosts.id));

    const rows = conditions.length
      ? await query.where(and(...conditions))
      : await query;

    if (rows.length) {
      return rows.map((row) => ({
        ...row,
        categoryNameZh: row.categoryNameZh ?? "",
        categoryNameEn: row.categoryNameEn ?? "",
        categorySlug: row.categorySlug ?? "",
        excerptZh: row.excerptZh || createExcerptFallback(row.contentZh ?? ""),
        excerptEn: row.excerptEn || createExcerptFallback(row.contentEn ?? ""),
        contentZh: row.contentZh ?? "",
        contentEn: row.contentEn ?? "",
        coverMediaId: row.coverMediaId ?? null,
        coverImageUrl: row.coverImageUrl ?? null,
        coverImageAlt: row.coverImageAlt ?? row.titleEn,
        seoTitle: row.seoTitle ?? row.titleEn,
        seoDescription:
          row.seoDescription ||
          row.excerptEn ||
          createExcerptFallback(row.contentEn ?? row.titleEn),
        publishedAt: row.publishedAt?.toISOString() ?? "",
        updatedAt: row.updatedAt?.toISOString() ?? "",
      }));
    }
  } catch (error) {
    console.error("Falling back to seed admin blog posts after database read failure.", error);
  }

  return mapSeedBlogPosts(seedPackKey);
}

export async function getBlogPostBySlug(
  slug: string,
  seedPackKey: SeedPackKey = "cnc",
) {
  const posts = await getBlogPosts(seedPackKey);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getBlogPostById(
  id: number,
  seedPackKey: SeedPackKey = "cnc",
) {
  if (!process.env.DATABASE_URL) {
    const seedPost = mapSeedBlogPosts(seedPackKey).find((item) => item.id === id);

    if (!seedPost) {
      return null;
    }

    return {
      id: seedPost.id,
      categoryId: seedPost.categoryId,
      titleZh: seedPost.titleZh,
      titleEn: seedPost.titleEn,
      slug: seedPost.slug,
      excerptZh: seedPost.excerptZh,
      excerptEn: seedPost.excerptEn,
      contentZh: seedPost.contentZh,
      contentEn: seedPost.contentEn,
      coverMediaId: null,
      seoTitle: seedPost.seoTitle,
      seoDescription: seedPost.seoDescription,
      status: seedPost.status,
      publishedAt: seedPost.publishedAt.slice(0, 16),
      tags: seedPost.tags,
    };
  }

  const db = getDb();
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);

  if (post) {
    const tagRows = await db
      .select({ nameEn: blogTags.nameEn })
      .from(blogPostTags)
      .innerJoin(blogTags, eq(blogPostTags.blogTagId, blogTags.id))
      .where(eq(blogPostTags.blogPostId, post.id))
      .orderBy(asc(blogPostTags.id));

    return {
      id: post.id,
      categoryId: post.categoryId,
      titleZh: post.titleZh,
      titleEn: post.titleEn,
      slug: post.slug,
      excerptZh: post.excerptZh ?? "",
      excerptEn: post.excerptEn ?? "",
      contentZh: post.contentZh ?? "",
      contentEn: post.contentEn ?? "",
      coverMediaId: post.coverMediaId ?? null,
      seoTitle: post.seoTitle ?? "",
      seoDescription: post.seoDescription ?? "",
      status: post.status,
      publishedAt: post.publishedAt?.toISOString().slice(0, 16) ?? "",
      tags: tagRows.map((tag) => tag.nameEn),
    };
  }

  if (await hasDatabasePosts()) {
    return null;
  }

  const seedPost = mapSeedBlogPosts(seedPackKey).find((item) => item.id === id);

  if (!seedPost) {
    return null;
  }

  return {
    id: seedPost.id,
    categoryId: seedPost.categoryId,
    titleZh: seedPost.titleZh,
    titleEn: seedPost.titleEn,
    slug: seedPost.slug,
    excerptZh: seedPost.excerptZh,
    excerptEn: seedPost.excerptEn,
    contentZh: seedPost.contentZh,
    contentEn: seedPost.contentEn,
    coverMediaId: null,
    seoTitle: seedPost.seoTitle,
    seoDescription: seedPost.seoDescription,
    status: seedPost.status,
    publishedAt: seedPost.publishedAt.slice(0, 16),
    tags: seedPost.tags,
  };
}

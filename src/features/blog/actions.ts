import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  blogCategories,
  blogPostTags,
  blogPosts,
  blogTags,
} from "@/db/schema";
import { buildBlogCategoryDraft, buildBlogTagDraft } from "@/features/blog/admin";
import { createExcerptFallback } from "@/lib/rich-text";
import { normalizeEditorHtml } from "@/lib/rich-text-editor";
import { toSlug } from "@/lib/slug";

type BlogPostDraftInput = {
  categoryId?: number | null;
  titleZh: string;
  titleEn: string;
  slug?: string;
  excerptZh?: string;
  excerptEn?: string;
  contentZh?: string;
  contentEn?: string;
  coverMediaId?: number | null;
  seoTitle?: string;
  seoDescription?: string;
  status?: "draft" | "published";
  publishedAt?: string;
  tags?: string;
};

function trimValue(value?: string | null) {
  return value?.trim() ?? "";
}

function toNullable(value?: string | null) {
  const trimmed = trimValue(value);
  return trimmed.length > 0 ? trimmed : null;
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalNumber(formData: FormData, key: string) {
  const value = readText(formData, key);

  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toOptionalId(value?: number | null) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

export function parseBlogBulkIds(formData: FormData, key = "selectedIds") {
  return Array.from(
    new Set(
      formData
        .getAll(key)
        .map((value) =>
          typeof value === "string" ? Number.parseInt(value.trim(), 10) : Number.NaN,
        )
        .filter((value) => Number.isInteger(value) && value > 0),
    ),
  );
}

function buildTagList(value?: string | null) {
  return trimValue(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function buildBlogDraft(input: {
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  excerptZh?: string;
  excerptEn?: string;
}) {
  return {
    titleZh: trimValue(input.titleZh),
    titleEn: trimValue(input.titleEn),
    slug: toSlug(input.titleEn),
    contentZh: trimValue(input.contentZh),
    contentEn: trimValue(input.contentEn),
    excerptZh: trimValue(input.excerptZh) || createExcerptFallback(input.contentZh),
    excerptEn: trimValue(input.excerptEn) || createExcerptFallback(input.contentEn),
  };
}

export function buildBlogPostDraft(input: BlogPostDraftInput) {
  const titleEn = trimValue(input.titleEn);
  const contentZh = normalizeEditorHtml(input.contentZh);
  const contentEn = normalizeEditorHtml(input.contentEn);
  const status: "draft" | "published" =
    input.status === "published" ? "published" : "draft";

  return {
    categoryId: input.categoryId ?? null,
    titleZh: trimValue(input.titleZh),
    titleEn,
    slug: toSlug(trimValue(input.slug) || titleEn),
    excerptZh: trimValue(input.excerptZh) || createExcerptFallback(contentZh),
    excerptEn: trimValue(input.excerptEn) || createExcerptFallback(contentEn),
    contentZh: contentZh || null,
    contentEn: contentEn || null,
    coverMediaId: toOptionalId(input.coverMediaId),
    seoTitle: toNullable(input.seoTitle) ?? titleEn,
    seoDescription:
      toNullable(input.seoDescription) ||
      createExcerptFallback(contentEn || titleEn),
    status,
    publishedAt: trimValue(input.publishedAt),
    tags: buildTagList(input.tags),
  };
}

function revalidateBlogAdminPaths() {
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/admin/blog/new");
  revalidatePath("/admin/blog/categories");
  revalidatePath("/admin/blog/tags");
}

export async function saveBlogPost(formData: FormData) {
  "use server";

  const db = getDb();
  const postId = readOptionalNumber(formData, "id");
  const draft = buildBlogPostDraft({
    categoryId: readOptionalNumber(formData, "categoryId"),
    titleZh: readText(formData, "titleZh"),
    titleEn: readText(formData, "titleEn"),
    slug: readText(formData, "slug"),
    excerptZh: readText(formData, "excerptZh"),
    excerptEn: readText(formData, "excerptEn"),
    contentZh: readText(formData, "contentZh"),
    contentEn: readText(formData, "contentEn"),
    coverMediaId: readOptionalNumber(formData, "coverMediaId"),
    seoTitle: readText(formData, "seoTitle"),
    seoDescription: readText(formData, "seoDescription"),
    status: readText(formData, "status") === "published" ? "published" : "draft",
    publishedAt: readText(formData, "publishedAt"),
    tags: readText(formData, "tags"),
  });

  const [previousRecord] = postId
    ? await db
        .select({ id: blogPosts.id, slug: blogPosts.slug })
        .from(blogPosts)
        .where(eq(blogPosts.id, postId))
        .limit(1)
    : [];

  const [savedPost] = postId
    ? await db
        .update(blogPosts)
        .set({
          categoryId: draft.categoryId,
          titleZh: draft.titleZh,
          titleEn: draft.titleEn,
          slug: draft.slug,
          excerptZh: draft.excerptZh,
          excerptEn: draft.excerptEn,
          contentZh: draft.contentZh,
          contentEn: draft.contentEn,
          coverMediaId: draft.coverMediaId,
          seoTitle: draft.seoTitle,
          seoDescription: draft.seoDescription,
          status: draft.status,
          publishedAt: draft.publishedAt ? new Date(draft.publishedAt) : null,
          updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, postId))
        .returning({ id: blogPosts.id, slug: blogPosts.slug })
    : await db
        .insert(blogPosts)
        .values({
          categoryId: draft.categoryId,
          titleZh: draft.titleZh,
          titleEn: draft.titleEn,
          slug: draft.slug,
          excerptZh: draft.excerptZh,
          excerptEn: draft.excerptEn,
          contentZh: draft.contentZh,
          contentEn: draft.contentEn,
          coverMediaId: draft.coverMediaId,
          seoTitle: draft.seoTitle,
          seoDescription: draft.seoDescription,
          status: draft.status,
          publishedAt: draft.publishedAt ? new Date(draft.publishedAt) : null,
          updatedAt: new Date(),
        })
        .returning({ id: blogPosts.id, slug: blogPosts.slug });

  if (!savedPost) {
    redirect("/admin/blog");
  }

  await db.delete(blogPostTags).where(eq(blogPostTags.blogPostId, savedPost.id));

  for (const tag of draft.tags) {
    const slug = toSlug(tag);
    const [existingTag] = await db
      .select()
      .from(blogTags)
      .where(eq(blogTags.slug, slug))
      .limit(1);

    const blogTag =
      existingTag ??
      (
        await db
          .insert(blogTags)
          .values({
            nameZh: tag,
            nameEn: tag,
            slug,
          })
          .returning()
      )[0];

    if (blogTag) {
      await db.insert(blogPostTags).values({
        blogPostId: savedPost.id,
        blogTagId: blogTag.id,
      });
    }
  }

  revalidateBlogAdminPaths();
  revalidatePath(`/blog/${savedPost.slug}`);

  if (previousRecord?.slug && previousRecord.slug !== savedPost.slug) {
    revalidatePath(`/blog/${previousRecord.slug}`);
  }

  redirect(`/admin/blog/${savedPost.id}?saved=1`);
}

export async function deleteBlogPost(formData: FormData) {
  "use server";

  const postId = readOptionalNumber(formData, "id");

  if (!postId) {
    redirect("/admin/blog");
  }

  const db = getDb();
  const [record] = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(eq(blogPosts.id, postId))
    .limit(1);

  if (!record) {
    redirect("/admin/blog");
  }

  await db.delete(blogPosts).where(eq(blogPosts.id, postId));

  revalidateBlogAdminPaths();
  revalidatePath(`/blog/${record.slug}`);

  redirect("/admin/blog?deleted=1");
}

export async function bulkDeleteBlogPosts(formData: FormData) {
  "use server";

  const ids = parseBlogBulkIds(formData);

  if (!ids.length) {
    redirect("/admin/blog?error=no-selection");
  }

  const db = getDb();
  await db.delete(blogPosts).where(inArray(blogPosts.id, ids));

  revalidateBlogAdminPaths();
  redirect(`/admin/blog?deleted=${ids.length}`);
}

export async function bulkMoveBlogPostsToCategory(formData: FormData) {
  "use server";

  const ids = parseBlogBulkIds(formData);
  const categoryId = readOptionalNumber(formData, "targetCategoryId");

  if (!ids.length) {
    redirect("/admin/blog?error=no-selection");
  }

  const db = getDb();
  await db
    .update(blogPosts)
    .set({
      categoryId: categoryId ?? null,
      updatedAt: new Date(),
    })
    .where(inArray(blogPosts.id, ids));

  revalidateBlogAdminPaths();
  redirect("/admin/blog?saved=bulk-moved");
}

function readRequiredText(formData: FormData, key: string) {
  return readText(formData, key);
}

function withQuery(path: string, key: string, value: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(value)}`;
}

export async function saveBlogCategory(formData: FormData) {
  "use server";

  const returnTo = readText(formData, "returnTo") || "/admin/blog";
  const nameZh = readRequiredText(formData, "nameZh") || readRequiredText(formData, "inlineCategoryNameZh");
  const nameEn = readRequiredText(formData, "nameEn") || readRequiredText(formData, "inlineCategoryNameEn");
  const slug = readText(formData, "slug") || readText(formData, "inlineCategorySlug");

  const draft = buildBlogCategoryDraft({
    id: readOptionalNumber(formData, "id"),
    nameZh,
    nameEn,
    slug,
    sortOrder: readOptionalNumber(formData, "sortOrder"),
    isVisible: formData.get("isVisible") === "on",
  });

  const db = getDb();

  let savedId: number | null = null;

  if (draft.id) {
    await db
      .update(blogCategories)
      .set({
        nameZh: draft.nameZh,
        nameEn: draft.nameEn,
        slug: draft.slug,
        sortOrder: draft.sortOrder,
        isVisible: draft.isVisible,
      })
      .where(eq(blogCategories.id, draft.id));
    savedId = draft.id;
  } else {
    const [savedCategory] = await db
      .insert(blogCategories)
      .values({
        nameZh: draft.nameZh,
        nameEn: draft.nameEn,
        slug: draft.slug,
        sortOrder: draft.sortOrder,
        isVisible: draft.isVisible,
      })
      .returning({ id: blogCategories.id });
    savedId = savedCategory?.id ?? null;
  }

  revalidateBlogAdminPaths();
  let nextPath = withQuery(returnTo, "taxonomy", "category-saved");
  if (savedId) {
    nextPath = withQuery(nextPath, "newCategoryId", String(savedId));
  }
  redirect(nextPath);
}

export async function deleteBlogCategory(formData: FormData) {
  "use server";

  const categoryId = readOptionalNumber(formData, "id");
  const returnTo = readText(formData, "returnTo") || "/admin/blog";

  if (!categoryId) {
    redirect(returnTo);
  }

  const db = getDb();

  // 检查该分类下是否有已关联的博客文章，有则阻止删除
  const linkedPosts = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(eq(blogPosts.categoryId, categoryId))
    .limit(1);

  if (linkedPosts.length > 0) {
    // 分类下仍有文章，阻止删除，跳转回 UI 并提示错误
    redirect(withQuery(returnTo, "taxonomy", "category-delete-blocked"));
  }

  await db.delete(blogCategories).where(eq(blogCategories.id, categoryId));

  revalidateBlogAdminPaths();
  redirect(withQuery(returnTo, "taxonomy", "category-deleted"));
}


export async function saveBlogTag(formData: FormData) {
  "use server";

  const returnTo = readText(formData, "returnTo") || "/admin/blog";
  const nameZh = readRequiredText(formData, "nameZh") || readRequiredText(formData, "inlineTagNameZh");
  const nameEn = readRequiredText(formData, "nameEn") || readRequiredText(formData, "inlineTagNameEn");
  const slug = readText(formData, "slug") || readText(formData, "inlineTagSlug");

  const draft = buildBlogTagDraft({
    id: readOptionalNumber(formData, "id"),
    nameZh,
    nameEn,
    slug,
  });

  const db = getDb();

  if (draft.id) {
    await db
      .update(blogTags)
      .set({
        nameZh: draft.nameZh,
        nameEn: draft.nameEn,
        slug: draft.slug,
      })
      .where(eq(blogTags.id, draft.id));
  } else {
    await db.insert(blogTags).values({
      nameZh: draft.nameZh,
      nameEn: draft.nameEn,
      slug: draft.slug,
    });
  }

  revalidateBlogAdminPaths();
  const nextPath = withQuery(withQuery(returnTo, "taxonomy", "tag-saved"), "newTagName", draft.nameEn);
  redirect(nextPath);
}

export async function deleteBlogTag(formData: FormData) {
  "use server";

  const tagId = readOptionalNumber(formData, "id");
  const returnTo = readText(formData, "returnTo") || "/admin/blog";

  if (!tagId) {
    redirect(returnTo);
  }

  const db = getDb();
  await db.delete(blogTags).where(eq(blogTags.id, tagId));

  revalidateBlogAdminPaths();
  redirect(withQuery(returnTo, "taxonomy", "tag-deleted"));
}

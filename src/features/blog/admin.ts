import { toSlug } from "@/lib/slug";

type OptionalIdInput = number | null | undefined;

function trimValue(value?: string | null) {
  return value?.trim() ?? "";
}

function toOptionalId(value: OptionalIdInput) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

function toSortOrder(value?: number | null) {
  return typeof value === "number" && Number.isFinite(value) ? value : 100;
}

export function buildBlogCategoryDraft(input: {
  id?: number | null;
  nameZh: string;
  nameEn: string;
  slug?: string;
  sortOrder?: number | null;
  isVisible?: boolean;
}) {
  const nameEn = trimValue(input.nameEn);

  return {
    id: toOptionalId(input.id),
    nameZh: trimValue(input.nameZh),
    nameEn,
    slug: toSlug(trimValue(input.slug) || nameEn),
    sortOrder: toSortOrder(input.sortOrder),
    isVisible: input.isVisible ?? true,
  };
}

export function buildBlogTagDraft(input: {
  id?: number | null;
  nameZh: string;
  nameEn: string;
  slug?: string;
}) {
  const nameEn = trimValue(input.nameEn);

  return {
    id: toOptionalId(input.id),
    nameZh: trimValue(input.nameZh),
    nameEn,
    slug: toSlug(trimValue(input.slug) || nameEn),
  };
}

type AdminBlogFilterablePost = {
  id: number;
  titleZh: string;
  titleEn: string;
  slug: string;
  status: "draft" | "published";
  categoryId: number | null;
  categoryNameZh?: string | null;
  categoryNameEn?: string | null;
};

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

export function filterAdminBlogPosts<T extends AdminBlogFilterablePost>(
  posts: T[],
  options: {
    query?: string | null;
    status?: string | null;
    categoryId?: number | null;
  },
) {
  const query = normalize(options.query);
  const status =
    options.status === "draft" || options.status === "published" ? options.status : "";
  const categoryId = options.categoryId ?? null;

  return posts.filter((post) => {
    const matchesStatus = !status || post.status === status;
    const matchesCategory = !categoryId || post.categoryId === categoryId;
    const haystack = normalize(
      `${post.titleZh} ${post.titleEn} ${post.slug} ${post.categoryNameZh ?? ""} ${post.categoryNameEn ?? ""}`,
    );
    const matchesQuery = !query || haystack.includes(query);

    return matchesStatus && matchesCategory && matchesQuery;
  });
}

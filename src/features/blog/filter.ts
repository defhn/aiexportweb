type BlogFilterablePost = {
  slug: string;
  titleEn: string;
  excerptEn: string;
  categorySlug: string;
};

type FilterOptions = {
  query?: string | null;
  categorySlug?: string | null;
};

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

export function filterBlogPosts<T extends BlogFilterablePost>(
  posts: T[],
  options: FilterOptions,
) {
  const query = normalize(options.query);
  const categorySlug = normalize(options.categorySlug);

  return posts.filter((post) => {
    const matchesCategory = !categorySlug || post.categorySlug === categorySlug;
    const haystack = normalize(`${post.titleEn} ${post.excerptEn} ${post.categorySlug}`);
    const matchesQuery = !query || haystack.includes(query);

    return matchesCategory && matchesQuery;
  });
}

export function buildBlogCategoryFilters<T extends Pick<BlogFilterablePost, "categorySlug">>(
  posts: T[],
) {
  return [...new Set(posts.map((post) => post.categorySlug).filter(Boolean))].map((slug) => ({
    slug,
    label: slug.replace(/-/g, " "),
  }));
}

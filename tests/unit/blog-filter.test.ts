import { describe, expect, it } from "vitest";

import { buildBlogCategoryFilters, filterBlogPosts } from "@/features/blog/filter";

const posts = [
  {
    slug: "cnc-guide",
    titleEn: "How to Choose a CNC Supplier",
    excerptEn: "Compare quality systems, tolerances, and export delivery.",
    categorySlug: "cnc-guides",
  },
  {
    slug: "materials-guide",
    titleEn: "Aluminum 6061 vs 7075",
    excerptEn: "Material differences for export-grade machined parts.",
    categorySlug: "materials",
  },
  {
    slug: "compliance-guide",
    titleEn: "RoHS and REACH for Industrial Buyers",
    excerptEn: "Compliance documents global buyers often request.",
    categorySlug: "compliance",
  },
];

describe("blog filtering helpers", () => {
  it("filters by search keyword and category", () => {
    const filtered = filterBlogPosts(posts, {
      query: "material",
      categorySlug: "materials",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.slug).toBe("materials-guide");
  });

  it("builds unique category filters from published posts", () => {
    const filters = buildBlogCategoryFilters(posts);

    expect(filters).toEqual([
      { slug: "cnc-guides", label: "cnc guides" },
      { slug: "materials", label: "materials" },
      { slug: "compliance", label: "compliance" },
    ]);
  });
});

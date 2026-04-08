import { describe, expect, it } from "vitest";

import {
  buildBlogCategoryDraft,
  buildBlogTagDraft,
  filterAdminBlogPosts,
} from "@/features/blog/admin";

describe("blog admin helpers", () => {
  it("normalizes blog category drafts", () => {
    expect(
      buildBlogCategoryDraft({
        id: 8,
        nameZh: "  采购指南  ",
        nameEn: "  Procurement Guides ",
        slug: "",
        sortOrder: 20,
        isVisible: false,
      }),
    ).toEqual({
      id: 8,
      nameZh: "采购指南",
      nameEn: "Procurement Guides",
      slug: "procurement-guides",
      sortOrder: 20,
      isVisible: false,
    });
  });

  it("normalizes blog tag drafts", () => {
    expect(
      buildBlogTagDraft({
        id: 3,
        nameZh: "  铝件  ",
        nameEn: "  Aluminum Parts ",
        slug: "",
      }),
    ).toEqual({
      id: 3,
      nameZh: "铝件",
      nameEn: "Aluminum Parts",
      slug: "aluminum-parts",
    });
  });

  it("filters admin blog posts by query, status, and category", () => {
    const posts = [
      {
        id: 1,
        titleZh: "如何选择 CNC 供应商",
        titleEn: "How to Choose a CNC Supplier",
        slug: "how-to-choose-a-cnc-supplier",
        status: "published" as const,
        categoryId: 2,
        categoryNameZh: "采购指南",
        categoryNameEn: "Procurement Guides",
      },
      {
        id: 2,
        titleZh: "铝件表面处理对比",
        titleEn: "Anodizing vs Powder Coating",
        slug: "anodizing-vs-powder-coating",
        status: "draft" as const,
        categoryId: 5,
        categoryNameZh: "材料与工艺",
        categoryNameEn: "Materials",
      },
    ];

    expect(
      filterAdminBlogPosts(posts, {
        query: "supplier",
        status: "published",
        categoryId: 2,
      }),
    ).toHaveLength(1);

    expect(
      filterAdminBlogPosts(posts, {
        query: "powder",
        status: "published",
      }),
    ).toHaveLength(0);
  });
});

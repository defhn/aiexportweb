import { describe, expect, it } from "vitest";

import { buildBlogPostDraft } from "@/features/blog/actions";
import { createExcerptFallback } from "@/lib/rich-text";

describe("blog drafting helpers", () => {
  it("strips tags and trims to 160 characters", () => {
    const excerpt = createExcerptFallback(
      "<p>Precision machining parts for aerospace, automotive, and industrial buyers worldwide.</p>",
    );

    expect(excerpt).toBe(
      "Precision machining parts for aerospace, automotive, and industrial buyers worldwide.",
    );
  });

  it("adds an ellipsis when truncated", () => {
    const excerpt = createExcerptFallback(`<p>${"A".repeat(200)}</p>`, 20);

    expect(excerpt).toBe(`${"A".repeat(17)}...`);
  });

  it("builds a publish-ready blog draft with cover media and fallback slug", () => {
    expect(
      buildBlogPostDraft({
        categoryId: 1,
        titleZh: "如何选择 CNC 供应商",
        titleEn: " How to Choose a CNC Supplier ",
        slug: "",
        excerptZh: "",
        excerptEn: "",
        contentZh: "关注质量、沟通和交期。",
        contentEn:
          "<p>Focus on quality systems, communication, and delivery.</p>",
        coverMediaId: 22,
        seoTitle: "",
        seoDescription: "",
        status: "published",
        publishedAt: "",
        tags: "cnc machining, supplier",
      }),
    ).toMatchObject({
      slug: "how-to-choose-a-cnc-supplier",
      excerptEn: "Focus on quality systems, communication, and delivery.",
      coverMediaId: 22,
      seoTitle: "How to Choose a CNC Supplier",
      tags: ["cnc machining", "supplier"],
    });
  });
});

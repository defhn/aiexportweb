import { describe, expect, it } from "vitest";

import { parseBlogBulkIds } from "@/features/blog/actions";

describe("blog bulk helpers", () => {
  it("parses unique blog post ids", () => {
    const formData = new FormData();
    formData.append("selectedIds", "11");
    formData.append("selectedIds", "14");
    formData.append("selectedIds", "11");

    expect(parseBlogBulkIds(formData)).toEqual([11, 14]);
  });
});

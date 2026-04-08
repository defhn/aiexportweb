import { describe, expect, it } from "vitest";

import { appendRedirectFlag, parseSelectedIds } from "@/features/media/actions";

describe("appendRedirectFlag", () => {
  it("appends params to a clean path", () => {
    expect(appendRedirectFlag("/admin/media", "deleted")).toBe("/admin/media?deleted=1");
  });

  it("appends params to an existing query string", () => {
    expect(appendRedirectFlag("/admin/media?folder=8", "error", "in-use")).toBe(
      "/admin/media?folder=8&error=in-use",
    );
  });

  it("parses unique selected ids from form data", () => {
    const formData = new FormData();
    formData.append("selectedIds", "7");
    formData.append("selectedIds", "8");
    formData.append("selectedIds", "7");
    formData.append("selectedIds", "-1");

    expect(parseSelectedIds(formData, "selectedIds")).toEqual([7, 8]);
  });
});

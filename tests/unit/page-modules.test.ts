import { describe, expect, it } from "vitest";

import { extractFeaturedIds, normalizePageModules } from "@/features/pages/queries";

describe("page module helpers", () => {
  it("sorts enabled modules only", () => {
    const modules = normalizePageModules([
      { moduleKey: "cta", isEnabled: true, sortOrder: 30 },
      { moduleKey: "hero", isEnabled: true, sortOrder: 10 },
      { moduleKey: "clients", isEnabled: false, sortOrder: 20 },
    ]);

    expect(modules.map((module) => module.moduleKey)).toEqual(["hero", "cta"]);
  });

  it("extracts featured ids from module payload safely", () => {
    expect(
      extractFeaturedIds({
        featuredCategoryIds: [2, 4],
        featuredProductIds: [8, 9],
      }),
    ).toEqual({
      featuredCategoryIds: [2, 4],
      featuredProductIds: [8, 9],
    });
  });
});

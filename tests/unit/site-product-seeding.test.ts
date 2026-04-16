import { describe, expect, it } from "vitest";

import { defaultFieldDefinitions } from "@/db/seed/default-field-defs";
import { getSeedPack } from "@/db/seed";
import {
  buildCatalogProductsForPack,
  createSeedRunCheckpoint,
  getOverallProgress,
  markProductCompleted,
} from "@/scripts/site-product-seeding";

describe("site product seeding helpers", () => {
  it("tracks resumable progress across sites and products", () => {
    const checkpoint = createSeedRunCheckpoint([
      { siteSlug: "equipment-demo", seedPackKey: "industrial-equipment", totalProducts: 10 },
      { siteSlug: "building-demo", seedPackKey: "building-materials", totalProducts: 10 },
    ]);

    const afterFirst = markProductCompleted(checkpoint, "equipment-demo", "automatic-feeding-system");
    const afterSecond = markProductCompleted(afterFirst, "equipment-demo", "servo-conveyor-line");
    const progress = getOverallProgress(afterSecond);

    expect(progress.completedProducts).toBe(2);
    expect(progress.totalProducts).toBe(20);
    expect(progress.completedSites).toBe(0);
    expect(afterSecond.sites[0]?.status).toBe("in_progress");
    expect(afterSecond.sites[0]?.completedProductSlugs).toEqual([
      "automatic-feeding-system",
      "servo-conveyor-line",
    ]);
  });

  it("builds ten valid catalog products for a non-cnc pack", () => {
    const pack = getSeedPack("industrial-equipment");
    const validFieldKeys = new Set(defaultFieldDefinitions.map((field) => field.fieldKey));

    const products = buildCatalogProductsForPack(
      "industrial-equipment",
      pack.categories,
      pack.site.companyNameEn,
    );

    expect(products).toHaveLength(10);
    expect(new Set(products.map((product) => product.slug)).size).toBe(10);

    for (const product of products) {
      expect(pack.categories.some((category) => category.slug === product.categorySlug)).toBe(true);
      expect(product.nameEn).not.toMatch(/Product \d+/);
      expect(product.shortDescriptionEn).not.toContain("sample product");
      expect(Object.keys(product.defaultFields).every((key) => validFieldKeys.has(key))).toBe(true);
      expect(Object.keys(product.defaultFields)).not.toEqual(
        expect.arrayContaining(["price", "sku", "stock"]),
      );
    }
  });
});

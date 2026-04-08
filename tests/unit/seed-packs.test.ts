import { describe, expect, it } from "vitest";
import {
  blogPosts,
  inquiries,
  mediaAssets,
  pageModules,
  productCustomFields,
  seoAiSettings,
} from "@/db/schema";
import { defaultFieldDefinitions, getSeedPack } from "@/db/seed";

describe("seed packs and schema coverage", () => {
  it("includes the built-in manufacturing spec fields", () => {
    expect(defaultFieldDefinitions.map((field) => field.fieldKey)).toEqual(
      expect.arrayContaining([
        "model",
        "material",
        "lead_time",
        "certification",
      ]),
    );
  });

  it("exports the key business tables required by the spec", () => {
    expect(pageModules).toBeDefined();
    expect(mediaAssets).toBeDefined();
    expect(productCustomFields).toBeDefined();
    expect(blogPosts).toBeDefined();
    expect(inquiries).toBeDefined();
    expect(seoAiSettings).toBeDefined();
  });

  it("returns all three industry demo packs with products and fixed pages", () => {
    const cnc = getSeedPack("cnc");
    const industrial = getSeedPack("industrial-equipment");
    const building = getSeedPack("building-materials");

    expect(cnc.site.companyNameEn).toContain("Precision");
    expect(cnc.products.length).toBeGreaterThan(0);
    expect(cnc.pages.home.length).toBeGreaterThan(0);

    expect(industrial.categories.length).toBeGreaterThan(0);
    expect(industrial.products.length).toBeGreaterThan(0);
    expect(industrial.pages.home.length).toBeGreaterThan(0);

    expect(building.categories.length).toBeGreaterThan(0);
    expect(building.products.length).toBeGreaterThan(0);
    expect(building.pages.home.length).toBeGreaterThan(0);
  });

  it("ships the CNC demo pack with all configurable home modules", () => {
    const cnc = getSeedPack("cnc");

    expect(cnc.pages.home.map((module) => module.moduleKey)).toEqual(
      expect.arrayContaining([
        "hero",
        "strengths",
        "trust-signals",
        "featured-categories",
        "factory-capability",
        "quality-certifications",
        "featured-products",
        "process-steps",
        "latest-insights",
        "final-cta",
      ]),
    );
  });
});

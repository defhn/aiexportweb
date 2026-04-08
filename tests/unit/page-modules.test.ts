import { describe, expect, it } from "vitest";

import {
  buildModulePayload,
  extractFeaturedIds,
  mergePageModulesWithDefaults,
  normalizePageModules,
} from "@/features/pages/queries";

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

  it("builds module payload from flat form values", () => {
    expect(
      buildModulePayload("hero", {
        eyebrow: "Precision CNC Manufacturing",
        title: "Custom CNC Parts",
        description: "Export-ready machining support.",
        primaryCtaLabel: "Get a Quote",
        primaryCtaHref: "/contact",
      }),
    ).toMatchObject({
      eyebrow: "Precision CNC Manufacturing",
      title: "Custom CNC Parts",
      primaryCtaHref: "/contact",
    });
  });

  it("keeps list and scalar fields for configurable home modules", () => {
    expect(
      buildModulePayload("trust-signals", {
        title: "Trusted by global buyers",
        items: "Siemens\nBoeing\nTesla",
      }),
    ).toEqual({
      title: "Trusted by global buyers",
      items: ["Siemens", "Boeing", "Tesla"],
    });

    expect(
      buildModulePayload("quality-certifications", {
        eyebrow: "Quality",
        title: "Compliance you can verify",
        description: "Visible standards for every RFQ.",
        items: "ISO 9001|Quality management\nRoHS|Material compliance",
      }),
    ).toEqual({
      eyebrow: "Quality",
      title: "Compliance you can verify",
      description: "Visible standards for every RFQ.",
      items: ["ISO 9001|Quality management", "RoHS|Material compliance"],
    });

    expect(
      buildModulePayload("featured-products", {
        eyebrow: "Portfolio",
        title: "Recommended parts",
        ctaLabel: "View all",
        ctaHref: "/products",
        slugs: ["part-a", "part-b"],
      }),
    ).toEqual({
      eyebrow: "Portfolio",
      title: "Recommended parts",
      ctaLabel: "View all",
      ctaHref: "/products",
      slugs: ["part-a", "part-b"],
    });
  });

  it("merges database page modules with missing seed defaults", () => {
    const merged = mergePageModulesWithDefaults(
      [
        {
          moduleKey: "hero",
          moduleNameZh: "首屏横幅",
          moduleNameEn: "Hero",
          isEnabled: true,
          sortOrder: 10,
          payloadJson: { title: "Database Hero" },
        },
      ],
      [
        {
          moduleKey: "hero",
          moduleNameZh: "首屏横幅",
          moduleNameEn: "Hero",
          isEnabled: true,
          sortOrder: 10,
          payloadJson: { title: "Seed Hero", description: "Seed description" },
        },
        {
          moduleKey: "latest-insights",
          moduleNameZh: "博客入口",
          moduleNameEn: "Latest Insights",
          isEnabled: true,
          sortOrder: 90,
          payloadJson: { title: "Seed blog section" },
        },
      ],
    );

    expect(merged).toHaveLength(2);
    expect(merged[0]).toMatchObject({
      moduleKey: "hero",
      payloadJson: {
        title: "Database Hero",
        description: "Seed description",
      },
    });
    expect(merged[1]).toMatchObject({
      moduleKey: "latest-insights",
    });
  });
});

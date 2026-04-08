import { describe, expect, it } from "vitest";

import {
  buildCncDemoCategories,
  buildCncDemoProducts,
  buildCncProductImageSvg,
} from "@/features/demo-catalog/cnc-catalog";

describe("cnc demo catalog", () => {
  it("provides three categories and ten products", () => {
    const categories = buildCncDemoCategories();
    const products = buildCncDemoProducts();

    expect(categories).toHaveLength(3);
    expect(products).toHaveLength(10);
    expect(new Set(products.map((item) => item.slug)).size).toBe(10);
    expect(products.map((item) => item.slug)).toContain("custom-aluminum-cnc-bracket");
    expect(products.map((item) => item.slug)).toContain("custom-sensor-mount");
  });

  it("includes the standard default fields for each product", () => {
    const product = buildCncDemoProducts()[0];

    expect(product.defaultFields.model?.valueEn).toBeTruthy();
    expect(product.defaultFields.material?.valueEn).toBeTruthy();
    expect(product.defaultFields.process?.valueEn).toBeTruthy();
    expect(product.defaultFields.tolerance?.valueEn).toBeTruthy();
    expect(product.defaultFields.application?.valueEn).toBeTruthy();
    expect(product.defaultFields.certification?.valueEn).toBeTruthy();
  });

  it("builds a catalog svg for white-background product shots", () => {
    const product = buildCncDemoProducts()[0];
    const svg = buildCncProductImageSvg(product, "catalog");

    expect(svg).toContain("<svg");
    expect(svg).toContain("Precision CNC Components Co., Ltd.");
    expect(svg).toContain(product.nameEn);
    expect(svg).toContain("white catalog render");
  });

  it("builds a scene svg for industrial application visuals", () => {
    const product = buildCncDemoProducts()[1];
    const svg = buildCncProductImageSvg(product, "scene");

    expect(svg).toContain("<svg");
    expect(svg).toContain(product.nameEn);
    expect(svg).toContain("industrial machining scene");
    expect(svg).toContain(product.defaultFields.application?.valueEn ?? "");
  });
});

import { describe, expect, it } from "vitest";

import {
  getPreferredProductImageUrl,
  getPublicProductImageFallback,
} from "@/features/products/image-map";

describe("product image mapping", () => {
  it("maps known cnc product slugs to public product images", () => {
    expect(getPublicProductImageFallback("precision-steel-drive-shaft")).toBe(
      "/images/products/steel-drive-shaft.png",
    );
  });

  it("prefers the local public image over generated svg catalog renders", () => {
    expect(
      getPreferredProductImageUrl({
        slug: "precision-steel-drive-shaft",
        currentUrl:
          "https://example.com/image/2026/04/1775647691831-precision-steel-drive-shaft-catalog.svg",
      }),
    ).toBe("/images/products/steel-drive-shaft.png");
  });
});

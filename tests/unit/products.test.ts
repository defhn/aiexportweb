import { describe, expect, it } from "vitest";

import {
  buildAssetKey,
  getAssetKindFromMimeType,
  isSupportedUploadMimeType,
} from "@/lib/r2";
import { buildProductPdfBinding } from "@/features/products/actions";

describe("R2 helpers and product file bindings", () => {
  it("generates stable asset keys with folders", () => {
    expect(buildAssetKey("image", "hero.jpg")).toMatch(/^image\/\d{4}\/\d{2}\//);
  });

  it("maps supported file types to the correct asset kind", () => {
    expect(getAssetKindFromMimeType("application/pdf")).toBe("file");
    expect(getAssetKindFromMimeType("image/jpeg")).toBe("image");
    expect(isSupportedUploadMimeType("application/x-msdownload")).toBe(false);
  });

  it("builds a product pdf binding payload", () => {
    expect(
      buildProductPdfBinding({
        productId: 8,
        mediaId: 12,
        showDownloadButton: true,
      }),
    ).toEqual({
      productId: 8,
      pdfFileId: 12,
      showDownloadButton: true,
    });
  });
});

import { describe, expect, it } from "vitest";

import {
  buildAssetKey,
  getAssetKindFromMimeType,
  isSupportedUploadMimeType,
} from "@/lib/r2";
import { buildProductPdfBinding } from "@/features/products/actions";
import {
  buildProductDetailViewModel,
  buildVisibleSpecRows,
} from "@/features/products/queries";

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

  it("builds visible spec rows with built-in and custom fields", () => {
    const rows = buildVisibleSpecRows({
      defaultFields: [
        {
          labelEn: "Material",
          valueEn: "Aluminum 6061",
          isVisible: true,
          sortOrder: 20,
        },
        {
          labelEn: "MOQ",
          valueEn: "500 pcs",
          isVisible: false,
          sortOrder: 30,
        },
      ],
      customFields: [
        {
          labelEn: "Waterproof Rating",
          valueEn: "IP65",
          isVisible: true,
          sortOrder: 10,
        },
      ],
    });

    expect(rows).toEqual([
      { label: "Waterproof Rating", value: "IP65" },
      { label: "Material", value: "Aluminum 6061" },
    ]);
  });

  it("builds a product detail view model with FAQ and related items", () => {
    const viewModel = buildProductDetailViewModel({
      product: {
        nameEn: "Custom Aluminum CNC Bracket",
        showDownloadButton: true,
      },
      defaultFields: [
        {
          labelEn: "Material",
          valueEn: "Aluminum 6061",
          isVisible: true,
          sortOrder: 10,
        },
      ],
      customFields: [
        {
          labelEn: "Waterproof Rating",
          valueEn: "IP65",
          isVisible: true,
          sortOrder: 20,
        },
      ],
      faqs: [{ question: "Can you support OEM drawings?", answer: "Yes." }],
      relatedProducts: [{ id: 2, nameEn: "CNC Housing" }],
      pdfUrl: "#",
      shortDescriptionEn: "Built for OEM applications.",
    });

    expect(
      buildVisibleSpecRows({
        defaultFields: viewModel.defaultFields,
        customFields: viewModel.customFields,
      }),
    ).toHaveLength(2);
    expect(viewModel.showDownloadButton).toBe(true);
    expect(viewModel.faqs[0]?.question).toContain("OEM");
    expect(viewModel.relatedProducts[0]?.nameEn).toBe("CNC Housing");
  });
});

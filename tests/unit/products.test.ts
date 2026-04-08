import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildCategoryDraft,
  buildProductCustomFieldDrafts,
  buildProductDraft,
  buildProductMediaBindingDraft,
  buildProductPdfBinding,
} from "@/features/products/actions";
import {
  buildProductDetailViewModel,
  buildVisibleSpecRows,
  listAdminProducts,
} from "@/features/products/queries";
import {
  buildAssetKey,
  getAssetKindFromMimeType,
  isSupportedUploadMimeType,
} from "@/lib/r2";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("R2 helpers and product management", () => {
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

  it("normalizes product media bindings and keeps unique gallery assets", () => {
    expect(
      buildProductMediaBindingDraft({
        coverMediaId: 7,
        pdfFileId: 12,
        galleryMediaIds: [9, 7, 9, 11, -1, Number.NaN],
      }),
    ).toEqual({
      coverMediaId: 7,
      pdfFileId: 12,
      galleryMediaIds: [9, 7, 11],
    });
  });

  it("normalizes category drafts with image selection", () => {
    expect(
      buildCategoryDraft({
        nameZh: "铝件加工",
        nameEn: " Aluminum Machining Parts ",
        slug: "",
        summaryZh: "轻量化结构件",
        summaryEn: "Lightweight structural parts",
        imageMediaId: 18,
        sortOrder: 20,
        isVisible: true,
        isFeatured: false,
      }),
    ).toMatchObject({
      nameEn: "Aluminum Machining Parts",
      slug: "aluminum-machining-parts",
      imageMediaId: 18,
      sortOrder: 20,
      isVisible: true,
    });
  });

  it("normalizes product drafts and derives seo fallbacks", () => {
    expect(
      buildProductDraft({
        categoryId: 2,
        nameZh: "定制铝合金支架",
        nameEn: " Custom Aluminum CNC Bracket ",
        slug: "",
        shortDescriptionZh: "轻量化支架",
        shortDescriptionEn: "Export-ready bracket",
        detailsZh: "支持图纸定制",
        detailsEn: "Supports custom drawings.",
        seoTitle: "",
        seoDescription: "",
        sortOrder: 10,
        status: "published",
        isFeatured: true,
        showInquiryButton: true,
        showWhatsappButton: false,
        showPdfDownload: true,
      }),
    ).toMatchObject({
      nameEn: "Custom Aluminum CNC Bracket",
      slug: "custom-aluminum-cnc-bracket",
      seoTitle: "Custom Aluminum CNC Bracket",
      seoDescription: "Export-ready bracket",
      showWhatsappButton: false,
    });
  });

  it("filters empty custom field rows and keeps explicit visibility", () => {
    expect(
      buildProductCustomFieldDrafts([
        {
          labelZh: "硬度",
          labelEn: "Hardness",
          valueZh: "HB95",
          valueEn: "HB95",
          isVisible: true,
        },
        {
          labelZh: "",
          labelEn: "",
          valueZh: "",
          valueEn: "",
          isVisible: false,
        },
      ]),
    ).toEqual([
      {
        labelZh: "硬度",
        labelEn: "Hardness",
        valueZh: "HB95",
        valueEn: "HB95",
        inputType: "text",
        isVisible: true,
        sortOrder: 10,
      },
    ]);
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

  it("filters admin products by keyword and status in seed mode", async () => {
    vi.stubEnv("DATABASE_URL", "");

    const onlyBracket = await listAdminProducts("cnc", {
      query: "Bracket",
      status: "published",
    });
    const onlyDrafts = await listAdminProducts("cnc", {
      status: "draft",
    });

    expect(onlyBracket).toHaveLength(1);
    expect(onlyBracket[0]?.slug).toBe("custom-aluminum-cnc-bracket");
    expect(onlyDrafts).toHaveLength(0);
  });
});

import { describe, expect, it } from "vitest";

import {
  buildDownloadFileDraft,
  buildMediaAssetMetaDraft,
} from "@/features/media/actions";

describe("download file drafts", () => {
  it("normalizes create and update payloads", () => {
    expect(
      buildDownloadFileDraft({
        id: 3,
        mediaAssetId: 8,
        productId: null,
        displayNameZh: " 规格书 ",
        displayNameEn: " Spec Sheet ",
        category: "datasheet",
        language: "en",
        description: " Main product specs ",
        isVisible: false,
        sortOrder: 20,
      }),
    ).toEqual({
      id: 3,
      mediaAssetId: 8,
      productId: null,
      displayNameZh: "规格书",
      displayNameEn: "Spec Sheet",
      category: "datasheet",
      language: "en",
      description: "Main product specs",
      isVisible: false,
      sortOrder: 20,
    });
  });
});

describe("media asset meta drafts", () => {
  it("normalizes file name and alt texts", () => {
    expect(
      buildMediaAssetMetaDraft({
        id: 12,
        fileName: " bracket-cover .png ",
        altTextZh: " 铝合金支架主图 ",
        altTextEn: " Aluminum bracket hero image ",
      }),
    ).toEqual({
      id: 12,
      fileName: "bracket-cover .png",
      folderId: null,
      altTextZh: "铝合金支架主图",
      altTextEn: "Aluminum bracket hero image",
    });
  });
});

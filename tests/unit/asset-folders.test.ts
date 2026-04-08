import { describe, expect, it } from "vitest";

import {
  buildAssetFolderBreadcrumbs,
  buildAssetFolderDraft,
  buildAssetFolderTree,
} from "@/features/media/folders";

describe("asset folder helpers", () => {
  it("normalizes folder drafts with parent ids", () => {
    expect(
      buildAssetFolderDraft({
        id: 5,
        assetType: "image",
        name: "  Drive Shaft  ",
        parentId: 2,
        sortOrder: 20,
      }),
    ).toEqual({
      id: 5,
      assetType: "image",
      name: "Drive Shaft",
      parentId: 2,
      sortOrder: 20,
    });
  });

  it("builds an infinite-level folder tree", () => {
    const tree = buildAssetFolderTree([
      { id: 1, assetType: "image", name: "产品图库", parentId: null, sortOrder: 10 },
      { id: 2, assetType: "image", name: "CNC", parentId: 1, sortOrder: 10 },
      { id: 3, assetType: "image", name: "Drive Shaft", parentId: 2, sortOrder: 10 },
      { id: 4, assetType: "image", name: "Blog", parentId: null, sortOrder: 20 },
    ]);

    expect(tree).toHaveLength(2);
    expect(tree[0]?.children[0]?.children[0]?.name).toBe("Drive Shaft");
  });

  it("builds breadcrumbs for a nested folder", () => {
    const breadcrumbs = buildAssetFolderBreadcrumbs(
      [
        { id: 1, assetType: "image", name: "产品图库", parentId: null, sortOrder: 10 },
        { id: 2, assetType: "image", name: "CNC", parentId: 1, sortOrder: 10 },
        { id: 3, assetType: "image", name: "Drive Shaft", parentId: 2, sortOrder: 10 },
      ],
      3,
    );

    expect(breadcrumbs.map((item) => item.name)).toEqual([
      "产品图库",
      "CNC",
      "Drive Shaft",
    ]);
  });
});

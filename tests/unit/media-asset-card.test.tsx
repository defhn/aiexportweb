import { render, screen } from "@testing-library/react";

import { MediaAssetCard } from "@/components/admin/media-asset-card";

describe("MediaAssetCard", () => {
  it("renders a compact asset card with header actions and bilingual alt fields", () => {
    render(
      <MediaAssetCard
        asset={{
          id: 39,
          fileName: "cnc-machined-housing-scene.svg",
          url: "https://example.com/cnc-machined-housing-scene.svg",
          mimeType: "image/svg+xml",
          width: 1600,
          height: 1200,
          altTextZh: "CNC 精密加工外壳工业场景图",
          altTextEn: "CNC Machined Housing industrial scene",
          folderId: 8,
        }}
        folderOptions={[
          { id: 8, depth: 1, label: "└ CNC Machined Housing" },
          { id: 9, depth: 1, label: "└ Precision Turning Parts" },
        ]}
        returnTo="/admin/media?folder=8"
      />,
    );

    expect(screen.getByText("cnc-machined-housing-scene.svg")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "复制链接" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "移动到文件夹" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "删除图片" })).toBeInTheDocument();
    expect(screen.getByLabelText("中文名")).toHaveValue("CNC 精密加工外壳工业场景图");
    expect(screen.getByLabelText("英文名")).toHaveValue("CNC Machined Housing industrial scene");
  });
});

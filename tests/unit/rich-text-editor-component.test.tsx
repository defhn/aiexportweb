import { render, screen } from "@testing-library/react";

import { RichTextEditor } from "@/components/admin/rich-text-editor";

describe("RichTextEditor", () => {
  it("renders a sticky toolbar, hidden input, and image actions", () => {
    render(
      <RichTextEditor
        label="正文（英文）"
        name="contentEn"
        defaultValue="<p>Hello world</p>"
        assets={[
          {
            id: 1,
            fileName: "bracket-cover.jpg",
            url: "https://example.com/bracket-cover.jpg",
            altTextEn: "CNC bracket",
            altTextZh: "CNC 支架",
          },
        ]}
      />,
    );

    expect(screen.getByText("正文（英文）")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "插入图片" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "上传图片" })).toBeInTheDocument();

    const hiddenInput = screen.getByDisplayValue("<p>Hello world</p>");
    expect(hiddenInput).toHaveAttribute("type", "hidden");

    const toolbar = screen.getByTestId("rich-text-toolbar");
    expect(toolbar.className).toContain("sticky");
  });
});

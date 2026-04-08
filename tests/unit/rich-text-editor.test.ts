import { describe, expect, it } from "vitest";

import {
  buildEditorFigureHtml,
  normalizeEditorHtml,
} from "@/lib/rich-text-editor";

describe("rich text editor helpers", () => {
  it("wraps plain text into editor paragraphs", () => {
    expect(normalizeEditorHtml("Line one\n\nLine two")).toBe(
      "<p>Line one</p><p>Line two</p>",
    );
  });

  it("keeps block html untouched", () => {
    expect(normalizeEditorHtml("<h2>Heading</h2><p>Body</p>")).toBe(
      "<h2>Heading</h2><p>Body</p>",
    );
  });

  it("builds image figures with caption and alt text", () => {
    expect(
      buildEditorFigureHtml({
        url: "https://example.com/bracket.jpg",
        alt: "CNC bracket",
        caption: "Machined aluminum bracket",
      }),
    ).toBe(
      '<figure data-asset-type="image"><img src="https://example.com/bracket.jpg" alt="CNC bracket" /><figcaption>Machined aluminum bracket</figcaption></figure>',
    );
  });
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const BLOCK_TAG_PATTERN = /<(p|h[1-6]|ul|ol|li|blockquote|pre|figure|table|hr|div|img|section|article|aside)\b/i;

export function normalizeEditorHtml(value?: string | null) {
  const raw = value?.trim() ?? "";

  if (!raw) {
    return "<p></p>";
  }

  if (BLOCK_TAG_PATTERN.test(raw)) {
    return raw;
  }

  return raw
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("");
}

export function buildEditorFigureHtml(input: {
  url: string;
  alt?: string | null;
  caption?: string | null;
}) {
  const alt = escapeHtml((input.alt ?? "").trim());
  const caption = (input.caption ?? "").trim();
  const figure = [
    `<figure data-asset-type="image">`,
    `<img src="${escapeHtml(input.url)}" alt="${alt}" />`,
    caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : "",
    `</figure>`,
  ].join("");

  return figure;
}

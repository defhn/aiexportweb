export function createExcerptFallback(html: string, maxLength = 160) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}…`;
}

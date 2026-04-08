import { createExcerptFallback } from "@/lib/rich-text";
import { toSlug } from "@/lib/slug";

export function buildBlogDraft(input: {
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  excerptZh?: string;
  excerptEn?: string;
}) {
  return {
    titleZh: input.titleZh.trim(),
    titleEn: input.titleEn.trim(),
    slug: toSlug(input.titleEn),
    contentZh: input.contentZh.trim(),
    contentEn: input.contentEn.trim(),
    excerptZh: input.excerptZh?.trim() || createExcerptFallback(input.contentZh),
    excerptEn: input.excerptEn?.trim() || createExcerptFallback(input.contentEn),
  };
}

/**
 * 浜у搧鐩稿叧绾伐鍏峰嚱鏁?& 绫诲瀷瀹氫箟
 * 鈿狅笍 姝ゆ枃浠朵笉鍚?"use server"锛屽彲琚?Client / Server Component 鍚屾椂 import銆? */

import { toSlug } from "@/lib/slug";

// 鈹€鈹€鈹€ 绫诲瀷瀹氫箟 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export type CategoryDraftInput = {
  nameZh: string;
  nameEn: string;
  slug?: string;
  summaryZh?: string;
  summaryEn?: string;
  imageMediaId?: number | null;
  sortOrder?: number;
  isVisible?: boolean;
  isFeatured?: boolean;
};

export type ProductDraftInput = {
  categoryId?: number | null;
  nameZh: string;
  nameEn: string;
  slug?: string;
  shortDescriptionZh?: string;
  shortDescriptionEn?: string;
  detailsZh?: string;
  detailsEn?: string;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder?: number;
  status?: "draft" | "published";
  isFeatured?: boolean;
  showInquiryButton?: boolean;
  showWhatsappButton?: boolean;
  showPdfDownload?: boolean;
  coverMediaId?: number | null;
  pdfFileId?: number | null;
  faqsJson?: Array<{ question: string; answer: string }>;
};

export type ProductCustomFieldDraftInput = {
  labelZh?: string;
  labelEn?: string;
  valueZh?: string;
  valueEn?: string;
  isVisible?: boolean;
};

// 鈹€鈹€鈹€ 鍐呴儴杈呭姪鍑芥暟 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export function trimValue(value?: string | null) {
  return value?.trim() ?? "";
}

export function toNullable(value?: string | null) {
  const trimmed = trimValue(value);
  return trimmed.length > 0 ? trimmed : null;
}

export function toSafeNumber(value?: number | null, fallback = 100) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function toOptionalId(value?: number | null) {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : null;
}

// 鈹€鈹€鈹€ FormData 璇诲彇宸ュ叿 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function readOptionalNumber(formData: FormData, key: string) {
  const value = readText(formData, key);
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function readCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export function readIdList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) =>
      typeof value === "string" ? Number.parseInt(value.trim(), 10) : Number.NaN,
    )
    .filter((value) => Number.isInteger(value) && value > 0);
}

// 鈹€鈹€鈹€ ID 瑙ｆ瀽 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export function parseProductBulkIds(formData: FormData, key = "selectedIds") {
  return Array.from(new Set(readIdList(formData, key)));
}

export function parseCategoryBulkIds(formData: FormData, key = "selectedIds") {
  return Array.from(new Set(readIdList(formData, key)));
}

// 鈹€鈹€鈹€ Draft Builder 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export function buildCategoryDraft(input: CategoryDraftInput) {
  const nameEn = trimValue(input.nameEn);

  return {
    nameZh: trimValue(input.nameZh),
    nameEn,
    slug: toSlug(trimValue(input.slug) || nameEn),
    summaryZh: toNullable(input.summaryZh),
    summaryEn: toNullable(input.summaryEn),
    imageMediaId: toOptionalId(input.imageMediaId),
    sortOrder: toSafeNumber(input.sortOrder, 100),
    isVisible: input.isVisible ?? true,
    isFeatured: input.isFeatured ?? false,
  };
}

export function buildProductDraft(input: ProductDraftInput) {
  const nameEn = trimValue(input.nameEn);
  const shortDescriptionEn = toNullable(input.shortDescriptionEn);
  const status: "draft" | "published" =
    input.status === "published" ? "published" : "draft";

  return {
    categoryId: input.categoryId ?? null,
    nameZh: trimValue(input.nameZh),
    nameEn,
    slug: toSlug(trimValue(input.slug) || nameEn),
    shortDescriptionZh: toNullable(input.shortDescriptionZh),
    shortDescriptionEn,
    detailsZh: toNullable(input.detailsZh),
    detailsEn: toNullable(input.detailsEn),
    seoTitle: toNullable(input.seoTitle) ?? nameEn,
    seoDescription: toNullable(input.seoDescription) ?? shortDescriptionEn ?? nameEn,
    sortOrder: toSafeNumber(input.sortOrder, 100),
    status,
    isFeatured: input.isFeatured ?? false,
    showInquiryButton: input.showInquiryButton ?? true,
    showWhatsappButton: input.showWhatsappButton ?? true,
    showPdfDownload: input.showPdfDownload ?? false,
    coverMediaId: toOptionalId(input.coverMediaId),
    pdfFileId: toOptionalId(input.pdfFileId),
    faqsJson: input.faqsJson ?? [],
  };
}

export function buildProductCustomFieldDrafts(
  rows: ProductCustomFieldDraftInput[],
) {
  return rows
    .map((row, index) => ({
      labelZh: trimValue(row.labelZh),
      labelEn: trimValue(row.labelEn),
      valueZh: toNullable(row.valueZh),
      valueEn: toNullable(row.valueEn),
      inputType: "text" as const,
      isVisible: row.isVisible ?? true,
      sortOrder: (index + 1) * 10,
    }))
    .filter(
      (row) =>
        (row.labelZh || row.labelEn) &&
        (row.valueZh !== null || row.valueEn !== null),
    );
}

export function buildProductMediaBindingDraft(input: {
  coverMediaId?: number | null;
  pdfFileId?: number | null;
  galleryMediaIds?: number[];
}) {
  const galleryMediaIds: number[] = [];
  const seen = new Set<number>();

  for (const value of input.galleryMediaIds ?? []) {
    if (!Number.isInteger(value) || value <= 0 || seen.has(value)) {
      continue;
    }
    seen.add(value);
    galleryMediaIds.push(value);
  }

  return {
    coverMediaId: toOptionalId(input.coverMediaId),
    pdfFileId: toOptionalId(input.pdfFileId),
    galleryMediaIds,
  };
}

export function buildProductPdfBinding(input: {
  productId: number;
  mediaId: number;
  showDownloadButton: boolean;
}) {
  const binding = buildProductMediaBindingDraft({
    pdfFileId: input.mediaId,
  });

  return {
    productId: input.productId,
    pdfFileId: binding.pdfFileId ?? input.mediaId,
    showDownloadButton: input.showDownloadButton,
  };
}

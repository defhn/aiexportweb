// 纯工具函数，无副作用，可�?Server & Client 双向导入

import { getAssetKindFromMimeType } from "@/lib/r2";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CreateMediaAssetInput = {
  bucketKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  folderId?: number | null;
  width?: number | null;
  height?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
  isPublic?: boolean;
};

export type DownloadFileDraftInput = {
  id?: number | null;
  mediaAssetId: number;
  productId?: number | null;
  displayNameZh: string;
  displayNameEn: string;
  category?: string | null;
  language?: string | null;
  description?: string | null;
  isVisible?: boolean;
  sortOrder?: number | null;
};

export type MediaAssetMetaDraftInput = {
  id?: number | null;
  fileName: string;
  folderId?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
};

// ─── Private helpers ─────────────────────────────────────────────────────────

function toSafeId(value?: number | null) {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : null;
}

function toSafeNumber(value?: number | null, fallback = 100) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

// ─── Exported builders ───────────────────────────────────────────────────────

export function buildMediaAssetRecord(input: CreateMediaAssetInput) {
  return {
    assetType: getAssetKindFromMimeType(input.mimeType),
    bucketKey: input.bucketKey,
    url: input.url,
    fileName: input.fileName,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
    folderId: toSafeId(input.folderId),
    width: input.width ?? null,
    height: input.height ?? null,
    altTextZh: input.altTextZh ?? null,
    altTextEn: input.altTextEn ?? null,
    isPublic: input.isPublic ?? true,
  } as const;
}

export function buildDownloadFileDraft(input: DownloadFileDraftInput) {
  return {
    id:
      typeof input.id === "number" &&
      Number.isInteger(input.id) &&
      input.id > 0
        ? input.id
        : null,
    mediaAssetId: input.mediaAssetId,
    productId:
      typeof input.productId === "number" &&
      Number.isInteger(input.productId) &&
      input.productId > 0
        ? input.productId
        : null,
    displayNameZh: input.displayNameZh.trim(),
    displayNameEn: input.displayNameEn.trim(),
    category: input.category?.trim() || null,
    language: input.language?.trim() || null,
    description: input.description?.trim() || null,
    isVisible: input.isVisible ?? true,
    sortOrder: toSafeNumber(input.sortOrder, 100),
  };
}

export function buildMediaAssetMetaDraft(input: MediaAssetMetaDraftInput) {
  return {
    id: toSafeId(input.id),
    fileName: input.fileName.trim(),
    folderId: toSafeId(input.folderId),
    altTextZh: input.altTextZh?.trim() || null,
    altTextEn: input.altTextEn?.trim() || null,
  };
}

export function appendRedirectFlag(returnTo: string, key: string, value = "1") {
  const [pathname, search = ""] = returnTo.split("?");
  const params = new URLSearchParams(search);
  params.set(key, value);
  const nextSearch = params.toString();
  return nextSearch ? `${pathname}?${nextSearch}` : (pathname ?? "/");
}

export function parseSelectedIds(formData: FormData, key = "selectedIds") {
  return Array.from(
    new Set(
      formData
        .getAll(key)
        .map((value) =>
          typeof value === "string"
            ? Number.parseInt(value.trim(), 10)
            : Number.NaN,
        )
        .filter(
          (value) => Number.isInteger(value) && value > 0,
        ),
    ),
  );
}

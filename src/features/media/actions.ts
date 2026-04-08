import { getDb } from "@/db/client";
import { downloadFiles, mediaAssets } from "@/db/schema";
import { getAssetKindFromMimeType } from "@/lib/r2";

export type CreateMediaAssetInput = {
  bucketKey: string;
  url: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
  isPublic?: boolean;
};

export function buildMediaAssetRecord(input: CreateMediaAssetInput) {
  return {
    assetType: getAssetKindFromMimeType(input.mimeType),
    bucketKey: input.bucketKey,
    url: input.url,
    fileName: input.fileName,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
    width: input.width ?? null,
    height: input.height ?? null,
    altTextZh: input.altTextZh ?? null,
    altTextEn: input.altTextEn ?? null,
    isPublic: input.isPublic ?? true,
  } as const;
}

export async function createMediaAsset(input: CreateMediaAssetInput) {
  const db = getDb();
  const [asset] = await db
    .insert(mediaAssets)
    .values(buildMediaAssetRecord(input))
    .returning();

  return asset;
}

export async function createDownloadFileRecord(input: {
  mediaAssetId: number;
  productId?: number | null;
  displayNameZh: string;
  displayNameEn: string;
  isVisible?: boolean;
  sortOrder?: number;
}) {
  const db = getDb();
  const [record] = await db
    .insert(downloadFiles)
    .values({
      mediaAssetId: input.mediaAssetId,
      productId: input.productId ?? null,
      displayNameZh: input.displayNameZh,
      displayNameEn: input.displayNameEn,
      isVisible: input.isVisible ?? true,
      sortOrder: input.sortOrder ?? 100,
    })
    .returning();

  return record;
}

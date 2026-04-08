import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  assetFolders,
  downloadFiles,
  mediaAssets,
} from "@/db/schema";
import { buildAssetFolderDraft } from "@/features/media/folders";
import { deleteFromR2, getAssetKindFromMimeType } from "@/lib/r2";

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

export async function createMediaAsset(input: CreateMediaAssetInput) {
  const db = getDb();
  const [asset] = await db
    .insert(mediaAssets)
    .values(buildMediaAssetRecord(input))
    .returning();

  return asset;
}

export async function saveAssetFolder(formData: FormData) {
  "use server";

  const assetType = readText(formData, "assetType") === "file" ? "file" : "image";
  const returnTo = readText(formData, "returnTo") || `/admin/${assetType === "image" ? "media" : "files"}`;
  const draft = buildAssetFolderDraft({
    id: readOptionalNumber(formData, "id"),
    assetType,
    name: readText(formData, "name"),
    parentId: readOptionalNumber(formData, "parentId"),
    sortOrder: readOptionalNumber(formData, "sortOrder"),
  });

  const db = getDb();

  if (draft.id) {
    await db
      .update(assetFolders)
      .set({
        name: draft.name,
        parentId: draft.parentId,
        sortOrder: draft.sortOrder,
      })
      .where(eq(assetFolders.id, draft.id));
  } else {
    await db.insert(assetFolders).values({
      assetType: draft.assetType,
      name: draft.name,
      parentId: draft.parentId,
      sortOrder: draft.sortOrder,
    });
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");
  redirect(appendRedirectFlag(returnTo, "folderSaved"));
}

export async function deleteAssetFolder(formData: FormData) {
  "use server";

  const id = readOptionalNumber(formData, "id");
  const assetType = readText(formData, "assetType") === "file" ? "file" : "image";
  const returnTo = readText(formData, "returnTo") || `/admin/${assetType === "image" ? "media" : "files"}`;

  if (!id) {
    redirect(returnTo);
  }

  const db = getDb();
  const [hasChild] = await db
    .select({ id: assetFolders.id })
    .from(assetFolders)
    .where(eq(assetFolders.parentId, id))
    .limit(1);
  const [hasAsset] = await db
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .where(eq(mediaAssets.folderId, id))
    .limit(1);

  if (hasChild || hasAsset) {
    redirect(appendRedirectFlag(returnTo, "folderError", "not-empty"));
  }

  await db.delete(assetFolders).where(eq(assetFolders.id, id));

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");
  redirect(appendRedirectFlag(returnTo, "folderDeleted"));
}

export async function createDownloadFileRecord(input: {
  mediaAssetId: number;
  productId?: number | null;
  displayNameZh: string;
  displayNameEn: string;
  category?: string | null;
  language?: string | null;
  description?: string | null;
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
      category: input.category ?? null,
      language: input.language ?? null,
      description: input.description ?? null,
      isVisible: input.isVisible ?? true,
      sortOrder: input.sortOrder ?? 100,
    })
    .returning();

  return record;
}

type DownloadFileDraftInput = {
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

type MediaAssetMetaDraftInput = {
  id?: number | null;
  fileName: string;
  folderId?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
};

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalNumber(formData: FormData, key: string) {
  const value = readText(formData, key);

  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toSafeNumber(value?: number | null, fallback = 100) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toSafeId(value?: number | null) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

export function appendRedirectFlag(returnTo: string, key: string, value = "1") {
  const [pathname, search = ""] = returnTo.split("?");
  const params = new URLSearchParams(search);
  params.set(key, value);
  const nextSearch = params.toString();
  return nextSearch ? `${pathname}?${nextSearch}` : pathname;
}

export function parseSelectedIds(formData: FormData, key = "selectedIds") {
  return Array.from(
    new Set(
      formData
        .getAll(key)
        .map((value) =>
          typeof value === "string" ? Number.parseInt(value.trim(), 10) : Number.NaN,
        )
        .filter((value) => Number.isInteger(value) && value > 0),
    ),
  );
}

export function buildDownloadFileDraft(input: DownloadFileDraftInput) {
  return {
    id: typeof input.id === "number" && Number.isInteger(input.id) && input.id > 0 ? input.id : null,
    mediaAssetId: input.mediaAssetId,
    productId:
      typeof input.productId === "number" && Number.isInteger(input.productId) && input.productId > 0
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

export async function saveMediaAssetMeta(formData: FormData) {
  "use server";

  const id = readOptionalNumber(formData, "id");
  const returnTo = readText(formData, "returnTo") || "/admin/media";

  if (!id) {
    redirect(returnTo);
  }

  const draft = buildMediaAssetMetaDraft({
    id,
    fileName: readText(formData, "fileName"),
    folderId: readOptionalNumber(formData, "folderId"),
    altTextZh: readText(formData, "altTextZh"),
    altTextEn: readText(formData, "altTextEn"),
  });

  const db = getDb();
  await db
    .update(mediaAssets)
    .set({
      fileName: draft.fileName,
      folderId: draft.folderId,
      altTextZh: draft.altTextZh,
      altTextEn: draft.altTextEn,
    })
    .where(eq(mediaAssets.id, draft.id!));

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");
  revalidatePath("/products");
  revalidatePath("/blog");

  redirect(appendRedirectFlag(returnTo, "saved"));
}

async function hasMediaAssetReferences(mediaAssetId: number) {
  const db = getDb();
  const result = await db.execute(sql`
    select
      exists(select 1 from product_categories where image_media_id = ${mediaAssetId}) as in_product_categories,
      exists(select 1 from products where cover_media_id = ${mediaAssetId} or pdf_file_id = ${mediaAssetId}) as in_products,
      exists(select 1 from product_media_relations where media_asset_id = ${mediaAssetId}) as in_product_gallery,
      exists(select 1 from download_files where media_asset_id = ${mediaAssetId}) as in_download_files,
      exists(select 1 from blog_posts where cover_media_id = ${mediaAssetId}) as in_blog_posts,
      exists(select 1 from inquiries where attachment_media_id = ${mediaAssetId}) as in_inquiries,
      exists(select 1 from quote_requests where attachment_media_id = ${mediaAssetId}) as in_quote_requests
  `);

  const row = Array.isArray(result) ? result[0] : result.rows?.[0];

  if (!row) {
    return false;
  }

  return Object.values(row).some(Boolean);
}

export async function deleteMediaAsset(formData: FormData) {
  "use server";

  const id = readOptionalNumber(formData, "id");
  const returnTo = readText(formData, "returnTo") || "/admin/media";

  if (!id) {
    redirect(returnTo);
  }

  try {
    const db = getDb();
    const [asset] = await db
      .select({
        id: mediaAssets.id,
        bucketKey: mediaAssets.bucketKey,
      })
      .from(mediaAssets)
      .where(eq(mediaAssets.id, id))
      .limit(1);

    if (!asset) {
      redirect(returnTo);
    }

    const inUse = await hasMediaAssetReferences(id);

    if (inUse) {
      redirect(appendRedirectFlag(returnTo, "error", "in-use"));
    }

    await deleteFromR2(asset.bucketKey);
    await db.delete(mediaAssets).where(eq(mediaAssets.id, id));

    revalidatePath("/admin/media");
    revalidatePath("/admin/files");

    redirect(appendRedirectFlag(returnTo, "deleted"));
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Failed to delete media asset.", error);
    redirect(appendRedirectFlag(returnTo, "error", "delete-failed"));
  }
}

export async function bulkMoveMediaAssets(formData: FormData) {
  "use server";

  const ids = parseSelectedIds(formData);
  const folderId = readOptionalNumber(formData, "targetFolderId");
  const returnTo = readText(formData, "returnTo") || "/admin/media";

  if (!ids.length) {
    redirect(appendRedirectFlag(returnTo, "error", "no-selection"));
  }

  const db = getDb();
  await db
    .update(mediaAssets)
    .set({ folderId: toSafeId(folderId) })
    .where(inArray(mediaAssets.id, ids));

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");
  redirect(appendRedirectFlag(returnTo, "saved", "bulk-moved"));
}

export async function bulkDeleteMediaAssets(formData: FormData) {
  "use server";

  const ids = parseSelectedIds(formData);
  const returnTo = readText(formData, "returnTo") || "/admin/media";

  if (!ids.length) {
    redirect(appendRedirectFlag(returnTo, "error", "no-selection"));
  }

  const db = getDb();
  const assets = await db
    .select({ id: mediaAssets.id, bucketKey: mediaAssets.bucketKey })
    .from(mediaAssets)
    .where(inArray(mediaAssets.id, ids));

  let deletedCount = 0;
  let skippedCount = 0;

  for (const asset of assets) {
    try {
      const inUse = await hasMediaAssetReferences(asset.id);

      if (inUse) {
        skippedCount += 1;
        continue;
      }

      await deleteFromR2(asset.bucketKey);
      await db.delete(mediaAssets).where(eq(mediaAssets.id, asset.id));
      deletedCount += 1;
    } catch (error) {
      console.error("Failed to bulk delete media asset.", asset.id, error);
      skippedCount += 1;
    }
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");

  let nextPath = appendRedirectFlag(returnTo, "deleted", String(deletedCount));
  if (skippedCount > 0) {
    nextPath = appendRedirectFlag(nextPath, "skipped", String(skippedCount));
  }
  redirect(nextPath);
}

export async function saveDownloadFile(formData: FormData) {
  "use server";

  const mediaAssetId = readOptionalNumber(formData, "mediaAssetId");
  const id = readOptionalNumber(formData, "id");

  if (!mediaAssetId) {
    redirect("/admin/files");
  }

  const draft = buildDownloadFileDraft({
    id,
    mediaAssetId,
    productId: readOptionalNumber(formData, "productId"),
    displayNameZh: readText(formData, "displayNameZh"),
    displayNameEn: readText(formData, "displayNameEn"),
    category: readText(formData, "category"),
    language: readText(formData, "language"),
    description: readText(formData, "description"),
    isVisible: formData.get("isVisible") === "on",
    sortOrder: readOptionalNumber(formData, "sortOrder") ?? 100,
  });

  const db = getDb();

  if (draft.id) {
    await db
      .update(downloadFiles)
      .set({
        mediaAssetId: draft.mediaAssetId,
        productId: draft.productId,
        displayNameZh: draft.displayNameZh,
        displayNameEn: draft.displayNameEn,
        category: draft.category,
        language: draft.language,
        description: draft.description,
        isVisible: draft.isVisible,
        sortOrder: draft.sortOrder,
      })
      .where(eq(downloadFiles.id, draft.id));
  } else {
    await createDownloadFileRecord({
      mediaAssetId: draft.mediaAssetId,
      productId: draft.productId,
      displayNameZh: draft.displayNameZh,
      displayNameEn: draft.displayNameEn,
      category: draft.category,
      language: draft.language,
      description: draft.description,
      isVisible: draft.isVisible,
      sortOrder: draft.sortOrder,
    });
  }

  revalidatePath("/admin/files");
  redirect("/admin/files?saved=1");
}

export async function deleteDownloadFile(formData: FormData) {
  "use server";

  const id = readOptionalNumber(formData, "id");

  if (!id) {
    redirect("/admin/files");
  }

  const db = getDb();
  await db.delete(downloadFiles).where(eq(downloadFiles.id, id));

  revalidatePath("/admin/files");
  redirect("/admin/files?deleted=1");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { and, eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { assetFolders, downloadFiles, mediaAssets, products } from "@/db/schema";
import { buildAssetFolderDraft } from "@/features/media/folders";
import {
  appendRedirectFlag,
  buildDownloadFileDraft,
  buildMediaAssetMetaDraft,
  buildMediaAssetRecord,
  parseSelectedIds,
  type CreateMediaAssetInput,
} from "@/features/media/media-utils";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { deleteFromR2 } from "@/lib/r2";

// ─── Private form helpers ────────────────────────────────────────

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalNumber(formData: FormData, key: string) {
  const value = readText(formData, key);
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toSafeId(value?: number | null) {
  return typeof value === "number" && Number.isInteger(value) && value > 0
    ? value
    : null;
}

async function getActionSiteId() {
  const currentSite = await getCurrentSiteFromRequest();
  return currentSite.id ?? null;
}

// ─── Server Actions ──────────────────────────────────────────

export async function createMediaAsset(input: CreateMediaAssetInput) {
  const siteId = await getActionSiteId();
  const db = getDb();
  const [asset] = await db
    .insert(mediaAssets)
    .values({ ...buildMediaAssetRecord(input), siteId })
    .returning();

  return asset;
}

export async function saveAssetFolder(formData: FormData) {
  const siteId = await getActionSiteId();
  const assetType =
    readText(formData, "assetType") === "file" ? "file" : "image";
  const returnTo =
    readText(formData, "returnTo") ||
    `/admin/${assetType === "image" ? "media" : "files"}`;
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
      .set({ name: draft.name, parentId: draft.parentId, sortOrder: draft.sortOrder })
      .where(siteId ? and(eq(assetFolders.id, draft.id), eq(assetFolders.siteId, siteId)) : eq(assetFolders.id, draft.id));
  } else {
    await db.insert(assetFolders).values({
      assetType: draft.assetType,
      name: draft.name,
      parentId: draft.parentId,
      sortOrder: draft.sortOrder,
      siteId,
    });
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");
  redirect(appendRedirectFlag(returnTo, "folderSaved"));
}

export async function deleteAssetFolder(formData: FormData) {
  const siteId = await getActionSiteId();
  const id = readOptionalNumber(formData, "id");
  const assetType =
    readText(formData, "assetType") === "file" ? "file" : "image";
  const returnTo =
    readText(formData, "returnTo") ||
    `/admin/${assetType === "image" ? "media" : "files"}`;

  if (!id) {
    redirect(returnTo);
  }

  const db = getDb();
  const [hasChild] = await db
    .select({ id: assetFolders.id })
    .from(assetFolders)
    .where(siteId ? and(eq(assetFolders.parentId, id), eq(assetFolders.siteId, siteId)) : eq(assetFolders.parentId, id))
    .limit(1);
  const [hasAsset] = await db
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .where(siteId ? and(eq(mediaAssets.folderId, id), eq(mediaAssets.siteId, siteId)) : eq(mediaAssets.folderId, id))
    .limit(1);

  if (hasChild || hasAsset) {
    redirect(appendRedirectFlag(returnTo, "folderError", "not-empty"));
  }

  await db.delete(assetFolders).where(siteId ? and(eq(assetFolders.id, id), eq(assetFolders.siteId, siteId)) : eq(assetFolders.id, id));

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
  const siteId = await getActionSiteId();
  const db = getDb();
  const [asset] = await db
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .where(
      siteId
        ? and(eq(mediaAssets.id, input.mediaAssetId), eq(mediaAssets.siteId, siteId))
        : eq(mediaAssets.id, input.mediaAssetId),
    )
    .limit(1);

  if (!asset) {
    throw new Error("Media asset not found for current site.");
  }

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

export async function saveMediaAssetMeta(formData: FormData) {
  const siteId = await getActionSiteId();
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
    .where(siteId ? and(eq(mediaAssets.id, draft.id!), eq(mediaAssets.siteId, siteId)) : eq(mediaAssets.id, draft.id!));

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");
  revalidatePath("/products");
  revalidatePath("/blog");

  redirect(appendRedirectFlag(returnTo, "saved"));
}

/** 解除媒体资产的所有外键引用，防止删除时触发外键约束错误 */
async function unlinkMediaAssetReferences(mediaAssetId: number) {
  try {
    const db = getDb();
    await db.execute(
      sql`update product_categories set image_media_id = null where image_media_id = ${mediaAssetId}`,
    );
    await db.execute(
      sql`update products set cover_media_id = null where cover_media_id = ${mediaAssetId}`,
    );
    await db.execute(
      sql`update products set pdf_file_id = null where pdf_file_id = ${mediaAssetId}`,
    );
    await db.execute(
      sql`update blog_posts set cover_media_id = null where cover_media_id = ${mediaAssetId}`,
    );
    await db.execute(
      sql`update inquiries set attachment_media_id = null where attachment_media_id = ${mediaAssetId}`,
    );
    await db.execute(
      sql`update quote_requests set attachment_media_id = null where attachment_media_id = ${mediaAssetId}`,
    );
  } catch (err) {
    console.warn("[media] unlinkMediaAssetReferences warning:", mediaAssetId, err);
  }
}


export async function deleteMediaAsset(formData: FormData) {
  const siteId = await getActionSiteId();
  const id = readOptionalNumber(formData, "id");
  const returnTo = readText(formData, "returnTo") || "/admin/media";

  if (!id) {
    redirect(returnTo);
  }

  try {
    const db = getDb();
    const [asset] = await db
      .select({ id: mediaAssets.id, bucketKey: mediaAssets.bucketKey })
      .from(mediaAssets)
      .where(siteId ? and(eq(mediaAssets.id, id), eq(mediaAssets.siteId, siteId)) : eq(mediaAssets.id, id))
      .limit(1);

    if (!asset) {
      redirect(returnTo);
    }

    await unlinkMediaAssetReferences(id);
    await deleteFromR2(asset.bucketKey);
    await db.delete(mediaAssets).where(siteId ? and(eq(mediaAssets.id, id), eq(mediaAssets.siteId, siteId)) : eq(mediaAssets.id, id));

    revalidatePath("/admin/media");
    revalidatePath("/admin/files");
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/blog");

    redirect(appendRedirectFlag(returnTo, "deleted"));
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Failed to delete media asset.", error);
    redirect(appendRedirectFlag(returnTo, "error", "delete-failed"));
  }
}

export async function bulkMoveMediaAssets(formData: FormData) {
  const siteId = await getActionSiteId();
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
    .where(siteId ? and(inArray(mediaAssets.id, ids), eq(mediaAssets.siteId, siteId)) : inArray(mediaAssets.id, ids));

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");
  redirect(appendRedirectFlag(returnTo, "saved", "bulk-moved"));
}

export async function bulkDeleteMediaAssets(formData: FormData) {
  const siteId = await getActionSiteId();
  const ids = parseSelectedIds(formData);
  const returnTo = readText(formData, "returnTo") || "/admin/media";

  if (!ids.length) {
    redirect(appendRedirectFlag(returnTo, "error", "no-selection"));
  }

  const db = getDb();
  const assets = await db
    .select({ id: mediaAssets.id, bucketKey: mediaAssets.bucketKey })
    .from(mediaAssets)
    .where(siteId ? and(inArray(mediaAssets.id, ids), eq(mediaAssets.siteId, siteId)) : inArray(mediaAssets.id, ids));

  let deletedCount = 0;
  let failedCount = 0;

  for (const asset of assets) {
    try {
      await unlinkMediaAssetReferences(asset.id);
      await deleteFromR2(asset.bucketKey);
      await db.delete(mediaAssets).where(siteId ? and(eq(mediaAssets.id, asset.id), eq(mediaAssets.siteId, siteId)) : eq(mediaAssets.id, asset.id));
      deletedCount += 1;
    } catch (error) {
      console.error("Failed to bulk delete media asset.", asset.id, error);
      failedCount += 1;
    }
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/blog");

  let nextPath = appendRedirectFlag(returnTo, "deleted", String(deletedCount));
  if (failedCount > 0) {
    nextPath = appendRedirectFlag(nextPath, "skipped", String(failedCount));
  }
  redirect(nextPath);
}

export async function saveDownloadFile(formData: FormData) {
  const siteId = await getActionSiteId();
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
  const [asset] = await db
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .where(
      siteId
        ? and(eq(mediaAssets.id, draft.mediaAssetId), eq(mediaAssets.siteId, siteId))
        : eq(mediaAssets.id, draft.mediaAssetId),
    )
    .limit(1);

  if (!asset) {
    redirect("/admin/files?error=invalid-media");
  }

  if (draft.productId) {
    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(
        siteId
          ? and(eq(products.id, draft.productId), eq(products.siteId, siteId))
          : eq(products.id, draft.productId),
      )
      .limit(1);

    if (!product) {
      redirect("/admin/files?error=invalid-product");
    }
  }

  if (draft.id) {
    const [existing] = await db
      .select({ id: downloadFiles.id })
      .from(downloadFiles)
      .innerJoin(mediaAssets, eq(downloadFiles.mediaAssetId, mediaAssets.id))
      .where(
        siteId
          ? and(eq(downloadFiles.id, draft.id), eq(mediaAssets.siteId, siteId))
          : eq(downloadFiles.id, draft.id),
      )
      .limit(1);

    if (!existing) {
      redirect("/admin/files?error=not-found");
    }

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
  const siteId = await getActionSiteId();
  const id = readOptionalNumber(formData, "id");

  if (!id) {
    redirect("/admin/files");
  }

  const db = getDb();
  const [record] = await db
    .select({ id: downloadFiles.id })
    .from(downloadFiles)
    .innerJoin(mediaAssets, eq(downloadFiles.mediaAssetId, mediaAssets.id))
    .where(
      siteId
        ? and(eq(downloadFiles.id, id), eq(mediaAssets.siteId, siteId))
        : eq(downloadFiles.id, id),
    )
    .limit(1);

  if (!record) {
    redirect("/admin/files");
  }

  await db.delete(downloadFiles).where(eq(downloadFiles.id, id));

  revalidatePath("/admin/files");
  redirect("/admin/files?deleted=1");
}

/**
 * 清理失效的媒体资产，检查 URL 是否返回 404，并从数据库中移除记录
 * 返回 { purged, total }
 */
export async function purgeBrokenMediaAssets(): Promise<{
  purged: number;
  total: number;
}> {
  const db = getDb();
  const siteId = await getActionSiteId();
  const assets = siteId
    ? await db
        .select({ id: mediaAssets.id, url: mediaAssets.url })
        .from(mediaAssets)
        .where(eq(mediaAssets.siteId, siteId))
    : await db.select({ id: mediaAssets.id, url: mediaAssets.url }).from(mediaAssets);

  if (assets.length === 0) return { purged: 0, total: 0 };

  const BATCH = 20;
  const brokenIds: number[] = [];

  for (let i = 0; i < assets.length; i += BATCH) {
    const batch = assets.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(async (asset) => {
        try {
          const res = await fetch(asset.url, {
            method: "HEAD",
            signal: AbortSignal.timeout(8000),
          });
          return { id: asset.id, ok: res.ok };
        } catch {
          return { id: asset.id, ok: false };
        }
      }),
    );
    for (const r of results) {
      if (!r.ok) brokenIds.push(r.id);
    }
  }

  if (brokenIds.length > 0) {
    await db
      .delete(mediaAssets)
      .where(
        siteId
          ? and(inArray(mediaAssets.id, brokenIds), eq(mediaAssets.siteId, siteId))
          : inArray(mediaAssets.id, brokenIds),
      );
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");

  return { purged: brokenIds.length, total: assets.length };
}

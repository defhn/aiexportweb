"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { eq, inArray, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { assetFolders, downloadFiles, mediaAssets } from "@/db/schema";
import { buildAssetFolderDraft } from "@/features/media/folders";
import {
  appendRedirectFlag,
  buildDownloadFileDraft,
  buildMediaAssetMetaDraft,
  buildMediaAssetRecord,
  parseSelectedIds,
  type CreateMediaAssetInput,
} from "@/features/media/media-utils";
import { deleteFromR2 } from "@/lib/r2";

// 閳光偓閳光偓閳光偓 Private form helpers 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓

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

// 閳光偓閳光偓閳光偓 Server Actions 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓

export async function createMediaAsset(input: CreateMediaAssetInput) {
  const db = getDb();
  const [asset] = await db
    .insert(mediaAssets)
    .values(buildMediaAssetRecord(input))
    .returning();

  return asset;
}

export async function saveAssetFolder(formData: FormData) {
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

export async function saveMediaAssetMeta(formData: FormData) {
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

/** 閸掔娀娅庨崜宥呭帥鐏忓棙澧嶉張澶婄穿閻€劏顕氶崶鍓у閻ㄥ嫬顦婚柨顔肩摟濞堜絻顔曟稉?NULL閿涘牆鍟戞担娆庣箽閹躲倧绱漵chema 瀹稿弶婀� set null閿�?*/
async function unlinkMediaAssetReferences(mediaAssetId: number) {
  try {
    const db = getDb();
    // Neon 妞瑰崬濮╂稉宥嗘暜閹镐礁宕熷▎?execute 閹笛嗩攽婢舵碍娼� SQL閿涘苯绻€妞よ鍨庡鈧拫鍐暏
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
    // schema 鐏炲倸鍑￠張?onDelete: "set null"閿涘本顒濇径鍕亼鐠愩儰绗夐梼缁樻焽娑撹鍨归梽銈嗙ウ缁�?    console.warn("[media] unlinkMediaAssetReferences warning:", mediaAssetId, err);
  }
}


export async function deleteMediaAsset(formData: FormData) {
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
      .where(eq(mediaAssets.id, id))
      .limit(1);

    if (!asset) {
      redirect(returnTo);
    }

    // 閸忓牐袙缂佹垶澧嶉張澶婄穿閻㈩煉绱濋崘宥呭灩闂�?    await unlinkMediaAssetReferences(id);
    await deleteFromR2(asset.bucketKey);
    await db.delete(mediaAssets).where(eq(mediaAssets.id, id));

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
  let failedCount = 0;

  for (const asset of assets) {
    try {
      // 閸忓牐袙缂佹垵绱╅悽顭掔礉閸愬秴鍨归梽?      await unlinkMediaAssetReferences(asset.id);
      await deleteFromR2(asset.bucketKey);
      await db.delete(mediaAssets).where(eq(mediaAssets.id, asset.id));
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
  const id = readOptionalNumber(formData, "id");

  if (!id) {
    redirect("/admin/files");
  }

  const db = getDb();
  await db.delete(downloadFiles).where(eq(downloadFiles.id, id));

  revalidatePath("/admin/files");
  redirect("/admin/files?deleted=1");
}

/**
 * 閹殿偅寮块幍鈧張澶婃禈閻楀洩绁禍?URL閿涘本澹橀崙?404閿涘牆鐤勯梽鍛弓娑撳﹣绱堕崚?R2閿涘娈戠拋鏉跨秿閹靛綊鍣洪崚鐘绘珟閵�? * 鏉╂柨娲� { purged, total }閵�? */
export async function purgeBrokenMediaAssets(): Promise<{
  purged: number;
  total: number;
}> {
  const db = getDb();
  const assets = await db
    .select({ id: mediaAssets.id, url: mediaAssets.url })
    .from(mediaAssets);

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
    await db.delete(mediaAssets).where(inArray(mediaAssets.id, brokenIds));
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin/files");

  return { purged: brokenIds.length, total: assets.length };
}

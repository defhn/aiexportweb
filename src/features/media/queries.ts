import { and, asc, desc, eq, ilike, inArray, isNull, or } from "drizzle-orm";

import { getDb } from "@/db/client";
import { assetFolders, downloadFiles, mediaAssets, products } from "@/db/schema";
import { collectAssetFolderIds } from "@/features/media/folders";

export async function listMediaAssets(
  assetType?: "image" | "file",
  filters?: {
    query?: string;
    folderId?: number | null;
    includeDescendants?: boolean;
    rootOnlyWhenNoFolder?: boolean;
  },
) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const db = getDb();
    const conditions = [];
    const allFolders = assetType ? await listAssetFolders(assetType) : [];

    if (assetType) {
      conditions.push(eq(mediaAssets.assetType, assetType));
    }

    if (typeof filters?.folderId === "number" && Number.isInteger(filters.folderId)) {
      const folderIds = filters.includeDescendants
        ? collectAssetFolderIds(allFolders, filters.folderId)
        : [filters.folderId];

      conditions.push(
        folderIds.length > 1
          ? inArray(mediaAssets.folderId, folderIds)
          : eq(mediaAssets.folderId, folderIds[0]!),
      );
    } else if (filters?.rootOnlyWhenNoFolder && !filters?.query) {
      conditions.push(isNull(mediaAssets.folderId));
    }

    if (filters?.query) {
      conditions.push(
        or(
          ilike(mediaAssets.fileName, `%${filters.query}%`),
          ilike(mediaAssets.altTextZh, `%${filters.query}%`),
          ilike(mediaAssets.altTextEn, `%${filters.query}%`),
        )!,
      );
    }

    const query = db.select().from(mediaAssets);

    if (conditions.length) {
      return query.where(and(...conditions)).orderBy(desc(mediaAssets.createdAt));
    }

    return query.orderBy(desc(mediaAssets.createdAt));
  } catch (error) {
    console.error("Falling back to empty media assets after database read failure.", error);
    return [];
  }
}

export async function listAssetFolders(assetType: "image" | "file") {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const db = getDb();
    return db
      .select()
      .from(assetFolders)
      .where(eq(assetFolders.assetType, assetType))
      .orderBy(asc(assetFolders.sortOrder), asc(assetFolders.id));
  } catch (error) {
    console.error("Falling back to empty asset folders after database read failure.", error);
    return [];
  }
}

export async function listDownloadFiles(filters?: {
  query?: string;
  category?: string;
  language?: string;
  folderId?: number | null;
  includeDescendants?: boolean;
  rootOnlyWhenNoFolder?: boolean;
}) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const db = getDb();
    const conditions = [];
    const allFolders = await listAssetFolders("file");

    if (filters?.query) {
      conditions.push(
        or(
          ilike(downloadFiles.displayNameEn, `%${filters.query}%`),
          ilike(downloadFiles.displayNameZh, `%${filters.query}%`),
          ilike(mediaAssets.fileName, `%${filters.query}%`),
        )!,
      );
    }

    if (filters?.category) {
      conditions.push(eq(downloadFiles.category, filters.category));
    }

    if (filters?.language) {
      conditions.push(eq(downloadFiles.language, filters.language));
    }

    if (typeof filters?.folderId === "number" && Number.isInteger(filters.folderId)) {
      const folderIds = filters.includeDescendants
        ? collectAssetFolderIds(allFolders, filters.folderId)
        : [filters.folderId];

      conditions.push(
        folderIds.length > 1
          ? inArray(mediaAssets.folderId, folderIds)
          : eq(mediaAssets.folderId, folderIds[0]!),
      );
    } else if (
      filters?.rootOnlyWhenNoFolder &&
      !filters?.query &&
      !filters?.category &&
      !filters?.language
    ) {
      conditions.push(isNull(mediaAssets.folderId));
    }

    const query = db
      .select({
        id: downloadFiles.id,
        mediaAssetId: downloadFiles.mediaAssetId,
        productId: downloadFiles.productId,
        displayNameZh: downloadFiles.displayNameZh,
        displayNameEn: downloadFiles.displayNameEn,
        category: downloadFiles.category,
        language: downloadFiles.language,
        description: downloadFiles.description,
        isVisible: downloadFiles.isVisible,
        sortOrder: downloadFiles.sortOrder,
        createdAt: downloadFiles.createdAt,
        fileName: mediaAssets.fileName,
        fileUrl: mediaAssets.url,
        productNameZh: products.nameZh,
        productNameEn: products.nameEn,
      })
      .from(downloadFiles)
      .innerJoin(mediaAssets, eq(downloadFiles.mediaAssetId, mediaAssets.id))
      .leftJoin(products, eq(downloadFiles.productId, products.id));

    if (conditions.length) {
      return query.where(and(...conditions)).orderBy(desc(downloadFiles.createdAt));
    }

    return query.orderBy(desc(downloadFiles.createdAt));
  } catch (error) {
    console.error("Falling back to empty download files after database read failure.", error);
    return [];
  }
}

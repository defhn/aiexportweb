import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { downloadFiles, mediaAssets } from "@/db/schema";

export async function listMediaAssets(assetType?: "image" | "file") {
  const db = getDb();

  if (assetType) {
    return db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.assetType, assetType))
      .orderBy(desc(mediaAssets.createdAt));
  }

  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
}

export async function listDownloadFiles() {
  const db = getDb();

  return db.select().from(downloadFiles).orderBy(desc(downloadFiles.createdAt));
}

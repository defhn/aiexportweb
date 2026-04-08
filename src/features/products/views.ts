import { createHash } from "node:crypto";
import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { productViews, products } from "@/db/schema";

export function buildProductViewSessionId(fingerprint: string) {
  return createHash("sha256").update(fingerprint).digest("hex").slice(0, 24);
}

export function buildProductViewInsertPayload(input: {
  productId: number;
  sessionId: string;
  referer?: string | null;
  countryCode?: string | null;
}) {
  return {
    productId: input.productId,
    sessionId: input.sessionId.trim(),
    referer: input.referer?.trim() || null,
    countryCode: input.countryCode?.trim() || null,
  };
}

export async function recordProductView(input: {
  productId: number;
  sessionId: string;
  referer?: string | null;
  countryCode?: string | null;
}) {
  const db = getDb();
  const [record] = await db
    .insert(productViews)
    .values(buildProductViewInsertPayload(input))
    .returning();

  return record;
}

export async function listRecentProductViews(limit = 200) {
  const db = getDb();
  return db
    .select({
      id: productViews.id,
      productId: productViews.productId,
      productName: products.nameEn,
      countryCode: productViews.countryCode,
      referer: productViews.referer,
      createdAt: productViews.createdAt,
    })
    .from(productViews)
    .leftJoin(products, eq(productViews.productId, products.id))
    .orderBy(desc(productViews.createdAt))
    .limit(limit);
}

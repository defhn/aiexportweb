import { createHash } from "node:crypto";
import { and, desc, eq, gte, sql } from "drizzle-orm";

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
  const dedupeWindow = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [existing] = await db
    .select({ id: productViews.id })
    .from(productViews)
    .where(
      and(
        eq(productViews.productId, input.productId),
        eq(productViews.sessionId, input.sessionId.trim()),
        gte(productViews.createdAt, dedupeWindow),
      ),
    )
    .limit(1);

  if (existing) {
    return null;
  }

  const [record] = await db
    .insert(productViews)
    .values(buildProductViewInsertPayload(input))
    .returning();

  return record;
}

export async function listRecentProductViews(limit = 200, siteId?: number | null) {
  const db = getDb();

  const query = db
    .select({
      id: productViews.id,
      productId: productViews.productId,
      productName: products.nameEn,
      countryCode: productViews.countryCode,
      referer: productViews.referer,
      createdAt: productViews.createdAt,
    })
    .from(productViews)
    .leftJoin(products, eq(productViews.productId, products.id));
  const filtered = siteId ? query.where(eq(products.siteId, siteId)) : query;
  return filtered.orderBy(desc(productViews.createdAt)).limit(limit);
}

export async function getProductViewRankings(limit = 10) {
  const db = getDb();

  return db
    .select({
      productId: productViews.productId,
      productName: products.nameEn,
      uniqueViews: sql<number>`count(distinct ${productViews.sessionId})`,
    })
    .from(productViews)
    .leftJoin(products, eq(productViews.productId, products.id))
    .groupBy(productViews.productId, products.nameEn)
    .orderBy(desc(sql`count(distinct ${productViews.sessionId})`))
    .limit(limit);
}

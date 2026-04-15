import { and, desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { quoteRequestItems, quoteRequests } from "@/db/schema";

export async function listQuoteRequests(siteId?: number | null) {
  const db = getDb();
  const query = db
    .select()
    .from(quoteRequests)
    .orderBy(desc(quoteRequests.createdAt));
  return siteId ? query.where(eq(quoteRequests.siteId, siteId)) : query;
}

export async function getQuoteRequestById(id: number, siteId?: number | null) {
  const db = getDb();
  const [request] = await db
    .select()
    .from(quoteRequests)
    .where(
      siteId
        ? and(eq(quoteRequests.id, id), eq(quoteRequests.siteId, siteId))
        : eq(quoteRequests.id, id),
    )
    .limit(1);

  if (!request) {
    return null;
  }

  const items = await db
    .select()
    .from(quoteRequestItems)
    .where(eq(quoteRequestItems.quoteRequestId, request.id))
    .orderBy(desc(quoteRequestItems.id));

  return {
    ...request,
    items,
  };
}

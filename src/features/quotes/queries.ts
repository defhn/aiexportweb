import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { quoteRequestItems, quoteRequests } from "@/db/schema";

export async function listQuoteRequests() {
  const db = getDb();
  return db
    .select()
    .from(quoteRequests)
    .orderBy(desc(quoteRequests.createdAt));
}

export async function getQuoteRequestById(id: number) {
  const db = getDb();
  const [request] = await db
    .select()
    .from(quoteRequests)
    .where(eq(quoteRequests.id, id))
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

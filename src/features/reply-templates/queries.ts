import { and, asc, desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { replyTemplates } from "@/db/schema";

export async function listReplyTemplates(siteId?: number | null) {
  const db = getDb();
  const query = db
    .select()
    .from(replyTemplates)
    .orderBy(asc(replyTemplates.category), desc(replyTemplates.updatedAt));
  return siteId ? query.where(eq(replyTemplates.siteId, siteId)) : query;
}

export async function getReplyTemplateById(id: number, siteId?: number | null) {
  const db = getDb();
  const [template] = await db
    .select()
    .from(replyTemplates)
    .where(
      siteId
        ? and(eq(replyTemplates.siteId, siteId), eq(replyTemplates.id, id))
        : eq(replyTemplates.id, id),
    )
    .limit(1);

  return template ?? null;
}

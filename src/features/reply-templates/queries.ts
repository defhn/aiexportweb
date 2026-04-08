import { asc, desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { replyTemplates } from "@/db/schema";

export async function listReplyTemplates() {
  const db = getDb();
  return db
    .select()
    .from(replyTemplates)
    .orderBy(asc(replyTemplates.category), desc(replyTemplates.updatedAt));
}

export async function getReplyTemplateById(id: number) {
  const db = getDb();
  const [template] = await db
    .select()
    .from(replyTemplates)
    .where(eq(replyTemplates.id, id))
    .limit(1);

  return template ?? null;
}

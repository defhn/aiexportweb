import { and, desc, eq, ilike, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { inquiries } from "@/db/schema";

export async function listInquiries(filters?: {
  query?: string;
  status?: "new" | "processing" | "done" | "";
}) {
  const db = getDb();
  const conditions = [];

  if (filters?.query) {
    conditions.push(
      sql`(${inquiries.name} ilike ${`%${filters.query}%`} or ${inquiries.email} ilike ${`%${filters.query}%`} or ${inquiries.companyName} ilike ${`%${filters.query}%`})`,
    );
  }

  if (filters?.status) {
    conditions.push(eq(inquiries.status, filters.status));
  }

  if (conditions.length) {
    return db
      .select()
      .from(inquiries)
      .where(and(...conditions))
      .orderBy(desc(inquiries.createdAt));
  }

  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

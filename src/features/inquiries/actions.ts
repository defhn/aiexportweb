import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { inquiries } from "@/db/schema";

export type InquiryInsertInput = {
  name: string;
  email: string;
  companyName?: string;
  country?: string;
  whatsapp?: string;
  message: string;
  productId?: number | null;
  sourcePage?: string;
  sourceUrl?: string;
  attachmentMediaId?: number | null;
};

export function buildInquiryInsertPayload(input: InquiryInsertInput) {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    companyName: input.companyName?.trim() ?? null,
    country: input.country?.trim() ?? null,
    whatsapp: input.whatsapp?.trim() ?? null,
    message: input.message.trim(),
    productId: input.productId ?? null,
    sourcePage: input.sourcePage?.trim() ?? null,
    sourceUrl: input.sourceUrl?.trim() ?? null,
    attachmentMediaId: input.attachmentMediaId ?? null,
    status: "new" as const,
  };
}

export async function createInquiry(input: InquiryInsertInput) {
  const db = getDb();
  const [record] = await db
    .insert(inquiries)
    .values(buildInquiryInsertPayload(input))
    .returning();

  return record;
}

export async function updateInquiryStatus(id: number, status: "new" | "processing" | "done") {
  const db = getDb();
  const [record] = await db
    .update(inquiries)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(inquiries.id, id))
    .returning();

  return record;
}

export async function exportInquiriesToCsv() {
  const db = getDb();
  const records = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  const header =
    "Name,Email,Company,Country,WhatsApp,Status,Source Page,Source URL,Created At";
  const rows = records.map((record) =>
    [
      record.name,
      record.email,
      record.companyName ?? "",
      record.country ?? "",
      record.whatsapp ?? "",
      record.status,
      record.sourcePage ?? "",
      record.sourceUrl ?? "",
      record.createdAt?.toISOString() ?? "",
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );

  return [header, ...rows].join("\n");
}

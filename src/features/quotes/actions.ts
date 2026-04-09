import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { quoteRequestItems, quoteRequests } from "@/db/schema";

export type QuoteRequestInsertInput = {
  name: string;
  email: string;
  companyName?: string;
  country?: string;
  countryCode?: string | null;
  whatsapp?: string;
  message: string;
  attachmentMediaId?: number | null;
  customFieldsJson?: Record<string, string>;
};

export type QuoteItemDraftInput = {
  productId?: number | null;
  productName?: string;
  quantity?: string;
  unit?: string;
  notes?: string;
};

export function buildQuoteRequestInsertPayload(input: QuoteRequestInsertInput) {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    companyName: input.companyName?.trim() ?? null,
    country: input.country?.trim() ?? null,
    countryCode: input.countryCode?.trim() ?? null,
    whatsapp: input.whatsapp?.trim() ?? null,
    message: input.message.trim(),
    attachmentMediaId: input.attachmentMediaId ?? null,
    customFieldsJson: input.customFieldsJson ?? {},
    status: "new" as const,
  };
}

export function buildQuoteItemDrafts(items: QuoteItemDraftInput[]) {
  return items
    .map((item) => ({
      productId: item.productId ?? null,
      productName: item.productName?.trim() ?? "",
      quantity: item.quantity?.trim() ?? "",
      unit: item.unit?.trim() ?? "",
      notes: item.notes?.trim() ?? "",
    }))
    .filter((item) => item.productId || item.productName || item.quantity || item.notes);
}

export async function createQuoteRequest(input: QuoteRequestInsertInput & { items: QuoteItemDraftInput[] }) {
  const db = getDb();
  const [request] = await db
    .insert(quoteRequests)
    .values(buildQuoteRequestInsertPayload(input))
    .returning();

  if (!request) {
    return null;
  }

  const items = buildQuoteItemDrafts(input.items);

  if (items.length) {
    await db.insert(quoteRequestItems).values(
      items.map((item) => ({
        quoteRequestId: request.id,
        productId: item.productId ?? null,
        productName: item.productName || "Custom Product",
        quantity: item.quantity || null,
        unit: item.unit || null,
        notes: item.notes || null,
      })),
    );
  }

  return request;
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateQuoteStatus(formData: FormData) {
  "use server";

  const id = Number.parseInt(readText(formData, "id"), 10);
  const status = readText(formData, "status");

  if (!Number.isFinite(id)) {
    redirect("/admin/quotes");
  }

  const db = getDb();
  await db
    .update(quoteRequests)
    .set({
      status:
        status === "reviewing" || status === "quoted" || status === "closed"
          ? status
          : "new",
      updatedAt: new Date(),
    })
    .where(eq(quoteRequests.id, id));

  revalidatePath("/admin/quotes");
  redirect("/admin/quotes?saved=1");
}

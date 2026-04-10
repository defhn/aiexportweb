import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { inquiries, productCategories, products } from "@/db/schema";
import { classifyInquiryByRules } from "@/features/inquiries/classification";

export type InquiryInsertInput = {
  name: string;
  email: string;
  companyName?: string;
  country?: string;
  countryCode?: string | null;
  countryGroup?: string | null;
  whatsapp?: string;
  message: string;
  productId?: number | null;
  sourcePage?: string;
  sourceUrl?: string;
  sourceType?: string | null;
  categoryTag?: string | null;
  inquiryType?: string | null;
  classificationMethod?: "rule" | "ai" | "manual";
  attachmentMediaId?: number | null;
  // UTM 鏉╁€熼嚋鐎涙顔�
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  // 妤傛ǹ宸濋柌蹇擃吂閹寸柉绻冨⿰锟�
  annualVolume?: string | null;
  companyWebsite?: string | null;
};

export function buildInquiryInsertPayload(input: InquiryInsertInput) {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    companyName: input.companyName?.trim() ?? null,
    country: input.country?.trim() ?? null,
    countryCode: input.countryCode?.trim() ?? null,
    countryGroup: input.countryGroup?.trim() ?? null,
    whatsapp: input.whatsapp?.trim() ?? null,
    message: input.message.trim(),
    productId: input.productId ?? null,
    sourcePage: input.sourcePage?.trim() ?? null,
    sourceUrl: input.sourceUrl?.trim() ?? null,
    sourceType: input.sourceType?.trim() ?? null,
    categoryTag: input.categoryTag?.trim() ?? null,
    inquiryType: input.inquiryType?.trim() ?? null,
    classificationMethod: input.classificationMethod ?? "rule",
    attachmentMediaId: input.attachmentMediaId ?? null,
    status: "new" as const,
    // UTM 鏉╁€熼嚋
    utmSource: input.utmSource?.trim() ?? null,
    utmMedium: input.utmMedium?.trim() ?? null,
    utmCampaign: input.utmCampaign?.trim() ?? null,
    utmTerm: input.utmTerm?.trim() ?? null,
    utmContent: input.utmContent?.trim() ?? null,
    gclid: input.gclid?.trim() ?? null,
    // 妤傛ǹ宸濋柌蹇曞殠缁便垹鐡у▓锟�
    annualVolume: input.annualVolume?.trim() ?? null,
    companyWebsite: input.companyWebsite?.trim() ?? null,
  };
}

export async function createInquiry(input: InquiryInsertInput) {
  const db = getDb();
  let categoryTag = input.categoryTag ?? null;

  if (input.productId) {
    const [row] = await db
      .select({ categorySlug: productCategories.slug })
      .from(products)
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .where(eq(products.id, input.productId))
      .limit(1);

    categoryTag = row?.categorySlug ?? categoryTag;
  }

  const classification = classifyInquiryByRules({
    country: input.country,
    sourcePage: input.sourcePage,
    sourceUrl: input.sourceUrl,
    categoryTag,
    message: input.message,
  });
  const [record] = await db
    .insert(inquiries)
    .values(
      buildInquiryInsertPayload({
        ...input,
        countryCode: input.countryCode ?? classification.countryCode,
        countryGroup: input.countryGroup ?? classification.countryGroup,
        sourceType: input.sourceType ?? classification.sourceType,
        categoryTag,
        inquiryType: input.inquiryType ?? classification.inquiryType,
        classificationMethod:
          input.classificationMethod ?? classification.classificationMethod,
      }),
    )
    .returning();

  return record;
}

export async function updateInquiryStatus(id: number, status: "new" | "processing" | "contacted" | "quoted" | "won" | "done") {
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

export async function updateInquiryDetail(input: {
  id: number;
  status: "new" | "processing" | "contacted" | "quoted" | "won" | "done";
  inquiryType?: string | null;
  internalNote?: string | null;
  classificationMethod?: "rule" | "ai" | "manual";
}) {
  const db = getDb();
  const [record] = await db
    .update(inquiries)
    .set({
      status: input.status,
      inquiryType: input.inquiryType?.trim() || null,
      internalNote: input.internalNote?.trim() || null,
      classificationMethod: input.classificationMethod ?? "manual",
      updatedAt: new Date(),
    })
    .where(eq(inquiries.id, input.id))
    .returning();

  return record;
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function saveInquiryStatus(formData: FormData) {
  "use server";

  const inquiryId = Number.parseInt(readText(formData, "id"), 10);
  const status = readText(formData, "status");
  const query = readText(formData, "q");
  const filterStatus = readText(formData, "filterStatus");

  if (!Number.isFinite(inquiryId)) {
    redirect("/admin/inquiries");
  }

  const normalizedStatus = [
    "new", "processing", "contacted", "quoted", "won", "done",
  ].includes(status)
    ? (status as "new" | "processing" | "contacted" | "quoted" | "won" | "done")
    : ("new" as const);

  await updateInquiryStatus(inquiryId, normalizedStatus);
  revalidatePath("/admin/inquiries");

  const search = new URLSearchParams();
  if (query) {
    search.set("q", query);
  }
  if (filterStatus) {
    search.set("status", filterStatus);
  }

  redirect(
    search.size > 0 ? `/admin/inquiries?${search.toString()}` : "/admin/inquiries",
  );
}

export async function saveInquiryDetail(formData: FormData) {
  "use server";

  const inquiryId = Number.parseInt(readText(formData, "id"), 10);

  if (!Number.isFinite(inquiryId)) {
    redirect("/admin/inquiries");
  }

  const status = readText(formData, "status");
  const inquiryType = readText(formData, "inquiryType");
  const internalNote = readText(formData, "internalNote");
  const classificationMethod = readText(formData, "classificationMethod");

  await updateInquiryDetail({
    id: inquiryId,
    status: status === "processing" || status === "done" ? status : "new",
    inquiryType,
    internalNote,
    classificationMethod:
      classificationMethod === "ai" || classificationMethod === "rule"
        ? classificationMethod
        : "manual",
  });

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
  redirect(`/admin/inquiries/${inquiryId}?saved=1`);
}

export async function exportInquiriesToCsv() {
  const db = getDb();
  const records = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  const header =
    "Name,Email,Company,Country,Country Code,Country Group,WhatsApp,Status,Inquiry Type,Source Type,Source Page,Source URL,Created At";
  const rows = records.map((record) =>
    [
      record.name,
      record.email,
      record.companyName ?? "",
      record.country ?? "",
      record.countryCode ?? "",
      record.countryGroup ?? "",
      record.whatsapp ?? "",
      record.status,
      record.inquiryType ?? "",
      record.sourceType ?? "",
      record.sourcePage ?? "",
      record.sourceUrl ?? "",
      record.createdAt?.toISOString() ?? "",
    ]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  );

  return [header, ...rows].join("\n");
}

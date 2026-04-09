import { and, desc, eq, ilike, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { inquiries, mediaAssets, products } from "@/db/schema";

export async function listInquiries(filters?: {
  query?: string;
  status?: "new" | "processing" | "contacted" | "quoted" | "won" | "done" | "";
  inquiryType?: string;
  countryGroup?: string;
}) {
  const db = getDb();
  const conditions = [];

  if (filters?.query) {
    conditions.push(
      sql`(${inquiries.name} ilike ${`%${filters.query}%`} or ${inquiries.email} ilike ${`%${filters.query}%`} or ${inquiries.companyName} ilike ${`%${filters.query}%`} or ${products.nameEn} ilike ${`%${filters.query}%`})`,
    );
  }

  if (filters?.status) {
    conditions.push(eq(inquiries.status, filters.status));
  }

  if (filters?.inquiryType) {
    conditions.push(eq(inquiries.inquiryType, filters.inquiryType));
  }

  if (filters?.countryGroup) {
    conditions.push(eq(inquiries.countryGroup, filters.countryGroup));
  }

  const query = db
    .select({
      id: inquiries.id,
      name: inquiries.name,
      email: inquiries.email,
      companyName: inquiries.companyName,
      country: inquiries.country,
      countryCode: inquiries.countryCode,
      countryGroup: inquiries.countryGroup,
      whatsapp: inquiries.whatsapp,
      message: inquiries.message,
      productId: inquiries.productId,
      productName: products.nameEn,
      sourcePage: inquiries.sourcePage,
      sourceUrl: inquiries.sourceUrl,
      sourceType: inquiries.sourceType,
      categoryTag: inquiries.categoryTag,
      inquiryType: inquiries.inquiryType,
      classificationMethod: inquiries.classificationMethod,
      attachmentMediaId: inquiries.attachmentMediaId,
      attachmentUrl: mediaAssets.url,
      attachmentName: mediaAssets.fileName,
      status: inquiries.status,
      internalNote: inquiries.internalNote,
      createdAt: inquiries.createdAt,
      updatedAt: inquiries.updatedAt,
    })
    .from(inquiries)
    .leftJoin(products, eq(inquiries.productId, products.id))
    .leftJoin(mediaAssets, eq(inquiries.attachmentMediaId, mediaAssets.id));

  if (conditions.length) {
    return query.where(and(...conditions)).orderBy(desc(inquiries.createdAt));
  }

  return query.orderBy(desc(inquiries.createdAt));
}

export async function getInquiryById(id: number) {
  const db = getDb();
  const [record] = await db
    .select({
      id: inquiries.id,
      name: inquiries.name,
      email: inquiries.email,
      companyName: inquiries.companyName,
      country: inquiries.country,
      countryCode: inquiries.countryCode,
      countryGroup: inquiries.countryGroup,
      whatsapp: inquiries.whatsapp,
      message: inquiries.message,
      productId: inquiries.productId,
      productName: products.nameEn,
      sourcePage: inquiries.sourcePage,
      sourceUrl: inquiries.sourceUrl,
      sourceType: inquiries.sourceType,
      categoryTag: inquiries.categoryTag,
      inquiryType: inquiries.inquiryType,
      classificationMethod: inquiries.classificationMethod,
      attachmentMediaId: inquiries.attachmentMediaId,
      attachmentUrl: mediaAssets.url,
      attachmentName: mediaAssets.fileName,
      status: inquiries.status,
      internalNote: inquiries.internalNote,
      createdAt: inquiries.createdAt,
      updatedAt: inquiries.updatedAt,
    })
    .from(inquiries)
    .leftJoin(products, eq(inquiries.productId, products.id))
    .leftJoin(mediaAssets, eq(inquiries.attachmentMediaId, mediaAssets.id))
    .where(eq(inquiries.id, id))
    .limit(1);

  return record ?? null;
}

export async function listInquiryTypes() {
  const db = getDb();
  const rows = await db
    .selectDistinct({ inquiryType: inquiries.inquiryType })
    .from(inquiries)
    .where(sql`${inquiries.inquiryType} is not null`);

  return rows.map((row) => row.inquiryType).filter(Boolean) as string[];
}

export async function listInquiryCountryGroups() {
  const db = getDb();
  const rows = await db
    .selectDistinct({ countryGroup: inquiries.countryGroup })
    .from(inquiries)
    .where(sql`${inquiries.countryGroup} is not null`);

  return rows.map((row) => row.countryGroup).filter(Boolean) as string[];
}

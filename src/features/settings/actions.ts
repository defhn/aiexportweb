import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { assertSameOrigin } from "@/lib/csrf";

export type SiteSettingsDraft = {
  companyNameZh: string;
  companyNameEn: string;
  taglineZh: string;
  taglineEn: string;
  email: string;
  phone: string;
  whatsapp: string;
  addressZh: string;
  addressEn: string;
  siteUrl: string;
  seoTitleTemplate: string;
  seoOgImageMediaId: number | null;
};

export function buildSiteSettingsDraft(
  input: Partial<SiteSettingsDraft>,
): SiteSettingsDraft {
  return {
    companyNameZh: input.companyNameZh ?? "演示工厂",
    companyNameEn: input.companyNameEn ?? "Demo Factory Co., Ltd.",
    taglineZh: input.taglineZh ?? "可持续运营的外贸获客网站系统",
    taglineEn:
      input.taglineEn ?? "A lead generation website system for export growth.",
    email: input.email ?? "sales@example.com",
    phone: input.phone ?? "+86 000 0000 0000",
    whatsapp: input.whatsapp ?? "+86 13800000000",
    addressZh: input.addressZh ?? "中国制造业产业带",
    addressEn: input.addressEn ?? "Manufacturing Cluster, China",
    siteUrl: input.siteUrl ?? "",
    seoTitleTemplate: input.seoTitleTemplate ?? "%s",
    seoOgImageMediaId: input.seoOgImageMediaId ?? null,
  };
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalNumber(formData: FormData, key: string) {
  const value = readText(formData, key);
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function saveSiteSettings(formData: FormData) {
  "use server";

  await assertSameOrigin();

  const db = getDb();
  const draft = buildSiteSettingsDraft({
    companyNameZh: readText(formData, "companyNameZh"),
    companyNameEn: readText(formData, "companyNameEn"),
    taglineZh: readText(formData, "taglineZh"),
    taglineEn: readText(formData, "taglineEn"),
    email: readText(formData, "email"),
    phone: readText(formData, "phone"),
    whatsapp: readText(formData, "whatsapp"),
    addressZh: readText(formData, "addressZh"),
    addressEn: readText(formData, "addressEn"),
    siteUrl: readText(formData, "siteUrl").replace(/\/$/, ""),
    seoTitleTemplate: readText(formData, "seoTitleTemplate"),
    seoOgImageMediaId: readOptionalNumber(formData, "seoOgImageMediaId"),
  });

  const [existing] = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .orderBy(desc(siteSettings.updatedAt), desc(siteSettings.id))
    .limit(1);

  if (existing) {
    await db
      .update(siteSettings)
      .set({
        ...draft,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, existing.id));
  } else {
    await db.insert(siteSettings).values(draft);
  }

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/products");
  revalidatePath("/blog");
  revalidatePath("/request-quote");
  revalidatePath("/admin/settings");

  redirect("/admin/settings?saved=1");
}

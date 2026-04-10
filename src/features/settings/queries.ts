import { desc } from "drizzle-orm";

import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { getSeedPack, type SeedPackKey } from "@/db/seed";

export async function getSiteSettings(seedPackKey: SeedPackKey = "cnc") {
  const pack = getSeedPack(seedPackKey);

  if (!process.env.DATABASE_URL) {
    return {
      companyNameZh: pack.site.companyNameZh,
      companyNameEn: pack.site.companyNameEn,
      taglineZh: pack.site.taglineZh,
      taglineEn: pack.site.taglineEn,
      email: pack.site.email,
      phone: pack.site.phone,
      whatsapp: pack.site.whatsapp,
      addressZh: pack.site.addressZh,
      addressEn: pack.site.addressEn,
      // SEO defaults
      siteUrl: "",
      seoTitleTemplate: "%s",
      seoOgImageUrl: "",
    };
  }

  try {
    const db = getDb();
    const [record] = await db
      .select()
      .from(siteSettings)
      .orderBy(desc(siteSettings.updatedAt), desc(siteSettings.id))
      .limit(1);

    if (record) {
      let seoOgImageUrl = "";
      if (record.seoOgImageMediaId) {
        const { mediaAssets } = await import("@/db/schema");
        const { eq } = await import("drizzle-orm");
        const [ogAsset] = await db
          .select({ url: mediaAssets.url })
          .from(mediaAssets)
          .where(eq(mediaAssets.id, record.seoOgImageMediaId))
          .limit(1);
        seoOgImageUrl = ogAsset?.url ?? "";
      }

      return {
        companyNameZh: record.companyNameZh,
        companyNameEn: record.companyNameEn,
        taglineZh: record.taglineZh ?? "",
        taglineEn: record.taglineEn ?? "",
        email: record.email,
        phone: record.phone ?? "",
        whatsapp: record.whatsapp ?? "",
        addressZh: record.addressZh ?? "",
        addressEn: record.addressEn ?? "",
        themePrimaryColor: record.themePrimaryColor,
        themeBorderRadius: record.themeBorderRadius,
        themeFontFamily: record.themeFontFamily,
        formFieldsJson: record.formFieldsJson,
        // SEO
        siteUrl: record.siteUrl ?? "",
        seoTitleTemplate: record.seoTitleTemplate ?? "%s",
        seoOgImageUrl,
      };
    }
  } catch (error) {
    console.error("Falling back to seed site settings after database read failure.", error);
  }

  return {
    companyNameZh: pack.site.companyNameZh,
    companyNameEn: pack.site.companyNameEn,
    taglineZh: pack.site.taglineZh,
    taglineEn: pack.site.taglineEn,
    email: pack.site.email,
    phone: pack.site.phone,
    whatsapp: pack.site.whatsapp,
    addressZh: pack.site.addressZh,
    addressEn: pack.site.addressEn,
    // Add default fallbacks for seed mode
    themePrimaryColor: '#0f172a',
    themeBorderRadius: '0.5rem',
    themeFontFamily: 'Inter, sans-serif',
    formFieldsJson: [],
    // SEO defaults
    siteUrl: "",
    seoTitleTemplate: "%s",
    seoOgImageUrl: "",
  };
}

import { getSeedPack, type SeedPackKey } from "@/db/seed";

export async function getSiteSettings(seedPackKey: SeedPackKey = "cnc") {
  const pack = getSeedPack(seedPackKey);

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
  };
}

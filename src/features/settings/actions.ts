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
  };
}

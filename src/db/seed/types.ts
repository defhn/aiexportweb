import type { DefaultFieldKey } from "./default-field-defs";

export type SeedPackKey =
  | "cnc"                   // template-01 精密制造
  | "industrial-equipment"  // template-02 工业设备
  | "building-materials"    // template-03 建材建筑
  | "energy-power"          // template-04 能源电力
  | "medical-health"        // template-05 医疗健康
  | "fluid-hvac"            // template-06 流体工程
  | "lighting"              // template-07 照明灯具
  | "hardware-plastics"     // template-08 五金工业
  | "furniture-outdoor"     // template-09 家居出口
  | "textile-packaging"     // template-10 轻工纺织
  | "consumer-electronics"  // template-11 消费品电子
  | "lifestyle";            // template-12 生活礼品
export type SeedPageKey = "home" | "about" | "contact";

export type SeedPageModule = {
  moduleKey: string;
  moduleNameZh: string;
  moduleNameEn: string;
  isEnabled: boolean;
  sortOrder: number;
  payloadJson: Record<string, unknown>;
};

export type SeedSiteSettings = {
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

export type SeedCategory = {
  nameZh: string;
  nameEn: string;
  slug: string;
  summaryZh: string;
  summaryEn: string;
  sortOrder: number;
  isFeatured: boolean;
};

export type SeedProductFieldValue = {
  valueZh: string;
  valueEn: string;
  visible: boolean;
};

export type SeedCustomField = {
  labelZh: string;
  labelEn: string;
  valueZh: string;
  valueEn: string;
  visible: boolean;
  sortOrder: number;
};

export type SeedProduct = {
  nameZh: string;
  nameEn: string;
  slug: string;
  categorySlug: string;
  shortDescriptionZh: string;
  shortDescriptionEn: string;
  detailsZh: string;
  detailsEn: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  isFeatured: boolean;
  defaultFields: Partial<Record<DefaultFieldKey, SeedProductFieldValue>>;
  customFields: SeedCustomField[];
};

export type SeedBlogCategory = {
  nameZh: string;
  nameEn: string;
  slug: string;
};

export type SeedBlogPost = {
  titleZh: string;
  titleEn: string;
  slug: string;
  excerptZh: string;
  excerptEn: string;
  contentZh: string;
  contentEn: string;
  categorySlug: string;
  tags: string[];
  publishedAt: string;
};

export type SeedPack = {
  key: SeedPackKey;
  site: SeedSiteSettings;
  pages: Record<SeedPageKey, SeedPageModule[]>;
  categories: SeedCategory[];
  products: SeedProduct[];
  blogCategories: SeedBlogCategory[];
  blogPosts: SeedBlogPost[];
  featuredCategorySlugs: string[];
  featuredProductSlugs: string[];
};

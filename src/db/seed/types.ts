import type { DefaultFieldKey } from "./default-field-defs";

export type SeedPackKey = "cnc" | "industrial-equipment" | "building-materials";
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

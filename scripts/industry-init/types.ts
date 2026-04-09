/**
 * Industry Init Script — Type Definitions
 * These types mirror the DB schema and existing SeedPack types.
 */

// ─── User-provided config (minimal input required) ────────────────────────────

export interface IndustryConfig {
  /** Short industry keyword, e.g. "ecommerce", "healthcare", "food-beverage" */
  industry: string;
  /** One-sentence description of the business for AI context */
  businessDescription: string;
  company: {
    nameEn: string;
    nameCn?: string; // optional Chinese name
    country: string;
    email: string;
    phone?: string;
    whatsapp?: string;
    addressEn?: string;
  };
  /** Public site URL e.g. "https://myshop.com" */
  domain: string;
  /** Initial admin password (will be printed in setup guide) */
  adminPassword: string;
  /** How many product categories to generate (default: 5) */
  categoryCount?: number;
  /** How many products to generate (default: 10) */
  productCount?: number;
  /** How many blog posts to generate (default: 3) */
  blogPostCount?: number;
  /** How many FAQ items to generate (default: 8) */
  faqCount?: number;
}

// ─── AI-generated data structures ────────────────────────────────────────────

export interface AiCategory {
  nameEn: string;
  nameCn: string;
  slug: string;
  summaryEn: string;
  summaryCn: string;
  sortOrder: number;
  isFeatured: boolean;
}

export interface AiProduct {
  nameEn: string;
  nameCn: string;
  slug: string;
  categorySlug: string;
  shortDescriptionEn: string;
  shortDescriptionCn: string;
  detailsEn: string;
  detailsCn: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  isFeatured: boolean;
  specs: Array<{ labelEn: string; valueEn: string }>;
}

export interface AiBlogPost {
  titleEn: string;
  titleCn: string;
  slug: string;
  excerptEn: string;
  excerptCn: string;
  contentEn: string; // HTML string
  contentCn: string;
  categorySlug: string;
  tags: string[];
}

export interface AiPageModule {
  moduleKey: string;
  moduleNameZh: string;
  moduleNameEn: string;
  isEnabled: boolean;
  sortOrder: number;
  payloadJson: Record<string, unknown>;
}

export interface AiFaq {
  question: string;
  answer: string;
}

export interface AiSiteSettings {
  companyNameEn: string;
  companyNameCn: string;
  taglineEn: string;
  taglineCn: string;
  metaTitleSuffixEn: string;
  metaDescriptionEn: string;
  canonicalBase: string;
}

// ─── Image manifest ───────────────────────────────────────────────────────────

export type ImageStyle =
  | "photorealistic"
  | "3d_render"
  | "editorial_3d"
  | "flat_illustration"
  | "corporate_photo";

export type ImagePurpose =
  | "homepage_hero"
  | "category_cover"
  | "product_main"
  | "blog_cover"
  | "about_hero"
  | "trust_signal"
  | "process_bg";

export interface ImageManifestItem {
  id: number;
  filename: string;
  purpose: ImagePurpose;
  /** Which DB table this image belongs to */
  targetTable: "pageModules" | "productCategories" | "products" | "blogPosts" | "siteSettings";
  /** The record identifier in that table */
  targetKey: string;
  width: number;
  height: number;
  style: ImageStyle;
  /** Full prompt for Antigravity generate_image tool */
  prompt: string;
  /** Status: pending | done */
  status: "pending" | "done";
  /** Local file path once generated */
  localPath?: string;
  /** R2 URL after upload */
  r2Url?: string;
}

export interface ImageManifest {
  industry: string;
  generatedAt: string;
  totalImages: number;
  images: ImageManifestItem[];
}

// ─── Progress tracking ────────────────────────────────────────────────────────

export interface ImageProgress {
  lastUpdated: string;
  completedIds: number[];
  nextId: number;
  totalImages: number;
}

// ─── Seeded result (IDs returned from DB) ────────────────────────────────────

export interface SeededIds {
  categoryIds: Record<string, number>; // slug → db id
  productIds: Record<string, number>;  // slug → db id
  blogPostIds: Record<string, number>; // slug → db id
  pageModuleIds: Record<string, number>; // moduleKey → db id
}

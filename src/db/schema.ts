import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const publishStatusEnum = pgEnum("publish_status", [
  "draft",
  "published",
]);

export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "processing",
  "contacted",
  "quoted",
  "won",
  "done",
]);
export const quoteStatusEnum = pgEnum("quote_status", [
  "new",
  "reviewing",
  "quoted",
  "closed",
]);

export const assetTypeEnum = pgEnum("asset_type", ["image", "file"]);
export const pageKeyEnum = pgEnum("page_key", ["home", "about", "contact"]);
export const fieldInputTypeEnum = pgEnum("field_input_type", [
  "text",
  "textarea",
  "number",
  "select",
]);

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  companyNameZh: text("company_name_zh").notNull(),
  companyNameEn: text("company_name_en").notNull(),
  taglineZh: text("tagline_zh"),
  taglineEn: text("tagline_en"),
  email: text("email").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  addressZh: text("address_zh"),
  addressEn: text("address_en"),
  logoMediaId: integer("logo_media_id"),
  defaultPublicLocale: varchar("default_public_locale", { length: 8 })
    .default("en")
    .notNull(),
  themePrimaryColor: varchar("theme_primary_color", { length: 50 }).default('#0f172a').notNull(),
  themeBorderRadius: varchar("theme_border_radius", { length: 20 }).default('0.5rem').notNull(),
  themeFontFamily: varchar("theme_font_family", { length: 100 }).default('Inter, sans-serif').notNull(),
  formFieldsJson: jsonb("form_fields_json").$type<Array<{ name: string; label: string; type: 'text'|'textarea'|'file'; required: boolean; placeholder?: string }>>().default([]).notNull(),
  // SEO 全局配置
  siteUrl: text("site_url"),                          // 例如 https://acme.com（无尾斜杠），用�?metadataBase + canonical
  seoTitleTemplate: text("seo_title_template"),        // 例如 "%s | Acme CNC Machining"
  seoOgImageMediaId: integer("seo_og_image_media_id"), // 默认 OG 社交分享�?  webhookUrl: text("webhook_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const adminRolesEnum = pgEnum("admin_roles", [
  "client_admin", // Not used locally if managed by ENV, but good for future
  "employee", // Client's employee
]);

export const adminUsers = pgTable("admin_users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: adminRolesEnum("role").default("employee").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const pageModules = pgTable("page_modules", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pageKey: pageKeyEnum("page_key").notNull(),
  moduleKey: varchar("module_key", { length: 80 }).notNull(),
  moduleNameZh: text("module_name_zh").notNull(),
  moduleNameEn: text("module_name_en").notNull(),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  sortOrder: integer("sort_order").default(100).notNull(),
  payloadJson: jsonb("payload_json")
    .$type<Record<string, unknown>>()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const mediaAssets = pgTable("media_assets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  assetType: assetTypeEnum("asset_type").notNull(),
  bucketKey: text("bucket_key").notNull().unique(),
  url: text("url").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  width: integer("width"),
  height: integer("height"),
  folderId: integer("folder_id"),
  altTextZh: text("alt_text_zh"),
  altTextEn: text("alt_text_en"),
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const assetFolders = pgTable("asset_folders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  assetType: assetTypeEnum("asset_type").notNull(),
  name: text("name").notNull(),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(100).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const productCategories = pgTable("product_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nameZh: text("name_zh").notNull(),
  nameEn: text("name_en").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  summaryZh: text("summary_zh"),
  summaryEn: text("summary_en"),
  imageMediaId: integer("image_media_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  sortOrder: integer("sort_order").default(100).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  categoryId: integer("category_id").references(() => productCategories.id, {
    onDelete: "set null",
  }),
  nameZh: text("name_zh").notNull(),
  nameEn: text("name_en").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  shortDescriptionZh: text("short_description_zh"),
  shortDescriptionEn: text("short_description_en"),
  detailsZh: text("details_zh"),
  detailsEn: text("details_en"),
  coverMediaId: integer("cover_media_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  pdfFileId: integer("pdf_file_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  status: publishStatusEnum("status").default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  showInquiryButton: boolean("show_inquiry_button").default(true).notNull(),
  showWhatsappButton: boolean("show_whatsapp_button").default(true).notNull(),
  showPdfDownload: boolean("show_pdf_download").default(false).notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  sortOrder: integer("sort_order").default(100).notNull(),
  faqsJson: jsonb("faqs_json")
    .$type<Array<{ question: string; answer: string }>>()
    .default([])
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const productDefaultFieldDefinitions = pgTable(
  "product_default_field_definitions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    fieldKey: varchar("field_key", { length: 80 }).notNull().unique(),
    labelZh: text("label_zh").notNull(),
    labelEn: text("label_en").notNull(),
    inputType: fieldInputTypeEnum("input_type").default("text").notNull(),
    sortOrder: integer("sort_order").default(100).notNull(),
    isVisibleByDefault: boolean("is_visible_by_default").default(true).notNull(),
  },
);

export const productDefaultFieldValues = pgTable("product_default_field_values", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  fieldKey: varchar("field_key", { length: 80 })
    .notNull()
    .references(() => productDefaultFieldDefinitions.fieldKey, {
      onDelete: "cascade",
    }),
  valueZh: text("value_zh"),
  valueEn: text("value_en"),
  isVisible: boolean("is_visible").default(true).notNull(),
  sortOrder: integer("sort_order").default(100).notNull(),
});

export const productCustomFields = pgTable("product_custom_fields", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  labelZh: text("label_zh").notNull(),
  labelEn: text("label_en").notNull(),
  valueZh: text("value_zh"),
  valueEn: text("value_en"),
  inputType: fieldInputTypeEnum("input_type").default("text").notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  sortOrder: integer("sort_order").default(100).notNull(),
});

export const productMediaRelations = pgTable("product_media_relations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  mediaAssetId: integer("media_asset_id")
    .notNull()
    .references(() => mediaAssets.id, { onDelete: "cascade" }),
  relationType: varchar("relation_type", { length: 40 }).default("gallery").notNull(),
  sortOrder: integer("sort_order").default(100).notNull(),
});

export const downloadFiles = pgTable("download_files", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  mediaAssetId: integer("media_asset_id")
    .notNull()
    .references(() => mediaAssets.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  displayNameZh: text("display_name_zh").notNull(),
  displayNameEn: text("display_name_en").notNull(),
  category: varchar("category", { length: 80 }),
  language: varchar("language", { length: 16 }),
  description: text("description"),
  isVisible: boolean("is_visible").default(true).notNull(),
  sortOrder: integer("sort_order").default(100).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const blogCategories = pgTable("blog_categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nameZh: text("name_zh").notNull(),
  nameEn: text("name_en").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  sortOrder: integer("sort_order").default(100).notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
});

export const blogTags = pgTable("blog_tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nameZh: text("name_zh").notNull(),
  nameEn: text("name_en").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
});

export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  categoryId: integer("category_id").references(() => blogCategories.id, {
    onDelete: "set null",
  }),
  titleZh: text("title_zh").notNull(),
  titleEn: text("title_en").notNull(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  excerptZh: text("excerpt_zh"),
  excerptEn: text("excerpt_en"),
  contentZh: text("content_zh"),
  contentEn: text("content_en"),
  coverMediaId: integer("cover_media_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  status: publishStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const blogPostTags = pgTable("blog_post_tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  blogPostId: integer("blog_post_id")
    .notNull()
    .references(() => blogPosts.id, { onDelete: "cascade" }),
  blogTagId: integer("blog_tag_id")
    .notNull()
    .references(() => blogTags.id, { onDelete: "cascade" }),
});

export const inquiries = pgTable("inquiries", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  companyName: text("company_name"),
  country: text("country"),
  countryCode: varchar("country_code", { length: 8 }),
  countryGroup: varchar("country_group", { length: 40 }),
  whatsapp: text("whatsapp"),
  message: text("message").notNull(),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  sourcePage: text("source_page"),
  sourceUrl: text("source_url"),
  sourceType: varchar("source_type", { length: 40 }),
  categoryTag: varchar("category_tag", { length: 160 }),
  inquiryType: varchar("inquiry_type", { length: 40 }),
  classificationMethod: varchar("classification_method", { length: 20 })
    .default("rule")
    .notNull(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmTerm: text("utm_term"),
  utmContent: text("utm_content"),
  gclid: text("gclid"),
  annualVolume: text("annual_volume"),
  companyWebsite: text("company_website"),
  customFieldsJson: jsonb("custom_fields_json").$type<Record<string, unknown>>().default({}).notNull(),
  attachmentMediaId: integer("attachment_media_id").references(
    () => mediaAssets.id,
    {
      onDelete: "set null",
    },
  ),
  status: inquiryStatusEnum("status").default("new").notNull(),
  internalNote: text("internal_note"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  // Pipeline CRM
  pipelineStage: text("pipeline_stage").default("new"),
  expectedValue: numeric("expected_value", { precision: 12, scale: 2 }),
  lastContactAt: timestamp("last_contact_at", { withTimezone: true }),
  nextFollowUpAt: timestamp("next_follow_up_at", { withTimezone: true }),
  wonAt: timestamp("won_at", { withTimezone: true }),
});

export const replyTemplates = pgTable("reply_templates", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  category: varchar("category", { length: 80 }),
  contentZh: text("content_zh"),
  contentEn: text("content_en").notNull(),
  applicableScene: varchar("applicable_scene", { length: 80 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const productViews = pgTable("product_views", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  countryCode: varchar("country_code", { length: 8 }),
  referer: text("referer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const quoteRequests = pgTable("quote_requests", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  companyName: text("company_name"),
  country: text("country"),
  countryCode: varchar("country_code", { length: 8 }),
  whatsapp: text("whatsapp"),
  message: text("message").notNull(),
  status: quoteStatusEnum("status").default("new").notNull(),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmTerm: text("utm_term"),
  utmContent: text("utm_content"),
  gclid: text("gclid"),
  annualVolume: text("annual_volume"),
  companyWebsite: text("company_website"),
  customFieldsJson: jsonb("custom_fields_json").$type<Record<string, unknown>>().default({}).notNull(),
  attachmentMediaId: integer("attachment_media_id").references(
    () => mediaAssets.id,
    {
      onDelete: "set null",
    },
  ),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const quoteRequestItems = pgTable("quote_request_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  quoteRequestId: integer("quote_request_id")
    .notNull()
    .references(() => quoteRequests.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  productName: text("product_name").notNull(),
  quantity: text("quantity"),
  unit: varchar("unit", { length: 24 }),
  notes: text("notes"),
});

export const seoAiSettings = pgTable("seo_ai_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  allowGoogle: boolean("allow_google").default(true).notNull(),
  allowBing: boolean("allow_bing").default(true).notNull(),
  allowOaiSearchBot: boolean("allow_oai_search_bot").default(true).notNull(),
  allowClaudeSearchBot: boolean("allow_claude_search_bot")
    .default(true)
    .notNull(),
  allowPerplexityBot: boolean("allow_perplexity_bot").default(true).notNull(),
  allowGptBot: boolean("allow_gpt_bot").default(false).notNull(),
  allowClaudeBot: boolean("allow_claude_bot").default(false).notNull(),
  extraRobotsTxt: text("extra_robots_txt"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const featureUsageCounters = pgTable("feature_usage_counters", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  featureKey: varchar("feature_key", { length: 80 }).notNull().unique(),
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

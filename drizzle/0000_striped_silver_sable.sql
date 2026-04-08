CREATE TYPE "public"."asset_type" AS ENUM('image', 'file');--> statement-breakpoint
CREATE TYPE "public"."field_input_type" AS ENUM('text', 'textarea', 'number', 'select');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('new', 'processing', 'done');--> statement-breakpoint
CREATE TYPE "public"."page_key" AS ENUM('home', 'about', 'contact');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_zh" text NOT NULL,
	"name_en" text NOT NULL,
	"slug" varchar(160) NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_post_tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_post_tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"blog_post_id" integer NOT NULL,
	"blog_tag_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category_id" integer,
	"title_zh" text NOT NULL,
	"title_en" text NOT NULL,
	"slug" varchar(160) NOT NULL,
	"excerpt_zh" text,
	"excerpt_en" text,
	"content_zh" text,
	"content_en" text,
	"cover_media_id" integer,
	"seo_title" text,
	"seo_description" text,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_zh" text NOT NULL,
	"name_en" text NOT NULL,
	"slug" varchar(160) NOT NULL,
	CONSTRAINT "blog_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "download_files" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "download_files_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"media_asset_id" integer NOT NULL,
	"product_id" integer,
	"display_name_zh" text NOT NULL,
	"display_name_en" text NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "inquiries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company_name" text,
	"country" text,
	"whatsapp" text,
	"message" text NOT NULL,
	"product_id" integer,
	"source_page" text,
	"source_url" text,
	"attachment_media_id" integer,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"internal_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "media_assets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"asset_type" "asset_type" NOT NULL,
	"bucket_key" text NOT NULL,
	"url" text NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"alt_text_zh" text,
	"alt_text_en" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_assets_bucket_key_unique" UNIQUE("bucket_key")
);
--> statement-breakpoint
CREATE TABLE "page_modules" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "page_modules_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"page_key" "page_key" NOT NULL,
	"module_key" varchar(80) NOT NULL,
	"module_name_zh" text NOT NULL,
	"module_name_en" text NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"payload_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name_zh" text NOT NULL,
	"name_en" text NOT NULL,
	"slug" varchar(160) NOT NULL,
	"summary_zh" text,
	"summary_en" text,
	"image_media_id" integer,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_custom_fields" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_custom_fields_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"label_zh" text NOT NULL,
	"label_en" text NOT NULL,
	"value_zh" text,
	"value_en" text,
	"input_type" "field_input_type" DEFAULT 'text' NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_default_field_definitions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_default_field_definitions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"field_key" varchar(80) NOT NULL,
	"label_zh" text NOT NULL,
	"label_en" text NOT NULL,
	"input_type" "field_input_type" DEFAULT 'text' NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"is_visible_by_default" boolean DEFAULT true NOT NULL,
	CONSTRAINT "product_default_field_definitions_field_key_unique" UNIQUE("field_key")
);
--> statement-breakpoint
CREATE TABLE "product_default_field_values" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_default_field_values_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"field_key" varchar(80) NOT NULL,
	"value_zh" text,
	"value_en" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_media_relations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_media_relations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"media_asset_id" integer NOT NULL,
	"relation_type" varchar(40) DEFAULT 'gallery' NOT NULL,
	"sort_order" integer DEFAULT 100 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category_id" integer,
	"name_zh" text NOT NULL,
	"name_en" text NOT NULL,
	"slug" varchar(160) NOT NULL,
	"short_description_zh" text,
	"short_description_en" text,
	"details_zh" text,
	"details_en" text,
	"cover_media_id" integer,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"show_inquiry_button" boolean DEFAULT true NOT NULL,
	"show_whatsapp_button" boolean DEFAULT true NOT NULL,
	"show_pdf_download" boolean DEFAULT false NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"sort_order" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "seo_ai_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "seo_ai_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"allow_google" boolean DEFAULT true NOT NULL,
	"allow_bing" boolean DEFAULT true NOT NULL,
	"allow_oai_search_bot" boolean DEFAULT true NOT NULL,
	"allow_claude_search_bot" boolean DEFAULT true NOT NULL,
	"allow_perplexity_bot" boolean DEFAULT true NOT NULL,
	"allow_gpt_bot" boolean DEFAULT false NOT NULL,
	"allow_claude_bot" boolean DEFAULT false NOT NULL,
	"extra_robots_txt" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "site_settings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_name_zh" text NOT NULL,
	"company_name_en" text NOT NULL,
	"tagline_zh" text,
	"tagline_en" text,
	"email" text NOT NULL,
	"phone" text,
	"whatsapp" text,
	"address_zh" text,
	"address_en" text,
	"logo_media_id" integer,
	"default_public_locale" varchar(8) DEFAULT 'en' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_blog_tag_id_blog_tags_id_fk" FOREIGN KEY ("blog_tag_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_cover_media_id_media_assets_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "download_files" ADD CONSTRAINT "download_files_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "download_files" ADD CONSTRAINT "download_files_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_attachment_media_id_media_assets_id_fk" FOREIGN KEY ("attachment_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_media_id_media_assets_id_fk" FOREIGN KEY ("image_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_custom_fields" ADD CONSTRAINT "product_custom_fields_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_default_field_values" ADD CONSTRAINT "product_default_field_values_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_default_field_values" ADD CONSTRAINT "product_default_field_values_field_key_product_default_field_definitions_field_key_fk" FOREIGN KEY ("field_key") REFERENCES "public"."product_default_field_definitions"("field_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media_relations" ADD CONSTRAINT "product_media_relations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_media_relations" ADD CONSTRAINT "product_media_relations_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_cover_media_id_media_assets_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;
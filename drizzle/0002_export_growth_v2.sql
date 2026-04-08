ALTER TABLE "download_files" ADD COLUMN "category" varchar(80);--> statement-breakpoint
ALTER TABLE "download_files" ADD COLUMN "language" varchar(16);--> statement-breakpoint
ALTER TABLE "download_files" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "country_code" varchar(8);--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "country_group" varchar(40);--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "source_type" varchar(40);--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "category_tag" varchar(160);--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "inquiry_type" varchar(40);--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "classification_method" varchar(20) DEFAULT 'rule' NOT NULL;--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('new', 'reviewing', 'quoted', 'closed');--> statement-breakpoint
CREATE TABLE "reply_templates" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reply_templates_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
  "title" text NOT NULL,
  "category" varchar(80),
  "content_zh" text,
  "content_en" text NOT NULL,
  "applicable_scene" varchar(80),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "product_views" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_views_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
  "product_id" integer NOT NULL,
  "session_id" varchar(64) NOT NULL,
  "country_code" varchar(8),
  "referer" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "quote_requests" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "quote_requests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
  "name" text NOT NULL,
  "email" text NOT NULL,
  "company_name" text,
  "country" text,
  "country_code" varchar(8),
  "whatsapp" text,
  "message" text NOT NULL,
  "status" "public"."quote_status" DEFAULT 'new' NOT NULL,
  "attachment_media_id" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "quote_request_items" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "quote_request_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
  "quote_request_id" integer NOT NULL,
  "product_id" integer,
  "product_name" text NOT NULL,
  "quantity" text,
  "unit" varchar(24),
  "notes" text
);--> statement-breakpoint
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_attachment_media_id_media_assets_id_fk" FOREIGN KEY ("attachment_media_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_request_items" ADD CONSTRAINT "quote_request_items_quote_request_id_quote_requests_id_fk" FOREIGN KEY ("quote_request_id") REFERENCES "public"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_request_items" ADD CONSTRAINT "quote_request_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;

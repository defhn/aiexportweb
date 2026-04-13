ALTER TYPE "public"."inquiry_status" ADD VALUE 'contacted' BEFORE 'done';--> statement-breakpoint
ALTER TYPE "public"."inquiry_status" ADD VALUE 'quoted' BEFORE 'done';--> statement-breakpoint
ALTER TYPE "public"."inquiry_status" ADD VALUE 'won' BEFORE 'done';--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "utm_source" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "utm_medium" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "utm_campaign" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "utm_term" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "utm_content" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "gclid" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "annual_volume" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "company_website" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "pipeline_stage" text DEFAULT 'new';--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "expected_value" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "last_contact_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "next_follow_up_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "won_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "utm_source" text;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "utm_medium" text;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "utm_campaign" text;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "utm_term" text;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "utm_content" text;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "gclid" text;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "annual_volume" text;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "company_website" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "site_url" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "seo_title_template" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "seo_og_image_media_id" integer;
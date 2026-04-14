ALTER TABLE "products" ADD COLUMN "embedding_json" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "embedding_updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "company_knowledge_md" text;
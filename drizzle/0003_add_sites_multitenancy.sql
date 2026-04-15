CREATE TYPE "public"."site_plan" AS ENUM('basic', 'growth', 'ai_sales');
CREATE TYPE "public"."site_status" AS ENUM('draft', 'active', 'suspended');

CREATE TABLE IF NOT EXISTS "sites" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" text NOT NULL,
  "slug" varchar(160) NOT NULL UNIQUE,
  "domain" text UNIQUE,
  "subdomain" varchar(160),
  "template_id" varchar(40) DEFAULT 'template-01' NOT NULL,
  "seed_pack_key" varchar(80) DEFAULT 'cnc' NOT NULL,
  "plan" "site_plan" DEFAULT 'basic' NOT NULL,
  "status" "site_status" DEFAULT 'active' NOT NULL,
  "company_name" text NOT NULL,
  "logo_url" text,
  "primary_color" varchar(50),
  "enabled_features_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

INSERT INTO "sites" ("name", "slug", "domain", "subdomain", "template_id", "seed_pack_key", "plan", "status", "company_name")
VALUES
  ('CNC Precision Demo', 'cnc-demo', 'cnc.demo.localhost', 'cnc', 'template-01', 'cnc', 'basic', 'active', 'CNC Precision Demo'),
  ('Industrial Equipment Demo', 'equipment-demo', 'equipment.demo.localhost', 'equipment', 'template-02', 'industrial-equipment', 'basic', 'active', 'Industrial Equipment Demo'),
  ('Building Materials Demo', 'building-demo', 'building.demo.localhost', 'building', 'template-03', 'building-materials', 'basic', 'active', 'Building Materials Demo'),
  ('Energy Power Demo', 'energy-demo', 'energy.demo.localhost', 'energy', 'template-04', 'energy-power', 'basic', 'active', 'Energy Power Demo'),
  ('Medical Health Demo', 'medical-demo', 'medical.demo.localhost', 'medical', 'template-05', 'medical-health', 'basic', 'active', 'Medical Health Demo'),
  ('Fluid HVAC Demo', 'hvac-demo', 'hvac.demo.localhost', 'hvac', 'template-06', 'fluid-hvac', 'basic', 'active', 'Fluid HVAC Demo'),
  ('Lighting Demo', 'lighting-demo', 'lighting.demo.localhost', 'lighting', 'template-07', 'lighting', 'basic', 'active', 'Lighting Demo'),
  ('Hardware Plastics Demo', 'hardware-demo', 'hardware.demo.localhost', 'hardware', 'template-08', 'hardware-plastics', 'basic', 'active', 'Hardware Plastics Demo'),
  ('Furniture Outdoor Demo', 'furniture-demo', 'furniture.demo.localhost', 'furniture', 'template-09', 'furniture-outdoor', 'basic', 'active', 'Furniture Outdoor Demo'),
  ('Textile Packaging Demo', 'packaging-demo', 'packaging.demo.localhost', 'packaging', 'template-10', 'textile-packaging', 'basic', 'active', 'Textile Packaging Demo'),
  ('Consumer Electronics Demo', 'electronics-demo', 'electronics.demo.localhost', 'electronics', 'template-11', 'consumer-electronics', 'basic', 'active', 'Consumer Electronics Demo'),
  ('Lifestyle Gifts Demo', 'gifts-demo', 'gifts.demo.localhost', 'gifts', 'template-12', 'lifestyle', 'basic', 'active', 'Lifestyle Gifts Demo')
ON CONFLICT ("slug") DO NOTHING;

ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "page_modules" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "media_assets" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "asset_folders" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "product_categories" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "blog_categories" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "blog_tags" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "inquiries" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "reply_templates" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "quote_requests" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "seo_ai_settings" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;
ALTER TABLE "feature_usage_counters" ADD COLUMN IF NOT EXISTS "site_id" integer REFERENCES "sites"("id") ON DELETE cascade;

UPDATE "site_settings" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "page_modules" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "media_assets" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "asset_folders" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "product_categories" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "products" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "blog_categories" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "blog_tags" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "blog_posts" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "inquiries" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "reply_templates" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "quote_requests" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "seo_ai_settings" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;
UPDATE "feature_usage_counters" SET "site_id" = (SELECT "id" FROM "sites" WHERE "slug" = 'cnc-demo') WHERE "site_id" IS NULL;

ALTER TABLE "product_categories" DROP CONSTRAINT IF EXISTS "product_categories_slug_unique";
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_slug_unique";
ALTER TABLE "blog_categories" DROP CONSTRAINT IF EXISTS "blog_categories_slug_unique";
ALTER TABLE "blog_tags" DROP CONSTRAINT IF EXISTS "blog_tags_slug_unique";
ALTER TABLE "blog_posts" DROP CONSTRAINT IF EXISTS "blog_posts_slug_unique";

CREATE UNIQUE INDEX IF NOT EXISTS "product_categories_site_slug_unique"
  ON "product_categories" (COALESCE("site_id", 0), "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "products_site_slug_unique"
  ON "products" (COALESCE("site_id", 0), "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "blog_categories_site_slug_unique"
  ON "blog_categories" (COALESCE("site_id", 0), "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "blog_tags_site_slug_unique"
  ON "blog_tags" (COALESCE("site_id", 0), "slug");
CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_site_slug_unique"
  ON "blog_posts" (COALESCE("site_id", 0), "slug");

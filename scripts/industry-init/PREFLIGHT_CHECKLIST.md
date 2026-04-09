# Pre-flight Checklist - Schema Compatibility Check

Send this file to Antigravity before running industry-init scripts in a NEW project.
Say: Read this checklist, check schema compatibility, fix any mismatches, then run run.ts

---

## Step 1 - Read the Schema

Read src/db/schema.ts completely.
List every table and its Drizzle column accessor names.

---

## Step 2 - Check Required Tables and Columns

### siteSettings
  companyNameZh, companyNameEn, taglineZh, taglineEn
  email, phone, whatsapp, addressEn
  adminUsername, adminPasswordHash
  metaTitleSuffixEn  (ADD if missing)
  metaDescriptionEn  (ADD if missing)
  faqsJson jsonb     (ADD if missing)
  ogImageUrl         (ADD if missing - used by upload-images.ts)

### productCategories
  nameZh, nameEn, slug (unique), summaryZh, summaryEn
  sortOrder, isFeatured
  imageSrcUrl        (ADD if missing - used by upload-images.ts)

### products
  categoryId (FK), nameZh, nameEn, slug (unique)
  shortDescriptionZh, shortDescriptionEn
  detailsZh, detailsEn, seoTitle, seoDescription
  sortOrder, isFeatured, isVisible
  coverMediaId integer FK -> mediaAssets.id  (ADD if missing)

### productCustomFields
  productId (FK), labelZh, labelEn, valueZh, valueEn, visible, sortOrder
  If table does NOT exist: remove customFields insert in db-seed.ts

### productDefaultFieldValues
  If table does NOT exist: remove this line in db-seed.ts:
    await db.delete(schema.productDefaultFieldValues)

### blogCategories
  nameZh, nameEn, slug

### blogPosts
  categoryId (FK), titleZh, titleEn, slug
  excerptZh, excerptEn, contentZh, contentEn
  tags (text[] or jsonb), publishedAt, isPublished
  coverMediaId integer FK -> mediaAssets.id  (ADD if missing)

### pageModules
  pageKey (enum: home/about/contact), moduleKey
  moduleNameZh, moduleNameEn, isEnabled, sortOrder, payloadJson jsonb
  If table does NOT exist:
    Comment out seedPageModules() in run.ts
    Comment out pageModules case in upload-images.ts

### mediaAssets
  assetType, bucketKey (unique), url, fileName, mimeType, fileSize, width, height
  This table is REQUIRED. Create it if missing.
---

## Step 3 - Fix Import Paths

In db-seed.ts check: import * as schema from ../../../src/db/schema
In upload-images.ts check: import * as schema from ../../src/db/schema
Update path if target project stores schema elsewhere.

---

## Step 4 - Add Missing Columns (SQL)

Run in Neon SQL Editor or via psql:

  ALTER TABLE site_settings
    ADD COLUMN IF NOT EXISTS meta_title_suffix_en text,
    ADD COLUMN IF NOT EXISTS meta_description_en text,
    ADD COLUMN IF NOT EXISTS faqs_json jsonb,
    ADD COLUMN IF NOT EXISTS og_image_url text;

  ALTER TABLE product_categories
    ADD COLUMN IF NOT EXISTS image_src_url text;

  ALTER TABLE products
    ADD COLUMN IF NOT EXISTS cover_media_id integer REFERENCES media_assets(id);

  ALTER TABLE blog_posts
    ADD COLUMN IF NOT EXISTS cover_media_id integer REFERENCES media_assets(id);

OR: add columns to schema.ts then run: npx drizzle-kit push

---

## Step 5 - Fix Column Name Mismatches

If the project uses different Drizzle accessor names (e.g. title vs titleEn):
  Search for .values({ in db-seed.ts
  Check each key matches the actual schema column name.
  Search for .set({ in upload-images.ts
  Same check.

---

## Step 6 - Verify Then Run

After all fixes verify TypeScript compiles:
  npx tsc --noEmit

Then run Phase 1:
  npx tsx scripts/industry-init/run.ts --config your-industry

---

## Compatibility Score Card

| Item | Required | OK? |
|---|---|---|
| siteSettings base columns exist | YES | [ ] |
| siteSettings metaTitleSuffixEn | YES | [ ] |
| siteSettings faqsJson | YES | [ ] |
| siteSettings ogImageUrl | Phase 3 | [ ] |
| productCategories imageSrcUrl | Phase 3 | [ ] |
| products coverMediaId | Phase 3 | [ ] |
| blogPosts coverMediaId | Phase 3 | [ ] |
| mediaAssets table exists | YES | [ ] |
| pageModules table exists | Optional | [ ] |
| import paths in db-seed.ts correct | YES | [ ] |
| import paths in upload-images.ts correct | YES | [ ] |

All YES items checked -> run scripts.
Missing Phase 3 items -> scripts run, images just not linked to DB.
pageModules missing -> comment out those calls, content seeding still works.
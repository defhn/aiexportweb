import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SingleBar, Presets } from "cli-progress";
import { and, eq } from "drizzle-orm";
import "../src/env";
import { getDb } from "../src/db/client";
import { productCategories, productDefaultFieldDefinitions, productDefaultFieldValues, productCustomFields, products, sites } from "../src/db/schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "tmp", "gemini-product-output");
const STATE_FILE = path.join(OUTPUT_DIR, "progress.json");
const MANIFEST_FILE = path.join(OUTPUT_DIR, "manifest.json");

const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf-8")) as Array<{ key: string; file: string; count: number }>;
const progress = fs.existsSync(STATE_FILE)
  ? (JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")) as Record<string, number>)
  : {};

const bar = new SingleBar({ format: " {bar} | {filename} | {value}/{total} 产品" }, Presets.shades_classic);
const db = getDb();

async function saveProgress() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(progress, null, 2), "utf-8");
}

async function getOrCreateSite(siteKey: string, companyName: string) {
  const existing = await db.select().from(sites).where(eq(sites.slug, siteKey)).limit(1);
  if (existing.length) return existing[0].id;

  const inserted = await db.insert(sites).values({
    name: companyName,
    slug: siteKey,
    templateId: "template-01",
    seedPackKey: siteKey,
    plan: "ai_sales",
    status: "active",
    companyName,
    enabledFeaturesJson: [],
  }).returning();

  return inserted[0].id;
}

async function ensureCategories(siteId: number, packCategories: Array<any>) {
  const existing = await db.select().from(productCategories).where(eq(productCategories.siteId, siteId));
  if (existing.length) return new Map(existing.map((c) => [c.slug, c.id]));

  const inserted = await db.insert(productCategories).values(
    packCategories.map((category) => ({
      siteId,
      nameZh: category.nameZh,
      nameEn: category.nameEn,
      slug: category.slug,
      summaryZh: category.summaryZh,
      summaryEn: category.summaryEn,
      sortOrder: category.sortOrder,
      isFeatured: category.isFeatured,
    })),
  ).returning();

  return new Map(inserted.map((c) => [c.slug, c.id]));
}

async function insertSite(file: string, siteKey: string) {
  const pack = JSON.parse(fs.readFileSync(file, "utf-8"));
  const already = progress[siteKey] ?? 0;
  const siteId = await getOrCreateSite(siteKey, pack?.site?.companyNameEn ?? siteKey);
  const categoryMap = await ensureCategories(siteId, pack.categories ?? []);
  const defs = await db.select().from(productDefaultFieldDefinitions);
  const definitionMap = new Map(defs.map((def) => [def.fieldKey, def.sortOrder]));

  bar.start(pack.products.length, already, { filename: siteKey });

  for (const item of pack.products.slice(already)) {
    const exists = await db
      .select()
      .from(products)
      .where(and(eq(products.siteId, siteId), eq(products.slug, item.slug)))
      .limit(1);

    if (exists.length) {
      progress[siteKey] = (progress[siteKey] ?? 0) + 1;
      await saveProgress();
      bar.increment({ filename: `${siteKey} skip ${item.slug}` });
      continue;
    }

    const inserted = await db.insert(products).values({
      siteId,
      categoryId: categoryMap.get(item.categorySlug) ?? null,
      nameZh: item.nameZh,
      nameEn: item.nameEn,
      slug: item.slug,
      shortDescriptionZh: item.shortDescriptionZh,
      shortDescriptionEn: item.shortDescriptionEn,
      detailsZh: item.detailsZh,
      detailsEn: item.detailsEn,
      status: "published",
      isFeatured: item.isFeatured,
      showInquiryButton: true,
      showWhatsappButton: true,
      showPdfDownload: false,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      sortOrder: item.sortOrder,
    }).returning();

    const productId = inserted[0].id;
    const defaultRows = Object.entries(item.defaultFields ?? {})
      .filter(([fieldKey]) => definitionMap.has(fieldKey))
      .map(([fieldKey, value]: any) => ({
        productId,
        fieldKey,
        valueZh: value.valueZh,
        valueEn: value.valueEn,
        isVisible: value.visible,
        sortOrder: definitionMap.get(fieldKey) ?? 100,
      }));

    const customRows = (item.customFields ?? []).map((f: any) => ({
      productId,
      labelZh: f.labelZh,
      labelEn: f.labelEn,
      valueZh: f.valueZh,
      valueEn: f.valueEn,
      inputType: "text" as const,
      isVisible: f.visible,
      sortOrder: f.sortOrder,
    }));

    if (defaultRows.length) await db.insert(productDefaultFieldValues).values(defaultRows);
    if (customRows.length) await db.insert(productCustomFields).values(customRows);

    progress[siteKey] = (progress[siteKey] ?? 0) + 1;
    await saveProgress();
    bar.increment({ filename: `${siteKey} ${item.nameEn}` });
  }

  bar.stop();
}

async function main() {
  for (const site of manifest) {
    await insertSite(site.file, site.key);
  }
  console.log("\n✅ 插入完成");
}

main().catch((error) => {
  console.error("插入失败", error);
  process.exitCode = 1;
});

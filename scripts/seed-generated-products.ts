/**
 * 脚本2: seed-generated-products.ts
 * ─────────────────────────────────────────
 * 读取 scripts/industry-products-data.json，将产品分类和产品数据插入数据库。
 * - 先检查 DB 是否已有该行业的分类（有则跳过创建）
 * - 先检查 DB 是否已有产品（按 slug 查重，跳过已存在的）
 * - 支持断点续传：通过进度文件 scripts/seed-progress.json 记录已插入的行业
 * - 同时插入 defaultFieldValues 和 customFields
 *
 * 注意：本脚本在站点无 siteId 约束的环境下运行（单站点模式，siteId = null）
 *
 * 运行方式：
 *   npx tsx scripts/seed-generated-products.ts
 *   npx tsx scripts/seed-generated-products.ts --reset   # 重置进度，重新插入
 *   npx tsx scripts/seed-generated-products.ts energy-power  # 只插入指定行业
 */
// 加载 .env.local 环境变量（脚本直接运行时 Next.js 不会自动注入）
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname2 = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.resolve(__dirname2, "../.env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf-8").split("\n")) {
    const i = line.indexOf("=");
    if (i > 0 && line[0] !== "#" && line[0] !== " ") {
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}
import { eq, inArray } from "drizzle-orm";
import { getDb } from "../src/db/client";
import {
  productCategories,
  productCustomFields,
  productDefaultFieldDefinitions,
  productDefaultFieldValues,
  products,
} from "../src/db/schema";
import { defaultFieldDefinitions } from "../src/db/seed/default-field-defs";

const __dirname = __dirname2;
const DATA_FILE = path.resolve(__dirname, "industry-products-data.json");
const PROGRESS_FILE = path.resolve(__dirname, "seed-progress.json");

// ─── 有效的 defaultField keys（来自 default-field-defs.ts）────────────────────
const VALID_FIELD_KEYS = new Set(
  defaultFieldDefinitions.map((d) => d.fieldKey)
);

// ─── 加载进度 ─────────────────────────────────────────────────────────────────
function loadProgress(): Set<string> {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8")) as string[];
      return new Set(data);
    } catch {
      return new Set();
    }
  }
  return new Set();
}

function saveProgress(done: Set<string>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify([...done], null, 2), "utf-8");
}

// ─── 插入单个行业 ─────────────────────────────────────────────────────────────
async function seedIndustry(
  db: ReturnType<typeof getDb>,
  industryData: {
    key: string;
    categories: Array<{
      nameZh: string;
      nameEn: string;
      slug: string;
      summaryEn: string;
    }>;
    products: Array<{
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
      defaultFields: Record<string, { valueZh: string; valueEn: string; visible: boolean }>;
      customFields: Array<{
        labelZh: string;
        labelEn: string;
        valueZh: string;
        valueEn: string;
        visible: boolean;
        sortOrder: number;
      }>;
    }>;
  }
): Promise<{ categoriesInserted: number; productsInserted: number; skipped: number }> {
  let categoriesInserted = 0;
  let productsInserted = 0;
  let skipped = 0;

  // ── 1. 检查并（按需）插入分类 ──────────────────────────────────────────────
  const existingCats = await db
    .select({ id: productCategories.id, slug: productCategories.slug })
    .from(productCategories)
    .where(
      inArray(
        productCategories.slug,
        industryData.categories.map((c) => c.slug)
      )
    );
  const existingCatSlugs = new Set(existingCats.map((c) => c.slug));
  const categoryIdMap = new Map(existingCats.map((c) => [c.slug, c.id]));

  const catsToInsert = industryData.categories.filter(
    (c) => !existingCatSlugs.has(c.slug)
  );

  if (catsToInsert.length > 0) {
    const inserted = await db
      .insert(productCategories)
      .values(
        catsToInsert.map((c, idx) => ({
          nameZh: c.nameZh,
          nameEn: c.nameEn,
          slug: c.slug,
          summaryZh: c.nameZh,  // 简单复用中文名作为摘要
          summaryEn: c.summaryEn,
          sortOrder: (idx + 1) * 10,
          isFeatured: idx < 3,
        }))
      )
      .returning({ id: productCategories.id, slug: productCategories.slug });

    for (const cat of inserted) {
      categoryIdMap.set(cat.slug, cat.id);
    }
    categoriesInserted = catsToInsert.length;
    console.log(`    📁 插入 ${catsToInsert.length} 个新分类`);
  } else {
    console.log(`    📁 所有分类已存在，跳过`);
  }

  // ── 2. 查询已有产品（按 slug 查重）─────────────────────────────────────────
  const existingProducts = await db
    .select({ slug: products.slug })
    .from(products)
    .where(
      inArray(
        products.slug,
        industryData.products.map((p) => p.slug)
      )
    );
  const existingSlugs = new Set(existingProducts.map((p) => p.slug));

  // ── 3. 确保 defaultFieldDefinitions 在 DB 中都存在 ──────────────────────────
  const existingDefs = await db
    .select({ fieldKey: productDefaultFieldDefinitions.fieldKey })
    .from(productDefaultFieldDefinitions);
  const existingDefKeys = new Set(existingDefs.map((d) => d.fieldKey));
  const missingDefs = defaultFieldDefinitions.filter(
    (d) => !existingDefKeys.has(d.fieldKey)
  );
  if (missingDefs.length > 0) {
    await db.insert(productDefaultFieldDefinitions).values(
      missingDefs.map((d) => ({
        fieldKey: d.fieldKey,
        labelZh: d.labelZh,
        labelEn: d.labelEn,
        inputType: d.inputType as "text" | "textarea" | "number" | "select",
        sortOrder: d.sortOrder,
        isVisibleByDefault: d.isVisibleByDefault,
      }))
    );
    console.log(`    ⚙️  补充 ${missingDefs.length} 个字段定义`);
  }

  // ── 4. 逐条插入产品 ─────────────────────────────────────────────────────────
  for (const product of industryData.products) {
    if (existingSlugs.has(product.slug)) {
      skipped++;
      continue;
    }

    const categoryId = categoryIdMap.get(product.categorySlug) ?? null;
    if (!categoryId) {
      console.warn(`    ⚠️  未找到分类 ${product.categorySlug}，产品 ${product.slug} 跳过`);
      skipped++;
      continue;
    }

    // 插入产品主记录
    const [inserted] = await db
      .insert(products)
      .values({
        categoryId,
        nameZh: product.nameZh,
        nameEn: product.nameEn,
        slug: product.slug,
        shortDescriptionZh: product.shortDescriptionZh || null,
        shortDescriptionEn: product.shortDescriptionEn || null,
        detailsZh: product.detailsZh || null,
        detailsEn: product.detailsEn || null,
        status: "published" as const,
        isFeatured: product.isFeatured ?? false,
        showInquiryButton: true,
        showWhatsappButton: true,
        showPdfDownload: false,
        seoTitle: product.seoTitle || null,
        seoDescription: product.seoDescription || null,
        sortOrder: product.sortOrder ?? 100,
        faqsJson: [],
      })
      .onConflictDoNothing()
      .returning({ id: products.id });

    if (!inserted) {
      skipped++;
      continue; // slug 已存在，跳过
    }
    const productId = inserted.id;

    // 插入默认字段值（过滤掉不在 fieldKey 定义里的）
    const defaultFieldEntries = Object.entries(product.defaultFields ?? {}).filter(
      ([key]) => VALID_FIELD_KEYS.has(key as "model")
    );

    if (defaultFieldEntries.length > 0) {
      await db.insert(productDefaultFieldValues).values(
        defaultFieldEntries.map(([fieldKey, val]) => ({
          productId,
          fieldKey,
          valueZh: val.valueZh || null,
          valueEn: val.valueEn || null,
          isVisible: val.visible ?? true,
          sortOrder:
            defaultFieldDefinitions.find((d) => d.fieldKey === fieldKey)
              ?.sortOrder ?? 100,
        }))
      );
    }

    // 插入自定义字段
    if (product.customFields?.length > 0) {
      await db.insert(productCustomFields).values(
        product.customFields.map((cf) => ({
          productId,
          labelZh: cf.labelZh || cf.labelEn || "参数",
          labelEn: cf.labelEn || cf.labelZh || "Spec",
          valueZh: cf.valueZh || cf.valueEn || "",
          valueEn: cf.valueEn || cf.valueZh || "",
          inputType: "text" as const,
          isVisible: cf.visible ?? true,
          sortOrder: cf.sortOrder ?? 10,
        }))
      );
    }

    productsInserted++;
  }

  return { categoriesInserted, productsInserted, skipped };
}

// ─── 主函数 ───────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ 数据文件不存在: ${DATA_FILE}`);
    console.error(`请先运行: npx tsx scripts/gen-industry-products.ts`);
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const resetFlag = args.includes("--reset");
  const targetKey = args.find((a) => !a.startsWith("--"));

  const allData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Record<
    string,
    {
      key: string;
      categories: Array<{ nameZh: string; nameEn: string; slug: string; summaryEn: string }>;
      products: unknown[];
    }
  >;

  const progress = resetFlag ? new Set<string>() : loadProgress();
  const db = getDb();

  const industryKeys = targetKey
    ? [targetKey]
    : Object.keys(allData);

  console.log(`🌱 开始插入数据库 | 行业数: ${industryKeys.length} | 跳过已完成: ${!resetFlag}`);

  let totalCats = 0;
  let totalProducts = 0;
  let totalSkipped = 0;

  for (const key of industryKeys) {
    if (progress.has(key)) {
      console.log(`⏭️  ${key}: 已插入（进度缓存），跳过`);
      continue;
    }

    if (!allData[key]) {
      console.warn(`⚠️  未找到行业数据: ${key}`);
      continue;
    }

    console.log(`\n🏭 插入行业: ${key} (${(allData[key] as { products: unknown[] }).products.length} 条产品)...`);

    try {
      const result = await seedIndustry(db, allData[key] as Parameters<typeof seedIndustry>[1]);
      totalCats += result.categoriesInserted;
      totalProducts += result.productsInserted;
      totalSkipped += result.skipped;
      progress.add(key);
      saveProgress(progress);
      console.log(
        `  ✅ 分类+${result.categoriesInserted} | 产品+${result.productsInserted} | 跳过${result.skipped}`
      );
    } catch (e) {
      console.error(`  ❌ ${key} 插入失败: ${(e as Error).message}`);
    }
  }

  console.log(`\n🎉 完成！`);
  console.log(`  分类: +${totalCats} 个`);
  console.log(`  产品: +${totalProducts} 条`);
  console.log(`  跳过: ${totalSkipped} 条（已存在）`);
}

main().catch((e) => {
  console.error("脚本异常:", e);
  process.exit(1);
});

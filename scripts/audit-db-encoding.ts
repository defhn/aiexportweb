/**
 * 数据库乱码审计脚本 v2（使用 sql.query）
 * 运行方式：npx dotenv-cli -e .env.local -- npx tsx scripts/audit-db-encoding.ts
 */
import "../src/env";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

const sql = neon(DATABASE_URL);

// 覆盖最常见 GBK→UTF-8 乱码字符
const MOJIBAKE_JS = /閳|闁|閸|缂佸|瀹稿|娑撳|閺傛|鐠虹|婢佺|鐞涖|濠|娓|姒涙|濡|閼|娣|閺傚|缁毖|鏉|鐞娑/;

// PostgreSQL 正则（只取最高频的几个）
const PG_REGEX = "閳|闁|閸|缂佸|瀹稿|娑撳|閺傛|鐠虹|婢佺|鐞涖|娓氬|姒涙|娣団|鏉╂";

interface GarbledRecord {
  table: string;
  field: string;
  id: number;
  preview: string;
}

const results: GarbledRecord[] = [];

async function checkTable(
  tableName: string,
  idField: string,
  textFields: string[]
) {
  try {
    const whereClauses = textFields
      .map((f) => `"${f}" ~ '${PG_REGEX}'`)
      .join(" OR ");

    const selectFields = [`"${idField}" as id`, ...textFields.map((f) => `"${f}"`)].join(", ");
    const query = `SELECT ${selectFields} FROM "${tableName}" WHERE ${whereClauses} LIMIT 100`;

    const rows = await sql.query(query);

    for (const row of rows) {
      for (const field of textFields) {
        const val = row[field] as string | null;
        if (val && MOJIBAKE_JS.test(val)) {
          results.push({
            table: tableName,
            field,
            id: row.id as number,
            preview: val.slice(0, 100).replace(/\n/g, " "),
          });
        }
      }
    }

    if (rows.length > 0) {
      console.log(`  ⚠️  [${tableName}] ${rows.length} 条含乱码记录`);
    } else {
      console.log(`  ✅ [${tableName}] 干净`);
    }
  } catch (err) {
    console.log(`  ❌ [${tableName}] 查询失败: ${(err as Error).message}`);
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("数据库乱码审计开始...");
  console.log("=".repeat(60));
  console.log("");

  console.log("【核心设置】");
  await checkTable("site_settings", "id", [
    "company_name_zh", "tagline_zh", "tagline_en", "address_zh", "address_en",
  ]);

  console.log("\n【产品分类】");
  await checkTable("product_categories", "id", [
    "name_zh", "name_en", "summary_zh", "summary_en",
  ]);

  console.log("\n【产品】");
  await checkTable("products", "id", [
    "name_zh", "name_en", "short_description_zh", "short_description_en",
    "details_zh", "details_en", "seo_title", "seo_description",
  ]);

  console.log("\n【产品字段定义】");
  await checkTable("product_default_field_definitions", "id", [
    "label_zh", "label_en",
  ]);

  console.log("\n【产品字段值】");
  await checkTable("product_default_field_values", "id", [
    "value_zh", "value_en",
  ]);

  console.log("\n【产品自定义字段】");
  await checkTable("product_custom_fields", "id", [
    "label_zh", "label_en", "value_zh", "value_en",
  ]);

  console.log("\n【博客分类】");
  await checkTable("blog_categories", "id", ["name_zh", "name_en"]);

  console.log("\n【博客标签】");
  await checkTable("blog_tags", "id", ["name_zh", "name_en"]);

  console.log("\n【博客文章】");
  await checkTable("blog_posts", "id", [
    "title_zh", "title_en", "excerpt_zh", "excerpt_en",
    "content_zh", "content_en", "seo_title", "seo_description",
  ]);

  console.log("\n【页面模块】");
  await checkTable("page_modules", "id", [
    "module_name_zh", "module_name_en",
  ]);

  console.log("\n【询盘记录】");
  await checkTable("inquiries", "id", [
    "name", "message", "internal_note",
  ]);

  console.log("\n【回复模板】");
  await checkTable("reply_templates", "id", [
    "title", "content_zh", "content_en",
  ]);

  console.log("\n【下载文件】");
  await checkTable("download_files", "id", [
    "display_name_zh", "display_name_en", "description",
  ]);

  console.log("\n【媒体资源】");
  await checkTable("media_assets", "id", [
    "file_name", "alt_text_zh", "alt_text_en",
  ]);

  console.log("\n【文件夹】");
  await checkTable("asset_folders", "id", ["name"]);

  // 汇总
  console.log("\n" + "=".repeat(60));
  if (results.length === 0) {
    console.log("✅ 数据库检查完毕：所有表均未发现乱码！");
  } else {
    console.log(`⚠️  共发现 ${results.length} 处乱码：\n`);
    for (const r of results) {
      console.log(`  表: ${r.table} | 字段: ${r.field} | ID: ${r.id}`);
      console.log(`  内容: ${r.preview}`);
      console.log("");
    }
    console.log("建议：直接在管理后台编辑对应记录，或运行 UPDATE SQL 修复。");
  }
  console.log("=".repeat(60));
}

main().catch((err) => {
  console.error("脚本执行失败:", err);
  process.exit(1);
});

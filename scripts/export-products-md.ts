// scripts/export-products-md.ts
/**
 * 导出所有行业的产品信息为 Markdown 文档。
 * 读取 src/db/seed/packs/*.ts 中的 products 数组，生成 `generated-products.md`。
 */
import * as fs from "fs";
import * as path from "path";

const PACKS_DIR = path.resolve(__dirname, "../src/db/seed/packs");
const OUTPUT_MD = path.resolve(__dirname, "../generated-products.md");

function extractProducts(fileContent: string): any[] {
  // 匹配 products: [ ... ]（包括换行）
  const match = fileContent.match(/products\s*:\s*\[(.|\n)*?\]/);
  if (!match) return [];
  const arrayText = match[0].replace(/^products\s*:\s*/, "");
  // 使用 eval 安全地解析 JSON（文件中使用双引号）
  // 为避免 TypeScript 代码中的注释或尾随逗号，先做简单处理
  const cleaned = arrayText
    .replace(/,\s*\n\s*\]/, "]") // 去掉最后的多余逗号
    .replace(/\n\s*/g, " ");
  try {
    // eslint-disable-next-line no-eval
    return eval(cleaned) as any[];
  } catch (e) {
    console.warn("Failed to parse products array", e);
    return [];
  }
}

function formatProduct(p: any): string {
  const df = p.defaultFields || {};
  const cf = p.customFields || [];
  const dfRows = Object.entries(df)
    .map(([k, v]) => `- **${k}**: ${v.valueZh} / ${v.valueEn} (visible: ${v.visible})`)
    .join("\n");
  const cfRows = cf
    .map((c: any) => `- **${c.labelZh} / ${c.labelEn}**: ${c.valueZh} / ${c.valueEn} (visible: ${c.visible})`)
    .join("\n");
  return `### ${p.nameZh} / ${p.nameEn}\n- **Slug**: ${p.slug}\n- **Category**: ${p.categorySlug}\n- **Short Description**: ${p.shortDescriptionZh} / ${p.shortDescriptionEn}\n- **Details**: ${p.detailsZh} / ${p.detailsEn}\n- **SEO Title**: ${p.seoTitle}\n- **SEO Description**: ${p.seoDescription}\n- **Sort Order**: ${p.sortOrder}\n- **Featured**: ${p.isFeatured}\n- **Default Fields**:\n${dfRows || "_none_"}\n- **Custom Fields**:\n${cfRows || "_none_"}\n`;
}

function main() {
  const files = fs.readdirSync(PACKS_DIR).filter((f) => f.endsWith(".ts") && f !== "types.ts");
  let md = "# 所有行业产品列表\n\n";
  for (const file of files) {
    const filePath = path.join(PACKS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const pack = content.match(/key\s*:\s*"([^"]+)"/);
    const industryKey = pack ? pack[1] : file.replace(/\.ts$/, "");
    const products = extractProducts(content);
    md += `## 行业: ${industryKey}\n\n`;
    if (products.length === 0) {
      md += "_暂无产品_\n\n";
      continue;
    }
    for (const p of products) {
      md += formatProduct(p) + "\n";
    }
  }
  fs.writeFileSync(OUTPUT_MD, md, "utf-8");
  console.log(`✅ Markdown 已生成: ${OUTPUT_MD}`);
}

main();

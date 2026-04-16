// scripts/export-products-report.ts
/**
 * 读取所有行业种子包，输出产品完整信息到 generated-products-full.md
 * 使用: npx tsx --tsconfig scripts/tsconfig.json scripts/export-products-report.ts
 */
import * as fs from "fs";
import * as path from "path";

// 直接读取各自的种子包（静态 import，由 tsx 解析路径别名）
import { buildingMaterialsSeedPack } from "../src/db/seed/packs/building-materials";
import { cncSeedPack } from "../src/db/seed/packs/cnc";
import { consumerElectronicsSeedPack } from "../src/db/seed/packs/consumer-electronics";
import { energyPowerSeedPack } from "../src/db/seed/packs/energy-power";
import { fluidHvacSeedPack } from "../src/db/seed/packs/fluid-hvac";
import { furnitureOutdoorSeedPack } from "../src/db/seed/packs/furniture-outdoor";
import { hardwarePlasticsSeedPack } from "../src/db/seed/packs/hardware-plastics";
import { industrialEquipmentSeedPack } from "../src/db/seed/packs/industrial-equipment";
import { lifestyleSeedPack } from "../src/db/seed/packs/lifestyle";
import { lightingSeedPack } from "../src/db/seed/packs/lighting";
import { medicalHealthSeedPack } from "../src/db/seed/packs/medical-health";
import { textilePackagingSeedPack } from "../src/db/seed/packs/textile-packaging";
import type { SeedPack, SeedProduct } from "../src/db/seed/types";

const OUTPUT = path.resolve(__dirname, "../generated-products-full.md");

const allPacks: SeedPack[] = [
  cncSeedPack,
  industrialEquipmentSeedPack,
  buildingMaterialsSeedPack,
  energyPowerSeedPack,
  medicalHealthSeedPack,
  fluidHvacSeedPack,
  lightingSeedPack,
  hardwarePlasticsSeedPack,
  furnitureOutdoorSeedPack,
  textilePackagingSeedPack,
  consumerElectronicsSeedPack,
  lifestyleSeedPack,
];

function formatProduct(p: SeedProduct): string {
  const df = p.defaultFields ?? {};
  const cf = p.customFields ?? [];

  const dfRows = (Object.entries(df) as [string, { valueZh: string; valueEn: string; visible: boolean }][])
    .map(([k, v]) => `  - **${k}**: ${v.valueZh} / ${v.valueEn}`)
    .join("\n");

  const cfRows = cf
    .map((c) => `  - **${c.labelZh} / ${c.labelEn}**: ${c.valueZh} / ${c.valueEn}`)
    .join("\n");

  return [
    `### ${p.nameZh} / ${p.nameEn}`,
    `| 字段 | 中文 | 英文 |`,
    `|---|---|---|`,
    `| Slug | \`${p.slug}\` | \`${p.slug}\` |`,
    `| 分类 | \`${p.categorySlug}\` | \`${p.categorySlug}\` |`,
    `| 简短描述 | ${p.shortDescriptionZh} | ${p.shortDescriptionEn} |`,
    `| SEO 标题 | ${p.seoTitle} | ${p.seoTitle} |`,
    `| SEO 描述 | ${p.seoDescription} | ${p.seoDescription} |`,
    `| 排序 | ${p.sortOrder} | 精选: ${p.isFeatured} |`,
    "",
    p.detailsZh ? `**详细描述（中）**: ${p.detailsZh}` : "",
    p.detailsEn ? `**详细描述（英）**: ${p.detailsEn}` : "",
    "",
    dfRows ? `**默认字段**:\n${dfRows}` : "",
    cfRows ? `**自定义字段**:\n${cfRows}` : "",
    "",
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}

function main() {
  let md = "# 所有行业产品列表\n\n";
  md += `> 生成时间: ${new Date().toLocaleString("zh-CN")}\n\n`;
  md += `| 行业 | 产品数量 |\n|---|---|\n`;
  for (const pack of allPacks) {
    md += `| ${pack.key} | ${pack.products.length} |\n`;
  }
  md += "\n---\n\n";

  for (const pack of allPacks) {
    md += `## 行业: ${pack.key}\n\n`;
    md += `> **公司**: ${pack.site.companyNameEn}  \n`;
    md += `> **产品总数**: ${pack.products.length} 条  \n\n`;

    if (pack.products.length === 0) {
      md += "_暂无产品_\n\n";
      continue;
    }

    for (const p of pack.products) {
      md += formatProduct(p) + "\n";
    }
    md += "---\n\n";
  }

  fs.writeFileSync(OUTPUT, md, "utf-8");
  console.log(`✅ Markdown 已生成 (${allPacks.reduce((s, p) => s + p.products.length, 0)} 条产品):`, OUTPUT);
}

main();

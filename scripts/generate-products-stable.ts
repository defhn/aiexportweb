import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SingleBar, Presets } from "cli-progress";
import {
  buildingMaterialsSeedPack,
  cncSeedPack,
  consumerElectronicsSeedPack,
  energyPowerSeedPack,
  fluidHvacSeedPack,
  furnitureOutdoorSeedPack,
  hardwarePlasticsSeedPack,
  industrialEquipmentSeedPack,
  lightingSeedPack,
  lifestyleSeedPack,
  medicalHealthSeedPack,
  textilePackagingSeedPack,
} from "../src/db/seed/packs";
import type { SeedPack, SeedPackKey, SeedProduct } from "../src/db/seed/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PACKS_DIR = path.join(ROOT, "src", "db", "seed", "packs");
const TARGET_COUNT = 10;

const seedPacks: Array<{ key: SeedPackKey; pack: SeedPack; fileName: string }> = [
  { key: "cnc", pack: cncSeedPack, fileName: "cnc.ts" },
  { key: "industrial-equipment", pack: industrialEquipmentSeedPack, fileName: "industrial-equipment.ts" },
  { key: "building-materials", pack: buildingMaterialsSeedPack, fileName: "building-materials.ts" },
  { key: "energy-power", pack: energyPowerSeedPack, fileName: "energy-power.ts" },
  { key: "medical-health", pack: medicalHealthSeedPack, fileName: "medical-health.ts" },
  { key: "fluid-hvac", pack: fluidHvacSeedPack, fileName: "fluid-hvac.ts" },
  { key: "lighting", pack: lightingSeedPack, fileName: "lighting.ts" },
  { key: "hardware-plastics", pack: hardwarePlasticsSeedPack, fileName: "hardware-plastics.ts" },
  { key: "furniture-outdoor", pack: furnitureOutdoorSeedPack, fileName: "furniture-outdoor.ts" },
  { key: "textile-packaging", pack: textilePackagingSeedPack, fileName: "textile-packaging.ts" },
  { key: "consumer-electronics", pack: consumerElectronicsSeedPack, fileName: "consumer-electronics.ts" },
  { key: "lifestyle", pack: lifestyleSeedPack, fileName: "lifestyle.ts" },
];

function toTitleCaseSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildPlaceholderProduct(industryKey: SeedPackKey, index: number, existingSlugs: Set<string>): SeedProduct {
  const baseSlug = `${industryKey}-product-${index + 1}`;
  let slug = `${baseSlug}-${Date.now()}`;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  const titleBase = toTitleCaseSlug(industryKey);
  const productNumber = index + 1;

  return {
    nameZh: `${titleBase} 产品 ${productNumber}`,
    nameEn: `${titleBase} Product ${productNumber}`,
    slug,
    categorySlug: "",
    shortDescriptionZh: `适用于 ${titleBase} 行业的示例产品。`,
    shortDescriptionEn: `A sample product for the ${titleBase} industry.`,
    detailsZh: `这是为 ${titleBase} 行业准备的示例产品，用于补齐行业产品库。`,
    detailsEn: `This sample product is prepared for the ${titleBase} industry to complete the catalog.`,
    seoTitle: `${titleBase} Product ${productNumber}`,
    seoDescription: `High-quality sample product for the ${titleBase} industry.`,
    sortOrder: index + 1,
    isFeatured: false,
    defaultFields: {
      model: { valueZh: `MODEL-${industryKey.toUpperCase()}-${productNumber}`, valueEn: `MODEL-${industryKey.toUpperCase()}-${productNumber}`, visible: true },
      material: { valueZh: `${titleBase} 材料`, valueEn: `${titleBase} Material`, visible: true },
      size: { valueZh: "可定制", valueEn: "Customizable", visible: true },
      application: { valueZh: `${titleBase} 行业应用`, valueEn: `${titleBase} industry applications`, visible: true },
      moq: { valueZh: "100 件", valueEn: "100 pcs", visible: true },
      lead_time: { valueZh: "15-25 天", valueEn: "15-25 days", visible: true },
      certification: { valueZh: "ISO 9001", valueEn: "ISO 9001", visible: true },
    },
    customFields: [],
  };
}

function resolvePrimaryCategorySlug(pack: SeedPack): string {
  return pack.categories[0]?.slug ?? "";
}

function serializeSeedPack(pack: SeedPack): string {
  return `export const ${toPackVariableName(pack.key)}: SeedPack = ${JSON.stringify(pack, null, 2)};\n`;
}

function toPackVariableName(key: SeedPackKey) {
  return key.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()) + "SeedPack";
}

const bar = new SingleBar(
  {
    format: " {bar} | {filename} | {value}/{total} 行业",
    hideCursor: true,
  },
  Presets.shades_classic,
);

async function main() {
  const packsToProcess = seedPacks.slice(1);
  bar.start(packsToProcess.length, 0, { filename: "初始化…" });

  for (const entry of packsToProcess) {
    const { key, pack, fileName } = entry;
    const existingCount = pack.products.length;
    const existingSlugs = new Set(pack.products.map((product) => product.slug));

    if (!pack.categories.length) {
      console.warn(`跳过 ${key}：没有分类数据`);
      bar.increment({ filename: fileName });
      continue;
    }

    if (existingCount < TARGET_COUNT) {
      const need = TARGET_COUNT - existingCount;
      const categorySlug = resolvePrimaryCategorySlug(pack);
      const nextProducts: SeedProduct[] = [];

      for (let i = 0; i < need; i++) {
        const product = buildPlaceholderProduct(key, existingCount + i, existingSlugs);
        product.categorySlug = categorySlug;
        nextProducts.push(product);
        existingSlugs.add(product.slug);
      }

      pack.products.push(...nextProducts);
      const filePath = path.join(PACKS_DIR, fileName);
      fs.writeFileSync(filePath, serializeSeedPack(pack), "utf-8");
    }

    bar.increment({ filename: fileName });
  }

  bar.stop();
  console.log(`\n✅ 已从第二个行业开始补齐产品数据（目标：每个行业 ${TARGET_COUNT} 条）。`);
}

main().catch((error) => {
  bar.stop();
  console.error("产品生成失败。", error);
  process.exitCode = 1;
});

import "../src/env";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SingleBar, Presets } from "cli-progress";

import {
  buildingMaterialsSeedPack,
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
const OUT_DIR = path.join(ROOT, "tmp", "gemini-product-output");
const TARGET_COUNT = 10;

const packs: Array<{ key: SeedPackKey; pack: SeedPack }> = [
  { key: "industrial-equipment", pack: industrialEquipmentSeedPack },
  { key: "building-materials", pack: buildingMaterialsSeedPack },
  { key: "energy-power", pack: energyPowerSeedPack },
  { key: "medical-health", pack: medicalHealthSeedPack },
  { key: "fluid-hvac", pack: fluidHvacSeedPack },
  { key: "lighting", pack: lightingSeedPack },
  { key: "hardware-plastics", pack: hardwarePlasticsSeedPack },
  { key: "furniture-outdoor", pack: furnitureOutdoorSeedPack },
  { key: "textile-packaging", pack: textilePackagingSeedPack },
  { key: "consumer-electronics", pack: consumerElectronicsSeedPack },
  { key: "lifestyle", pack: lifestyleSeedPack },
];

type GeminiProduct = SeedProduct;

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function titleize(key: SeedPackKey) {
  return key
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pickCategorySlug(pack: SeedPack, index: number) {
  const categories = pack.categories;
  if (!categories.length) return "";
  return categories[index % categories.length]?.slug ?? categories[0].slug;
}

function productDefaultsForPack(pack: SeedPack, index: number) {
  const fieldKeys = Object.keys(pack.products[0]?.defaultFields ?? {});
  if (fieldKeys.length) {
    const defaults = pack.products[0]!.defaultFields;
    return Object.fromEntries(fieldKeys.map((key) => [key, defaults[key as keyof typeof defaults]]));
  }
  const base = titleize(pack.key);
  return {
    model: { valueZh: `${base}-${index + 1}`, valueEn: `${base}-${index + 1}`, visible: true },
    material: { valueZh: `${base} 材料`, valueEn: `${base} material`, visible: true },
    size: { valueZh: "可定制", valueEn: "Customizable", visible: true },
    application: { valueZh: `${base} 应用`, valueEn: `${base} application`, visible: true },
    moq: { valueZh: "100 件", valueEn: "100 pcs", visible: true },
    lead_time: { valueZh: "15-25 天", valueEn: "15-25 days", visible: true },
  };
}

function customFieldsForPack(pack: SeedPack) {
  return pack.products.find((p) => p.customFields.length)?.customFields ?? [];
}

async function callDeepSeek(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("Missing DEEPSEEK_API_KEY");

  const resp = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });
  if (!resp.ok) throw new Error(`DeepSeek HTTP ${resp.status}`);
  const data = (await resp.json()) as any;
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty DeepSeek response");
  return JSON.parse(text);
}

async function callVertex(prompt: string) {
  return callDeepSeek(prompt);
}

function fallbackProducts(pack: SeedPack) {
  const products: GeminiProduct[] = [];
  const base = titleize(pack.key);
  const existing = new Set(pack.products.map((p) => p.slug));
  for (let i = 0; i < TARGET_COUNT; i++) {
    const slug = `${pack.key}-product-${i + 1}-${Date.now() + i}`;
    if (existing.has(slug)) continue;
    products.push({
      nameZh: `${base} 产品 ${i + 1}`,
      nameEn: `${base} Product ${i + 1}`,
      slug,
      categorySlug: pickCategorySlug(pack, i),
      shortDescriptionZh: `适用于 ${base} 行业的示例产品。`,
      shortDescriptionEn: `Sample product for the ${base} industry.`,
      detailsZh: `这是 ${base} 行业的示例产品，用于展示行业能力。`,
      detailsEn: `This is a sample product for the ${base} industry.`,
      seoTitle: `${base} Product ${i + 1}`,
      seoDescription: `High-quality ${base.toLowerCase()} product for export buyers.`,
      sortOrder: i + 1,
      isFeatured: i === 0,
      defaultFields: productDefaultsForPack(pack, i),
      customFields: customFieldsForPack(pack),
    });
  }
  return products;
}

async function generateForPack(pack: SeedPack) {
  const firstProduct = pack.products[0];
  const prompt = `
你正在为一个 B2B 外贸官网生成产品数据。
行业 key: ${pack.key}
行业中文名称: ${titleize(pack.key)}
站点公司名中文: ${pack.site.companyNameZh}
站点公司名英文: ${pack.site.companyNameEn}
分类列表: ${pack.categories.map((c) => `${c.slug}(${c.nameEn})`).join(", ")}
已存在产品数量: ${pack.products.length}

你需要生成 ${TARGET_COUNT} 个产品，要求：
1. 每个产品都符合该行业特征
2. 尽量复用该行业已有字段结构
3. defaultFields 只使用这些字段键：${Object.keys(firstProduct?.defaultFields ?? {}).join(", ") || "model, material, size, application, moq, lead_time, certification"}
4. customFields 参考已有字段，但不要空
5. categorySlug 必须从上面的分类中选择
6. 输出 JSON 数组，不要代码块，不要多余说明
`;
  try {
    const result = await callVertex(prompt);
    return Array.isArray(result) ? result : result.products;
  } catch (error) {
    console.warn(`[fallback] ${pack.key} Vertex 生成失败，使用本地兜底数据`, error);
    return fallbackProducts(pack);
  }
}

async function main() {
  ensureDir(OUT_DIR);
  const bar = new SingleBar({ format: " {bar} | {filename} | {value}/{total} 站点", hideCursor: true }, Presets.shades_classic);
  bar.start(packs.length, 0, { filename: "初始化..." });

  for (const { key, pack } of packs) {
    const products = await generateForPack(pack);
    const output = {
      key,
      companyNameZh: pack.site.companyNameZh,
      companyNameEn: pack.site.companyNameEn,
      categories: pack.categories,
      products: products.slice(0, TARGET_COUNT),
    };
    fs.writeFileSync(path.join(OUT_DIR, `${key}.json`), JSON.stringify(output, null, 2), "utf-8");
    bar.increment({ filename: key });
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), count: packs.length, targetCount: TARGET_COUNT }, null, 2),
    "utf-8",
  );
  bar.stop();
  console.log(`\n✅ 已生成 ${packs.length} 个站点的产品数据，输出目录：${OUT_DIR}`);
}

main().catch((error) => {
  console.error("Vertex 产品生成失败", error);
  process.exitCode = 1;
});

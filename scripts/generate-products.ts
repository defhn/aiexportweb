// scripts/generate-products.ts
/**
 * 自动为每个行业模板生成 10 条符合行业特征的产品数据（从第二条开始）。
 * 运行方式： npm run gen:products
 * 依赖： cli-progress, node-fetch@2
 */
import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import ts from "typescript";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { SingleBar, Presets } from "cli-progress";

const ROOT = path.resolve(__dirname, "..");
const PACKS_DIR = path.join(ROOT, "src", "db", "seed", "packs");
const packFiles = fs
  .readdirSync(PACKS_DIR)
  .filter((f) => f.endsWith(".ts") && f !== "types.ts");

function parseSeedPack(filePath: string): { packVar: string; pack: any } | null {
  const sourceText = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const printer = ts.createPrinter({ removeComments: false });

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) continue;
      const initializer = declaration.initializer;
      if (!initializer || !ts.isObjectLiteralExpression(initializer)) continue;

      const packText = printer.printNode(ts.EmitHint.Expression, initializer, sourceFile);
      try {
        return {
          packVar: declaration.name.text,
          pack: Function(`"use strict"; return (${packText});`)(),
        };
      } catch {
        return null;
      }
    }
  }

  return null;
}

const bar = new SingleBar({
  format: " {bar} | {filename} | {value}/{total} 产品",
  hideCursor: true,
}, Presets.shades_classic);
bar.start(packFiles.length, 0, { filename: "初始化…" });

interface PartialProduct {
  nameZh: string;
  nameEn: string;
  slug: string;
  shortDescriptionZh: string;
  shortDescriptionEn: string;
  detailsZh: string;
  detailsEn: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  isFeatured: boolean;
  defaultFields: Record<string, any>;
  customFields: any[];
}

async function generateProductViaAI(industryKey: string, index: number): Promise<PartialProduct> {
  const prompt = `
  为行业 "${industryKey}"（对应模板 ${industryKey}）生成一条产品信息，要求：
  - 名称（中/英）简短有吸引力
  - slug（英文小写、连字符）
  - 简短描述（中/英）
  - 详细描述（中/英）可包含 2‑3 段落
  - SEO 标题/描述（中/英）
  - 默认字段（price、sku、stock）示例值
  - 2‑3 自定义字段（如颜色、尺寸）示例
  - 该产品应符合行业特征（如医疗、能源等）
  请返回 JSON（不含代码块），字段名对应 SeedProduct 接口。
  `;
  try {
    const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
    const data = (await resp.json()) as any;
    const jsonStr = data.choices?.[0]?.message?.content?.trim();
    if (!jsonStr) throw new Error("Empty AI response");
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn(`AI 生成失败，使用占位数据（${industryKey} #${index}）`);
    return {
      nameZh: `${industryKey} 产品 ${index + 1}`,
      nameEn: `${industryKey} Product ${index + 1}`,
      slug: `${industryKey}-product-${index + 1}`,
      shortDescriptionZh: `这是 ${industryKey} 行业的示例产品。`,
      shortDescriptionEn: `This is a sample product for the ${industryKey} industry.`,
      detailsZh: `详细描述（中文）……`,
      detailsEn: `Detailed description (English)…`,
      seoTitle: `${industryKey} 产品 ${index + 1}`,
      seoDescription: `适用于 ${industryKey} 行业的高质量产品。`,
      sortOrder: index + 2,
      isFeatured: false,
      defaultFields: {
        price: { valueZh: "¥1000", valueEn: "$150", visible: true },
        sku: { valueZh: "SKU001", valueEn: "SKU001", visible: true },
        stock: { valueZh: "100", valueEn: "100", visible: true },
      },
      customFields: [],
    };
  }
}

(async () => {
  for (const file of packFiles) {
    const filePath = path.join(PACKS_DIR, file);
    const parsed = parseSeedPack(filePath);
    if (!parsed) {
      console.error(`无法解析 ${file}`);
      bar.increment({ filename: file });
      continue;
    }
    const { packVar, pack } = parsed;
    const existingCount = pack.products?.length ?? 0;
    const targetCount = 10;
    if (existingCount >= targetCount) {
      bar.increment({ filename: file });
      continue;
    }
    const need = targetCount - existingCount;
    const industryKey = pack.key;
    for (let i = 0; i < need; i++) {
      const idx = existingCount + i;
      const newProd = await generateProductViaAI(industryKey, idx);
      newProd.slug = `${newProd.slug}-${Date.now()}`;
      pack.products.push(newProd);
    }
    const serialized = `export const ${packVar}: SeedPack = ${JSON.stringify(pack, null, 2)};\n`;
    fs.writeFileSync(filePath, serialized, "utf-8");
    bar.increment({ filename: file });
  }
  bar.stop();
  console.log("\n✅ 所有行业已完成产品生成（共 10 条/行业）。");
})();

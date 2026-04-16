import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildDemoSites } from "../src/lib/sites";
import { defaultFieldDefinitions } from "../src/db/seed/default-field-defs";
import { getSeedPack } from "../src/db/seed";
import type { SeedCategory, SeedPackKey, SeedProduct } from "../src/db/seed/types";
import {
  buildCatalogProductsForPack,
  createSeedRunCheckpoint,
  getOverallProgress,
  markProductCompleted,
  type SeedRunCheckpoint,
} from "../src/scripts/site-product-seeding";

type GeneratedPayload = {
  categories: SeedCategory[];
  products: SeedProduct[];
};

type ParsedArgs = {
  outDir: string;
  checkpointPath: string;
  siteSlug?: string;
  model: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DEFAULT_OUT_DIR = path.join(ROOT, "scripts", "output", "deepseek-site-product-sql");

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  const getArg = (flag: string) => {
    const exact = args.find((arg) => arg.startsWith(`${flag}=`));
    if (exact) return exact.split("=")[1];
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  const outDir = getArg("--outdir") ?? DEFAULT_OUT_DIR;
  const checkpointPath = getArg("--checkpoint") ?? path.join(outDir, "checkpoint.json");
  const siteSlug = getArg("--site");
  const model = getArg("--model") ?? "deepseek-chat";

  return { outDir, checkpointPath, siteSlug, model };
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function sqlString(value: string | null | undefined) {
  if (value == null) return "NULL";
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlBool(value: boolean) {
  return value ? "TRUE" : "FALSE";
}

function extractJson(content: string) {
  const fenced = content.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return content.slice(firstBrace, lastBrace + 1);
  }

  return content.trim();
}

function tryParseJson(content: string) {
  const raw = extractJson(content);
  try {
    return JSON.parse(raw) as GeneratedPayload;
  } catch {
    const withoutTrailingCommas = raw.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(withoutTrailingCommas) as GeneratedPayload;
  }
}

function normalizePayload(
  packKey: SeedPackKey,
  companyName: string,
  raw: Partial<GeneratedPayload> | null | undefined,
): GeneratedPayload {
  const pack = getSeedPack(packKey);
  const categories = Array.isArray(raw?.categories) && raw.categories.length === pack.categories.length
    ? raw.categories.map((category, index) => ({
        ...pack.categories[index],
        ...category,
        slug: pack.categories[index]?.slug ?? category.slug,
      }))
    : pack.categories;

  let products = Array.isArray(raw?.products) ? raw.products : [];
  const validCategorySlugs = new Set(categories.map((category) => category.slug));
  const validFieldKeys = new Set(defaultFieldDefinitions.map((field) => field.fieldKey));

  products = products
    .filter((product) => product && validCategorySlugs.has(product.categorySlug))
    .map((product, index) => ({
      ...product,
      sortOrder: Number.isFinite(product.sortOrder) ? product.sortOrder : index + 1,
      defaultFields: Object.fromEntries(
        Object.entries(product.defaultFields ?? {}).filter(([key]) => validFieldKeys.has(key)),
      ),
      customFields: Array.isArray(product.customFields) ? product.customFields : [],
    }));

  if (products.length !== 10) {
    products = buildCatalogProductsForPack(packKey, categories, companyName);
  }

  return { categories, products };
}

async function callDeepSeek(input: {
  apiKey: string;
  model: string;
  siteName: string;
  siteSlug: string;
  packKey: SeedPackKey;
  companyName: string;
  categories: SeedCategory[];
  productExamples: SeedProduct[];
}) {
  const repairJson = async (invalidContent: string) => {
    const repairResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.apiKey}`,
      },
      body: JSON.stringify({
        model: input.model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Repair broken JSON. Return valid JSON only. Preserve every field and value.",
          },
          {
            role: "user",
            content: invalidContent,
          },
        ],
        temperature: 0,
      }),
    });

    if (!repairResponse.ok) {
      throw new Error(
        `DeepSeek JSON repair failed: ${repairResponse.status} ${repairResponse.statusText}`,
      );
    }

    const repaired = (await repairResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const repairedContent = repaired.choices?.[0]?.message?.content?.trim();
    if (!repairedContent) {
      throw new Error("DeepSeek JSON repair returned an empty response.");
    }
    return tryParseJson(repairedContent);
  };

  const fieldKeys = defaultFieldDefinitions.map((field) => field.fieldKey);
  const prompt = [
    "You are generating export B2B catalog data for a manufacturing website.",
    "Return JSON only. No markdown. No explanation.",
    `Site: ${input.siteName} (${input.siteSlug})`,
    `Seed pack: ${input.packKey}`,
    `Company name: ${input.companyName}`,
    "Use exactly the provided category slugs. Keep category count unchanged.",
    "Generate exactly 10 products.",
    "Every product must contain these default field keys and only these keys:",
    fieldKeys.join(", "),
    "The JSON schema is:",
    JSON.stringify(
      {
        categories: [
          {
            nameZh: "string",
            nameEn: "string",
            slug: "must match provided slug",
            summaryZh: "string",
            summaryEn: "string",
            sortOrder: 10,
            isFeatured: true,
          },
        ],
        products: [
          {
            nameZh: "string",
            nameEn: "string",
            slug: "string",
            categorySlug: "string",
            shortDescriptionZh: "string",
            shortDescriptionEn: "string",
            detailsZh: "string",
            detailsEn: "string",
            seoTitle: "string",
            seoDescription: "string",
            sortOrder: 1,
            isFeatured: true,
            defaultFields: {
              model: { valueZh: "string", valueEn: "string", visible: true },
            },
            customFields: [
              {
                labelZh: "string",
                labelEn: "string",
                valueZh: "string",
                valueEn: "string",
                visible: true,
                sortOrder: 10,
              },
            ],
          },
        ],
      },
      null,
      2,
    ),
    "Current categories:",
    JSON.stringify(input.categories, null, 2),
    "Existing product examples for style reference:",
    JSON.stringify(input.productExamples.slice(0, 2), null, 2),
  ].join("\n\n");

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      model: input.model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Generate bilingual industrial catalog JSON for a multi-site export website. Output valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("DeepSeek returned an empty response.");
  }

  try {
    return tryParseJson(content);
  } catch {
    return repairJson(content);
  }
}

function buildSqlForSite(input: {
  siteSlug: string;
  categories: SeedCategory[];
  products: SeedProduct[];
}) {
  const lines: string[] = [];

  lines.push("-- Generated by scripts/generate-deepseek-site-product-sql.ts");
  lines.push(`-- Site slug: ${input.siteSlug}`);
  lines.push("BEGIN;");
  lines.push("");
  lines.push("-- Ensure default field definitions exist");
  for (const field of defaultFieldDefinitions) {
    lines.push(
      `INSERT INTO product_default_field_definitions (field_key, label_zh, label_en, input_type, sort_order, is_visible_by_default) VALUES (${sqlString(field.fieldKey)}, ${sqlString(field.labelZh)}, ${sqlString(field.labelEn)}, ${sqlString(field.inputType)}, ${field.sortOrder}, ${sqlBool(field.isVisibleByDefault)}) ON CONFLICT (field_key) DO UPDATE SET label_zh = EXCLUDED.label_zh, label_en = EXCLUDED.label_en, input_type = EXCLUDED.input_type, sort_order = EXCLUDED.sort_order, is_visible_by_default = EXCLUDED.is_visible_by_default;`,
    );
  }
  lines.push("");
  lines.push("-- Clear current product catalog for this site");
  lines.push(
    `DELETE FROM product_default_field_values WHERE product_id IN (SELECT p.id FROM products p INNER JOIN sites s ON s.id = p.site_id WHERE s.slug = ${sqlString(input.siteSlug)});`,
  );
  lines.push(
    `DELETE FROM product_custom_fields WHERE product_id IN (SELECT p.id FROM products p INNER JOIN sites s ON s.id = p.site_id WHERE s.slug = ${sqlString(input.siteSlug)});`,
  );
  lines.push(
    `DELETE FROM product_media_relations WHERE product_id IN (SELECT p.id FROM products p INNER JOIN sites s ON s.id = p.site_id WHERE s.slug = ${sqlString(input.siteSlug)});`,
  );
  lines.push(
    `DELETE FROM products WHERE site_id = (SELECT id FROM sites WHERE slug = ${sqlString(input.siteSlug)});`,
  );
  lines.push(
    `DELETE FROM product_categories WHERE site_id = (SELECT id FROM sites WHERE slug = ${sqlString(input.siteSlug)});`,
  );
  lines.push("");
  lines.push("-- Insert categories");
  for (const category of input.categories) {
    lines.push(
      `INSERT INTO product_categories (site_id, name_zh, name_en, slug, summary_zh, summary_en, sort_order, is_visible, is_featured) SELECT s.id, ${sqlString(category.nameZh)}, ${sqlString(category.nameEn)}, ${sqlString(category.slug)}, ${sqlString(category.summaryZh)}, ${sqlString(category.summaryEn)}, ${category.sortOrder}, TRUE, ${sqlBool(category.isFeatured)} FROM sites s WHERE s.slug = ${sqlString(input.siteSlug)};`,
    );
  }
  lines.push("");
  lines.push("-- Insert products");
  for (const product of input.products) {
    lines.push(
      `INSERT INTO products (site_id, category_id, name_zh, name_en, slug, short_description_zh, short_description_en, details_zh, details_en, status, is_featured, show_inquiry_button, show_whatsapp_button, show_pdf_download, seo_title, seo_description, sort_order) SELECT s.id, c.id, ${sqlString(product.nameZh)}, ${sqlString(product.nameEn)}, ${sqlString(product.slug)}, ${sqlString(product.shortDescriptionZh)}, ${sqlString(product.shortDescriptionEn)}, ${sqlString(product.detailsZh)}, ${sqlString(product.detailsEn)}, 'published', ${sqlBool(product.isFeatured)}, TRUE, TRUE, FALSE, ${sqlString(product.seoTitle)}, ${sqlString(product.seoDescription)}, ${product.sortOrder} FROM sites s INNER JOIN product_categories c ON c.site_id = s.id AND c.slug = ${sqlString(product.categorySlug)} WHERE s.slug = ${sqlString(input.siteSlug)};`,
    );
  }
  lines.push("");
  lines.push("-- Insert default field values");
  for (const product of input.products) {
    for (const field of defaultFieldDefinitions) {
      const value = product.defaultFields[field.fieldKey];
      lines.push(
        `INSERT INTO product_default_field_values (product_id, field_key, value_zh, value_en, is_visible, sort_order) SELECT p.id, ${sqlString(field.fieldKey)}, ${sqlString(value?.valueZh ?? null)}, ${sqlString(value?.valueEn ?? null)}, ${sqlBool(value?.visible ?? true)}, ${field.sortOrder} FROM products p INNER JOIN sites s ON s.id = p.site_id WHERE s.slug = ${sqlString(input.siteSlug)} AND p.slug = ${sqlString(product.slug)};`,
      );
    }
  }
  lines.push("");
  lines.push("-- Insert custom fields");
  for (const product of input.products) {
    for (const field of product.customFields) {
      lines.push(
        `INSERT INTO product_custom_fields (product_id, label_zh, label_en, value_zh, value_en, input_type, is_visible, sort_order) SELECT p.id, ${sqlString(field.labelZh)}, ${sqlString(field.labelEn)}, ${sqlString(field.valueZh)}, ${sqlString(field.valueEn)}, 'text', ${sqlBool(field.visible)}, ${field.sortOrder} FROM products p INNER JOIN sites s ON s.id = p.site_id WHERE s.slug = ${sqlString(input.siteSlug)} AND p.slug = ${sqlString(product.slug)};`,
      );
    }
  }
  lines.push("");
  lines.push("COMMIT;");

  return lines.join("\n");
}

function loadOrCreateCheckpoint(
  checkpointPath: string,
  siteSpecs: Array<{ siteSlug: string; seedPackKey: SeedPackKey; totalProducts: number }>,
) {
  if (fs.existsSync(checkpointPath)) {
    return JSON.parse(fs.readFileSync(checkpointPath, "utf8")) as SeedRunCheckpoint;
  }

  const checkpoint = createSeedRunCheckpoint(siteSpecs);
  writeJson(checkpointPath, checkpoint);
  return checkpoint;
}

function saveCheckpoint(filePath: string, checkpoint: SeedRunCheckpoint) {
  writeJson(filePath, checkpoint);
}

async function main() {
  const args = parseArgs();
  ensureDir(args.outDir);

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set.");
  }

  const demoSites = buildDemoSites()
    .filter((site) => site.seedPackKey !== "cnc")
    .filter((site) => (args.siteSlug ? site.slug === args.siteSlug : true));

  if (!demoSites.length) {
    throw new Error("No matching target sites were found.");
  }

  let checkpoint = loadOrCreateCheckpoint(
    args.checkpointPath,
    demoSites.map((site) => ({
      siteSlug: site.slug,
      seedPackKey: site.seedPackKey,
      totalProducts: 10,
    })),
  );

  process.on("SIGINT", () => {
    saveCheckpoint(args.checkpointPath, checkpoint);
    console.log(`\nInterrupted. Checkpoint saved to ${args.checkpointPath}`);
    process.exit(130);
  });

  for (const [index, site] of demoSites.entries()) {
    const siteState = checkpoint.sites.find((entry) => entry.siteSlug === site.slug);
    if (siteState?.status === "completed") {
      const progress = getOverallProgress(checkpoint);
      console.log(
        `[skip ${index + 1}/${demoSites.length}] ${site.slug} already completed (${progress.completedProducts}/${progress.totalProducts})`,
      );
      continue;
    }

    checkpoint = {
      ...checkpoint,
      updatedAt: new Date().toISOString(),
      sites: checkpoint.sites.map((entry) =>
        entry.siteSlug === site.slug
          ? {
              ...entry,
              status: "in_progress",
              attemptCount: (entry.attemptCount ?? 0) + 1,
              error: undefined,
            }
          : entry,
      ),
    };
    saveCheckpoint(args.checkpointPath, checkpoint);

    const pack = getSeedPack(site.seedPackKey);
    console.log(`[run ${index + 1}/${demoSites.length}] generating ${site.slug} with ${args.model}`);

    try {
      const rawPayload = await callDeepSeek({
        apiKey,
        model: args.model,
        siteName: site.name,
        siteSlug: site.slug,
        packKey: site.seedPackKey,
        companyName: pack.site.companyNameEn,
        categories: pack.categories,
        productExamples: pack.products,
      });
      const payload = normalizePayload(site.seedPackKey, pack.site.companyNameEn, rawPayload);

      const siteDir = path.join(args.outDir, site.slug);
      ensureDir(siteDir);

      const jsonPath = path.join(siteDir, `${site.slug}.json`);
      const sqlPath = path.join(siteDir, `${site.slug}.sql`);
      writeJson(jsonPath, payload);
      fs.writeFileSync(sqlPath, buildSqlForSite({ siteSlug: site.slug, ...payload }), "utf8");

      let nextCheckpoint = checkpoint;
      for (const product of payload.products) {
        nextCheckpoint = markProductCompleted(nextCheckpoint, site.slug, product.slug);
      }

      checkpoint = {
        ...nextCheckpoint,
        updatedAt: new Date().toISOString(),
        sites: nextCheckpoint.sites.map((entry) =>
          entry.siteSlug === site.slug
            ? {
                ...entry,
                status: "completed",
                sqlPath,
                jsonPath,
                error: undefined,
              }
            : entry,
        ),
      };
      saveCheckpoint(args.checkpointPath, checkpoint);

      const progress = getOverallProgress(checkpoint);
      console.log(
        `[done ${index + 1}/${demoSites.length}] ${site.slug} -> ${sqlPath} (${progress.completedProducts}/${progress.totalProducts})`,
      );
    } catch (error) {
      checkpoint = {
        ...checkpoint,
        updatedAt: new Date().toISOString(),
        sites: checkpoint.sites.map((entry) =>
          entry.siteSlug === site.slug
            ? {
                ...entry,
                status: "failed",
                error: error instanceof Error ? error.message : String(error),
              }
            : entry,
        ),
      };
      saveCheckpoint(args.checkpointPath, checkpoint);
      throw error;
    }
  }

  console.log(`All SQL files generated in ${args.outDir}`);
}

main().catch((error) => {
  console.error("DeepSeek SQL generation failed.", error);
  process.exitCode = 1;
});

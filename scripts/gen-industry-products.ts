/**
 * scripts/gen-industry-products.ts
 * ══════════════════════════════════════════════════════════════
 * 使用 DeepSeek API（不限速）并发生成 12 个行业 × 10 条产品 = 120 条
 * 并发数: 3（行业级并发，每批同时处理 3 个行业）
 * 断点续传: 每个行业生成完毕立即写入 industry-products-data.json
 *
 * 运行:
 *   npm run gen:industry                # 全部 12 个行业
 *   npm run gen:industry -- --reset     # 清除缓存重新生成
 *   npm run gen:industry -- cnc         # 只生成指定行业
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─── 读取 .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const envFile = path.resolve(ROOT, ".env.local");
  if (!fs.existsSync(envFile)) return;
  for (const line of fs.readFileSync(envFile, "utf-8").split("\n")) {
    const i = line.indexOf("=");
    if (i > 0 && line[0] !== "#" && line[0] !== " ") {
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  }
}
loadEnv();

const GEMINI_KEY = "AIzaSyDQ-g-Wdz4wSCmliCa4sezJnwx9TgQmxUc";
const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

// ─── Gemini AI Studio（含重试）────────────────────────────────────────────────
async function callGemini(prompt: string, attempt = 1): Promise<string> {
  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: "You are a professional B2B export product data generator. Output ONLY a valid JSON object with a 'products' array. No markdown, no extra text." }],
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 65536,
        responseMimeType: "application/json",
      },
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (resp.ok) {
    const data = (await resp.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    if (!text) throw new Error("Gemini 返回空响应");
    return text.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
  }

  if ((resp.status === 429 || resp.status === 503) && attempt <= 4) {
    const wait = Math.pow(2, attempt) * 5; // 10, 20, 40, 80s
    process.stdout.write(` [${resp.status}] 等${wait}s...`);
    await new Promise((r) => setTimeout(r, wait * 1000));
    return callGemini(prompt, attempt + 1);
  }

  const err = await resp.text();
  throw new Error(`Gemini ${resp.status}: ${err.slice(0, 200)}`);
}

// ─── 12 个行业定义 ──────────────────────────────────────────────────────────
const INDUSTRIES = [
  {
    key: "cnc",
    nameEn: "CNC Precision Machining",
    descEn: "Custom CNC machined parts (aluminum, steel, brass, titanium) for global OEM buyers",
    certifications: "ISO 9001, AS9100D, RoHS",
    originCity: "Dongguan, Guangdong, China",
    categories: [
      { slug: "aluminum-machined-parts", nameZh: "铝合金加工件", nameEn: "Aluminum Machined Parts", summaryEn: "Custom CNC machined aluminum parts for automation and OEM." },
      { slug: "stainless-steel-components", nameZh: "不锈钢精密件", nameEn: "Stainless Steel Components", summaryEn: "Precision turned and milled stainless steel parts." },
      { slug: "brass-turned-parts", nameZh: "黄铜车削件", nameEn: "Brass Turned Parts", summaryEn: "CNC turned brass parts for fluid and instrumentation systems." },
    ],
  },
  {
    key: "industrial-equipment",
    nameEn: "Industrial Equipment & Automation",
    descEn: "Industrial automation equipment, conveyor systems, and assembly machines",
    certifications: "CE, ISO 9001",
    originCity: "Suzhou, Jiangsu, China",
    categories: [
      { slug: "automation-equipment", nameZh: "自动化设备", nameEn: "Automation Equipment", summaryEn: "Custom automation lines and robotic integration systems." },
      { slug: "conveying-systems", nameZh: "输送系统", nameEn: "Conveying Systems", summaryEn: "Belt, roller, and servo conveyor solutions for production lines." },
      { slug: "industrial-machinery", nameZh: "工业机械", nameEn: "Industrial Machinery", summaryEn: "Heavy-duty machines and process equipment for manufacturing." },
    ],
  },
  {
    key: "building-materials",
    nameEn: "Architectural Building Materials",
    descEn: "Decorative metal panels, railings, and facade systems for construction projects",
    certifications: "ISO 9001, ASTM, EN 1090",
    originCity: "Foshan, Guangdong, China",
    categories: [
      { slug: "decorative-metal-panels", nameZh: "装饰金属板材", nameEn: "Decorative Metal Panels", summaryEn: "Aluminum and steel facade panels for architectural cladding." },
      { slug: "architectural-railings", nameZh: "建筑栏杆系统", nameEn: "Architectural Railings", summaryEn: "Stainless steel and glass railing systems for buildings." },
      { slug: "building-profiles", nameZh: "建筑型材", nameEn: "Building Profiles", summaryEn: "Aluminum extrusion profiles and structural sections." },
    ],
  },
  {
    key: "energy-power",
    nameEn: "Energy & Power Systems",
    descEn: "Switchgear, battery energy storage, solar inverters, and power distribution equipment",
    certifications: "IEC, CE, UN38.3, UL",
    originCity: "Hangzhou, Zhejiang, China",
    categories: [
      { slug: "power-distribution", nameZh: "配电系统", nameEn: "Power Distribution", summaryEn: "Low and medium voltage switchgear and distribution panels." },
      { slug: "battery-energy-storage", nameZh: "储能系统", nameEn: "Battery Energy Storage", summaryEn: "Commercial and industrial BESS for peak shaving and backup." },
      { slug: "renewable-energy-equipment", nameZh: "新能源设备", nameEn: "Renewable Energy Equipment", summaryEn: "Solar inverters, EV chargers, and grid-tied energy systems." },
    ],
  },
  {
    key: "medical-health",
    nameEn: "Medical & Health Products",
    descEn: "Medical consumables, rehabilitation devices, and hospital supplies",
    certifications: "CE, ISO 13485, FDA 510(k)",
    originCity: "Shenzhen, Guangdong, China",
    categories: [
      { slug: "medical-consumables", nameZh: "医疗耗材", nameEn: "Medical Consumables", summaryEn: "Single-use consumables for hospitals, clinics, and home care." },
      { slug: "rehabilitation-devices", nameZh: "康复设备", nameEn: "Rehabilitation Devices", summaryEn: "Physiotherapy and rehab equipment for clinical and home use." },
      { slug: "medical-instruments", nameZh: "医疗器械", nameEn: "Medical Instruments", summaryEn: "Diagnostic devices and instruments for healthcare providers." },
    ],
  },
  {
    key: "fluid-hvac",
    nameEn: "Fluid Control & HVAC",
    descEn: "Industrial valves, pumps, pipes, and HVAC components for engineering projects",
    certifications: "ISO 9001, CE, ATEX, PED",
    originCity: "Wenzhou, Zhejiang, China",
    categories: [
      { slug: "industrial-valves", nameZh: "工业阀门", nameEn: "Industrial Valves", summaryEn: "Ball, gate, butterfly, and control valves for fluid systems." },
      { slug: "pump-systems", nameZh: "水泵系统", nameEn: "Pump Systems", summaryEn: "Centrifugal, submersible, and chemical pumps for industry." },
      { slug: "hvac-components", nameZh: "暖通空调", nameEn: "HVAC Components", summaryEn: "Air handling units, fan coils, and HVAC accessories." },
    ],
  },
  {
    key: "lighting",
    nameEn: "LED Lighting & Fixtures",
    descEn: "Commercial and industrial LED lighting for retail, warehouse, and outdoor use",
    certifications: "CE, RoHS, UL, ETL, DLC",
    originCity: "Zhongshan, Guangdong, China",
    categories: [
      { slug: "commercial-lighting", nameZh: "商业照明", nameEn: "Commercial Lighting", summaryEn: "LED panels, track lights, and downlights for retail and office." },
      { slug: "industrial-lighting", nameZh: "工业照明", nameEn: "Industrial Lighting", summaryEn: "High-bay LED lights and explosion-proof fixtures for factories." },
      { slug: "outdoor-lighting", nameZh: "户外照明", nameEn: "Outdoor Lighting", summaryEn: "LED floodlights, street lights, and solar garden lights." },
    ],
  },
  {
    key: "hardware-plastics",
    nameEn: "Hardware & Industrial Plastics",
    descEn: "Metal stamping, injection-molded plastic parts, and industrial fasteners for OEM buyers",
    certifications: "ISO 9001, RoHS, IATF 16949",
    originCity: "Ningbo, Zhejiang, China",
    categories: [
      { slug: "metal-stamping-parts", nameZh: "金属冲压件", nameEn: "Metal Stamping Parts", summaryEn: "Precision stamped metal components for automotive and electronics." },
      { slug: "injection-molded-parts", nameZh: "注塑件", nameEn: "Injection Molded Parts", summaryEn: "Custom plastic injection molded parts for OEM products." },
      { slug: "hardware-fasteners", nameZh: "五金紧固件", nameEn: "Hardware Fasteners", summaryEn: "Bolts, nuts, screws, and specialty fasteners for assembly." },
    ],
  },
  {
    key: "furniture-outdoor",
    nameEn: "Furniture & Outdoor Products",
    descEn: "Contract furniture, outdoor garden sets, and hospitality furniture for global retailers",
    certifications: "FSC, BSCI, Sedex, REACH",
    originCity: "Guangzhou, Guangdong, China",
    categories: [
      { slug: "outdoor-furniture", nameZh: "户外家具", nameEn: "Outdoor Furniture", summaryEn: "Weather-resistant garden and patio furniture sets." },
      { slug: "contract-furniture", nameZh: "合同家具", nameEn: "Contract Furniture", summaryEn: "Hotel, restaurant, and office furniture for hospitality projects." },
      { slug: "home-storage", nameZh: "家居收纳", nameEn: "Home Storage", summaryEn: "Shelving, organizers, and storage solutions for home and retail." },
    ],
  },
  {
    key: "textile-packaging",
    nameEn: "Textile & Industrial Packaging",
    descEn: "Woven fabrics, garments, non-woven bags, and flexible packaging for export",
    certifications: "OEKO-TEX, ISO 9001, BSCI, GRS",
    originCity: "Shaoxing, Zhejiang, China",
    categories: [
      { slug: "woven-fabrics", nameZh: "梭织面料", nameEn: "Woven Fabrics", summaryEn: "Cotton, polyester, and blended fabrics for garment and home textile." },
      { slug: "industrial-packaging", nameZh: "工业包装", nameEn: "Industrial Packaging", summaryEn: "PP woven bags, FIBC bulk bags, and non-woven packaging." },
      { slug: "export-garments", nameZh: "成衣出口", nameEn: "Export Garments", summaryEn: "OEM garments, workwear, and fashion apparel for global buyers." },
    ],
  },
  {
    key: "consumer-electronics",
    nameEn: "Consumer Electronics & Accessories",
    descEn: "Smart home devices, electronic accessories, and IoT gadgets for global e-commerce",
    certifications: "CE, FCC, RoHS, UL, KC",
    originCity: "Shenzhen, Guangdong, China",
    categories: [
      { slug: "smart-home-devices", nameZh: "智能家居", nameEn: "Smart Home Devices", summaryEn: "Wi-Fi enabled smart plugs, switches, and home automation." },
      { slug: "digital-accessories", nameZh: "数码配件", nameEn: "Digital Accessories", summaryEn: "Phone chargers, cables, power banks, and electronic accessories." },
      { slug: "wearable-electronics", nameZh: "穿戴设备", nameEn: "Wearable Electronics", summaryEn: "Smartwatches, fitness trackers, and wireless earbuds." },
    ],
  },
  {
    key: "lifestyle",
    nameEn: "Lifestyle & Gift Products",
    descEn: "Promotional gifts, home decor, stationery, and lifestyle accessories for B2B buyers",
    certifications: "BSCI, Sedex, ISO 9001, EN 71",
    originCity: "Yiwu, Zhejiang, China",
    categories: [
      { slug: "promotional-gifts", nameZh: "礼品定制", nameEn: "Promotional Gifts", summaryEn: "Custom printed and engraved promotional items for corporates." },
      { slug: "home-decor", nameZh: "家居装饰", nameEn: "Home Decor", summaryEn: "Candles, photo frames, wall art, and decorative accessories." },
      { slug: "stationery-office", nameZh: "文具周边", nameEn: "Stationery & Office", summaryEn: "Notebooks, pens, desk organizers, and branded stationery." },
    ],
  },
] as const;

type Industry = (typeof INDUSTRIES)[number];

// ─── Prompt 构建 ─────────────────────────────────────────────────────────────
function buildPrompt(industry: Industry): string {
  const catList = industry.categories
    .map((c, i) => `${i + 1}. "${c.slug}" → ${c.nameEn}: ${c.summaryEn}`)
    .join("\n");
  const catSlugs = industry.categories.map((c) => c.slug).join(" | ");
  const cityZh = industry.originCity.split(",")[0];

  return `Generate exactly 10 B2B export product listings for: "${industry.nameEn}".
Industry: ${industry.descEn}
Origin: ${industry.originCity} | Certifications: ${industry.certifications}

Categories (use categorySlug EXACTLY as listed, distribute 3-4 per category):
${catList}

Return JSON: { "products": [ ...10 items... ] }
Each item MUST have ALL fields:
{
  "nameZh": "中文产品名（6-12字）",
  "nameEn": "English Product Name (4-8 words)",
  "slug": "unique-lowercase-hyphen-slug",
  "categorySlug": "MUST be one of: ${catSlugs}",
  "shortDescriptionZh": "一句中文描述（20-40字）",
  "shortDescriptionEn": "One English sentence for B2B buyers (15-25 words)",
  "detailsZh": "三段落：材质工艺 | 规格参数 | 应用场景和交期",
  "detailsEn": "Three paragraphs: material/process | specifications | applications/lead time",
  "seoTitle": "50-60 char English title with keyword",
  "seoDescription": "150-160 char English description",
  "sortOrder": 10 to 100 (steps of 10),
  "isFeatured": true for items 1-3 else false,
  "defaultFields": {
    "model": {"valueZh": "型号", "valueEn": "Model code", "visible": true},
    "material": {"valueZh": "材质", "valueEn": "Material", "visible": true},
    "application": {"valueZh": "应用", "valueEn": "Application", "visible": true},
    "moq": {"valueZh": "起订量", "valueEn": "e.g. 100 pcs", "visible": true},
    "lead_time": {"valueZh": "交期", "valueEn": "e.g. 15-20 days", "visible": true},
    "place_of_origin": {"valueZh": "${cityZh}", "valueEn": "${industry.originCity}", "visible": true},
    "certification": {"valueZh": "认证", "valueEn": "${industry.certifications}", "visible": true}
  },
  "customFields": [
    {"labelZh": "专属参数1", "labelEn": "Spec 1", "valueZh": "值", "valueEn": "Value", "visible": true, "sortOrder": 10},
    {"labelZh": "专属参数2", "labelEn": "Spec 2", "valueZh": "值", "valueEn": "Value", "visible": true, "sortOrder": 20}
  ]
}
Use realistic industry-specific values. No placeholders.`;
}

// ─── JSON 解析（含自动修复截断）────────────────────────────────────────────
function parseProducts(raw: string): unknown[] {
  // 移除 markdown 代码块
  let s = raw.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
  // 修复尾随逗号
  s = s.replace(/,\s*([\]}])/g, "$1");

  let parsed: unknown;
  try {
    parsed = JSON.parse(s);
  } catch {
    // 尝试截断修复（JSON 被截断时）
    const lastBrace = s.lastIndexOf("}, {");
    if (lastBrace > 0) {
      s = s.slice(0, lastBrace + 1) + "]}";
      try { parsed = JSON.parse(s); } catch { /**/ }
    }
    if (!parsed) throw new Error(`JSON parse failed. Preview: ${raw.slice(0, 200)}`);
  }

  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj.products)) return obj.products;
    const arr = Object.values(obj).find((v) => Array.isArray(v));
    if (arr) return arr as unknown[];
  }
  if (Array.isArray(parsed)) return parsed;

  throw new Error(`Unexpected response structure: ${raw.slice(0, 100)}`);
}

// ─── 缓存文件 + 互斥写入 ────────────────────────────────────────────────────
const OUTPUT_FILE = path.resolve(__dirname, "industry-products-data.json");
let cache: Record<string, unknown> = {};

function saveCache() {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cache, null, 2), "utf-8");
}

// ─── 并发控制（Semaphore）──────────────────────────────────────────────────
function semaphore(concurrency: number) {
  let running = 0;
  const queue: Array<() => void> = [];
  return function <T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const run = () => {
        running++;
        fn()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            running--;
            if (queue.length > 0) queue.shift()!();
          });
      };
      if (running < concurrency) run();
      else queue.push(run);
    });
  };
}

// ─── 单个行业生成任务 ────────────────────────────────────────────────────────
async function generateIndustry(
  industry: Industry,
  idx: number,
  total: number
): Promise<void> {
  console.log(`\n🏭 [${idx + 1}/${total}] 开始: ${industry.nameEn} (${industry.key})`);
  console.log(`   分类: ${industry.categories.map((c) => c.slug).join(" | ")}`);
  process.stdout.write("   ⏳ 调用 DeepSeek API...");

  let products: unknown[];
  try {
    const raw = await callGemini(buildPrompt(industry));
    products = parseProducts(raw).slice(0, 10);
  } catch (e) {
    process.stdout.write("\n");
    console.error(`   ❌ 失败: ${(e as Error).message}`);
    return;
  }

  process.stdout.write(` ✅ ${products.length} 条\n`);

  // 逐条打印
  for (let pi = 0; pi < products.length; pi++) {
    const p = products[pi] as Record<string, unknown>;
    const star = p.isFeatured ? "⭐" : "  ";
    const cat = String(p.categorySlug ?? "?").padEnd(30);
    console.log(`   ${star} ${String(pi + 1).padStart(2)}. [${cat}] ${p.nameEn}`);
  }

  // 写缓存（同步，避免并发写冲突）
  cache[industry.key] = {
    key: industry.key,
    categories: industry.categories.map((c, i) => ({
      nameZh: c.nameZh,
      nameEn: c.nameEn,
      slug: c.slug,
      summaryEn: c.summaryEn,
      sortOrder: (i + 1) * 10,
      isFeatured: true,
    })),
    products,
  };
  saveCache();
  console.log(`   💾 ${industry.key} 已写入缓存`);
}

// ─── 主函数 ──────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const resetFlag = args.includes("--reset");
  const targetKey = args.find((a) => !a.startsWith("--"));

  // 加载断点续传
  if (!resetFlag && fs.existsSync(OUTPUT_FILE)) {
    try {
      cache = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
      const done = Object.keys(cache);
      if (done.length > 0) console.log(`📂 断点续传：已完成 [${done.join(", ")}]`);
    } catch {
      console.warn("⚠️ 缓存损坏，重置");
      cache = {};
    }
  }

  const targets = targetKey
    ? INDUSTRIES.filter((i) => i.key === targetKey)
    : [...INDUSTRIES];

  if (targets.length === 0) {
    console.error(`❌ 未找到行业: ${targetKey}`);
    process.exit(1);
  }

  const pending = targets.filter((i) => !cache[i.key]);

  // 打印已跳过的行业
  for (const i of targets.filter((i) => cache[i.key])) {
    const c = cache[i.key] as { products: unknown[] };
    console.log(`⏭️  ${i.key} — 已缓存 ${c.products?.length ?? 0} 条，跳过`);
  }

  console.log(
    `\n🤖 ${GEMINI_MODEL} (AI Studio) | 并发: 3 | 待生成: ${pending.length} 个行业 (${pending.length * 10} 条产品)`
  );
  console.log("─".repeat(70));

  const CONCURRENCY = 3;
  const withSem = semaphore(CONCURRENCY);

  // 并发执行（3个一批）
  await Promise.all(
    pending.map((industry) => {
      const idx = targets.indexOf(industry);
      return withSem(() => generateIndustry(industry, idx, targets.length));
    })
  );

  const total = Object.values(cache).reduce(
    (s, v) => s + ((v as { products: unknown[] }).products?.length ?? 0),
    0
  );

  console.log("\n" + "─".repeat(70));
  console.log(`🎉 完成！共 ${Object.keys(cache).length} 个行业 | ${total} 条产品`);
  console.log(`📄 数据: ${OUTPUT_FILE}`);
  if (total > 0) console.log(`\n▶️  下一步: npm run seed:industry`);
}

main().catch((e) => {
  console.error("\n❌ 脚本异常:", e);
  process.exit(1);
});

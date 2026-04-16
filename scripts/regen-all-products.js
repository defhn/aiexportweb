#!/usr/bin/env node
// scripts/regen-all-products.js
/**
 * 全量重生成脚本：
 * 1. 读取每个 src/db/seed/packs/*.ts 种子文件
 * 2. 提取已有 categories（如为空则先让 DeepSeek 创建）
 * 3. 找出所有"占位产品"（nameZh 包含行业 key + "产品"，或 shortDescriptionZh 包含"示例产品"）
 * 4. 调用 DeepSeek 一次性补全缺失的 N 条产品，写回文件
 * 5. 支持断点续跑：已有真实产品不会被覆盖
 *
 * 运行方式：
 *   node scripts/regen-all-products.js
 * 或指定某个行业：
 *   node scripts/regen-all-products.js energy-power
 */

const fs = require('fs');
const path = require('path');

// ─── 配置 ───────────────────────────────────────────────────────────
const PACKS_DIR = path.resolve(__dirname, '../src/db/seed/packs');
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const TARGET_COUNT = 10;  // 每个行业目标产品条数

if (!DEEPSEEK_API_KEY) {
  // 读取 .env.local 兜底
  const envFile = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envFile)) {
    const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
    for (const line of lines) {
      const m = line.match(/^DEEPSEEK_API_KEY\s*=\s*(.+)$/);
      if (m) process.env.DEEPSEEK_API_KEY = m[1].trim().replace(/^["']|["']$/g, '');
    }
  }
}
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('❌ 未找到 DEEPSEEK_API_KEY（.env.local 或环境变量）');
  process.exit(1);
}

// ─── DeepSeek 调用 ──────────────────────────────────────────────────
async function callDeepSeek(prompt) {
  const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的外贸产品数据生成助手。请严格按 JSON 格式输出，不要包含任何 Markdown 代码块（```），不要有任何前缀说明文字，直接输出纯 JSON。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`DeepSeek API 错误 ${resp.status}: ${err}`);
  }
  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('DeepSeek 返回空内容');
  // 去掉可能的 markdown 代码块
  return text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
}

// ─── 文件工具 ────────────────────────────────────────────────────────
function extractSection(content, key) {
  // 用括号深度匹配提取 key: [...] 或 key: {...}
  const startIdx = content.indexOf(`"${key}":`);
  if (startIdx === -1) return null;
  const openChar = content.indexOf('[', startIdx);
  const openBrace = content.indexOf('{', startIdx);
  const isArr = openChar !== -1 && (openBrace === -1 || openChar < openBrace);
  const open = isArr ? '[' : '{';
  const close = isArr ? ']' : '}';
  let pos = content.indexOf(open, startIdx);
  if (pos === -1) return null;
  let depth = 0;
  for (let i = pos; i < content.length; i++) {
    if (content[i] === open) depth++;
    else if (content[i] === close) depth--;
    if (depth === 0) return content.slice(pos, i + 1);
  }
  return null;
}

function parseJSON(text) {
  // 清理尾随逗号
  const cleaned = text.replace(/,\s*([\]}])/g, '$1');
  try { return JSON.parse(cleaned); } catch {}
  // 用 eval 兜底
  try { return eval(`(${cleaned})`); } catch (e) {
    throw new Error(`JSON 解析失败: ${e.message}`);
  }
}

function isPlaceholder(product, industryKey) {
  const name = product.nameZh || '';
  const desc = product.shortDescriptionZh || '';
  return (
    name.includes('产品') && name.includes(industryKey) ||
    desc.includes('示例产品') ||
    desc.includes('这是') && desc.includes('行业') ||
    !product.nameZh || !product.slug ||
    product.slug?.includes('-product-') && /\d{10,}/.test(product.slug)
  );
}

// ─── 主逻辑 ──────────────────────────────────────────────────────────
async function processPackFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // 提取 key
  const keyMatch = content.match(/"key"\s*:\s*"([^"]+)"/);
  if (!keyMatch) { console.warn(`⚠️ 无法找到 key: ${filePath}`); return; }
  const industryKey = keyMatch[1];

  // 提取现有 categories
  let categories = [];
  const catText = extractSection(content, 'categories');
  if (catText) {
    try { categories = parseJSON(catText); } catch {}
  }

  // 提取现有 products
  let existingProducts = [];
  const prodText = extractSection(content, 'products');
  if (prodText) {
    try { existingProducts = parseJSON(prodText); } catch {}
  }

  // 过滤出真实产品（非占位）
  const realProducts = existingProducts.filter(p => !isPlaceholder(p, industryKey));
  const needCount = TARGET_COUNT - realProducts.length;

  console.log(`\n📦 ${industryKey} | 真实:${realProducts.length}  占位:${existingProducts.length - realProducts.length}  需补:${needCount}`);

  // 如果分类为空，先生成分类
  if (categories.length === 0) {
    console.log(`  → 分类为空，调用 DeepSeek 生成分类...`);
    const catPrompt = `
为外贸行业 "${industryKey}" 生成 3 个产品分类，用于外贸独立站展示。
要求：
- 每个分类有 nameZh、nameEn、slug（英文小写连字符）、summaryZh、summaryEn、sortOrder(10/20/30)、isFeatured(true/false)
- 分类应真实反映该行业最常见的产品系列
- 只输出 JSON 数组，不要有任何解释文字
输出格式示例：
[{"nameZh":"...","nameEn":"...","slug":"...","summaryZh":"...","summaryEn":"...","sortOrder":10,"isFeatured":true}]
    `.trim();
    const catJson = await callDeepSeek(catPrompt);
    categories = parseJSON(catJson);
    console.log(`  ✅ 生成 ${categories.length} 个分类`);
  }

  if (needCount <= 0) {
    console.log(`  ✅ 已有 ${realProducts.length} 条真实产品，无需补充`);
    return;
  }

  // 构建分类 slug 列表供生成产品使用
  const categorySlugs = categories.map(c => c.slug);
  const existingSlugs = realProducts.map(p => p.slug);

  console.log(`  → 调用 DeepSeek 生成 ${needCount} 条产品...`);

  const prompt = `
为中国外贸行业 "${industryKey}" 生成 ${needCount} 条外贸产品数据（面向海外买家的 B2B 独立站）。

可用的产品分类 slug：${categorySlugs.join(', ')}
（每条产品必须从以上 slugs 中选择一个作为 categorySlug）

已有产品 slug（不能重复）：${existingSlugs.join(', ') || '(无)'}

每条产品必须包含以下字段：
{
  "nameZh": "中文产品名（简短有吸引力）",
  "nameEn": "English product name",
  "slug": "english-lowercase-hyphen-slug（唯一，不能与已有重复）",
  "categorySlug": "（必须是上面列出的分类之一）",
  "shortDescriptionZh": "一句话简短描述（中文）",
  "shortDescriptionEn": "One-sentence short description (English)",
  "detailsZh": "详细描述，2-3段，包含材料、工艺、应用场景、交货期等",
  "detailsEn": "Detailed description, 2-3 paragraphs in English",
  "seoTitle": "SEO title in English (50-60 chars)",
  "seoDescription": "SEO description in English (150-160 chars)",
  "sortOrder": 按顺序从 ${(realProducts.length + 1) * 10} 开始递增,
  "isFeatured": false,
  "defaultFields": {
    "model": {"valueZh":"型号","valueEn":"Model No.","visible":true},
    "material": {"valueZh":"材质","valueEn":"Material","visible":true},
    "application": {"valueZh":"用途","valueEn":"Application","visible":true},
    "moq": {"valueZh":"最小起订量","valueEn":"Min. order qty","visible":true},
    "lead_time": {"valueZh":"交货期","valueEn":"Lead time","visible":true},
    "certification": {"valueZh":"认证","valueEn":"Certification","visible":true}
  },
  "customFields": [
    {"labelZh":"自定义标签1","labelEn":"Custom Label 1","valueZh":"值","valueEn":"value","visible":true,"sortOrder":10},
    {"labelZh":"自定义标签2","labelEn":"Custom Label 2","valueZh":"值","valueEn":"value","visible":true,"sortOrder":20}
  ]
}

要求：
- 产品必须真实符合 ${industryKey} 行业特征，面向海外采购商
- nameEn 和所有 En 字段必须是地道的英文
- defaultFields 的值要填真实的行业相关数据（不要写"示例"或"Sample"）
- 只输出 JSON 数组，不包含任何前缀说明文字或 markdown 代码块
`.trim();

  const jsonText = await callDeepSeek(prompt);
  let newProducts;
  try {
    newProducts = parseJSON(jsonText);
  } catch (e) {
    console.error(`  ❌ 解析 DeepSeek 返回结果失败: ${e.message}`);
    console.error('  原始返回:', jsonText.slice(0, 500));
    return;
  }

  if (!Array.isArray(newProducts) || newProducts.length === 0) {
    console.error(`  ❌ 返回结果不是有效数组`);
    return;
  }

  console.log(`  ✅ 获得 ${newProducts.length} 条新产品`);

  // 合并产品：保留真实产品 + 新生成的产品
  const mergedProducts = [...realProducts, ...newProducts.slice(0, needCount)];

  // 将更新后的 categories 和 products 写回文件
  // 先序列化为 JSON 字符串
  const categoriesJson = JSON.stringify(categories, null, 2).replace(/\n/g, '\n  ');
  const productsJson = JSON.stringify(mergedProducts, null, 2).replace(/\n/g, '\n  ');

  // 替换文件中的 categories 和 products 段落
  let newContent = content;

  // 替换 categories
  const oldCatMatch = newContent.match(/"categories"\s*:\s*\[/);
  if (oldCatMatch && catText) {
    const catStart = newContent.indexOf(catText);
    if (catStart !== -1) {
      newContent = newContent.slice(0, catStart) + categoriesJson + newContent.slice(catStart + catText.length);
    }
  }

  // 替换 products
  const freshContent = fs.readFileSync(filePath, 'utf-8'); // 重新读（确保 categories 生效）
  let finalContent = freshContent;

  // 更新 categories（如原来为空需注入）
  if (categories.length > 0 && catText) {
    const catStart = finalContent.indexOf(catText);
    if (catStart !== -1) {
      finalContent = finalContent.slice(0, catStart) + categoriesJson + finalContent.slice(catStart + catText.length);
    }
  }

  // 更新 products
  const freshProdText = extractSection(finalContent, 'products');
  if (freshProdText) {
    const prodStart = finalContent.indexOf(freshProdText);
    if (prodStart !== -1) {
      finalContent = finalContent.slice(0, prodStart) + productsJson + finalContent.slice(prodStart + freshProdText.length);
    }
  }

  fs.writeFileSync(filePath, finalContent, 'utf-8');
  console.log(`  💾 已写回 ${filePath.split(/[\\/]/).pop()} (${mergedProducts.length} 条产品)`);
}

async function main() {
  const targetKey = process.argv[2]; // 可指定单个行业
  const files = fs.readdirSync(PACKS_DIR)
    .filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');

  const targetFiles = targetKey
    ? files.filter(f => f.includes(targetKey))
    : files;

  if (targetFiles.length === 0) {
    console.error(`❌ 未找到匹配的种子文件: ${targetKey}`);
    process.exit(1);
  }

  console.log(`🚀 开始处理 ${targetFiles.length} 个行业种子文件...`);
  let success = 0, failed = 0;

  for (const file of targetFiles) {
    const filePath = path.join(PACKS_DIR, file);
    try {
      await processPackFile(filePath);
      success++;
    } catch (e) {
      console.error(`  ❌ ${file} 处理失败:`, e.message);
      failed++;
    }
    // 避免 API 限速，行业之间稍作延迟
    if (targetFiles.indexOf(file) < targetFiles.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n🎉 完成！成功:${success}  失败:${failed}`);
}

main().catch(e => {
  console.error('脚本异常:', e);
  process.exit(1);
});

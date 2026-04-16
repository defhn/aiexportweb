// scripts/export-products-md2.js
/**
 * Export all product data from seed packs to a Markdown file.
 * This version parses the TS files more robustly by extracting the JSON-like
 * array after `products:` and cleaning trailing commas before parsing.
 */
const fs = require('fs');
const path = require('path');

const PACKS_DIR = path.resolve(__dirname, '../src/db/seed/packs');
const OUTPUT_MD = path.resolve(__dirname, '../generated-products-full.md');

function extractProductsArray(content) {
  const prodStart = content.indexOf('products:');
  if (prodStart === -1) return [];
  const bracketStart = content.indexOf('[', prodStart);
  if (bracketStart === -1) return [];
  // Find matching closing bracket ] (simple count based approach)
  let depth = 0;
  let i = bracketStart;
  for (; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') depth--;
    if (depth === 0) break;
  }
  const arrayText = content.slice(bracketStart, i + 1);
  // Clean up: remove trailing commas before the closing bracket
  const cleaned = arrayText.replace(/,\s*\]/g, ']');
  try {
    // eslint-disable-next-line no-eval
    return eval(cleaned);
  } catch (e) {
    console.warn('Failed to eval products array', e);
    return [];
  }
}

function formatProduct(p) {
  const df = p.defaultFields || {};
  const cf = p.customFields || [];
  const dfRows = Object.entries(df)
    .map(([k, v]) => `- **${k}**: ${v.valueZh} / ${v.valueEn} (visible: ${v.visible})`)
    .join('\n');
  const cfRows = cf
    .map(c => `- **${c.labelZh} / ${c.labelEn}**: ${c.valueZh} / ${c.valueEn} (visible: ${c.visible})`)
    .join('\n');
  return `### ${p.nameZh} / ${p.nameEn}\n- **Slug**: ${p.slug}\n- **Category**: ${p.categorySlug}\n- **Short Description**: ${p.shortDescriptionZh} / ${p.shortDescriptionEn}\n- **Details**: ${p.detailsZh} / ${p.detailsEn}\n- **SEO Title**: ${p.seoTitle}\n- **SEO Description**: ${p.seoDescription}\n- **Sort Order**: ${p.sortOrder}\n- **Featured**: ${p.isFeatured}\n- **Default Fields**:\n${dfRows || '_none_'}\n- **Custom Fields**:\n${cfRows || '_none_'}\n`;
}

function main() {
  const files = fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.ts') && f !== 'types.ts');
  let md = '# 所有行业产品列表\n\n';
  for (const file of files) {
    const filePath = path.join(PACKS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const keyMatch = content.match(/key\s*:\s*"([^"]+)"/);
    const industry = keyMatch ? keyMatch[1] : file.replace(/\.ts$/, '');
    const products = extractProductsArray(content);
    md += `## 行业: ${industry}\n\n`;
    if (products.length === 0) {
      md += '_暂无产品_\n\n';
      continue;
    }
    for (const p of products) {
      md += formatProduct(p) + '\n';
    }
  }
  fs.writeFileSync(OUTPUT_MD, md, 'utf-8');
  console.log('✅ Markdown 已生成:', OUTPUT_MD);
}

main();

// scripts/export-products-md.js
/**
 * Export all product data from seed packs to a Markdown file.
 * This is a plain JavaScript script (no TypeScript typings) to avoid compilation errors.
 */
const fs = require('fs');
const path = require('path');

const PACKS_DIR = path.resolve(__dirname, '../src/db/seed/packs');
const OUTPUT_MD = path.resolve(__dirname, '../generated-products.md');

function extractProducts(fileContent) {
  const match = fileContent.match(/products\s*:\s*\[(.|\n)*?\]/);
  if (!match) return [];
  const arrayText = match[0].replace(/^products\s*:\s*/, '');
  // Clean up trailing commas and newlines for eval
  const cleaned = arrayText
    .replace(/,\s*\n\s*\]/, ']') // remove last trailing comma before closing bracket
    .replace(/\n\s*/g, ' ');
  try {
    // eslint-disable-next-line no-eval
    return eval(cleaned);
  } catch (e) {
    console.warn('Failed to parse products array', e);
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
    const industryKey = keyMatch ? keyMatch[1] : file.replace(/\.ts$/, '');
    const products = extractProducts(content);
    md += `## 行业: ${industryKey}\n\n`;
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

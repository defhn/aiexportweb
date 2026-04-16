// scripts/export-products-full.js
/**
 * Export all product data from seed packs (including those built via functions) to a Markdown file.
 * Uses ts-node/register to import TypeScript seed pack modules.
 */
require('ts-node').register({ transpileOnly: true });
const fs = require('fs');
const path = require('path');

const PACKS_DIR = path.resolve(__dirname, '../src/db/seed/packs');
const OUTPUT_MD = path.resolve(__dirname, '../generated-products-full.md');

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
    const modulePath = path.join(PACKS_DIR, file);
    const packModule = require(modulePath);
    // Find exported pack variable (ends with 'SeedPack')
    const packKey = Object.keys(packModule).find(k => k.toLowerCase().endsWith('seedpack'));
    if (!packKey) continue;
    const pack = packModule[packKey];
    const industry = pack.key || file.replace(/\.ts$/, '');
    const products = pack.products || [];
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

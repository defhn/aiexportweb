/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  INDUSTRY INIT — Phase 1: Text Content + Database Seeding               ║
 * ║                                                                          ║
 * ║  Usage:                                                                  ║
 * ║    npx tsx scripts/industry-init/run.ts --config ecommerce              ║
 * ║    npx tsx scripts/industry-init/run.ts --config my-industry            ║
 * ║                                                                          ║
 * ║  After completion:                                                       ║
 * ║    → image-manifest.json generated                                       ║
 * ║    → Tell Antigravity: "按 image-manifest.json 生成所有图片"             ║
 * ║    → Then run: npx tsx scripts/industry-init/upload-images.ts           ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

// Load .env.local before anything else
import { config as loadDotenv } from "dotenv";
import { resolve } from "path";
loadDotenv({ path: resolve(process.cwd(), ".env.local") });
loadDotenv({ path: resolve(process.cwd(), ".env") });

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { validateEnv } from "./lib/validate-env";
import {
  generateSiteSettings,
  generateCategories,
  generateProducts,
  generateBlogPosts,
  generateFaqs,
  generatePageModules,
  generateImageManifest,
  generateFrontendAdaptationPrompt,
} from "./lib/generate";
import {
  clearExistingData,
  seedSiteSettings,
  seedCategories,
  seedProducts,
  seedBlogPosts,
  seedFaqs,
  seedPageModules,
  seedMediaPlaceholders,
} from "./lib/db-seed";
import { initProgress } from "./lib/progress";
import type { IndustryConfig, ImageManifest } from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function step(n: number, total: number, label: string) {
  console.log(`\n🔵 [${n}/${total}] ${label}...`);
}
function done(label: string) {
  console.log(`   ✅ ${label}`);
}
function info(msg: string) {
  console.log(`   ℹ  ${msg}`);
}

const OUT_DIR = join(process.cwd(), "scripts", "industry-init");
const IMAGES_DIR = join(OUT_DIR, "generated-images");

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const configArg = args.find((a) => a.startsWith("--config="))?.split("=")[1]
    ?? args[args.indexOf("--config") + 1];

  if (!configArg) {
    console.error("❌ Usage: npx tsx scripts/industry-init/run.ts --config <name>");
    console.error("   Available: ecommerce, or any file in scripts/industry-init/configs/");
    process.exit(1);
  }

  // ── Load config ──────────────────────────────────────────────────────────
  let config: IndustryConfig;
  try {
    const mod = await import(`./configs/${configArg}.ts`);
    config = mod.config as IndustryConfig;
  } catch {
    console.error(`❌ Config file not found: scripts/industry-init/configs/${configArg}.ts`);
    process.exit(1);
  }

  console.log("\n");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`  🚀  Industry Init — ${config.company.nameEn} (${config.industry})`);
  console.log("═══════════════════════════════════════════════════════════");

  const TOTAL_STEPS = 9;

  // ── Step 0: ENV Validation ───────────────────────────────────────────────
  step(0, TOTAL_STEPS, "Validating environment variables");
  const envResult = validateEnv();
  if (!envResult.passed) {
    process.exit(1);
  }

  // ── Step 1: Clear existing data ──────────────────────────────────────────
  step(1, TOTAL_STEPS, "Clearing existing demo data from database");
  await clearExistingData();
  done("Database cleared");

  // ── Step 2: Generate site settings ──────────────────────────────────────
  step(2, TOTAL_STEPS, "Generating site settings (Gemini)");
  const siteSettings = await generateSiteSettings(config);
  await seedSiteSettings(config, siteSettings, config.adminPassword);
  done(`Site settings saved — tagline: "${siteSettings.taglineEn}"`);

  // ── Step 3: Generate categories ──────────────────────────────────────────
  step(3, TOTAL_STEPS, `Generating ${config.categoryCount ?? 5} categories (Gemini)`);
  const categories = await generateCategories(config);
  const categoryIds = await seedCategories(categories);
  for (const cat of categories) {
    info(`${cat.nameEn} (/${cat.slug})`);
  }
  done(`${categories.length} categories created`);

  // ── Step 4: Generate products ─────────────────────────────────────────────
  step(4, TOTAL_STEPS, `Generating ${config.productCount ?? 10} products with AI copy (Gemini)`);
  const products = await generateProducts(config, categories);
  const productIds = await seedProducts(products, categoryIds);
  for (const prod of products) {
    info(`${prod.nameEn}`);
  }
  done(`${products.length} products created`);

  // ── Step 5: Generate blog posts ──────────────────────────────────────────
  step(5, TOTAL_STEPS, `Generating ${config.blogPostCount ?? 3} blog articles (Gemini)`);
  const blogPosts = await generateBlogPosts(config, categories);
  const blogPostIds = await seedBlogPosts(blogPosts, config.industry);
  for (const post of blogPosts) {
    info(`"${post.titleEn}"`);
  }
  done(`${blogPosts.length} blog posts created`);

  // ── Step 6: Generate FAQs ────────────────────────────────────────────────
  step(6, TOTAL_STEPS, `Generating ${config.faqCount ?? 8} FAQ items (Gemini)`);
  const faqs = await generateFaqs(config);
  await seedFaqs(faqs);
  done(`${faqs.length} FAQ items written to site settings`);

  // ── Step 7: Generate page modules ────────────────────────────────────────
  step(7, TOTAL_STEPS, "Generating page modules — Hero, Strengths, About, Contact (Gemini)");
  const pageModuleData = await generatePageModules(config, categories);
  const pageModuleIds = await seedPageModules(pageModuleData);
  const modCount =
    pageModuleData.home.length +
    pageModuleData.about.length +
    pageModuleData.contact.length;
  done(`${modCount} page modules seeded`);

  // ── Step 8: Generate image manifest ──────────────────────────────────────
  step(8, TOTAL_STEPS, "Generating AI image manifest with prompts & specs (Gemini)");
  const imageItems = await generateImageManifest(config, categories, products, blogPosts);

  const manifest: ImageManifest = {
    industry: config.industry,
    generatedAt: new Date().toISOString(),
    totalImages: imageItems.length,
    images: imageItems,
  };

  writeFileSync(join(OUT_DIR, "image-manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  // Create progress file (empty — all pending)
  initProgress(manifest);

  // Create generated-images folder
  if (!existsSync(IMAGES_DIR)) {
    mkdirSync(IMAGES_DIR, { recursive: true });
  }

  done(`Image manifest saved: ${imageItems.length} images to generate`);
  for (const img of imageItems) {
    info(`[${String(img.id).padStart(2, "0")}] ${img.filename} — ${img.style} — ${img.width}x${img.height}`);
  }

  // ── Step 9: Generate frontend adaptation prompt ───────────────────────────
  step(9, TOTAL_STEPS, "Generating frontend adaptation AI prompt (Gemini)");
  const adaptationPrompt = await generateFrontendAdaptationPrompt(config, siteSettings, categories);

  const guideContent =
    `# Frontend Adaptation Guide — ${config.company.nameEn} (${config.industry})\n\n` +
    `Generated: ${new Date().toISOString()}\n` +
    `Industry: ${config.industry}\n` +
    `Company: ${config.company.nameEn}\n\n` +
    `---\n\n` +
    `## Instructions\n\n` +
    `Copy the prompt below and send it to your AI coding agent (e.g. Antigravity, Claude, Gemini).\n` +
    `The agent will adapt the entire frontend visual design for your industry.\n\n` +
    `---\n\n` +
    `## AI Coding Agent Prompt\n\n` +
    adaptationPrompt;

  writeFileSync(
    join(OUT_DIR, "output", "FRONTEND_ADAPTATION_GUIDE.md"),
    guideContent,
    "utf8",
  );

  done("Frontend adaptation guide saved to scripts/industry-init/output/FRONTEND_ADAPTATION_GUIDE.md");

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  ✅  Phase 1 Complete!");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`
  📊 Database seeded:
     • ${categories.length} product categories
     • ${products.length} products (with specs + SEO)
     • ${blogPosts.length} blog posts (full AI-written content)
     • ${faqs.length} FAQ items
     • ${modCount} page modules (Hero, About, Contact, etc.)

  🖼  Image manifest:
     • ${imageItems.length} images to generate
     • File: scripts/industry-init/image-manifest.json
     • Progress: scripts/industry-init/image-progress.json (auto-updated)
     • Output: scripts/industry-init/generated-images/

  📝 Frontend adaptation guide:
     • File: scripts/industry-init/output/FRONTEND_ADAPTATION_GUIDE.md

  ─────────────────────────────────────────────────────────
  📸 NEXT STEP — Tell Antigravity:
     "按 image-manifest.json 帮我生成所有图片，从第一张开始"
  
  📤 AFTER IMAGES — Run:
     npx tsx scripts/industry-init/upload-images.ts
  ─────────────────────────────────────────────────────────
  `);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message ?? err);
  process.exit(1);
});

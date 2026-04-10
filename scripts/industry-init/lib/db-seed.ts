/**
 * Database seeding for the industry-init script.
 * Uses @neondatabase/serverless + drizzle-orm directly (no Next.js aliases).
 *
 * ALL tables are cleared first (industry-specific data only),
 * then fresh data is inserted.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import * as schema from "../../../src/db/schema";
import type {
  AiCategory,
  AiProduct,
  AiBlogPost,
  AiFaq,
  AiPageModule,
  AiSiteSettings,
  IndustryConfig,
  SeededIds,
} from "../types";

function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is not set");
  return drizzle(neon(dbUrl), { schema });
}

// Slugify a string
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Clear existing demo data ─────────────────────────────────────────────────

export async function clearExistingData(): Promise<void> {
  const db = getDb();
  // Order matters due to foreign keys
  await db.delete(schema.blogPosts);
  await db.delete(schema.blogCategories);
  await db.delete(schema.productDefaultFieldValues);
  await db.delete(schema.productCustomFields);
  await db.delete(schema.products);
  await db.delete(schema.productCategories);
  await db.delete(schema.pageModules);
  await db.delete(schema.mediaAssets);
  // Keep adminUsers, siteSettings row (update instead of delete)
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function seedSiteSettings(
  config: IndustryConfig,
  ai: AiSiteSettings,
  adminPassword: string,
): Promise<void> {
  const db = getDb();

  // Hash password using Web Crypto (available in Node 18+)
  const hashedPassword = await hashPassword(adminPassword);

  // Upsert: delete and re-insert the single settings row
  await db.delete(schema.siteSettings);

  await db.insert(schema.siteSettings).values({
    companyNameZh: config.company.nameCn ?? ai.companyNameCn,
    companyNameEn: config.company.nameEn,
    taglineZh: ai.taglineCn,
    taglineEn: ai.taglineEn,
    email: config.company.email,
    phone: config.company.phone ?? "",
    whatsapp: config.company.whatsapp ?? "",
    addressZh: "",
    addressEn: config.company.addressEn ?? "",
    adminUsername: "admin",
    adminPasswordHash: hashedPassword,
    metaTitleSuffixEn: ai.metaTitleSuffixEn,
    metaDescriptionEn: ai.metaDescriptionEn,
  } as typeof schema.siteSettings.$inferInsert);
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function seedCategories(
  aiCategories: AiCategory[],
): Promise<Record<string, number>> {
  const db = getDb();
  const slugToId: Record<string, number> = {};

  for (const cat of aiCategories) {
    const [inserted] = await db
      .insert(schema.productCategories)
      .values({
        nameZh: cat.nameCn,
        nameEn: cat.nameEn,
        slug: cat.slug,
        summaryZh: cat.summaryCn,
        summaryEn: cat.summaryEn,
        sortOrder: cat.sortOrder,
        isFeatured: cat.isFeatured,
      })
      .returning({ id: schema.productCategories.id });
    slugToId[cat.slug] = inserted.id;
  }

  return slugToId;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function seedProducts(
  aiProducts: AiProduct[],
  categoryIdMap: Record<string, number>,
): Promise<Record<string, number>> {
  const db = getDb();
  const slugToId: Record<string, number> = {};

  for (const prod of aiProducts) {
    const catId = categoryIdMap[prod.categorySlug];
    if (!catId) {
      console.warn(`  ⚠ Category not found for product ${prod.nameEn}, skipping`);
      continue;
    }

    const [inserted] = await db
      .insert(schema.products)
      .values({
        categoryId: catId,
        nameZh: prod.nameCn,
        nameEn: prod.nameEn,
        slug: prod.slug,
        shortDescriptionZh: prod.shortDescriptionCn,
        shortDescriptionEn: prod.shortDescriptionEn,
        detailsZh: prod.detailsCn,
        detailsEn: prod.detailsEn,
        seoTitle: prod.seoTitle,
        seoDescription: prod.seoDescription,
        sortOrder: prod.sortOrder,
        isFeatured: prod.isFeatured,
      })
      .returning({ id: schema.products.id });

    slugToId[prod.slug] = inserted.id;

    // Insert custom specs as custom fields
    if (prod.specs?.length) {
      for (let i = 0; i < prod.specs.length; i++) {
        const spec = prod.specs[i];
        await db.insert(schema.productCustomFields).values({
          productId: inserted.id,
          labelZh: spec.labelEn, // use English as fallback
          labelEn: spec.labelEn,
          valueZh: spec.valueEn,
          valueEn: spec.valueEn,
          isVisible: true,
          sortOrder: (i + 1) * 10,
        });
      }
    }
  }

  return slugToId;
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function seedBlogPosts(
  aiBlogPosts: AiBlogPost[],
  industry: string,
): Promise<Record<string, number>> {
  const db = getDb();

  // Create a default blog category
  const [blogCat] = await db
    .insert(schema.blogCategories)
    .values({
      nameZh: industry,
      nameEn: `${industry.charAt(0).toUpperCase()}${industry.slice(1)} Insights`,
      slug: toSlug(industry),
    })
    .returning({ id: schema.blogCategories.id });

  const slugToId: Record<string, number> = {};

  for (const post of aiBlogPosts) {
    const [inserted] = await db
      .insert(schema.blogPosts)
      .values({
        categoryId: blogCat.id,
        titleZh: post.titleCn,
        titleEn: post.titleEn,
        slug: post.slug,
        excerptZh: post.excerptCn,
        excerptEn: post.excerptEn,
        contentZh: post.contentCn,
        contentEn: post.contentEn,
        publishedAt: new Date(),
        status: "published",
      })
      .returning({ id: schema.blogPosts.id });

    slugToId[post.slug] = inserted.id;
  }

  return slugToId;
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function seedFaqs(faqs: AiFaq[]): Promise<void> {
  const db = getDb();

  const faqJson = faqs.map((f, i) => ({
    id: i + 1,
    question: f.question,
    answer: f.answer,
  }));

  // Store FAQs in siteSettings.faqs_json column
  await db
    .update(schema.siteSettings)
    .set({ faqsJson: faqJson } as Partial<typeof schema.siteSettings.$inferInsert>);
}

// ─── Page Modules ─────────────────────────────────────────────────────────────

export async function seedPageModules(
  modules: { home: AiPageModule[]; about: AiPageModule[]; contact: AiPageModule[] },
): Promise<Record<string, number>> {
  const db = getDb();
  const keyToId: Record<string, number> = {};
  type PageKey = "home" | "about" | "contact";

  const pageKeyMap: Array<[keyof typeof modules, PageKey]> = [
    ["home", "home"],
    ["about", "about"],
    ["contact", "contact"],
  ];

  for (const [pageKey, dbKey] of pageKeyMap) {
    const pageModules = modules[pageKey] ?? [];
    for (const mod of pageModules) {
      const [inserted] = await db
        .insert(schema.pageModules)
        .values({
          pageKey: dbKey,
          moduleKey: mod.moduleKey,
          moduleNameZh: mod.moduleNameZh,
          moduleNameEn: mod.moduleNameEn,
          isEnabled: mod.isEnabled,
          sortOrder: mod.sortOrder,
          payloadJson: mod.payloadJson,
        })
        .returning({ id: schema.pageModules.id });
      keyToId[mod.moduleKey] = inserted.id;
    }
  }

  return keyToId;
}

// ─── Media Asset Placeholders ─────────────────────────────────────────────────

export async function seedMediaPlaceholders(
  imageCount: number,
): Promise<number[]> {
  const db = getDb();
  const ids: number[] = [];

  for (let i = 1; i <= imageCount; i++) {
    const [inserted] = await db
      .insert(schema.mediaAssets)
      .values({
        assetType: "image",
        bucketKey: `industry-init/placeholder-${i}.webp`,
        url: `https://placehold.co/800x600/e2e8f0/94a3b8?text=Image+${i}`,
        fileName: `placeholder-${i}.webp`,
        mimeType: "image/webp",
        fileSize: 0,
        width: 800,
        height: 600,
      })
      .returning({ id: schema.mediaAssets.id });
    ids.push(inserted.id);
  }

  return ids;
}

// ─── Password Hashing (Web Crypto, Node 18+) ──────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const hashArray = Array.from(new Uint8Array(bits));
  const saltArray = Array.from(salt);
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const saltHex = saltArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `pbkdf2:${saltHex}:${hashHex}`;
}

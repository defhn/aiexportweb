import "../../env";

import { pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";

import { getDb } from "../client";
import {
  blogCategories,
  blogPosts,
  pageModules,
  productCategories,
  productCustomFields,
  productDefaultFieldDefinitions,
  productDefaultFieldValues,
  products,
  seoAiSettings,
  siteSettings,
} from "../schema";
import { defaultFieldDefinitions } from "./default-field-defs";
import { buildingMaterialsSeedPack } from "./packs/building-materials";
import { cncSeedPack } from "./packs/cnc";
import { industrialEquipmentSeedPack } from "./packs/industrial-equipment";
import type { SeedPack, SeedPackKey } from "./types";

export { defaultFieldDefinitions };
export type { DefaultFieldDefinition, DefaultFieldKey } from "./default-field-defs";
export type {
  SeedBlogCategory,
  SeedBlogPost,
  SeedCategory,
  SeedCustomField,
  SeedPack,
  SeedPackKey,
  SeedPageKey,
  SeedPageModule,
  SeedProduct,
  SeedProductFieldValue,
  SeedSiteSettings,
} from "./types";

export const seedPacks: Record<SeedPackKey, SeedPack> = {
  cnc: cncSeedPack,
  "industrial-equipment": industrialEquipmentSeedPack,
  "building-materials": buildingMaterialsSeedPack,
};

export const seedPackKeys = Object.keys(seedPacks) as SeedPackKey[];

export function getSeedPack(key: SeedPackKey) {
  return seedPacks[key];
}

export function listSeedPacks() {
  return seedPackKeys.map((key) => seedPacks[key]);
}

export async function seedDatabase(key: SeedPackKey) {
  const db = getDb();
  const pack = getSeedPack(key);

  await db.execute(sql`
    truncate table
      blog_post_tags,
      blog_posts,
      blog_tags,
      blog_categories,
      download_files,
      inquiries,
      product_media_relations,
      product_custom_fields,
      product_default_field_values,
      product_default_field_definitions,
      products,
      product_categories,
      page_modules,
      seo_ai_settings,
      site_settings
    restart identity cascade
  `);

  await db.insert(siteSettings).values({
    companyNameZh: pack.site.companyNameZh,
    companyNameEn: pack.site.companyNameEn,
    taglineZh: pack.site.taglineZh,
    taglineEn: pack.site.taglineEn,
    email: pack.site.email,
    phone: pack.site.phone,
    whatsapp: pack.site.whatsapp,
    addressZh: pack.site.addressZh,
    addressEn: pack.site.addressEn,
  });

  await db.insert(seoAiSettings).values({
    allowGoogle: true,
    allowBing: true,
    allowOaiSearchBot: true,
    allowClaudeSearchBot: true,
    allowPerplexityBot: true,
    allowGptBot: false,
    allowClaudeBot: false,
  });

  await db.insert(productDefaultFieldDefinitions).values(
    defaultFieldDefinitions.map((field) => ({
      fieldKey: field.fieldKey,
      labelZh: field.labelZh,
      labelEn: field.labelEn,
      inputType: field.inputType,
      sortOrder: field.sortOrder,
      isVisibleByDefault: field.isVisibleByDefault,
    })),
  );

  const insertedCategories = await db
    .insert(productCategories)
    .values(
      pack.categories.map((category) => ({
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        slug: category.slug,
        summaryZh: category.summaryZh,
        summaryEn: category.summaryEn,
        sortOrder: category.sortOrder,
        isFeatured: category.isFeatured,
      })),
    )
    .returning();

  const categoryIdMap = new Map(
    insertedCategories.map((category) => [category.slug, category.id]),
  );

  const insertedProducts = await db
    .insert(products)
    .values(
      pack.products.map((product) => ({
        categoryId: categoryIdMap.get(product.categorySlug) ?? null,
        nameZh: product.nameZh,
        nameEn: product.nameEn,
        slug: product.slug,
        shortDescriptionZh: product.shortDescriptionZh,
        shortDescriptionEn: product.shortDescriptionEn,
        detailsZh: product.detailsZh,
        detailsEn: product.detailsEn,
        status: "published" as const,
        isFeatured: product.isFeatured,
        showInquiryButton: true,
        showWhatsappButton: true,
        showPdfDownload: false,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        sortOrder: product.sortOrder,
      })),
    )
    .returning();

  const productIdMap = new Map(
    insertedProducts.map((product) => [product.slug, product.id]),
  );

  const defaultValueRows = pack.products.flatMap((product) =>
    Object.entries(product.defaultFields).map(([fieldKey, value]) => ({
      productId: productIdMap.get(product.slug)!,
      fieldKey,
      valueZh: value?.valueZh ?? null,
      valueEn: value?.valueEn ?? null,
      isVisible: value?.visible ?? true,
      sortOrder:
        defaultFieldDefinitions.find((field) => field.fieldKey === fieldKey)
          ?.sortOrder ?? 100,
    })),
  );

  if (defaultValueRows.length) {
    await db.insert(productDefaultFieldValues).values(defaultValueRows);
  }

  const customFieldRows = pack.products.flatMap((product) =>
    product.customFields.map((field) => ({
      productId: productIdMap.get(product.slug)!,
      labelZh: field.labelZh,
      labelEn: field.labelEn,
      valueZh: field.valueZh,
      valueEn: field.valueEn,
      inputType: "text" as const,
      isVisible: field.visible,
      sortOrder: field.sortOrder,
    })),
  );

  if (customFieldRows.length) {
    await db.insert(productCustomFields).values(customFieldRows);
  }

  const moduleRows = (["home", "about", "contact"] as const).flatMap((pageKey) =>
    pack.pages[pageKey].map((module) => ({
      pageKey,
      moduleKey: module.moduleKey,
      moduleNameZh: module.moduleNameZh,
      moduleNameEn: module.moduleNameEn,
      isEnabled: module.isEnabled,
      sortOrder: module.sortOrder,
      payloadJson: module.payloadJson,
    })),
  );

  if (moduleRows.length) {
    await db.insert(pageModules).values(moduleRows);
  }

  const insertedBlogCategories = await db
    .insert(blogCategories)
    .values(
      pack.blogCategories.map((category, index) => ({
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        slug: category.slug,
        sortOrder: (index + 1) * 10,
        isVisible: true,
      })),
    )
    .returning();

  const blogCategoryIdMap = new Map(
    insertedBlogCategories.map((category) => [category.slug, category.id]),
  );

  if (pack.blogPosts.length) {
    await db.insert(blogPosts).values(
      pack.blogPosts.map((post) => ({
        categoryId: blogCategoryIdMap.get(post.categorySlug) ?? null,
        titleZh: post.titleZh,
        titleEn: post.titleEn,
        slug: post.slug,
        excerptZh: post.excerptZh,
        excerptEn: post.excerptEn,
        contentZh: post.contentZh,
        contentEn: post.contentEn,
        status: "published" as const,
        publishedAt: new Date(post.publishedAt),
      })),
    );
  }

  return {
    key: pack.key,
    categories: insertedCategories.length,
    products: insertedProducts.length,
    blogPosts: pack.blogPosts.length,
  };
}

async function main() {
  const key = (process.argv[2] as SeedPackKey | undefined) ?? "cnc";
  const result = await seedDatabase(key);
  console.log(
    `Seeded ${result.key}: ${result.categories} categories, ${result.products} products, ${result.blogPosts} blog posts`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error("Database seed failed.", error);
    process.exitCode = 1;
  });
}

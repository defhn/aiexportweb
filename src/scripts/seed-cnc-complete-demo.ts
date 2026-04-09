import "../env";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { eq, inArray } from "drizzle-orm";

import { getDb } from "@/db/client";
import { seedDatabase } from "@/db/seed";
import { assetFolders, mediaAssets, productCategories, productMediaRelations, products } from "@/db/schema";
import {
  buildCncDemoProducts,
  buildCncProductImageSvg,
} from "@/features/demo-catalog/cnc-catalog";
import { getPublicProductImageFallback } from "@/features/products/image-map";
import { uploadToR2 } from "@/lib/r2";

const IMAGE_WIDTH = 1600;
const IMAGE_HEIGHT = 1200;

async function uploadProductSvgAsset(input: {
  productNameZh: string;
  productNameEn: string;
  slug: string;
  variant: "catalog" | "scene";
  svg: string;
  folderId?: number | null;
}) {
  const upload = await uploadToR2({
    kind: "image",
    fileName: `${input.slug}-${input.variant}.svg`,
    mimeType: "image/svg+xml",
    body: Buffer.from(input.svg, "utf8"),
  });

  const db = getDb();
  const [asset] = await db
    .insert(mediaAssets)
    .values({
      assetType: "image",
      bucketKey: upload.bucketKey,
      url: upload.url,
      fileName: upload.fileName,
      mimeType: upload.mimeType,
      fileSize: upload.fileSize,
      folderId: input.folderId ?? null,
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      altTextZh: `${input.productNameZh}${input.variant === "catalog" ? "白底目录�? : "工业场景�?}`,
      altTextEn: `${input.productNameEn}${input.variant === "catalog" ? " catalog render" : " industrial scene"}`,
      isPublic: true,
    })
    .returning();

  return asset;
}

async function uploadLocalProductCoverAsset(input: {
  productNameZh: string;
  productNameEn: string;
  slug: string;
  folderId?: number | null;
}) {
  const publicPath = getPublicProductImageFallback(input.slug);

  if (!publicPath) {
    return null;
  }

  const fileName = publicPath.split("/").at(-1);

  if (!fileName) {
    return null;
  }

  const localPath = path.resolve(process.cwd(), "public", publicPath.replace(/^\//, ""));
  const body = await readFile(localPath);
  const upload = await uploadToR2({
    kind: "image",
    fileName,
    mimeType: "image/png",
    body,
  });

  const db = getDb();
  const [asset] = await db
    .insert(mediaAssets)
    .values({
      assetType: "image",
      bucketKey: upload.bucketKey,
      url: upload.url,
      fileName: upload.fileName,
      mimeType: upload.mimeType,
      fileSize: upload.fileSize,
      folderId: input.folderId ?? null,
      altTextZh: `${input.productNameZh}主图`,
      altTextEn: `${input.productNameEn} main image`,
      isPublic: true,
    })
    .returning();

  return asset;
}

export async function seedCncCompleteDemo() {
  const result = await seedDatabase("cnc");
  const db = getDb();
  const seedProducts = buildCncDemoProducts();
  const productSlugs = seedProducts.map((item) => item.slug);

  const productRows = await db
    .select({
      id: products.id,
      slug: products.slug,
      categoryId: products.categoryId,
    })
    .from(products)
    .where(inArray(products.slug, productSlugs));

  const productMap = new Map(productRows.map((row) => [row.slug, row]));
  const categoryCoverMap = new Map<string, number>();
  const [imageRootFolder] = await db
    .insert(assetFolders)
    .values({
      assetType: "image",
      name: "产品图库",
      parentId: null,
      sortOrder: 10,
    })
    .returning();
  const [cncFolder] = await db
    .insert(assetFolders)
    .values({
      assetType: "image",
      name: "CNC 综合目录",
      parentId: imageRootFolder?.id ?? null,
      sortOrder: 20,
    })
    .returning();
  await db.insert(assetFolders).values([
    {
      assetType: "image",
      name: "博客素材",
      parentId: null,
      sortOrder: 30,
    },
    {
      assetType: "file",
      name: "产品资料",
      parentId: null,
      sortOrder: 10,
    },
    {
      assetType: "file",
      name: "CNC 规格�?,
      parentId: null,
      sortOrder: 20,
    },
  ]);

  for (const seedProduct of seedProducts) {
    const productRow = productMap.get(seedProduct.slug);

    if (!productRow) {
      throw new Error(`Missing seeded product row for slug ${seedProduct.slug}`);
    }

    const [productFolder] = await db
      .insert(assetFolders)
      .values({
        assetType: "image",
        name: seedProduct.nameEn,
        parentId: cncFolder?.id ?? null,
        sortOrder: seedProduct.sortOrder,
      })
      .returning();

    const coverAsset = await uploadLocalProductCoverAsset({
      productNameZh: seedProduct.nameZh,
      productNameEn: seedProduct.nameEn,
      slug: seedProduct.slug,
      folderId: productFolder?.id ?? null,
    });

    const catalogAsset = await uploadProductSvgAsset({
      productNameZh: seedProduct.nameZh,
      productNameEn: seedProduct.nameEn,
      slug: seedProduct.slug,
      variant: "catalog",
      svg: buildCncProductImageSvg(seedProduct, "catalog"),
      folderId: productFolder?.id ?? null,
    });

    const sceneAsset = await uploadProductSvgAsset({
      productNameZh: seedProduct.nameZh,
      productNameEn: seedProduct.nameEn,
      slug: seedProduct.slug,
      variant: "scene",
      svg: buildCncProductImageSvg(seedProduct, "scene"),
      folderId: productFolder?.id ?? null,
    });

    await db
      .update(products)
      .set({
        coverMediaId: coverAsset?.id ?? catalogAsset.id,
      })
      .where(eq(products.id, productRow.id));

    await db.insert(productMediaRelations).values(
      [
        coverAsset
          ? {
              productId: productRow.id,
              mediaAssetId: coverAsset.id,
              relationType: "gallery",
              sortOrder: 10,
            }
          : null,
        {
          productId: productRow.id,
          mediaAssetId: catalogAsset.id,
          relationType: "gallery",
          sortOrder: 20,
        },
        {
          productId: productRow.id,
          mediaAssetId: sceneAsset.id,
          relationType: "gallery",
          sortOrder: 30,
        },
      ].filter(Boolean) as Array<{
        productId: number;
        mediaAssetId: number;
        relationType: string;
        sortOrder: number;
      }>,
    );

    if (!categoryCoverMap.has(seedProduct.categorySlug)) {
      categoryCoverMap.set(seedProduct.categorySlug, coverAsset?.id ?? catalogAsset.id);
    }
  }

  const categoryRows = await db
    .select({
      id: productCategories.id,
      slug: productCategories.slug,
    })
    .from(productCategories)
    .where(inArray(productCategories.slug, [...categoryCoverMap.keys()]));

  for (const categoryRow of categoryRows) {
    const imageMediaId = categoryCoverMap.get(categoryRow.slug);

    if (!imageMediaId) {
      continue;
    }

    await db
      .update(productCategories)
      .set({
        imageMediaId,
      })
      .where(eq(productCategories.id, categoryRow.id));
  }

  return {
    ...result,
    uploadedImages: seedProducts.length * 2,
  };
}

async function main() {
  const result = await seedCncCompleteDemo();
  console.log(
    `Seeded ${result.key}: ${result.categories} categories, ${result.products} products, ${result.blogPosts} blog posts, ${result.uploadedImages} images uploaded`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error("Complete CNC demo seed failed.", error);
    process.exitCode = 1;
  });
}

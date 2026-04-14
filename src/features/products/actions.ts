"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  productCategories,
  productCustomFields,
  productDefaultFieldValues,
  productMediaRelations,
  products,
} from "@/db/schema";
import { defaultFieldDefinitions, type DefaultFieldKey } from "@/db/seed";
import {
  mapProductCsvRowToImportDraft,
  parseProductImportCsv,
} from "@/features/products/import";
import {
  buildCategoryDraft,
  buildProductCustomFieldDrafts,
  buildProductDraft,
  buildProductMediaBindingDraft,
  buildProductPdfBinding,
  parseCategoryBulkIds,
  parseProductBulkIds,
  readCheckbox,
  readIdList,
  readOptionalNumber,
  readText,
  toNullable,
  toOptionalId,
} from "@/features/products/product-utils";
import { toSlug } from "@/lib/slug";


async function ensureCategoryForImport(name: string) {
  const db = getDb();
  const trimmed = name.trim();
  const slug = toSlug(trimmed);
  const [existing] = await db
    .select({
      id: productCategories.id,
      nameEn: productCategories.nameEn,
      slug: productCategories.slug,
    })
    .from(productCategories)
    .where(eq(productCategories.slug, slug))
    .limit(1);

  if (existing) {
    return {
      categoryId: existing.id,
      categoryNameEn: existing.nameEn,
    };
  }

  const [created] = await db
    .insert(productCategories)
    .values(
      buildCategoryDraft({
        nameZh: trimmed,
        nameEn: trimmed,
        slug,
        summaryZh: "",
        summaryEn: "",
        sortOrder: 100,
        isVisible: true,
        isFeatured: false,
      }),
    )
    .returning({
      id: productCategories.id,
      nameEn: productCategories.nameEn,
    });

  return {
    categoryId: created?.id ?? null,
    categoryNameEn: created?.nameEn ?? trimmed,
  };
}

async function createImportedProduct(input: {
  product: ReturnType<typeof buildProductDraft>;
  defaultFields: Record<string, string>;
}) {
  const db = getDb();
  const [savedProduct] = await db
    .insert(products)
    .values(input.product)
    .returning({ id: products.id, slug: products.slug, categoryId: products.categoryId });

  if (!savedProduct) {
    return null;
  }

  const defaultFieldRows = defaultFieldDefinitions
    .map((field) => ({
      productId: savedProduct.id,
      fieldKey: field.fieldKey,
      valueZh: input.defaultFields[field.fieldKey] ?? null,
      valueEn: input.defaultFields[field.fieldKey] ?? null,
      isVisible: field.isVisibleByDefault,
      sortOrder: field.sortOrder,
    }))
    .filter((field) => field.valueEn || field.valueZh);

  if (defaultFieldRows.length) {
    await db.insert(productDefaultFieldValues).values(
      defaultFieldRows.map((row) => ({
        productId: row.productId,
        fieldKey: row.fieldKey as DefaultFieldKey,
        valueZh: row.valueZh,
        valueEn: row.valueEn,
        isVisible: row.isVisible,
        sortOrder: row.sortOrder,
      })),
    );
  }

  return savedProduct;
}


// ─── 内部 FormData helper 函数，供下方 Server Actions 使用 ─────────────────────

function buildDefaultFieldValueDrafts(formData: FormData) {
  return defaultFieldDefinitions.map((field) => ({
    fieldKey: field.fieldKey,
    valueZh: toNullable(readText(formData, `field-${field.fieldKey}__valueZh`)),
    valueEn: toNullable(readText(formData, `field-${field.fieldKey}__valueEn`)),
    isVisible: readCheckbox(formData, `field-${field.fieldKey}__isVisible`),
    sortOrder: field.sortOrder,
  }));
}

function buildCustomFieldDraftsFromFormData(formData: FormData) {
  const indices = Array.from(
    new Set(
      Array.from(formData.keys())
        .map((key) => key.match(/^custom-(\d+)__/))
        .filter((match): match is RegExpMatchArray => Boolean(match))
        .map((match) => Number.parseInt(match[1]!, 10))
        .filter((value) => Number.isFinite(value)),
    ),
  ).sort((left, right) => left - right);

  return buildProductCustomFieldDrafts(
    indices.map((index) => ({
      labelZh: readText(formData, `custom-${index}__labelZh`),
      labelEn: readText(formData, `custom-${index}__labelEn`),
      valueZh: readText(formData, `custom-${index}__valueZh`),
      valueEn: readText(formData, `custom-${index}__valueEn`),
      isVisible: readCheckbox(formData, `custom-${index}__isVisible`),
    })),
  );
}

export async function bindProductPdfFile(input: {
  productId: number;
  mediaId: number;
  showDownloadButton: boolean;
}) {
  const binding = buildProductPdfBinding(input);
  const db = getDb();

  const [product] = await db
    .update(products)
    .set({
      pdfFileId: binding.pdfFileId,
      showPdfDownload: binding.showDownloadButton,
      updatedAt: new Date(),
    })
    .where(eq(products.id, binding.productId))
    .returning({
      productId: products.id,
      pdfFileId: products.pdfFileId,
      showDownloadButton: products.showPdfDownload,
    });

  return {
    productId: product?.productId ?? binding.productId,
    pdfFileId: product?.pdfFileId ?? binding.pdfFileId,
    showDownloadButton: product?.showDownloadButton ?? binding.showDownloadButton,
  };
}

export async function replaceProductAsset(input: {
  productId: number;
  targetType: "cover" | "gallery";
  currentMediaId?: number | null;
  newMediaId: number;
}) {
  const db = getDb();

  if (input.targetType === "cover") {
    const [product] = await db
      .update(products)
      .set({
        coverMediaId: input.newMediaId,
        updatedAt: new Date(),
      })
      .where(eq(products.id, input.productId))
      .returning({ id: products.id });

    return product ?? null;
  }

  if (input.currentMediaId) {
    const [relation] = await db
      .update(productMediaRelations)
      .set({
        mediaAssetId: input.newMediaId,
      })
      .where(
        and(
          eq(productMediaRelations.productId, input.productId),
          eq(productMediaRelations.mediaAssetId, input.currentMediaId),
          eq(productMediaRelations.relationType, "gallery"),
        ),
      )
      .returning({ id: productMediaRelations.id });

    if (relation) {
      return relation;
    }
  }

  const [relation] = await db
    .insert(productMediaRelations)
    .values({
      productId: input.productId,
      mediaAssetId: input.newMediaId,
      relationType: "gallery",
      sortOrder: Date.now(),
    })
    .returning({ id: productMediaRelations.id });

  return relation ?? null;
}

export async function saveCategory(formData: FormData) {

  const db = getDb();
  const categoryId = readOptionalNumber(formData, "id");
  const returnTo = readText(formData, "returnTo") || "/admin/categories";
  const nameZh = readText(formData, "nameZh") || readText(formData, "inlineNameZh");
  const nameEn = readText(formData, "nameEn") || readText(formData, "inlineNameEn");
  const slug = readText(formData, "slug") || readText(formData, "inlineSlug");
  const draft = buildCategoryDraft({
    nameZh,
    nameEn,
    slug,
    summaryZh: readText(formData, "summaryZh"),
    summaryEn: readText(formData, "summaryEn"),
    imageMediaId: readOptionalNumber(formData, "imageMediaId"),
    sortOrder: readOptionalNumber(formData, "sortOrder") ?? 100,
    isVisible: readCheckbox(formData, "isVisible"),
    isFeatured: readCheckbox(formData, "isFeatured"),
  });

  if (categoryId) {
    await db
      .update(productCategories)
      .set({
        ...draft,
        updatedAt: new Date(),
      })
      .where(eq(productCategories.id, categoryId));
  } else {
    await db.insert(productCategories).values(draft);
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/categories");

  redirect(returnTo.includes("?") ? `${returnTo}&saved=1` : `${returnTo}?saved=1`);
}

export async function deleteCategory(formData: FormData) {

  const categoryId = readOptionalNumber(formData, "id");
  const returnTo = readText(formData, "returnTo") || "/admin/categories";

  if (!categoryId) {
    redirect(returnTo);
  }

  const db = getDb();
  const [record] = await db
    .select({ slug: productCategories.slug })
    .from(productCategories)
    .where(eq(productCategories.id, categoryId))
    .limit(1);

  if (!record) {
    redirect(returnTo);
  }

  const [productInCategory] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.categoryId, categoryId))
    .limit(1);

  if (productInCategory) {
    redirect(returnTo.includes("?") ? `${returnTo}&error=category-has-products` : `${returnTo}?error=category-has-products`);
  }

  await db.delete(productCategories).where(eq(productCategories.id, categoryId));

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${record.slug}`);
  revalidatePath("/admin/categories");

  redirect(returnTo.includes("?") ? `${returnTo}&deleted=1` : `${returnTo}?deleted=1`);
}

export async function bulkDeleteCategories(formData: FormData) {

  const ids = parseCategoryBulkIds(formData);

  if (!ids.length) {
    redirect("/admin/categories?error=no-selection");
  }

  const db = getDb();
  const linkedProducts = await db
    .select({ categoryId: products.categoryId })
    .from(products)
    .where(inArray(products.categoryId, ids));

  const blockedIds = new Set(
    linkedProducts
      .map((row) => row.categoryId)
      .filter((value): value is number => typeof value === "number"),
  );

  const deletableIds = ids.filter((id) => !blockedIds.has(id));

  if (deletableIds.length) {
    await db.delete(productCategories).where(inArray(productCategories.id, deletableIds));
  }

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/categories");

  const params = new URLSearchParams();
  if (deletableIds.length) {
    params.set("deleted", String(deletableIds.length));
  }
  if (blockedIds.size) {
    params.set("error", "category-has-products");
  }

  const search = params.toString();
  redirect(search ? `/admin/categories?${search}` : "/admin/categories");
}

export async function saveProduct(formData: FormData) {

  const db = getDb();
  const productId = readOptionalNumber(formData, "id");
  const currentCategoryId = readOptionalNumber(formData, "categoryId");
  const mediaBinding = buildProductMediaBindingDraft({
    coverMediaId: readOptionalNumber(formData, "coverMediaId"),
    pdfFileId: readOptionalNumber(formData, "pdfFileId"),
    galleryMediaIds: readIdList(formData, "galleryMediaIds"),
  });
  const faqsRaw = formData.get("faqsJson");
  let faqsJson: Array<{ question: string; answer: string }> = [];
  if (typeof faqsRaw === "string" && faqsRaw.trim()) {
    try {
      const parsed = JSON.parse(faqsRaw);
      if (Array.isArray(parsed)) {
        faqsJson = parsed.filter(
          (item) =>
            item &&
            typeof item.question === "string" &&
            typeof item.answer === "string",
        );
      }
    } catch {
      // JSON 解析失败，忽略无效的 FAQs 数据，不中断保存流程
    }
  }
  const draft = buildProductDraft({
    categoryId: currentCategoryId,
    nameZh: readText(formData, "nameZh"),
    nameEn: readText(formData, "nameEn"),
    slug: readText(formData, "slug"),
    shortDescriptionZh: readText(formData, "shortDescriptionZh"),
    shortDescriptionEn: readText(formData, "shortDescriptionEn"),
    detailsZh: readText(formData, "detailsZh"),
    detailsEn: readText(formData, "detailsEn"),
    seoTitle: readText(formData, "seoTitle"),
    seoDescription: readText(formData, "seoDescription"),
    sortOrder: readOptionalNumber(formData, "sortOrder") ?? 100,
    status: readText(formData, "status") === "published" ? "published" : "draft",
    isFeatured: readCheckbox(formData, "isFeatured"),
    showInquiryButton: readCheckbox(formData, "showInquiryButton"),
    showWhatsappButton: readCheckbox(formData, "showWhatsappButton"),
    showPdfDownload: readCheckbox(formData, "showPdfDownload"),
    coverMediaId: mediaBinding.coverMediaId,
    pdfFileId: mediaBinding.pdfFileId,
    faqsJson,
  });

  const [previousRecord] = productId
    ? await db
        .select({
          id: products.id,
          slug: products.slug,
          categoryId: products.categoryId,
        })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1)
    : [];

  const [savedProduct] = productId
    ? await db
        .update(products)
        .set({
          ...draft,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId))
        .returning({
          id: products.id,
          slug: products.slug,
          categoryId: products.categoryId,
        })
    : await db
        .insert(products)
        .values(draft)
        .returning({
          id: products.id,
          slug: products.slug,
          categoryId: products.categoryId,
        });

  if (!savedProduct) {
    redirect("/admin/products");
  }

  await db
    .delete(productDefaultFieldValues)
    .where(eq(productDefaultFieldValues.productId, savedProduct.id));
  await db
    .delete(productCustomFields)
    .where(eq(productCustomFields.productId, savedProduct.id));
  await db
    .delete(productMediaRelations)
    .where(eq(productMediaRelations.productId, savedProduct.id));

  const defaultFieldRows = buildDefaultFieldValueDrafts(formData).map((row) => ({
    productId: savedProduct.id,
    fieldKey: row.fieldKey as DefaultFieldKey,
    valueZh: row.valueZh,
    valueEn: row.valueEn,
    isVisible: row.isVisible,
    sortOrder: row.sortOrder,
  }));

  if (defaultFieldRows.length) {
    await db.insert(productDefaultFieldValues).values(defaultFieldRows);
  }

  const customFieldRows = buildCustomFieldDraftsFromFormData(formData).map((row) => ({
    productId: savedProduct.id,
    ...row,
  }));

  if (customFieldRows.length) {
    await db.insert(productCustomFields).values(customFieldRows);
  }

  if (mediaBinding.galleryMediaIds.length) {
    await db.insert(productMediaRelations).values(
      mediaBinding.galleryMediaIds.map((mediaAssetId, index) => ({
        productId: savedProduct.id,
        mediaAssetId,
        relationType: "gallery",
        sortOrder: (index + 1) * 10,
      })),
    );
  }

  const categoryIds = [previousRecord?.categoryId, savedProduct.categoryId].filter(
    (value): value is number => typeof value === "number",
  );

  const categoryRecords = categoryIds.length
    ? await db
        .select({ id: productCategories.id, slug: productCategories.slug })
        .from(productCategories)
        .where(inArray(productCategories.id, categoryIds))
    : [];

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");

  for (const record of categoryRecords) {
    revalidatePath(`/products/${record.slug}`);
    revalidatePath(`/products/${record.slug}/${savedProduct.slug}`);
  }

  if (previousRecord?.slug && previousRecord.slug !== savedProduct.slug) {
    for (const record of categoryRecords) {
      revalidatePath(`/products/${record.slug}/${previousRecord.slug}`);
    }
  }

  // 产品保存成功后，异步触发 embedding 更新（fire-and-forget，不阻塞用户操作）
  void import("@/lib/rag-utils").then(({ computeAndStoreProductEmbedding }) =>
    computeAndStoreProductEmbedding(savedProduct.id).catch((err) =>
      console.warn("[saveProduct] embedding 更新失败:", err),
    ),
  );

  redirect(`/admin/products/${savedProduct.id}?saved=1`);
}

export async function deleteProduct(formData: FormData) {

  const productId = readOptionalNumber(formData, "id");

  if (!productId) {
    redirect("/admin/products");
  }

  const db = getDb();
  const [record] = await db
    .select({
      id: products.id,
      slug: products.slug,
      categorySlug: productCategories.slug,
    })
    .from(products)
    .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
    .where(eq(products.id, productId))
    .limit(1);

  if (!record) {
    redirect("/admin/products");
  }

  await db.delete(products).where(eq(products.id, productId));

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");

  if (record.categorySlug) {
    revalidatePath(`/products/${record.categorySlug}`);
    revalidatePath(`/products/${record.categorySlug}/${record.slug}`);
  }

  redirect("/admin/products?deleted=1");
}

export async function bulkDeleteProducts(formData: FormData) {

  const ids = parseProductBulkIds(formData);

  if (!ids.length) {
    redirect("/admin/products?error=no-selection");
  }

  const db = getDb();
  await db.delete(products).where(inArray(products.id, ids));

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect(`/admin/products?deleted=${ids.length}`);
}

export async function bulkMoveProductsToCategory(formData: FormData) {

  const ids = parseProductBulkIds(formData);
  const categoryId = readOptionalNumber(formData, "targetCategoryId");

  if (!ids.length) {
    redirect("/admin/products?error=no-selection");
  }

  const db = getDb();
  await db
    .update(products)
    .set({
      categoryId: categoryId ?? null,
      updatedAt: new Date(),
    })
    .where(inArray(products.id, ids));

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect(`/admin/products?saved=bulk-moved`);
}

export async function importProductsFromCsv(formData: FormData) {

  const file = formData.get("file");

  if (!(file instanceof File)) {
    redirect("/admin/products/import?error=missing-file");
  }

  const csvText = await file.text();
  const rows = parseProductImportCsv(csvText);

  if (!rows.length) {
    redirect("/admin/products/import?error=empty");
  }

  const importedIds: number[] = [];

  for (const row of rows) {
    if (!row.nameEn.trim()) {
      continue;
    }

    const category = await ensureCategoryForImport(row.category || "Imported Products");
    const draft = mapProductCsvRowToImportDraft(row, category);
    const savedProduct = await createImportedProduct({
      product: buildProductDraft({
        ...draft.product,
        categoryId: category.categoryId,
        seoTitle: `${draft.product.nameEn} Manufacturer`,
        seoDescription: draft.product.shortDescriptionEn,
      }),
      defaultFields: draft.defaultFields,
    });

    if (savedProduct?.id) {
      importedIds.push(savedProduct.id);
    }
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect(`/admin/products?imported=${importedIds.length}`);
}

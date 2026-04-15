import { and, asc, eq, ilike, inArray, ne, or } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  mediaAssets,
  productCategories,
  productCustomFields,
  productDefaultFieldDefinitions,
  productDefaultFieldValues,
  productMediaRelations,
  products,
} from "@/db/schema";
import {
  defaultFieldDefinitions,
  getSeedPack,
  type DefaultFieldKey,
  type SeedPackKey,
} from "@/db/seed";
import { getPreferredProductImageUrl } from "@/features/products/image-map";

type FieldInput = {
  labelZh?: string;
  labelEn: string;
  valueZh?: string | null;
  valueEn: string | null;
  isVisible: boolean;
  sortOrder: number;
};

type ProductDetailViewModelInput = {
  product: {
    id?: number;
    nameEn: string;
    showDownloadButton: boolean;
  };
  defaultFields: FieldInput[];
  customFields: FieldInput[];
  faqs: Array<{ question: string; answer: string }>;
  relatedProducts: Array<{
    id: number;
    nameEn: string;
    slug?: string;
    categorySlug?: string;
  }>;
  pdfUrl?: string | null;
  shortDescriptionEn?: string | null;
  coverImage?: { url: string; alt: string } | null;
  galleryImages?: Array<{ id: number; url: string; alt: string }>;
};

function mapSeedCategories(seedPackKey: SeedPackKey) {
  return getSeedPack(seedPackKey).categories.map((category, index) => ({
    id: index + 1,
    nameZh: category.nameZh,
    nameEn: category.nameEn,
    slug: category.slug,
    summaryZh: category.summaryZh,
    summaryEn: category.summaryEn,
    imageMediaId: null,
    imageUrl: null,
    imageAlt: category.nameEn,
    sortOrder: category.sortOrder,
    isVisible: true,
    isFeatured: category.isFeatured,
  }));
}

function mapSeedProducts(seedPackKey: SeedPackKey) {
  const categories = mapSeedCategories(seedPackKey);
  const categoryIdMap = new Map(categories.map((category) => [category.slug, category.id]));

  return getSeedPack(seedPackKey).products.map((product, index) => ({
    id: index + 1,
    categoryId: categoryIdMap.get(product.categorySlug) ?? null,
    categorySlug: product.categorySlug,
    nameZh: product.nameZh,
    nameEn: product.nameEn,
    slug: product.slug,
    shortDescriptionZh: product.shortDescriptionZh,
    shortDescriptionEn: product.shortDescriptionEn,
    detailsZh: product.detailsZh,
    detailsEn: product.detailsEn,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    sortOrder: product.sortOrder,
    status: "published" as const,
    isFeatured: product.isFeatured,
    showInquiryButton: true,
    showWhatsappButton: true,
    showPdfDownload: false,
    coverImageUrl: getPreferredProductImageUrl({ slug: product.slug, currentUrl: null }),
    coverImageAlt: null,
  }));
}

function mapSeedDefaultFields(
  seedPackKey: SeedPackKey,
  productSlug: string,
): FieldInput[] {
  const product = getSeedPack(seedPackKey).products.find((item) => item.slug === productSlug);

  if (!product) {
    return [];
  }

  return defaultFieldDefinitions.map((field) => {
    const value = product.defaultFields[field.fieldKey as DefaultFieldKey];

    return {
      labelZh: field.labelZh,
      labelEn: field.labelEn,
      valueZh: value?.valueZh ?? null,
      valueEn: value?.valueEn ?? null,
      isVisible: value?.visible ?? field.isVisibleByDefault,
      sortOrder: field.sortOrder,
    };
  });
}

function mapSeedCustomFields(
  seedPackKey: SeedPackKey,
  productSlug: string,
): FieldInput[] {
  const product = getSeedPack(seedPackKey).products.find((item) => item.slug === productSlug);

  if (!product) {
    return [];
  }

  return product.customFields.map((field) => ({
    labelZh: field.labelZh,
    labelEn: field.labelEn,
    valueZh: field.valueZh,
    valueEn: field.valueEn,
    isVisible: field.visible,
    sortOrder: field.sortOrder,
  }));
}

async function hasDatabaseCategories(siteId?: number | null) {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  const db = getDb();
  const query = db.select({ id: productCategories.id }).from(productCategories).limit(1);
  const [record] = siteId ? await query.where(eq(productCategories.siteId, siteId)) : await query;
  return Boolean(record);
}

async function hasDatabaseProducts(siteId?: number | null) {
  if (!process.env.DATABASE_URL) {
    return false;
  }

  const db = getDb();
  const query = db.select({ id: products.id }).from(products).limit(1);
  const [record] = siteId ? await query.where(eq(products.siteId, siteId)) : await query;
  return Boolean(record);
}

async function listDatabaseCategories(options?: { includeHidden?: boolean; siteId?: number | null }) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const db = getDb();
  const query = db
    .select()
    .from(productCategories)
    .orderBy(asc(productCategories.sortOrder), asc(productCategories.id));

  const conditions = [];
  if (!options?.includeHidden) conditions.push(eq(productCategories.isVisible, true));
  if (options?.siteId) conditions.push(eq(productCategories.siteId, options.siteId));

  return conditions.length ? query.where(and(...conditions)) : query;
}

function buildProductFaqs() {
  return [
    {
      question: "Can you support OEM drawings?",
      answer: "Yes. We can quote based on drawings, samples, and target tolerances.",
    },
    {
      question: "Do you support export shipping?",
      answer: "Yes. We can support export packaging and shipping coordination.",
    },
  ];
}

export function buildVisibleSpecRows(input: {
  defaultFields: FieldInput[];
  customFields: FieldInput[];
}) {
  return [...input.defaultFields, ...input.customFields]
    .filter((field) => field.isVisible && field.valueEn)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((field) => ({
      label: field.labelEn,
      value: field.valueEn as string,
    }));
}

export function buildProductDetailViewModel(input: ProductDetailViewModelInput) {
  return {
    ...input,
    showDownloadButton: input.product.showDownloadButton,
    coverImage: input.coverImage ?? null,
    galleryImages: input.galleryImages ?? [],
  };
}

export async function getAllCategories(seedPackKey: SeedPackKey = "cnc", siteId?: number | null) {
  try {
    const categories = await listDatabaseCategories({ siteId });

    if (categories.length) {
      const imageIds = categories
        .map((category) => category.imageMediaId)
        .filter((value): value is number => typeof value === "number");
      const imageMap =
        imageIds.length && process.env.DATABASE_URL
          ? new Map(
              (
                await getDb()
                  .select({
                    id: mediaAssets.id,
                    url: mediaAssets.url,
                    altTextEn: mediaAssets.altTextEn,
                  })
                  .from(mediaAssets)
                  .where(inArray(mediaAssets.id, imageIds))
              ).map((asset) => [asset.id, asset]),
            )
          : new Map<number, { url: string; altTextEn: string | null }>();

      return categories.map((category) => ({
        id: category.id,
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        slug: category.slug,
        summaryZh: category.summaryZh ?? "",
        summaryEn: category.summaryEn ?? "",
        imageMediaId: category.imageMediaId ?? null,
        imageUrl:
          typeof category.imageMediaId === "number"
            ? imageMap.get(category.imageMediaId)?.url ?? null
            : null,
        imageAlt:
          typeof category.imageMediaId === "number"
            ? imageMap.get(category.imageMediaId)?.altTextEn ?? category.nameEn
            : category.nameEn,
        sortOrder: category.sortOrder,
        isVisible: category.isVisible,
        isFeatured: category.isFeatured,
      }));
    }

    if (await hasDatabaseCategories(siteId)) {
      return [];
    }
  } catch (error) {
    console.error("Falling back to seed categories after database read failure.", error);
  }

  return mapSeedCategories(seedPackKey);
}

export async function listAdminCategories(seedPackKey: SeedPackKey = "cnc", siteId?: number | null) {
  try {
    const categories = await listDatabaseCategories({ includeHidden: true, siteId });

    if (categories.length) {
      return categories.map((category) => ({
        id: category.id,
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        slug: category.slug,
        summaryZh: category.summaryZh ?? "",
        summaryEn: category.summaryEn ?? "",
        imageMediaId: category.imageMediaId ?? null,
        sortOrder: category.sortOrder,
        isVisible: category.isVisible,
        isFeatured: category.isFeatured,
      }));
    }
  } catch (error) {
    console.error("Falling back to seed admin categories after database read failure.", error);
  }

  return mapSeedCategories(seedPackKey);
}

export async function getAllProducts(seedPackKey: SeedPackKey = "cnc", siteId?: number | null) {
  if (!process.env.DATABASE_URL) {
    return mapSeedProducts(seedPackKey);
  }

  try {
    const db = getDb();
    const rows = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        categorySlug: productCategories.slug,
        nameZh: products.nameZh,
        nameEn: products.nameEn,
        slug: products.slug,
        shortDescriptionZh: products.shortDescriptionZh,
        shortDescriptionEn: products.shortDescriptionEn,
        detailsZh: products.detailsZh,
        detailsEn: products.detailsEn,
        seoTitle: products.seoTitle,
        seoDescription: products.seoDescription,
        sortOrder: products.sortOrder,
        status: products.status,
        isFeatured: products.isFeatured,
        showInquiryButton: products.showInquiryButton,
        showWhatsappButton: products.showWhatsappButton,
        showPdfDownload: products.showPdfDownload,
        coverImageUrl: mediaAssets.url,
        coverImageAlt: mediaAssets.altTextEn,
      })
      .from(products)
      .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
      .leftJoin(mediaAssets, eq(products.coverMediaId, mediaAssets.id))
      .where(
        and(
          eq(products.status, "published"),
          eq(productCategories.isVisible, true),
          ...(siteId ? [eq(products.siteId, siteId)] : []),
        ),
      )
      .orderBy(asc(products.sortOrder), asc(products.id));

    if (rows.length) {
      return rows.map((row) => ({
        ...row,
        categorySlug: row.categorySlug,
        shortDescriptionZh: row.shortDescriptionZh ?? "",
        shortDescriptionEn: row.shortDescriptionEn ?? "",
        detailsZh: row.detailsZh ?? "",
        detailsEn: row.detailsEn ?? "",
        seoTitle: row.seoTitle ?? "",
        seoDescription: row.seoDescription ?? "",
        coverImageUrl: getPreferredProductImageUrl({
          slug: row.slug,
          currentUrl: row.coverImageUrl ?? null,
        }),
        coverImageAlt: row.coverImageAlt ?? row.nameEn,
      }));
    }

    if (await hasDatabaseProducts(siteId)) {
      return [];
    }
  } catch (error) {
    console.error("Falling back to seed products after database read failure.", error);
  }

  return mapSeedProducts(seedPackKey);
}

export async function listAdminProducts(
  seedPackKey: SeedPackKey = "cnc",
  filters?: {
    query?: string;
    categorySlug?: string;
    status?: "draft" | "published" | "";
  },
) {
  if (!process.env.DATABASE_URL) {
    const seedCategories = mapSeedCategories(seedPackKey);
    const seedCategoryMap = new Map(seedCategories.map((category) => [category.slug, category]));
    return mapSeedProducts(seedPackKey)
      .map((product) => ({
        ...product,
        categoryNameZh: seedCategoryMap.get(product.categorySlug)?.nameZh ?? "",
        updatedAt: null,
        pdfFileId: null,
      }))
      .filter((product) => {
        const query = filters?.query?.trim().toLowerCase();
        const matchesQuery =
          !query ||
          [product.nameZh, product.nameEn, product.slug]
            .join(" ")
            .toLowerCase()
            .includes(query);
        const matchesCategory =
          !filters?.categorySlug || product.categorySlug === filters.categorySlug;
        const matchesStatus = !filters?.status || product.status === filters.status;

        return matchesQuery && matchesCategory && matchesStatus;
      });
  }

  try {
    const db = getDb();
    const conditions = [];

    if (filters?.query?.trim()) {
      const keyword = `%${filters.query.trim()}%`;
      conditions.push(
        or(
          ilike(products.nameZh, keyword),
          ilike(products.nameEn, keyword),
          ilike(products.slug, keyword),
        )!,
      );
    }

    if (filters?.categorySlug) {
      conditions.push(eq(productCategories.slug, filters.categorySlug));
    }

    if (filters?.status) {
      conditions.push(eq(products.status, filters.status));
    }

    const query = db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        categorySlug: productCategories.slug,
        categoryNameZh: productCategories.nameZh,
        nameZh: products.nameZh,
        nameEn: products.nameEn,
        slug: products.slug,
        shortDescriptionZh: products.shortDescriptionZh,
        shortDescriptionEn: products.shortDescriptionEn,
        detailsZh: products.detailsZh,
        detailsEn: products.detailsEn,
        seoTitle: products.seoTitle,
        seoDescription: products.seoDescription,
        sortOrder: products.sortOrder,
        status: products.status,
        isFeatured: products.isFeatured,
        showInquiryButton: products.showInquiryButton,
        showWhatsappButton: products.showWhatsappButton,
        showPdfDownload: products.showPdfDownload,
        coverImageUrl: mediaAssets.url,
        coverImageAlt: mediaAssets.altTextEn,
        pdfFileId: products.pdfFileId,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .leftJoin(mediaAssets, eq(products.coverMediaId, mediaAssets.id));

    const rows = await (conditions.length ? query.where(and(...conditions)) : query).orderBy(
      asc(products.sortOrder),
      asc(products.id),
    );

    if (rows.length) {
      return rows.map((row) => ({
        ...row,
        categorySlug: row.categorySlug ?? "",
        categoryNameZh: row.categoryNameZh ?? "",
        shortDescriptionZh: row.shortDescriptionZh ?? "",
        shortDescriptionEn: row.shortDescriptionEn ?? "",
        detailsZh: row.detailsZh ?? "",
        detailsEn: row.detailsEn ?? "",
        seoTitle: row.seoTitle ?? "",
        seoDescription: row.seoDescription ?? "",
        coverImageUrl: getPreferredProductImageUrl({
          slug: row.slug,
          currentUrl: row.coverImageUrl ?? null,
        }),
        coverImageAlt: row.coverImageAlt ?? row.nameEn,
        updatedAt: row.updatedAt?.toISOString() ?? "",
      }));
    }
  } catch (error) {
    console.error("Falling back to seed admin products after database read failure.", error);
  }

  const seedCategories = mapSeedCategories(seedPackKey);
  const seedCategoryMap = new Map(seedCategories.map((category) => [category.slug, category]));

  return mapSeedProducts(seedPackKey)
    .map((product) => ({
      ...product,
      categoryNameZh: seedCategoryMap.get(product.categorySlug)?.nameZh ?? "",
      updatedAt: null,
      pdfFileId: null,
    }))
    .filter((product) => {
      const queryText = filters?.query?.trim().toLowerCase();
      const matchesQuery =
        !queryText ||
        [product.nameZh, product.nameEn, product.slug]
          .join(" ")
          .toLowerCase()
          .includes(queryText);
      const matchesCategory =
        !filters?.categorySlug || product.categorySlug === filters.categorySlug;
      const matchesStatus = !filters?.status || product.status === filters.status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
}

export async function getProductsByCategorySlug(
  categorySlug: string,
  seedPackKey: SeedPackKey = "cnc",
  siteId?: number | null,
) {
  if (!process.env.DATABASE_URL) {
    return mapSeedProducts(seedPackKey).filter((product) => product.categorySlug === categorySlug);
  }

  try {
    const db = getDb();
    const rows = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        categorySlug: productCategories.slug,
        nameZh: products.nameZh,
        nameEn: products.nameEn,
        slug: products.slug,
        shortDescriptionZh: products.shortDescriptionZh,
        shortDescriptionEn: products.shortDescriptionEn,
        detailsZh: products.detailsZh,
        detailsEn: products.detailsEn,
        seoTitle: products.seoTitle,
        seoDescription: products.seoDescription,
        sortOrder: products.sortOrder,
        status: products.status,
        isFeatured: products.isFeatured,
        showInquiryButton: products.showInquiryButton,
        showWhatsappButton: products.showWhatsappButton,
        showPdfDownload: products.showPdfDownload,
        coverImageUrl: mediaAssets.url,
        coverImageAlt: mediaAssets.altTextEn,
      })
      .from(products)
      .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
      .leftJoin(mediaAssets, eq(products.coverMediaId, mediaAssets.id))
      .where(
        and(
          eq(productCategories.slug, categorySlug),
          eq(productCategories.isVisible, true),
          eq(products.status, "published"),
          ...(siteId ? [eq(products.siteId, siteId)] : []),
        ),
      )
      .orderBy(asc(products.sortOrder), asc(products.id));

    if (rows.length) {
      return rows.map((row) => ({
        ...row,
        categorySlug: row.categorySlug,
        shortDescriptionZh: row.shortDescriptionZh ?? "",
        shortDescriptionEn: row.shortDescriptionEn ?? "",
        detailsZh: row.detailsZh ?? "",
        detailsEn: row.detailsEn ?? "",
        seoTitle: row.seoTitle ?? "",
        seoDescription: row.seoDescription ?? "",
        coverImageUrl: getPreferredProductImageUrl({
          slug: row.slug,
          currentUrl: row.coverImageUrl ?? null,
        }),
        coverImageAlt: row.coverImageAlt ?? row.nameEn,
      }));
    }

    if (await hasDatabaseProducts(siteId)) {
      return [];
    }
  } catch (error) {
    console.error(
      `Falling back to seed products for category "${categorySlug}" after database read failure.`,
      error,
    );
  }

  return mapSeedProducts(seedPackKey).filter((product) => product.categorySlug === categorySlug);
}

export async function getProductById(id: number, seedPackKey: SeedPackKey = "cnc") {
  if (!process.env.DATABASE_URL) {
    const seedProduct = mapSeedProducts(seedPackKey).find((item) => item.id === id);

    if (!seedProduct) {
      return null;
    }

    return {
      ...seedProduct,
      coverMediaId: null,
      pdfFileId: null,
      galleryMediaIds: [],
      defaultFields: mapSeedDefaultFields(seedPackKey, seedProduct.slug).map((field) => ({
        fieldKey: defaultFieldDefinitions.find((definition) => definition.labelEn === field.labelEn)
          ?.fieldKey ?? "model",
        labelZh: field.labelZh ?? "",
        labelEn: field.labelEn,
        valueZh: field.valueZh ?? "",
        valueEn: field.valueEn ?? "",
        isVisible: field.isVisible,
        sortOrder: field.sortOrder,
      })),
      customFields: mapSeedCustomFields(seedPackKey, seedProduct.slug).map((field, index) => ({
        id: index + 1,
        labelZh: field.labelZh ?? "",
        labelEn: field.labelEn,
        valueZh: field.valueZh ?? "",
        valueEn: field.valueEn ?? "",
        isVisible: field.isVisible,
        sortOrder: field.sortOrder,
      })),
    };
  }

  const db = getDb();
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (product) {
    const [category] =
      typeof product.categoryId === "number"
        ? await db
            .select()
            .from(productCategories)
            .where(eq(productCategories.id, product.categoryId))
            .limit(1)
        : [];
    const definitions = await db
      .select()
      .from(productDefaultFieldDefinitions)
      .orderBy(
        asc(productDefaultFieldDefinitions.sortOrder),
        asc(productDefaultFieldDefinitions.id),
      );
    const values = await db
      .select()
      .from(productDefaultFieldValues)
      .where(eq(productDefaultFieldValues.productId, product.id))
      .orderBy(
        asc(productDefaultFieldValues.sortOrder),
        asc(productDefaultFieldValues.id),
      );
    const customFields = await db
      .select()
      .from(productCustomFields)
      .where(eq(productCustomFields.productId, product.id))
      .orderBy(asc(productCustomFields.sortOrder), asc(productCustomFields.id));
    const galleryMediaRows = await db
      .select({ mediaAssetId: productMediaRelations.mediaAssetId })
      .from(productMediaRelations)
      .where(
        and(
          eq(productMediaRelations.productId, product.id),
          eq(productMediaRelations.relationType, "gallery"),
        ),
      )
      .orderBy(asc(productMediaRelations.sortOrder), asc(productMediaRelations.id));
    const valueMap = new Map(values.map((value) => [value.fieldKey, value]));

    return {
      id: product.id,
      categoryId: product.categoryId,
      categorySlug: category?.slug ?? "",
      nameZh: product.nameZh,
      nameEn: product.nameEn,
      slug: product.slug,
      shortDescriptionZh: product.shortDescriptionZh ?? "",
      shortDescriptionEn: product.shortDescriptionEn ?? "",
      detailsZh: product.detailsZh ?? "",
      detailsEn: product.detailsEn ?? "",
      seoTitle: product.seoTitle ?? "",
      seoDescription: product.seoDescription ?? "",
      sortOrder: product.sortOrder,
      status: product.status,
      isFeatured: product.isFeatured,
      showInquiryButton: product.showInquiryButton,
      showWhatsappButton: product.showWhatsappButton,
      showPdfDownload: product.showPdfDownload,
      coverMediaId: product.coverMediaId,
      pdfFileId: product.pdfFileId,
      galleryMediaIds: galleryMediaRows.map((row) => row.mediaAssetId),
      defaultFields: (definitions.length ? definitions : defaultFieldDefinitions).map(
        (definition) => {
          const value = valueMap.get(definition.fieldKey);

          return {
            fieldKey: definition.fieldKey,
            labelZh: definition.labelZh,
            labelEn: definition.labelEn,
            valueZh: value?.valueZh ?? "",
            valueEn: value?.valueEn ?? "",
            isVisible: value?.isVisible ?? definition.isVisibleByDefault,
            sortOrder: definition.sortOrder,
          };
        },
      ),
      customFields: customFields.map((field) => ({
        id: field.id,
        labelZh: field.labelZh,
        labelEn: field.labelEn,
        valueZh: field.valueZh ?? "",
        valueEn: field.valueEn ?? "",
        isVisible: field.isVisible,
        sortOrder: field.sortOrder,
      })),
      faqsJson: Array.isArray(product.faqsJson) ? product.faqsJson : [],
    };
  }

  if (await hasDatabaseProducts()) {
    return null;
  }

  const seedProduct = mapSeedProducts(seedPackKey).find((item) => item.id === id);

  if (!seedProduct) {
    return null;
  }

  return {
    ...seedProduct,
    coverMediaId: null,
    pdfFileId: null,
    galleryMediaIds: [],
    defaultFields: mapSeedDefaultFields(seedPackKey, seedProduct.slug).map((field) => ({
      fieldKey: defaultFieldDefinitions.find((definition) => definition.labelEn === field.labelEn)
        ?.fieldKey ?? "model",
      labelZh: field.labelZh ?? "",
      labelEn: field.labelEn,
      valueZh: field.valueZh ?? "",
      valueEn: field.valueEn ?? "",
      isVisible: field.isVisible,
      sortOrder: field.sortOrder,
    })),
    customFields: mapSeedCustomFields(seedPackKey, seedProduct.slug).map((field, index) => ({
      id: index + 1,
      labelZh: field.labelZh ?? "",
      labelEn: field.labelEn,
      valueZh: field.valueZh ?? "",
      valueEn: field.valueEn ?? "",
      isVisible: field.isVisible,
      sortOrder: field.sortOrder,
    })),
  };
}

export async function getProductDetailBySlugs(
  categorySlug: string,
  productSlug: string,
  seedPackKey: SeedPackKey = "cnc",
  siteId?: number | null,
) {
  if (!process.env.DATABASE_URL) {
    const seedProducts = mapSeedProducts(seedPackKey);
    const seedProduct = seedProducts.find(
      (item) => item.categorySlug === categorySlug && item.slug === productSlug,
    );

    if (!seedProduct) {
      return null;
    }

    const relatedProducts = seedProducts
      .filter((item) => item.slug !== seedProduct.slug)
      .slice(0, 2)
      .map((item) => ({
        id: item.id,
        nameEn: item.nameEn,
        slug: item.slug,
        categorySlug: item.categorySlug,
      }));

    return buildProductDetailViewModel({
      product: {
        id: seedProduct.id,
        nameEn: seedProduct.nameEn,
        showDownloadButton: seedProduct.showPdfDownload,
      },
      shortDescriptionEn: seedProduct.shortDescriptionEn,
      pdfUrl: null,
      coverImage: null,
      galleryImages: [],
      defaultFields: mapSeedDefaultFields(seedPackKey, seedProduct.slug),
      customFields: mapSeedCustomFields(seedPackKey, seedProduct.slug),
      faqs: buildProductFaqs(),
      relatedProducts,
    });
  }

  try {
    const db = getDb();
    const [product] = await db
      .select({
        id: products.id,
        nameEn: products.nameEn,
        slug: products.slug,
        shortDescriptionEn: products.shortDescriptionEn,
        showPdfDownload: products.showPdfDownload,
        categorySlug: productCategories.slug,
        coverMediaId: products.coverMediaId,
        pdfFileId: products.pdfFileId,
        faqsJson: products.faqsJson,
      })
      .from(products)
      .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
      .where(
        and(
          eq(productCategories.slug, categorySlug),
          eq(products.slug, productSlug),
          eq(products.status, "published"),
          eq(productCategories.isVisible, true),
          ...(siteId ? [eq(products.siteId, siteId)] : []),
        ),
      )
      .limit(1);

    if (product) {
      const [coverAssets, pdfAssets, galleryAssets] = await Promise.all([
        typeof product.coverMediaId === "number"
          ? db
              .select({
                id: mediaAssets.id,
                url: mediaAssets.url,
                altTextEn: mediaAssets.altTextEn,
              })
              .from(mediaAssets)
              .where(eq(mediaAssets.id, product.coverMediaId))
              .limit(1)
          : Promise.resolve([]),
        typeof product.pdfFileId === "number"
          ? db
              .select({
                id: mediaAssets.id,
                url: mediaAssets.url,
              })
              .from(mediaAssets)
              .where(eq(mediaAssets.id, product.pdfFileId))
              .limit(1)
          : Promise.resolve([]),
        db
          .select({
            id: mediaAssets.id,
            url: mediaAssets.url,
            altTextEn: mediaAssets.altTextEn,
          })
          .from(productMediaRelations)
          .innerJoin(mediaAssets, eq(productMediaRelations.mediaAssetId, mediaAssets.id))
          .where(
            and(
              eq(productMediaRelations.productId, product.id),
              eq(productMediaRelations.relationType, "gallery"),
            ),
          )
          .orderBy(asc(productMediaRelations.sortOrder), asc(productMediaRelations.id)),
      ]);
      const defaultRows = await db
        .select({
          labelZh: productDefaultFieldDefinitions.labelZh,
          labelEn: productDefaultFieldDefinitions.labelEn,
          valueZh: productDefaultFieldValues.valueZh,
          valueEn: productDefaultFieldValues.valueEn,
          isVisible: productDefaultFieldValues.isVisible,
          sortOrder: productDefaultFieldDefinitions.sortOrder,
        })
        .from(productDefaultFieldDefinitions)
        .leftJoin(
          productDefaultFieldValues,
          and(
            eq(productDefaultFieldValues.productId, product.id),
            eq(
              productDefaultFieldValues.fieldKey,
              productDefaultFieldDefinitions.fieldKey,
            ),
          ),
        )
        .orderBy(
          asc(productDefaultFieldDefinitions.sortOrder),
          asc(productDefaultFieldDefinitions.id),
        );
      const customRows = await db
        .select({
          labelZh: productCustomFields.labelZh,
          labelEn: productCustomFields.labelEn,
          valueZh: productCustomFields.valueZh,
          valueEn: productCustomFields.valueEn,
          isVisible: productCustomFields.isVisible,
          sortOrder: productCustomFields.sortOrder,
        })
        .from(productCustomFields)
        .where(eq(productCustomFields.productId, product.id))
        .orderBy(asc(productCustomFields.sortOrder), asc(productCustomFields.id));
      const relatedProducts = await db
        .select({
          id: products.id,
          nameEn: products.nameEn,
          slug: products.slug,
          categorySlug: productCategories.slug,
        })
        .from(products)
        .innerJoin(productCategories, eq(products.categoryId, productCategories.id))
        .where(
          and(
            eq(productCategories.slug, categorySlug),
            eq(products.status, "published"),
            ne(products.id, product.id),
          ),
        )
        .orderBy(asc(products.sortOrder), asc(products.id))
        .limit(2);

      return buildProductDetailViewModel({
        product: {
          id: product.id,
          nameEn: product.nameEn,
          showDownloadButton: product.showPdfDownload,
        },
        shortDescriptionEn: product.shortDescriptionEn,
        pdfUrl: pdfAssets[0]?.url ?? null,
        coverImage: getPreferredProductImageUrl({
          slug: product.slug,
          currentUrl: coverAssets[0]?.url ?? null,
        })
          ? {
              url: getPreferredProductImageUrl({
                slug: product.slug,
                currentUrl: coverAssets[0]?.url ?? null,
              })!,
              alt: coverAssets[0]?.altTextEn || product.nameEn,
            }
          : null,
        galleryImages: galleryAssets.map((asset) => ({
          id: asset.id,
          url: asset.url,
          alt: asset.altTextEn || product.nameEn,
        })),
        defaultFields: defaultRows.map((row) => ({
          labelZh: row.labelZh,
          labelEn: row.labelEn,
          valueZh: row.valueZh,
          valueEn: row.valueEn,
          isVisible: row.isVisible ?? true,
          sortOrder: row.sortOrder,
        })),
        customFields: customRows.map((row) => ({
          labelZh: row.labelZh,
          labelEn: row.labelEn,
          valueZh: row.valueZh,
          valueEn: row.valueEn,
          isVisible: row.isVisible,
          sortOrder: row.sortOrder,
        })),
        faqs: (Array.isArray(product.faqsJson) && product.faqsJson.length > 0)
          ? product.faqsJson
          : buildProductFaqs(),
        relatedProducts: relatedProducts.map((item) => ({
          id: item.id,
          nameEn: item.nameEn,
          slug: item.slug,
          categorySlug: item.categorySlug,
        })),
      });
    }

    if (await hasDatabaseProducts()) {
      return null;
    }
  } catch (error) {
    console.error(
      `Falling back to seed product detail for "${categorySlug}/${productSlug}" after database read failure.`,
      error,
    );
  }

  const seedProducts = mapSeedProducts(seedPackKey);
  const seedProduct = seedProducts.find(
    (item) => item.categorySlug === categorySlug && item.slug === productSlug,
  );

  if (!seedProduct) {
    return null;
  }

  const relatedProducts = seedProducts
    .filter((item) => item.slug !== seedProduct.slug)
    .slice(0, 2)
    .map((item) => ({
      id: item.id,
      nameEn: item.nameEn,
      slug: item.slug,
      categorySlug: item.categorySlug,
    }));

  return buildProductDetailViewModel({
    product: {
      id: seedProduct.id,
      nameEn: seedProduct.nameEn,
      showDownloadButton: seedProduct.showPdfDownload,
    },
    shortDescriptionEn: seedProduct.shortDescriptionEn,
    pdfUrl: null,
    coverImage: null,
    galleryImages: [],
    defaultFields: mapSeedDefaultFields(seedPackKey, seedProduct.slug),
    customFields: mapSeedCustomFields(seedPackKey, seedProduct.slug),
    faqs: buildProductFaqs(),
    relatedProducts,
  });
}

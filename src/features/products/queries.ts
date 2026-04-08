import { defaultFieldDefinitions, getSeedPack, type DefaultFieldKey, type SeedPackKey } from "@/db/seed";

type FieldInput = {
  labelEn: string;
  valueEn: string | null;
  isVisible: boolean;
  sortOrder: number;
};

type ProductDetailViewModelInput = {
  product: {
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
  shortDescriptionEn?: string;
};

function mapDefaultFields(
  product: ReturnType<typeof getSeedPack>["products"][number],
) {
  return defaultFieldDefinitions
    .map((field) => {
      const value = product.defaultFields[field.fieldKey as DefaultFieldKey];

      return {
        labelEn: field.labelEn,
        valueEn: value?.valueEn ?? null,
        isVisible: value?.visible ?? field.isVisibleByDefault,
        sortOrder: field.sortOrder,
      };
    })
    .filter((field) => field.valueEn);
}

function mapCustomFields(
  product: ReturnType<typeof getSeedPack>["products"][number],
) {
  return product.customFields.map((field) => ({
    labelEn: field.labelEn,
    valueEn: field.valueEn,
    isVisible: field.visible,
    sortOrder: field.sortOrder,
  }));
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
  };
}

export async function getAllCategories(seedPackKey: SeedPackKey = "cnc") {
  return getSeedPack(seedPackKey).categories;
}

export async function getAllProducts(seedPackKey: SeedPackKey = "cnc") {
  return getSeedPack(seedPackKey).products;
}

export async function getProductsByCategorySlug(
  categorySlug: string,
  seedPackKey: SeedPackKey = "cnc",
) {
  return getSeedPack(seedPackKey).products.filter(
    (product) => product.categorySlug === categorySlug,
  );
}

export async function getProductDetailBySlugs(
  categorySlug: string,
  productSlug: string,
  seedPackKey: SeedPackKey = "cnc",
) {
  const pack = getSeedPack(seedPackKey);
  const product = pack.products.find(
    (item) => item.categorySlug === categorySlug && item.slug === productSlug,
  );

  if (!product) {
    return null;
  }

  const relatedProducts = pack.products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 2)
    .map((item, index) => ({
      id: index + 1,
      nameEn: item.nameEn,
      slug: item.slug,
      categorySlug: item.categorySlug,
    }));

  return buildProductDetailViewModel({
    product: {
      nameEn: product.nameEn,
      showDownloadButton: true,
    },
    shortDescriptionEn: product.shortDescriptionEn,
    pdfUrl: "#",
    defaultFields: mapDefaultFields(product),
    customFields: mapCustomFields(product),
    faqs: [
      {
        question: "Can you support OEM drawings?",
        answer: "Yes. We can quote based on drawings, samples, and target tolerances.",
      },
      {
        question: "Do you support export shipping?",
        answer: "Yes. The demo pack assumes export-ready packaging and documentation support.",
      },
    ],
    relatedProducts,
  });
}

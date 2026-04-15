import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { defaultFieldDefinitions } from "@/db/seed";
import { buildAssetFolderOptions } from "@/features/media/folders";
import { listAssetFolders, listMediaAssets } from "@/features/media/queries";
import { getFeatureGate } from "@/features/plans/access";
import { saveCategory, saveProduct } from "@/features/products/actions";
import { listAdminCategories } from "@/features/products/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

export default async function AdminNewProductPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const [categories, imageAssets, fileAssets, imageFolders, productAiGate] = await Promise.all([
    listAdminCategories(currentSite.seedPackKey, currentSite.id),
    listMediaAssets("image"),
    listMediaAssets("file"),
    listAssetFolders("image").catch(() => []),
    getFeatureGate("ai_product_copy", currentSite.plan, currentSite.id),
  ]);

  return (
    <ProductEditorForm
      action={saveProduct}
      categories={categories.map((category) => ({
        id: category.id,
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        slug: category.slug,
      }))}
      description="新建产品资料，管理媒体文件、规格参数与下载文件，便于后续统一维护。"
      fileAssets={fileAssets.map((asset) => ({
        id: asset.id,
        fileName: asset.fileName,
        url: asset.url,
        folderId: asset.folderId,
        altTextZh: asset.altTextZh,
        altTextEn: asset.altTextEn,
      }))}
      heading="新建产品"
      imageAssets={imageAssets.map((asset) => ({
        id: asset.id,
        fileName: asset.fileName,
        url: asset.url,
        folderId: asset.folderId,
        altTextZh: asset.altTextZh,
        altTextEn: asset.altTextEn,
      }))}
      imageFolders={buildAssetFolderOptions(imageFolders)}
      productAiGate={productAiGate}
      product={{
        categoryId: categories[0]?.id ?? null,
        nameZh: "",
        nameEn: "",
        slug: "",
        shortDescriptionZh: "",
        shortDescriptionEn: "",
        detailsZh: "",
        detailsEn: "",
        seoTitle: "",
        seoDescription: "",
        sortOrder: 100,
        status: "draft",
        isFeatured: false,
        showInquiryButton: true,
        showWhatsappButton: true,
        showPdfDownload: false,
        coverMediaId: null,
        pdfFileId: null,
        galleryMediaIds: [],
        defaultFields: defaultFieldDefinitions.map((field) => ({
          fieldKey: field.fieldKey,
          labelZh: field.labelZh,
          labelEn: field.labelEn,
          valueZh: "",
          valueEn: "",
          isVisible: field.isVisibleByDefault,
        })),
        customFields: [],
      }}
      returnTo="/admin/products/new"
      saveCategoryAction={saveCategory}
      submitLabel="创建产品"
    />
  );
}

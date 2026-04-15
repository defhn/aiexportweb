import { notFound } from "next/navigation";

import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { buildAssetFolderOptions } from "@/features/media/folders";
import { listAssetFolders, listMediaAssets } from "@/features/media/queries";
import { getFeatureGate } from "@/features/plans/access";
import { saveCategory, saveProduct } from "@/features/products/actions";
import { getProductById, listAdminCategories } from "@/features/products/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

type AdminProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);
  const currentSite = await getCurrentSiteFromRequest();

  if (!Number.isFinite(productId)) {
    notFound();
  }

  const [product, categories, imageAssets, fileAssets, imageFolders, productAiGate] = await Promise.all([
    getProductById(productId, currentSite.seedPackKey, currentSite.id),
    listAdminCategories(currentSite.seedPackKey, currentSite.id),
    listMediaAssets("image"),
    listMediaAssets("file"),
    listAssetFolders("image").catch(() => []),
    getFeatureGate("ai_product_copy", currentSite.plan, currentSite.id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <ProductEditorForm
      action={saveProduct}
      categories={categories.map((category) => ({
        id: category.id,
        nameZh: category.nameZh,
        nameEn: category.nameEn,
        slug: category.slug,
      }))}
      description="编辑产品资料、媒体文件、规格参数与 SEO 信息，保存后会更新当前产品内容。"
      fileAssets={fileAssets.map((asset) => ({
        id: asset.id,
        fileName: asset.fileName,
        url: asset.url,
        folderId: asset.folderId,
        altTextZh: asset.altTextZh,
        altTextEn: asset.altTextEn,
      }))}
      heading="编辑产品"
      imageAssets={imageAssets.map((asset) => ({
        id: asset.id,
        fileName: asset.fileName,
        url: asset.url,
        folderId: asset.folderId,
        altTextZh: asset.altTextZh,
        altTextEn: asset.altTextEn,
      }))}
      imageFolders={buildAssetFolderOptions(imageFolders)}
      product={product}
      productAiGate={productAiGate}
      returnTo={`/admin/products/${productId}`}
      saveCategoryAction={saveCategory}
      submitLabel="保存产品"
    />
  );
}

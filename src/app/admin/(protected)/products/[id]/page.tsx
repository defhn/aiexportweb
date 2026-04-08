import { notFound } from "next/navigation";

import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { buildAssetFolderOptions } from "@/features/media/folders";
import { listAssetFolders, listMediaAssets } from "@/features/media/queries";
import { getFeatureGate } from "@/features/plans/access";
import { saveCategory, saveProduct } from "@/features/products/actions";
import { getProductById, listAdminCategories } from "@/features/products/queries";

type AdminProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  if (!Number.isFinite(productId)) {
    notFound();
  }

  const [product, categories, imageAssets, fileAssets, imageFolders, productAiGate] = await Promise.all([
    getProductById(productId),
    listAdminCategories(),
    listMediaAssets("image"),
    listMediaAssets("file"),
    listAssetFolders("image").catch(() => []),
    getFeatureGate("ai_product_copy"),
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
      description="保存后会同步更新公开产品页、分类页以及首页推荐模块中的内容。"
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

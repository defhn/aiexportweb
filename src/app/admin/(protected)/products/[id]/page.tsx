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
      description="娣囨繂鐡ㄩ崥搴濈窗閸氬本顒為弴瀛樻煀閸忣剙绱戞禍褍鎼фい鐐光偓浣稿瀻缁銆夋禒銉ュ挤妫ｆ牠銆夐幒銊ㄥ礃濡€虫健娑擃厾娈戦崘鍛啇閵嗭拷"
      fileAssets={fileAssets.map((asset) => ({
        id: asset.id,
        fileName: asset.fileName,
        url: asset.url,
        folderId: asset.folderId,
        altTextZh: asset.altTextZh,
        altTextEn: asset.altTextEn,
      }))}
      heading="缂傛牞绶禍褍鎼�"
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
      submitLabel="娣囨繂鐡ㄦ禍褍鎼�"
    />
  );
}

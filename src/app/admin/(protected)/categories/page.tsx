import { Layers } from "lucide-react";

import { buildAssetFolderOptions } from "@/features/media/folders";
import { listAssetFolders, listMediaAssets } from "@/features/media/queries";
import { listAdminCategories } from "@/features/products/queries";

import {
  BulkActionsBar,
  CategoryRow,
  NewCategoryPanel,
} from "./_components";

export default async function AdminCategoriesPage() {
  const [categories, imageAssets, imageFolders] = await Promise.all([
    listAdminCategories(),
    listMediaAssets("image"),
    listAssetFolders("image").catch(() => []),
  ]);

  const mappedImageAssets = imageAssets.map((a) => ({
    id: a.id,
    fileName: a.fileName,
    url: a.url,
    folderId: a.folderId,
    altTextZh: a.altTextZh,
    altTextEn: a.altTextEn,
  }));
  const mappedImageFolders = buildAssetFolderOptions(imageFolders);
  const bulkFormId = "categories-bulk-form";

  // mediaId → url 映射，用于缩略图展示
  const assetUrlMap = new Map(mappedImageAssets.map((a) => [a.id, a.url]));
  const nextSortOrder =
    categories.length > 0
      ? (categories[categories.length - 1]?.sortOrder ?? 0) + 10
      : 10;

  return (
    <div className="space-y-4">
      {/* 页头 */}
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-stone-400">
          <Layers className="h-3 w-3" />
          Categories
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">产品分类</h1>
        <p className="mt-1 text-sm text-stone-500">
          共 {categories.length} 个分类 · 鼠标悬停行尾点铅笔图标展开编辑
        </p>
      </div>

      {/* 新建分类（折叠面板） */}
      <NewCategoryPanel
        imageAssets={mappedImageAssets}
        imageFolders={mappedImageFolders}
        nextSortOrder={nextSortOrder}
      />

      {/* 批量操作栏 */}
      {categories.length > 0 ? <BulkActionsBar bulkFormId={bulkFormId} /> : null}

      {/* 分类列表表格 */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/80">
              <th className="w-8 px-3 py-2.5" />
              <th className="w-10 px-2 py-2.5" />
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                分类名称
              </th>
              <th className="hidden px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 md:table-cell">
                Slug
              </th>
              <th className="hidden w-16 px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-stone-500 md:table-cell">
                排序
              </th>
              <th className="hidden px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 md:table-cell">
                状态
              </th>
              <th className="w-20 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-stone-400">
                  还没有分类，点击上方「新建分类」开始添加。
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  bulkFormId={bulkFormId}
                  category={category}
                  coverUrl={
                    category.imageMediaId
                      ? assetUrlMap.get(category.imageMediaId)
                      : undefined
                  }
                  imageAssets={mappedImageAssets}
                  imageFolders={mappedImageFolders}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

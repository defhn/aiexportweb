import { Trash2 } from "lucide-react";

import { ImagePicker } from "@/components/admin/image-picker";
import { buildAssetFolderOptions } from "@/features/media/folders";
import { listAssetFolders, listMediaAssets } from "@/features/media/queries";
import { deleteCategory, saveCategory } from "@/features/products/actions";
import { listAdminCategories } from "@/features/products/queries";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

const textareaClassName = `${inputClassName} min-h-24`;

function CategoryCard({
  category,
  imageAssets,
  imageFolders,
}: {
  category: {
    id?: number;
    nameZh: string;
    nameEn: string;
    slug: string;
    summaryZh: string;
    summaryEn: string;
    imageMediaId?: number | null;
    sortOrder: number;
    isVisible: boolean;
    isFeatured: boolean;
  };
  imageAssets: Array<{
    id: number;
    fileName: string;
    url: string;
    folderId?: number | null;
    altTextZh?: string | null;
    altTextEn?: string | null;
  }>;
  imageFolders: Array<{ id: number; label: string }>;
}) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <form action={saveCategory} className="space-y-6">
        {category.id ? <input name="id" type="hidden" value={category.id} /> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-stone-700">
            分类名称（中文）
            <input className={inputClassName} defaultValue={category.nameZh} name="nameZh" required />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Category Name (EN)
            <input className={inputClassName} defaultValue={category.nameEn} name="nameEn" required />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Slug
            <input className={inputClassName} defaultValue={category.slug} name="slug" />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            排序
            <input className={inputClassName} defaultValue={category.sortOrder} name="sortOrder" type="number" />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            分类简介（中文）
            <textarea className={textareaClassName} defaultValue={category.summaryZh} name="summaryZh" />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Summary (EN)
            <textarea className={textareaClassName} defaultValue={category.summaryEn} name="summaryEn" />
          </label>
        </div>

        <ImagePicker
          assets={imageAssets}
          folders={imageFolders}
          label="分类图片"
          name="imageMediaId"
          selectedAssetId={category.imageMediaId}
        />

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-700">
          <label className="flex items-center gap-2">
            <input defaultChecked={category.isVisible} name="isVisible" type="checkbox" />
            前台显示
          </label>
          <label className="flex items-center gap-2">
            <input defaultChecked={category.isFeatured} name="isFeatured" type="checkbox" />
            设为推荐分类
          </label>
          <button className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white" type="submit">
            {category.id ? "保存分类" : "创建分类"}
          </button>
        </div>
      </form>

      {category.id ? (
        <form action={deleteCategory} className="mt-4 flex justify-end">
          <input type="hidden" name="id" value={category.id} />
          <button className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50" type="submit">
            <Trash2 className="h-4 w-4" />
            删除分类
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default async function AdminCategoriesPage() {
  const [categories, imageAssets, imageFolders] = await Promise.all([
    listAdminCategories(),
    listMediaAssets("image"),
    listAssetFolders("image").catch(() => []),
  ]);

  const mappedImageAssets = imageAssets.map((asset) => ({
    id: asset.id,
    fileName: asset.fileName,
    url: asset.url,
    folderId: asset.folderId,
    altTextZh: asset.altTextZh,
    altTextEn: asset.altTextEn,
  }));
  const mappedImageFolders = buildAssetFolderOptions(imageFolders);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">产品分类</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          在这里新增、编辑、排序和推荐分类，并直接从图库选择分类封面图。
        </p>
      </section>

      <CategoryCard
        category={{
          nameZh: "",
          nameEn: "",
          slug: "",
          summaryZh: "",
          summaryEn: "",
          imageMediaId: null,
          sortOrder: categories.length ? categories[categories.length - 1]!.sortOrder + 10 : 10,
          isVisible: true,
          isFeatured: false,
        }}
        imageAssets={mappedImageAssets}
        imageFolders={mappedImageFolders}
      />

      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} imageAssets={mappedImageAssets} imageFolders={mappedImageFolders} />
        ))}
      </div>
    </div>
  );
}

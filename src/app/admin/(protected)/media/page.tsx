import { Search } from "lucide-react";

import { AssetFolderSidebar } from "@/components/admin/asset-folder-sidebar";
import { AssetUploadPanel } from "@/components/admin/asset-upload-panel";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import {
  deleteAssetFolder,
  deleteMediaAsset,
  saveAssetFolder,
  saveMediaAssetMeta,
} from "@/features/media/actions";
import {
  buildAssetFolderBreadcrumbs,
  buildAssetFolderOptions,
  buildAssetFolderTree,
} from "@/features/media/folders";
import { listAssetFolders, listMediaAssets } from "@/features/media/queries";

const inputClassName =
  "mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

type AdminMediaPageProps = {
  searchParams?: Promise<{
    q?: string;
    folder?: string;
    saved?: string;
    deleted?: string;
    error?: string;
    folderSaved?: string;
    folderDeleted?: string;
    folderError?: string;
  }>;
};

function buildReturnPath(folderId: number | null, query?: string) {
  const params = new URLSearchParams();

  if (typeof folderId === "number") {
    params.set("folder", String(folderId));
  }

  if (query?.trim()) {
    params.set("q", query.trim());
  }

  const search = params.toString();
  return search ? `/admin/media?${search}` : "/admin/media";
}

export default async function AdminMediaPage({ searchParams }: AdminMediaPageProps) {
  const params = (await searchParams) ?? {};
  const parsedFolderId = Number.parseInt(params.folder ?? "", 10);
  const selectedFolderId = Number.isFinite(parsedFolderId) ? parsedFolderId : null;
  const [folders, images] = await Promise.all([
    listAssetFolders("image").catch(() => []),
    listMediaAssets("image", {
      query: params.q,
      folderId: selectedFolderId,
      includeDescendants: true,
      rootOnlyWhenNoFolder: true,
    }),
  ]);
  const folderTree = buildAssetFolderTree(folders);
  const breadcrumbs = buildAssetFolderBreadcrumbs(folders, selectedFolderId);
  const folderOptions = buildAssetFolderOptions(folders);
  const returnTo = buildReturnPath(selectedFolderId, params.q);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">图库管理</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          支持无限级文件夹、就地新建、按目录筛选，以及更紧凑的素材网格。博客、产品、分类封面都可以复用这里的图片。
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {params.saved ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">图片信息已保存</p>
          ) : null}
          {params.deleted ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">素材已删除</p>
          ) : null}
          {params.folderSaved ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">文件夹已保存</p>
          ) : null}
          {params.folderDeleted ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">文件夹已删除</p>
          ) : null}
          {params.error === "in-use" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">当前素材仍在被引用，请先解绑再删除</p>
          ) : null}
          {params.folderError === "not-empty" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">当前文件夹下还有子文件夹或素材，暂时不能删除</p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <AssetFolderSidebar
          basePath="/admin/media"
          breadcrumbs={breadcrumbs}
          currentFolderId={selectedFolderId}
          tree={folderTree}
          createFolderAction={
            <div className="space-y-3">
              <form action={saveAssetFolder} className="space-y-3">
                <input name="assetType" type="hidden" value="image" />
                <input name="parentId" type="hidden" value={selectedFolderId ?? ""} />
                <input name="returnTo" type="hidden" value={returnTo} />
                <input className={inputClassName} name="name" placeholder="新建文件夹名称" required />
                <button className="w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white" type="submit">
                  在当前目录新建
                </button>
              </form>
              {selectedFolderId ? (
                <form action={deleteAssetFolder}>
                  <input name="assetType" type="hidden" value="image" />
                  <input name="id" type="hidden" value={selectedFolderId} />
                  <input name="returnTo" type="hidden" value="/admin/media" />
                  <button className="w-full rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600" type="submit">
                    删除当前文件夹
                  </button>
                </form>
              ) : null}
            </div>
          }
        />

        <div className="space-y-6">
          <AssetUploadPanel
            accept="image/*"
            buttonLabel="上传图片"
            description="上传到当前文件夹。产品主图、博客插图、分类封面都可以直接复用。"
            endpoint="/api/uploads/image"
            folderId={selectedFolderId}
            title="上传图片素材"
          />

          <form className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <label className="relative block">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  className="h-12 w-full rounded-xl border border-stone-300 pl-12 pr-4 text-sm"
                  defaultValue={params.q}
                  name="q"
                  placeholder="搜索文件名或 Alt 文案"
                />
                {selectedFolderId ? <input name="folder" type="hidden" value={selectedFolderId} /> : null}
              </label>
              <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white" type="submit">
                筛选素材
              </button>
            </div>
          </form>

          <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-950">图片素材</h3>
                <p className="mt-1 text-sm text-stone-500">
                  当前目录与子目录共 {images.length} 张图片
                </p>
              </div>
            </div>

            {images.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {images.map((asset) => (
                  <article key={asset.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                    <div className="aspect-square bg-stone-100">
                      <img
                        alt={asset.altTextEn || asset.fileName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        src={asset.url}
                      />
                    </div>

                    <div className="space-y-3 p-3">
                      <input name="id" type="hidden" value={asset.id} />
                      <div>
                        <p className="truncate text-sm font-semibold text-stone-900">{asset.fileName}</p>
                        <p className="mt-1 text-xs text-stone-500">
                          {asset.mimeType}
                          {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}
                        </p>
                      </div>

                      <form action={saveMediaAssetMeta} className="space-y-3">
                        <input name="id" type="hidden" value={asset.id} />
                        <input name="returnTo" type="hidden" value={returnTo} />
                        <label className="block text-xs font-medium text-stone-600">
                          文件名
                          <input className={inputClassName} defaultValue={asset.fileName} name="fileName" required />
                        </label>
                        <label className="block text-xs font-medium text-stone-600">
                          Alt（中文）
                          <input className={inputClassName} defaultValue={asset.altTextZh ?? ""} name="altTextZh" />
                        </label>
                        <label className="block text-xs font-medium text-stone-600">
                          Alt（英文）
                          <input className={inputClassName} defaultValue={asset.altTextEn ?? ""} name="altTextEn" />
                        </label>
                        <label className="block text-xs font-medium text-stone-600">
                          所在文件夹
                          <select className={inputClassName} defaultValue={asset.folderId ?? ""} name="folderId">
                            <option value="">根目录</option>
                            {folderOptions.map((folder) => (
                              <option key={folder.id} value={folder.id}>
                                {folder.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <CopyLinkButton value={asset.url} />
                          <button className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700" type="submit">
                            保存
                          </button>
                        </div>
                      </form>

                      <div className="flex justify-end">
                        <form action={deleteMediaAsset}>
                          <input name="id" type="hidden" value={asset.id} />
                          <input name="returnTo" type="hidden" value={returnTo} />
                          <button className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600" type="submit">
                            删除
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
                当前目录下还没有图片素材。
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

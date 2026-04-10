import { Search } from "lucide-react";

import { AssetFolderSidebar } from "@/components/admin/asset-folder-sidebar";
import { AssetUploadPanel } from "@/components/admin/asset-upload-panel";
import { MediaAssetCard } from "@/components/admin/media-asset-card";
import {
  bulkDeleteMediaAssets,
  bulkMoveMediaAssets,
  deleteAssetFolder,
  purgeBrokenMediaAssets,
  saveAssetFolder,
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
    skipped?: string;
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
  const folders = await listAssetFolders("image").catch(() => []);
  const images = await listMediaAssets("image", {
    query: params.q,
    folderId: selectedFolderId,
    includeDescendants: true,
    // 涓嶅姞 rootOnlyWhenNoFolder锛氬叏閮ㄧ礌鏉愭椂灞曠ず鎵€鏈夊浘鐗?    folderRows: folders,
  });
  const folderTree = buildAssetFolderTree(folders);
  const breadcrumbs = buildAssetFolderBreadcrumbs(folders, selectedFolderId);
  const folderOptions = buildAssetFolderOptions(folders);
  const returnTo = buildReturnPath(selectedFolderId, params.q);
  const bulkFormId = "media-bulk-form";

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">图片素材管理</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          支持文件夹管理、当前目录上传和按目录筛选，产品主图、博客插图和分类封面都可以复用这里的素材。        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {params.saved ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">图片信息已保存。</p>
          ) : null}
          {params.deleted ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">
              已删除 {params.deleted} 张图片。            </p>
          ) : null}
          {params.skipped ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">
              有 {params.skipped} 张图片删除失败，请稍后重试。            </p>
          ) : null}
          {params.folderSaved ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">鏂囦欢澶瑰凡淇濆瓨</p>
          ) : null}
          {params.folderDeleted ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">鏂囦欢澶瑰凡鍒犻櫎</p>
          ) : null}

          {params.error === "delete-failed" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">
              删除图片时网络连接失败，请重试一次。            </p>
          ) : null}
          {params.error === "no-selection" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">
              璇峰厛鍕鹃€夎鍒犻櫎鎴栫Щ鍔ㄧ殑鍥剧墖
            </p>
          ) : null}
          {params.folderError === "not-empty" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">
              当前文件夹下仍有子文件夹或图片，暂时不能删除。            </p>
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
                <button
                  className="w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                  type="submit"
                >
                  在当前目录新建                </button>
              </form>
              {selectedFolderId ? (
                <form action={deleteAssetFolder}>
                  <input name="assetType" type="hidden" value="image" />
                  <input name="id" type="hidden" value={selectedFolderId} />
                  <input name="returnTo" type="hidden" value="/admin/media" />
                  <button
                    className="w-full rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                    type="submit"
                  >
                    删除当前文件夹                  </button>
                </form>
              ) : null}
            </div>
          }
        />

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-stone-200 bg-white px-6 py-4 shadow-sm">
            <div>
              <p className="text-sm font-medium text-stone-900">鍥剧墖绱犳潗</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {selectedFolderId
                  ? `当前目录共 ${images.length} 张图片`
                  : `全部 ${images.length} 张图片`}
              </p>
            </div>
            <AssetUploadPanel
              accept="image/*"
              buttonLabel="上传图片"
              endpoint="/api/uploads/image"
              folderId={selectedFolderId}
              folderOptions={folderOptions}
            />
          </div>

          <form className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <label className="relative block">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  className="h-12 w-full rounded-xl border border-stone-300 pl-12 pr-4 text-sm"
                  defaultValue={params.q}
                  name="q"
                  placeholder="搜索文件名或中英文名称"
                />
                {selectedFolderId ? <input name="folder" type="hidden" value={selectedFolderId} /> : null}
              </label>
              <button
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
                type="submit"
              >
                筛选图片              </button>
            </div>
          </form>

          <section className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-950">鍥剧墖绱犳潗</h3>
                <p className="mt-1 text-sm text-stone-500">
                  {selectedFolderId
                    ? `当前文件夹及子目录共 ${images.length} 张图片`
                    : params.q
                    ? `搜索结果共 ${images.length} 张图片`
                    : `根目录共 ${images.length} 张图片（点击左侧文件夹查看子目录）`}
                </p>
              </div>
            </div>

            {images.length ? (
              <form
                id={bulkFormId}
                action={bulkMoveMediaAssets}
                className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
              >
                <input name="returnTo" type="hidden" value={returnTo} />
                <span className="text-xs text-stone-500 font-medium">鎵归噺鎿嶄綔锛堝嬀閫夊浘鐗囧悗锛夛細</span>
                <select
                  className="rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  defaultValue={selectedFolderId ?? ""}
                  name="targetFolderId"
                >
                  <option value="">绉诲姩鍒版牴鐩綍</option>
                  {folderOptions.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.label}
                    </option>
                  ))}
                </select>
                <button
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                  formAction={bulkMoveMediaAssets}
                  type="submit"
                >
                  鎵归噺绉诲姩
                </button>
                <button
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                  formAction={bulkDeleteMediaAssets}
                  type="submit"
                >
                  鎵归噺鍒犻櫎
                </button>
              </form>
            ) : null}

            {/* 娓呯悊 404 鐮存崯鍥剧墖 鈥?濮嬬粓鏄剧ず */}
            <form
              action={async () => {
                "use server";
                await purgeBrokenMediaAssets();
              }}
              className="mb-4"
            >
              <button
                className="rounded-full border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50"
                type="submit"
              >
                清理 404 图片
              </button>
            </form>

            {images.length ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {images.map((asset) => (
                  <MediaAssetCard
                    key={asset.id}
                    asset={asset}
                    bulkFormId={bulkFormId}
                    folderOptions={folderOptions}
                    returnTo={returnTo}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
                  当前目录下还没有图片素材。              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

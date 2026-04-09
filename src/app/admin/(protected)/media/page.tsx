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
        <h2 className="text-2xl font-semibold text-stone-950">鍥惧簱绠＄悊</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          鏀寔鏃犻檺绾ф枃浠跺す銆佸綋鍓嶇洰褰曚笂浼犮€佹寜鏂囦欢澶圭瓫閫夛紝浠ュ強鏇撮珮瀵嗗害鐨勫浘鐗囩礌鏉愬崱鐗囥€?          浜у搧涓诲浘銆佸崥瀹㈡彃鍥俱€佸垎绫诲皝闈㈤兘鍙互澶嶇敤杩欓噷鐨勭礌鏉愩€?        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {params.saved ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">鍥剧墖淇℃伅宸蹭繚瀛?/p>
          ) : null}
          {params.deleted ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">
              宸插垹闄?{params.deleted} 寮犲浘鐗?            </p>
          ) : null}
          {params.skipped ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">
              鏈?{params.skipped} 寮犲浘鐗囧垹闄ゆ椂鍙戠敓閿欒锛岃绋嶅悗閲嶈瘯銆?            </p>
          ) : null}
          {params.folderSaved ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">鏂囦欢澶瑰凡淇濆瓨</p>
          ) : null}
          {params.folderDeleted ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">鏂囦欢澶瑰凡鍒犻櫎</p>
          ) : null}

          {params.error === "delete-failed" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">
              鍒犻櫎鍥剧墖鏃剁綉缁滆繛鎺ュけ璐ワ紝璇烽噸璇曚竴娆°€?            </p>
          ) : null}
          {params.error === "no-selection" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">
              璇峰厛鍕鹃€夎鍒犻櫎鎴栫Щ鍔ㄧ殑鍥剧墖
            </p>
          ) : null}
          {params.folderError === "not-empty" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">
              褰撳墠鏂囦欢澶逛笅杩樻湁瀛愭枃浠跺す鎴栧浘鐗囷紝鏆傛椂涓嶈兘鍒犻櫎銆?            </p>
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
                <input className={inputClassName} name="name" placeholder="鏂板缓鏂囦欢澶瑰悕绉? required />
                <button
                  className="w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                  type="submit"
                >
                  鍦ㄥ綋鍓嶇洰褰曟柊寤?                </button>
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
                    鍒犻櫎褰撳墠鏂囦欢澶?                  </button>
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
                  ? `褰撳墠鐩綍鍏?${images.length} 寮燻
                  : `鍏ㄩ儴 ${images.length} 寮燻}
              </p>
            </div>
            <AssetUploadPanel
              accept="image/*"
              buttonLabel="涓婁紶鍥剧墖"
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
                  placeholder="鎼滅储鏂囦欢鍚嶆垨涓嫳鏂囧悕绉?
                />
                {selectedFolderId ? <input name="folder" type="hidden" value={selectedFolderId} /> : null}
              </label>
              <button
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
                type="submit"
              >
                绛涢€夊浘鐗?              </button>
            </div>
          </form>

          <section className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-stone-950">鍥剧墖绱犳潗</h3>
                <p className="mt-1 text-sm text-stone-500">
                  {selectedFolderId
                    ? `褰撳墠鏂囦欢澶瑰強瀛愮洰褰曞叡 ${images.length} 寮犲浘鐗嘸
                    : params.q
                    ? `鎼滅储缁撴灉鍏?${images.length} 寮犲浘鐗嘸
                    : `鏍圭洰褰曞叡 ${images.length} 寮犲浘鐗囷紙鐐瑰嚮宸︿晶鏂囦欢澶规煡鐪嬪瓙鐩綍锛塦}
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
                馃Ч 娓呯悊 404 鍥剧墖
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
                褰撳墠鐩綍涓嬭繕娌℃湁鍥剧墖绱犳潗銆?              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

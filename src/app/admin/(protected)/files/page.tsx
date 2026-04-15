import { Search } from "lucide-react";

import { AssetFolderSidebar } from "@/components/admin/asset-folder-sidebar";
import { AssetUploadPanel } from "@/components/admin/asset-upload-panel";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import {
  bulkDeleteMediaAssets,
  bulkMoveMediaAssets,
  deleteAssetFolder,
  deleteDownloadFile,
  deleteMediaAsset,
  saveAssetFolder,
  saveDownloadFile,
  saveMediaAssetMeta,
} from "@/features/media/actions";
import {
  buildAssetFolderBreadcrumbs,
  buildAssetFolderOptions,
  buildAssetFolderTree,
} from "@/features/media/folders";
import { listAssetFolders, listDownloadFiles, listMediaAssets } from "@/features/media/queries";
import { listAdminProducts } from "@/features/products/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

const inputClassName =
  "mt-2 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

type AdminFilesPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    language?: string;
    folder?: string;
    saved?: string;
    deleted?: string;
    error?: string;
    folderSaved?: string;
    folderDeleted?: string;
    folderError?: string;
  }>;
};

function buildReturnPath(folderId: number | null, query?: string, category?: string, language?: string) {
  const params = new URLSearchParams();

  if (typeof folderId === "number") {
    params.set("folder", String(folderId));
  }

  if (query?.trim()) {
    params.set("q", query.trim());
  }

  if (category?.trim()) {
    params.set("category", category.trim());
  }

  if (language?.trim()) {
    params.set("language", language.trim());
  }

  const search = params.toString();
  return search ? `/admin/files?${search}` : "/admin/files";
}

export default async function AdminFilesPage({ searchParams }: AdminFilesPageProps) {
  const params = (await searchParams) ?? {};
  const currentSite = await getCurrentSiteFromRequest();
  const parsedFolderId = Number.parseInt(params.folder ?? "", 10);
  const selectedFolderId = Number.isFinite(parsedFolderId) ? parsedFolderId : null;
  const folders = await listAssetFolders("file").catch(() => []);
  const [fileAssets, downloadFiles, products] = await Promise.all([
    listMediaAssets("file", {
      query: params.q,
      folderId: selectedFolderId,
      includeDescendants: true,
      // rootOnlyWhenNoFolder: 无文件夹参数时仅显示根目录文件
      folderRows: folders,
    }),
    listDownloadFiles({
      query: params.q,
      category: params.category,
      language: params.language,
      folderId: selectedFolderId,
      includeDescendants: true,
      // rootOnlyWhenNoFolder: 无文件夹参数时仅显示根目录文件
      folderRows: folders,
    }),
    listAdminProducts(currentSite.seedPackKey, undefined, currentSite.id),
  ]);
  const folderTree = buildAssetFolderTree(folders);
  const breadcrumbs = buildAssetFolderBreadcrumbs(folders, selectedFolderId);
  const folderOptions = buildAssetFolderOptions(folders);
  const returnTo = buildReturnPath(selectedFolderId, params.q, params.category, params.language);
  const bulkFormId = "file-assets-bulk-form";

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">文件资料管理</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">
          管理 PDF、Word、Excel、ZIP 等文件素材，维护下载记录、分类、语言和可见性。        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {params.saved ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">内容已保存。</p>
          ) : null}
          {params.deleted ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700">记录已删除。</p>
          ) : null}
          {params.folderSaved ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">文件夹已保存。</p>
          ) : null}
          {params.folderDeleted ? (
            <p className="rounded-2xl bg-blue-50 px-4 py-2 text-blue-700">文件夹已删除。</p>
          ) : null}
          {params.error === "in-use" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">当前文件夹仍被文件使用，请先移动或删除关联记录后再试。</p>
          ) : null}
          {params.folderError === "not-empty" ? (
            <p className="rounded-2xl bg-amber-50 px-4 py-2 text-amber-700">当前文件夹不为空，请先清理其中的文件和子文件夹后再删除。</p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <AssetFolderSidebar
          basePath="/admin/files"
          breadcrumbs={breadcrumbs}
          currentFolderId={selectedFolderId}
          tree={folderTree}
          createFolderAction={
            <div className="space-y-3">
              <form action={saveAssetFolder} className="space-y-3">
                <input name="assetType" type="hidden" value="file" />
                <input name="parentId" type="hidden" value={selectedFolderId ?? ""} />
                <input name="returnTo" type="hidden" value={returnTo} />
                <input className={inputClassName} name="name" placeholder="文件夹名称" required />
                <button className="w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white" type="submit">
                  新建子文件夹                </button>
              </form>
              {selectedFolderId ? (
                <form action={deleteAssetFolder}>
                  <input name="assetType" type="hidden" value="file" />
                  <input name="id" type="hidden" value={selectedFolderId} />
                  <input name="returnTo" type="hidden" value="/admin/files" />
                  <button className="w-full rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600" type="submit">
                    删除当前文件夹                  </button>
                </form>
              ) : null}
            </div>
          }
        />

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-stone-950">文件素材库</h3>
              <p className="mt-1 text-sm text-stone-500">
                {selectedFolderId
                  ? `当前文件夹及子文件夹中共有 ${fileAssets.length} 个文件素材。`
                  : `全部文件素材共 ${fileAssets.length} 个。`}
              </p>
            </div>
            <AssetUploadPanel
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip"
              buttonLabel="上传文件"
              endpoint="/api/uploads/file"
              folderId={selectedFolderId}
              folderOptions={folderOptions}
            />
          </div>

          <form className="grid gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-4">
            <label className="relative block md:col-span-2">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                className="h-12 w-full rounded-xl border border-stone-300 pl-12 pr-4 text-sm"
                defaultValue={params.q}
                name="q"
                placeholder="搜索文件名、类型或标签"
              />
            </label>
            <input
              className="rounded-xl border border-stone-300 px-4 py-3 text-sm"
              defaultValue={params.category}
              name="category"
              placeholder="分类，例如 datasheet"
            />
            <input
              className="rounded-xl border border-stone-300 px-4 py-3 text-sm"
              defaultValue={params.language}
              name="language"
              placeholder="语言，例如 en"
            />
            {selectedFolderId ? <input name="folder" type="hidden" value={selectedFolderId} /> : null}
            <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white md:col-span-4" type="submit">
              筛选文件素材            </button>
          </form>

          <form action={saveDownloadFile} className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm" data-testid="create-download-form">
            <h3 className="text-lg font-semibold text-stone-950">创建下载记录</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-700">
                选择关联文件
                <select className={inputClassName} defaultValue={fileAssets[0]?.id ?? ""} name="mediaAssetId">
                  <option value="">请选择文件素材</option>
                  {fileAssets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.fileName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-stone-700">
                关联产品
                <select className={inputClassName} defaultValue="" name="productId">
                  <option value="">不关联具体产品</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nameZh} / {product.nameEn}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-stone-700">
                文件名（中文）
                <input className={inputClassName} name="displayNameZh" required />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                File Name (EN)
                <input className={inputClassName} name="displayNameEn" required />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                分类
                <input className={inputClassName} name="category" placeholder="datasheet / brochure / report" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                语言
                <input className={inputClassName} defaultValue="en" name="language" placeholder="en" />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                描述
                <textarea className={`${inputClassName} min-h-24`} name="description" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                排序
                <input className={inputClassName} defaultValue={100} name="sortOrder" type="number" />
              </label>
              <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-stone-700">
                <input defaultChecked name="isVisible" type="checkbox" />
                公开显示
              </label>
            </div>
            <div className="mt-5 flex justify-end">
              <button className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white" type="submit">
                创建下载记录
              </button>
            </div>
          </form>

          <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            {fileAssets.length ? (
              <form
                id={bulkFormId}
                className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
              >
                <input name="returnTo" type="hidden" value={returnTo} />
                <select
                  className="rounded-xl border border-stone-300 px-3 py-2 text-sm"
                  defaultValue={selectedFolderId ?? ""}
                  name="targetFolderId"
                >
                  <option value="">选择目标文件夹</option>
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
                  移动到文件夹
                </button>
                <button
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                  formAction={bulkDeleteMediaAssets}
                  type="submit"
                >
                  批量删除
                </button>
              </form>
            ) : null}

            <div className="divide-y divide-stone-100">
              {fileAssets.length ? (
                fileAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center gap-3 py-2.5 px-1">
                    {/* 批量操作复选框 */}
                    <input
                      className="h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-600/20 shrink-0"
                      form={bulkFormId}
                      name="selectedIds"
                      type="checkbox"
                      value={asset.id}
                    />

                    {/* 閺傚洣娆㈡穱鈩冧紖 */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900">{asset.fileName}</p>
                      <p className="text-xs text-stone-400">
                        {asset.mimeType} &middot; {(asset.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    {/* 閹垮秳缍旈幐澶愬灔 */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <CopyLinkButton compact value={asset.url} />
                      <form action={deleteMediaAsset} className="contents">
                        <input name="id" type="hidden" value={asset.id} />
                        <input name="returnTo" type="hidden" value={returnTo} />
                        <button
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                          title="删除文件"
                          type="submit"
                        >
                          <span className="text-xs">删</span>
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
                  当前没有可显示的文件素材。                </div>
              )}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">下载记录</h3>
            <div className="mt-5 space-y-4">
              {downloadFiles.length ? (
                downloadFiles.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-stone-200 p-4">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-stone-950">{record.displayNameEn}</p>
                        <p className="mt-1 text-sm text-stone-600">{record.displayNameZh}</p>
                        <p className="mt-2 text-xs leading-5 text-stone-500">{`文件素材：${record.fileName}`}</p>
                        <p className="mt-1 text-xs leading-5 text-stone-500">
                          {record.productNameZh ? `关联产品： ${record.productNameZh} / ${record.productNameEn}` : "未关联具体产品"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-stone-500">
                          {`分类：${record.category || "未分类"} / 语言：${record.language || "未设置"}`}
                        </p>
                      </div>
                      <a
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                        href={record.fileUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        下载文件
                      </a>
                    </div>

                    <form action={saveDownloadFile} className="grid gap-4 md:grid-cols-2">
                      <input name="id" type="hidden" value={record.id} />
                      <label className="block text-sm font-medium text-stone-700">
                        文件素材
                        <select className={inputClassName} defaultValue={record.mediaAssetId} name="mediaAssetId">
                          {fileAssets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.fileName}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-medium text-stone-700">
                        关联产品
                        <select className={inputClassName} defaultValue={record.productId ?? ""} name="productId">
                          <option value="">不关联具体产品</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.nameZh} / {product.nameEn}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-medium text-stone-700">
                        文件名（中文）
                        <input className={inputClassName} defaultValue={record.displayNameZh} name="displayNameZh" required />
                      </label>
                      <label className="block text-sm font-medium text-stone-700">
                        File Name (EN)
                        <input className={inputClassName} defaultValue={record.displayNameEn} name="displayNameEn" required />
                      </label>
                      <label className="block text-sm font-medium text-stone-700">
                        分类
                        <input className={inputClassName} defaultValue={record.category ?? ""} name="category" />
                      </label>
                      <label className="block text-sm font-medium text-stone-700">
                        语言
                        <input className={inputClassName} defaultValue={record.language ?? ""} name="language" />
                      </label>
                      <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                        描述
                        <textarea className={`${inputClassName} min-h-24`} defaultValue={record.description ?? ""} name="description" />
                      </label>
                      <label className="block text-sm font-medium text-stone-700">
                        排序
                        <input className={inputClassName} defaultValue={record.sortOrder} name="sortOrder" type="number" />
                      </label>
                      <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-stone-700">
                        <input defaultChecked={record.isVisible} name="isVisible" type="checkbox" />
                        公开显示
                      </label>
                      <div className="flex justify-end md:col-span-2">
                        <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700" type="submit">
                          保存下载记录
                        </button>
                      </div>
                    </form>

                    <form action={deleteDownloadFile} className="mt-3 flex justify-end">
                      <input name="id" type="hidden" value={record.id} />
                      <button className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600" type="submit">
                        删除下载记录
                      </button>
                    </form>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
                  当前没有匹配条件的下载记录。                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

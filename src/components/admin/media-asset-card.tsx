"use client";

import { useState } from "react";
import { FolderInput, Pencil, Trash2, X, Check } from "lucide-react";

import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { deleteMediaAsset, saveMediaAssetMeta } from "@/features/media/actions";
import type { AssetFolderOption } from "@/features/media/folders";

type MediaAssetCardProps = {
  asset: {
    id: number;
    fileName: string;
    url: string;
    mimeType: string;
    width: number | null;
    height: number | null;
    altTextZh: string | null;
    altTextEn: string | null;
    folderId: number | null;
  };
  folderOptions: AssetFolderOption[];
  returnTo: string;
  bulkFormId?: string;
};

export function MediaAssetCard({
  asset,
  folderOptions,
  returnTo,
  bulkFormId,
}: MediaAssetCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <article className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* 閹靛綊鍣洪柅澶嬪 */}
      {bulkFormId ? (
        <div className="border-b border-stone-100 px-3 py-1.5">
          <label className="flex items-center gap-2 text-[11px] font-medium text-stone-500">
            <input
              className="h-3.5 w-3.5 rounded border-stone-300 text-blue-600 focus:ring-blue-600/20"
              form={bulkFormId}
              name="selectedIds"
              type="checkbox"
              value={asset.id}
            />
            闁瀚?
          </label>
        </div>
      ) : null}

      {/* 閸ュ墽澧栨０鍕潔 */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          alt={asset.altTextEn || asset.fileName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          src={asset.url}
        />
        {/* 閹剙浠犻幙宥勭稊鐏?*/}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyLinkButton compact label="复制链接" value={asset.url} />
          <button
            aria-label="缂傛牞绶穱鈩冧紖"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-stone-800 backdrop-blur-sm transition-colors hover:bg-white"
            onClick={() => setEditing((v) => !v)}
            title="缂傛牞绶穱鈩冧紖"
            type="button"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          {/* 閸掔娀娅庨幐澶愭尦閿涙氨瀚粩瀣€冮崡?*/}
          <form action={deleteMediaAsset} className="contents">
            <input name="id" type="hidden" value={asset.id} />
            <input name="returnTo" type="hidden" value={returnTo} />
            <button
              aria-label="閸掔娀娅庨崶鍓у"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/90 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
              title="閸掔娀娅庨崶鍓у"
              type="submit"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 閺傚洣娆㈤崥宥囆炵悰宀嬬礄婵绮撻弰鍓с仛閿?*/}
      <div className="px-3 py-2">
        <p className="truncate text-[12px] font-semibold text-stone-800" title={asset.fileName}>
          {asset.fileName}
        </p>
        <p className="truncate text-[10px] text-stone-400">
          {asset.mimeType}
          {asset.width && asset.height ? ` ${asset.width}x${asset.height}` : ""}
        </p>
      </div>

      {/* 鐏炴洖绱戠紓鏍帆闂堛垺婢橀敍鍫㈠仯閸戝鎼粭鏂挎禈閺嶅洤鎮楅弰鍓с仛閿?*/}
      {editing && (
        <form action={saveMediaAssetMeta} className="border-t border-stone-100 px-3 pb-3 pt-2 space-y-2">
          <input name="id" type="hidden" value={asset.id} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <input name="fileName" type="hidden" value={asset.fileName} />

          <label className="block">
            <span className="mb-0.5 block text-[10px] font-medium text-stone-400">中文 Alt</span>
            <input
              className="h-7 w-full rounded-lg border border-stone-200 px-2 text-xs text-stone-900 outline-none focus:border-blue-500"
              defaultValue={asset.altTextZh ?? ""}
              name="altTextZh"
            />
          </label>

          <label className="block">
            <span className="mb-0.5 block text-[10px] font-medium text-stone-400">英文 Alt</span>
            <input
              className="h-7 w-full rounded-lg border border-stone-200 px-2 text-xs text-stone-900 outline-none focus:border-blue-500"
              defaultValue={asset.altTextEn ?? ""}
              name="altTextEn"
            />
          </label>

          <label className="block">
            <span className="mb-0.5 block text-[10px] font-medium text-stone-400">所在文件夹</span>
            <select
              className="h-7 w-full rounded-lg border border-stone-200 px-2 text-xs text-stone-900 outline-none focus:border-blue-500"
              defaultValue={asset.folderId ?? ""}
              name="folderId"
            >
              <option value="">根目录</option>
              {folderOptions.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-2 pt-1">
            <button
              className="flex items-center gap-1 rounded-lg border border-stone-200 px-2.5 py-1 text-[11px] font-medium text-stone-600 hover:bg-stone-50"
              onClick={() => setEditing(false)}
              type="button"
            >
              <X className="h-3 w-3" /> 取消
            </button>
            <button
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-blue-700"
              type="submit"
            >
              <Check className="h-3 w-3" /> 保存
            </button>
          </div>
        </form>
      )}
    </article>
  );
}

import { FolderInput, Trash2 } from "lucide-react";

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

const inputClassName =
  "h-9 w-full rounded-lg border border-stone-300 px-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

export function MediaAssetCard({
  asset,
  folderOptions,
  returnTo,
  bulkFormId,
}: MediaAssetCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      {bulkFormId ? (
        <div className="border-b border-stone-100 px-3 py-2">
          <label className="flex items-center gap-2 text-xs font-medium text-stone-600">
            <input
              className="h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-600/20"
              form={bulkFormId}
              name="selectedIds"
              type="checkbox"
              value={asset.id}
            />
            选择
          </label>
        </div>
      ) : null}
      <div className="aspect-[4/3] bg-stone-100">
        <img
          alt={asset.altTextEn || asset.fileName}
          className="h-full w-full object-cover"
          loading="lazy"
          src={asset.url}
        />
      </div>

      <form action={saveMediaAssetMeta} className="space-y-3 p-3">
        <input name="id" type="hidden" value={asset.id} />
        <input name="returnTo" type="hidden" value={returnTo} />
        <input name="fileName" type="hidden" value={asset.fileName} />

        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-stone-900">{asset.fileName}</p>
            <p className="mt-1 truncate text-[11px] text-stone-500">
              {asset.mimeType}
              {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <CopyLinkButton compact label="复制链接" value={asset.url} />
            <button
              aria-label="移动到文件夹"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-300 text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
              title="移动到文件夹"
              type="submit"
            >
              <FolderInput className="h-4 w-4" />
            </button>
            <button
              aria-label="删除图片"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:border-red-500 hover:text-red-700"
              formAction={deleteMediaAsset}
              title="删除图片"
              type="submit"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-stone-500">中文名</span>
          <input
            aria-label="中文名"
            className={inputClassName}
            defaultValue={asset.altTextZh ?? ""}
            name="altTextZh"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-stone-500">英文名</span>
          <input
            aria-label="英文名"
            className={inputClassName}
            defaultValue={asset.altTextEn ?? ""}
            name="altTextEn"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[11px] font-medium text-stone-500">所在文件夹</span>
          <select
            aria-label="所在文件夹"
            className={inputClassName}
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
      </form>
    </article>
  );
}

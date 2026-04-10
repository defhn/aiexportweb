"use client";

import { useMemo, useState } from "react";
import { Check, FolderTree, ImageOff, X } from "lucide-react";

type Asset = {
  id: number;
  fileName: string;
  url: string;
  folderId?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
};

type FolderOption = { id: number; label: string };

type GalleryPickerProps = {
  assets: Asset[];
  folders?: FolderOption[];
  selectedIds: number[];
  name: string;
};

export function GalleryPicker({
  assets,
  folders = [],
  selectedIds: initialSelectedIds,
  name,
}: GalleryPickerProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(initialSelectedIds),
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFolderId, setActiveFolderId] = useState("");

  const filteredAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const folderId = activeFolderId ? Number.parseInt(activeFolderId, 10) : null;
    return assets.filter((asset) => {
      const matchesFolder = folderId ? asset.folderId === folderId : true;
      const matchesQuery =
        !normalized ||
        `${asset.fileName} ${asset.altTextZh ?? ""} ${asset.altTextEn ?? ""}`
          .toLowerCase()
          .includes(normalized);
      return matchesFolder && matchesQuery;
    });
  }, [activeFolderId, assets, query]);

  const selectedAssets = assets.filter((a) => selectedIds.has(a.id));

  function toggleId(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeId(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  return (
    <>
      {Array.from(selectedIds).map((id) => (
        <input key={id} name={name} type="hidden" value={id} />
      ))}

      <div className="flex flex-wrap items-center gap-2">
        {selectedAssets.map((asset) => (
          <div
            key={asset.id}
          className="group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
          >
            <img
              alt={asset.altTextEn || asset.fileName}
              className="h-full w-full object-cover"
              loading="lazy"
              src={asset.url}
              title={asset.fileName}
            />
            <button
              className="absolute inset-0 flex items-center justify-center bg-stone-900/60 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => removeId(asset.id)}
              title="移除图片"
              type="button"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        ))}

        <button
          className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-stone-300 text-stone-400 hover:border-stone-500 hover:text-stone-600"
          onClick={() => setOpen(true)}
          title="选择图库"
          type="button"
        >
          {selectedIds.size === 0 ? (
            <ImageOff className="h-5 w-5" />
          ) : (
            <span className="text-xs font-bold">+</span>
          )}
        </button>

        <button
          className="ml-1 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-stone-400"
          onClick={() => setOpen(true)}
          type="button"
        >
          选择图库
          {selectedIds.size > 0 ? (
            <span className="ml-1.5 rounded-full bg-stone-100 px-1.5 py-0.5 text-stone-500">
              {selectedIds.size}
            </span>
          ) : null}
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-stone-950/60 pt-16 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-2xl">
            <div className="flex flex-shrink-0 items-center justify-between border-b border-stone-100 px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-stone-950">选择图库图片</h3>
                <p className="mt-0.5 text-xs text-stone-400">
                  已选择 {selectedIds.size} 张图片，可继续增删。
                </p>
              </div>
              <button
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-shrink-0 gap-3 border-b border-stone-100 px-6 py-3">
              <input
                className="flex-1 rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-600"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索图片名称或 Alt 文案"
                value={query}
              />
              {folders.length > 0 ? (
                <label className="flex items-center gap-2 rounded-xl border border-stone-300 px-3 py-2 text-sm">
                  <FolderTree className="h-4 w-4 text-stone-400" />
                  <select
                    className="border-none bg-transparent text-sm text-stone-900 outline-none"
                    onChange={(e) => setActiveFolderId(e.target.value)}
                    value={activeFolderId}
                  >
                    <option value="">全部文件夹</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {filteredAssets.length ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {filteredAssets.map((asset) => {
                    const isSelected = selectedIds.has(asset.id);
                    return (
                      <button
                        key={asset.id}
                        className={[
                          "group relative overflow-hidden rounded-xl border-2 transition-all",
                          isSelected
                            ? "border-blue-600"
                            : "border-transparent hover:border-stone-300",
                        ].join(" ")}
                        onClick={() => toggleId(asset.id)}
                        title={asset.fileName}
                        type="button"
                      >
                        <div className="aspect-square bg-stone-100">
                          <img
                            alt={asset.altTextEn || asset.fileName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            src={asset.url}
                          />
                        </div>
                        {isSelected ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20">
                            <Check className="h-6 w-6 rounded-full bg-blue-600 p-1 text-white" />
                          </div>
                        ) : null}
                        <p className="truncate px-1 pb-1 text-center text-[10px] text-stone-500">
                          {asset.fileName}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-stone-300 text-sm text-stone-400">
                  当前没有符合条件的图片。
                </div>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center justify-between border-t border-stone-100 px-6 py-3">
              <button
                className="text-xs text-stone-400 hover:text-stone-700"
                onClick={() => setSelectedIds(new Set())}
                type="button"
              >
                清空已选
              </button>
              <button
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
                onClick={() => setOpen(false)}
                type="button"
              >
                已选择 {selectedIds.size} 张图片
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

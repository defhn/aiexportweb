"use client";

import { useMemo, useRef, useState } from "react";
import { Check, FolderTree, ImageOff, Upload, X } from "lucide-react";

type ImagePickerAsset = {
  id: number;
  fileName: string;
  url: string;
  folderId?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
};

type FolderOption = {
  id: number;
  label: string;
};

type ImagePickerProps = {
  label: string;
  name: string;
  assets: ImagePickerAsset[];
  folders?: FolderOption[];
  selectedAssetId?: number | null;
};

export function ImagePicker({
  label,
  name,
  assets,
  folders = [],
  selectedAssetId = null,
}: ImagePickerProps) {
  const [assetLibrary, setAssetLibrary] = useState(assets);
  const [selectedId, setSelectedId] = useState<number | null>(selectedAssetId);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFolderId, setActiveFolderId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedAsset = assetLibrary.find((a) => a.id === selectedId) ?? null;

  const filteredAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const folderId = activeFolderId ? Number.parseInt(activeFolderId, 10) : null;
    return assetLibrary.filter((asset) => {
      const matchesFolder = folderId ? asset.folderId === folderId : true;
      const matchesQuery =
        !normalized ||
        `${asset.fileName} ${asset.altTextZh ?? ""} ${asset.altTextEn ?? ""}`
          .toLowerCase()
          .includes(normalized);
      return matchesFolder && matchesQuery;
    });
  }, [activeFolderId, assetLibrary, query]);

  async function handleUpload(file?: File | null) {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (activeFolderId) fd.append("folderId", activeFolderId);
      const res = await fetch("/api/uploads/image", { method: "POST", body: fd });
      const payload = (await res.json()) as ImagePickerAsset & { error?: string };
      if (!res.ok) {
        setUploadError(payload.error ?? "上传失败");
        return;
      }
      setAssetLibrary((prev) => [payload, ...prev]);
      setSelectedId(payload.id);
      setOpen(false);
    } catch {
      setUploadError("上传失败，请检查网络或 R2 配置。");
    } finally {
      setUploading(false);
    }
  }

  function handleSelect(id: number) {
    setSelectedId(id);
    setOpen(false);
    setQuery("");
  }

  function handleClear() {
    setSelectedId(null);
  }

  return (
    <>
      {/* 闂傚懏鍔樺Λ宀勬儍閸曨厽鍩傞悗鍦仩閵嗗啴宕￠弴鐐垫憻婵烇拷?*/}
      <input name={name} type="hidden" value={selectedId ?? ""} />

      {/* 缂佹瘱鍐ㄦ濡澘瀚～宥囨偘?*/}
      <div className="flex items-start gap-4">
        {/* 缂傚倵鏅濋弳鎰板炊?- 250閼村磭鐥?90px */}
        <div className="relative w-[250px] flex-shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
          <div className="aspect-[4/3]">
            {selectedAsset ? (
              <>
                <img
                  alt={selectedAsset.altTextEn || selectedAsset.fileName}
                  className="h-full w-full object-cover"
                  src={selectedAsset.url}
                />
                <button
                  className="absolute right-2 top-2 rounded-full bg-stone-900/70 p-1 text-white hover:bg-stone-900"
                  onClick={handleClear}
                  title="清除已选图片"
                  type="button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageOff className="h-8 w-8 text-stone-300" />
              </div>
            )}
          </div>
        </div>

        {/* 闁哄倸娲ｅ▎銏ゅ触?+ 闁瑰灝绉崇紞鏃堝箰婢舵劖灏?*/}
        <div className="flex flex-col gap-2 pt-1">
          <p className="text-sm font-medium text-stone-900">
            {selectedAsset?.fileName ?? <span className="text-stone-400">未选择{label}</span>}
          </p>
          <p className="text-xs text-stone-400">
            {selectedAsset ? "点击更换图片，或清除当前选择。" : "点击按钮从媒体库选择图片。"}
          </p>
          <button
            className="mt-1 w-fit rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-500 hover:text-stone-900"
            onClick={() => setOpen(true)}
            type="button"
          >
            {selectedAsset ? "更换图片" : "选择图片"}
          </button>
        </div>
      </div>

      {/* 鐎殿喖婀遍悰锟?*/}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-stone-950/60 pt-16 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-2xl">
            {/* 鐎殿喖婀遍悰銉﹀緞閹绢喖鍔?*/}
            <div className="flex flex-shrink-0 items-center justify-between border-b border-stone-100 px-6 py-4">
              <h3 className="text-base font-semibold text-stone-950">选择{label}</h3>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-stone-500"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploading ? "上传中..." : "本地上传"}
                </button>
                <button
                  className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 缂佹稒鐩埀顒€顦伴悥锟?*/}
            <div className="flex flex-shrink-0 gap-3 border-b border-stone-100 px-6 py-3">
              <input
                className="flex-1 rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-600"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索图片名称或 Alt 文案"
                value={query}
              />
              {folders.length > 0 ? (
                <label className="flex items-center gap-2 rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-600">
                  <FolderTree className="h-4 w-4 text-stone-400" />
                  <select
                    className="border-none bg-transparent text-sm text-stone-900 outline-none"
                    onChange={(e) => setActiveFolderId(e.target.value)}
                    value={activeFolderId}
                  >
                    <option value="">全部文件夹</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
            </div>

            {/* 闁搞儱澧芥晶鏍磾閹寸偟澹?*/}
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {uploadError ? (
                <p className="mb-3 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                  {uploadError}
                </p>
              ) : null}

              {filteredAssets.length ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {filteredAssets.map((asset) => {
                    const isSelected = asset.id === selectedId;
                    return (
                      <button
                        key={asset.id}
                        className={[
                          "group relative overflow-hidden rounded-xl border-2 transition-all",
                          isSelected
                            ? "border-blue-600"
                            : "border-transparent hover:border-stone-300",
                        ].join(" ")}
                        onClick={() => handleSelect(asset.id)}
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
                        <p className="truncate px-1 py-1 text-center text-[10px] text-stone-500">
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

            <div className="flex-shrink-0 border-t border-stone-100 px-6 py-3 text-right">
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700"
                onClick={() => setOpen(false)}
                type="button"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <input
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void handleUpload(e.target.files?.[0]);
          e.currentTarget.value = "";
        }}
        type="file"
      />
    </>
  );
}

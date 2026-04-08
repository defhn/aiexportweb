"use client";

import { useMemo, useRef, useState } from "react";
import { FolderTree, ImagePlus, Upload } from "lucide-react";

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
  description?: string;
};

export function ImagePicker({
  label,
  name,
  assets,
  folders = [],
  selectedAssetId = null,
  description = "可从现有图库选择，也可以本地上传后立即选中。",
}: ImagePickerProps) {
  const [assetLibrary, setAssetLibrary] = useState(assets);
  const [selectedId, setSelectedId] = useState<number | null>(selectedAssetId);
  const [query, setQuery] = useState("");
  const [activeFolderId, setActiveFolderId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!file) {
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (activeFolderId) {
        formData.append("folderId", activeFolderId);
      }

      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as ImagePickerAsset & { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "图片上传失败，请稍后重试。");
        return;
      }

      setAssetLibrary((current) => [payload, ...current]);
      setSelectedId(payload.id);
      setMessage(`${payload.fileName} 上传成功，已设为当前选中图片。`);
    } catch {
      setError("图片上传失败，请检查网络或 R2 配置。");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{label}</h3>
          <p className="mt-2 text-sm text-stone-600">{description}</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "上传中..." : "本地上传"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <input
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索文件名或 Alt 文案"
          value={query}
        />
        <label className="flex items-center gap-3 rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-600">
          <FolderTree className="h-4 w-4" />
          <select
            className="w-full border-none bg-transparent text-sm text-stone-900 outline-none"
            onChange={(event) => setActiveFolderId(event.target.value)}
            value={activeFolderId}
          >
            <option value="">全部文件夹</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-stone-700">
        快速选择
        <select
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950"
          name={name}
          onChange={(event) => {
            const nextValue = event.target.value ? Number.parseInt(event.target.value, 10) : null;
            setSelectedId(Number.isFinite(nextValue as number) ? (nextValue as number) : null);
          }}
          value={selectedId ?? ""}
        >
          <option value="">不选择图片</option>
          {assetLibrary.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.fileName}
            </option>
          ))}
        </select>
      </label>

      {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {filteredAssets.length ? (
          filteredAssets.map((asset) => {
            const selected = asset.id === selectedId;

            return (
              <button
                key={asset.id}
                className={[
                  "overflow-hidden rounded-2xl border text-left transition-all",
                  selected ? "border-blue-600 ring-2 ring-blue-600/10" : "border-stone-200 hover:border-stone-400",
                ].join(" ")}
                onClick={() => setSelectedId(asset.id)}
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
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="line-clamp-1 text-sm font-medium text-stone-900">{asset.fileName}</p>
                    {selected ? (
                      <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">已选中</span>
                    ) : null}
                  </div>
                  <p className="line-clamp-2 text-xs text-stone-500">
                    {asset.altTextZh || asset.altTextEn || "未设置 Alt 文案"}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
            当前没有匹配的图片素材。
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          void handleUpload(file);
          event.currentTarget.value = "";
        }}
        type="file"
      />

      {filteredAssets.length ? (
        <div className="mt-5 flex items-center gap-2 text-xs text-stone-500">
          <ImagePlus className="h-4 w-4" />
          点击素材卡片即可选为当前图片；上传时会自动进入当前选中的文件夹。
        </div>
      ) : null}
    </section>
  );
}

"use client";

type ImagePickerAsset = {
  id: number;
  fileName: string;
  url: string;
};

type ImagePickerProps = {
  label: string;
  assets: ImagePickerAsset[];
  selectedAssetId?: number | null;
};

export function ImagePicker({
  label,
  assets,
  selectedAssetId,
}: ImagePickerProps) {
  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">{label}</h2>
          <p className="mt-2 text-sm text-stone-600">
            后续会接入真实图库列表、上传和替换逻辑。
          </p>
        </div>
        <button
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
          type="button"
        >
          选择图片
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {assets.length ? (
          assets.map((asset) => (
            <article
              key={asset.id}
              className={[
                "rounded-2xl border p-4",
                asset.id === selectedAssetId
                  ? "border-slate-950 bg-stone-50"
                  : "border-stone-200 bg-white",
              ].join(" ")}
            >
              <p className="text-sm font-medium text-stone-950">{asset.fileName}</p>
              <p className="mt-2 truncate text-xs text-stone-500">{asset.url}</p>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
            当前还没有可选图片。
          </div>
        )}
      </div>
    </section>
  );
}

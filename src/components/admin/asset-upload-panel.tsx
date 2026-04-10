"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Folder, CheckCircle2 } from "lucide-react";

type FolderOption = { id: number; label: string };

type AssetUploadPanelProps = {
  endpoint: "/api/uploads/image" | "/api/uploads/file";
  accept: string;
  buttonLabel: string;
  folderId?: number | null;
  folderOptions?: FolderOption[];
};

export function AssetUploadPanel({
  endpoint,
  accept,
  buttonLabel,
  folderId,
  folderOptions = [],
}: AssetUploadPanelProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<number | "">(folderId ?? "");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function openDialog() {
    setResult(null);
    setOpen(true);
    setTimeout(() => fileInputRef.current?.click(), 150);
  }

  function closeDialog() {
    if (pending) return;
    setOpen(false);
    setResult(null);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPending(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (typeof targetFolderId === "number") {
        formData.append("folderId", String(targetFolderId));
      }

      const response = await fetch(endpoint, { method: "POST", body: formData });
      const json = (await response.json()) as { fileName?: string; error?: string };

      if (!response.ok) {
        setResult({ ok: false, message: json.error ?? "上传失败，请稍后重试。" });
        return;
      }

      setResult({ ok: true, message: `${json.fileName ?? "文件"} 上传成功。` });
      router.refresh();
    } finally {
      setPending(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const targetLabel =
    folderOptions.find((f) => f.id === targetFolderId)?.label ?? "根目录";

  return (
    <>
      <button
        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        onClick={openDialog}
        type="button"
      >
        <Upload className="h-4 w-4" />
        {buttonLabel}
      </button>

      <input
        ref={fileInputRef}
        accept={accept}
        className="sr-only"
        onChange={handleFileChange}
        tabIndex={-1}
        type="file"
      />

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div className="relative w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-8 shadow-2xl">
            <button
              className="absolute right-5 top-5 rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
              disabled={pending}
              onClick={closeDialog}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold text-stone-950">上传资源</h3>

            <label className="mt-6 block text-sm font-medium text-stone-700">
              <span className="mb-2 flex items-center gap-1.5">
                <Folder className="h-4 w-4 text-stone-400" />
                上传到文件夹
              </span>
              <select
                className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-stone-950"
                disabled={pending}
                onChange={(e) => setTargetFolderId(e.target.value ? Number(e.target.value) : "")}
                value={targetFolderId}
              >
                <option value="">根目录</option>
                {folderOptions.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.label}
                  </option>
                ))}
              </select>
            </label>

            {pending ? (
              <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-stone-50 py-8 text-sm text-stone-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700" />
                正在上传，请稍候...
              </div>
            ) : result ? (
              <div
                className={`mt-6 flex items-start gap-3 rounded-2xl px-4 py-4 text-sm ${
                  result.ok
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {result.ok ? (
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                ) : null}
                <span>{result.message}</span>
              </div>
            ) : (
              <div
                className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 py-10 text-sm text-stone-400 transition-colors hover:border-stone-400 hover:text-stone-600"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8" />
                <span>
                  点击此处选择文件并上传到
                  <strong className="text-stone-700">{targetLabel}</strong>
                </span>
              </div>
            )}

            <div className="mt-6 flex justify-between gap-3">
              {result?.ok ? (
                <>
                  <button
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                    onClick={() => {
                      setResult(null);
                      setTimeout(() => fileInputRef.current?.click(), 50);
                    }}
                    type="button"
                  >
                    继续上传
                  </button>
                  <button
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                    onClick={closeDialog}
                    type="button"
                  >
                    完成
                  </button>
                </>
              ) : (
                <button
                  className="ml-auto rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                  disabled={pending}
                  onClick={closeDialog}
                  type="button"
                >
                  关闭
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

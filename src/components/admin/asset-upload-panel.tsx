"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AssetUploadPanelProps = {
  title: string;
  description: string;
  endpoint: "/api/uploads/image" | "/api/uploads/file";
  accept: string;
  buttonLabel: string;
  folderId?: number | null;
};

export function AssetUploadPanel({
  title,
  description,
  endpoint,
  accept,
  buttonLabel,
  folderId,
}: AssetUploadPanelProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { fileName?: string; error?: string };

      if (!response.ok) {
        setError(result.error ?? "上传失败，请稍后重试。");
        return;
      }

      setMessage(`${result.fileName ?? "文件"} 上传成功。`);
      formRef.current?.reset();
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      <input
        accept={accept}
        className="mt-5 block w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
        name="file"
        required
        type="file"
      />
      {typeof folderId === "number" ? <input name="folderId" type="hidden" value={folderId} /> : null}
      {message ? (
        <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      <button
        className="mt-5 rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "上传中..." : buttonLabel}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Download, Loader2, ShieldCheck } from "lucide-react";

export function SecureAttachmentButton({
  inquiryId,
  fileName,
}: {
  inquiryId: number;
  fileName?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/attachment-url?inquiryId=${inquiryId}`);
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "获取安全下载链接失败");
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "下载失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 transition-all hover:bg-amber-100 active:scale-95 disabled:opacity-50"
        disabled={loading}
        onClick={handleDownload}
        type="button"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {fileName ?? "下载附件"}
      </button>
      <span className="flex items-center gap-1 text-xs text-stone-400">
        <ShieldCheck className="h-3 w-3" />
        {"安全链接有效期为 15 分钟"}
      </span>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

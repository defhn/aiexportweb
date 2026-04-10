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
        throw new Error(data.error ?? "\u83b7\u53d6\u5b89\u5168\u4e0b\u8f7d\u94fe\u63a5\u5931\u8d25");
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "\u4e0b\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5");
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
        {fileName ?? "\u4e0b\u8f7d\u9644\u4ef6"}
      </button>
      <span className="flex items-center gap-1 text-xs text-stone-400">
        <ShieldCheck className="h-3 w-3" />
        {"\u5b89\u5168\u94fe\u63a5\u6709\u6548\u671f\u4e3a 15 \u5206\u949f"}
      </span>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Download, Loader2, ShieldCheck } from "lucide-react";

/**
 * 安全附件下载按钮
 * 点击时向后端请求预签名 URL，15 分钟内有效，避免暴露公开存储桶路径
 */
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
      if (!res.ok || !data.url) throw new Error(data.error ?? "获取链接失败");
      // 打开预签名 URL（浏览器新标签下载）
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "下载失败");
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
        加密链接 · 15 分钟有效
      </span>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

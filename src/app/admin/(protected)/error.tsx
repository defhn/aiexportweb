"use client";

import { AlertTriangle, RefreshCw, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] 页面渲染错误:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">页面加载失败</h1>
            <p className="text-sm text-gray-500">
              该页面在加载数据时遇到错误。请尝试刷新或返回数据看板。
            </p>
          </div>

          {/* Error Details (dev only) */}
          {process.env.NODE_ENV !== "production" && (
            <div className="bg-red-50 rounded-xl p-4 text-left">
              <p className="text-xs font-mono text-red-700 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-400 mt-1">digest: {error.digest}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重新加载
            </button>
            <Link
              href="/admin"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              返回看板
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

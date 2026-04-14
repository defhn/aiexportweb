"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

export function AiPreviewPanel() {
  const [open, setOpen] = useState(false);
  const [mockMessage, setMockMessage] = useState(
    "Hi, I'm interested in your products. What is your MOQ and lead time? Do you have any certifications?",
  );
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePreview() {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai/generate-inquiry-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "John (Test)",
          companyName: "Test Company",
          message: mockMessage,
          productName: "",
          specs: [],
          tone: "professional",
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Failed to generate preview.");
        return;
      }

      setResult(data.reply ?? "");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <p className="text-sm font-semibold text-blue-800">测试一下 AI 知道什么</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
        >
          {open ? "收起" : "▶ 模拟询盘"}
        </button>
      </div>

      {!open && (
        <p className="mt-2 text-xs text-blue-600">
          输入一条假设询盘，看看 AI 会怎么回复——验证你填写的知识库是否真正生效。
        </p>
      )}

      {open && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-blue-700">
              假设客户询盘内容（可以修改）：
            </label>
            <textarea
              value={mockMessage}
              onChange={(e) => setMockMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handlePreview}
            disabled={loading || !mockMessage.trim()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                AI 思考中...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                模拟 AI 会怎么回复
              </>
            )}
          </button>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          {result && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-blue-700">AI 回复草稿（仅预览，不发送）：</p>
                <button
                  type="button"
                  onClick={() => setResult("")}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-xl border border-blue-200 bg-white p-4 text-sm text-stone-800 leading-6">
                {result}
              </div>
              <p className="text-xs text-blue-500">
                💡 如果回复内容准确体现了你的工厂信息，说明知识库已生效。如需改进，继续完善上方表单后重新保存即可。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

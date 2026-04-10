"use client";

import { useState } from "react";
import { Download, Loader2, ShieldCheck } from "lucide-react";

/**
 * 鐎瑰鍙忛梽鍕娑撳娴囬幐澶愭尦
 * 閻愮懓鍤弮璺烘倻閸氬海顏拠閿嬬湴妫板嫮顒烽崥锟� URL閿涳拷15 閸掑棝鎸撻崘鍛箒閺佸牞绱濋柆鍨帳閺嗘挳婀堕崗顒€绱戠€涙ê鍋嶅鎯扮熅瀵帮拷
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
      if (!res.ok || !data.url) throw new Error(data.error ?? "閼惧嘲褰囬柧鐐复婢惰精瑙�");
      // 閹垫挸绱戞０鍕劮閸氾拷 URL閿涘牊绁荤憴鍫濇珤閺傜増鐖ｇ粵鍙ョ瑓鏉炴枻绱�
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "娑撳娴囨径杈Е");
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
        {fileName ?? "娑撳娴囬梽鍕"}
      </button>
      <span className="flex items-center gap-1 text-xs text-stone-400">
        <ShieldCheck className="h-3 w-3" />
        閸旂姴鐦戦柧鐐复 璺� 15 閸掑棝鎸撻張澶嬫櫏
      </span>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

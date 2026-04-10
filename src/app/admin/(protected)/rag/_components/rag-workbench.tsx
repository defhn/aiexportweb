"use client";

import { useState } from "react";
import {
  Database,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";

// 閳光偓閳光偓閳光偓 缁鐎风€规矮绠� 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
type RagIssue = {
  severity: "high" | "medium" | "low";
  quote: string;
  issue: string;
  suggestion: string;
};

type FactCheckResult = {
  overallScore: number;
  issues: RagIssue[];
  positives: string[];
  summary: string;
};

type GenerateResult = {
  content: string;
  usedSources: string[];
};

type RagResponse = {
  result: FactCheckResult | GenerateResult;
  ragContext: {
    productsUsed: string[];
    faqsUsed: number;
    totalChunks: number;
  };
  mode: "generate" | "factcheck";
  error?: string;
};

// 閳光偓閳光偓閳光偓 鏉堝懎濮紒鍕 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓

function SeverityBadge({ severity }: { severity: RagIssue["severity"] }) {
  const map = {
    high: "bg-red-50 text-red-700 border border-red-200",
    medium: "bg-amber-50 text-amber-700 border border-amber-200",
    low: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  const label = { high: "娑撱儵鍣�", medium: "娑擃厼瀹�", low: "鏉炶浜�" };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${map[severity]}`}>
      {severity === "high" && <AlertTriangle className="h-3 w-3" />}
      {severity === "medium" && <Info className="h-3 w-3" />}
      {severity === "low" && <CheckCircle2 className="h-3 w-3" />}
      {label[severity]}
    </span>
  );
}

function ScoreMeter({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-red-600";
  const ringColor =
    score >= 80 ? "stroke-emerald-500" : score >= 60 ? "stroke-amber-500" : "stroke-red-500";
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="absolute -rotate-90" height="96" viewBox="0 0 96 96" width="96">
        <circle className="stroke-stone-100" cx="48" cy="48" fill="none" r="36" strokeWidth="8" />
        <circle
          className={`${ringColor} transition-all duration-700`}
          cx="48"
          cy="48"
          fill="none"
          r="36"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="8"
        />
      </svg>
      <span className={`text-2xl font-black tabular-nums ${color}`}>{score}</span>
    </div>
  );
}

// 閳光偓閳光偓閳光偓 娑撹崵绮嶆禒锟� 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
export function RagWorkbench() {
  const [mode, setMode] = useState<"generate" | "factcheck">("generate");
  const [query, setQuery] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RagResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!query.trim() && !content.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/ai/rag-search-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, content, mode }),
      });
      const data = (await res.json()) as RagResponse;
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "鐠囬攱鐪版径杈Е");
    } finally {
      setLoading(false);
    }
  }

  const factCheck = result?.mode === "factcheck" ? (result.result as FactCheckResult) : null;
  const generated = result?.mode === "generate" ? (result.result as GenerateResult) : null;

  return (
    <div className="space-y-6">
      {/* 閳光偓閳光偓 濡€崇础閸掑洦宕� 閳光偓閳光偓 */}
      <div className="flex gap-2 rounded-2xl bg-stone-100 p-1 w-fit">
        <button
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
            mode === "generate"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-700"
          }`}
          onClick={() => setMode("generate")}
          type="button"
        >
          <Sparkles className="h-4 w-4" />
          RAG 閸愬懎顔愰悽鐔稿灇
        </button>
        <button
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
            mode === "factcheck"
              ? "bg-white text-stone-900 shadow-sm"
              : "text-stone-500 hover:text-stone-700"
          }`}
          onClick={() => setMode("factcheck")}
          type="button"
        >
          <ShieldCheck className="h-4 w-4" />
          AI 娴滃鐤勯弽鍛婄叀
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 閳光偓閳光偓 鏉堟挸鍙嗛崠锟� 閳光偓閳光偓 */}
        <div className="space-y-4">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-stone-900">
              <Database className="h-4 w-4 text-blue-500" />
              {mode === "generate" ? "閻㈢喐鍨氶棁鈧Ч鍌涘伎鏉╋拷" : "瀵板懏鐗抽弻銉ュ敶鐎癸拷"}
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-stone-400">
                  {mode === "generate" ? "閸愬懎顔愰棁鈧Ч锟� / 閸忔娊鏁拠锟�" : "濡偓缁便垹鍙ч柨顔跨槤閿涘牏鏁ゆ禍搴″爱闁板秶鐓＄拠鍡楃氨閿涳拷"}
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-blue-500 transition-colors"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    mode === "generate"
                      ? "娓氬绱癈NC titanium grade 5 machining capabilities"
                      : "娓氬绱皌itanium alloy, CNC machining"
                  }
                  value={query}
                />
              </div>

              {mode === "factcheck" && (
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400">
                    瀵板懏鐗抽弻銉ф畱閺傚洨鐝烽崘鍛啇
                  </label>
                  <textarea
                    className="mt-1 min-h-[200px] w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-blue-500 transition-colors resize-y"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="缁ǹ鍒涢棁鈧憰浣风皑鐎圭偞鐗抽弻銉ф畱 AI 閻㈢喐鍨氶崘鍛啇..."
                    value={content}
                  />
                </div>
              )}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-bold text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
                disabled={loading || (!query.trim() && !content.trim())}
                onClick={handleSubmit}
                type="button"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI 婢跺嫮鎮婃稉锟�...
                  </>
                ) : (
                  <>
                    {mode === "generate" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    {mode === "generate" ? "閸╄桨绨惌銉ㄧ槕鎼存挾鏁撻幋锟�" : "瀵偓婵绨ㄧ€圭偞鐗抽弻锟�"}
                  </>
                )}
              </button>
            </div>
          </section>

          {/* 閳光偓閳光偓 RAG 娑撳﹣绗呴弬鍥ㄦ▔缁€锟� 閳光偓閳光偓 */}
          {result?.ragContext && (
            <section className="rounded-[2rem] border border-blue-100 bg-blue-50 p-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-700">
                RAG 濡偓缁鳖澀绗傛稉瀣瀮
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">閸栧綊鍘ゆ禍褍鎼�</span>
                  <span className="font-bold text-blue-900">
                    {result.ragContext.productsUsed.length} 閺夛拷
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">閸栧綊鍘� FAQ</span>
                  <span className="font-bold text-blue-900">{result.ragContext.faqsUsed} 閺夛拷</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">閹崵鐓＄拠鍡楁健</span>
                  <span className="font-bold text-blue-900">
                    {result.ragContext.totalChunks} 閸э拷
                  </span>
                </div>
                {result.ragContext.productsUsed.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result.ragContext.productsUsed.slice(0, 5).map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* 閳光偓閳光偓 鏉堟挸鍤崠锟� 閳光偓閳光偓 */}
        <div className="space-y-4">
          {error && (
            <section className="rounded-[2rem] border border-red-200 bg-red-50 p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-red-700">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            </section>
          )}

          {/* 娴滃鐤勯弽鍛婄叀缂佹挻鐏� */}
          {factCheck && (
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm space-y-5">
              {/* 鐠囧嫬鍨� */}
              <div className="flex items-center gap-4">
                <ScoreMeter score={factCheck.overallScore} />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-stone-400">
                    AI 閸欘垯淇婃惔锕佺槑閸掞拷
                  </p>
                  <p className="mt-1 text-sm text-stone-600">{factCheck.summary}</p>
                </div>
              </div>

              {/* 闂傤噣顣介崚妤勩€� */}
              {factCheck.issues?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-3">
                    閸欐垹骞� {factCheck.issues.length} 娑擃亪妫舵０锟�
                  </h4>
                  <div className="space-y-3">
                    {factCheck.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl p-4 ${
                          issue.severity === "high"
                            ? "bg-red-50 border border-red-100"
                            : issue.severity === "medium"
                            ? "bg-amber-50 border border-amber-100"
                            : "bg-stone-50 border border-stone-100"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <SeverityBadge severity={issue.severity} />
                        </div>
                        <blockquote className="mt-2 border-l-2 border-stone-300 pl-3 text-xs italic text-stone-500">
                          {issue.quote}
                        </blockquote>
                        <p className="mt-2 text-sm font-medium text-stone-800">{issue.issue}</p>
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-emerald-700">
                          <ChevronRight className="mt-0.5 h-3 w-3 shrink-0" />
                          <span>{issue.suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 娴兼ḿ鍋� */}
              {factCheck.positives?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-2">
                    娴滎喚鍋�
                  </h4>
                  <ul className="space-y-1.5">
                    {factCheck.positives.map((pos, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {pos}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* RAG 閻㈢喐鍨氱紒鎾寸亯 */}
          {generated && (
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">
                  閸╄桨绨惌銉ㄧ槕鎼存挾鏁撻幋鎰畱閸愬懎顔愰敍鍫ｅ磸缁嬪尅绱�
                </h4>
                <button
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                  onClick={() => setResult(null)}
                  type="button"
                >
                  <RefreshCw className="h-3 w-3" />
                  濞撳懘娅�
                </button>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4">
                <pre className="whitespace-pre-wrap text-sm text-stone-800 leading-relaxed font-sans">
                  {generated.content}
                </pre>
              </div>

              {generated.usedSources?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-stone-400 mb-2">瀵洜鏁ら弶銉︾爱閿涳拷</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generated.usedSources.map((src) => (
                      <span
                        key={src}
                        className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-amber-700 font-medium">
                  閳跨媴绗� 閼藉枪濡€崇础 閳ワ拷 閸欐垵绔烽崜宥堫嚞閸掑洦宕查崚鑸偓瀛塈 娴滃鐤勯弽鍛婄叀閵嗗秵膩瀵繘鐛欑拠浣稿敶鐎圭懓鍣涵顔解偓褋鈧拷
                </p>
              </div>
            </section>
          )}

          {!result && !error && !loading && (
            <section className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-stone-200 bg-stone-50 p-12 text-center">
              <Database className="h-10 w-10 text-stone-300 mb-3" />
              <p className="text-sm font-bold text-stone-400">
                {mode === "generate"
                  ? "鏉堟挸鍙嗛棁鈧Ч鍌︾礉AI 鐏忓棗鐔€娴滃簼缍橀惃鍕獓閸濅胶鐓＄拠鍡楃氨閻㈢喐鍨氶崘鍛啇"
                  : "缁ǹ鍒� AI 閻㈢喐鍨氶惃鍕敶鐎圭櫢绱濈化鑽ょ埠鐏忓棔绗岄惌銉ㄧ槕鎼存挻鐦€电懓鑻熼弽鍥╁闂傤噣顣�"}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

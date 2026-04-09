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

// ─── 类型定义 ────────────────────────────────────────────────
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

// ─── 辅助组件 ───────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: RagIssue["severity"] }) {
  const map = {
    high: "bg-red-50 text-red-700 border border-red-200",
    medium: "bg-amber-50 text-amber-700 border border-amber-200",
    low: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  const label = { high: "严重", medium: "中度", low: "轻微" };
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

// ─── 主组件 ─────────────────────────────────────────────────
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
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }

  const factCheck = result?.mode === "factcheck" ? (result.result as FactCheckResult) : null;
  const generated = result?.mode === "generate" ? (result.result as GenerateResult) : null;

  return (
    <div className="space-y-6">
      {/* ── 模式切换 ── */}
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
          RAG 内容生成
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
          AI 事实核查
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── 输入区 ── */}
        <div className="space-y-4">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-stone-900">
              <Database className="h-4 w-4 text-blue-500" />
              {mode === "generate" ? "生成需求描述" : "待核查内容"}
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-stone-400">
                  {mode === "generate" ? "内容需求 / 关键词" : "检索关键词（用于匹配知识库）"}
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-blue-500 transition-colors"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    mode === "generate"
                      ? "例：CNC titanium grade 5 machining capabilities"
                      : "例：titanium alloy, CNC machining"
                  }
                  value={query}
                />
              </div>

              {mode === "factcheck" && (
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400">
                    待核查的文章内容
                  </label>
                  <textarea
                    className="mt-1 min-h-[200px] w-full rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-blue-500 transition-colors resize-y"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="粘贴需要事实核查的 AI 生成内容..."
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
                    AI 处理中...
                  </>
                ) : (
                  <>
                    {mode === "generate" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    {mode === "generate" ? "基于知识库生成" : "开始事实核查"}
                  </>
                )}
              </button>
            </div>
          </section>

          {/* ── RAG 上下文显示 ── */}
          {result?.ragContext && (
            <section className="rounded-[2rem] border border-blue-100 bg-blue-50 p-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-700">
                RAG 检索上下文
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">匹配产品</span>
                  <span className="font-bold text-blue-900">
                    {result.ragContext.productsUsed.length} 条
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">匹配 FAQ</span>
                  <span className="font-bold text-blue-900">{result.ragContext.faqsUsed} 条</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">总知识块</span>
                  <span className="font-bold text-blue-900">
                    {result.ragContext.totalChunks} 块
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

        {/* ── 输出区 ── */}
        <div className="space-y-4">
          {error && (
            <section className="rounded-[2rem] border border-red-200 bg-red-50 p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-red-700">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            </section>
          )}

          {/* 事实核查结果 */}
          {factCheck && (
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm space-y-5">
              {/* 评分 */}
              <div className="flex items-center gap-4">
                <ScoreMeter score={factCheck.overallScore} />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-stone-400">
                    AI 可信度评分
                  </p>
                  <p className="mt-1 text-sm text-stone-600">{factCheck.summary}</p>
                </div>
              </div>

              {/* 问题列表 */}
              {factCheck.issues?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-3">
                    发现 {factCheck.issues.length} 个问题
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

              {/* 优点 */}
              {factCheck.positives?.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-2">
                    亮点
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

          {/* RAG 生成结果 */}
          {generated && (
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">
                  基于知识库生成的内容（草稿）
                </h4>
                <button
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                  onClick={() => setResult(null)}
                  type="button"
                >
                  <RefreshCw className="h-3 w-3" />
                  清除
                </button>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4">
                <pre className="whitespace-pre-wrap text-sm text-stone-800 leading-relaxed font-sans">
                  {generated.content}
                </pre>
              </div>

              {generated.usedSources?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-stone-400 mb-2">引用来源：</p>
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
                  ⚠️ 草稿模式 — 发布前请切换到「AI 事实核查」模式验证内容准确性。
                </p>
              </div>
            </section>
          )}

          {!result && !error && !loading && (
            <section className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-stone-200 bg-stone-50 p-12 text-center">
              <Database className="h-10 w-10 text-stone-300 mb-3" />
              <p className="text-sm font-bold text-stone-400">
                {mode === "generate"
                  ? "输入需求，AI 将基于你的产品知识库生成内容"
                  : "粘贴 AI 生成的内容，系统将与知识库比对并标红问题"}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

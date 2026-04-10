"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Database,
  Info,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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

const severityLabel: Record<RagIssue["severity"], string> = {
  high: "\u9ad8\u98ce\u9669",
  medium: "\u4e2d\u98ce\u9669",
  low: "\u4f4e\u98ce\u9669",
};

function SeverityBadge({ severity }: { severity: RagIssue["severity"] }) {
  const map = {
    high: "bg-red-50 text-red-700 border border-red-200",
    medium: "bg-amber-50 text-amber-700 border border-amber-200",
    low: "bg-blue-50 text-blue-700 border border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${map[severity]}`}
    >
      {severity === "high" ? <AlertTriangle className="h-3 w-3" /> : null}
      {severity === "medium" ? <Info className="h-3 w-3" /> : null}
      {severity === "low" ? <CheckCircle2 className="h-3 w-3" /> : null}
      {severityLabel[severity]}
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

export function RagWorkbench() {
  const [mode, setMode] = useState<"generate" | "factcheck">("generate");
  const [query, setQuery] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RagResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!query.trim() && !content.trim()) {
      return;
    }

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
      if (data.error) {
        throw new Error(data.error);
      }
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "\u8bf7\u6c42\u5904\u7406\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",
      );
    } finally {
      setLoading(false);
    }
  }

  const factCheck = result?.mode === "factcheck" ? (result.result as FactCheckResult) : null;
  const generated = result?.mode === "generate" ? (result.result as GenerateResult) : null;

  return (
    <div className="space-y-6">
      <div className="w-fit rounded-2xl bg-stone-100 p-1">
        <div className="flex gap-2">
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
            {"RAG \u6587\u6848\u751f\u6210"}
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
            {"AI \u5185\u5bb9\u6838\u67e5"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-bold text-stone-900">
              <Database className="h-4 w-4 text-blue-500" />
              {mode === "generate"
                ? "\u751f\u6210\u9700\u6c42\u8f93\u5165"
                : "\u5f85\u6838\u67e5\u5185\u5bb9\u8f93\u5165"}
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-stone-400">
                  {mode === "generate"
                    ? "\u751f\u6210\u9700\u6c42 / \u5173\u952e\u8bcd"
                    : "\u6838\u67e5\u4e3b\u9898\u5173\u952e\u8bcd"}
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 outline-none transition-colors focus:border-blue-500"
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    mode === "generate"
                      ? "\u4f8b\u5982\uff1aCNC titanium grade 5 machining capabilities"
                      : "\u4f8b\u5982\uff1atitanium alloy, CNC machining"
                  }
                  value={query}
                />
              </div>

              {mode === "factcheck" ? (
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400">
                    {"\u5f85\u6838\u67e5\u7684\u6b63\u6587\u5185\u5bb9"}
                  </label>
                  <textarea
                    className="mt-1 min-h-[200px] w-full resize-y rounded-xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none transition-colors focus:border-blue-500"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="\u628a\u9700\u8981\u6838\u67e5\u7684 AI \u6587\u6848\u7c98\u8d34\u5230\u8fd9\u91cc..."
                    value={content}
                  />
                </div>
              ) : null}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-bold text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
                disabled={loading || (!query.trim() && !content.trim())}
                onClick={handleSubmit}
                type="button"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {"AI \u6b63\u5728\u5904\u7406\u4e2d..."}
                  </>
                ) : (
                  <>
                    {mode === "generate" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    {mode === "generate"
                      ? "\u5f00\u59cb\u751f\u6210 RAG \u6587\u6848"
                      : "\u5f00\u59cb\u6838\u67e5\u5185\u5bb9"}
                  </>
                )}
              </button>
            </div>
          </section>

          {result?.ragContext ? (
            <section className="rounded-[2rem] border border-blue-100 bg-blue-50 p-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-blue-700">
                {"RAG \u53c2\u8003\u6765\u6e90"}
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-600">
                    {"\u5f15\u7528\u4ea7\u54c1"}
                  </span>
                  <span className="font-bold text-blue-900">
                    {`${result.ragContext.productsUsed.length} \u4e2a`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">
                    {"\u5f15\u7528 FAQ"}
                  </span>
                  <span className="font-bold text-blue-900">
                    {`${result.ragContext.faqsUsed} \u6761`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">
                    {"\u547d\u4e2d\u6587\u6863\u5757"}
                  </span>
                  <span className="font-bold text-blue-900">
                    {`${result.ragContext.totalChunks} \u5757`}
                  </span>
                </div>
                {result.ragContext.productsUsed.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {result.ragContext.productsUsed.slice(0, 5).map((name) => (
                      <span
                        className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                        key={name}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>

        <div className="space-y-4">
          {error ? (
            <section className="rounded-[2rem] border border-red-200 bg-red-50 p-6">
              <p className="flex items-center gap-2 text-sm font-bold text-red-700">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            </section>
          ) : null}

          {factCheck ? (
            <section className="space-y-5 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <ScoreMeter score={factCheck.overallScore} />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-stone-400">
                    {"AI \u6838\u67e5\u8bc4\u5206"}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">{factCheck.summary}</p>
                </div>
              </div>

              {factCheck.issues?.length > 0 ? (
                <div>
                  <h4 className="mb-3 text-xs font-black uppercase tracking-widest text-stone-400">
                    {`\u53d1\u73b0\u95ee\u9898 ${factCheck.issues.length} \u9879`}
                  </h4>
                  <div className="space-y-3">
                    {factCheck.issues.map((issue, idx) => (
                      <div
                        className={`rounded-2xl p-4 ${
                          issue.severity === "high"
                            ? "border border-red-100 bg-red-50"
                            : issue.severity === "medium"
                              ? "border border-amber-100 bg-amber-50"
                              : "border border-stone-100 bg-stone-50"
                        }`}
                        key={idx}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <SeverityBadge severity={issue.severity} />
                        </div>
                        <blockquote className="mt-2 border-l-2 border-stone-300 pl-3 text-xs italic text-stone-500">
                          {issue.quote}
                        </blockquote>
                        <p className="mt-2 text-sm font-medium text-stone-800">
                          {issue.issue}
                        </p>
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-emerald-700">
                          <ChevronRight className="mt-0.5 h-3 w-3 shrink-0" />
                          <span>{issue.suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {factCheck.positives?.length > 0 ? (
                <div>
                  <h4 className="mb-2 text-xs font-black uppercase tracking-widest text-stone-400">
                    {"\u8868\u73b0\u8f83\u597d"}
                  </h4>
                  <ul className="space-y-1.5">
                    {factCheck.positives.map((pos, idx) => (
                      <li
                        className="flex items-start gap-2 text-sm text-stone-600"
                        key={idx}
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {pos}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {generated ? (
            <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">
                  {"\u751f\u6210\u7ed3\u679c"}
                </h4>
                <button
                  className="flex items-center gap-1 text-xs text-stone-400 transition-colors hover:text-stone-600"
                  onClick={() => setResult(null)}
                  type="button"
                >
                  <RefreshCw className="h-3 w-3" />
                  {"\u91cd\u65b0\u751f\u6210"}
                </button>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-stone-800">
                  {generated.content}
                </pre>
              </div>

              {generated.usedSources?.length > 0 ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-stone-400">
                    {"\u5f15\u7528\u6765\u6e90"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {generated.usedSources.map((src) => (
                      <span
                        className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                        key={src}
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-700">
                  {
                    "\u751f\u6210\u5185\u5bb9\u57fa\u4e8e\u5f53\u524d RAG \u547d\u4e2d\u8d44\u6599\u548c AI \u63a8\u7406\u7ed3\u679c\uff0c\u6b63\u5f0f\u53d1\u5e03\u524d\u4ecd\u5efa\u8bae\u4f60\u7ed3\u5408\u5b9e\u9645\u4ea7\u54c1\u8d44\u6599\u518d\u590d\u6838\u4e00\u904d\u3002"
                  }
                </p>
              </div>
            </section>
          ) : null}

          {!result && !error && !loading ? (
            <section className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-stone-200 bg-stone-50 p-12 text-center">
              <Database className="mb-3 h-10 w-10 text-stone-300" />
              <p className="text-sm font-bold text-stone-400">
                {mode === "generate"
                  ? "\u8f93\u5165\u4f60\u7684\u751f\u6210\u9700\u6c42\uff0cAI \u4f1a\u7ed3\u5408 RAG \u68c0\u7d22\u7ed3\u679c\u4e3a\u4f60\u751f\u6210\u53c2\u8003\u6587\u6848\u3002"
                  : "\u7c98\u8d34\u9700\u8981\u6838\u67e5\u7684 AI \u6587\u6848\uff0c\u7cfb\u7edf\u4f1a\u7ed3\u5408 RAG \u8d44\u6599\u4e3a\u4f60\u6807\u51fa\u95ee\u9898\u70b9\u3002"}
              </p>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

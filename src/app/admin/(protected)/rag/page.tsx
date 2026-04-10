import { count, isNotNull } from "drizzle-orm";
import { Database, FileText, HelpCircle } from "lucide-react";

import { getDb } from "@/db/client";
import { products } from "@/db/schema";

import { RagWorkbench } from "./_components/rag-workbench";

export const dynamic = "force-dynamic";

export default async function AdminRagPage() {
  const stats = {
    products: 0,
    withDetails: 0,
    withFaqs: 0,
  };
  const databaseConfigured = Boolean(process.env.DATABASE_URL);
  let databaseError = false;

  if (databaseConfigured) {
    try {
      const db = getDb();

      const [totalProducts, withDetails, withFaqs] = await Promise.all([
        db.select({ count: count() }).from(products),
        db.select({ count: count() }).from(products).where(isNotNull(products.detailsEn)),
        db.select({ count: count() }).from(products).where(isNotNull(products.faqsJson)),
      ]);

      stats.products = totalProducts[0]?.count ?? 0;
      stats.withDetails = withDetails[0]?.count ?? 0;
      stats.withFaqs = withFaqs[0]?.count ?? 0;
    } catch (error) {
      databaseError = true;
      console.error("Failed to load RAG dashboard stats, falling back to empty state.", error);
    }
  }

  const coverageRate =
    stats.products > 0 ? Math.round((stats.withDetails / stats.products) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">
              {"RAG \u77e5\u8bc6\u5e93\u5de5\u4f5c\u53f0"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              {
                "\u8fd9\u91cc\u53ef\u4ee5\u68c0\u67e5\u4ea7\u54c1\u8be6\u60c5\u3001FAQ \u548c RAG \u7d22\u5f15\u51c6\u5907\u60c5\u51b5\uff0c\u65b9\u4fbf\u4f60\u5728\u4ea7\u54c1\u6570\u636e\u5165\u5e93\u540e\u7eed\u7eed\u8865\u5168\u53ef\u88ab AI \u68c0\u7d22\u7684\u77e5\u8bc6\u5185\u5bb9\u3002"
              }
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              stats.products > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stats.products > 0 ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            {stats.products > 0
              ? "\u5df2\u68c0\u6d4b\u5230\u53ef\u7528\u4ea7\u54c1\u6570\u636e"
              : "\u6682\u672a\u68c0\u6d4b\u5230\u4ea7\u54c1\u6570\u636e"}
          </span>
        </div>

        {!databaseConfigured ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            {
              "\u5f53\u524d\u672a\u914d\u7f6e DATABASE_URL\uff0cRAG \u7edf\u8ba1\u6570\u636e\u6682\u65f6\u65e0\u6cd5\u8bfb\u53d6\u3002\u4f46\u5de5\u4f5c\u53f0\u9875\u9762\u4ecd\u53ef\u4ee5\u6b63\u5e38\u6253\u5f00\u3002"
            }
          </div>
        ) : null}

        {databaseConfigured && databaseError ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            {
              "\u5f53\u524d\u6570\u636e\u5e93\u8fde\u63a5\u5931\u8d25\uff0cRAG \u7edf\u8ba1\u533a\u57df\u5df2\u81ea\u52a8\u964d\u7ea7\u4e3a\u7a7a\u6570\u636e\u663e\u793a\uff0c\u4f46\u9875\u9762\u4ecd\u53ef\u6b63\u5e38\u6253\u5f00\u3002"
            }
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-stone-900">
                {stats.products}
              </p>
              <p className="text-xs text-stone-400">
                {"\u4ea7\u54c1\u603b\u6570"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-stone-900">
                {stats.withDetails}
              </p>
              <p className="text-xs text-stone-400">
                {`\u5df2\u586b\u5199\u8be6\u60c5 (${coverageRate}%)`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-stone-900">
                {stats.withFaqs}
              </p>
              <p className="text-xs text-stone-400">
                {"\u5df2\u586b\u5199 FAQ"}
              </p>
            </div>
          </div>
        </div>

        {stats.products > 0 && coverageRate < 50 ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            {
              `\u5f53\u524d\u8be6\u60c5\u8986\u76d6\u7387\u4ec5 ${coverageRate}%\uff0c\u5efa\u8bae\u4f18\u5148\u8865\u5168\u4ea7\u54c1\u7684 detailsEn \u5b57\u6bb5\uff0c\u518d\u8fdb\u884c RAG \u77e5\u8bc6\u5e93\u6784\u5efa\u548c AI \u95ee\u7b54\u8c03\u7528\u3002`
            }
          </div>
        ) : null}
      </section>

      <RagWorkbench />
    </div>
  );
}

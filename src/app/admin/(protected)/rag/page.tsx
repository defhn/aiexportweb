import { getDb } from "@/db/client";
import { products } from "@/db/schema";
import { count, isNotNull } from "drizzle-orm";
import { Database, FileText, HelpCircle } from "lucide-react";
import { RagWorkbench } from "./_components/rag-workbench";

export const dynamic = "force-dynamic";

export default async function AdminRagPage() {
  const db = getDb();

  const [totalProducts, withDetails, withFaqs] = await Promise.all([
    db.select({ count: count() }).from(products),
    db.select({ count: count() }).from(products).where(isNotNull(products.detailsEn)),
    db.select({ count: count() }).from(products).where(isNotNull(products.faqsJson)),
  ]);

  const stats = {
    products: totalProducts[0]?.count ?? 0,
    withDetails: withDetails[0]?.count ?? 0,
    withFaqs: withFaqs[0]?.count ?? 0,
  };

  const coverageRate =
    stats.products > 0 ? Math.round((stats.withDetails / stats.products) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── 标题卡 ── */}
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">RAG 知识工厂</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              基于你的产品私有知识库，生成专业的工业外贸内容；并有「AI 事实核查」功能，
              自动标红与知识库矛盾的技术参数，杜绝 AI 幻觉上线。
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
            {stats.products > 0 ? "知识库已就绪" : "知识库为空"}
          </span>
        </div>

        {/* 知识库规模统计 */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-stone-900">{stats.products}</p>
              <p className="text-xs text-stone-400">产品总数</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-stone-900">{stats.withDetails}</p>
              <p className="text-xs text-stone-400">有详情 ({coverageRate}%)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums text-stone-900">{stats.withFaqs}</p>
              <p className="text-xs text-stone-400">含 FAQ</p>
            </div>
          </div>
        </div>

        {stats.products > 0 && coverageRate < 50 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            ⚠️ 仅 {coverageRate}% 的产品有英文详情，建议在「产品管理」中补充 detailsEn
            字段，这是 RAG 知识库的核心数据源。
          </div>
        )}
      </section>

      {/* ── 工作台 ── */}
      <RagWorkbench />
    </div>
  );
}

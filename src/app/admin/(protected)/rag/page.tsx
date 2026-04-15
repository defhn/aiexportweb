import { and, count, eq, isNotNull } from "drizzle-orm";
import { Database, FileText, HelpCircle } from "lucide-react";

import { getDb } from "@/db/client";
import { products } from "@/db/schema";

import { RagWorkbench } from "./_components/rag-workbench";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getFeatureGate } from "@/features/plans/access";
import { LockedFeatureCard } from "@/components/admin/locked-feature-card";

export const dynamic = "force-dynamic";

export default async function AdminRagPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const gate = await getFeatureGate("rag_factory", currentSite.plan, currentSite.id);
  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }
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

      const siteFilter = currentSite.id ? eq(products.siteId, currentSite.id) : null;

      const [totalProducts, withDetails, withFaqs] = await Promise.all([
        siteFilter
          ? db.select({ count: count() }).from(products).where(siteFilter)
          : db.select({ count: count() }).from(products),
        db
          .select({ count: count() })
          .from(products)
          .where(siteFilter ? and(isNotNull(products.detailsEn), siteFilter) : isNotNull(products.detailsEn)),
        db
          .select({ count: count() })
          .from(products)
          .where(siteFilter ? and(isNotNull(products.faqsJson), siteFilter) : isNotNull(products.faqsJson)),
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
              {"RAG 知识库工作台"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
              {
                "这里可以检查产品详情、FAQ 和 RAG 索引准备情况，方便你在产品数据入库后续续补全可被 AI 检索的知识内容。"
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
              ? "已检测到可用产品数据"
              : "暂未检测到产品数据"}
          </span>
        </div>

        {!databaseConfigured ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            {
              "当前未配置 DATABASE_URL，RAG 统计数据暂时无法读取。但工作台页面仍可以正常打开。"
            }
          </div>
        ) : null}

        {databaseConfigured && databaseError ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            {
              "当前数据库连接失败，RAG 统计区域已自动降级为空数据显示，但页面仍可正常打开。"
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
                {"产品总数"}
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
                {`已填写详情 (${coverageRate}%)`}
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
                {"已填写 FAQ"}
              </p>
            </div>
          </div>
        </div>

        {stats.products > 0 && coverageRate < 50 ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            {
              `当前详情覆盖率仅 ${coverageRate}%，建议优先补全产品的 detailsEn 字段，再进行 RAG 知识库构建和 AI 问答调用。`
            }
          </div>
        ) : null}
      </section>

      <RagWorkbench />
    </div>
  );
}

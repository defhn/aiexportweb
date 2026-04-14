"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { desc, eq, isNull, or, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { products, siteSettings } from "@/db/schema";
import { assertSameOrigin } from "@/lib/csrf";
import { getSiteSettings } from "@/features/settings/queries";
import { convertKnowledgeToMarkdown, type KnowledgeJson } from "@/lib/knowledge-to-markdown";

import KnowledgeEditor from "./knowledge-editor";
import { AiPreviewPanel } from "./ai-preview";


export const dynamic = "force-dynamic";

// ── Server Actions ───────────────────────────────────────────────────────────

async function saveKnowledge(formData: FormData) {
  "use server";
  await assertSameOrigin();

  const industryCode = (formData.get("industryCode") as string | null)?.trim() ?? "";
  const rawJson = (formData.get("knowledgeSectionsJson") as string | null)?.trim() ?? "{}";

  let sections: KnowledgeJson = {};
  try {
    sections = JSON.parse(rawJson) as KnowledgeJson;
  } catch {
    // 解析失败则保持空对象
  }

  // 自动生成 Markdown（供 RAG 使用）
  const md = convertKnowledgeToMarkdown(sections, industryCode);

  const db = getDb();
  const [existing] = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .orderBy(desc(siteSettings.updatedAt))
    .limit(1);

  if (existing) {
    await db
      .update(siteSettings)
      .set({
        industryCode: industryCode || null,
        knowledgeSectionsJson: sections,
        companyKnowledgeMd: md,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, existing.id));
  } else {
    await db.insert(siteSettings).values({
      companyNameZh: "工厂",
      companyNameEn: "Factory",
      email: "sales@example.com",
      industryCode: industryCode || null,
      knowledgeSectionsJson: sections,
      companyKnowledgeMd: md,
    });
  }

  revalidatePath("/admin/knowledge");
}

async function rebuildEmbeddings() {
  "use server";
  await assertSameOrigin();

  // 清空所有产品的 embedding，触发后台重建
  const db = getDb();
  await db
    .update(products)
    .set({ embeddingJson: null, embeddingUpdatedAt: null });

  revalidatePath("/admin/knowledge");
}

// ── 获取向量化统计 ──────────────────────────────────────────────────────────

async function getEmbeddingStats() {
  const db = getDb();
  const result = await db
    .select({
      total: sql<number>`COUNT(*)::int`,
      indexed: sql<number>`COUNT(CASE WHEN embedding_json IS NOT NULL THEN 1 END)::int`,
    })
    .from(products);
  return result[0] ?? { total: 0, indexed: 0 };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function KnowledgePage() {
  const settings = await getSiteSettings();
  const stats = await getEmbeddingStats();

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">教 AI 了解你的工厂</h1>
        <p className="mt-1 text-sm text-stone-500">
          填写越详细，AI 在回复询盘时越准确。填完后系统自动学习，无需其他操作。
        </p>
      </div>

      {/* AI 学习状态卡片 */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-700">AI 产品学习状态</p>
            <p className="mt-1 text-xs text-stone-500">
              AI 已了解{" "}
              <span className="font-bold text-stone-900">
                {stats.total > 0 ? Math.round((stats.indexed / stats.total) * 100) : 0}%
              </span>{" "}
              的产品（{stats.indexed}/{stats.total} 个）
            </p>
          </div>
          <div className="text-right">
            {stats.total > stats.indexed && (
              <form action={rebuildEmbeddings}>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
                >
                  🔄 让 AI 学习新产品（还有 {stats.total - stats.indexed} 个待学习）
                </button>
              </form>
            )}
            {stats.total > 0 && stats.indexed === stats.total && (
              <span className="rounded-xl bg-green-50 px-4 py-2 text-xs font-medium text-green-700 ring-1 ring-green-200">
                ✅ 全部产品 AI 已学习
              </span>
            )}
          </div>
        </div>
        {stats.total > 0 && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${Math.round((stats.indexed / stats.total) * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* 主编辑器（Client Component） */}
      <AiPreviewPanel />

      <KnowledgeEditor
        saveAction={saveKnowledge}
        initialIndustryCode={settings.industryCode ?? ""}
        initialData={(settings.knowledgeSectionsJson as KnowledgeJson) ?? {}}
      />
    </div>
  );
}

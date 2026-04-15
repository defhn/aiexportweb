import { revalidatePath } from "next/cache";
import { desc, eq, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { products, siteSettings } from "@/db/schema";
import { getSiteSettings } from "@/features/settings/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { assertSameOrigin } from "@/lib/csrf";
import {
  convertKnowledgeToMarkdown,
  type KnowledgeJson,
} from "@/lib/knowledge-to-markdown";

import { AiPreviewPanel } from "./ai-preview";
import KnowledgeEditor from "./knowledge-editor";

export const dynamic = "force-dynamic";

async function saveKnowledge(formData: FormData) {
  "use server";
  await assertSameOrigin();

  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const industryCode = (formData.get("industryCode") as string | null)?.trim() ?? "";
  const rawJson =
    (formData.get("knowledgeSectionsJson") as string | null)?.trim() ?? "{}";

  let sections: KnowledgeJson = {};
  try {
    sections = JSON.parse(rawJson) as KnowledgeJson;
  } catch {
    sections = {};
  }

  const md = convertKnowledgeToMarkdown(sections, industryCode);
  const db = getDb();
  const existingQuery = db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .orderBy(desc(siteSettings.updatedAt))
    .limit(1);
  const [existing] = siteId
    ? await existingQuery.where(eq(siteSettings.siteId, siteId))
    : await existingQuery;

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
      siteId,
      companyNameZh: "Factory",
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

  const currentSite = await getCurrentSiteFromRequest();
  const db = getDb();
  const query = db
    .update(products)
    .set({ embeddingJson: null, embeddingUpdatedAt: null });
  await (currentSite.id ? query.where(eq(products.siteId, currentSite.id)) : query);

  revalidatePath("/admin/knowledge");
}

async function getEmbeddingStats(siteId?: number | null) {
  const db = getDb();
  const query = db
    .select({
      total: sql<number>`COUNT(*)::int`,
      indexed: sql<number>`COUNT(CASE WHEN embedding_json IS NOT NULL THEN 1 END)::int`,
    })
    .from(products);
  const result = siteId ? await query.where(eq(products.siteId, siteId)) : await query;
  return result[0] ?? { total: 0, indexed: 0 };
}

export default async function KnowledgePage() {
  const currentSite = await getCurrentSiteFromRequest();
  const settings = await getSiteSettings(currentSite.seedPackKey, currentSite.id);
  const stats = await getEmbeddingStats(currentSite.id);
  const progress = stats.total > 0 ? Math.round((stats.indexed / stats.total) * 100) : 0;

  return (
    <div className="w-full space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">AI Knowledge Base</h1>
        <p className="mt-1 text-sm text-stone-500">
          Fill in the business details for the current site so AI replies and RAG results stay site-specific.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-700">Embedding Status</p>
            <p className="mt-1 text-xs text-stone-500">
              Indexed {stats.indexed}/{stats.total} products for this site ({progress}%).
            </p>
          </div>
          <div className="text-right">
            {stats.total > stats.indexed ? (
              <form action={rebuildEmbeddings}>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200 transition hover:bg-amber-100"
                >
                  Rebuild remaining embeddings
                </button>
              </form>
            ) : (
              <span className="rounded-xl bg-green-50 px-4 py-2 text-xs font-medium text-green-700 ring-1 ring-green-200">
                All products indexed
              </span>
            )}
          </div>
        </div>
        {stats.total > 0 ? (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
      </div>

      <AiPreviewPanel />

      <KnowledgeEditor
        saveAction={saveKnowledge}
        initialIndustryCode={settings.industryCode ?? ""}
        initialData={(settings.knowledgeSectionsJson as KnowledgeJson) ?? {}}
      />
    </div>
  );
}

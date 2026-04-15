import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { seoAiSettings } from "@/db/schema";
import { getDefaultCrawlerPolicy } from "@/lib/ai-crawlers";

export async function getSeoAiSettings(siteId?: number | null) {
  const fallback = {
    ...getDefaultCrawlerPolicy(),
    extraRobotsTxt: "",
  };

  if (!process.env.DATABASE_URL) {
    return fallback;
  }

  const db = getDb();
  const query = db
    .select()
    .from(seoAiSettings)
    .orderBy(desc(seoAiSettings.updatedAt), desc(seoAiSettings.id))
    .limit(1);
  const [record] = siteId ? await query.where(eq(seoAiSettings.siteId, siteId)) : await query;

  if (!record) {
    return fallback;
  }

  return {
    allowGoogle: record.allowGoogle,
    allowBing: record.allowBing,
    allowOaiSearchBot: record.allowOaiSearchBot,
    allowClaudeSearchBot: record.allowClaudeSearchBot,
    allowPerplexityBot: record.allowPerplexityBot,
    allowGptBot: record.allowGptBot,
    allowClaudeBot: record.allowClaudeBot,
    extraRobotsTxt: record.extraRobotsTxt ?? "",
  };
}

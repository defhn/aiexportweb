import { desc } from "drizzle-orm";

import { getDb } from "@/db/client";
import { seoAiSettings } from "@/db/schema";
import { getDefaultCrawlerPolicy } from "@/lib/ai-crawlers";

export async function getSeoAiSettings() {
  const fallback = {
    ...getDefaultCrawlerPolicy(),
    extraRobotsTxt: "",
  };

  if (!process.env.DATABASE_URL) {
    return fallback;
  }

  const db = getDb();
  const [record] = await db
    .select()
    .from(seoAiSettings)
    .orderBy(desc(seoAiSettings.updatedAt), desc(seoAiSettings.id))
    .limit(1);

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

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { seoAiSettings } from "@/db/schema";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getDefaultCrawlerPolicy } from "@/lib/ai-crawlers";

type SeoAiSettingsDraft = {
  allowGoogle: boolean;
  allowBing: boolean;
  allowOaiSearchBot: boolean;
  allowClaudeSearchBot: boolean;
  allowPerplexityBot: boolean;
  allowGptBot: boolean;
  allowClaudeBot: boolean;
  extraRobotsTxt: string;
};

export function buildSeoAiSettingsDraft(
  input: Partial<SeoAiSettingsDraft>,
): SeoAiSettingsDraft {
  const defaults = getDefaultCrawlerPolicy();

  return {
    allowGoogle: input.allowGoogle ?? defaults.allowGoogle,
    allowBing: input.allowBing ?? defaults.allowBing,
    allowOaiSearchBot: input.allowOaiSearchBot ?? defaults.allowOaiSearchBot,
    allowClaudeSearchBot:
      input.allowClaudeSearchBot ?? defaults.allowClaudeSearchBot,
    allowPerplexityBot:
      input.allowPerplexityBot ?? defaults.allowPerplexityBot,
    allowGptBot: input.allowGptBot ?? defaults.allowGptBot,
    allowClaudeBot: input.allowClaudeBot ?? defaults.allowClaudeBot,
    extraRobotsTxt: input.extraRobotsTxt?.trim() ?? "",
  };
}

function readCheckbox(formData: FormData, key: keyof SeoAiSettingsDraft) {
  return formData.get(key) === "on";
}

function readText(formData: FormData, key: keyof SeoAiSettingsDraft) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function saveSeoAiSettings(formData: FormData) {
  "use server";

  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const db = getDb();
  const draft = buildSeoAiSettingsDraft({
    allowGoogle: readCheckbox(formData, "allowGoogle"),
    allowBing: readCheckbox(formData, "allowBing"),
    allowOaiSearchBot: readCheckbox(formData, "allowOaiSearchBot"),
    allowClaudeSearchBot: readCheckbox(formData, "allowClaudeSearchBot"),
    allowPerplexityBot: readCheckbox(formData, "allowPerplexityBot"),
    allowGptBot: readCheckbox(formData, "allowGptBot"),
    allowClaudeBot: readCheckbox(formData, "allowClaudeBot"),
    extraRobotsTxt: readText(formData, "extraRobotsTxt"),
  });

  const query = db
    .select({ id: seoAiSettings.id })
    .from(seoAiSettings)
    .orderBy(desc(seoAiSettings.updatedAt), desc(seoAiSettings.id))
    .limit(1);
  const [existing] = siteId ? await query.where(eq(seoAiSettings.siteId, siteId)) : await query;

  if (existing) {
    await db
      .update(seoAiSettings)
      .set({
        ...draft,
        updatedAt: new Date(),
      })
      .where(eq(seoAiSettings.id, existing.id));
  } else {
    await db.insert(seoAiSettings).values({ ...draft, siteId });
  }

  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/seo-ai");

  redirect("/admin/seo-ai?saved=1");
}

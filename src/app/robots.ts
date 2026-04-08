import type { MetadataRoute } from "next";

import { getSeoAiSettings } from "@/features/seo-ai/queries";
import { buildAbsoluteUrl } from "@/lib/seo";

export const revalidate = 0;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSeoAiSettings();

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: settings.allowGoogle ? "/" : undefined,
        disallow: settings.allowGoogle ? undefined : "/",
      },
      {
        userAgent: "Bingbot",
        allow: settings.allowBing ? "/" : undefined,
        disallow: settings.allowBing ? undefined : "/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: settings.allowOaiSearchBot ? "/" : undefined,
        disallow: settings.allowOaiSearchBot ? undefined : "/",
      },
      {
        userAgent: "Claude-SearchBot",
        allow: settings.allowClaudeSearchBot ? "/" : undefined,
        disallow: settings.allowClaudeSearchBot ? undefined : "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: settings.allowPerplexityBot ? "/" : undefined,
        disallow: settings.allowPerplexityBot ? undefined : "/",
      },
      {
        userAgent: "GPTBot",
        allow: settings.allowGptBot ? "/" : undefined,
        disallow: settings.allowGptBot ? undefined : "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: settings.allowClaudeBot ? "/" : undefined,
        disallow: settings.allowClaudeBot ? undefined : "/",
      },
    ],
    sitemap: buildAbsoluteUrl("/sitemap.xml"),
  };
}

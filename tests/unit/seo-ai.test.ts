import { describe, expect, it } from "vitest";

import { buildSeoAiSettingsDraft } from "@/features/seo-ai/actions";
import { buildRobotsPolicies } from "@/lib/ai-crawlers";
import { buildProductJsonLd } from "@/lib/json-ld";

describe("seo and ai helpers", () => {
  it("allows search bots and blocks training bots by default", () => {
    const text = buildRobotsPolicies({
      allowGoogle: true,
      allowBing: true,
      allowOaiSearchBot: true,
      allowClaudeSearchBot: true,
      allowPerplexityBot: true,
      allowGptBot: false,
      allowClaudeBot: false,
    });

    expect(text).toContain("User-agent: OAI-SearchBot");
    expect(text).toContain("User-agent: GPTBot");
    expect(text).toContain("Disallow: /");
  });

  it("builds product json-ld with specs and faq", () => {
    const jsonLd = buildProductJsonLd({
      name: "Custom Aluminum CNC Bracket",
      description: "Precision-machined bracket for OEM applications.",
      category: "CNC Machining",
      url: "https://example.com/products/aluminum-machining-parts/custom-aluminum-cnc-bracket",
      specs: [{ label: "Material", value: "Aluminum 6061" }],
      faqs: [{ question: "Can you support OEM drawings?", answer: "Yes." }],
    });

    expect(jsonLd["@type"]).toBe("Product");
    expect(jsonLd.name).toContain("Bracket");
    expect(jsonLd.additionalProperty).toHaveLength(1);
  });

  it("normalizes seo and ai crawler settings from partial input", () => {
    expect(
      buildSeoAiSettingsDraft({
        allowGoogle: false,
        allowBing: true,
        allowOaiSearchBot: true,
        allowClaudeSearchBot: true,
        allowPerplexityBot: false,
        allowGptBot: false,
        allowClaudeBot: true,
        extraRobotsTxt: "  Crawl-delay: 5  ",
      }),
    ).toEqual({
      allowGoogle: false,
      allowBing: true,
      allowOaiSearchBot: true,
      allowClaudeSearchBot: true,
      allowPerplexityBot: false,
      allowGptBot: false,
      allowClaudeBot: true,
      extraRobotsTxt: "Crawl-delay: 5",
    });
  });
});

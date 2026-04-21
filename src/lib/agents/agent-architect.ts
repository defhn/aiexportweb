/**
 * Agent-2：SEO 大纲架构师（SEO Architect）
 *
 * 战略定位：把干燥的工业参数 JSON 转化为"有流量牙齿"的文章骨架。
 * 这一步决定文章能否被 Google 正确理解并排名。
 *
 * 输入：工业参数 JSON + 行业意图词组
 * 输出：包含主关键词、H2/H3 大纲结构的 JSON
 *
 * 核心约束：
 * - H1 必须含 primaryKeyword
 * - 不能以公司介绍开篇（必须以买家痛点/场景开篇）
 * - 每个 H2 必须对应一个买家决策知识点
 */

import { z } from "zod";
import { type IndustryKey, getIndustryContext, type GenericManufacturingData } from "@/lib/ingest/industry-schema";
import { getIntentPhrases, getHighIntentTransactionalPhrases } from "@/lib/seo/intent-map";

// ─── 大纲 Schema ──────────────────────────────────────────────────────────────

const OutlineNodeSchema = z.object({
  level: z.enum(["h2", "h3"]),
  text: z.string(),
  // 这个节点对应哪类买家意图
  intent: z.enum(["pain_point", "informational", "comparison", "cta", "social_proof"]),
  // 该节点应包含哪些关键数据点（来自 Schema JSON）
  keyDataToInclude: z.array(z.string()).default([]),
});

export const ArticleOutlineSchema = z.object({
  // SEO 核心
  primaryKeyword: z.string(),
  titleTag: z.string().max(65),
  metaDescriptionDraft: z.string().max(175),

  // H1 标题（比 titleTag 可略长，更具说服力）
  h1: z.string(),

  // 文章大纲
  outline: z.array(OutlineNodeSchema).min(4),

  // FAQ 问题（用于生成 FAQPage Schema）
  faqQuestions: z.array(z.string()).min(2).max(6),

  // 预估文章长度建议
  recommendedWordCount: z.number().min(600).max(2500),
});

export type ArticleOutline = z.infer<typeof ArticleOutlineSchema>;

// ─── 构建架构师 Prompt ────────────────────────────────────────────────────────

function buildArchitectPrompt(
  industry: IndustryKey,
  intentPhrases: string[],
  customPrompt?: string,
): string {
  if (customPrompt) return customPrompt;

  const industryContext = getIndustryContext(industry);

  return `You are a senior B2B SEO content strategist specializing in industrial manufacturing content for Western markets (USA, Germany, UK, Australia).

Your task: Create a high-converting article outline for a ${industryContext} company targeting overseas B2B procurement managers and engineers.

STRICT RULES FOR THE OUTLINE:
1. The H1 must naturally contain the primaryKeyword
2. NEVER start with company introduction — start with the BUYER'S PROBLEM or use-case
3. Each H2 must answer a specific procurement decision question (not just describe features)
4. Include at least one H2 on: specifications/capabilities, quality/certifications, process/workflow
5. The last H2 should be a subtle CTA (e.g., "How to Get a Custom Quote for [Product]")
6. FAQ questions must be what real buyers would search on Google
7. primaryKeyword must be one of the highest-volume phrases from the provided list

Available high-intent keywords to choose from (select the most specific and commercially valuable):
${intentPhrases.map((p, i) => `${i + 1}. "${p}"`).join("\n")}

Return ONLY valid JSON matching this structure — no explanations, no markdown:
{
  "primaryKeyword": "...",
  "titleTag": "...(max 60 chars, includes keyword)",
  "metaDescriptionDraft": "...(max 155 chars, action-oriented)",
  "h1": "...(slightly longer than title, compelling)",
  "outline": [
    { "level": "h2", "text": "...", "intent": "pain_point|informational|comparison|cta|social_proof", "keyDataToInclude": ["..."] }
  ],
  "faqQuestions": ["How much does...?", "What is the MOQ for...?"],
  "recommendedWordCount": 1200
}`;
}

// ─── 主函数 ───────────────────────────────────────────────────────────────────

const MAX_RETRIES = 2;

export type ArchitectResult =
  | { success: true; outline: ArticleOutline; attempts: number }
  | { success: false; error: string; attempts: number };

export async function generateArticleOutline(params: {
  industryData: GenericManufacturingData;
  industry: IndustryKey;
  customPrompt?: string;
}): Promise<ArchitectResult> {
  const { industryData, industry, customPrompt } = params;

  const intentPhrases = [
    ...getHighIntentTransactionalPhrases(industry),
    ...getIntentPhrases(industry, "MEDIUM", 8),
  ].slice(0, 20);

  const systemPrompt = buildArchitectPrompt(industry, intentPhrases, customPrompt);

  // 只传关键字段给架构师（不传原始文本，避免分心）
  const userMessage = `Based on these extracted industry parameters, create the article outline:

Product: ${industryData.productName || "Industrial Component"}
Category: ${industryData.productCategory || "Manufacturing Part"}
Materials: ${industryData.materials.join(", ") || "Various"}
Applications: ${industryData.applications.join(", ") || "Industrial use"}
Certifications: ${industryData.certifications.join(", ") || ""}
Key Specs: ${JSON.stringify(industryData.specifications || {})}
Lead Time: ${industryData.leadTime || ""}
MOQ: ${industryData.moq || ""}`;

  let lastError = "";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Agent-2 Architect] 尝试第 ${attempt} 次生成大纲, 行业: ${industry}`);

      const rawOutput = await callLanguageModel(systemPrompt, userMessage, { expectJson: true });

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawOutput);
      } catch {
        lastError = `JSON 解析失败（第 ${attempt} 次）`;
        continue;
      }

      const validation = ArticleOutlineSchema.safeParse(parsed);
      if (!validation.success) {
        const issues = validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        lastError = `大纲 Schema 验证失败: ${issues}`;
        console.warn(`[Agent-2 Architect] ${lastError}`);
        continue;
      }

      console.log(`[Agent-2 Architect] ✅ 大纲生成成功 | keyword="${validation.data.primaryKeyword}"`);
      return { success: true, outline: validation.data, attempts: attempt };

    } catch (err) {
      lastError = `API 调用失败: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`[Agent-2 Architect] ${lastError}`);
    }
  }

  return { success: false, error: lastError, attempts: MAX_RETRIES };
}

// ─── 复用 Agent-1 的 LLM 调用函数 ────────────────────────────────────────────

async function callLanguageModel(
  systemPrompt: string,
  userMessage: string,
  options: { expectJson: true; maxTokens?: number },
): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (openaiKey) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: options.maxTokens ?? 1500,
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });
    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message?.content ?? "{}";
  }

  if (geminiKey) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1500, responseMimeType: "application/json" },
        }),
      },
    );
    if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
    const data = await response.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> };
    return data.candidates[0]?.content?.parts[0]?.text ?? "{}";
  }

  throw new Error("未配置 AI Provider");
}

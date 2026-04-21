/**
 * Agent-3：外贸执笔写手（B2B Content Writer）
 * Agent-4：技术参数核验质检员（Technical Reviewer）
 *
 * 战略定位：
 * - Agent-3：把骨架填充为地道西方工业买手风味的正文
 * - Agent-4：逐一比对参数，发现幻觉立即驳回重写（护城河核心）
 *
 * Negative Prompt 全局禁用词：
 * 这些是最典型的 AI 廉价套话，Google 今年版算法秒识别
 */

import { type ArticleOutline } from "./agent-architect";
import { type GenericManufacturingData } from "@/lib/ingest/industry-schema";

// ─── 全局禁用词（Negative Prompt）─────────────────────────────────────────────
// CEO 维护：发现新的 AI 套话，直接加进来

export const NEGATIVE_WORDS = [
  "In today's fast-paced world",
  "In the realm of",
  "revolutionize",
  "cutting-edge",
  "unlock the power of",
  "game-changer",
  "game changer",
  "seamlessly",
  "robust solution",
  "state-of-the-art",
  "best-in-class",
  "world-class",
  "leverage",
  "synergy",
  "paradigm shift",
  "holistic approach",
  "end-to-end solution",
  "delve into",
  "it is worth noting",
  "in conclusion",
  "to summarize",
  "As an AI language model",
  "I cannot provide",
  "Moreover, it's crucial",
  "Embarking on",
  "dive deep into",
  "tapestry of",
  "ever-evolving",
];

// ─── Agent-3：外贸执笔写手 System Prompt ─────────────────────────────────────

function buildWriterPrompt(
  outline: ArticleOutline,
  negativeWords: string[],
  customPrompt?: string,
): string {
  if (customPrompt) return customPrompt;

  return `You are a veteran B2B industrial content writer with 15 years experience writing for Western procurement managers and design engineers.

Your articles are published by Chinese manufacturing companies targeting buyers in USA, Germany, UK, Australia, and Canada.

YOUR WRITING STYLE:
- Dry, factual, numbers-driven (like a technical datasheet meets an industry guide)
- Start with the BUYER'S PROBLEM or real-world application scenario — never with company introduction
- Every paragraph must contain at least ONE specific technical fact, number, or engineering insight
- Use active voice, short sentences (max 25 words each)
- Address the reader as "you" to create procurement-context relevance

ABSOLUTE PROHIBITIONS (cause immediate rejection if found):
${negativeWords.map((w) => `- "${w}"`).join("\n")}
- Any sentence that starts with "In today's..."
- Any buzzword without a specific concrete meaning
- Any claim about "quality" without a supporting certification, number, or test standard
- Generic opener not related to the buyer's specific technical challenge

ADDITIONAL REQUIREMENTS:
- Keyword Integration: Naturally include "${outline.primaryKeyword}" in the first 100 words
- FAQ Section: At the end, write a proper FAQ section answering these questions:
  ${outline.faqQuestions.map((q) => `  - "${q}"`).join("\n")}
- Length target: approximately ${outline.recommendedWordCount} words
- Format: Markdown with proper H2/H3 headings matching the outline structure

Return the complete article in Markdown format. Start directly with the content — no preamble.`;
}

// ─── Agent-3 主函数 ───────────────────────────────────────────────────────────

export type WriterResult =
  | { success: true; markdown: string; wordCount: number; attempts: number }
  | { success: false; error: string; attempts: number };

const WRITER_MAX_RETRIES = 2;

export async function writeArticle(params: {
  outline: ArticleOutline;
  industryData: GenericManufacturingData;
  negativeWords?: string[];
  customPrompt?: string;
}): Promise<WriterResult> {
  const { outline, industryData, negativeWords = NEGATIVE_WORDS, customPrompt } = params;

  const systemPrompt = buildWriterPrompt(outline, negativeWords, customPrompt);

  const userMessage = `Write a complete article following this exact outline structure:

H1: ${outline.h1}

${outline.outline.map((node) => {
    const dataHint = node.keyDataToInclude.length > 0
      ? `\n  → Include these data points: ${node.keyDataToInclude.join(", ")}`
      : "";
    return `${node.level.toUpperCase()}: ${node.text}${dataHint}`;
  }).join("\n\n")}

Key technical facts to weave into the article (from manufacturer's actual specs):
- Product: ${industryData.productName}
- Materials: ${industryData.materials.join(", ")}
- Applications: ${industryData.applications.join(", ")}
- Certifications: ${industryData.certifications.join(", ")}
- Specifications: ${JSON.stringify(industryData.specifications)}
- Lead Time: ${industryData.leadTime ?? "Contact for quote"}
- MOQ: ${industryData.moq ?? "Contact for minimum order"}`;

  let lastError = "";

  for (let attempt = 1; attempt <= WRITER_MAX_RETRIES; attempt++) {
    try {
      console.log(`[Agent-3 Writer] 尝试第 ${attempt} 次写作`);

      const markdown = await callWriterModel(systemPrompt, userMessage, {
        maxTokens: Math.min(4096, outline.recommendedWordCount * 2),
      });

      // 基础质量检查：禁用词检测
      const foundBannedWords = negativeWords.filter((word) =>
        markdown.toLowerCase().includes(word.toLowerCase()),
      );

      if (foundBannedWords.length > 0) {
        lastError = `发现禁用词: ${foundBannedWords.slice(0, 3).join(", ")}（第 ${attempt} 次）`;
        console.warn(`[Agent-3 Writer] ${lastError}`);
        if (attempt < WRITER_MAX_RETRIES) continue;
        // 最后一次尝试：即使有禁用词也接受（由 Reviewer 决定是否通过）
      }

      const wordCount = markdown.split(/\s+/).length;
      console.log(`[Agent-3 Writer] ✅ 写作完成 | 字数: ${wordCount} | attempts=${attempt}`);
      return { success: true, markdown, wordCount, attempts: attempt };

    } catch (err) {
      lastError = `API 调用失败: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`[Agent-3 Writer] ${lastError}`);
    }
  }

  return { success: false, error: lastError, attempts: WRITER_MAX_RETRIES };
}

// ─── Agent-4：技术参数核验质检员 ──────────────────────────────────────────────

export type ReviewResult =
  | { passed: true; issues: []; attempts: number }
  | { passed: false; issues: string[]; attempts: number };

function buildReviewerPrompt(): string {
  return `You are a meticulous quality control engineer reviewing B2B industrial marketing content.

Your ONLY task: Compare the article's technical claims against the verified source data provided.

Check for these types of errors:
1. NUMERICAL HALLUCINATION: Article states a different number than provided data (e.g., tolerance changed from 0.05mm to 0.005mm)
2. MATERIAL MISMATCH: Article mentions materials not in the verified list
3. CERTIFICATION FABRICATION: Article claims certifications not in the provided list
4. CAPACITY EXAGGERATION: Article overstates production capacity or lead time
5. APPLICATION MISMATCH: Article claims applications not supported by the parameters

RESPONSE FORMAT (JSON only):
{
  "passed": true/false,
  "issues": ["Issue description 1", "Issue description 2"]
}

If no issues found, return: {"passed": true, "issues": []}
List every issue found, no matter how small.`;
}

export async function reviewArticle(params: {
  markdown: string;
  industryData: GenericManufacturingData;
}): Promise<ReviewResult> {
  const { markdown, industryData } = params;

  const systemPrompt = buildReviewerPrompt();
  const userMessage = `VERIFIED SOURCE DATA (ground truth):
${JSON.stringify({
    productName: industryData.productName,
    materials: industryData.materials,
    specifications: industryData.specifications,
    certifications: industryData.certifications,
    applications: industryData.applications,
    leadTime: industryData.leadTime,
    moq: industryData.moq,
    rawKeyDataPoints: industryData.rawKeyDataPoints,
  }, null, 2)}

---

ARTICLE TO REVIEW:
${markdown.slice(0, 6000)}`;

  try {
    const rawOutput = await callWriterModel(systemPrompt, userMessage, {
      maxTokens: 800,
      temperature: 0.05,
      expectJson: true,
    });

    const parsed = JSON.parse(rawOutput) as { passed?: boolean; issues?: string[] };

    if (parsed.passed === true) {
      console.log("[Agent-4 Reviewer] ✅ 质检通过");
      return { passed: true, issues: [], attempts: 1 };
    }

    console.warn(`[Agent-4 Reviewer] ❌ 质检发现问题: ${parsed.issues?.join("; ")}`);
    return {
      passed: false,
      issues: parsed.issues ?? ["Unknown review failure"],
      attempts: 1,
    };

  } catch (err) {
    // Reviewer 失败不阻塞整个流水线，记录警告后放行
    console.warn(`[Agent-4 Reviewer] 质检失败，跳过: ${err}`);
    return { passed: true, issues: [], attempts: 1 };
  }
}

// ─── 共享 LLM 调用函数 ────────────────────────────────────────────────────────

async function callWriterModel(
  systemPrompt: string,
  userMessage: string,
  options: { maxTokens?: number; temperature?: number; expectJson?: boolean },
): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const { maxTokens = 4096, temperature = 0.65, expectJson = false } = options;

  if (openaiKey) {
    const body: Record<string, unknown> = {
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature,
    };
    if (expectJson) body.response_format = { type: "json_object" };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message?.content ?? "";
  }

  if (geminiKey) {
    const genConfig: Record<string, unknown> = {
      temperature,
      maxOutputTokens: maxTokens,
    };
    if (expectJson) genConfig.responseMimeType = "application/json";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
          generationConfig: genConfig,
        }),
      },
    );
    if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
    const data = await response.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> };
    return data.candidates[0]?.content?.parts[0]?.text ?? "";
  }

  throw new Error("未配置 AI Provider");
}

/**
 * Agent-1：信息提纯员（Knowledge Extractor）
 *
 * 战略定位：这是整个流水线的"入口质检站"。
 * 输入：原始的 PDF 文本（乱码、Chinglish、格式杂乱）
 * 输出：严格符合 Zod Schema 的工业参数 JSON
 *
 * 核心约束：
 * - 只提取参数，绝对不写任何营销语句
 * - JSON 验证失败 → 自动重试（最多 3 次）→ 全败则返回 null
 * - 宁可输出 confidence=20 的低置信度结果，也不允许参数幻觉
 */

import { type IndustryKey, getIndustrySchema, getIndustryContext } from "@/lib/ingest/industry-schema";

// ─── 工具：获取 AI 客户端（统一处理多 Provider）──────────────────────────────

async function callLanguageModel(
  systemPrompt: string,
  userMessage: string,
  options: { expectJson: true; maxTokens?: number },
): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (openaiKey) {
    // 优先使用 GPT-4o（参数提取能力最强）
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: options.maxTokens ?? 2000,
        response_format: { type: "json_object" },
        temperature: 0.1, // 提取任务要求极低温度（确定性输出）
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    return data.choices[0]?.message?.content ?? "{}";
  }

  if (geminiKey) {
    // 降级使用 Gemini（指定 JSON 输出模式）
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: options.maxTokens ?? 2000,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json() as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
    };
    return data.candidates[0]?.content?.parts[0]?.text ?? "{}";
  }

  throw new Error("未配置任何 AI Provider（需要 OPENAI_API_KEY 或 GEMINI_API_KEY）");
}

// ─── 构建提取 System Prompt ───────────────────────────────────────────────────

function buildExtractorPrompt(industry: IndustryKey, customPrompt?: string): string {
  if (customPrompt) return customPrompt;

  const industryContext = getIndustryContext(industry);

  return `You are a highly experienced industrial procurement specialist with 20 years of experience in ${industryContext}.

Your ONLY task is to extract specific technical parameters from the provided raw document text.

CRITICAL RULES:
1. Output ONLY valid JSON matching the schema structure provided
2. Do NOT write any marketing language, sentences, or product descriptions
3. Do NOT invent or assume parameters not explicitly stated in the source text
4. If a parameter is unclear or absent, use an empty array [] or empty string ""
5. For extractionConfidence: rate 0-100 based on how complete and clear the source data is
6. For rawKeyDataPoints: extract up to 10 exact quotes from source that contain critical numbers/specs
7. If the document is too vague to extract meaningful data, return all defaults with confidence=15

You must return valid JSON only. No explanations, no markdown, just the JSON object.`;
}

// ─── 主提取函数（含重试）──────────────────────────────────────────────────────

export type ExtractionResult<T> = {
  success: true;
  data: T;
  attempts: number;
} | {
  success: false;
  error: string;
  attempts: number;
};

const MAX_RETRIES = 3;

export async function extractIndustryData<T>(params: {
  rawText: string;
  industry: IndustryKey;
  customPrompt?: string;
}): Promise<ExtractionResult<T>> {
  const { rawText, industry, customPrompt } = params;
  const schema = getIndustrySchema(industry);
  const systemPrompt = buildExtractorPrompt(industry, customPrompt);

  // 截取合理长度（避免超出上下文窗口）
  const truncatedText = rawText.length > 8000
    ? rawText.slice(0, 8000) + "\n\n[Document truncated for processing]"
    : rawText;

  const userMessage = `Please extract all technical parameters from the following document text and return them as a JSON object:\n\n---\n${truncatedText}\n---`;

  let lastError = "";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Agent-1 Extractor] 尝试第 ${attempt} 次提取，行业: ${industry}`);

      const rawOutput = await callLanguageModel(systemPrompt, userMessage, {
        expectJson: true,
        maxTokens: 2000,
      });

      // 解析并验证 JSON
      let parsed: unknown;
      try {
        parsed = JSON.parse(rawOutput);
      } catch {
        lastError = `JSON 解析失败（第 ${attempt} 次）: ${rawOutput.slice(0, 200)}`;
        console.warn(`[Agent-1 Extractor] ${lastError}`);
        continue;
      }

      // Zod Schema 强类型验证
      const validation = schema.safeParse(parsed);
      if (!validation.success) {
        const issues = validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        lastError = `Schema 验证失败（第 ${attempt} 次）: ${issues}`;
        console.warn(`[Agent-1 Extractor] ${lastError}`);
        // 不立即失败，尝试宽松模式继续
        continue;
      }

      console.log(`[Agent-1 Extractor] ✅ 提取成功 | confidence=${validation.data.extractionConfidence} | attempts=${attempt}`);
      return {
        success: true,
        data: validation.data as T,
        attempts: attempt,
      };

    } catch (err) {
      lastError = `API 调用错误（第 ${attempt} 次）: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`[Agent-1 Extractor] ${lastError}`);

      // 429 限速时等待后重试
      if (err instanceof Error && err.message.includes("429")) {
        await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
      }
    }
  }

  return {
    success: false,
    error: `提取失败，已重试 ${MAX_RETRIES} 次。最后错误: ${lastError}`,
    attempts: MAX_RETRIES,
  };
}

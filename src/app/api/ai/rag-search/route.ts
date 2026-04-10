import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { products } from "@/db/schema";

export const runtime = "nodejs";

type FaqItem = { question: string; answer: string };

/**
 * RAG 产品知识库检索 + AI 内容生成/事实核查
 * POST /api/ai/rag-search
 * body: { query: string; topK?: number; mode?: "generate"|"factcheck"; content?: string }
 */
export async function POST(request: Request) {
  const body = (await request.json()) as {
    query?: string;
    topK?: number;
    mode?: "generate" | "factcheck";
    content?: string;
  };

  const query = body.query?.trim() ?? "";
  const topK = Math.min(body.topK ?? 5, 10);
  const mode = body.mode ?? "generate";

  if (!query && !body.content) {
    return NextResponse.json({ error: "query 或 content 不能为空" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "未配置 GEMINI_API_KEY" }, { status: 500 });
  }

  // Vertex AI Express endpoint
  const project = process.env.VERTEX_PROJECT_ID ?? "huachuanghub";
  const location = process.env.VERTEX_LOCATION ?? "us-central1";
  const ragModel = "gemini-2.0-flash";

  // ── 1. 从 products 表检索产品数据 ──────────────────────────────────────
  const db = getDb();

  const allProducts = await db
    .select({
      id: products.id,
      nameEn: products.nameEn,
      nameZh: products.nameZh,
      shortDescriptionEn: products.shortDescriptionEn,
      detailsEn: products.detailsEn,
      faqsJson: products.faqsJson,
    })
    .from(products)
    .limit(100);

  // 简单关键词匹配评分（降级方案，无向量embedding）
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(Boolean);

  const score = (text: string) =>
    queryWords.reduce((acc, w) => acc + (text.toLowerCase().includes(w) ? 1 : 0), 0);

  const scoredProducts = allProducts
    .map((p) => ({
      ...p,
      score: score(
        [p.nameEn, p.nameZh, p.shortDescriptionEn, p.detailsEn].filter(Boolean).join(" ")
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // ── 2. 构建 RAG 上下文片段 ─────────────────────────────────────────────
  const contextChunks: string[] = [];
  const usedNames: string[] = [];
  let faqsUsed = 0;

  for (const p of scoredProducts) {
    const name = p.nameEn ?? p.nameZh ?? "Unknown";
    usedNames.push(name);

    const chunk = [
      `[产品] ${name}`,
      p.shortDescriptionEn ?? "",
      p.detailsEn ?? "",
    ]
      .filter(Boolean)
      .join("\n")
      .trim();

    if (chunk.length > 10) contextChunks.push(chunk);

    // FAQs
    const faqs: FaqItem[] = Array.isArray(p.faqsJson) ? (p.faqsJson as FaqItem[]) : [];
    for (const faq of faqs.slice(0, 3)) {
      contextChunks.push(`Q: ${faq.question}\nA: ${faq.answer}`);
      faqsUsed++;
    }
  }

  const ragContext = contextChunks.join("\n\n");

  // ── 3. 构建 Prompt ────────────────────────────────────────────────────
  let prompt: string;

  if (mode === "factcheck") {
    prompt = `你是一位专业的外贸产品文案质量审核员。请根据以下产品知识库，核查用户提供的文案是否准确。

产品知识库：
${ragContext || "（暂无产品数据，请基于通用产品知识进行判断）"}

---
待核查文案：
${body.content ?? query}

---
请以 JSON 格式返回核查结果，结构如下：
{
  "overallScore": 85,
  "issues": [
    {
      "severity": "high",
      "quote": "文案中有误的原文片段",
      "issue": "错误说明",
      "suggestion": "修改建议"
    }
  ],
  "positives": ["文案优点描述"],
  "summary": "总体评价"
}`;
  } else {
    prompt = `你是一位专业的外贸产品文案撰写专家，擅长用英文写吸引买家的产品介绍。请根据以下产品知识库，回答客户的问题或生成产品内容。

产品知识库：
${ragContext || "（暂无产品数据，请基于通用行业知识回答，并说明内容来自通用知识而非具体产品资料）"}

---
客户问题：${query}

请以 JSON 格式返回：
{
  "content": "你生成的英文产品内容或问题回复",
  "usedSources": ["引用的产品名称列表"]
}`;
  }

  // ── 4. 调用 Gemini ─────────────────────────────────────────────────────
  try {
    const response = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${ragModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Gemini API 调用失败: ${errText}` }, { status: 502 });
    }

    const json = (await response.json()) as {
      candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
    };

    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = mode === "factcheck"
        ? { overallScore: 0, issues: [], positives: [], summary: raw }
        : { content: raw, usedSources: [] };
    }

    return NextResponse.json({
      result: parsed,
      ragContext: {
        productsUsed: usedNames,
        faqsUsed,
        totalChunks: contextChunks.length,
      },
      mode,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "AI 服务暂时不可用", detail: String(error) },
      { status: 500 }
    );
  }
}

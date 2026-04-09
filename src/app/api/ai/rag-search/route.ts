import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { products } from "@/db/schema";

export const runtime = "nodejs";

type FaqItem = { question: string; answer: string };

/**
 * RAG 知识库检索 + AI 内容生成/事实核查接口
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
    return NextResponse.json({ error: "query 不能为空" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "未配置 GEMINI_API_KEY" }, { status: 500 });
  }

  // ── 1. 从 products 表检索知识库 ──────────────────────────────
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

  // 简易关键词相关性评分（可替换为 embedding）
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

  // ── 2. 构建 RAG 上下文 ────────────────────────────────────────
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

  // ── 3. 构建 Prompt ────────────────────────────────────────────
  let prompt: string;

  if (mode === "factcheck") {
    prompt = `你是工业制造行业专业审核编辑。

【私有产品知识库（权威参考）】
${ragContext || "（知识库为空）"}

---
【待审核内容】
${body.content ?? query}

---
请逐句核查，以 JSON 格式返回（严格遵守此结构，不要解释）：
{
  "overallScore": 85,
  "issues": [
    {
      "severity": "high",
      "quote": "原文中的具体段落或句子",
      "issue": "问题说明",
      "suggestion": "建议修改为"
    }
  ],
  "positives": ["做得好的地方"],
  "summary": "整体审核意见"
}`;
  } else {
    prompt = `你是专业工业外贸内容作家，只能基于以下私有知识库写作，严禁虚构技术参数。

【私有产品知识库】
${ragContext || "（知识库为空，请先在产品管理中填写产品详情）"}

---
【需求】${query}

请以 JSON 格式返回：
{
  "content": "生成的英文内容",
  "usedSources": ["引用的产品名称列表"]
}`;
  }

  // ── 4. 调用 Gemini ────────────────────────────────────────────
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
      return NextResponse.json({ error: `Gemini API 错误: ${errText}` }, { status: 502 });
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
      { error: "AI 服务调用失败", detail: String(error) },
      { status: 500 }
    );
  }
}

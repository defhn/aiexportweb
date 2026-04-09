import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { products } from "@/db/schema";

export const runtime = "nodejs";

type FaqItem = { question: string; answer: string };

type EmbeddingVector = number[];

/** 调用 Google text-embedding-004 获取向量 */
async function getEmbedding(text: string, apiKey: string): Promise<EmbeddingVector> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: { parts: [{ text: text.slice(0, 2048) }] },
        taskType: "RETRIEVAL_DOCUMENT",
      }),
    }
  );
  if (!response.ok) throw new Error(`Embedding API error: ${response.status}`);
  const json = (await response.json()) as {
    embedding?: { values?: EmbeddingVector };
  };
  return json.embedding?.values ?? [];
}

/** 余弦相似度 */
function cosineSim(a: EmbeddingVector, b: EmbeddingVector): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

/**
 * RAG 知识库检索（向量版）
 * POST /api/ai/rag-search-v2
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
  const apiKey = process.env.GEMINI_API_KEY;

  if (!query && !body.content) {
    return NextResponse.json({ error: "query 不能为空" }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: "未配置 GEMINI_API_KEY" }, { status: 500 });
  }

  const db = getDb();

  // ── 1. 加载产品知识库 ────────────────────────────────────────
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
    .limit(80);

  // ── 2. 为查询词获取 embedding ─────────────────────────────────
  let queryVec: EmbeddingVector = [];
  try {
    queryVec = await getEmbedding(query || body.content || "", apiKey);
  } catch (err) {
    console.warn("[RAG-v2] embedding failed, falling back to keyword:", err);
  }

  // ── 3. 构建知识块 + 打分（向量优先，降级关键词）─────────────
  type Chunk = {
    text: string;
    name: string;
    kind: "product" | "faq";
    score: number;
    vec?: EmbeddingVector;
  };

  const chunks: Chunk[] = [];
  const queryLower = query.toLowerCase();

  for (const p of allProducts) {
    const name = p.nameEn ?? p.nameZh ?? "Unknown";
    const body_text = [p.shortDescriptionEn ?? "", p.detailsEn ?? ""].join(" ").trim();

    if (body_text.length > 10) {
      const kw_score = queryLower
        .split(/\s+/)
        .filter(Boolean)
        .reduce((acc, w) => acc + (body_text.toLowerCase().includes(w) ? 1 : 0), 0);

      chunks.push({ text: `[产品] ${name}\n${body_text}`, name, kind: "product", score: kw_score });
    }

    // FAQs
    const faqs: FaqItem[] = Array.isArray(p.faqsJson) ? (p.faqsJson as FaqItem[]) : [];
    for (const faq of faqs.slice(0, 3)) {
      const faq_text = `Q: ${faq.question}\nA: ${faq.answer}`;
      const kw_score = queryLower
        .split(/\s+/)
        .filter(Boolean)
        .reduce((acc, w) => acc + (faq_text.toLowerCase().includes(w) ? 1 : 0), 0);
      chunks.push({ text: faq_text, name, kind: "faq", score: kw_score });
    }
  }

  // ── 4. 向量重排（如果 embedding 成功） ─────────────────────────
  if (queryVec.length > 0) {
    const batchSize = 10;
    for (let i = 0; i < Math.min(chunks.length, 30); i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (chunk) => {
          try {
            chunk.vec = await getEmbedding(chunk.text.slice(0, 1024), apiKey);
            chunk.score = cosineSim(queryVec, chunk.vec);
          } catch {
            // 保留关键词 score
          }
        })
      );
    }
  }

  const topChunks = [...chunks]
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const ragContext = topChunks.map((c) => c.text).join("\n\n");
  const usedNames = [...new Set(topChunks.map((c) => c.name))];
  const faqsUsed = topChunks.filter((c) => c.kind === "faq").length;

  // ── 5. 调用 Gemini 生成/核查 ─────────────────────────────────
  const prompt =
    mode === "factcheck"
      ? `你是工业制造行业专业审核编辑，基于以下知识库检查内容准确性。

【私有产品知识库】
${ragContext || "（知识库为空）"}

---
【待审核内容】
${body.content ?? query}

请以 JSON 返回：{ "overallScore": 85, "issues": [{ "severity": "high|medium|low", "quote": "原文句子", "issue": "问题", "suggestion": "建议" }], "positives": [], "summary": "" }`
      : `你是专业工业外贸内容作家，只能引用以下知识库中的真实数据。

【私有产品知识库】
${ragContext || "（知识库为空）"}

---
需求：${query}

以 JSON 返回：{ "content": "英文内容", "usedSources": ["产品名"] }`;

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
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const json = (await response.json()) as {
      candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
    };
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let parsed: unknown;
    try { parsed = JSON.parse(raw); } catch { parsed = { content: raw }; }

    return NextResponse.json({
      result: parsed,
      ragContext: {
        productsUsed: usedNames,
        faqsUsed,
        totalChunks: topChunks.length,
        embeddingUsed: queryVec.length > 0,
      },
      mode,
    });
  } catch (error) {
    return NextResponse.json({ error: "AI 调用失败", detail: String(error) }, { status: 500 });
  }
}

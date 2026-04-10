import { NextResponse } from "next/server";

import { getDb } from "@/db/client";
import { products } from "@/db/schema";

export const runtime = "nodejs";

type FaqItem = { question: string; answer: string };

type EmbeddingVector = number[];

async function getEmbedding(text: string, apiKey: string): Promise<EmbeddingVector> {
  const project = process.env.VERTEX_PROJECT_ID ?? "huachuanghub";
  const location = process.env.VERTEX_LOCATION ?? "us-central1";
  const response = await fetch(
    `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/text-embedding-004",
        content: { parts: [{ text: text.slice(0, 2048) }] },
        taskType: "RETRIEVAL_DOCUMENT",
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Embedding API error: ${response.status}`);
  }

  const json = (await response.json()) as {
    embedding?: { values?: EmbeddingVector };
  };

  return json.embedding?.values ?? [];
}

function cosineSim(a: EmbeddingVector, b: EmbeddingVector): number {
  if (a.length !== b.length || a.length === 0) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

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
    return NextResponse.json(
      { error: "\u8bf7\u5148\u8f93\u5165\u751f\u6210\u9700\u6c42\u6216\u5f85\u6838\u67e5\u5185\u5bb9" },
      { status: 400 },
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "\u672a\u914d\u7f6e GEMINI_API_KEY" },
      { status: 500 },
    );
  }

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
    .limit(80);

  let queryVec: EmbeddingVector = [];

  try {
    queryVec = await getEmbedding(query || body.content || "", apiKey);
  } catch (err) {
    console.warn("[RAG-v2] embedding failed, falling back to keyword ranking:", err);
  }

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
    const bodyText = [p.shortDescriptionEn ?? "", p.detailsEn ?? ""].join(" ").trim();

    if (bodyText.length > 10) {
      const keywordScore = queryLower
        .split(/\s+/)
        .filter(Boolean)
        .reduce(
          (acc, word) => acc + (bodyText.toLowerCase().includes(word) ? 1 : 0),
          0,
        );

      chunks.push({
        text: `[Product] ${name}\n${bodyText}`,
        name,
        kind: "product",
        score: keywordScore,
      });
    }

    const faqs: FaqItem[] = Array.isArray(p.faqsJson) ? (p.faqsJson as FaqItem[]) : [];

    for (const faq of faqs.slice(0, 3)) {
      const faqText = `Q: ${faq.question}\nA: ${faq.answer}`;
      const keywordScore = queryLower
        .split(/\s+/)
        .filter(Boolean)
        .reduce(
          (acc, word) => acc + (faqText.toLowerCase().includes(word) ? 1 : 0),
          0,
        );

      chunks.push({
        text: faqText,
        name,
        kind: "faq",
        score: keywordScore,
      });
    }
  }

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
            // Keep keyword score when per-chunk embedding fails.
          }
        }),
      );
    }
  }

  const topChunks = [...chunks].sort((a, b) => b.score - a.score).slice(0, topK);

  const ragContext = topChunks.map((c) => c.text).join("\n\n");
  const usedNames = [...new Set(topChunks.map((c) => c.name))];
  const faqsUsed = topChunks.filter((c) => c.kind === "faq").length;

  const prompt =
    mode === "factcheck"
      ? `You are a B2B manufacturing content fact-checker.

Use the reference material below to review the draft content. Identify factual risks, vague claims, unsupported statements, or details that do not match the provided reference context.

Reference material:
${ragContext || "No reliable reference material was retrieved."}

---
Draft content to review:
${body.content ?? query}

Return strict JSON in this shape:
{
  "overallScore": 85,
  "issues": [
    {
      "severity": "high|medium|low",
      "quote": "quoted text from the draft",
      "issue": "what is wrong",
      "suggestion": "how to improve it"
    }
  ],
  "positives": ["what is already good"],
  "summary": "one short summary"
}`
      : `You are a B2B manufacturing copywriting assistant.

Use the reference material below to generate a practical, accurate draft that stays close to the retrieved product knowledge. Avoid inventing specifications that are not supported by the reference material.

Reference material:
${ragContext || "No reliable reference material was retrieved."}

---
User request:
${query}

Return strict JSON in this shape:
{
  "content": "generated content",
  "usedSources": ["source names"]
}`;

  const v2Project = process.env.VERTEX_PROJECT_ID ?? "huachuanghub";
  const v2Location = process.env.VERTEX_LOCATION ?? "us-central1";
  try {
    const response = await fetch(
      `https://${v2Location}-aiplatform.googleapis.com/v1/projects/${v2Project}/locations/${v2Location}/publishers/google/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
      },
    );

    const json = (await response.json()) as {
      candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
    };
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { content: raw };
    }

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
    return NextResponse.json(
      {
        error: "AI \u751f\u6210\u6216\u6838\u67e5\u5931\u8d25",
        detail: String(error),
      },
      { status: 500 },
    );
  }
}

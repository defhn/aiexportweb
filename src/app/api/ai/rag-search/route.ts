import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * RAG 产品知识库检索 + AI 内容生成/事实核查
 * POST /api/ai/rag-search
 *
 * v2 版本：已迁移到统一的 rag-utils 库
 *   - 优先使用 DB 预计算的 embedding（降低 API 成本 ~30x）
 *   - 自动合并企业知识库（companyKnowledgeMd）
 *   - 支持 generate / factcheck 两种模式
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

  // ── 1. 使用统一 RAG 工具库检索 ─────────────────────────────────────────────
  const { buildRagContext } = await import("@/lib/rag-utils");

  const { context: ragContext, meta } = await buildRagContext({
    query: query || body.content || "",
    includeCompanyKnowledge: true,
    includeReplyTemplates: false,
    topK,
  });

  // ── 2. 构建 Prompt ────────────────────────────────────────────────────────
  const project = process.env.VERTEX_PROJECT_ID ?? "huachuanghub";
  const location = process.env.VERTEX_LOCATION ?? "us-central1";
  const ragModel = "gemini-2.0-flash";

  let prompt: string;

  if (mode === "factcheck") {
    prompt = `You are a B2B manufacturing content fact-checker.

Use the reference material below to review the draft content. Identify factual risks, vague claims, unsupported statements, or details that do not match the provided reference context.

Reference material:
${ragContext}

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
}`;
  } else {
    prompt = `You are a B2B manufacturing copywriting assistant.

Use the reference material below to generate a practical, accurate draft that stays close to the retrieved product knowledge. Avoid inventing specifications that are not supported by the reference material.

Reference material:
${ragContext}

---
User request:
${query}

Return strict JSON in this shape:
{
  "content": "generated content",
  "usedSources": ["source names"]
}`;
  }

  // ── 3. 调用 Gemini ─────────────────────────────────────────────────────────
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
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Gemini API 调用失败: ${errText}` },
        { status: 502 },
      );
    }

    const json = (await response.json()) as {
      candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
    };

    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed =
        mode === "factcheck"
          ? { overallScore: 0, issues: [], positives: [], summary: raw }
          : { content: raw, usedSources: [] };
    }

    return NextResponse.json({
      result: parsed,
      ragContext: {
        productsUsed: meta.productsUsed,
        faqsUsed: meta.faqsUsed,
        totalChunks: meta.productsUsed.length,
        usedEmbedding: meta.usedEmbedding,
        hasCompanyKnowledge: meta.hasCompanyKnowledge,
      },
      mode,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "AI 服务暂时不可用", detail: String(error) },
      { status: 500 },
    );
  }
}

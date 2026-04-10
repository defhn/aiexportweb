import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { products } from "@/db/schema";

export const runtime = "nodejs";

type FaqItem = { question: string; answer: string };

type EmbeddingVector = number[];

/** 鐠嬪啰鏁� Google text-embedding-004 閼惧嘲褰囬崥鎴﹀櫤 */
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

/** 娴ｆ瑥楦￠惄闀愭妧鎼达拷 */
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
 * RAG 閻儴鐦戞惔鎾搭梾缁鳖澁绱欓崥鎴﹀櫤閻楀牞绱�
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
    return NextResponse.json({ error: "query 娑撳秷鍏樻稉铏光敄" }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: "閺堫亪鍘ょ純锟� GEMINI_API_KEY" }, { status: 500 });
  }

  const db = getDb();

  // 閳光偓閳光偓 1. 閸旂姾娴囨禍褍鎼ч惌銉ㄧ槕鎼达拷 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
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

  // 閳光偓閳光偓 2. 娑撶儤鐓＄拠銏ｇ槤閼惧嘲褰� embedding 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
  let queryVec: EmbeddingVector = [];
  try {
    queryVec = await getEmbedding(query || body.content || "", apiKey);
  } catch (err) {
    console.warn("[RAG-v2] embedding failed, falling back to keyword:", err);
  }

  // 閳光偓閳光偓 3. 閺嬪嫬缂撻惌銉ㄧ槕閸э拷 + 閹垫挸鍨庨敍鍫濇倻闁插繋绱崗鍫礉闂勫秶楠囬崗鎶芥暛鐠囧稄绱氶埞鈧埞鈧埞鈧埞鈧埞鈧埞鈧埞鈧埞鈧埞鈧埞鈧埞鈧埞鈧埞鈧�
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

      chunks.push({ text: `[娴溠冩惂] ${name}\n${body_text}`, name, kind: "product", score: kw_score });
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

  // 閳光偓閳光偓 4. 閸氭垿鍣洪柌宥嗗笓閿涘牆顩ч弸锟� embedding 閹存劕濮涢敍锟� 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
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
            // 娣囨繄鏆€閸忔娊鏁拠锟� score
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

  // 閳光偓閳光偓 5. 鐠嬪啰鏁� Gemini 閻㈢喐鍨�/閺嶅憡鐓� 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
  const prompt =
    mode === "factcheck"
      ? `娴ｇ姵妲稿銉ょ瑹閸掑爼鈧姾顢戞稉姘瑩娑撴艾顓搁弽鍝ョ椽鏉堟埊绱濋崺杞扮艾娴犮儰绗呴惌銉ㄧ槕鎼存挻顥呴弻銉ュ敶鐎圭懓鍣涵顔解偓褋鈧拷

閵嗘劗顫嗛張澶夐獓閸濅胶鐓＄拠鍡楃氨閵嗭拷
${ragContext || "閿涘牏鐓＄拠鍡楃氨娑撹櫣鈹栭敍锟�"}

---
閵嗘劕绶熺€光剝鐗抽崘鍛啇閵嗭拷
${body.content ?? query}

鐠囪渹浜� JSON 鏉╂柨娲栭敍姝� "overallScore": 85, "issues": [{ "severity": "high|medium|low", "quote": "閸樼喐鏋冮崣銉ョ摍", "issue": "闂傤噣顣�", "suggestion": "瀵ら缚顔�" }], "positives": [], "summary": "" }`
      : `娴ｇ姵妲告稉鎾茬瑹瀹搞儰绗熸径鏍敜閸愬懎顔愭担婊冾啀閿涘苯褰ч懗钘夌穿閻€劋浜掓稉瀣叀鐠囧棗绨辨稉顓犳畱閻喎鐤勯弫鐗堝祦閵嗭拷

閵嗘劗顫嗛張澶夐獓閸濅胶鐓＄拠鍡楃氨閵嗭拷
${ragContext || "閿涘牏鐓＄拠鍡楃氨娑撹櫣鈹栭敍锟�"}

---
闂団偓濮瑰偊绱�${query}

娴狅拷 JSON 鏉╂柨娲栭敍姝� "content": "閼昏鲸鏋冮崘鍛啇", "usedSources": ["娴溠冩惂閸氾拷"] }`;

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
    return NextResponse.json({ error: "AI 鐠嬪啰鏁ゆ径杈Е", detail: String(error) }, { status: 500 });
  }
}

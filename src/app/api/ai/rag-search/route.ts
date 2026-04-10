import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { products } from "@/db/schema";

export const runtime = "nodejs";

type FaqItem = { question: string; answer: string };

/**
 * RAG 閻儴鐦戞惔鎾搭梾缁憋拷 + AI 閸愬懎顔愰悽鐔稿灇/娴滃鐤勯弽鍛婄叀閹恒儱褰�
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
    return NextResponse.json({ error: "query 娑撳秷鍏樻稉铏光敄" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "閺堫亪鍘ょ純锟� GEMINI_API_KEY" }, { status: 500 });
  }

  // 閳光偓閳光偓 1. 娴狅拷 products 鐞涖劍顥呯槐銏㈢叀鐠囧棗绨� 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
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

  // 缁犫偓閺勬挸鍙ч柨顔跨槤閻╃ǹ鍙ч幀褑鐦庨崚鍡礄閸欘垱娴涢幑顫礋 embedding閿涳拷
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

  // 閳光偓閳光偓 2. 閺嬪嫬缂� RAG 娑撳﹣绗呴弬锟� 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
  const contextChunks: string[] = [];
  const usedNames: string[] = [];
  let faqsUsed = 0;

  for (const p of scoredProducts) {
    const name = p.nameEn ?? p.nameZh ?? "Unknown";
    usedNames.push(name);

    const chunk = [
      `[娴溠冩惂] ${name}`,
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

  // 閳光偓閳光偓 3. 閺嬪嫬缂� Prompt 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
  let prompt: string;

  if (mode === "factcheck") {
    prompt = `娴ｇ姵妲稿銉ょ瑹閸掑爼鈧姾顢戞稉姘瑩娑撴艾顓搁弽鍝ョ椽鏉堟垯鈧拷

閵嗘劗顫嗛張澶夐獓閸濅胶鐓＄拠鍡楃氨閿涘牊娼堟繛浣稿棘閼板喛绱氶妴锟�
${ragContext || "閿涘牏鐓＄拠鍡楃氨娑撹櫣鈹栭敍锟�"}

---
閵嗘劕绶熺€光剝鐗抽崘鍛啇閵嗭拷
${body.content ?? query}

---
鐠囩兘鈧劕褰為弽鍛婄叀閿涘奔浜� JSON 閺嶇厧绱℃潻鏂挎礀閿涘牅寮楅弽濂镐紥鐎瑰牊顒濈紒鎾寸€敍灞肩瑝鐟曚浇袙闁插⿵绱氶敍锟�
{
  "overallScore": 85,
  "issues": [
    {
      "severity": "high",
      "quote": "閸樼喐鏋冩稉顓犳畱閸忚渹缍嬪▓浣冩儰閹存牕褰炵€涳拷",
      "issue": "闂傤噣顣界拠瀛樻",
      "suggestion": "瀵ら缚顔呮穱顔芥暭娑擄拷"
    }
  ],
  "positives": ["閸嬫艾绶辨總鐣屾畱閸︾増鏌�"],
  "summary": "閺佺繝缍嬬€光剝鐗抽幇蹇氼潌"
}`;
  } else {
    prompt = `娴ｇ姵妲告稉鎾茬瑹瀹搞儰绗熸径鏍敜閸愬懎顔愭担婊冾啀閿涘苯褰ч懗钘夌唨娴滃簼浜掓稉瀣潌閺堝鐓＄拠鍡楃氨閸愭瑤缍旈敍灞煎紬缁備浇娅勯弸鍕Η閺堫垰寮弫鑸偓锟�

閵嗘劗顫嗛張澶夐獓閸濅胶鐓＄拠鍡楃氨閵嗭拷
${ragContext || "閿涘牏鐓＄拠鍡楃氨娑撹櫣鈹栭敍宀冾嚞閸忓牆婀禍褍鎼х粻锛勬倞娑擃厼锝為崘娆庨獓閸濅浇顕涢幆鍜冪礆"}

---
閵嗘劙娓跺Ч鍌樷偓锟�${query}

鐠囪渹浜� JSON 閺嶇厧绱℃潻鏂挎礀閿涳拷
{
  "content": "閻㈢喐鍨氶惃鍕閺傚洤鍞寸€癸拷",
  "usedSources": ["瀵洜鏁ら惃鍕獓閸濅礁鎮曠粔鏉垮灙鐞涳拷"]
}`;
  }

  // 閳光偓閳光偓 4. 鐠嬪啰鏁� Gemini 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
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
      return NextResponse.json({ error: `Gemini API 闁挎瑨顕�: ${errText}` }, { status: 502 });
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
      { error: "AI 閺堝秴濮熺拫鍐暏婢惰精瑙�", detail: String(error) },
      { status: 500 }
    );
  }
}

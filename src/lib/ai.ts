import { env } from "@/env";

// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//  Types
// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

type ProductCopyInput = {
  industry: string;
  nameZh: string;
  shortDescriptionZh?: string;
  defaultFields?: Record<string, string>;
};

type InquiryReplyInput = {
  customerName: string;
  companyName?: string;
  message: string;
  productName?: string;
  specs?: string[];
  tone?: string;
};

type InquiryClassifyInput = {
  message: string;
  productName?: string;
};

export type ProductCopyResult = {
  nameEn: string;
  shortDescriptionEn: string;
  detailsEn: string;
  seoTitle: string;
  seoDescription: string;
};

/** 鍝釜 AI 鎻愪緵鍟嗗疄闄呮墽琛屼簡璇锋眰 */
export type AiProvider = "gemini" | "deepseek" | "fallback";

// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//  Provider Detection
// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export function hasGemini(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function hasDeepSeek(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY?.trim());
}

export function getActiveProvider(): AiProvider {
  if (hasGemini()) return "gemini";
  if (hasDeepSeek()) return "deepseek";
  return "fallback";
}

export function hasAiConfig(): boolean {
  return hasGemini() || hasDeepSeek();
}

// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//  Prompt Builders
// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

function extractMeaningfulTerms(defaultFields?: Record<string, string>) {
  return Object.values(defaultFields ?? {})
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export function buildProductCopyPrompt(input: ProductCopyInput) {
  const terms = extractMeaningfulTerms(input.defaultFields);
  return {
    system:
      "You write concise, conversion-oriented English copy for industrial manufacturing websites. Keep wording factual, export-ready, and SEO-aware.",
    user: [
      `Industry: ${input.industry}`,
      `Chinese product name: ${input.nameZh}`,
      `Chinese short description: ${input.shortDescriptionZh?.trim() || "N/A"}`,
      `Known specs: ${terms.join("; ") || "N/A"}`,
      "Return JSON with exactly these keys: nameEn, shortDescriptionEn, detailsEn, seoTitle, seoDescription.",
    ].join("\n"),
  };
}

export function buildInquiryReplyPrompt(input: InquiryReplyInput) {
  return {
    system:
      "You draft professional English sales replies for manufacturing inquiries. Keep them concise, clear, and safe for human review before sending.",
    user: [
      `Customer name: ${input.customerName}`,
      `Company: ${input.companyName || "N/A"}`,
      `Inquiry: ${input.message}`,
      `Product: ${input.productName || "N/A"}`,
      `Specs: ${(input.specs ?? []).join("; ") || "N/A"}`,
      `Tone: ${input.tone || "professional"}`,
      "Return plain English email text only. Do not add JSON or markdown.",
    ].join("\n"),
  };
}

export function buildClassifyInquiryPrompt(input: InquiryClassifyInput) {
  return {
    system:
      "Classify manufacturing inquiry emails into one of: quotation, technical, sample, complaint, partnership, other. Reply with a single word only.",
    user: [
      `Product: ${input.productName || "N/A"}`,
      `Message: ${input.message}`,
    ].join("\n"),
  };
}

// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//  Local Fallbacks
// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

function inferEnglishName(input: ProductCopyInput) {
  const terms = extractMeaningfulTerms(input.defaultFields);
  const materialTerm = terms.find((t) =>
    /aluminum|steel|stainless|metal|plastic/i.test(t),
  );
  const processTerm = terms.find((t) =>
    /cnc|machining|milling|turning|casting|fabrication/i.test(t),
  );
  const base = input.nameZh.trim() || "Custom Product";

  if (materialTerm && processTerm) return `${materialTerm} ${processTerm} Part`;
  if (materialTerm) return `${materialTerm} OEM Component`;
  return base === "Custom Product" ? "Custom Industrial Component" : `Custom ${base}`;
}

export function buildFallbackProductCopy(input: ProductCopyInput): ProductCopyResult {
  const nameEn = inferEnglishName(input);
  const terms = extractMeaningfulTerms(input.defaultFields);
  const application = input.defaultFields?.application?.trim() || "industrial applications";

  return {
    nameEn,
    shortDescriptionEn: `${nameEn} built for ${application} with export-ready quality control.`,
    detailsEn: `This ${input.industry} product supports OEM and custom manufacturing requirements. Key highlights include ${terms.join(", ") || "stable quality, responsive communication, and export support"}.`,
    seoTitle: `${nameEn} Manufacturer | China Export Supplier`,
    seoDescription: `${nameEn} from a China manufacturer for ${application}. Ask for drawings, MOQ, lead time, and export quotations.`,
  };
}

export function buildFallbackInquiryReply(input: InquiryReplyInput) {
  const senderName = env.BREVO_TO_EMAIL.split("@")[0] || "Sales Team";
  const lines = [
    `Dear ${input.customerName},`,
    "",
    `Thank you for your inquiry${input.productName ? ` about ${input.productName}` : ""}.`,
    input.companyName ? `We appreciate the opportunity to support ${input.companyName}.` : "",
    `We have reviewed your message and will prepare a tailored response.`,
    input.specs?.length
      ? `Based on the specifications: ${input.specs.join("; ")}.`
      : "",
    "Please share your target quantity, drawings, and delivery destination so we can prepare an accurate quotation.",
    "",
    "Best regards,",
    senderName,
  ].filter(Boolean);

  return lines.join("\n");
}

// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//  Gemini 2.5 Flash
// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

const GEMINI_MODEL = "gemini-2.5-flash-preview-04-17";

async function callGeminiText(prompt: {
  system: string;
  user: string;
}): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: prompt.system }] },
        contents: [{ role: "user", parts: [{ text: prompt.user }] }],
        generationConfig: { temperature: 0.4 },
      }),
    });

    if (!response.ok) {
      console.warn("[ai] Gemini error:", response.status, await response.text());
      return null;
    }

    const json = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
  } catch (error) {
    console.warn("[ai] Gemini fetch failed:", error);
    return null;
  }
}

async function callGeminiJson<T>(
  prompt: { system: string; user: string },
  fallback: T,
): Promise<{ result: T; provider: AiProvider }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return { result: fallback, provider: "fallback" };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: prompt.system }] },
        contents: [{ role: "user", parts: [{ text: prompt.user }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      console.warn("[ai] Gemini JSON error:", response.status);
      return { result: fallback, provider: "fallback" };
    }

    const json = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) return { result: fallback, provider: "fallback" };

    try {
      return { result: JSON.parse(text) as T, provider: "gemini" };
    } catch {
      return { result: fallback, provider: "fallback" };
    }
  } catch (error) {
    console.warn("[ai] Gemini JSON fetch failed:", error);
    return { result: fallback, provider: "fallback" };
  }
}

// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//  DeepSeek (OpenAI compatible)
// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

async function callDeepSeekText(prompt: {
  system: string;
  user: string;
}): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const response = await fetch(DEEPSEEK_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      console.warn("[ai] DeepSeek error:", response.status);
      return null;
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return json.choices?.[0]?.message?.content?.trim() ?? null;
  } catch (error) {
    console.warn("[ai] DeepSeek fetch failed:", error);
    return null;
  }
}

async function callDeepSeekJson<T>(
  prompt: { system: string; user: string },
  fallback: T,
): Promise<{ result: T; provider: AiProvider }> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return { result: fallback, provider: "fallback" };

  try {
    const response = await fetch(DEEPSEEK_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: prompt.system },
          {
            role: "user",
            content:
              prompt.user + "\n\nRespond with valid JSON only, no markdown fences.",
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.warn("[ai] DeepSeek JSON error:", response.status);
      return { result: fallback, provider: "fallback" };
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content?.trim();

    if (!text) return { result: fallback, provider: "fallback" };

    try {
      return { result: JSON.parse(text) as T, provider: "deepseek" };
    } catch {
      return { result: fallback, provider: "fallback" };
    }
  } catch (error) {
    console.warn("[ai] DeepSeek JSON fetch failed:", error);
    return { result: fallback, provider: "fallback" };
  }
}

// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//  Unified Callers (Gemini 鈫?DeepSeek 鈫?Fallback)
// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

async function callAiText(prompt: {
  system: string;
  user: string;
}): Promise<{ text: string; provider: AiProvider }> {
  // 1. Gemini
  if (hasGemini()) {
    const text = await callGeminiText(prompt);
    if (text) return { text, provider: "gemini" };
  }

  // 2. DeepSeek
  if (hasDeepSeek()) {
    const text = await callDeepSeekText(prompt);
    if (text) return { text, provider: "deepseek" };
  }

  return { text: "", provider: "fallback" };
}

async function callAiJson<T>(
  prompt: { system: string; user: string },
  fallback: T,
): Promise<{ result: T; provider: AiProvider }> {
  // 1. Gemini
  if (hasGemini()) {
    const { result, provider } = await callGeminiJson(prompt, fallback);
    if (provider !== "fallback") return { result, provider };
  }

  // 2. DeepSeek
  if (hasDeepSeek()) {
    const { result, provider } = await callDeepSeekJson(prompt, fallback);
    if (provider !== "fallback") return { result, provider };
  }

  return { result: fallback, provider: "fallback" };
}

// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
//  Public API
// 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export async function generateProductCopy(input: ProductCopyInput): Promise<{
  result: ProductCopyResult;
  provider: AiProvider;
}> {
  return callAiJson(buildProductCopyPrompt(input), buildFallbackProductCopy(input));
}

export async function generateInquiryReply(input: InquiryReplyInput): Promise<{
  reply: string;
  provider: AiProvider;
}> {
  const { text, provider } = await callAiText(buildInquiryReplyPrompt(input));

  if (provider !== "fallback" && text) {
    return { reply: text, provider };
  }

  return { reply: buildFallbackInquiryReply(input), provider: "fallback" };
}

export async function classifyInquiry(input: InquiryClassifyInput): Promise<{
  inquiryType: string;
  provider: AiProvider;
}> {
  const { text, provider } = await callAiText(buildClassifyInquiryPrompt(input));

  const validTypes = ["quotation", "technical", "sample", "complaint", "partnership", "other"];
  const cleaned = text.toLowerCase().trim().replace(/[^a-z]/g, "");
  const matched = validTypes.find((t) => t === cleaned);

  return {
    inquiryType: matched ?? "other",
    provider: matched ? provider : "fallback",
  };
}

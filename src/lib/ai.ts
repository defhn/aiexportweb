// ══════════════════════════════════════════════════════════════════════════════
//  AI 调用层 - Gemini / DeepSeek / Fallback
//  鉴权策略：
//    Gemini 优先尝试 Vertex AI（Service Account JSON），
//    其次尝试 AI Studio（AIza... key via generativelanguage API），
//    再次尝试 DeepSeek，最后使用本地 fallback 模板。
// ══════════════════════════════════════════════════════════════════════════════

import { env } from "@/env";

// ──────────────────────────────────────────────────────────
//  Types
// ──────────────────────────────────────────────────────────

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

/** 实际执行了请求的 AI 提供商 */
export type AiProvider = "gemini" | "deepseek" | "fallback";

// ──────────────────────────────────────────────────────────
//  Provider Detection
// ──────────────────────────────────────────────────────────

export function hasGeminiServiceAccount(): boolean {
  return Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.trim());
}

export function hasGeminiAiStudio(): boolean {
  const k = process.env.GEMINI_API_KEY?.trim() ?? "";
  // AI Studio Key 格式为 AIza...，Vertex Express 为 AQ.
  return k.startsWith("AIza");
}

export function hasVertexExpressKey(): boolean {
  const k = process.env.GEMINI_API_KEY?.trim() ?? "";
  return k.startsWith("AQ.");
}

export function hasGemini(): boolean {
  return hasGeminiServiceAccount() || hasGeminiAiStudio() || hasVertexExpressKey();
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

// ──────────────────────────────────────────────────────────
//  Vertex AI 鉴权 - Service Account JWT → Access Token
// ──────────────────────────────────────────────────────────

type ServiceAccountKey = {
  client_email: string;
  private_key: string;
  project_id: string;
};

/**
 * 手动实现 Service Account → Access Token（无需 google-auth-library SDK）
 * 使用 jose 库（已安装）创建 JWT 并向 Google OAuth2 换取 Bearer Token
 */
async function getVertexAccessToken(): Promise<string | null> {
  const credJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.trim();
  if (!credJson) return null;

  try {
    const cred = JSON.parse(credJson) as ServiceAccountKey;

    // 1. 构建 JWT（Service Account 格式）
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: cred.client_email,
      sub: cred.client_email,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
      scope: "https://www.googleapis.com/auth/cloud-platform",
    };

    // 2. 用 jose 签名（RSA-SHA256）
    const { SignJWT, importPKCS8 } = await import("jose");
    const privateKey = await importPKCS8(cred.private_key, "RS256");
    const jwt = await new SignJWT(payload)
      .setProtectedHeader(header)
      .sign(privateKey);

    // 3. 向 Google 换取 Access Token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!tokenResponse.ok) {
      console.warn("[ai] Service Account token fetch failed:", tokenResponse.status, await tokenResponse.text());
      return null;
    }

    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    return tokenData.access_token ?? null;
  } catch (error) {
    console.warn("[ai] Service Account JWT error:", error);
    return null;
  }
}

// ──────────────────────────────────────────────────────────
//  Gemini 配置
// ──────────────────────────────────────────────────────────

const GEMINI_MODEL = "gemini-2.5-flash-preview-04-17";
const VERTEX_PROJECT = process.env.VERTEX_PROJECT_ID ?? "huachuanghub";
const VERTEX_LOCATION = process.env.VERTEX_LOCATION ?? "us-central1";

// Vertex AI 端点（Service Account 鉴权）
function buildVertexUrl(model: string) {
  return `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:generateContent`;
}

// AI Studio 端点（AIza... Key 鉴权）
function buildAiStudioUrl(model: string, apiKey: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
}

// Vertex AI Express 端点（AQ. Key 鉴权，使用 x-goog-api-key header）
function buildVertexExpressUrl(model: string) {
  return `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT}/locations/${VERTEX_LOCATION}/publishers/google/models/${model}:generateContent`;
}

// ──────────────────────────────────────────────────────────
//  Prompt Builders
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
//  Gemini 调用实现（三种鉴权模式统一入口）
// ──────────────────────────────────────────────────────────

type GeminiRequestBody = {
  systemInstruction: { parts: Array<{ text: string }> };
  contents: Array<{ role: string; parts: Array<{ text: string }> }>;
  generationConfig?: Record<string, unknown>;
};

async function doGeminiFetch(
  url: string,
  headers: Record<string, string>,
  body: GeminiRequestBody,
): Promise<{ candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> } | null> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.warn("[ai] Gemini error:", response.status, await response.text());
      return null;
    }

    return response.json() as Promise<{ candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }>;
  } catch (error) {
    console.warn("[ai] Gemini fetch failed:", error);
    return null;
  }
}

/**
 * 尝试所有 Gemini 鉴权方式，返回原始响应体。
 * 优先级：1) Service Account JWT → 2) AI Studio Key → 3) Vertex Express Key
 */
async function callGeminiRaw(
  body: GeminiRequestBody,
): Promise<{ candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> } | null> {
  // 方案 1: Service Account (最推荐，企业级)
  if (hasGeminiServiceAccount()) {
    const token = await getVertexAccessToken();
    if (token) {
      const url = buildVertexUrl(GEMINI_MODEL);
      const result = await doGeminiFetch(url, { Authorization: `Bearer ${token}` }, body);
      if (result) return result;
    }
  }

  // 方案 2: AI Studio Key（AIza... 格式）
  if (hasGeminiAiStudio()) {
    const key = process.env.GEMINI_API_KEY!.trim();
    const url = buildAiStudioUrl(GEMINI_MODEL, key);
    const result = await doGeminiFetch(url, {}, body);
    if (result) return result;
  }

  // 方案 3: Vertex AI Express Key（AQ. 格式，通过 x-goog-api-key header）
  if (hasVertexExpressKey()) {
    const key = process.env.GEMINI_API_KEY!.trim();
    const url = buildVertexExpressUrl(GEMINI_MODEL);
    const result = await doGeminiFetch(url, { "x-goog-api-key": key }, body);
    if (result) return result;
  }

  return null;
}

async function callGeminiText(prompt: { system: string; user: string }): Promise<string | null> {
  if (!hasGemini()) return null;

  const json = await callGeminiRaw({
    systemInstruction: { parts: [{ text: prompt.system }] },
    contents: [{ role: "user", parts: [{ text: prompt.user }] }],
    generationConfig: { temperature: 0.4 },
  });

  return json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
}

async function callGeminiJson<T>(
  prompt: { system: string; user: string },
  fallback: T,
): Promise<{ result: T; provider: AiProvider }> {
  if (!hasGemini()) return { result: fallback, provider: "fallback" };

  const json = await callGeminiRaw({
    systemInstruction: { parts: [{ text: prompt.system }] },
    contents: [{ role: "user", parts: [{ text: prompt.user }] }],
    generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
  });

  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) return { result: fallback, provider: "fallback" };

  try {
    // 移除可能残留的 markdown 代码块标记
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    return { result: JSON.parse(cleaned) as T, provider: "gemini" };
  } catch {
    return { result: fallback, provider: "fallback" };
  }
}

// ──────────────────────────────────────────────────────────
//  DeepSeek (OpenAI compatible)
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
//  Local Fallbacks
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
//  Unified Callers (Gemini → DeepSeek → Fallback)
// ──────────────────────────────────────────────────────────

async function callAiText(prompt: {
  system: string;
  user: string;
}): Promise<{ text: string; provider: AiProvider }> {
  // 1. Gemini（多种鉴权方式自动尝试）
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

// ──────────────────────────────────────────────────────────
//  Public API
// ──────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────
//  RAG 增强版询盘回复（核心升级）
//  在生成前自动检索：产品知识 + 企业能力知识 + 回复风格模板
// ──────────────────────────────────────────────────────────

type InquiryReplyWithRagInput = InquiryReplyInput & {
  productId?: number;
  inquiryType?: string;
};

export async function generateInquiryReplyWithRag(
  input: InquiryReplyWithRagInput,
): Promise<{
  reply: string;
  provider: AiProvider;
  ragMeta: {
    productsUsed: string[];
    faqsUsed: number;
    usedEmbedding: boolean;
    hasCompanyKnowledge: boolean;
    hasTemplates: boolean;
  };
}> {
  // 动态引入避免循环依赖
  const { buildRagContext } = await import("@/lib/rag-utils");

  // 以询盘消息 + 产品名作为检索 query
  const searchQuery = [input.productName, input.message].filter(Boolean).join(" ").slice(0, 500);

  const { context: ragContext, meta } = await buildRagContext({
    query: searchQuery,
    inquiryType: input.inquiryType,
    includeCompanyKnowledge: true,
    includeReplyTemplates: true,
    topK: 5,
  });

  // 构建带 RAG 上下文的 Prompt
  const ragPrompt = {
    system: `You draft professional English sales replies for manufacturing export inquiries.
Keep them concise, accurate, and safe for human review before sending.
IMPORTANT: Only include facts that are explicitly supported by the knowledge base below.
Do NOT invent specifications, certifications, prices, or lead times that are not mentioned.`,
    user: [
      "=== Knowledge Base ===",
      ragContext,
      "=== Reply Task ===",
      `Customer: ${input.customerName}`,
      `Company: ${input.companyName || "N/A"}`,
      `Inquiry: ${input.message}`,
      `Product: ${input.productName || "N/A"}`,
      `Specs mentioned: ${(input.specs ?? []).join("; ") || "N/A"}`,
      `Tone: ${input.tone || "professional"}`,
      "",
      "Write a professional email reply. Use facts from the knowledge base above when relevant. Return plain text only, no JSON, no markdown.",
    ].join("\n"),
  };

  // 调用 AI（Gemini → DeepSeek → fallback）
  const { text, provider } = await callAiText(ragPrompt);

  if (provider !== "fallback" && text) {
    return { reply: text, provider, ragMeta: meta };
  }

  // 降级：使用基础模板
  return {
    reply: buildFallbackInquiryReply(input),
    provider: "fallback",
    ragMeta: meta,
  };
}

// ──────────────────────────────────────────────────────────
//  RAG 增强版产品文案生成
//  注入同品类其他产品知识，让文案更有针对性
// ──────────────────────────────────────────────────────────

export async function generateProductCopyWithRag(
  input: ProductCopyInput,
): Promise<{
  result: ProductCopyResult;
  provider: AiProvider;
  ragMeta: {
    productsUsed: string[];
    usedEmbedding: boolean;
  };
}> {
  const { buildRagContext } = await import("@/lib/rag-utils");

  const searchQuery = [input.nameZh, input.shortDescriptionZh]
    .filter(Boolean)
    .join(" ")
    .slice(0, 400);

  const { context: ragContext, meta } = await buildRagContext({
    query: searchQuery,
    includeCompanyKnowledge: true,
    includeReplyTemplates: false,
    topK: 4,
  });

  const terms = Object.values(input.defaultFields ?? {})
    .map((v) => String(v).trim())
    .filter(Boolean)
    .slice(0, 4);

  const ragPrompt = {
    system:
      "You write concise, conversion-oriented English copy for industrial manufacturing export websites. Keep wording factual, export-ready, and SEO-aware. Only include verified specs from the knowledge base.",
    user: [
      "=== Company & Product Knowledge Base ===",
      ragContext,
      "=== New Product to Write Copy For ===",
      `Industry: ${input.industry}`,
      `Chinese product name: ${input.nameZh}`,
      `Chinese short description: ${input.shortDescriptionZh?.trim() || "N/A"}`,
      `Known specs: ${terms.join("; ") || "N/A"}`,
      "",
      'Return JSON with exactly these keys: nameEn, shortDescriptionEn, detailsEn, seoTitle, seoDescription.',
    ].join("\n"),
  };

  const { result, provider } = await callAiJson<ProductCopyResult>(
    ragPrompt,
    buildFallbackProductCopy(input),
  );

  return {
    result,
    provider,
    ragMeta: {
      productsUsed: meta.productsUsed,
      usedEmbedding: meta.usedEmbedding,
    },
  };
}


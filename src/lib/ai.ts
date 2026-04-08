import { env } from "@/env";

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

type AiPrompt = {
  system: string;
  user: string;
};

export type ProductCopyResult = {
  nameEn: string;
  shortDescriptionEn: string;
  detailsEn: string;
  seoTitle: string;
  seoDescription: string;
};

function getDefaultModel() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

function getChatCompletionsUrl() {
  return process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1/chat/completions";
}

export function hasAiConfig() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function extractMeaningfulTerms(defaultFields?: Record<string, string>) {
  return Object.values(defaultFields ?? {})
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export function buildProductCopyPrompt(input: ProductCopyInput): AiPrompt {
  const terms = extractMeaningfulTerms(input.defaultFields);

  return {
    system:
      "You write concise, conversion-oriented English copy for industrial manufacturing websites. Keep wording factual, export-ready, and SEO-aware.",
    user: [
      `Industry: ${input.industry}`,
      `Chinese product name: ${input.nameZh}`,
      `Chinese short description: ${input.shortDescriptionZh?.trim() || "N/A"}`,
      `Known specs: ${terms.join("; ") || "N/A"}`,
      "Return JSON with keys nameEn, shortDescriptionEn, detailsEn, seoTitle, seoDescription.",
    ].join("\n"),
  };
}

function inferEnglishName(input: ProductCopyInput) {
  const terms = extractMeaningfulTerms(input.defaultFields);
  const materialTerm = terms.find((term) => /aluminum|steel|stainless|metal|plastic/i.test(term));
  const processTerm = terms.find((term) => /cnc|machining|milling|turning|casting|fabrication/i.test(term));
  const base = input.nameZh.trim() || "Custom Product";

  if (materialTerm && processTerm) {
    return `${materialTerm} ${processTerm} Part`;
  }

  if (materialTerm) {
    return `${materialTerm} OEM Component`;
  }

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

export function buildInquiryReplyPrompt(input: InquiryReplyInput): AiPrompt {
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
      "Return plain English email text only.",
    ].join("\n"),
  };
}

export function buildFallbackInquiryReply(input: InquiryReplyInput) {
  const lines = [
    `Dear ${input.customerName},`,
    "",
    `Thank you for your inquiry${input.productName ? ` about ${input.productName}` : ""}.`,
    input.companyName ? `We appreciate the opportunity to support ${input.companyName}.` : "",
    `We have reviewed your message: "${input.message.trim()}".`,
    input.specs?.length ? `Based on the current information, here are the available details: ${input.specs.join("; ")}.` : "",
    "Please share your target quantity, drawings, and delivery destination so we can prepare an accurate quotation.",
    "",
    "Best regards,",
    env.BREVO_TO_EMAIL.split("@")[0] || "Sales Team",
  ].filter(Boolean);

  return lines.join("\n");
}

async function requestJsonFromAi<T>(prompt: AiPrompt, fallback: T): Promise<T> {
  if (!hasAiConfig()) {
    return fallback;
  }

  const response = await fetch(getChatCompletionsUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: getDefaultModel(),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
    }),
  });

  if (!response.ok) {
    return fallback;
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;

  if (!content) {
    return fallback;
  }

  try {
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export async function generateProductCopy(input: ProductCopyInput) {
  const fallback = buildFallbackProductCopy(input);
  return requestJsonFromAi<ProductCopyResult>(buildProductCopyPrompt(input), fallback);
}

export async function generateInquiryReply(input: InquiryReplyInput) {
  if (!hasAiConfig()) {
    return buildFallbackInquiryReply(input);
  }

  const response = await fetch(getChatCompletionsUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: getDefaultModel(),
      messages: [
        { role: "system", content: buildInquiryReplyPrompt(input).system },
        { role: "user", content: buildInquiryReplyPrompt(input).user },
      ],
    }),
  });

  if (!response.ok) {
    return buildFallbackInquiryReply(input);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return json.choices?.[0]?.message?.content?.trim() || buildFallbackInquiryReply(input);
}

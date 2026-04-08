import { normalizeCountryInput } from "@/lib/country";

export type InquiryClassification = {
  countryCode: string | null;
  countryGroup: string;
  sourceType: string;
  categoryTag: string | null;
  inquiryType: string;
  classificationMethod: "rule" | "ai" | "manual";
};

function normalizeText(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

export function inferSourceType(input: { sourcePage?: string | null; sourceUrl?: string | null }) {
  const sourcePage = normalizeText(input.sourcePage);
  const sourceUrl = normalizeText(input.sourceUrl);

  if (sourcePage.includes("product") || sourceUrl.includes("/products/")) {
    return "product";
  }

  if (sourcePage.includes("contact") || sourceUrl.endsWith("/contact")) {
    return "contact";
  }

  if (sourcePage.includes("blog") || sourceUrl.includes("/blog/")) {
    return "blog";
  }

  if (sourcePage.includes("quote") || sourceUrl.includes("/request-quote")) {
    return "quote";
  }

  return "general";
}

export function classifyInquiryByAiFallback(message?: string | null) {
  const text = normalizeText(message);

  if (/(quote|quotation|price|pricing|cost|rfq)/.test(text)) {
    return "quotation";
  }

  if (/(tolerance|drawing|spec|technical|capability|material|process)/.test(text)) {
    return "technical";
  }

  if (/(sample|prototype)/.test(text)) {
    return "sample";
  }

  if (/(distributor|distribution|agent|partnership|cooperation)/.test(text)) {
    return "cooperation";
  }

  if (/(after[- ]?sales|warranty|complaint|problem|issue)/.test(text)) {
    return "after-sales";
  }

  return "general";
}

export function classifyInquiryByRules(input: {
  country?: string | null;
  sourcePage?: string | null;
  sourceUrl?: string | null;
  categoryTag?: string | null;
  message?: string | null;
}): InquiryClassification {
  const country = normalizeCountryInput(input.country);

  return {
    countryCode: country.countryCode,
    countryGroup: country.countryGroup,
    sourceType: inferSourceType(input),
    categoryTag: input.categoryTag?.trim() || null,
    inquiryType: classifyInquiryByAiFallback(input.message),
    classificationMethod: "rule",
  };
}

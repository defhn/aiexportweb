import { buildAbsoluteUrl } from "./seo";

// 注意：buildOrganizationJsonLd 已移除，请在页面中直接使用 settings 数据动态构建

export function buildProductJsonLd(input: {
  name: string;
  description: string;
  category: string;
  url: string;
  imageUrl?: string;
  specs: Array<{ label: string; value: string }>;
  faqs: Array<{ question: string; answer: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    category: input.category,
    url: input.url,
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
    additionalProperty: input.specs.map((row) => ({
      "@type": "PropertyValue",
      name: row.label,
      value: row.value,
    })),
    mainEntity: input.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildArticleJsonLd(input: {
  headline: string;
  description: string;
  url: string;
  authorName?: string;
  publishedAt?: string;
  modifiedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.publishedAt,
    dateModified: input.modifiedAt ?? input.publishedAt,
    author: {
      "@type": "Organization",
      name: input.authorName ?? "Industrial Manufacturer",
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

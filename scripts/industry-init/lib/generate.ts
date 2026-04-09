/**
 * AI Generation Steps — all Gemini calls that produce structured data
 */
import { callGemini, parseJson } from "./gemini";
import type {
  IndustryConfig,
  AiCategory,
  AiProduct,
  AiBlogPost,
  AiPageModule,
  AiFaq,
  AiSiteSettings,
  ImageManifestItem,
  ImageStyle,
  ImagePurpose,
} from "../types";

const SYSTEM = `You are an expert B2B/B2C website content strategist and SEO copywriter.
Always respond with valid JSON only. No markdown, no explanation. Output the exact schema requested.`;

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function generateSiteSettings(
  config: IndustryConfig,
): Promise<AiSiteSettings> {
  const raw = await callGemini({
    system: SYSTEM,
    user: `Generate professional website settings for this business:
Industry: ${config.industry}
Business description: ${config.businessDescription}
Company name (English): ${config.company.nameEn}
Country: ${config.company.country}
Domain: ${config.domain}

Return JSON with this exact shape:
{
  "companyNameEn": "string (keep the provided name)",
  "companyNameCn": "string (generate a professional Chinese translation if not given)",
  "taglineEn": "string (compelling 8-12 word marketing tagline)",
  "taglineCn": "string (tagline in Chinese)",
  "metaTitleSuffixEn": "string (e.g. ' | BrandName' for page title suffix, max 20 chars)",
  "metaDescriptionEn": "string (homepage meta description, 145-155 characters, include industry keywords)",
  "canonicalBase": "${config.domain}"
}`,
  });
  return parseJson<AiSiteSettings>(raw);
}

// ─── Product Categories ───────────────────────────────────────────────────────

export async function generateCategories(
  config: IndustryConfig,
): Promise<AiCategory[]> {
  const count = config.categoryCount ?? 5;
  const raw = await callGemini({
    system: SYSTEM,
    user: `Generate ${count} product/service categories for a ${config.industry} website.
Business: ${config.businessDescription}
Target market: ${config.company.country}

Return a JSON array of ${count} objects, each with:
{
  "nameEn": "string (2-4 words, title case)",
  "nameCn": "string (Chinese translation)",
  "slug": "string (kebab-case, URL-safe, no special chars)",
  "summaryEn": "string (1-2 sentences describing this category, SEO-rich)",
  "summaryCn": "string (Chinese translation of summary)",
  "sortOrder": number (10, 20, 30...),
  "isFeatured": boolean (true for first 3)
}`,
  });
  return parseJson<AiCategory[]>(raw);
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function generateProducts(
  config: IndustryConfig,
  categories: AiCategory[],
): Promise<AiProduct[]> {
  const count = config.productCount ?? 10;
  const catList = categories.map((c) => `${c.nameEn} (slug: ${c.slug})`).join(", ");

  const raw = await callGemini({
    system: SYSTEM,
    user: `Generate ${count} realistic ${config.industry} products/services as demo content.
Business: ${config.businessDescription}
Available categories: ${catList}

Distribute products across all categories evenly.
Return a JSON array of ${count} objects, each with:
{
  "nameEn": "string (realistic product name, 3-6 words)",
  "nameCn": "string (Chinese product name)",
  "slug": "string (kebab-case, unique)",
  "categorySlug": "string (must match one of the provided category slugs)",
  "shortDescriptionEn": "string (1-2 sentences for product card, 80-120 chars)",
  "shortDescriptionCn": "string (Chinese translation)",
  "detailsEn": "string (2-3 paragraphs of product detail HTML using <p> and <ul> tags, SEO-rich, 200-350 words)",
  "detailsCn": "string (Chinese translation of details HTML)",
  "seoTitle": "string (50-60 chars, include product name and industry keyword)",
  "seoDescription": "string (145-155 chars, compelling, include CTAs)",
  "sortOrder": number (10, 20, 30...),
  "isFeatured": boolean (true for first 3),
  "specs": [
    { "labelEn": "string", "valueEn": "string" }
  ]
}

Specs should be realistic for the industry (3-6 spec rows per product).`,
    maxOutputTokens: 16000,
  });
  return parseJson<AiProduct[]>(raw);
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function generateBlogPosts(
  config: IndustryConfig,
  categories: AiCategory[],
): Promise<AiBlogPost[]> {
  const count = config.blogPostCount ?? 3;
  const catList = categories.map((c) => c.slug).join(", ");

  const raw = await callGemini({
    system: SYSTEM,
    user: `Generate ${count} professional blog articles for a ${config.industry} website.
Business: ${config.businessDescription}
Category slugs (pick any for categorySlug): ${catList}

Each article should be genuinely helpful, SEO-optimized, and relevant to the industry.
Topics should vary: how-to guide, industry trends, buyer's guide, etc.

Return a JSON array of ${count} objects:
{
  "titleEn": "string (compelling blog title, 5-10 words, use power words)",
  "titleCn": "string (Chinese title)",
  "slug": "string (kebab-case, unique, SEO-friendly)",
  "excerptEn": "string (2-sentence summary, 120-150 chars)",
  "excerptCn": "string (Chinese excerpt)",
  "contentEn": "string (full article HTML, 500-700 words, use <h2>, <h3>, <p>, <ul>, <li> tags, no <html>/<body> tags)",
  "contentCn": "string (Chinese translation of content HTML)",
  "categorySlug": "string (pick the most relevant from the list above)",
  "tags": ["string", "..."] (3-5 relevant tags),
  "publishedAt": "string (ISO date, within last 90 days)"
}`,
    maxOutputTokens: 16000,
  });
  return parseJson<AiBlogPost[]>(raw);
}

// ─── FAQs ──────────────────────────────────────────────────────────────────────

export async function generateFaqs(config: IndustryConfig): Promise<AiFaq[]> {
  const count = config.faqCount ?? 8;
  const raw = await callGemini({
    system: SYSTEM,
    user: `Generate ${count} realistic FAQ items for a ${config.industry} website.
Business: ${config.businessDescription}
Target audience: buyers/customers from ${config.company.country} and internationally.

Mix question types: shipping, quality, payment, MOQ, customization, returns, certifications, etc.

Return a JSON array of ${count} objects:
{
  "question": "string (natural customer question in English)",
  "answer": "string (clear, helpful answer, 2-4 sentences)"
}`,
  });
  return parseJson<AiFaq[]>(raw);
}

// ─── Page Modules ─────────────────────────────────────────────────────────────

export async function generatePageModules(
  config: IndustryConfig,
  categories: AiCategory[],
): Promise<{ home: AiPageModule[]; about: AiPageModule[]; contact: AiPageModule[] }> {
  const catNames = categories
    .slice(0, 3)
    .map((c) => c.nameEn)
    .join(", ");

  const raw = await callGemini({
    system: SYSTEM,
    user: `Generate page content modules for a ${config.industry} website.
Company: ${config.company.nameEn}
Tagline context: ${config.businessDescription}
Top categories: ${catNames}
Domain: ${config.domain}

Return JSON with this exact structure:
{
  "home": [
    {
      "moduleKey": "hero",
      "moduleNameZh": "首屏横幅",
      "moduleNameEn": "Hero Banner",
      "isEnabled": true,
      "sortOrder": 10,
      "payloadJson": {
        "eyebrow": "string (short eyebrow text, 3-6 words)",
        "title": "string (main headline, 6-12 words, powerful)",
        "description": "string (2-sentence value proposition)",
        "primaryCtaLabel": "string (e.g. Get a Quote / Shop Now / Learn More)",
        "primaryCtaHref": "/contact",
        "secondaryCtaLabel": "string",
        "secondaryCtaHref": "/products"
      }
    },
    {
      "moduleKey": "strengths",
      "moduleNameZh": "核心优势",
      "moduleNameEn": "Core Strengths",
      "isEnabled": true,
      "sortOrder": 20,
      "payloadJson": {
        "items": ["string x4 — key differentiators, each 8-15 words"]
      }
    },
    {
      "moduleKey": "trust-signals",
      "moduleNameZh": "品牌背书",
      "moduleNameEn": "Trust Signals",
      "isEnabled": true,
      "sortOrder": 30,
      "payloadJson": {
        "title": "string (social proof headline)",
        "items": ["string x5 — well-known brand names relevant to this industry"]
      }
    },
    {
      "moduleKey": "process",
      "moduleNameZh": "合作流程",
      "moduleNameEn": "How It Works",
      "isEnabled": true,
      "sortOrder": 40,
      "payloadJson": {
        "title": "string",
        "steps": [
          { "title": "string", "description": "string (1-2 sentences)" }
        ]
      }
    }
  ],
  "about": [
    {
      "moduleKey": "about-hero",
      "moduleNameZh": "关于页标题",
      "moduleNameEn": "About Hero",
      "isEnabled": true,
      "sortOrder": 10,
      "payloadJson": {
        "title": "string (about page headline)",
        "description": "string (2-3 sentences company introduction)"
      }
    },
    {
      "moduleKey": "about-story",
      "moduleNameZh": "公司故事",
      "moduleNameEn": "Company Story",
      "isEnabled": true,
      "sortOrder": 20,
      "payloadJson": {
        "title": "string",
        "content": "string (3-4 sentences telling the brand story)"
      }
    }
  ],
  "contact": [
    {
      "moduleKey": "contact-hero",
      "moduleNameZh": "联系页标题",
      "moduleNameEn": "Contact Hero",
      "isEnabled": true,
      "sortOrder": 10,
      "payloadJson": {
        "title": "string (e.g. Get in Touch)",
        "description": "string (1-2 sentences)"
      }
    }
  ]
}`,
    maxOutputTokens: 8192,
  });
  return parseJson<{ home: AiPageModule[]; about: AiPageModule[]; contact: AiPageModule[] }>(raw);
}

// ─── Image Manifest ───────────────────────────────────────────────────────────

export async function generateImageManifest(
  config: IndustryConfig,
  categories: AiCategory[],
  products: AiProduct[],
  blogPosts: AiBlogPost[],
): Promise<ImageManifestItem[]> {
  const catList = categories
    .map((c) => `${c.nameEn} (slug:${c.slug})`)
    .join(", ");
  const prodList = products
    .slice(0, 10)
    .map((p) => `${p.nameEn} (slug:${p.slug})`)
    .join(", ");
  const blogList = blogPosts
    .map((b) => `${b.titleEn} (slug:${b.slug})`)
    .join(", ");

  const raw = await callGemini({
    system: SYSTEM,
    user: `Generate a complete image generation manifest for a ${config.industry} website.
Business: ${config.businessDescription}
Categories: ${catList}
Products (pick representative ones): ${prodList}
Blog posts: ${blogList}

For each image decide the optimal visual style and write a detailed, specific prompt.

Style options: "photorealistic" | "3d_render" | "editorial_3d" | "flat_illustration" | "corporate_photo"
Purpose options: "homepage_hero" | "category_cover" | "product_main" | "blog_cover" | "about_hero"

Rules:
- Hero images: 1920x1080, photorealistic or 3d_render
- Category covers: 800x600, photorealistic product flat lay
- Product images: 800x800, photorealistic or 3d_render, white/neutral background
- Blog covers: 1200x630, editorial_3d or photorealistic, wide crop
- About hero: 1200x800, corporate_photo

Generate images for:
- 1 homepage hero (large, dramatic)
- ${categories.length} category covers
- up to 6 product images (pick the featured/first products)
- ${blogPosts.length} blog covers  
- 1 about page hero

Return a JSON array, each item:
{
  "id": number (sequential starting at 1),
  "filename": "string (e.g. 001-hero-banner.webp, zero-padded 3 digits)",
  "purpose": "ImagePurpose string",
  "targetTable": "pageModules|productCategories|products|blogPosts|siteSettings",
  "targetKey": "string (moduleKey or slug)",
  "width": number,
  "height": number,
  "style": "ImageStyle string",
  "prompt": "string (detailed, specific prompt describing exactly what to show, lighting, composition, 30-60 words)",
  "status": "pending"
}`,
    maxOutputTokens: 8192,
  });

  const items = parseJson<ImageManifestItem[]>(raw);
  // Ensure sequential IDs
  return items.map((item, i) => ({ ...item, id: i + 1 }));
}

// ─── Frontend Adaptation Prompt ───────────────────────────────────────────────

export async function generateFrontendAdaptationPrompt(
  config: IndustryConfig,
  siteSettings: AiSiteSettings,
  categories: AiCategory[],
): Promise<string> {
  const catNames = categories.map((c) => c.nameEn).join(", ");

  const raw = await callGemini({
    system: `You are a senior Next.js 15 developer. Generate a comprehensive, detailed instruction prompt for an AI coding agent to adapt the visual design and frontend of a B2B website template from one industry to another. The output should be a long, detailed markdown prompt that the user can copy-paste directly to an AI agent (like Claude or Gemini). Output as plain text markdown, not JSON.`,
    user: `Generate a complete AI coding agent prompt to adapt a Next.js 15 website template to the ${config.industry} industry.

Context:
- Previous industry: Generic B2B Manufacturing (CNC machining focus)
- Target industry: ${config.industry}
- Business: ${config.businessDescription}
- Company: ${config.company.nameEn}
- Categories: ${catNames}
- Primary colors should suit: ${config.industry}

The prompt should instruct an AI agent to:
1. Update color palette in globals.css (provide specific HSL values for the industry)
2. Update Google Fonts in layout.tsx to match industry personality
3. Adapt navigation labels in site-header.tsx for the industry
4. Adapt footer copy in site-footer.tsx
5. Review and update any hardcoded manufacturing-specific text in: hero-section.tsx, strengths-section.tsx, process-steps.tsx, product-card.tsx, request-quote-form.tsx
6. Update meta title suffix and any hardcoded SEO text
7. Update favicon/og-image references in layout.tsx
8. Update Tailwind theme colors in tailwind.config.ts
9. Check inquiry-form.tsx for industry-appropriate field labels
10. Check about/page.tsx for any industry-referenced hardcoded copy

The prompt should be 600-900 words, professional tone, include specific file paths from src/ directory, mention the exact variables/classes to change, and explain WHY each change suits the industry. Include before/after examples for key changes.`,
    maxOutputTokens: 8192,
  });

  return raw; // This is plain text markdown, not JSON
}

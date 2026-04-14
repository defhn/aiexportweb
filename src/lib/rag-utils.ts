// ══════════════════════════════════════════════════════════════════════════════
//  RAG 工具库 - 产品向量化 + 语义检索 + 知识上下文构建
//  核心改进：
//   1. 产品 embedding 预计算并持久化入 DB（不再每次检索时实时算）
//   2. 检索时只需算 1 次 query embedding（成本从 31x 降到 1x）
//   3. 企业知识库（companyKnowledgeMd）统一注入
//   4. replyTemplates 按场景匹配注入
// ══════════════════════════════════════════════════════════════════════════════

import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { products, replyTemplates, siteSettings } from "@/db/schema";

// ──────────────────────────────────────────────────────────
//  Embedding API
// ──────────────────────────────────────────────────────────

export type EmbeddingVector = number[];

/**
 * 调用 Vertex AI text-embedding-004 获取文本向量（768维）
 * 使用 GEMINI_API_KEY（AIza 或 AQ. 格式均可）
 */
export async function getEmbedding(text: string): Promise<EmbeddingVector> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY 未配置，无法计算 Embedding");
  }

  const project = process.env.VERTEX_PROJECT_ID ?? "huachuanghub";
  const location = process.env.VERTEX_LOCATION ?? "us-central1";

  // AI Studio Key (AIza...) 使用 generativelanguage API
  // Vertex Express Key (AQ...) 使用 Vertex AI endpoint
  let url: string;
  let headers: Record<string, string> = { "Content-Type": "application/json" };

  if (apiKey.startsWith("AIza")) {
    url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
  } else {
    url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/text-embedding-004:embedContent?key=${apiKey}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: "models/text-embedding-004",
      content: { parts: [{ text: text.slice(0, 2048) }] },
      taskType: "RETRIEVAL_DOCUMENT",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Embedding API error ${response.status}: ${err}`);
  }

  const json = (await response.json()) as {
    embedding?: { values?: EmbeddingVector };
  };

  return json.embedding?.values ?? [];
}

// ──────────────────────────────────────────────────────────
//  余弦相似度
// ──────────────────────────────────────────────────────────

export function cosineSimilarity(a: EmbeddingVector, b: EmbeddingVector): number {
  if (a.length !== b.length || a.length === 0) return 0;
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

// ──────────────────────────────────────────────────────────
//  产品 Chunk 切分
//  规则：按 ## 标题、双换行等语义边界切分，每块 ≤ 600 chars
// ──────────────────────────────────────────────────────────

export interface ProductChunk {
  text: string;
  kind: "product" | "faq" | "specs";
  productName: string;
  productId: number;
  /** 关键词匹配分（用于无 embedding 时降级排序） */
  keywordScore: number;
  /** 余弦相似度分（有 embedding 时覆盖） */
  semanticScore: number;
}

function splitIntoChunks(text: string, maxChars = 600): string[] {
  // 优先按 ## 标题和双换行切分
  const parts = text.split(/\n#{1,3}\s|\n\n/).map((s) => s.trim()).filter((s) => s.length > 20);
  const result: string[] = [];
  for (const part of parts) {
    if (part.length <= maxChars) {
      result.push(part);
    } else {
      // 超长段落按句子切分
      const sentences = part.split(/(?<=[.!?。！？])\s+/);
      let buf = "";
      for (const s of sentences) {
        if ((buf + s).length > maxChars && buf) {
          result.push(buf.trim());
          buf = s;
        } else {
          buf += (buf ? " " : "") + s;
        }
      }
      if (buf.trim()) result.push(buf.trim());
    }
  }
  return result;
}

// ──────────────────────────────────────────────────────────
//  产品 Embedding 预计算（写回 DB）
//  调用时机：产品创建/更新后，或 Admin 手动触发
// ──────────────────────────────────────────────────────────

/**
 * 为单个产品计算 embedding 并持久化入 DB
 * 向量化内容 = nameEn + shortDescriptionEn + detailsEn（前2000字）
 */
export async function computeAndStoreProductEmbedding(productId: number): Promise<void> {
  const db = getDb();
  const [product] = await db
    .select({
      id: products.id,
      nameEn: products.nameEn,
      nameZh: products.nameZh,
      shortDescriptionEn: products.shortDescriptionEn,
      detailsEn: products.detailsEn,
    })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) return;

  const fullText = [
    product.nameEn ?? product.nameZh,
    product.shortDescriptionEn ?? "",
    (product.detailsEn ?? "").slice(0, 1500),
  ]
    .filter(Boolean)
    .join("\n");

  const embedding = await getEmbedding(fullText);

  await db
    .update(products)
    .set({
      embeddingJson: embedding,
      embeddingUpdatedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId));
}

/**
 * 批量为所有没有 embedding 或 embedding 已超过30天的产品重新计算
 * 每次最多处理 batchSize 个，避免一次性消耗太多 API 配额
 */
export async function batchComputeMissingEmbeddings(batchSize = 20): Promise<{
  computed: number;
  skipped: number;
}> {
  const db = getDb();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // 查询需要更新 embedding 的产品（无 embedding，或超过30天未更新）
  const allProducts = await db
    .select({
      id: products.id,
      embeddingUpdatedAt: products.embeddingUpdatedAt,
      embeddingJson: products.embeddingJson,
    })
    .from(products)
    .limit(batchSize * 3); // 多取一些，在内存中过滤

  const toCompute = allProducts
    .filter(
      (p) =>
        !p.embeddingJson ||
        !p.embeddingUpdatedAt ||
        p.embeddingUpdatedAt < thirtyDaysAgo,
    )
    .slice(0, batchSize);

  let computed = 0;
  let skipped = 0;

  for (const p of toCompute) {
    try {
      await computeAndStoreProductEmbedding(p.id);
      computed++;
      // 避免 API 限流，每个产品计算后等待 200ms
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (err) {
      console.warn(`[rag-utils] 产品 ${p.id} embedding 计算失败:`, err);
      skipped++;
    }
  }

  return { computed, skipped };
}

// ──────────────────────────────────────────────────────────
//  语义检索主函数
//  优先使用预计算的 DB embedding；降级到关键词匹配
// ──────────────────────────────────────────────────────────

export interface RagSearchOptions {
  topK?: number;
  /** 只检索已发布的产品 */
  publishedOnly?: boolean;
}

export interface RagSearchResult {
  chunks: ProductChunk[];
  usedEmbedding: boolean;
  productsUsed: string[];
  faqsUsed: number;
}

export async function searchProductKnowledge(
  query: string,
  options: RagSearchOptions = {},
): Promise<RagSearchResult> {
  const { topK = 5, publishedOnly = true } = options;
  const db = getDb();

  // 查询产品列表（含预计算 embedding）
  const allProducts = await db
    .select({
      id: products.id,
      nameEn: products.nameEn,
      nameZh: products.nameZh,
      shortDescriptionEn: products.shortDescriptionEn,
      detailsEn: products.detailsEn,
      faqsJson: products.faqsJson,
      status: products.status,
      embeddingJson: products.embeddingJson,
    })
    .from(products)
    .limit(150);

  const filteredProducts = publishedOnly
    ? allProducts.filter((p) => p.status === "published")
    : allProducts;

  // 尝试获取 query 的 embedding
  let queryVec: EmbeddingVector = [];
  let usedEmbedding = false;

  try {
    queryVec = await getEmbedding(query);
    usedEmbedding = true;
  } catch {
    console.warn("[rag-utils] embedding API 不可用，降级到关键词排序");
  }

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(Boolean);

  // 构建 chunk 列表
  const chunks: ProductChunk[] = [];

  for (const p of filteredProducts) {
    const name = p.nameEn ?? p.nameZh ?? "Unknown";
    const bodyText = [p.shortDescriptionEn ?? "", p.detailsEn ?? ""].join("\n").trim();

    // 产品主内容 chunk（按语义切分）
    if (bodyText.length > 20) {
      const subChunks = splitIntoChunks(bodyText, 600);
      for (const sub of subChunks.slice(0, 3)) {
        const chunkText = `[Product] ${name}\n${sub}`;
        const keywordScore = queryWords.reduce(
          (acc, w) => acc + (chunkText.toLowerCase().includes(w) ? 1 : 0),
          0,
        );

        // 如果该产品有预计算 embedding，直接计算余弦相似度
        let semanticScore = 0;
        if (usedEmbedding && p.embeddingJson && p.embeddingJson.length > 0) {
          semanticScore = cosineSimilarity(queryVec, p.embeddingJson);
        }

        chunks.push({
          text: chunkText,
          kind: "product",
          productName: name,
          productId: p.id,
          keywordScore,
          semanticScore,
        });
      }
    }

    // FAQ chunk
    const faqs = Array.isArray(p.faqsJson) ? p.faqsJson : [];
    for (const faq of faqs.slice(0, 4)) {
      const faqText = `Q: ${faq.question}\nA: ${faq.answer}`;
      const keywordScore = queryWords.reduce(
        (acc, w) => acc + (faqText.toLowerCase().includes(w) ? 1 : 0),
        0,
      );
      chunks.push({
        text: faqText,
        kind: "faq",
        productName: name,
        productId: p.id,
        keywordScore,
        semanticScore: usedEmbedding && p.embeddingJson
          ? cosineSimilarity(queryVec, p.embeddingJson)
          : 0,
      });
    }
  }

  // 排序：有 embedding 时用语义分，否则用关键词分
  const sortedChunks = chunks.sort((a, b) => {
    if (usedEmbedding) {
      return b.semanticScore - a.semanticScore;
    }
    return b.keywordScore - a.keywordScore;
  });

  const topChunks = sortedChunks.slice(0, topK);
  const productsUsed = [...new Set(topChunks.map((c) => c.productName))];
  const faqsUsed = topChunks.filter((c) => c.kind === "faq").length;

  return {
    chunks: topChunks,
    usedEmbedding,
    productsUsed,
    faqsUsed,
  };
}

// ──────────────────────────────────────────────────────────
//  企业知识库上下文构建
// ──────────────────────────────────────────────────────────

/**
 * 从 siteSettings.companyKnowledgeMd 读取企业知识
 * 用于在 promptv 中注入工厂能力、认证、政策等信息
 */
export async function getCompanyKnowledgeContext(): Promise<string> {
  try {
    const db = getDb();
    const [setting] = await db
      .select({ companyKnowledgeMd: siteSettings.companyKnowledgeMd })
      .from(siteSettings)
      .limit(1);

    return setting?.companyKnowledgeMd?.trim() ?? "";
  } catch {
    return "";
  }
}

// ──────────────────────────────────────────────────────────
//  回复模板上下文构建
// ──────────────────────────────────────────────────────────

/**
 * 根据询盘类型（inquiryType）检索最匹配的回复模板
 * 用于在 generate-inquiry-reply 中注入风格参考
 */
export async function getReplyTemplateContext(
  inquiryType?: string,
  limit = 2,
): Promise<string> {
  try {
    const db = getDb();
    let rows;

    if (inquiryType) {
      rows = await db
        .select({ contentEn: replyTemplates.contentEn, applicableScene: replyTemplates.applicableScene })
        .from(replyTemplates)
        .where(eq(replyTemplates.applicableScene, inquiryType))
        .limit(limit);
    }

    // 如果没有找到匹配的，取前 N 条作为风格参考
    if (!rows || rows.length === 0) {
      rows = await db
        .select({ contentEn: replyTemplates.contentEn, applicableScene: replyTemplates.applicableScene })
        .from(replyTemplates)
        .limit(limit);
    }

    if (!rows || rows.length === 0) return "";

    return rows
      .map((r) => `[Template - ${r.applicableScene ?? "general"}]\n${r.contentEn}`)
      .join("\n---\n");
  } catch {
    return "";
  }
}

// ──────────────────────────────────────────────────────────
//  组合 RAG 上下文（产品 + 企业知识 + 模板）
// ──────────────────────────────────────────────────────────

export interface BuildRagContextOptions {
  query: string;
  inquiryType?: string;
  includeCompanyKnowledge?: boolean;
  includeReplyTemplates?: boolean;
  topK?: number;
}

export interface BuiltRagContext {
  /** 完整的 RAG 上下文字符串，直接注入 Prompt */
  context: string;
  /** 调试/溯源信息 */
  meta: {
    productsUsed: string[];
    faqsUsed: number;
    usedEmbedding: boolean;
    hasCompanyKnowledge: boolean;
    hasTemplates: boolean;
  };
}

/**
 * 一站式构建 RAG 上下文
 * 自动合并：产品知识 + 企业知识 + 回复模板
 */
export async function buildRagContext(
  options: BuildRagContextOptions,
): Promise<BuiltRagContext> {
  const {
    query,
    inquiryType,
    includeCompanyKnowledge = true,
    includeReplyTemplates = false,
    topK = 5,
  } = options;

  const [searchResult, companyKnowledge, templateContext] = await Promise.all([
    searchProductKnowledge(query, { topK }),
    includeCompanyKnowledge ? getCompanyKnowledgeContext() : Promise.resolve(""),
    includeReplyTemplates ? getReplyTemplateContext(inquiryType) : Promise.resolve(""),
  ]);

  const parts: string[] = [];

  if (searchResult.chunks.length > 0) {
    parts.push(
      "## Product Knowledge\n" +
        searchResult.chunks.map((c) => c.text).join("\n\n"),
    );
  }

  if (companyKnowledge) {
    parts.push("## Company Capabilities & Certifications\n" + companyKnowledge);
  }

  if (templateContext) {
    parts.push("## Approved Reply Style Reference\n" + templateContext);
  }

  return {
    context: parts.join("\n\n---\n\n") || "(No knowledge base content available.)",
    meta: {
      productsUsed: searchResult.productsUsed,
      faqsUsed: searchResult.faqsUsed,
      usedEmbedding: searchResult.usedEmbedding,
      hasCompanyKnowledge: Boolean(companyKnowledge),
      hasTemplates: Boolean(templateContext),
    },
  };
}

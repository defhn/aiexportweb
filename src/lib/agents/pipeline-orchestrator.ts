/**
 * AI 内容生成主流水线协调器（Pipeline Orchestrator）
 *
 * 这是整个 AI 引擎的"指挥中枢"。
 * 负责按序调度所有 5 个 Agent，更新任务状态，处理失败重试。
 *
 * 调度顺序：
 * Agent-1（提取）→ Agent-2（大纲）→ Agent-3（写作）→ Agent-4（质检）→ Agent-5（SEO 封装 + 入库）
 *
 * 重试策略：
 * - Agent-1 最多重试 3 次（内置）
 * - Agent-3 + 4 组合最多重试 2 次（通过外层循环）
 * - 所有失败都写入 errorLog，不会默默丢失
 */

import {
  updateJobStatus,
  markJobFailed,
  markJobCompleted,
  getJobById,
} from "@/features/content-jobs/queries";
import { extractIndustryData } from "@/lib/agents/agent-extractor";
import { generateArticleOutline } from "@/lib/agents/agent-architect";
import { writeArticle, reviewArticle } from "@/lib/agents/agent-writer";
import { generateSeoPackage, injectBlogPost } from "@/lib/agents/agent-seo-packager";
import { type IndustryKey, type GenericManufacturingData } from "@/lib/ingest/industry-schema";
import { getAiEngineConfig } from "@/features/ai-engine/queries";

// ─── 流水线输入类型 ───────────────────────────────────────────────────────────

export type BlogGenPipelineInput = {
  jobId: number;
  siteId: number | null;
  seedPackKey: string;
  companyName: string;
  siteUrl: string;
  // 原始文本（PDF 解析后的文本，或手动输入的产品描述）
  rawText: string;
  // 行业 key，用于选择对应 Schema 和意图词库
  industry: IndustryKey;
  // 可选：目标博客分类 slug
  categorySlug?: string;
};

// ─── 主流水线函数 ─────────────────────────────────────────────────────────────

export async function runBlogGenPipeline(input: BlogGenPipelineInput): Promise<void> {
  const { jobId, siteId, seedPackKey, companyName, siteUrl, rawText, industry, categorySlug } = input;

  try {
    // ── Stage 1：信息提取（extracting 15%）──────────────────────────────────
    await updateJobStatus(jobId, "extracting", 10);
    console.log(`[Pipeline] Job ${jobId} | Stage 1: 开始参数提取`);

    const extractionResult = await extractIndustryData({
      rawText,
      industry,
    });

    if (!extractionResult.success) {
      await markJobFailed(jobId, `[Stage 1] 参数提取失败: ${extractionResult.error}`);
      return;
    }

    const industryData = extractionResult.data as GenericManufacturingData;
    await updateJobStatus(jobId, "extracting", 25);
    console.log(`[Pipeline] Job ${jobId} | Stage 1 complete | confidence=${industryData.extractionConfidence}`);

    // ── Stage 2：SEO 大纲生成（drafting 40%）────────────────────────────────
    await updateJobStatus(jobId, "drafting", 35);
    console.log(`[Pipeline] Job ${jobId} | Stage 2: 开始大纲生成`);

    const outlineResult = await generateArticleOutline({
      industryData,
      industry,
    });

    if (!outlineResult.success) {
      await markJobFailed(jobId, `[Stage 2] 大纲生成失败: ${outlineResult.error}`);
      return;
    }

    const outline = outlineResult.outline;
    await updateJobStatus(jobId, "drafting", 45);
    console.log(`[Pipeline] Job ${jobId} | Stage 2 完成 | keyword="${outline.primaryKeyword}"`);

    // ── Pre-fetch DB configurations ─────────────────────────────────────────
    const negativeWordsRaw = await getAiEngineConfig(siteId, "negative_words");
    const negativeWords = negativeWordsRaw 
      ? negativeWordsRaw.split("\n").map(w => w.trim()).filter(Boolean) 
      : undefined;

    // ── Stage 3+4：写作 + 质检（最多 2 次循环）──────────────────────────────
    let finalMarkdown: string | null = null;
    const WRITING_MAX_CYCLES = 2;

    for (let cycle = 1; cycle <= WRITING_MAX_CYCLES; cycle++) {
      const progress = 45 + cycle * 15;
      await updateJobStatus(jobId, "drafting", progress);
      console.log(`[Pipeline] Job ${jobId} | Stage 3: 第 ${cycle} 次写作`);

      // Agent-3：写作
      const writeResult = await writeArticle({
        outline,
        industryData,
        negativeWords,
      });

      if (!writeResult.success) {
        if (cycle === WRITING_MAX_CYCLES) {
          await markJobFailed(jobId, `[Stage 3] 写作失败（已重试 ${WRITING_MAX_CYCLES} 次）: ${writeResult.error}`);
          return;
        }
        console.warn(`[Pipeline] Job ${jobId} | Stage 3 失败，进入重试: ${writeResult.error}`);
        continue;
      }

      await updateJobStatus(jobId, "reviewing", 70);
      console.log(`[Pipeline] Job ${jobId} | Stage 4: 质检中 | 字数=${writeResult.wordCount}`);

      // Agent-4：质检
      const reviewResult = await reviewArticle({
        markdown: writeResult.markdown,
        industryData,
      });

      if (reviewResult.passed) {
        finalMarkdown = writeResult.markdown;
        console.log(`[Pipeline] Job ${jobId} | Stage 4 通过质检`);
        break;
      }

      console.warn(`[Pipeline] Job ${jobId} | Stage 4 质检失败: ${reviewResult.issues.join("; ")}`);
      if (cycle === WRITING_MAX_CYCLES) {
        // 最后一次质检仍失败，记录问题但继续（不完全阻断流程）
        finalMarkdown = writeResult.markdown;
        console.warn(`[Pipeline] Job ${jobId} | 已达最大重试次数，带质检警告继续`);
      }
    }

    if (!finalMarkdown) {
      await markJobFailed(jobId, "[Stage 3] 写作步骤未产出内容");
      return;
    }

    // ── Stage 5：SEO 封装（injecting 88%）───────────────────────────────────
    await updateJobStatus(jobId, "injecting", 85);
    console.log(`[Pipeline] Job ${jobId} | Stage 5: SEO 封装中`);

    const slug = outline.primaryKeyword
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);

    const seoResult = await generateSeoPackage({
      outline,
      markdown: finalMarkdown,
      slug,
      siteUrl,
      companyName,
    });

    if (!seoResult.success) {
      await markJobFailed(jobId, `[Stage 5] SEO 封装失败: ${seoResult.error}`);
      return;
    }

    // ── Stage 6：写入数据库 + ISR（completed 100%）──────────────────────────
    await updateJobStatus(jobId, "injecting", 92);
    console.log(`[Pipeline] Job ${jobId} | Stage 6: 写入数据库`);

    const injectionResult = await injectBlogPost({
      siteId,
      seedPackKey,
      outline,
      markdown: finalMarkdown,
      seoPackage: seoResult.package,
      sourceJobId: jobId,
      categorySlug,
    });

    if (!injectionResult.success) {
      await markJobFailed(jobId, `[Stage 6] 内容入库失败: ${injectionResult.error}`);
      return;
    }

    // ── 全部完成 ────────────────────────────────────────────────────────────
    await markJobCompleted(jobId, {
      resultPayload: {
        slug: injectionResult.slug,
        primaryKeyword: outline.primaryKeyword,
        wordCount: finalMarkdown.split(/\s+/).length,
        titleTag: seoResult.package.titleTag,
        metaDescription: seoResult.package.metaDescription,
      },
      targetBlogPostId: injectionResult.blogPostId,
    });

    console.log(`[Pipeline] ✅ Job ${jobId} 全流程完成 | slug=${injectionResult.slug} | blogPostId=${injectionResult.blogPostId}`);

  } catch (err) {
    const errorMsg = `[Pipeline] 未预期错误: ${err instanceof Error ? err.message : String(err)}`;
    console.error(errorMsg, err);
    await markJobFailed(jobId, errorMsg).catch(() => {});
  }
}

// ─── 任务路由器（根据 taskType 分发到对应流水线）────────────────────────────

export async function routeAndExecuteJob(jobId: number): Promise<void> {
  const job = await getJobById(jobId);
  if (!job) {
    console.error(`[Pipeline Router] Job ${jobId} 不存在`);
    return;
  }

  if (job.status === "completed" || job.status === "failed") {
    console.warn(`[Pipeline Router] Job ${jobId} 已处于终态 (${job.status})，跳过重复执行`);
    return;
  }

  const input = job.inputPayloadJson as Record<string, unknown>;

  switch (job.taskType) {
    case "blog_gen":
      await runBlogGenPipeline({
        jobId,
        siteId: job.siteId,
        seedPackKey: (input.seedPackKey as string) ?? "cnc",
        companyName: (input.companyName as string) ?? "Manufacturing Co.",
        siteUrl: (input.siteUrl as string) ?? (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"),
        rawText: (input.rawText as string) ?? "",
        industry: ((input.industry as string) ?? "generic") as IndustryKey,
        categorySlug: input.categorySlug as string | undefined,
      });
      break;

    case "product_desc_gen":
      // TODO P4：产品描述生成流水线（Phase 2 后期实现）
      await markJobFailed(jobId, "product_desc_gen 流水线尚未实现，请使用 blog_gen");
      break;

    case "pdf_ingest":
      // TODO P4：仅提取参数，不生成文章（用于产品页参数自动填充）
      await markJobFailed(jobId, "pdf_ingest 独立流水线尚未实现");
      break;

    default:
      await markJobFailed(jobId, `未知 taskType: ${job.taskType}`);
  }
}

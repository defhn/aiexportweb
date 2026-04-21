/**
 * content_jobs 表的数据库操作封装
 * 提供任务的增删改查工具函数
 */

import { and, desc, eq, isNull } from "drizzle-orm";

import { getDb } from "@/db/client";
import { contentJobs, contentJobStatusEnum, contentJobTaskTypeEnum } from "@/db/schema";

// ─── 类型定义 ─────────────────────────────────────────────────────────────────

export type ContentJobStatus = (typeof contentJobStatusEnum.enumValues)[number];
export type ContentJobTaskType = (typeof contentJobTaskTypeEnum.enumValues)[number];

export type ContentJobRow = typeof contentJobs.$inferSelect;

// ─── 创建任务 ─────────────────────────────────────────────────────────────────

export async function createContentJob(params: {
  siteId: number | null;
  taskType: ContentJobTaskType;
  inputPayload: Record<string, unknown>;
}): Promise<number> {
  const db = getDb();
  const [row] = await db
    .insert(contentJobs)
    .values({
      siteId: params.siteId,
      taskType: params.taskType,
      status: "pending",
      progressPercent: 0,
      inputPayloadJson: params.inputPayload,
      retryCount: 0,
    })
    .returning({ id: contentJobs.id });

  if (!row) throw new Error("content_jobs 插入失败，未返回 id");
  return row.id;
}

// ─── 更新任务状态 ──────────────────────────────────────────────────────────────

export async function updateJobStatus(
  jobId: number,
  status: ContentJobStatus,
  progressPercent?: number,
): Promise<void> {
  const db = getDb();
  await db
    .update(contentJobs)
    .set({
      status,
      progressPercent: progressPercent ?? getDefaultProgress(status),
      updatedAt: new Date(),
    })
    .where(eq(contentJobs.id, jobId));
}

// ─── 记录任务失败 ──────────────────────────────────────────────────────────────

export async function markJobFailed(jobId: number, errorMessage: string): Promise<void> {
  const db = getDb();
  await db
    .update(contentJobs)
    .set({
      status: "failed",
      errorLog: errorMessage,
      updatedAt: new Date(),
    })
    .where(eq(contentJobs.id, jobId));
}

// ─── 记录任务完成（写入产物 ID 和结果）──────────────────────────────────────────

export async function markJobCompleted(
  jobId: number,
  result: {
    resultPayload: Record<string, unknown>;
    targetBlogPostId?: number;
    targetProductId?: number;
  },
): Promise<void> {
  const db = getDb();
  await db
    .update(contentJobs)
    .set({
      status: "completed",
      progressPercent: 100,
      resultPayloadJson: result.resultPayload,
      targetBlogPostId: result.targetBlogPostId,
      targetProductId: result.targetProductId,
      updatedAt: new Date(),
    })
    .where(eq(contentJobs.id, jobId));
}

// ─── 增加重试计数 ──────────────────────────────────────────────────────────────

export async function incrementJobRetry(jobId: number): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ retryCount: contentJobs.retryCount })
    .from(contentJobs)
    .where(eq(contentJobs.id, jobId));

  const newCount = (row?.retryCount ?? 0) + 1;
  await db
    .update(contentJobs)
    .set({ retryCount: newCount, updatedAt: new Date() })
    .where(eq(contentJobs.id, jobId));

  return newCount;
}

// ─── 查询单个任务 ──────────────────────────────────────────────────────────────

export async function getJobById(jobId: number): Promise<ContentJobRow | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(contentJobs)
    .where(eq(contentJobs.id, jobId))
    .limit(1);
  return row ?? null;
}

// ─── 查询站点的任务列表 ────────────────────────────────────────────────────────

export async function getJobsBySite(
  siteId: number | null,
  limit = 20,
): Promise<ContentJobRow[]> {
  const db = getDb();
  const query = db
    .select()
    .from(contentJobs)
    .orderBy(desc(contentJobs.createdAt))
    .limit(limit);

  if (siteId !== null && siteId !== undefined) {
    return query.where(eq(contentJobs.siteId, siteId));
  }
  return query.where(isNull(contentJobs.siteId));
}

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

/** 根据状态返回默认进度百分比 */
function getDefaultProgress(status: ContentJobStatus): number {
  const map: Record<ContentJobStatus, number> = {
    pending: 0,
    extracting: 15,
    drafting: 40,
    reviewing: 70,
    injecting: 88,
    completed: 100,
    failed: 0,
  };
  return map[status] ?? 0;
}

/** 获取状态的中文显示标签 */
export function getJobStatusLabel(status: ContentJobStatus): string {
  const labels: Record<ContentJobStatus, string> = {
    pending: "⏳ 等待处理",
    extracting: "🔍 解析文档参数中",
    drafting: "✍️ AI 撰写内容中",
    reviewing: "🔎 技术参数核验中",
    injecting: "💾 写入数据库中",
    completed: "✅ 生成完成",
    failed: "❌ 任务失败",
  };
  return labels[status] ?? status;
}

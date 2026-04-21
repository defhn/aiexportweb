/**
 * POST /api/ai/content-jobs
 *
 * 任务触发入口 — 极速响应（< 100ms）
 * 只做两件事：1. 在 DB 中创建任务记录  2. 推送到 QStash 队列
 * 不做任何 AI 计算，立即返回 jobId
 */

import { type NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { createContentJob } from "@/features/content-jobs/queries";
import { publishJob, type ContentJobTaskType } from "@/lib/qstash";

export const runtime = "nodejs";

const VALID_TASK_TYPES: ContentJobTaskType[] = [
  "blog_gen",
  "product_desc_gen",
  "pdf_ingest",
];

export async function POST(request: NextRequest) {
  try {
    const currentSite = await getCurrentSiteFromRequest();
    const siteId = currentSite.id ?? null;

    let taskType: string;
    let inputPayload: Record<string, unknown> = {};

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // 处理 PDF 上传
      const formData = await request.formData();
      taskType = formData.get("taskType") as string;
      const industry = formData.get("industry") as string;
      let rawText = formData.get("rawText") as string;
      
      const file = formData.get("pdfFile") as File | null;
      if (file && file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = await pdfParse(Buffer.from(arrayBuffer));
        rawText = (rawText ? rawText + "\n\n" : "") + pdfData.text;
      }

      inputPayload = { industry, rawText };
    } else {
      // 兼容旧的 JSON 模式
      const body = await request.json();
      taskType = body.taskType;
      inputPayload = body.inputPayload;
    }

    // ── 基础参数校验 ────────────────────────────────────────────────────────
    if (!taskType || !VALID_TASK_TYPES.includes(taskType as ContentJobTaskType)) {
      return NextResponse.json(
        { error: `Invalid taskType. Must be one of: ${VALID_TASK_TYPES.join(", ")}` },
        { status: 400 },
      );
    }

    if (!inputPayload || typeof inputPayload !== "object") {
      return NextResponse.json(
        { error: "inputPayload is required and must be an object" },
        { status: 400 },
      );
    }

    // ── 创建数据库任务记录 ──────────────────────────────────────────────────
    const jobId = await createContentJob({
      siteId,
      taskType: taskType as ContentJobTaskType,
      inputPayload,
    });

    // ── 推送到 QStash 队列 ──────────────────────
    await publishJob("/api/ai/content-jobs/process", {
      jobId,
      taskType: taskType as ContentJobTaskType,
      siteId,
      ...inputPayload,
    });

    return NextResponse.json({ jobId, status: "pending" }, { status: 202 });

  } catch (error) {
    console.error("[ContentJobs API] 触发任务失败:", error);
    return NextResponse.json(
      { error: "Failed to create content job. Please try again." },
      { status: 500 },
    );
  }
}

// ─── GET /api/ai/content-jobs — 查询站点任务列表 ─────────────────────────────

export async function GET() {
  try {
    const { getJobsBySite } = await import("@/features/content-jobs/queries");
    const currentSite = await getCurrentSiteFromRequest();
    const siteId = currentSite.id ?? null;
    const jobs = await getJobsBySite(siteId, 20);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("[ContentJobs API] 查询任务列表失败:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

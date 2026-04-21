/**
 * GET /api/ai/content-jobs/[jobId]
 *
 * 任务进度查询接口（前端每 3 秒轮询一次）
 * 返回当前任务的状态、进度、错误信息
 */

import { type NextRequest, NextResponse } from "next/server";
import { getJobById, getJobStatusLabel } from "@/features/content-jobs/queries";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId: jobIdStr } = await params;
  const jobId = parseInt(jobIdStr, 10);

  if (isNaN(jobId)) {
    return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
  }

  try {
    const job = await getJobById(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      statusLabel: getJobStatusLabel(job.status),
      progressPercent: job.progressPercent,
      taskType: job.taskType,
      targetBlogPostId: job.targetBlogPostId,
      targetProductId: job.targetProductId,
      errorLog: job.status === "failed" ? job.errorLog : null,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });

  } catch (error) {
    console.error("[ContentJobs Status API] 查询失败:", error);
    return NextResponse.json({ error: "Failed to fetch job status" }, { status: 500 });
  }
}

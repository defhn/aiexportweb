/**
 * POST /api/ai/content-jobs/process
 *
 * QStash 回调处理接口（Webhook Receiver）
 * 这是 QStash 推送任务后实际执行的接口
 *
 * 安全机制：
 * 1. 生产环境：通过 QSTASH 签名密钥验证（防止伪造请求）
 * 2. 开发环境：通过 INTERNAL_WEBHOOK_SECRET 验证
 *
 * 执行时间：Vercel Pro 最长 5 分钟，但由于 QStash 自带重试
 * 即使 Vercel 超时断开，QStash 会自动重试，任务不丢失。
 */

import { type NextRequest, NextResponse } from "next/server";
import { verifyQStashSignature, type ContentJobPayload } from "@/lib/qstash";
import { routeAndExecuteJob } from "@/lib/agents/pipeline-orchestrator";

// Vercel 最大执行时长（Pro 计划）
export const maxDuration = 300; // 5 分钟
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // ── 安全验证 ─────────────────────────────────────────────────────────────
  const isValid = await verifyQStashSignature(request.clone());
  if (!isValid) {
    console.warn("[QStash Receiver] 签名验证失败，拒绝请求");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 解析任务参数 ──────────────────────────────────────────────────────────
  let payload: ContentJobPayload;
  try {
    payload = (await request.json()) as ContentJobPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { jobId } = payload;

  if (!jobId || typeof jobId !== "number") {
    return NextResponse.json({ error: "Missing or invalid jobId" }, { status: 400 });
  }

  console.log(`[QStash Receiver] 开始执行任务 | jobId=${jobId} | taskType=${payload.taskType}`);

  // ── 执行流水线（异步，不等待完成就返回 200 给 QStash）──────────────────
  // 关键：立即返回 200 防止 QStash 误判超时并重复发送
  // 实际任务在后台继续运行
  void routeAndExecuteJob(jobId).catch((err) => {
    console.error(`[QStash Receiver] 流水线异常退出 | jobId=${jobId}:`, err);
  });

  return NextResponse.json(
    { message: `Job ${jobId} pipeline started`, jobId },
    { status: 200 },
  );
}

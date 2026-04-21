/**
 * QStash 消息队列工具函数
 *
 * 核心职责：把重型 AI 任务丢进 Upstash QStash 队列，避免 Vercel Serverless
 * 5 分钟超时限制导致的任务中断。
 *
 * 使用方式:
 *   await publishJob("/api/ai/content-jobs/process", { jobId: 123, taskType: "blog_gen" })
 */

import { Client } from "@upstash/qstash";

// ─── 基础配置 ────────────────────────────────────────────────────────────────

function getQStashClient(): Client | null {
  const token = process.env.QSTASH_TOKEN;
  if (!token) {
    // 开发环境未配置 QStash 时，降级为直接调用（同步模式）
    return null;
  }
  return new Client({ token });
}

// ─── 工作任务类型 ─────────────────────────────────────────────────────────────

export type ContentJobTaskType =
  | "blog_gen"       // 博客文章生成：从原始资料 → 完整 SEO 文章
  | "product_desc_gen" // 产品描述生成：从产品参数 → 营销文案
  | "pdf_ingest";    // PDF 摄取：从 PDF 文件 → 结构化 JSON 参数

export type ContentJobPayload = {
  jobId: number;
  taskType: ContentJobTaskType;
  siteId: number | null;
  [key: string]: unknown;
};

// ─── 核心发布函数 ──────────────────────────────────────────────────────────────

/**
 * 发布一个 AI 内容任务到 QStash 队列
 *
 * @param endpoint - 处理该任务的 API 路由（相对路径）
 * @param payload  - 任务参数，必须包含 jobId 和 taskType
 * @param delaySeconds - 可选延迟发送秒数（用于重试场景）
 */
export async function publishJob(
  endpoint: string,
  payload: ContentJobPayload,
  delaySeconds = 0,
): Promise<{ messageId: string } | { fallback: true }> {
  const client = getQStashClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const absoluteUrl = `${siteUrl}${endpoint}`;

  // 开发环境降级：直接使用 fetch 同步调用（不走队列）
  if (!client) {
    console.warn(`[QStash] 未配置 QSTASH_TOKEN，降级为直接调用: ${absoluteUrl}`);
    // 非阻塞模式调用，让接口立即返回
    fetch(absoluteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_WEBHOOK_SECRET ?? "dev-secret",
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.error("[QStash] 降级直接调用失败:", err);
    });
    return { fallback: true };
  }

  // 生产环境：通过 QStash 发布消息
  const publishOptions: Parameters<typeof client.publishJSON>[0] = {
    url: absoluteUrl,
    body: payload,
    headers: {
      "x-internal-secret": process.env.INTERNAL_WEBHOOK_SECRET ?? "",
    },
  };

  if (delaySeconds > 0) {
    publishOptions.delay = delaySeconds;
  }

  const result = await client.publishJSON(publishOptions);
  console.log(`[QStash] 任务已入队 | jobId=${payload.jobId} | messageId=${result.messageId}`);
  return { messageId: result.messageId };
}

// ─── QStash 签名验证（用于 Webhook 接收端）──────────────────────────────────

/**
 * 验证来自 QStash 的回调请求签名
 * 用于所有 /api/ai/content-jobs/process 接口的安全校验
 */
export async function verifyQStashSignature(request: Request): Promise<boolean> {
  // 优先使用 QStash 签名验证
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (currentKey && nextKey) {
    try {
      const { Receiver } = await import("@upstash/qstash");
      const receiver = new Receiver({ currentSigningKey: currentKey, nextSigningKey: nextKey });
      const body = await request.text();
      const signature = request.headers.get("upstash-signature") ?? "";
      const url = request.url;
      await receiver.verify({ signature, body, url });
      return true;
    } catch {
      return false;
    }
  }

  // 开发环境：使用内部 Secret 验证
  const internalSecret = request.headers.get("x-internal-secret");
  const expectedSecret = process.env.INTERNAL_WEBHOOK_SECRET ?? "dev-secret";
  return internalSecret === expectedSecret;
}

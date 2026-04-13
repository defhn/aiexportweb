/**
 * Webhook 推送工具
 * 当站点设置中配置了 webhookUrl 时，在询盘创建后自动推送 JSON payload
 */

import type { InquiryEmailInput } from "@/lib/brevo";

type WebhookPayload = {
  event: "new_inquiry";
  timestamp: string;
  inquiry: {
    name: string;
    email: string;
    companyName?: string | null;
    country?: string | null;
    whatsapp?: string | null;
    message: string;
    productName?: string | null;
    sourceUrl?: string | null;
    attachmentUrl?: string | null;
  };
};

/**
 * 向站点设置中配置的 webhookUrl 发送询盘通知
 * 静默失败——不因 webhook 问题影响主流程
 */
export async function sendInquiryWebhook(
  webhookUrl: string | null | undefined,
  input: InquiryEmailInput,
) {
  if (!webhookUrl?.trim()) return;

  const payload: WebhookPayload = {
    event: "new_inquiry",
    timestamp: new Date().toISOString(),
    inquiry: {
      name: input.name,
      email: input.email,
      companyName: input.companyName,
      country: input.country,
      whatsapp: input.whatsapp,
      message: input.message,
      productName: input.productName,
      sourceUrl: input.sourceUrl,
      attachmentUrl: input.attachmentUrl,
    },
  };

  try {
    const response = await fetch(webhookUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000), // 8s 超时
    });

    if (!response.ok) {
      console.warn(`[webhook] 推送失败: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    // 静默失败，不影响主流程
    console.warn("[webhook] 推送异常:", error instanceof Error ? error.message : error);
  }
}

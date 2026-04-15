import { NextResponse } from "next/server";

import {
  buildLockedApiResponse,
  getFeatureGate,
  incrementFeatureUsage,
} from "@/features/plans/access";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { withAdminAuth } from "@/lib/admin-auth";
import { generateInquiryReplyWithRag } from "@/lib/ai";

/**
 * POST /api/ai/generate-inquiry-reply
 * 
 * 升级版：在生成前自动检索：
 *   1. 相关产品知识（规格、FAQ、认证）
 *   2. 企业能力知识库（companyKnowledgeMd）
 *   3. 匹配的回复模板（风格参考）
 */
export const POST = withAdminAuth(async (request) => {
  const currentSite = await getCurrentSiteFromRequest();
  const gate = await getFeatureGate("ai_inquiry_reply", currentSite.plan, currentSite.id);

  if (gate.status === "locked") {
    return NextResponse.json(buildLockedApiResponse(gate), { status: 403 });
  }

  const body = (await request.json()) as {
    customerName?: string;
    companyName?: string;
    message?: string;
    productName?: string;
    productId?: number;
    specs?: string[];
    tone?: string;
    inquiryType?: string;
  };

  const { reply, provider, ragMeta } = await generateInquiryReplyWithRag({
    customerName: body.customerName?.trim() || "Customer",
    companyName: body.companyName?.trim() || "",
    message: body.message?.trim() || "",
    productName: body.productName?.trim() || "",
    productId: body.productId,
    specs: body.specs ?? [],
    tone: body.tone?.trim() || "professional",
    inquiryType: body.inquiryType?.trim(),
    siteId: currentSite.id,
  });

  if (gate.status === "trial") {
    await incrementFeatureUsage("ai_inquiry_reply", currentSite.id);
  }

  return NextResponse.json({
    reply,
    provider,
    remaining:
      gate.remaining !== null ? Math.max(gate.remaining - 1, 0) : gate.remaining,
    // 溯源信息（前端可选展示）
    ragMeta,
  });
});

import { NextResponse } from "next/server";

import { updateInquiryDetail } from "@/features/inquiries/actions";
import { getInquiryById } from "@/features/inquiries/queries";
import {
  buildLockedApiResponse,
  getFeatureGate,
  incrementFeatureUsage,
} from "@/features/plans/access";
import { withAdminAuth } from "@/lib/admin-auth";
import { classifyInquiry } from "@/lib/ai";

export const POST = withAdminAuth(async (request) => {
  const gate = await getFeatureGate("ai_inquiry_classification");

  if (gate.status === "locked") {
    return NextResponse.json(buildLockedApiResponse(gate), { status: 403 });
  }

  const body = (await request.json()) as { inquiryId?: number };

  if (!body.inquiryId) {
    return NextResponse.json({ error: "缺少询盘 ID。" }, { status: 400 });
  }

  const inquiry = await getInquiryById(body.inquiryId);

  if (!inquiry) {
    return NextResponse.json({ error: "询盘不存在。" }, { status: 404 });
  }

  const { inquiryType, provider } = await classifyInquiry({
    message: inquiry.message,
    productName: inquiry.productName ?? undefined,
  });

  await updateInquiryDetail({
    id: inquiry.id,
    status: inquiry.status,
    inquiryType,
    internalNote: inquiry.internalNote,
    classificationMethod: provider === "fallback" ? "rule" : "ai",
  });

  if (gate.status === "trial") {
    await incrementFeatureUsage("ai_inquiry_classification");
  }

  return NextResponse.json({
    inquiryType,
    provider,
    remaining:
      gate.remaining !== null ? Math.max(gate.remaining - 1, 0) : gate.remaining,
  });
});

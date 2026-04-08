import { NextResponse } from "next/server";

import { updateInquiryDetail } from "@/features/inquiries/actions";
import { getInquiryById } from "@/features/inquiries/queries";
import { classifyInquiryByAiFallback } from "@/features/inquiries/classification";
import {
  buildLockedApiResponse,
  getFeatureGate,
  incrementFeatureUsage,
} from "@/features/plans/access";

export async function POST(request: Request) {
  const gate = await getFeatureGate("ai_inquiry_classification");

  if (gate.status === "locked") {
    return NextResponse.json(buildLockedApiResponse(gate), { status: 403 });
  }

  const body = (await request.json()) as { inquiryId?: number };

  if (!body.inquiryId) {
    return NextResponse.json({ error: "Missing inquiry id." }, { status: 400 });
  }

  const inquiry = await getInquiryById(body.inquiryId);

  if (!inquiry) {
    return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
  }

  const inquiryType = classifyInquiryByAiFallback(inquiry.message);

  await updateInquiryDetail({
    id: inquiry.id,
    status: inquiry.status,
    inquiryType,
    internalNote: inquiry.internalNote,
    classificationMethod: "ai",
  });

  if (gate.status === "trial") {
    await incrementFeatureUsage("ai_inquiry_classification");
  }

  return NextResponse.json({
    inquiryType,
    remaining:
      gate.remaining !== null ? Math.max(gate.remaining - 1, 0) : gate.remaining,
  });
}

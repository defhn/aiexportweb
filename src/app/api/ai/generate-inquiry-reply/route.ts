import { NextResponse } from "next/server";

import {
  buildLockedApiResponse,
  getFeatureGate,
  incrementFeatureUsage,
} from "@/features/plans/access";
import { generateInquiryReply } from "@/lib/ai";

export async function POST(request: Request) {
  const gate = await getFeatureGate("ai_inquiry_reply");

  if (gate.status === "locked") {
    return NextResponse.json(buildLockedApiResponse(gate), { status: 403 });
  }

  const body = (await request.json()) as {
    customerName?: string;
    companyName?: string;
    message?: string;
    productName?: string;
    specs?: string[];
    tone?: string;
  };

  const { reply, provider } = await generateInquiryReply({
    customerName: body.customerName?.trim() || "Customer",
    companyName: body.companyName?.trim() || "",
    message: body.message?.trim() || "",
    productName: body.productName?.trim() || "",
    specs: body.specs ?? [],
    tone: body.tone?.trim() || "professional",
  });

  if (gate.status === "trial") {
    await incrementFeatureUsage("ai_inquiry_reply");
  }

  return NextResponse.json({
    reply,
    provider,
    remaining:
      gate.remaining !== null ? Math.max(gate.remaining - 1, 0) : gate.remaining,
  });
}

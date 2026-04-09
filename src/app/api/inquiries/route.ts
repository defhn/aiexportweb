import { NextResponse } from "next/server";

import { createMediaAsset } from "@/features/media/actions";
import { createInquiry } from "@/features/inquiries/actions";
import { validateInquiryAttachment } from "@/features/inquiries/validation";
import { sendInquiryNotification } from "@/lib/brevo";
import { uploadToR2 } from "@/lib/r2";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const token = String(formData.get("turnstileToken") ?? "");

  if (!(await verifyTurnstileToken(token))) {
    return NextResponse.json({ error: "验证失败，请重试�? }, { status: 400 });
  }

  let attachmentMediaId: number | null = null;
  let attachmentUrl: string | null = null;

  const attachment = formData.get("attachment");

  if (attachment instanceof File && attachment.size > 0) {
    const attachmentValidation = validateInquiryAttachment(attachment);

    if (!attachmentValidation.ok) {
      return NextResponse.json(
        { error: attachmentValidation.error },
        { status: 400 },
      );
    }

    const uploaded = await uploadToR2({
      kind: "file",
      fileName: attachment.name,
      mimeType: attachment.type || "application/octet-stream",
      body: Buffer.from(await attachment.arrayBuffer()),
    });

    const asset = await createMediaAsset(uploaded);
    attachmentMediaId = asset.id;
    attachmentUrl = asset.url;
  }

  const inquiry = await createInquiry({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    country: String(formData.get("country") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    message: String(formData.get("message") ?? ""),
    productId: Number.parseInt(String(formData.get("productId") ?? ""), 10) || null,
    sourcePage: String(formData.get("sourcePage") ?? ""),
    sourceUrl: String(formData.get("sourceUrl") ?? ""),
    attachmentMediaId,
  });

  await sendInquiryNotification({
    name: inquiry.name,
    email: inquiry.email,
    companyName: inquiry.companyName,
    country: inquiry.country,
    whatsapp: inquiry.whatsapp,
    message: inquiry.message,
    productName: String(formData.get("productName") ?? ""),
    sourceUrl: inquiry.sourceUrl,
    attachmentUrl,
  });

  return NextResponse.json({ success: true, inquiryId: inquiry.id });
}

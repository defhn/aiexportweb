import { NextResponse } from "next/server";

import { createQuoteRequest } from "@/features/quotes/actions";
import { normalizeCountryInput } from "@/lib/country";
import { validateInquiryAttachment } from "@/features/inquiries/validation";
import { getFeatureGate } from "@/features/plans/access";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { uploadToR2 } from "@/lib/r2";
import { createMediaAsset } from "@/features/media/actions";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const currentSite = await getCurrentSiteFromRequest();
  const gate = await getFeatureGate("request_quote", currentSite.plan, currentSite.id);
  const allowQuoteSystem = gate.status !== "locked";

  const formData = await request.formData();
  const token = String(formData.get("turnstileToken") ?? "");

  if (!(await verifyTurnstileToken(token))) {
    return NextResponse.json({ error: "Validation failed." }, { status: 400 });
  }

  const country = normalizeCountryInput(String(formData.get("country") ?? ""));
  const attachment = formData.get("attachment");
  let attachmentMediaId: number | null = null;

  if (attachment instanceof File && attachment.size > 0) {
    const validation = validateInquiryAttachment(attachment);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const uploaded = await uploadToR2({
      kind: "file",
      fileName: attachment.name,
      mimeType: attachment.type || "application/octet-stream",
      body: Buffer.from(await attachment.arrayBuffer()),
    });
    const asset = await createMediaAsset(uploaded);
    attachmentMediaId = asset.id;
  }

  const nativeKeys = new Set([
    "turnstileToken", "country", "attachment", "name", "email", 
    "companyName", "whatsapp", "message", "productId", "productName", 
    "quantity", "unit", "itemNotes"
  ]);

  const customFieldsJson: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (!nativeKeys.has(key) && typeof value === 'string') {
      customFieldsJson[key] = value;
    }
  }

  const record = allowQuoteSystem
    ? await createQuoteRequest({
        siteId: currentSite.id,
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        companyName: String(formData.get("companyName") ?? ""),
        country: country.normalizedName ?? (typeof formData.get("country") === 'string' ? String(formData.get("country")) : ""),
        countryCode: country.countryCode,
        whatsapp: String(formData.get("whatsapp") ?? ""),
        message: String(formData.get("message") ?? ""),
        attachmentMediaId,
        customFieldsJson,
        // UTM tracking params
        utmSource: String(formData.get("utmSource") ?? "") || null,
        utmMedium: String(formData.get("utmMedium") ?? "") || null,
        utmCampaign: String(formData.get("utmCampaign") ?? "") || null,
        utmTerm: String(formData.get("utmTerm") ?? "") || null,
        utmContent: String(formData.get("utmContent") ?? "") || null,
        gclid: String(formData.get("gclid") ?? "") || null,
        annualVolume: String(formData.get("annualVolume") ?? "") || null,
        companyWebsite: String(formData.get("companyWebsite") ?? "") || null,
        items: [
          {
            productId: Number.parseInt(String(formData.get("productId") ?? ""), 10) || null,
            productName: String(formData.get("productName") ?? ""),
            quantity: String(formData.get("quantity") ?? ""),
            unit: String(formData.get("unit") ?? ""),
            notes: String(formData.get("itemNotes") ?? ""),
          },
        ],
      })
    : null;

  if (allowQuoteSystem && !record) {
    return NextResponse.json({ error: "Unable to create quote request." }, { status: 500 });
  }

  if (!allowQuoteSystem) {
    return NextResponse.json({
      success: true,
      quoteRequestId: null,
      attachmentMediaId,
      downgraded: true,
    });
  }

  return NextResponse.json({ success: true, quoteRequestId: record?.id ?? null, attachmentMediaId });
}

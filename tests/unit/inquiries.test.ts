import { describe, expect, it } from "vitest";

import { buildInquiryEmailPayload } from "@/lib/brevo";
import { normalizeCountryInput } from "@/lib/country";
import { buildInquiryInsertPayload } from "@/features/inquiries/actions";
import { classifyInquiryByRules } from "@/features/inquiries/classification";
import { validateInquiryAttachment } from "@/features/inquiries/validation";

describe("inquiry payloads", () => {
  it("creates a readable transactional email body", () => {
    const payload = buildInquiryEmailPayload({
      name: "Jane",
      email: "jane@example.com",
      companyName: "OEM Parts GmbH",
      message: "Need a quote for 5,000 units.",
      productName: "Custom Aluminum CNC Bracket",
      sourceUrl:
        "https://example.com/products/aluminum/custom-aluminum-cnc-bracket",
    });

    expect(payload.subject).toContain("Custom Aluminum CNC Bracket");
    expect(payload.htmlContent).toContain("OEM Parts GmbH");
    expect(payload.htmlContent).toContain("Need a quote for 5,000 units.");
  });

  it("creates a normalized inquiry insert payload", () => {
    expect(
      buildInquiryInsertPayload({
        name: " Jane ",
        email: "jane@example.com",
        companyName: "OEM Parts GmbH",
        country: "Germany",
        whatsapp: "+491234567",
        message: "Need a quote",
        productId: 8,
        sourcePage: "product-detail",
        sourceUrl: "https://example.com/products/demo",
        countryCode: "DE",
        countryGroup: "Europe",
        sourceType: "product",
        categoryTag: "cnc-machining",
        inquiryType: "quotation",
        classificationMethod: "rule",
      }),
    ).toMatchObject({
      name: "Jane",
      email: "jane@example.com",
      status: "new",
      productId: 8,
      countryCode: "DE",
      countryGroup: "Europe",
      sourceType: "product",
      inquiryType: "quotation",
    });
  });

  it("normalizes country aliases into stable code and group", () => {
    expect(normalizeCountryInput(" USA ")).toEqual({
      raw: "USA",
      normalizedName: "United States",
      countryCode: "US",
      countryGroup: "North America",
    });
  });

  it("classifies inquiries by rules using source and message", () => {
    expect(
      classifyInquiryByRules({
        country: "United Kingdom",
        sourcePage: "product-detail",
        sourceUrl: "/products/cnc/custom-bracket",
        categoryTag: "cnc-machining",
        message: "Please quote 2000 pcs and share sample lead time.",
      }),
    ).toMatchObject({
      sourceType: "product",
      countryCode: "GB",
      countryGroup: "Europe",
      inquiryType: "quotation",
      categoryTag: "cnc-machining",
      classificationMethod: "rule",
    });
  });

  it("validates public inquiry attachments by type and size", () => {
    const pdf = new File(["demo"], "drawing.pdf", {
      type: "application/pdf",
    });
    const exe = new File(["demo"], "installer.exe", {
      type: "application/x-msdownload",
    });
    const huge = new File([new Uint8Array(11 * 1024 * 1024)], "large.zip", {
      type: "application/zip",
    });

    expect(validateInquiryAttachment(pdf)).toEqual({ ok: true });
    expect(validateInquiryAttachment(exe)).toMatchObject({ ok: false });
    expect(validateInquiryAttachment(huge)).toMatchObject({ ok: false });
  });
});

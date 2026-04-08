import { describe, expect, it } from "vitest";

import { buildInquiryEmailPayload } from "@/lib/brevo";
import { buildInquiryInsertPayload } from "@/features/inquiries/actions";

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
      }),
    ).toMatchObject({
      name: "Jane",
      email: "jane@example.com",
      status: "new",
      productId: 8,
    });
  });
});

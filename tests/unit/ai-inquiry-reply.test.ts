import { describe, expect, it } from "vitest";

import {
  buildFallbackInquiryReply,
  buildInquiryReplyPrompt,
} from "@/lib/ai";

describe("inquiry ai reply helpers", () => {
  it("builds a reply prompt with inquiry and product context", () => {
    const prompt = buildInquiryReplyPrompt({
      customerName: "Jane",
      companyName: "OEM Parts GmbH",
      message: "Need pricing for 5,000 units.",
      productName: "Custom Bracket",
      specs: ["Material: Aluminum 6061", "MOQ: 500 pcs"],
      tone: "professional",
    });

    expect(prompt.user).toContain("Jane");
    expect(prompt.user).toContain("MOQ: 500 pcs");
  });

  it("creates a fallback inquiry reply draft", () => {
    const reply = buildFallbackInquiryReply({
      customerName: "Jane",
      companyName: "OEM Parts GmbH",
      message: "Need pricing for 5,000 units.",
      productName: "Custom Bracket",
      specs: ["Material: Aluminum 6061", "MOQ: 500 pcs"],
      tone: "professional",
    });

    expect(reply).toContain("Dear Jane");
    expect(reply).toContain("Custom Bracket");
    expect(reply).toContain("MOQ: 500 pcs");
  });
});

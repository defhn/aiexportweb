import { describe, expect, it } from "vitest";

import {
  classifyInquiryByAiFallback,
  classifyInquiryByRules,
} from "@/features/inquiries/classification";

describe("inquiry classification", () => {
  it("detects technical inquiries with fallback AI classification", () => {
    expect(
      classifyInquiryByAiFallback(
        "Can you confirm tolerance, drawing review, and machining capability?",
      ),
    ).toBe("technical");
  });

  it("keeps cooperation inquiries distinct from quotations", () => {
    expect(
      classifyInquiryByRules({
        country: "Australia",
        sourcePage: "contact-page",
        sourceUrl: "/contact",
        message: "We want to discuss distribution cooperation in Sydney.",
      }),
    ).toMatchObject({
      inquiryType: "cooperation",
      sourceType: "contact",
      countryGroup: "Oceania",
    });
  });
});

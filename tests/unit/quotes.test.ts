import { describe, expect, it } from "vitest";

import {
  buildQuoteItemDrafts,
  buildQuoteRequestInsertPayload,
} from "@/features/quotes/actions";

describe("quote request helpers", () => {
  it("normalizes quote request payloads", () => {
    expect(
      buildQuoteRequestInsertPayload({
        name: " Jane ",
        email: "JANE@EXAMPLE.COM",
        companyName: "OEM Parts GmbH",
        country: "Germany",
        countryCode: "DE",
        whatsapp: "+49 123 4567",
        message: "Need FOB pricing.",
      }),
    ).toMatchObject({
      name: "Jane",
      email: "jane@example.com",
      countryCode: "DE",
      status: "new",
    });
  });

  it("filters empty quote items and keeps quantities", () => {
    expect(
      buildQuoteItemDrafts([
        {
          productId: 8,
          productName: "Custom Bracket",
          quantity: "5000",
          unit: "pcs",
          notes: "FOB Shanghai",
        },
        {
          productId: null,
          productName: "",
          quantity: "",
          unit: "",
          notes: "",
        },
      ]),
    ).toEqual([
      {
        productId: 8,
        productName: "Custom Bracket",
        quantity: "5000",
        unit: "pcs",
        notes: "FOB Shanghai",
      },
    ]);
  });
});

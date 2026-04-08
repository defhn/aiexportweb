import { describe, expect, it } from "vitest";

import {
  buildProductViewInsertPayload,
  buildProductViewSessionId,
} from "@/features/products/views";

describe("product view helpers", () => {
  it("creates stable session ids from request fingerprints", () => {
    expect(buildProductViewSessionId("Mozilla/5.0|en-US")).toBe(
      buildProductViewSessionId("Mozilla/5.0|en-US"),
    );
  });

  it("builds a normalized product view payload", () => {
    expect(
      buildProductViewInsertPayload({
        productId: 8,
        sessionId: "abc123",
        referer: "https://google.com/",
        countryCode: "US",
      }),
    ).toEqual({
      productId: 8,
      sessionId: "abc123",
      referer: "https://google.com/",
      countryCode: "US",
    });
  });
});

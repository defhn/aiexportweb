import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "@/proxy";

describe("public site preview proxy", () => {
  it("stores ?site preview selections in a cookie for follow-up navigation", async () => {
    const request = new NextRequest("https://aiexportweb.top/?site=cnc-demo");

    const response = await proxy(request);

    expect(response.cookies.get("preview_site")?.value).toBe("cnc-demo");
  });
});

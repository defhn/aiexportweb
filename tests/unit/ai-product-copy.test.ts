import { describe, expect, it } from "vitest";

import {
  buildFallbackProductCopy,
  buildProductCopyPrompt,
} from "@/lib/ai";

describe("product ai copy helpers", () => {
  it("builds a constrained manufacturing prompt", () => {
    const prompt = buildProductCopyPrompt({
      industry: "CNC machining",
      nameZh: "铝合金支架",
      shortDescriptionZh: "用于工业机柜的定制支架",
      defaultFields: {
        material: "Aluminum 6061",
        process: "CNC Milling",
      },
    });

    expect(prompt.system).toContain("manufacturing");
    expect(prompt.user).toContain("Aluminum 6061");
    expect(prompt.user).toContain("CNC machining");
  });

  it("creates deterministic fallback english product copy", () => {
    const result = buildFallbackProductCopy({
      industry: "CNC machining",
      nameZh: "铝合金支架",
      shortDescriptionZh: "用于工业机柜的定制支架",
      defaultFields: {
        material: "Aluminum 6061",
        process: "CNC Milling",
        application: "Industrial enclosure",
      },
    });

    expect(result.nameEn).toContain("Aluminum");
    expect(result.shortDescriptionEn).toContain("Industrial enclosure");
    expect(result.seoTitle).toContain("Manufacturer");
  });
});

import { describe, expect, it } from "vitest";

import { createExcerptFallback } from "@/lib/rich-text";

describe("createExcerptFallback", () => {
  it("strips tags and trims to 160 characters", () => {
    const excerpt = createExcerptFallback(
      "<p>Precision machining parts for aerospace, automotive, and industrial buyers worldwide.</p>",
    );

    expect(excerpt).toBe(
      "Precision machining parts for aerospace, automotive, and industrial buyers worldwide.",
    );
  });
});

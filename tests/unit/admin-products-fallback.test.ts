import { afterEach, describe, expect, it, vi } from "vitest";

import { listAdminProducts } from "@/features/products/queries";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("listAdminProducts", () => {
  it("falls back to seed data when database reads fail", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://example.com/test");

    const clientModule = await import("@/db/client");
    vi.spyOn(clientModule, "getDb").mockImplementation(() => {
      throw new Error("fetch failed");
    });

    const rows = await listAdminProducts("cnc");

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]?.slug).toBe("custom-aluminum-cnc-bracket");
  });
});

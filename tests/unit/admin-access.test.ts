import { describe, expect, it } from "vitest";

import { canAccessAdminPath, getVisibleAdminHrefs } from "@/lib/auth";

describe("admin access rules", () => {
  it("allows client admins to access settings and seo pages", () => {
    expect(canAccessAdminPath("client_admin", "/admin/settings")).toBe(true);
    expect(canAccessAdminPath("client_admin", "/admin/seo-ai")).toBe(true);
    expect(canAccessAdminPath("client_admin", "/admin/rag")).toBe(true);
  });

  it("keeps sidebar items aligned with accessible routes", () => {
    const clientAdminHrefs = getVisibleAdminHrefs("client_admin", [
      "/admin",
      "/admin/rag",
      "/admin/settings",
      "/admin/seo-ai",
    ]);

    expect(clientAdminHrefs).toEqual([
      "/admin",
      "/admin/rag",
      "/admin/settings",
      "/admin/seo-ai",
    ]);
  });
});

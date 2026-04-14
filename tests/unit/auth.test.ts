import { describe, expect, it } from "vitest";

import {
  buildSessionPayload,
  isProtectedAdminPath,
  normalizeLoginInput,
} from "@/lib/auth";

describe("auth helpers", () => {
  it("marks admin routes as protected except login", () => {
    expect(isProtectedAdminPath("/admin")).toBe(true);
    expect(isProtectedAdminPath("/admin/products")).toBe(true);
    expect(isProtectedAdminPath("/admin/login")).toBe(false);
  });

  it("normalizes login form input", () => {
    expect(
      normalizeLoginInput({
        username: " admin ",
        password: "secret123",
      }),
    ).toEqual({
      username: "admin",
      password: "secret123",
    });
  });

  it("creates a stable session payload", () => {
    expect(buildSessionPayload(7, "client_admin")).toEqual({
      adminUserId: 7,
      role: "client_admin",
    });
  });
});

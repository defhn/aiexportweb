import { jwtVerify, SignJWT } from "jose";

import { env } from "@/env";

export const SESSION_COOKIE_NAME = "admin_session";

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export type SessionPayload = {
  adminUserId: number;
  role: "super_admin" | "client_admin" | "employee";
};

function getSessionSecret() {
  return new TextEncoder().encode(env.SESSION_SECRET);
}

export function buildSessionPayload(adminUserId: number, role: "super_admin" | "client_admin" | "employee"): SessionPayload {
  return { adminUserId, role };
}

export function normalizeLoginInput(input: {
  username: string;
  password: string;
}) {
  return {
    username: input.username.trim(),
    password: input.password,
  };
}

export function isProtectedAdminPath(pathname: string) {
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
}

type AuthResult = { isValid: false } | { isValid: true; role: "super_admin" | "client_admin" };

export function isValidAdminCredentials(input: {
  username: string;
  password: string;
}): AuthResult {
  const normalized = normalizeLoginInput(input);

  // Check Super Admin Credentials (from Env)
  const superUser = process.env.SUPER_ADMIN_USERNAME ?? "superadmin";
  const superPass = process.env.SUPER_ADMIN_PASSWORD ?? env.ADMIN_PASSWORD;

  if (normalized.username === superUser && normalized.password === superPass) {
    return { isValid: true, role: "super_admin" };
  }

  // Check Client Admin Credentials (from Env)
  if (normalized.username === env.ADMIN_USERNAME && normalized.password === env.ADMIN_PASSWORD) {
    return { isValid: true, role: "client_admin" };
  }

  return { isValid: false };
}

export function getSafeAdminRedirectPath(nextPath?: string | null) {
  if (!nextPath || !nextPath.startsWith("/admin") || nextPath.startsWith("//") || nextPath.startsWith("/admin/login")) {
    return "/admin";
  }
  return nextPath;
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const result = await jwtVerify(token, getSessionSecret());
    return result.payload as SessionPayload;
  } catch {
    return null;
  }
}


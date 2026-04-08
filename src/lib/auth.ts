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
};

function getSessionSecret() {
  return new TextEncoder().encode(env.SESSION_SECRET);
}

export function buildSessionPayload(adminUserId: number): SessionPayload {
  return { adminUserId };
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
  return pathname.startsWith("/admin") && pathname !== "/admin/login";
}

export function isValidAdminCredentials(input: {
  username: string;
  password: string;
}) {
  const normalized = normalizeLoginInput(input);

  return (
    normalized.username === env.ADMIN_USERNAME &&
    normalized.password === env.ADMIN_PASSWORD
  );
}

export function getSafeAdminRedirectPath(nextPath?: string | null) {
  if (!nextPath) {
    return "/admin";
  }

  if (!nextPath.startsWith("/admin") || nextPath.startsWith("//")) {
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

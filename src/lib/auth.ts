import { jwtVerify, SignJWT } from "jose";

import { env } from "@/env";

export const SESSION_COOKIE_NAME = "admin_session";

export type AdminRole = "super_admin" | "client_admin" | "employee";

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export type SessionPayload = {
  adminUserId: number;
  role: AdminRole;
};

function getSessionSecret() {
  return new TextEncoder().encode(env.SESSION_SECRET);
}

export function buildSessionPayload(adminUserId: number, role: AdminRole): SessionPayload {
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

// 黑名单模式：employee 只禁止访问敏感管理页；client_admin/super_admin 访问全部路由
const EMPLOYEE_BLOCKED_PATHS = [
  "/admin/settings",
  "/admin/seo-ai",
  "/admin/staff",
  "/admin/attribution",
  "/admin/pipeline",
  "/admin/rag",
  "/admin/files",
  "/admin/categories",
  "/admin/pages",
  "/admin/reply-templates",
];

export function canAccessAdminPath(role: AdminRole, pathname: string) {
  if (!pathname.startsWith("/admin")) {
    return false;
  }

  // super_admin 和 client_admin 可以访问所有后台路由
  if (role === "super_admin" || role === "client_admin") {
    return true;
  }

  // employee 角色：黑名单屏蔽敏感路由
  const isBlocked = EMPLOYEE_BLOCKED_PATHS.some(
    (blocked) => pathname === blocked || pathname.startsWith(`${blocked}/`),
  );

  return !isBlocked;
}

export function getVisibleAdminHrefs(role: AdminRole, hrefs: string[]) {
  return hrefs.filter((href) => canAccessAdminPath(role, href));
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


import { compare, hash } from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { adminUsers } from "@/db/schema";
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
  siteId: number | null;
  siteSlug: string | null;
};

function getSessionSecret() {
  return new TextEncoder().encode(env.SESSION_SECRET);
}

export function buildSessionPayload(
  adminUserId: number,
  role: AdminRole,
  siteId: number | null = null,
  siteSlug: string | null = null,
): SessionPayload {
  return { adminUserId, role, siteId, siteSlug };
}

export function normalizeLoginInput(input: { username: string; password: string }) {
  return {
    username: input.username.trim(),
    password: input.password,
  };
}

export function isProtectedAdminPath(pathname: string) {
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
}

type AuthResult =
  | { isValid: false }
  | { isValid: true; userId: number; role: "super_admin" | "client_admin" | "employee" };

/**
 * 验证登录凭证：
 * 1. 优先查 adminUsers 表（bcrypt hash）
 * 2. 若无任何数据库账号，则兜底使用环境变量（ADMIN_USERNAME / ADMIN_PASSWORD）
 */
export async function validateCredentials(input: {
  username: string;
  password: string;
}): Promise<AuthResult> {
  const { username, password } = normalizeLoginInput(input);
  const db = getDb();

  // ── 1. 优先检查数据库账号 ────────────────────────────────────────────────
  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (user) {
    const ok = await compare(password, user.passwordHash);
    if (!ok) return { isValid: false };

    // 数据库账号的角色映射
    const role: AdminRole =
      user.role === "employee" ? "employee" : "client_admin";

    return { isValid: true, userId: user.id, role };
  }

  // ── 2. 兜底：环境变量（超级管理员 / 向后兼容旧部署）─────────────────────
  const envUser = env.ADMIN_USERNAME;
  const envPass = env.ADMIN_PASSWORD;

  if (envUser && envPass && username === envUser && password === envPass) {
    // 兜底账号视为 super_admin，用虚拟 userId=0 标记
    return { isValid: true, userId: 0, role: "super_admin" };
  }

  // SUPER_ADMIN_USERNAME / SUPER_ADMIN_PASSWORD（支持 ops 覆盖）
  const superUser = process.env.SUPER_ADMIN_USERNAME;
  const superPass = process.env.SUPER_ADMIN_PASSWORD;
  if (superUser && superPass && username === superUser && password === superPass) {
    return { isValid: true, userId: 0, role: "super_admin" };
  }

  return { isValid: false };
}

/**
 * 修改密码（使用当前登录用户 ID）
 * @returns true 成功，false 旧密码不正确，'not_found' 账号不存在
 */
export async function changeAdminPassword(
  userId: number,
  oldPassword: string,
  newPassword: string,
): Promise<true | false | "not_found"> {
  if (userId === 0) {
    // env var 兜底账号不支持通过 UI 修改，必须去 Vercel 改环境变量
    return "not_found";
  }

  const db = getDb();
  const user = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, userId))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!user) return "not_found";

  const ok = await compare(oldPassword, user.passwordHash);
  if (!ok) return false;

  const newHash = await hash(newPassword, 12);
  await db
    .update(adminUsers)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(adminUsers.id, userId));

  return true;
}

/**
 * 创建管理员账号（首次 setup 或超管创建员工）
 */
export async function createAdminUser(
  username: string,
  password: string,
  role: "client_admin" | "employee" = "client_admin",
): Promise<{ id: number }> {
  const passwordHash = await hash(password, 12);
  const db = getDb();

  const [created] = await db
    .insert(adminUsers)
    .values({ username, passwordHash, role })
    .returning({ id: adminUsers.id });

  return created!;
}

export function getSafeAdminRedirectPath(nextPath?: string | null) {
  if (
    !nextPath ||
    !nextPath.startsWith("/admin") ||
    nextPath.startsWith("//") ||
    nextPath.startsWith("/admin/login")
  ) {
    return "/admin";
  }
  return nextPath;
}

// 黑名单模式：employee 只禁止访问敏感管理页
const EMPLOYEE_BLOCKED_PATHS = [
  "/admin/settings",
  "/admin/seo-ai",
  "/admin/sites",
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
  if (!pathname.startsWith("/admin")) return false;
  if (role === "super_admin" || role === "client_admin") return true;

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

// 向后兼容（旧代码可能调用此函数）
export function isValidAdminCredentials(input: {
  username: string;
  password: string;
}): { isValid: false } | { isValid: true; role: "super_admin" | "client_admin" } {
  const normalized = normalizeLoginInput(input);
  const envUser = env.ADMIN_USERNAME ?? "admin";
  const envPass = env.ADMIN_PASSWORD ?? "";

  if (normalized.username === envUser && envPass && normalized.password === envPass) {
    return { isValid: true, role: "client_admin" };
  }
  return { isValid: false };
}

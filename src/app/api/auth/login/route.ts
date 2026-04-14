import { NextResponse } from "next/server";

import { getAdminUserByUsername, verifyPassword } from "@/features/admin-users/service";
import {
  buildSessionPayload,
  getSafeAdminRedirectPath,
  normalizeLoginInput,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  signSessionToken,
} from "@/lib/auth";
import { env } from "@/env";

type LoginRequestBody = {
  username?: string;
  password?: string;
  next?: string | null;
};

export async function POST(request: Request) {
  let body: LoginRequestBody = {};

  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    body = {};
  }

  const input = normalizeLoginInput({
    username: String(body.username ?? ""),
    password: String(body.password ?? ""),
  });

  // ── 1. 数据库账号（优先）──────────────────────────────────────────────
  const dbUser = await getAdminUserByUsername(input.username);
  if (dbUser) {
    const passwordOk = await verifyPassword(input.password, dbUser.passwordHash);
    if (passwordOk) {
      const role = dbUser.role === "employee" ? "employee" : "client_admin";
      const token = await signSessionToken(buildSessionPayload(dbUser.id, role));
      const response = NextResponse.json({
        success: true,
        redirectTo: getSafeAdminRedirectPath(body.next),
      });
      response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
      return response;
    }
  }

  // ── 2. 环境变量兜底（SUPER_ADMIN 或旧部署方式）────────────────────────
  const envUser = env.ADMIN_USERNAME;
  const envPass = env.ADMIN_PASSWORD;

  if (envUser && envPass && input.username === envUser && input.password === envPass) {
    const token = await signSessionToken(buildSessionPayload(0, "super_admin"));
    const response = NextResponse.json({
      success: true,
      redirectTo: getSafeAdminRedirectPath(body.next),
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
    return response;
  }

  // SUPER_ADMIN_USERNAME / SUPER_ADMIN_PASSWORD（ops 级别覆盖）
  const superUser = process.env.SUPER_ADMIN_USERNAME;
  const superPass = process.env.SUPER_ADMIN_PASSWORD;
  if (superUser && superPass && input.username === superUser && input.password === superPass) {
    const token = await signSessionToken(buildSessionPayload(0, "super_admin"));
    const response = NextResponse.json({
      success: true,
      redirectTo: getSafeAdminRedirectPath(body.next),
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
    return response;
  }

  return NextResponse.json(
    { error: "用户名或密码错误，请重试。" },
    { status: 401 },
  );
}

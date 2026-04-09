import { NextResponse } from "next/server";

import {
  buildSessionPayload,
  getSafeAdminRedirectPath,
  isValidAdminCredentials,
  normalizeLoginInput,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  signSessionToken,
} from "@/lib/auth";
import { getAdminUserByUsername, verifyPassword } from "@/features/admin-users/service";

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

  // 第一优先级：检�?ENV 里的超级管理�?/ 客户管理�?  const envAuthResult = isValidAdminCredentials(input);
  if (envAuthResult.isValid) {
    const token = await signSessionToken(buildSessionPayload(0, envAuthResult.role));
    const response = NextResponse.json({
      success: true,
      redirectTo: getSafeAdminRedirectPath(body.next),
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
    return response;
  }

  // 第二优先级：检查数据库里的员工账号
  const dbUser = await getAdminUserByUsername(input.username);
  if (dbUser) {
    const passwordOk = await verifyPassword(input.password, dbUser.passwordHash);
    if (passwordOk) {
      const token = await signSessionToken(buildSessionPayload(dbUser.id, "employee"));
      const response = NextResponse.json({
        success: true,
        redirectTo: getSafeAdminRedirectPath(body.next),
      });
      response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
      return response;
    }
  }

  return NextResponse.json({ error: "账号或密码错误�? }, { status: 401 });
}

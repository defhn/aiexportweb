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

  if (!isValidAdminCredentials(input)) {
    return NextResponse.json({ error: "账号或密码错误。" }, { status: 401 });
  }

  const token = await signSessionToken(buildSessionPayload(1));
  const response = NextResponse.json({
    success: true,
    redirectTo: getSafeAdminRedirectPath(body.next),
  });

  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);

  return response;
}

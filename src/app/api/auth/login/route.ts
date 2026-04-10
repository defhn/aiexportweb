import { NextResponse } from "next/server";

import { getAdminUserByUsername, verifyPassword } from "@/features/admin-users/service";
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

  const envAuthResult = isValidAdminCredentials(input);
  if (envAuthResult.isValid) {
    const token = await signSessionToken(buildSessionPayload(0, envAuthResult.role));
    const response = NextResponse.json({
      success: true,
      redirectTo: getSafeAdminRedirectPath(body.next),
    });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
    return response;
  }

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

  return NextResponse.json(
    { error: "Invalid username or password." },
    { status: 401 },
  );
}

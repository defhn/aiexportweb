import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getSafeAdminRedirectPath,
  isProtectedAdminPath,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", getSafeAdminRedirectPath(pathname));
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifySessionToken(token);

  if (session) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", getSafeAdminRedirectPath(pathname));

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieOptions,
    maxAge: 0,
  });

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

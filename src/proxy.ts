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
    // 员工：只能访问日常操作页�?    if (session.role === "employee") {
      const allowedPrefixes = ["/admin", "/admin/products", "/admin/blog", "/admin/inquiries", "/admin/quotes", "/admin/media"];
      const isAllowed = allowedPrefixes.some(p => pathname === p) ||
        pathname.startsWith("/admin/products") ||
        pathname.startsWith("/admin/blog") ||
        pathname.startsWith("/admin/inquiries") ||
        pathname.startsWith("/admin/quotes") ||
        pathname.startsWith("/admin/media");
      if (!isAllowed) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    // 客户管理员：不能访问超管专用�?settings / seo-ai / staff 页面
    if (session.role === "client_admin") {
      const isRestricted = pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/seo-ai");
      if (isRestricted) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
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

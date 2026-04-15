import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  canAccessAdminPath,
  getSafeAdminRedirectPath,
  isProtectedAdminPath,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/auth";

const PREVIEW_SITE_COOKIE_NAME = "preview_site";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const previewSiteFromQuery = request.nextUrl.searchParams.get("site")?.trim();
  const previewSiteFromCookie = request.cookies.get(PREVIEW_SITE_COOKIE_NAME)?.value;
  const previewSite = previewSiteFromQuery || previewSiteFromCookie || "";
  const requestHeaders = new Headers(request.headers);

  if (previewSite) {
    requestHeaders.set("x-preview-site", previewSite);
  }

  const nextWithPreviewHeaders = () => {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    if (previewSiteFromQuery) {
      response.cookies.set(PREVIEW_SITE_COOKIE_NAME, previewSiteFromQuery, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  };

  if (!isProtectedAdminPath(pathname)) {
    return nextWithPreviewHeaders();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", getSafeAdminRedirectPath(pathname));
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifySessionToken(token);

  if (session) {
    if (!canAccessAdminPath(session.role, pathname)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return nextWithPreviewHeaders();
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png).*)"],
};

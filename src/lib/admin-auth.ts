import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

/** 从 Next.js 请求的 Headers（服务端路由）读取 session */
export async function getAdminSession(request: Request) {
  // 优先从 Request headers 读（API route）
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  const token = match?.[1];

  if (!token) return null;
  return verifySessionToken(token);
}

/** 从 Next.js Server Component 的 cookies() 读取 session（Server Action / Page）*/
export async function getAdminSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * 高阶函数：包装 API Route Handler，自动校验 admin session
 * 用法：export const POST = withAdminAuth(async (req, session) => { ... })
 */
export function withAdminAuth(
  handler: (
    request: Request,
    session: { adminUserId: number; role: string; siteId: number | null; siteSlug: string | null },
  ) => Promise<Response>,
) {
  return async (request: Request): Promise<Response> => {
    const session = await getAdminSession(request);

    if (!session) {
      return NextResponse.json(
        { error: "未登录，请先登录后台。" },
        { status: 401 },
      );
    }

    return handler(request, session);
  };
}

/**
 * API 统一响应格式工具
 */
export function apiOk<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

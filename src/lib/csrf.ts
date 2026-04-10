/**
 * Server Action CSRF 防护模块
 *
 * Next.js Server Actions 天然防止跨站请求：Same-Origin 限制
 * - 浏览器发送 Cookie 时 SameSite=Lax 会阻止第三方 POST 携带 Cookie
 * - 配置 siteUrl 后会额外校验 Origin/Referer 来源与站点域名匹配
 *
 * 使用方法：在每个 Server Action 开头调用 assertSameOrigin()
 */

import { headers } from "next/headers";

/**
 * 读取 siteUrl 配置并解析 origin 部分，若未配置则返回 null
 * Next.js Server Actions 本身具备 CSRF 防护：SameSite=Lax + Content-Type 类型检查
 * 本模块在此基础上提供额外的 Origin/Referer 校验层
 */
async function getExpectedOrigin(): Promise<string | null> {
  // 延迟导入避免循环依赖
  const { getSiteSettings } = await import("@/features/settings/queries");
  const settings = await getSiteSettings();
  if (!settings.siteUrl) return null;

  try {
    return new URL(settings.siteUrl).origin;
  } catch {
    return null;
  }
}

/**
 * Server Action CSRF 来源校验
 * - 若已配置 siteUrl 则严格校验 Origin/Referer 是否来自本站
 * - 优先检查 Origin 头，其次检查 Referer 头
 * - 校验失败时抛出 Error，中断 Action 执行
 */
export async function assertSameOrigin(): Promise<void> {
  const expectedOrigin = await getExpectedOrigin();

  // siteUrl 未配置则跳过校验（开发环境常见场景）
  if (!expectedOrigin) return;

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const referer = requestHeaders.get("referer");

  // 优先校验 Origin 头，不存在时退后检查 Referer
  if (origin) {
    if (origin !== expectedOrigin) {
      throw new Error(`CSRF: Invalid origin '${origin}' (expected '${expectedOrigin}')`);
    }
    return;
  }

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (refererOrigin !== expectedOrigin) {
        throw new Error(`CSRF: Invalid referer origin '${refererOrigin}'`);
      }
      return;
    } catch {
      throw new Error("CSRF: Malformed Referer header");
    }
  }

  // 既无 Origin 也无 Referer：生产环境严格拒绝，开发环境放行
  if (process.env.NODE_ENV === "production") {
    throw new Error("CSRF: Missing Origin and Referer headers");
  }
}

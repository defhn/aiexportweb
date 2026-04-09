/**
 * Server Action CSRF 防护工具
 *
 * Next.js Server Actions 与浏览器的 Same-Origin 策略配合：
 * - 自动携带 Cookie（SameSite=Lax 已阻断跨站 POST 带 Cookie）
 * - 但当 siteUrl 已配置时，我们额外做 Origin/Referer 来源验证作为纵深防御
 *
 * 使用方式：在所有写操作 Server Action 开头调用 assertSameOrigin()
 */

import { headers } from "next/headers";

/**
 * 从 siteUrl 提取 origin，如果未配置则返回 null（跳过验证）。
 * Next.js Server Actions 已内置 CSRF 防护（SameSite=Lax + Content-Type 检查），
 * 此函数作为额外的纵深防御层。
 */
async function getExpectedOrigin(): Promise<string | null> {
  // 动态加载以避免循环依赖
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
 * Server Action CSRF 来源验证
 * - 仅当 siteUrl 配置后才执行验证（安全降级：未配置时不阻断）
 * - 校验 Origin 或 Referer 头必须匹配期望的源
 * - 抛出 Error 以中断 Action 执行
 */
export async function assertSameOrigin(): Promise<void> {
  const expectedOrigin = await getExpectedOrigin();

  // siteUrl 未配置，跳过验证（开发/初始化阶段不阻断）
  if (!expectedOrigin) return;

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const referer = requestHeaders.get("referer");

  // 优先校验 Origin，其次 Referer
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

  // 没有 Origin 也没有 Referer，在生产环境拒绝（防止工具类直接请求）
  if (process.env.NODE_ENV === "production") {
    throw new Error("CSRF: Missing Origin and Referer headers");
  }
}

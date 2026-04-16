/**
 * template-01 公共布局
 * 行业：工业制造 / CNC 精密加工
 *
 * 包含此模板专属的 Header 和 Footer 样式。
 * 修改此文件只影响 template-01，不会波及其他模板。
 */

import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";

import type { PublicLayoutProps } from "@/templates/types";
import { getTemplateTheme } from "@/templates/theme";

export function Template01Layout({ children, settings, categories }: PublicLayoutProps) {
  const theme = getTemplateTheme("template-01");
  return (
    <div className="relative flex min-h-screen flex-col text-white selection:bg-blue-500/30 selection:text-blue-900" style={{ backgroundColor: theme.surface }}>
      <TrackingProvider />
      <SiteHeader companyName={settings.companyNameEn} theme={theme} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        address={settings.addressEn ?? ""}
        categories={categories.slice(0, 4).map((category) => ({
          nameEn: category.nameEn,
          slug: category.slug,
        }))}
        companyName={settings.companyNameEn}
        email={settings.email ?? ""}
        phone={settings.phone ?? ""}
        theme={theme}
      />
      <CookieConsentBanner />
    </div>
  );
}

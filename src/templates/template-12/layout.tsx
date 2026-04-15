/**
 * template-12 公共布局
 * 行业：生活礼品 / 文创礼品
 */

import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";

import type { PublicLayoutProps } from "@/templates/types";
import { getTemplateTheme } from "@/templates/theme";

export function Template12Layout({ children, settings, categories }: PublicLayoutProps) {
  const theme = getTemplateTheme("template-12");

  return (
    <div className="min-h-screen flex flex-col bg-[#fffaf4] text-[#2d1f1b] selection:bg-amber-300/30 selection:text-amber-950">
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

/**
 * template-11 公共布局
 * 行业：消费品电子 / 智能硬件
 */

import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";

import type { PublicLayoutProps } from "@/templates/types";
import { getTemplateTheme } from "@/templates/theme";

export function Template11Layout({ children, settings, categories }: PublicLayoutProps) {
  const theme = getTemplateTheme("template-11");

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-50 selection:bg-cyan-400/30 selection:text-cyan-100">
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

/**
 * template-04 公共布局
 * 行业：能源电力 / 配电系统 / 工商业储能
 */

import Link from "next/link";

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";
import { getTemplateTheme } from "@/templates/theme";


// EnergyHeader (theme-aware)
function EnergyHeader({ companyName }: { companyName: string }) {
  const theme = getTemplateTheme("template-04");
  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex items-center gap-2.5" style={{ color: theme.accent }}>
          <span className="flex h-7 w-7 items-center justify-center rounded" style={{ backgroundColor: theme.accent, color: "white", fontSize: "0.75rem" }}>
            EP
          </span>
          <span>{companyName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Products", href: "/products" },
            { label: "Solutions", href: "/capabilities" },
            { label: "Projects", href: "/about" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="rounded px-4 py-2 text-sm" style={{ color: theme.accent }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded" style={{ backgroundColor: theme.accent, color: "white" }}>
          Request Proposal
        </Link>
      </div>
    </header>
  );
}

export function Template04Layout({ children, settings, categories }: PublicLayoutProps) {
  const theme = getTemplateTheme("template-04");
  return (
    <div className="relative flex min-h-screen flex-col bg-[#070f1b] text-white selection:bg-cyan-500/30 selection:text-cyan-100">
      <TrackingProvider />
      <EnergyHeader companyName={settings.companyNameEn} />
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

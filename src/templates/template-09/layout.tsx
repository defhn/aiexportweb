// template-09 公共布局
// 行业：家具

import Link from "next/link";
import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";
import { getTemplateTheme } from "@/templates/theme";

function FurnitureHeader({ companyName }: { companyName: string }) {
  const theme = getTemplateTheme("template-09");
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight" style={{ color: theme.accent }}>
          <span className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/15 text-xs font-bold text-amber-300">FN</span>
          <span>{companyName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[{ label: "Products", href: "/products" }, { label: "Collections", href: "/capabilities" }, { label: "About", href: "/about" }, { label: "Blog", href: "/blog" }].map((item) => (
            <Link key={item.href} href={item.href} className="rounded px-4 py-2 text-sm font-medium" style={{ color: theme.accent }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="inline-flex items-center gap-2 rounded px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor: theme.accent, color: "white" }}>
          Request Quote
        </Link>
      </div>
    </header>
  );
}

export function Template09Layout({ children, settings, categories }: PublicLayoutProps) {
  const theme = getTemplateTheme("template-09");
  return (
    <div className="relative flex min-h-screen flex-col" style={{ backgroundColor: theme.surface, color: theme.accent }}>
      <TrackingProvider />
      <FurnitureHeader companyName={settings.companyNameEn} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        address={settings.addressEn ?? ""}
        categories={categories.slice(0, 4).map((c) => ({ nameEn: c.nameEn, slug: c.slug }))}
        companyName={settings.companyNameEn}
        email={settings.email ?? ""}
        phone={settings.phone ?? ""}
        theme={theme}
      />
      <CookieConsentBanner />
    </div>
  );
}

/**
 * template-07 公共布局
 * 行业：照明灯具 / 商业照明 / 工业照明
 */

import Link from "next/link";

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";

function LightingHeader({ companyName }: { companyName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#3b2f1d] bg-[#12100c]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/20 text-xs font-bold text-amber-300">
            LT
          </span>
          <span>{companyName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Products", href: "/products" },
            { label: "Projects", href: "/capabilities" },
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="rounded px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="inline-flex items-center gap-2 rounded bg-amber-500 px-5 py-2.5 text-sm font-semibold tracking-wide text-[#1f1405] hover:bg-amber-400">
          Request Catalog
        </Link>
      </div>
    </header>
  );
}

export function Template07Layout({ children, settings, categories }: PublicLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0f0d09] text-white selection:bg-amber-500/30 selection:text-amber-100">
      <TrackingProvider />
      <LightingHeader companyName={settings.companyNameEn} />
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
        theme={{ accent: "#f59e0b", surface: "#0f0d09", surfaceAlt: "#12100c", border: "#3b2f1d" }}
      />
      <CookieConsentBanner />
    </div>
  );
}

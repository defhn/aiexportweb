/**
 * template-06 公共布局
 * 行业：流体工程 / HVAC / 管路系统
 */

import Link from "next/link";

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";

function FluidHeader({ companyName }: { companyName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1f3f36] bg-[#0a1b17]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500/15 text-xs font-bold text-emerald-300">
            FH
          </span>
          <span>{companyName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Products", href: "/products" },
            { label: "Systems", href: "/capabilities" },
            { label: "Projects", href: "/about" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="rounded px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="inline-flex items-center gap-2 rounded bg-emerald-600 px-5 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-emerald-500">
          Request Solution
        </Link>
      </div>
    </header>
  );
}

export function Template06Layout({ children, settings, categories }: PublicLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#091411] text-white selection:bg-emerald-500/30 selection:text-emerald-100">
      <TrackingProvider />
      <FluidHeader companyName={settings.companyNameEn} />
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
        theme={{ accent: "#14b8a6", surface: "#091411", surfaceAlt: "#0a1b17", border: "#1f3f36" }}
      />
      <CookieConsentBanner />
    </div>
  );
}

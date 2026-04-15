/**
 * template-04 公共布局
 * 行业：能源电力 / 配电系统 / 工商业储能
 */

import Link from "next/link";

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";

function EnergyHeader({ companyName }: { companyName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#12324d] bg-[#081322]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-cyan-400/20 text-xs font-bold text-cyan-300">
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
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors bg-cyan-600 hover:bg-cyan-500"
        >
          Request Proposal
        </Link>
      </div>
    </header>
  );
}

export function Template04Layout({ children, settings, categories }: PublicLayoutProps) {
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
        theme={{ accent: "#22d3ee", surface: "#070f1b", surfaceAlt: "#081322", border: "#12324d" }}
      />
      <CookieConsentBanner />
    </div>
  );
}

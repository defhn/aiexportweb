/**
 * template-05 公共布局
 * 行业：医疗健康 / 医疗耗材 / 康复设备
 */

import Link from "next/link";

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";

function MedicalHeader({ companyName }: { companyName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dbeafe] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-[#0f172a]">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-sky-100 text-xs font-bold text-sky-700">
            MH
          </span>
          <span>{companyName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Products", href: "/products" },
            { label: "Compliance", href: "/capabilities" },
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded bg-sky-600 px-5 py-2.5 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-sky-500"
        >
          Request Catalog
        </Link>
      </div>
    </header>
  );
}

export function Template05Layout({ children, settings, categories }: PublicLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f8fbff] text-[#0f172a] selection:bg-sky-500/25 selection:text-sky-900">
      <TrackingProvider />
      <MedicalHeader companyName={settings.companyNameEn} />
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
        theme={{ accent: "#0ea5e9", surface: "#07111d", surfaceAlt: "#ffffff", border: "#dbeafe" }}
      />
      <CookieConsentBanner />
    </div>
  );
}

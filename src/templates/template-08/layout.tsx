import Link from "next/link";

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";

function HardwareHeader({ companyName }: { companyName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#2f353e] bg-[#12161d]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-500/20 text-xs font-bold text-indigo-300">HP</span>
          <span>{companyName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {["Products", "Capabilities", "About", "Blog"].map((item) => (
            <Link key={item} href={item === "Products" ? "/products" : item === "Blog" ? "/blog" : item === "About" ? "/about" : "/capabilities"} className="rounded px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white">
              {item}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="inline-flex items-center gap-2 rounded bg-indigo-600 px-5 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-indigo-500">
          Request Quote
        </Link>
      </div>
    </header>
  );
}

export function Template08Layout({ children, settings, categories }: PublicLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0f1218] text-white selection:bg-indigo-500/30 selection:text-indigo-100">
      <TrackingProvider />
      <HardwareHeader companyName={settings.companyNameEn} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        address={settings.addressEn ?? ""}
        categories={categories.slice(0, 4).map((category) => ({ nameEn: category.nameEn, slug: category.slug }))}
        companyName={settings.companyNameEn}
        email={settings.email ?? ""}
        phone={settings.phone ?? ""}
        theme={{ accent: "#6366f1", surface: "#0f1218", surfaceAlt: "#12161d", border: "#2f353e" }}
      />
      <CookieConsentBanner />
    </div>
  );
}

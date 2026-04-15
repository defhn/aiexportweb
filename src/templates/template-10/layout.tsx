import Link from "next/link";

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";

function TextileHeader({ companyName }: { companyName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d7d7ea] bg-[#f9f9ff]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-[#22223b]">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-violet-200 text-xs font-bold text-violet-700">TP</span>
          <span>{companyName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {["Products", "Solutions", "About", "Blog"].map((item) => (
            <Link key={item} href={item === "Products" ? "/products" : item === "Blog" ? "/blog" : item === "About" ? "/about" : "/capabilities"} className="rounded px-4 py-2 text-sm font-medium text-[#5d5f87] hover:bg-[#f0f1ff] hover:text-[#22223b]">
              {item}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="inline-flex items-center gap-2 rounded bg-violet-600 px-5 py-2.5 text-sm font-semibold tracking-wide text-white hover:bg-violet-500">
          Request Samples
        </Link>
      </div>
    </header>
  );
}

export function Template10Layout({ children, settings, categories }: PublicLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f5f6ff] text-[#22223b] selection:bg-violet-400/30 selection:text-violet-900">
      <TrackingProvider />
      <TextileHeader companyName={settings.companyNameEn} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        address={settings.addressEn ?? ""}
        categories={categories.slice(0, 4).map((category) => ({ nameEn: category.nameEn, slug: category.slug }))}
        companyName={settings.companyNameEn}
        email={settings.email ?? ""}
        phone={settings.phone ?? ""}
        theme={{ accent: "#7c3aed", surface: "#f5f6ff", surfaceAlt: "#f9f9ff", border: "#d7d7ea" }}
      />
      <CookieConsentBanner />
    </div>
  );
}

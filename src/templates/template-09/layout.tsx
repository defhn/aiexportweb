import Link from "next/link";

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";

function FurnitureHeader({ companyName }: { companyName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e7dfd4] bg-[#fffdf8]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-[#2a2016]">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-[#2a2016] text-xs font-bold text-[#f5e8d8]">FO</span>
          <span>{companyName}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {["Products", "Collections", "About", "Blog"].map((item) => (
            <Link key={item} href={item === "Products" ? "/products" : item === "Blog" ? "/blog" : item === "About" ? "/about" : "/capabilities"} className="rounded px-4 py-2 text-sm font-medium text-[#6b5d4d] hover:bg-[#f7f1e8] hover:text-[#2a2016]">
              {item}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="inline-flex items-center gap-2 rounded bg-[#2a2016] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#f5e8d8] hover:bg-[#3a2b1c]">
          Request Catalog
        </Link>
      </div>
    </header>
  );
}

export function Template09Layout({ children, settings, categories }: PublicLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#fffaf2] text-[#2a2016] selection:bg-[#d7c0a1]/35 selection:text-[#2a2016]">
      <TrackingProvider />
      <FurnitureHeader companyName={settings.companyNameEn} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        address={settings.addressEn ?? ""}
        categories={categories.slice(0, 4).map((category) => ({ nameEn: category.nameEn, slug: category.slug }))}
        companyName={settings.companyNameEn}
        email={settings.email ?? ""}
        phone={settings.phone ?? ""}
        theme={{ accent: "#9b7b57", surface: "#fffaf2", surfaceAlt: "#fffdf8", border: "#e7dfd4" }}
      />
      <CookieConsentBanner />
    </div>
  );
}

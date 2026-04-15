/**
 * template-03 公共布局
 * 行业：建材建筑 / 铝型材 / 金属装饰材料
 *
 * 极简白底，暖金品牌色，衬线字体氛围，独立专属 Header。
 * 修改此文件只影响 template-03，不会波及其他模板。
 */

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";
import Link from "next/link";

// 建材专属 Header —— 白底 + 炭灰文字 + 金色 CTA
function ArchitecturalHeader({ companyName }: { companyName: string }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e7e5e0]">
      <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-[#1c1917] tracking-tight"
        >
          <span className="w-7 h-7 rounded-full bg-[#1c1917] flex items-center justify-center text-[#b8936a] text-xs font-bold">
            AM
          </span>
          <span className="text-base">{companyName}</span>
        </Link>

        {/* 主导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Products",     href: "/products" },
            { label: "Finishes",     href: "/capabilities" },
            { label: "Projects",     href: "/about" },
            { label: "Blog",         href: "/blog" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm text-[#78716c] hover:text-[#1c1917] hover:bg-[#f5f4f0] rounded transition-colors font-medium tracking-wide"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1c1917] hover:bg-[#292524] text-white text-sm font-semibold tracking-wider rounded-sm transition-colors"
        >
          Request Catalog
        </Link>
      </div>
    </header>
  );
}

export function Template03Layout({ children, settings, categories }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#1c1917] flex flex-col relative selection:bg-[#b8936a]/20 selection:text-[#7c5a3a]">
      <TrackingProvider />
      <ArchitecturalHeader companyName={settings.companyNameEn} />
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
        theme={{ accent: "#b8936a", surface: "#1c1917", surfaceAlt: "#0f0d0b", border: "#2a2623" }}
      />
      <CookieConsentBanner />
    </div>
  );
}

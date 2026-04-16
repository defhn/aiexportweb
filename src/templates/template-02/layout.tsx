/**
 * template-02 公共布局
 * 行业：工业机械设备 / 自动化设备 / 机器人
 *
 * 深黑底色 + 工业橙品牌色，专属 Header 深色主题版本。
 * 修改此文件只影响 template-02，不会波及其他模板。
 */

import { SiteFooter } from "@/components/public/site-footer";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import type { PublicLayoutProps } from "@/templates/types";
import Link from "next/link";
import { getTemplateTheme } from "@/templates/theme";

// 工业设备专属深色 Header（使用主题）
function IndustrialHeader({ companyName }: { companyName: string }) {
  const theme = getTemplateTheme("template-02");
  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: theme.surface, borderBottom: `1px solid ${theme.border}` }}>
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black" style={{ color: theme.text }}>
          {/* 橙色方块图标 */}
          <span className="w-7 h-7 flex items-center justify-center rounded" style={{ backgroundColor: theme.accent, color: "white", fontSize: "0.75rem" }}>
            IE
          </span>
          <span>{companyName}</span>
        </Link>

        {/* 导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Products", href: "/products" },
            { label: "Capabilities", href: "/capabilities" },
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="px-4 py-2 text-sm hover:opacity-80 transition-opacity" style={{ color: theme.text }}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded" style={{ backgroundColor: theme.accent, color: "white" }}>
          Request Solution
        </Link>
      </div>
    </header>
  );
}

export function Template02Layout({ children, settings, categories }: PublicLayoutProps) {
  const theme = getTemplateTheme("template-02");
  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col relative selection:bg-orange-500/30 selection:text-orange-100">
      <TrackingProvider />
      <IndustrialHeader companyName={settings.companyNameEn} />
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

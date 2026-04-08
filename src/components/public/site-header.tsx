import Link from "next/link";
import { MoveRight } from "lucide-react";

import { getSiteSettings } from "@/features/settings/queries";

import { BrandLogo } from "./brand-logo";

const navItems = [
  ["Products", "/products"],
  ["Capabilities", "/capabilities"],
  ["About Us", "/about"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
] as const;

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-stone-200/80 bg-white/95 py-4 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link className="flex items-center gap-3 transition-transform duration-300 active:scale-95" href="/">
          <BrandLogo isDark={false} />
          <div className="hidden sm:block">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-blue-600">
              Factory Site
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-900">
              {settings.companyNameEn}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center md:flex">
          <div className="mr-6 flex items-center gap-1">
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                className="rounded-full px-5 py-2.5 text-sm font-bold text-stone-600 transition-all duration-300 hover:bg-stone-100 hover:text-stone-900"
                href={href}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mx-2 h-8 w-px bg-stone-200" />

          <Link
            className="group ml-6 flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-500 hover:shadow-blue-500/25 active:scale-95"
            href="/request-quote"
          >
            Get a Quote
            <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

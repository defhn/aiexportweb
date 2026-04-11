"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, MoveRight } from "lucide-react";

import { BrandLogo } from "./brand-logo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ companyName }: { companyName?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      style={{ backgroundColor: "rgba(10,10,10,0.92)" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="shrink-0 mr-2" onClick={() => setOpen(false)}>
          <BrandLogo isDark />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center gap-0.5 overflow-hidden">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ color: "#ffffff" }}
                className={[
                  "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-all",
                  active ? "bg-white/15" : "hover:bg-white/10",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/request-quote"
          className="hidden md:flex ml-auto shrink-0 group items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
        >
          Get a Quote
          <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          style={{ color: "#ffffff" }}
          className="ml-auto flex md:hidden items-center justify-center rounded-lg p-2 hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          style={{ backgroundColor: "#0a0a0a" }}
          className="md:hidden border-t border-white/10 shadow-xl"
        >
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{ color: "#ffffff" }}
                  className={[
                    "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                    active ? "bg-white/15" : "hover:bg-white/10",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-white/10">
              <Link
                href="/request-quote"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white hover:bg-blue-500 transition-colors active:scale-95"
              >
                Get a Quote
                <MoveRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

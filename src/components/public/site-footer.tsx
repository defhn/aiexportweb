import Link from "next/link";
import { ShieldCheck, FileKey2, Microscope } from "lucide-react";

import { BrandLogo } from "./brand-logo";

export function SiteFooter({
  companyName,
  email,
  phone,
  address,
  categories,
}: {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  categories: Array<{ nameEn: string; slug: string }>;
}) {
  return (
    <footer className="bg-[#050505] border-t border-stone-800 text-stone-400 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Trust Badges Strip */}
      <div className="relative z-10 border-b border-stone-800 bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-medium">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <ShieldCheck className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-stone-300 font-bold">ISO 9001 & AS9100</p>
                <p className="text-xs text-stone-500">Certified Quality Systems</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <FileKey2 className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-stone-300 font-bold">Strict NDA Enforced</p>
                <p className="text-xs text-stone-500">Your Intellectual Property is Safe</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Microscope className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-stone-300 font-bold">100% Material Verification</p>
                <p className="text-xs text-stone-500">Rohs & SGS Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <BrandLogo isDark={true} className="mb-6" />
            <p className="mt-6 text-sm leading-relaxed text-stone-500 max-w-sm">
              Supporting overseas sourcing teams with precise machining, stable communication, and transparent lead times. Your trusted manufacturing hub in China.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/request-quote"
                className="inline-flex items-center rounded-md bg-stone-100 px-5 py-3 text-sm font-bold text-stone-900 transition-colors hover:bg-white"
              >
                Request a Quote
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md border border-stone-700 px-5 py-3 text-sm font-bold text-stone-200 transition-colors hover:border-stone-500 hover:text-white"
              >
                Contact Sales
              </Link>
            </div>
            <p className="mt-4 text-xs text-stone-500">
              Send us drawings, target materials, and delivery requirements to get a fast
              engineering review.
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-300 mb-6">
              Solutions
            </p>
            <ul className="space-y-4 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products/${category.slug}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {category.nameEn}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/capabilities" className="hover:text-blue-400 transition-colors">
                  Capabilities Overview
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-300 mb-6">
                Contact Office
              </p>
              <p className="text-sm font-medium text-white mb-1"><a href={`mailto:${email}`} className="hover:text-blue-400 transition-colors">{email}</a></p>
              <p className="text-sm font-medium text-white"><a href={`tel:${phone}`} className="hover:text-blue-400 transition-colors">{phone}</a></p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-300 mb-4">
                Factory & HQ
              </p>
              <p className="mt-3 text-sm leading-loose text-stone-500 max-w-[250px]">{address}</p>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-stone-600 font-medium">
            <Link href="/privacy-policy" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

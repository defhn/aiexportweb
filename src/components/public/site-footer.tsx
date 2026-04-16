import Link from "next/link";
import { ShieldCheck, FileKey2, Microscope } from "lucide-react";

import { BrandLogo } from "./brand-logo";
import { getTemplateTheme } from "@/templates/theme";

export function SiteFooter({
  companyName,
  email,
  phone,
  address,
  categories,
  theme,
}: {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  categories: Array<{ nameEn: string; slug: string }>;
  theme?: { accent?: string; surface?: string; surfaceAlt?: string; border?: string };
}) {
  const accent = theme?.accent ?? "#2563eb";
  const surface = theme?.surface ?? "#050505";
  const surfaceAlt = theme?.surfaceAlt ?? "#0a0a0a";
  const border = theme?.border ?? "#1f2937";
  const activeTheme = getTemplateTheme(process.env.TEMPLATE_ID ?? process.env.SITE_TEMPLATE ?? "template-01");
  const footer = activeTheme.footer;
  return (
    <footer className="relative overflow-hidden text-stone-400" style={{ backgroundColor: surface, borderTopColor: border }}>
      <div className="absolute inset-0 opacity-10 mix-blend-overlay texture-carbon" />
      
      <div className="relative z-10 border-b" style={{ borderColor: border, backgroundColor: surfaceAlt }}>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm font-medium">
            {footer.trustItems.map((item) => {
              // Use generic but professional icons that fit any industry
              const Icon = ShieldCheck; 
              return (
                <div key={item.title} className="flex items-center justify-center gap-4 md:justify-start">
                  <Icon className="h-6 w-6" style={{ color: accent }} />
                  <div>
                    <p className="font-bold text-stone-300">{item.title}</p>
                    <p className="text-xs text-stone-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-5">
            <BrandLogo className="mb-6" companyName={companyName} isDark={true} tagline={footer.solutionsTitle} />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone-500">
              {footer.description}
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
              {footer.rfqHint}
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-300 mb-6">
              {footer.solutionsTitle}
            </p>
            <ul className="space-y-4 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/products/${category.slug}`} className="transition-colors hover:opacity-80" style={{ color: accent }}>
                    {category.nameEn}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/capabilities" className="transition-colors hover:opacity-80" style={{ color: accent }}>
                  Capabilities Overview
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-300 mb-6">
                {footer.officeTitle}
              </p>
              <p className="mb-1 text-sm font-medium text-white"><a href={`mailto:${email}`} className="transition-colors hover:opacity-80" style={{ color: accent }}>{email}</a></p>
              <p className="text-sm font-medium text-white"><a href={`tel:${phone}`} className="transition-colors hover:opacity-80" style={{ color: accent }}>{phone}</a></p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-300 mb-4">
                {footer.addressTitle}
              </p>
              <p className="mt-3 text-sm leading-loose text-stone-500 max-w-[250px]">{address}</p>
            </div>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row" style={{ borderColor: border }}>
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

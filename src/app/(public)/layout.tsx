import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { CookieConsentBanner } from "@/components/public/trust-compliance";
import { TrackingProvider } from "@/components/tracking-provider";
import { getAllCategories } from "@/features/products/queries";
import { getSiteSettings } from "@/features/settings/queries";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getAllCategories(),
  ]);

  return (
    <div className="min-h-screen bg-white text-slate-950 flex flex-col relative selection:bg-blue-500/30 selection:text-blue-900">
      <TrackingProvider />
      <SiteHeader companyName={settings.companyNameEn} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        address={settings.addressEn}
        categories={categories.slice(0, 4).map((category) => ({
          nameEn: category.nameEn,
          slug: category.slug,
        }))}
        companyName={settings.companyNameEn}
        email={settings.email}
        phone={settings.phone}
      />
      <CookieConsentBanner />
    </div>
  );
}

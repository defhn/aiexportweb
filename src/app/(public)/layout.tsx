import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getSiteSettings } from "@/features/settings/queries";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-stone-50 text-slate-950">
      <SiteHeader companyName={settings.companyNameEn} />
      <main>{children}</main>
      <SiteFooter
        address={settings.addressEn}
        companyName={settings.companyNameEn}
        email={settings.email}
        phone={settings.phone}
      />
    </div>
  );
}

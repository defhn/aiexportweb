import type { Metadata } from "next";

import Image from "next/image";
import { Activity, Building2, Globe2, MapPin, Target, Zap } from "lucide-react";

import { JsonLdScript } from "@/components/public/json-ld-script";
import { getPageModules } from "@/features/pages/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { getTemplateById, getTemplateTheme } from "@/templates";

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export async function generateMetadata(): Promise<Metadata> {
  const currentSite = await getCurrentSiteFromRequest();
  const modules = await getPageModules("about", currentSite.seedPackKey, currentSite.id ?? null);
  const payload = modules[0]?.payloadJson ?? {};
  const seoTitle = readString(payload, "seoTitle");
  const seoDescription = readString(payload, "seoDescription");
  return buildPageMetadata({
    title: seoTitle || "About Us",
    description: seoDescription || "Learn more about our company, quality standards, and global supply capabilities.",
    path: "/about",
  });
}

export default async function AboutPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const [settings, modules] = await Promise.all([
    getSiteSettings(currentSite.seedPackKey, siteId),
    getPageModules("about", currentSite.seedPackKey, siteId),
  ]);
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);
  const aboutModule = modules[0];
  const heroTitle = readString(aboutModule?.payloadJson ?? {}, "title") || theme.about.title;
  const heroDescription =
    readString(aboutModule?.payloadJson ?? {}, "description") ||
    settings.taglineEn ||
    theme.about.description;

  return (
    <>
      <JsonLdScript
        value={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": settings.companyNameEn,
          "url": buildAbsoluteUrl("/about"),
          "description": settings.taglineEn ?? "",
          ...(settings.email ? { email: settings.email } : {}),
          ...(settings.phone ? { telephone: settings.phone } : {}),
          ...(settings.addressEn ? { address: { "@type": "PostalAddress", streetAddress: settings.addressEn } } : {}),
        }}
      />
      <main className="min-h-screen bg-white">
        <section className="relative flex min-h-[500px] items-center justify-center overflow-hidden pt-24" style={{ backgroundColor: theme.surface }}>
          <div className="absolute inset-0 z-0">
            <Image
              src={theme.about.heroImage}
              alt={theme.about.title}
              fill
              sizes="100vw"
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.3))` }} />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
            <p className="mb-6 text-sm font-black uppercase tracking-[0.4em] text-white/70">{theme.about.eyebrow}</p>
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tighter text-white md:text-6xl">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/75">{heroDescription}</p>
          </div>
        </section>

        <section className="relative z-20 -mt-10 mx-auto max-w-5xl px-6">
          <div className="grid divide-y rounded-3xl border bg-white shadow-2xl md:grid-cols-4 md:divide-x md:divide-y-0" style={{ borderColor: theme.border }}>
            {[
              { val: "12+", lbl: "Product Lines" },
              { val: "30+", lbl: "Export Markets" },
              { val: "24/7", lbl: "Support Window" },
              { val: "15+", lbl: "Years Experience" },
            ].map((item) => (
              <div key={item.lbl} className="py-6 text-center md:py-8">
                <p className="text-4xl font-black tracking-tighter text-stone-900">{item.val}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-stone-400">{item.lbl}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
            <div className="relative order-2 h-[600px] overflow-hidden rounded-[2.5rem] shadow-xl lg:order-1">
              <Image
                src={theme.about.featureImage}
                alt={theme.about.featureCard}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 rounded-[2.5rem] border-[8px] border-white/10 pointer-events-none" />
              <div className="absolute bottom-8 right-8 max-w-[240px] rounded-3xl bg-white/90 p-6 shadow-xl backdrop-blur-md">
                <Activity className="mb-3 h-8 w-8" style={{ color: theme.accent }} />
                <p className="text-lg font-black leading-tight text-stone-900">{theme.about.featureCard}</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="mb-4 text-sm font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>{theme.about.heritageEyebrow}</h2>
              <h3 className="mb-6 text-3xl font-bold leading-[1.1] tracking-tight text-stone-900 md:text-5xl">
                {theme.about.heritageTitle}
              </h3>
              <div className="space-y-6 text-lg leading-relaxed text-stone-600">
                <p>
                  {heroDescription}
                </p>
                <p>
                  Today we support customers with dependable product planning, packaging, and export coordination from {settings.addressEn || "our supply base"}.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-stone-50">
                    <Target className="h-5 w-5 text-stone-900" />
                  </div>
                  <h4 className="mb-2 font-bold text-stone-900">Reliable Quality</h4>
                  <p className="text-sm text-stone-500">Controlled processes and inspection checkpoints for consistent output.</p>
                </div>
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-stone-200 bg-stone-50">
                    <Zap className="h-5 w-5 text-stone-900" />
                  </div>
                  <h4 className="mb-2 font-bold text-stone-900">Responsive Delivery</h4>
                  <p className="text-sm text-stone-500">Fast sampling and coordinated shipment planning for project timelines.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-stone-50 py-32" style={{ borderColor: theme.border }}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <Globe2 className="mx-auto mb-6 h-8 w-8" style={{ color: theme.accent }} />
              <h2 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Trusted across multiple markets</h2>
              <p className="mt-4 text-lg text-stone-500">We support global buyers with export-friendly communication, packaging, and logistics coordination.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex items-start gap-4 rounded-3xl border bg-white p-8 shadow-sm" style={{ borderColor: theme.border }}>
                <Building2 className="h-6 w-6 shrink-0 text-stone-400" />
                <div>
                  <h3 className="font-bold text-stone-900">Headquarters & Factory</h3>
                  <p className="mt-2 text-sm text-stone-500">{settings.addressEn || "Supply base"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-3xl border bg-white p-8 shadow-sm" style={{ borderColor: theme.border }}>
                <MapPin className="h-6 w-6 shrink-0" style={{ color: theme.accent }} />
                <div>
                  <h3 className="font-bold text-stone-900">Global Logistics</h3>
                  <p className="mt-2 text-sm text-stone-500">We coordinate shipping plans and destination requirements with buyers and freight partners.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-3xl border bg-white p-8 shadow-sm" style={{ borderColor: theme.border }}>
                <MapPin className="h-6 w-6 shrink-0" style={{ color: theme.accent }} />
                <div>
                  <h3 className="font-bold text-stone-900">Regional Support</h3>
                  <p className="mt-2 text-sm text-stone-500">English-speaking support for sourcing, sampling, and after-sales coordination.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

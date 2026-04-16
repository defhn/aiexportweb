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
  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";
  const surfaceAlt = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";

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
      <main className="min-h-screen transition-colors duration-500" style={{ backgroundColor: theme.surface }}>
        <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden pt-24" style={{ backgroundColor: theme.surfaceAlt }}>
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
            <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/75">{heroDescription}</p>
          </div>
        </section>

        <section className="relative z-20 -mt-16 mx-auto max-w-6xl px-6">
          <div className="grid divide-y rounded-[2.5rem] border shadow-2xl backdrop-blur-2xl md:grid-cols-4 md:divide-x md:divide-y-0" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)" }}>
            {[
              { val: "12+", lbl: "Product Lines" },
              { val: "30+", lbl: "Export Markets" },
              { val: "24/7", lbl: "Support Window" },
              { val: "15+", lbl: "Years Experience" },
            ].map((item) => (
              <div key={item.lbl} className="py-8 text-center md:py-10">
                <p className={`text-5xl font-black tracking-tighter ${textColor}`}>{item.val}</p>
                <p className={`mt-3 text-[10px] font-black uppercase tracking-[0.2em] ${textMuted}`}>{item.lbl}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 md:py-40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
            <div className="relative order-2 h-[700px] overflow-hidden rounded-[3rem] shadow-2xl lg:order-1" style={{ backgroundColor: surfaceAlt }}>
              <Image
                src={theme.about.featureImage}
                alt={theme.about.featureCard}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 rounded-[3rem] border border-white/10 pointer-events-none mix-blend-overlay" />
              <div className="absolute bottom-8 right-8 max-w-[280px] rounded-[2rem] p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10" style={{ backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)" }}>
                <Activity className="mb-4 h-10 w-10" style={{ color: theme.accent }} />
                <p className={`text-xl font-black leading-tight ${textColor}`}>{theme.about.featureCard}</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="mb-5 text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>{theme.about.heritageEyebrow}</h2>
              <h3 className={`mb-8 text-4xl font-black leading-[1.1] tracking-tight md:text-5xl ${textColor}`}>
                {theme.about.heritageTitle}
              </h3>
              <div className={`space-y-6 text-lg leading-relaxed font-medium ${textMuted}`}>
                <p>
                  {heroDescription}
                </p>
                <p>
                  Today we support customers with dependable product planning, packaging, and export coordination from {settings.addressEn || "our supply base"}.
                </p>
              </div>

              <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2">
                <div>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors hover:border-orange-500/50" style={{ borderColor: theme.border, backgroundColor: surfaceAlt }}>
                    <Target className={`h-6 w-6 ${isDark ? "text-white" : "text-stone-900"}`} />
                  </div>
                  <h4 className={`mb-3 font-bold ${textColor}`}>Reliable Quality</h4>
                  <p className={`text-sm leading-relaxed ${textMuted}`}>Controlled processes and inspection checkpoints for consistent output.</p>
                </div>
                <div>
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors hover:border-orange-500/50" style={{ borderColor: theme.border, backgroundColor: surfaceAlt }}>
                    <Zap className={`h-6 w-6 ${isDark ? "text-white" : "text-stone-900"}`} />
                  </div>
                  <h4 className={`mb-3 font-bold ${textColor}`}>Responsive Delivery</h4>
                  <p className={`text-sm leading-relaxed ${textMuted}`}>Fast sampling and coordinated shipment planning for project timelines.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t py-32" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)" }}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-20 max-w-2xl text-center">
              <Globe2 className="mx-auto mb-8 h-10 w-10" style={{ color: theme.accent }} />
              <h2 className={`text-4xl font-black tracking-tight ${textColor} md:text-5xl`}>Trusted across multiple markets</h2>
              <p className={`mt-6 text-lg leading-relaxed ${textMuted}`}>We support global buyers with export-friendly communication, packaging, and logistics coordination.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group flex items-start gap-5 rounded-[2.5rem] border p-10 transition-all hover:-translate-y-1 hover:shadow-2xl" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff" }}>
                <Building2 className={`h-8 w-8 shrink-0 ${isDark ? "text-white/20" : "text-stone-300"}`} />
                <div>
                  <h3 className={`text-lg font-bold ${textColor}`}>Headquarters & Factory</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${textMuted}`}>{settings.addressEn || "Supply base"}</p>
                </div>
              </div>
              <div className="group flex items-start gap-5 rounded-[2.5rem] border p-10 transition-all hover:-translate-y-1 hover:shadow-2xl" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff" }}>
                <MapPin className="h-8 w-8 shrink-0 transition-transform group-hover:scale-110" style={{ color: theme.accent }} />
                <div>
                  <h3 className={`text-lg font-bold ${textColor}`}>Global Logistics</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${textMuted}`}>We coordinate shipping plans and destination requirements with buyers and freight partners.</p>
                </div>
              </div>
              <div className="group flex items-start gap-5 rounded-[2.5rem] border p-10 transition-all hover:-translate-y-1 hover:shadow-2xl" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff" }}>
                <MapPin className="h-8 w-8 shrink-0 transition-transform group-hover:scale-110" style={{ color: theme.accent }} />
                <div>
                  <h3 className={`text-lg font-bold ${textColor}`}>Regional Support</h3>
                  <p className={`mt-3 text-sm leading-relaxed ${textMuted}`}>English-speaking support for sourcing, sampling, and after-sales coordination.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

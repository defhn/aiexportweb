import type { Metadata } from "next";

import { InquiryForm } from "@/components/public/inquiry-form";
import { getPageModules } from "@/features/pages/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { Mail, Phone, MessageCircle, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { JsonLdScript } from "@/components/public/json-ld-script";
import { buildAbsoluteUrl } from "@/lib/seo";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById, getTemplateTheme } from "@/templates";

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export async function generateMetadata(): Promise<Metadata> {
  const currentSite = await getCurrentSiteFromRequest();
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);
  const modules = await getPageModules("contact", currentSite.seedPackKey, currentSite.id ?? null);
  const payload = modules[0]?.payloadJson ?? {};
  const seoTitle = readString(payload, "seoTitle");
  const seoDescription = readString(payload, "seoDescription");
  return {
    title: seoTitle || "Contact Us — Get a Quote",
    description: seoDescription || theme.detailSupportDescription,
  };
}



export default async function ContactPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const [settings, modules] = await Promise.all([
    getSiteSettings(currentSite.seedPackKey, siteId),
    getPageModules("contact", currentSite.seedPackKey, siteId),
  ]);
  const contactModule = modules[0];
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);

  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";
  const cardBg = isDark ? "rgba(255,255,255,0.02)" : "#ffffff";

  return (
    <>
      <JsonLdScript
        value={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact " + (settings.companyNameEn ?? ""),
          "url": buildAbsoluteUrl("/contact"),
          "description": "Send your inquiry to our team.",
          "mainEntity": {
            "@type": "Organization",
            "name": settings.companyNameEn,
            ...(settings.email ? { email: settings.email } : {}),
            ...(settings.phone ? { telephone: settings.phone } : {}),
          },
        }}
      />
      <main className="min-h-screen pb-32 pt-32" style={{ backgroundColor: theme.surface }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <p className="mb-5 text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>{theme.detailSupportTitle}</p>
            <h1 className={`text-4xl font-black leading-[1.1] tracking-tight md:text-6xl ${textColor}`}>{readString(contactModule?.payloadJson ?? {}, "title") || "Start Your Project"}</h1>
            <p className={`mt-6 text-lg leading-relaxed font-medium ${textMuted}`}>{readString(contactModule?.payloadJson ?? {}, "description") || "Share your project requirements and we will respond with practical next steps."}</p>
          </div>

          <div className="flex flex-col overflow-hidden rounded-[3rem] border shadow-2xl lg:flex-row ring-1 ring-white/5" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
            <div className="relative flex w-full flex-col justify-between overflow-hidden p-10 md:p-14 lg:w-2/5 lg:p-20" style={{ backgroundColor: theme.surface }}>
              <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon pointer-events-none" />
              <div className="absolute top-0 right-0 h-96 w-96 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${theme.accent}15`, transform: "translate(30%, -30%)" }} />
              <div className="relative z-10">
                <h2 className="mb-12 text-3xl font-black tracking-tight text-white">Talk to our team.</h2>
                <div className="space-y-10">
                  <div className="group flex items-center gap-6">
                    <div className="shrink-0 rounded-2xl border p-4 transition-colors" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <Mail className="h-6 w-6" style={{ color: theme.accent }} />
                    </div>
                    <div><p className="mb-1 text-[10px] font-black uppercase tracking-widest text-white/40">Email</p><p className="font-bold text-white text-lg">{settings.email}</p></div>
                  </div>
                  <div className="group flex items-center gap-6">
                    <div className="shrink-0 rounded-2xl border p-4 transition-colors" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <Phone className="h-6 w-6" style={{ color: theme.accent }} />
                    </div>
                    <div><p className="mb-1 text-[10px] font-black uppercase tracking-widest text-white/40">Phone</p><p className="font-bold text-white text-lg">{settings.phone}</p></div>
                  </div>
                  <div className="group flex items-center gap-6">
                    <div className="shrink-0 rounded-2xl border p-4 transition-colors" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <MessageCircle className="h-6 w-6 text-[#25D366]" />
                    </div>
                    <div><p className="mb-1 text-[10px] font-black uppercase tracking-widest text-white/40">WhatsApp</p><p className="font-bold text-white text-lg">{settings.whatsapp}</p></div>
                  </div>
                  <div className="group flex items-center gap-6">
                    <div className="shrink-0 rounded-2xl border p-4 transition-colors" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <MapPin className="h-6 w-6" style={{ color: theme.accent }} />
                    </div>
                    <div><p className="mb-1 text-[10px] font-black uppercase tracking-widest text-white/40">Headquarters</p><p className="max-w-[200px] text-sm font-medium leading-relaxed text-white/70">{settings.addressEn}</p></div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-20 border-t pt-10" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Our Commitment</p>
                <ul className="space-y-4">
                  {theme.footer.trustItems.map((item) => (
                    <li key={item.title} className="flex items-center gap-4 text-sm font-semibold tracking-wide text-white/70">
                      <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: theme.accent }} />
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex w-full flex-col justify-center p-10 md:p-14 lg:w-3/5 lg:p-20" style={{ backgroundColor: cardBg }}>
              <div className="mb-10 flex items-center gap-4 border-b pb-8" style={{ borderColor: theme.border }}>
                <div className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${textColor}`}>Team is Online</span>
              </div>

              <InquiryForm
                accentColor={theme.accent}
                copy={{
                  eyebrow: theme.forms.inquiryEyebrow,
                  title: theme.forms.consultationTitle,
                  successTitle: theme.forms.successTitle,
                  successMessage: theme.forms.successMessage,
                  securityNote: theme.forms.securityNote,
                  uploadHint: theme.forms.uploadHint,
                  trustBadgeTitle: theme.forms.trustBadgeTitle,
                  trustBadgeDescription: theme.forms.trustBadgeDescription,
                }}
                sourcePage="contact-page"
                sourceUrl="/contact"
              />

              <div className="mt-12 flex items-start gap-4 rounded-2xl border p-5" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "#fafaf9" }}>
                <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 opacity-50" style={{ color: theme.accent }} />
                <p className={`text-xs font-medium leading-relaxed ${textMuted}`}><strong className={`${textColor}`}>Your information is secure.</strong> {theme.forms.securityNote}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

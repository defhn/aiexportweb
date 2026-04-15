import type { Metadata } from "next";

import { InquiryForm } from "@/components/public/inquiry-form";
import { getPageModules } from "@/features/pages/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { Mail, Phone, MessageCircle, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { JsonLdScript } from "@/components/public/json-ld-script";
import { buildAbsoluteUrl } from "@/lib/seo";
import { getActiveTemplate, getTemplateTheme } from "@/templates";

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export async function generateMetadata(): Promise<Metadata> {
  const template = getActiveTemplate();
  const theme = getTemplateTheme(template.id);
  const modules = await getPageModules("contact");
  const payload = modules[0]?.payloadJson ?? {};
  const seoTitle = readString(payload, "seoTitle");
  const seoDescription = readString(payload, "seoDescription");
  return {
    title: seoTitle || "Contact Us — Get a Quote",
    description: seoDescription || theme.detailSupportDescription,
  };
}



export default async function ContactPage() {
  const [settings, modules] = await Promise.all([getSiteSettings(), getPageModules("contact")]);
  const contactModule = modules[0];
  const template = getActiveTemplate();
  const theme = getTemplateTheme(template.id);

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
      <main className="min-h-screen pb-32 pt-24" style={{ backgroundColor: theme.surfaceAlt }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h1 className="mb-4 text-sm font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>{theme.detailSupportTitle}</h1>
            <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-stone-900 md:text-5xl">{readString(contactModule?.payloadJson ?? {}, "title") || "Start Your Project"}</h2>
            <p className="mt-4 text-lg text-stone-500">{readString(contactModule?.payloadJson ?? {}, "description") || "Share your project requirements and we will respond with practical next steps."}</p>
          </div>

          <div className="flex flex-col overflow-hidden rounded-[2.5rem] border bg-white shadow-2xl lg:flex-row" style={{ borderColor: theme.border }}>
            <div className="relative flex w-full flex-col justify-between overflow-hidden p-6 md:p-10 lg:w-2/5 lg:p-16" style={{ backgroundColor: theme.surface }}>
              <div className="absolute inset-0 opacity-10 texture-carbon" />
              <div className="relative z-10">
                <h3 className="mb-8 text-2xl font-bold text-white">Talk to our team.</h3>
                <div className="space-y-8">
                  <div className="group flex items-start gap-4">
                    <div className="shrink-0 rounded-xl border p-3 transition-colors" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <Mail className="h-6 w-6" style={{ color: theme.accent }} />
                    </div>
                    <div><p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/40">Email</p><p className="font-medium text-white">{settings.email}</p></div>
                  </div>
                  <div className="group flex items-start gap-4">
                    <div className="shrink-0 rounded-xl border p-3 transition-colors" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <Phone className="h-6 w-6" style={{ color: theme.accent }} />
                    </div>
                    <div><p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/40">Phone</p><p className="font-medium text-white">{settings.phone}</p></div>
                  </div>
                  <div className="group flex items-start gap-4">
                    <div className="shrink-0 rounded-xl border p-3 transition-colors" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <MessageCircle className="h-6 w-6 text-[#25D366]" />
                    </div>
                    <div><p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/40">WhatsApp</p><p className="font-medium text-white">{settings.whatsapp}</p></div>
                  </div>
                  <div className="group flex items-start gap-4">
                    <div className="shrink-0 rounded-xl border p-3 transition-colors" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                      <MapPin className="h-6 w-6" style={{ color: theme.accent }} />
                    </div>
                    <div><p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/40">Headquarters</p><p className="max-w-[200px] text-sm leading-relaxed text-white/70">{settings.addressEn}</p></div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-16 border-t pt-10" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Our Commitment</p>
                <ul className="space-y-3">
                  {theme.footer.trustItems.map((item) => (
                    <li key={item.title} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: theme.accent }} />
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex w-full flex-col justify-center p-10 md:p-16 lg:w-3/5">
              <div className="mb-8 flex items-center gap-3 border-b pb-6" style={{ borderColor: theme.border }}>
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                <span className="text-sm font-bold text-stone-900">Team is Online</span>
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

              <div className="mt-8 flex items-start gap-3 rounded-xl border bg-stone-50 p-4" style={{ borderColor: theme.border }}>
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-stone-400" />
                <p className="text-xs leading-relaxed text-stone-500"><strong className="text-stone-900">Your information is secure.</strong> {theme.forms.securityNote}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

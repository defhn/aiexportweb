import type { Metadata } from "next";

import { InquiryForm } from "@/components/public/inquiry-form";
import { getPageModules } from "@/features/pages/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { Mail, Phone, MessageCircle, MapPin, CheckCircle2, ShieldCheck } from "lucide-react";
import { JsonLdScript } from "@/components/public/json-ld-script";
import { buildAbsoluteUrl } from "@/lib/seo";

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export async function generateMetadata(): Promise<Metadata> {
  const modules = await getPageModules("contact");
  const payload = modules[0]?.payloadJson ?? {};
  const seoTitle = readString(payload, "seoTitle");
  const seoDescription = readString(payload, "seoDescription");
  return {
    title: seoTitle || "Contact Us — Get a Quote",
    description: seoDescription || "Send your RFQ to our engineering team and get a response within 24 hours.",
  };
}



export default async function ContactPage() {
  const [settings, modules] = await Promise.all([
    getSiteSettings(),
    getPageModules("contact"),
  ]);
  const contactModule = modules[0];

  return (
    <>
      <JsonLdScript
        value={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact " + (settings.companyNameEn ?? ""),
          "url": buildAbsoluteUrl("/contact"),
          "description": "Send your RFQ or inquiries to our engineering team.",
          "mainEntity": {
            "@type": "Organization",
            "name": settings.companyNameEn,
            ...(settings.email ? { "email": settings.email } : {}),
            ...(settings.phone ? { "telephone": settings.phone } : {}),
          },
        }}
      />
    <main className="min-h-screen bg-stone-50 pt-24 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Request For Quote</h1>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-[1.1]">
              {readString(contactModule?.payloadJson ?? {}, "title") ||
                "Start Your Manufacturing Project"}
            </h2>
            <p className="mt-4 text-lg text-stone-500">
              {readString(contactModule?.payloadJson ?? {}, "description") ||
                "Upload your CAD files (STEP/IGES) for a comprehensive DFM review and accurate pricing within 24 hours."}
            </p>
        </div>

        {/* Console Layout: Left (Info) + Right (Form) */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-200 overflow-hidden flex flex-col lg:flex-row">
            
            {/* Left Rail: Dark Trust Panel */}
            <div className="w-full lg:w-2/5 bg-stone-950 p-6 md:p-10 lg:p-16 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 opacity-10 texture-carbon" />
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-8">Talk to a Lead Engineer.</h3>
                    
                    <div className="space-y-8">
                        <div className="flex gap-4 items-start group">
                            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl shrink-0 group-hover:border-blue-500 transition-colors">
                                <Mail className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Email (24h Response)</p>
                                <p className="text-white font-medium">{settings.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start group">
                            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl shrink-0 group-hover:border-blue-500 transition-colors">
                                <Phone className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Direct Phone</p>
                                <p className="text-white font-medium">{settings.phone}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start group">
                            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl shrink-0 group-hover:border-[#25D366] transition-colors">
                                <MessageCircle className="h-6 w-6 text-[#25D366]" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">WhatsApp</p>
                                <p className="text-white font-medium">{settings.whatsapp}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 items-start group">
                            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl shrink-0 group-hover:border-stone-400 transition-colors">
                                <MapPin className="h-6 w-6 text-stone-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Headquarters</p>
                                <p className="text-stone-300 text-sm leading-relaxed max-w-[200px]">{settings.addressEn}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-16 pt-10 border-t border-stone-800">
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Our Commitment</p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-stone-300">
                            <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" /> Fast <span className="text-white font-bold">24-Hour</span> Quotation
                        </li>
                        <li className="flex items-center gap-3 text-sm text-stone-300">
                            <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" /> Free <span className="text-white font-bold">DFM Structure</span> Analysis
                        </li>
                        <li className="flex items-center gap-3 text-sm text-stone-300">
                            <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" /> Strict <span className="text-white font-bold">NDA</span> Enforced
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Rail: RFQ Form Console */}
            <div className="w-full lg:w-3/5 p-10 md:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-stone-100">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-stone-900">Engineering Team is Online</span>
                </div>
                
                <InquiryForm sourcePage="contact-page" sourceUrl="/contact" />
                
                {/* Security Lock Notice */}
                <div className="mt-8 flex items-start gap-3 bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <ShieldCheck className="h-5 w-5 text-stone-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-500 leading-relaxed">
                        <strong className="text-stone-900">Your Intellectual Property is Secure.</strong> All uploaded CAD models and drawings are processed securely and fall under our automatic non-disclosure terms. We will never share your designs with third parties.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </main>
    </>
  );
}

import type { Metadata } from "next";

import Link from "next/link";

import { RequestQuoteForm } from "@/components/public/request-quote-form";
import { getFeatureGate } from "@/features/plans/access";
import { getAllProducts } from "@/features/products/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById, getTemplateTheme } from "@/templates";

type FormField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "file";
  required: boolean;
  placeholder?: string;
};

function isValidFormField(value: unknown): value is FormField {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj["name"] === "string" &&
    typeof obj["label"] === "string" &&
    (obj["type"] === "text" || obj["type"] === "textarea" || obj["type"] === "file") &&
    typeof obj["required"] === "boolean"
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const currentSite = await getCurrentSiteFromRequest();
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);

  return {
    title: theme.detailSupportTitle,
    description: theme.detailSupportDescription,
  };
}

export default async function RequestQuotePage() {
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const gate = await getFeatureGate("request_quote", currentSite.plan, siteId);
  const isLocked = gate.status === "locked";

  const [products, settings] = await Promise.all([
    getAllProducts(currentSite.seedPackKey, siteId),
    getSiteSettings(currentSite.seedPackKey, siteId),
  ]);
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);

  const rawFields = Array.isArray(settings.formFieldsJson) ? settings.formFieldsJson : [];
  const formFields: FormField[] = rawFields.filter(isValidFormField);

  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";

  if (isLocked) {
    return (
      <main className="min-h-screen px-6 py-28 transition-colors duration-500 flex items-center justify-center" style={{ backgroundColor: theme.surface }}>
        <section className="w-full max-w-5xl overflow-hidden rounded-[3rem] border shadow-2xl ring-1 ring-white/10" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative flex flex-col justify-between p-12 text-white md:p-20 overflow-hidden" style={{ backgroundColor: theme.surface }}>
              <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon pointer-events-none" />
              <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${theme.accent}30` }} />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
                  Request a Quote
                </p>
                <h1 className="mt-8 text-4xl font-black leading-[1.1] tracking-tight text-white md:text-5xl">
                  Quote requests are included in Growth plans
                </h1>
                <p className="mt-6 max-w-xl text-lg font-medium text-white/70 leading-relaxed">
                  This site can still display the quote request experience. Submission is disabled on the current plan, but customers can still contact you through the standard inquiry flow.
                </p>
              </div>

              <div className="relative z-10 mt-16 space-y-4 text-sm font-medium text-white/50">
                <p>{theme.forms.uploadHint}</p>
                <p>{theme.forms.securityNote}</p>
                <p>{theme.footer.rfqHint}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-8 p-10 md:p-16" style={{ backgroundColor: cardBg }}>
              <div className="rounded-[2rem] border p-8 shadow-sm" style={{ borderColor: theme.border, backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "#fafaf9" }}>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${textMuted}`}>What happens on this plan</p>
                <ul className={`mt-6 space-y-4 text-sm font-medium leading-relaxed ${textColor}`}>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} /> Visitors can still review the RFQ-style layout.</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} /> The standard contact flow remains available.</li>
                  <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} /> Growth and above unlock full quote request handling.</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <Link href="/contact" className="rounded-2xl px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-transform hover:scale-105 shadow-xl" style={{ backgroundColor: theme.accent }}>
                  Contact Sales
                </Link>
                <Link href="/blog" className={`rounded-2xl border px-8 py-4 text-sm font-black uppercase tracking-widest transition-colors hover:bg-white/5 ${textColor}`} style={{ borderColor: theme.border }}>
                  Browse Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-28 transition-colors duration-500 flex items-center justify-center" style={{ backgroundColor: theme.surface }}>
      <section
        className="w-full max-w-6xl overflow-hidden rounded-[3rem] border shadow-2xl ring-1 ring-white/10"
        style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}
      >
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div
            className="relative flex flex-col justify-between p-12 text-white md:p-16 lg:p-20 overflow-hidden"
            style={{ backgroundColor: theme.surface }}
          >
            <div className="absolute inset-0 opacity-10 mix-blend-overlay texture-carbon pointer-events-none" />
            <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: `${theme.accent}30` }} />
            <div className="relative z-10">
              <p
                className="text-[10px] font-black uppercase tracking-[0.4em]"
                style={{ color: theme.accent }}
              >
                {theme.forms.inquiryEyebrow}
              </p>
              <h1 className="mt-8 text-4xl font-black leading-[1.1] tracking-tight text-white md:text-5xl">
                {theme.detailSupportTitle}
              </h1>
              <p className="mt-6 max-w-xl text-lg font-medium text-white/70 leading-relaxed">{theme.detailSupportDescription}</p>
            </div>

            <div className="relative z-10 mt-20 space-y-4 text-xs font-bold uppercase tracking-widest text-white/40">
              <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} /> {theme.forms.uploadHint}</p>
              <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} /> {theme.forms.securityNote}</p>
              <p className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} /> {theme.footer.rfqHint}</p>
            </div>
          </div>

          <div className="p-10 md:p-16" style={{ backgroundColor: cardBg }}>
            <RequestQuoteForm
              accentColor={theme.accent}
              productOptions={products.map((product) => ({ id: product.id, nameEn: product.nameEn }))}
              formFields={formFields}
              successMessage={theme.forms.successMessage}
              submitLabel={theme.detailSupportTitle}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

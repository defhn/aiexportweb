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

  if (isLocked) {
    return (
      <main className="min-h-screen bg-stone-50 px-6 py-20">
        <section className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border bg-white shadow-2xl" style={{ borderColor: theme.border }}>
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col justify-between p-10 text-white md:p-16" style={{ backgroundColor: theme.surface }}>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>
                  Request a Quote
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-[1.1] text-white md:text-5xl">
                  Quote requests are included in Growth plans
                </h1>
                <p className="mt-6 max-w-xl text-white/70">
                  This site can still display the quote request experience. Submission is disabled on the current plan, but customers can still contact you through the standard inquiry flow.
                </p>
              </div>

              <div className="mt-12 space-y-3 text-sm text-white/75">
                <p>{theme.forms.uploadHint}</p>
                <p>{theme.forms.securityNote}</p>
                <p>{theme.footer.rfqHint}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6 p-8 md:p-12">
              <div className="rounded-3xl border bg-stone-50 p-6" style={{ borderColor: theme.border }}>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-stone-400">What happens on this plan</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-600">
                  <li>• Visitors can still review the RFQ-style layout.</li>
                  <li>• The standard contact flow remains available.</li>
                  <li>• Growth and above unlock full quote request handling.</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="rounded-full px-5 py-3 text-sm font-bold text-white" style={{ backgroundColor: theme.surface }}>
                  Contact Sales
                </Link>
                <Link href="/blog" className="rounded-full border px-5 py-3 text-sm font-bold text-stone-700" style={{ borderColor: theme.border }}>
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
    <main className="min-h-screen px-6 py-20" style={{ backgroundColor: "#fafafa" }}>
      <section
        className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border bg-white shadow-2xl"
        style={{ borderColor: theme.border }}
      >
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div
            className="flex flex-col justify-between p-10 text-white md:p-16"
            style={{ backgroundColor: theme.surface }}
          >
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-[0.3em]"
                style={{ color: theme.accent }}
              >
                {theme.forms.inquiryEyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.1] text-white md:text-5xl">
                {theme.detailSupportTitle}
              </h1>
              <p className="mt-6 max-w-xl text-white/70">{theme.detailSupportDescription}</p>
            </div>

            <div className="mt-12 space-y-3 text-sm text-white/75">
              <p>{theme.forms.uploadHint}</p>
              <p>{theme.forms.securityNote}</p>
              <p>{theme.footer.rfqHint}</p>
            </div>
          </div>

          <div className="p-8 md:p-12">
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequestQuoteForm } from "@/components/public/request-quote-form";
import { getFeatureGate } from "@/features/plans/access";
import { getAllProducts } from "@/features/products/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { getActiveTemplate, getTemplateTheme } from "@/templates";

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
  const template = getActiveTemplate();
  const theme = getTemplateTheme(template.id);

  return {
    title: theme.detailSupportTitle,
    description: theme.detailSupportDescription,
  };
}

export default async function RequestQuotePage() {
  const gate = await getFeatureGate("request_quote");

  if (gate.status === "locked") {
    notFound();
  }

  const [products, settings] = await Promise.all([getAllProducts(), getSiteSettings()]);
  const template = getActiveTemplate();
  const theme = getTemplateTheme(template.id);

  const rawFields = Array.isArray(settings.formFieldsJson) ? settings.formFieldsJson : [];
  const formFields: FormField[] = rawFields.filter(isValidFormField);

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

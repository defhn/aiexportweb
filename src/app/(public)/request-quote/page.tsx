import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequestQuoteForm } from "@/components/public/request-quote-form";
import { getFeatureGate } from "@/features/plans/access";
import { getAllProducts } from "@/features/products/queries";
import { getSiteSettings } from "@/features/settings/queries";

// 对应 schema.ts 中 formFieldsJson 字段存储的自定义表单项格式
type FormField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "file";
  required: boolean;
  placeholder?: string;
};

function isValidFormField(v: unknown): v is FormField {
  if (!v || typeof v !== "object") return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof obj["name"] === "string" &&
    typeof obj["label"] === "string" &&
    (obj["type"] === "text" || obj["type"] === "textarea" || obj["type"] === "file") &&
    typeof obj["required"] === "boolean"
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Request a Quote",
    description: "Submit your RFQ with technical specifications for custom CNC machined parts.",
  };
}

export default async function RequestQuotePage() {
  const gate = await getFeatureGate("request_quote");

  if (gate.status === "locked") {
    notFound();
  }

  const [products, settings] = await Promise.all([
    getAllProducts(),
    getSiteSettings(),
  ]);

  // 从数据库读取 formFieldsJson（jsonb unknown[]），过滤出类型安全的有效字段
  const rawFields = Array.isArray(settings.formFieldsJson) ? settings.formFieldsJson : [];
  const formFields: FormField[] = rawFields.filter(isValidFormField);

  return (
    <section className="mx-auto max-w-5xl space-y-10 px-6 py-20">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Request Quote
        </p>
        <h1 className="text-4xl font-semibold text-slate-950">
          Send us your RFQ
        </h1>
        <p className="max-w-2xl text-slate-600">
          Share your target requirements and specifications below. We will review the
          request and reply with a rigorous, sales-ready quotation.
        </p>
      </div>

      <RequestQuoteForm
        productOptions={products.map((product) => ({
          id: product.id,
          nameEn: product.nameEn,
        }))}
        formFields={formFields}
      />
    </section>
  );
}

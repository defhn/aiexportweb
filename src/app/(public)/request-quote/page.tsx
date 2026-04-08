import { notFound } from "next/navigation";

import { RequestQuoteForm } from "@/components/public/request-quote-form";
import { getFeatureGate } from "@/features/plans/access";
import { getAllProducts } from "@/features/products/queries";

export default async function RequestQuotePage() {
  const gate = await getFeatureGate("request_quote");

  if (gate.status === "locked") {
    notFound();
  }

  const products = await getAllProducts();

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
          Share the product, quantity, and delivery destination. We will review the
          request and reply with a sales-ready quotation draft.
        </p>
      </div>

      <RequestQuoteForm
        productOptions={products.map((product) => ({
          id: product.id,
          nameEn: product.nameEn,
        }))}
      />
    </section>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { env } from "@/env";
import { getSalesContactHref } from "@/features/plans/access";
import {
  getComparisonSections,
  getPlanCardSummaries,
  isPricingPageEnabled,
} from "@/lib/plans";

function renderCheck(value: boolean) {
  return value ? "Yes" : "No";
}

export default function PricingPage() {
  if (!isPricingPageEnabled(env.ENABLE_PRICING_PAGE)) {
    notFound();
  }

  const salesContactHref = getSalesContactHref();
  const plans = getPlanCardSummaries();
  const sections = getComparisonSections();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-14">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Pricing Overview
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-950">
          Export Growth Website Plans
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600">
          These plans package the website, inquiry capture, content operations, and AI-assisted
          sales workflows into a single delivery scope for export-focused teams.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.key}
            className={`rounded-[2rem] border p-8 shadow-sm ${
              plan.key === "growth" ? "border-amber-300 bg-amber-50" : "border-stone-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-stone-950">{plan.nameZh}</h2>
                <p className="mt-2 text-sm text-stone-500">{plan.nameEn}</p>
              </div>
              {plan.key === "growth" ? (
                <span className="rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold text-white">
                  Recommended
                </span>
              ) : null}
            </div>

            <p className="mt-6 text-4xl font-semibold text-stone-950">CNY {plan.price}</p>
            <p className="mt-3 text-sm font-medium text-stone-700">{plan.taglineZh}</p>
            <p className="mt-3 text-sm leading-7 text-stone-600">{plan.descriptionZh}</p>

            <div className="mt-6 rounded-2xl bg-white/80 p-4 text-sm leading-7 text-stone-700">
              {plan.key === "basic" ? (
                <>
                  <p>Best for launching a clean bilingual site quickly.</p>
                  <p>Good fit when you want a strong web presence before adding heavier workflows.</p>
                </>
              ) : null}
              {plan.key === "growth" ? (
                <>
                  <p>Best fit for most manufacturing teams handling regular inquiries and RFQs.</p>
                  <p>Balances launch speed with ongoing sales and content operations.</p>
                </>
              ) : null}
              {plan.key === "ai_sales" ? (
                <>
                  <p>Ideal for teams with larger catalogs and higher inquiry volume.</p>
                  <p>Adds more AI-assisted drafting, organization, and response support.</p>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-stone-950 px-5 py-2 text-sm font-medium text-white"
                href={salesContactHref}
              >
                Ask About {plan.nameEn}
              </Link>
            </div>
          </article>
        ))}
      </section>

      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-stone-950">{section.title}</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
              <thead>
                <tr>
                  <th className="bg-stone-950 px-4 py-3 text-left text-sm font-semibold text-white">
                    Capability
                  </th>
                  <th className="bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white">
                    Basic
                  </th>
                  <th className="bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white">
                    Growth
                  </th>
                  <th className="bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white">
                    AI Sales
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, index) => (
                  <tr key={row.label}>
                    <td
                      className={`px-4 py-4 text-sm text-stone-700 ${
                        index % 2 === 0 ? "bg-stone-50" : "bg-white"
                      }`}
                    >
                      {row.label}
                    </td>
                    <td
                      className={`px-4 py-4 text-center text-base font-semibold ${
                        index % 2 === 0 ? "bg-stone-50" : "bg-white"
                      }`}
                    >
                      {renderCheck(row.basic)}
                    </td>
                    <td
                      className={`px-4 py-4 text-center text-base font-semibold ${
                        index % 2 === 0 ? "bg-amber-50" : "bg-amber-100/40"
                      }`}
                    >
                      {renderCheck(row.growth)}
                    </td>
                    <td
                      className={`px-4 py-4 text-center text-base font-semibold ${
                        index % 2 === 0 ? "bg-emerald-50" : "bg-emerald-100/40"
                      }`}
                    >
                      {renderCheck(row.ai_sales)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-950">Payment Guidance</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-stone-700">
            <p>
              For a high-touch B2B delivery, it is usually better to close the deal through direct
              conversation instead of instant checkout.
            </p>
            <p>This keeps the process simpler in the early stage:</p>
            <p>1. You can confirm scope, deployment details, and schedule before payment.</p>
            <p>2. You avoid extra implementation work for billing, refunds, and reconciliation.</p>
            <p>3. The current offer is better suited to consultative selling than self-serve checkout.</p>
          </div>
        </article>

        <article className="rounded-[2rem] border border-stone-200 bg-stone-950 p-8 text-white shadow-sm">
          <h2 className="text-2xl font-semibold">Recommended Flow</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
            <p>Use this page to explain plan differences and create buying confidence.</p>
            <p>Then confirm the final package, deployment timeline, and payment offline.</p>
            <p>Add direct online payment later if the offer becomes more standardized.</p>
          </div>
          <div className="mt-6">
            <Link
              className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-medium text-stone-950"
              href={salesContactHref}
            >
              Contact Sales
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Check, MoveRight, Zap, Shield, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing & MOQ | Titan CNC Precision Manufacturing",
  description:
    "Transparent pricing tiers for CNC machined parts. From prototype samples to mass production — competitive factory-direct rates with no hidden fees.",
  alternates: { canonical: "/pricing" },
};

const tiers = [
  {
    name: "Sample / Prototype",
    icon: Zap,
    price: "From $80",
    unit: "per order",
    description: "Perfect for design validation and fit-check before committing to production.",
    moq: "1–10 pcs",
    leadTime: "3–7 days",
    color: "blue",
    features: [
      "Any CNC-machinable material",
      "Full dimensional inspection report",
      "DFM feedback included",
      "Express shipping available",
      "No tooling cost",
    ],
    cta: { label: "Request Sample Quote", href: "/request-quote?type=sample" },
  },
  {
    name: "Small Batch",
    icon: Shield,
    price: "From $0.8",
    unit: "per piece",
    description: "Ideal for pilot runs, pre-launch stock, or ongoing replenishment orders.",
    moq: "50–500 pcs",
    leadTime: "10–18 days",
    color: "indigo",
    popular: true,
    features: [
      "Volume unit-price discount",
      "Dedicated QC engineer",
      "Certificate of Conformance",
      "Custom packaging available",
      "Net-30 payment terms available",
    ],
    cta: { label: "Get Batch Pricing", href: "/request-quote?type=batch" },
  },
  {
    name: "Mass Production",
    icon: Globe,
    price: "Custom",
    unit: "volume-based",
    description: "Full-scale production with dedicated capacity, VMI, and supply-chain integration.",
    moq: "500+ pcs",
    leadTime: "Scheduled",
    color: "slate",
    features: [
      "Reserved monthly capacity",
      "Blanket PO & VMI support",
      "ISO 9001 full-lot inspection",
      "ERP system integration",
      "Dedicated account manager",
    ],
    cta: { label: "Talk to Sales", href: "/contact?type=production" },
  },
];

const faq = [
  {
    q: "How is the unit price calculated?",
    a: "We price based on material, machining complexity, surface treatment, and quantity. Submit a quote request with your drawing (DXF/STEP) and we'll return a detailed breakdown within 24 hours.",
  },
  {
    q: "Are there any tooling or setup fees?",
    a: "For standard CNC milling and turning there are no tooling fees. For custom fixtures or specialized jigs, a one-time setup fee may apply and will be quoted upfront.",
  },
  {
    q: "What materials do you support?",
    a: "We machine aluminum alloys (6061, 6063, 7075), stainless steel (SUS 303, 304, 316L), brass, copper, titanium, and engineering plastics such as POM and nylon.",
  },
  {
    q: "Can I mix multiple parts in one order?",
    a: "Yes. We support multi-part orders. Each part is quoted individually, and you can combine them under a single PO with consolidated shipping.",
  },
  {
    q: "Do you offer NDA / IP protection?",
    a: "Absolutely. We sign NDAs before reviewing any drawings. All files are stored on encrypted servers and deleted upon project completion on request.",
  },
];

const colorMap: Record<string, { bg: string; icon: string; ring: string; badge: string }> = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600 bg-blue-100",
    ring: "ring-blue-200",
    badge: "bg-blue-600",
  },
  indigo: {
    bg: "bg-indigo-950",
    icon: "text-indigo-300 bg-indigo-800",
    ring: "ring-indigo-500",
    badge: "bg-indigo-500",
  },
  slate: {
    bg: "bg-slate-50",
    icon: "text-slate-600 bg-slate-100",
    ring: "ring-slate-200",
    badge: "bg-slate-700",
  },
};

export default function PricingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0a0a] pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Transparent Pricing
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Factory-Direct Rates.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              No Middlemen.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-400">
            From single prototypes to mass production — competitive CNC machining
            rates with full transparency on material, machining, and finishing costs.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => {
              const c = colorMap[tier.color];
              const isDark = tier.color === "indigo";
              return (
                <article
                  key={tier.name}
                  className={[
                    "relative flex flex-col rounded-3xl p-8 ring-1 transition-shadow hover:shadow-xl",
                    isDark ? "bg-indigo-950 text-white" : "bg-white text-stone-950",
                    c.ring,
                  ].join(" ")}
                >
                  {tier.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                      Most Popular
                    </span>
                  )}

                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${c.icon}`}>
                    <tier.icon className="h-5 w-5" />
                  </div>

                  <h2 className={`mt-4 text-xl font-bold ${isDark ? "text-white" : "text-stone-950"}`}>
                    {tier.name}
                  </h2>
                  <p className={`mt-2 text-sm leading-6 ${isDark ? "text-indigo-200" : "text-stone-500"}`}>
                    {tier.description}
                  </p>

                  <div className="mt-6">
                    <span className={`text-4xl font-black ${isDark ? "text-white" : "text-stone-950"}`}>
                      {tier.price}
                    </span>
                    <span className={`ml-1.5 text-sm ${isDark ? "text-indigo-300" : "text-stone-400"}`}>
                      {tier.unit}
                    </span>
                  </div>

                  <div className={`mt-4 flex gap-6 rounded-2xl p-4 text-sm ${isDark ? "bg-white/5" : "bg-stone-50"}`}>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-indigo-300" : "text-stone-400"}`}>
                        MOQ
                      </p>
                      <p className={`mt-1 font-semibold ${isDark ? "text-white" : "text-stone-950"}`}>
                        {tier.moq}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-indigo-300" : "text-stone-400"}`}>
                        Lead Time
                      </p>
                      <p className={`mt-1 font-semibold ${isDark ? "text-white" : "text-stone-950"}`}>
                        {tier.leadTime}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isDark ? "bg-indigo-700" : "bg-emerald-100"}`}>
                          <Check className={`h-3 w-3 ${isDark ? "text-indigo-200" : "text-emerald-600"}`} strokeWidth={2.5} />
                        </span>
                        <span className={isDark ? "text-indigo-100" : "text-stone-700"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.cta.href}
                    className={[
                      "mt-8 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:gap-3 active:scale-95",
                      isDark
                        ? "bg-white text-indigo-950 hover:bg-indigo-50"
                        : "bg-stone-950 text-white hover:bg-stone-800",
                    ].join(" ")}
                  >
                    {tier.cta.label}
                    <MoveRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-stone-200 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { value: "±0.005mm", label: "Precision Tolerance" },
              { value: "ISO 9001", label: "Certified Quality" },
              { value: "24h", label: "Quote Response" },
              { value: "50+", label: "Countries Served" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-stone-950">{s.value}</p>
                <p className="mt-1 text-sm text-stone-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-stone-50 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-950">Pricing FAQ</h2>
            <p className="mt-4 text-stone-500">
              Common questions about how we quote and price orders.
            </p>
          </div>
          <dl className="mt-12 space-y-6">
            {faq.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-stone-200 bg-white p-6"
              >
                <dt className="font-semibold text-stone-950">{item.q}</dt>
                <dd className="mt-2 text-sm leading-7 text-stone-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#0a0a0a] py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">
            Ready for an exact quote?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-stone-400">
            Upload your drawing (DXF, STEP, PDF) and we&apos;ll respond with a detailed
            itemized quotation within 24 hours.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/request-quote"
              className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              Get a Free Quote
              <MoveRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/5"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

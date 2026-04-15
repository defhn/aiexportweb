"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Truck,
  Users,
} from "lucide-react";

import type { HomePageProps } from "@/templates/types";

function str(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function arr(payload: Record<string, unknown>, key: string): string[] {
  const value = payload[key];
  return Array.isArray(value) ? (value as string[]) : [];
}

const EASE = [0.22, 1, 0.36, 1] as const;
const fade = (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: i * 0.08, ease: EASE } }) as const;
const fadeView = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55, delay: i * 0.08, ease: EASE } }) as const;

export function Template05HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  return (
    <div className="t05 bg-[#f6fbff] text-[#0f172a] antialiased">
      <style>{`
        .t05-wrap{max-width:1220px;margin:0 auto;padding:0 24px}.t05-sec{padding:92px 0}.t05-sec-sm{padding:64px 0}.t05-tag{display:inline-block;padding:4px 12px;border:1px solid rgba(14,165,233,.25);border-radius:999px;color:#0284c7;background:rgba(14,165,233,.08);font-size:.72rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.t05-card{background:#fff;border:1px solid #dbeafe;border-radius:18px;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s}.t05-card:hover{transform:translateY(-4px);border-color:#38bdf8;box-shadow:0 20px 50px rgba(2,132,199,.08)}
      `}</style>

      {modules.map((module) => {
        const p = module.payloadJson as Record<string, unknown>;

        if (module.moduleKey === "hero") {
          return (
            <section key="hero" className="relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,.10),transparent_28%)]" />
              <div className="t05-wrap relative z-10 py-32">
                <div className="max-w-3xl">
                  <motion.span {...fade(0)} className="t05-tag mb-6">{str(p, "eyebrow") || "Medical Device & Consumables Supplier"}</motion.span>
                  <motion.h1 {...fade(1)} className="mb-6 text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">{str(p, "title") || "Trusted Medical Products for Hospitals, Distributors, and Clinics"}</motion.h1>
                  <motion.p {...fade(2)} className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">{str(p, "description") || "We support export buyers with reliable medical consumables, rehabilitation devices, and private-label packaging."}</motion.p>
                  <motion.div {...fade(3)} className="flex flex-wrap gap-4">
                    <Link href={str(p, "primaryCtaHref") || "/contact"} className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-sky-500">{str(p, "primaryCtaLabel") || "Request Samples"}<ArrowRight className="h-4 w-4" /></Link>
                    <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-sky-200 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-sky-700 hover:bg-sky-50">Browse Products <ChevronRight className="h-4 w-4" /></Link>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "trust-signals") {
          const items = arr(p, "items").length ? arr(p, "items") : ["Quality system support", "Private label and OEM packaging", "Export documentation guidance"];
          return (
            <section key="trust-signals" className="border-y border-sky-100 bg-white py-7">
              <div className="t05-wrap flex flex-wrap items-center justify-center gap-8 md:justify-between">
                {items.map((item, i) => (
                  <motion.div key={i} {...fadeView(i)} className="flex items-center gap-3 text-sm text-slate-600"><ShieldCheck className="h-4 w-4 text-sky-500" />{item}</motion.div>
                ))}
              </div>
            </section>
          );
        }

        if (module.moduleKey === "featured-categories") {
          const slugs = arr(p, "slugs");
          const featured = slugs.length ? categories.filter((c) => slugs.includes(c.slug)) : categories.slice(0, 4);
          if (!featured.length) return null;
          return (
            <section key="featured-categories" className="t05-sec">
              <div className="t05-wrap">
                <motion.div {...fadeView(0)} className="mb-12">
                  <span className="t05-tag">Product Categories</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Medical Product <span className="text-sky-700">Categories</span></h2>
                  <p className="mt-4 max-w-2xl text-slate-600">Focused categories for supply programs in clinics, hospitals, rehab centers, and distributors.</p>
                </motion.div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featured.map((cat, i) => (
                    <motion.div key={cat.slug} {...fadeView(i)}>
                      <Link href={`/products/${cat.slug}`} className="t05-card block h-full p-7">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600"><HeartPulse className="h-5 w-5" /></div>
                        <h3 className="text-xl font-bold">{cat.nameEn}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{cat.summaryEn}</p>
                        <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">Explore <ArrowRight className="h-3.5 w-3.5" /></span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "factory-capability") {
          return (
            <section key="factory-capability" className="t05-sec bg-[#eff8ff] border-y border-sky-100">
              <div className="t05-wrap">
                <div className="grid gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
                  <motion.div {...fadeView(0)}>
                    <span className="t05-tag">Factory Capability</span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{str(p, "title") || "Built for regulated supply programs"}</h2>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">{str(p, "description") || "We support production, packaging, and quality control with project documentation for export buyers."}</p>
                    <ul className="mt-8 space-y-3">
                      {[
                        "Clean production environment and QC checks",
                        "OEM / private label packaging support",
                        "Batch traceability and documentation",
                        "Reliable export packaging and delivery",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />{item}</li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div {...fadeView(1)} className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Users className="h-6 w-6" />, val: "120+", lbl: "Clients Served" },
                      { icon: <Award className="h-6 w-6" />, val: "15+", lbl: "Export Markets" },
                      { icon: <Truck className="h-6 w-6" />, val: "7-20d", lbl: "Lead Time" },
                      { icon: <ShieldCheck className="h-6 w-6" />, val: "100%", lbl: "QC Checked" },
                    ].map((s) => (
                      <div key={s.lbl} className="t05-card p-6 text-center">
                        <div className="flex justify-center text-sky-600">{s.icon}</div>
                        <div className="mt-3 text-2xl font-black">{s.val}</div>
                        <div className="mt-1 text-xs uppercase tracking-widest text-slate-500">{s.lbl}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "quality-certifications") {
          return (
            <section key="quality-certifications" className="t05-sec">
              <div className="t05-wrap">
                <motion.div {...fadeView(0)} className="mb-10">
                  <span className="t05-tag">Quality & Compliance</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Quality Support for Medical Buyers</h2>
                </motion.div>
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    "Material and batch traceability",
                    "Packaging and labeling review",
                    "Document support for export compliance",
                  ].map((item, i) => (
                    <motion.div key={item} {...fadeView(i)} className="t05-card p-6">
                      <ShieldCheck className="h-6 w-6 text-sky-600" />
                      <h3 className="mt-4 text-base font-bold">{item}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">Compliance support helps reduce risk for distributors, clinics, and import partners.</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "process-steps") {
          const items = arr(p, "items").length ? arr(p, "items") : ["Product brief and target market", "Specification review and quotation", "Sampling and quality confirmation", "Production and shipping"];
          return (
            <section key="process-steps" className="t05-sec bg-white border-y border-sky-100">
              <div className="t05-wrap">
                <motion.div {...fadeView(0)} className="mb-12 text-center">
                  <span className="t05-tag">Delivery Process</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">From Brief to Shipment</h2>
                </motion.div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((step, i) => (
                    <motion.div key={step} {...fadeView(i)} className="t05-card p-6">
                      <div className="mb-3 text-3xl font-black text-sky-200">0{i + 1}</div>
                      <p className="text-sm leading-6 text-slate-700">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}

      {products.length > 0 && (
        <section className="t05-sec bg-white">
          <div className="t05-wrap">
            <motion.div {...fadeView(0)} className="mb-12 flex items-end justify-between">
              <div>
                <span className="t05-tag">Featured Products</span>
                <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Consumables & Devices</h2>
              </div>
              <Link href="/products" className="hidden items-center gap-2 text-sm font-bold uppercase tracking-wider text-sky-700 md:inline-flex">View All <ArrowRight className="h-4 w-4" /></Link>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product, i) => (
                <motion.div key={product.slug} {...fadeView(i)}>
                  <Link href={`/products/${product.categorySlug}/${product.slug}`} className="t05-card block h-full">
                    <div className="relative aspect-[4/3] bg-sky-50">
                      {product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.coverImageAlt ?? product.nameEn} className="h-full w-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-sky-200"><Stethoscope className="h-12 w-12" /></div>}
                    </div>
                    <div className="p-5">
                      <h3 className="mb-1 text-base font-bold">{product.nameEn}</h3>
                      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-600">{product.shortDescriptionEn ?? ""}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700">Details <ChevronRight className="h-3.5 w-3.5" /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {blogPosts.length > 0 && (
        <section className="t05-sec bg-[#eff8ff] border-y border-sky-100">
          <div className="t05-wrap">
            <motion.div {...fadeView(0)} className="mb-12">
              <span className="t05-tag">Insights</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Medical Procurement Guides</h2>
            </motion.div>
            <div className="grid gap-6 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post, i) => (
                <motion.div key={post.slug} {...fadeView(i)} className="t05-card p-7">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-semibold leading-7">{post.titleEn}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerptEn ?? ""}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="t05-sec-sm bg-gradient-to-r from-sky-700 to-cyan-600 text-white">
        <div className="t05-wrap text-center">
          <motion.div {...fadeView(0)} className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-black md:text-4xl">Need a medical supply partner?</h2>
            <p className="mb-8 text-cyan-50">Send your target market, product specs, and packaging needs. We&apos;ll prepare a practical quotation and sampling plan.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-black uppercase tracking-wider text-sky-700">Start Inquiry <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/request-quote" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white">Request Quote</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  Factory,
  Globe,
  ShieldCheck,
  Sparkles,
  Zap,
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

function fade(i: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay: i * 0.08, ease: EASE },
  } as const;
}

function fadeView(i: number) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, delay: i * 0.08, ease: EASE },
  } as const;
}

const TRUST_ICONS = [
  <ShieldCheck key="a" className="h-5 w-5" />,
  <BatteryCharging key="b" className="h-5 w-5" />,
  <Globe key="c" className="h-5 w-5" />,
];

export function Template04HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  return (
    <div className="t04 bg-[#070f1b] text-white antialiased">
      <style>{`
        .t04 { --ac:#22d3ee; --ac2:#0ea5e9; --sf:#0c1b2d; --bd:#17324a; --tx:#9fb6ce; }
        .t04-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
        .t04-sec { padding:92px 0; }
        .t04-sec-sm { padding:62px 0; }
        .t04-tag { display:inline-block; padding:4px 12px; border:1px solid rgba(34,211,238,.45); border-radius:999px; color:#67e8f9; background:rgba(34,211,238,.12); font-size:.72rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; }
        .t04-card { background:var(--sf); border:1px solid var(--bd); border-radius:10px; overflow:hidden; transition:border-color .2s, transform .2s; }
        .t04-card:hover { border-color:#22d3ee; transform:translateY(-4px); }
      `}</style>

      {modules.map((module) => {
        const p = module.payloadJson as Record<string, unknown>;

        if (module.moduleKey === "hero") {
          return (
            <section key="hero" className="relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-16 top-0 h-[460px] w-[460px] rounded-full bg-cyan-500/10 blur-[120px]" />
                <div className="absolute -right-10 bottom-0 h-[360px] w-[360px] rounded-full bg-sky-500/10 blur-[110px]" />
              </div>
              <div className="t04-wrap relative z-10 py-32">
                <div className="max-w-3xl">
                  <motion.span {...fade(0)} className="t04-tag mb-6">{str(p, "eyebrow") || "Power System Integrator"}</motion.span>
                  <motion.h1 {...fade(1)} className="mb-6 text-5xl font-black leading-[1.08] tracking-tight md:text-6xl">{str(p, "title") || "Reliable Power Solutions for Industrial and Commercial Projects"}</motion.h1>
                  <motion.p {...fade(2)} className="mb-10 max-w-2xl text-lg leading-relaxed text-[#9fb6ce]">{str(p, "description") || "Delivering switchgear, energy storage, and turnkey electrical systems with global project support."}</motion.p>
                  <motion.div {...fade(3)} className="flex flex-wrap gap-4">
                    <Link href={str(p, "primaryCtaHref") || "/contact"} className="inline-flex items-center gap-2 rounded bg-cyan-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-cyan-500">{str(p, "primaryCtaLabel") || "Request Proposal"} <ArrowRight className="h-4 w-4" /></Link>
                    <Link href="/products" className="inline-flex items-center gap-2 rounded border border-slate-500 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:border-cyan-300">Browse Products <ChevronRight className="h-4 w-4" /></Link>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "trust-signals") {
          const items = arr(p, "items").length ? arr(p, "items") : ["IEC / CE compliant production", "Battery system integration support", "Export delivery to 40+ countries"];
          return (
            <section key="trust-signals" className="border-y border-[#17324a] bg-[#0b1728] py-7">
              <div className="t04-wrap flex flex-wrap items-center justify-center gap-7 md:justify-between">
                {items.map((item, i) => (
                  <motion.div key={i} {...fadeView(i)} className="flex items-center gap-3 text-sm text-slate-200">
                    <span className="text-cyan-300">{TRUST_ICONS[i % TRUST_ICONS.length]}</span>
                    <span>{item}</span>
                  </motion.div>
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
            <section key="featured-categories" className="t04-sec">
              <div className="t04-wrap">
                <motion.div {...fadeView(0)} className="mb-14">
                  <span className="t04-tag">Solutions Portfolio</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Power System <span className="text-cyan-300">Categories</span></h2>
                </motion.div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {featured.map((cat, i) => (
                    <motion.div key={cat.slug} {...fadeView(i)}>
                      <Link href={`/products/${cat.slug}`} className="t04-card block h-full p-7">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-cyan-500/10 text-cyan-300"><Zap className="h-5 w-5" /></div>
                        <h3 className="mb-2 text-xl font-bold">{cat.nameEn}</h3>
                        <p className="mb-5 text-sm leading-relaxed text-[#9fb6ce]">{cat.summaryEn}</p>
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">View Products <ArrowRight className="h-3.5 w-3.5" /></span>
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
            <section key="factory-capability" className="t04-sec border-y border-[#17324a] bg-[#0b1728]">
              <div className="t04-wrap">
                <div className="grid gap-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
                  <motion.div {...fadeView(0)}>
                    <span className="t04-tag">Factory Capability</span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{str(p, "title") || "Built for project delivery"}</h2>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-[#9fb6ce]">{str(p, "description") || "Engineering, procurement, assembly, and testing are managed with export project requirements in mind."}</p>
                    <ul className="mt-8 space-y-3">
                      {[
                        "Custom electrical design and load review",
                        "In-house assembly and test procedures",
                        "Battery pack and storage integration",
                        "Documentation for export and commissioning",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-200"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{item}</li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div {...fadeView(1)} className="grid grid-cols-2 gap-4">
                    {[
                      { icon: <Factory className="h-6 w-6" />, val: "18,000㎡", lbl: "Production Area" },
                      { icon: <Zap className="h-6 w-6" />, val: "90+", lbl: "Engineers & Technicians" },
                      { icon: <Globe className="h-6 w-6" />, val: "40+", lbl: "Export Countries" },
                      { icon: <BatteryCharging className="h-6 w-6" />, val: "24-45d", lbl: "Typical Lead Time" },
                    ].map((s) => (
                      <div key={s.lbl} className="t04-card p-6">
                        <div className="text-cyan-300">{s.icon}</div>
                        <div className="mt-3 text-2xl font-black">{s.val}</div>
                        <div className="mt-1 text-xs uppercase tracking-widest text-[#9fb6ce]">{s.lbl}</div>
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
            <section key="quality-certifications" className="t04-sec">
              <div className="t04-wrap">
                <motion.div {...fadeView(0)} className="mb-10">
                  <span className="t04-tag">Quality & Compliance</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Certification and Testing Support</h2>
                </motion.div>
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    "Electrical safety checks",
                    "Battery and energy storage QA",
                    "CE / IEC documentation support",
                  ].map((item, i) => (
                    <motion.div key={item} {...fadeView(i)} className="t04-card p-6">
                      <ShieldCheck className="h-6 w-6 text-cyan-300" />
                      <h3 className="mt-4 text-base font-bold">{item}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#9fb6ce]">Controlled QA steps to reduce installation risk and improve shipment readiness.</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "process-steps") {
          const items = arr(p, "items").length ? arr(p, "items") : ["Load and application review", "System design and quotation", "Factory build and testing", "Shipment and remote support"];
          return (
            <section key="process-steps" className="t04-sec border-y border-[#17324a] bg-[#0b1728]">
              <div className="t04-wrap">
                <motion.div {...fadeView(0)} className="mb-12 text-center">
                  <span className="t04-tag">Delivery Process</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">From Requirement to Commissioning</h2>
                </motion.div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((step, i) => (
                    <motion.div key={step} {...fadeView(i)} className="t04-card p-6">
                      <div className="mb-3 text-3xl font-black text-cyan-500/40">{`0${i + 1}`}</div>
                      <p className="text-sm text-slate-200">{step}</p>
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
        <section className="t04-sec border-y border-[#17324a] bg-[#0b1728]">
          <div className="t04-wrap">
            <motion.div {...fadeView(0)} className="mb-12 flex items-end justify-between">
              <div>
                <span className="t04-tag">Featured Products</span>
                <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Core Equipment</h2>
              </div>
              <Link href="/products" className="hidden items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-300 md:inline-flex">View All <ArrowRight className="h-4 w-4" /></Link>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product, i) => (
                <motion.div key={product.slug} {...fadeView(i)}>
                  <Link href={`/products/${product.categorySlug}/${product.slug}`} className="t04-card block h-full">
                    <div className="relative aspect-[4/3] bg-[#152b42]">
                      {product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.coverImageAlt ?? product.nameEn} className="h-full w-full object-cover opacity-85 transition-all duration-500 hover:opacity-100" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-500"><Factory className="h-12 w-12" /></div>}
                    </div>
                    <div className="p-5">
                      <h3 className="mb-1 text-base font-bold">{product.nameEn}</h3>
                      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[#9fb6ce]">{product.shortDescriptionEn ?? ""}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300">Details <ChevronRight className="h-3.5 w-3.5" /></span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {blogPosts.length > 0 && (
        <section className="t04-sec border-y border-[#17324a] bg-[#0b1728]">
          <div className="t04-wrap">
            <motion.div {...fadeView(0)} className="mb-12 flex items-end justify-between">
              <div>
                <span className="t04-tag">Insights</span>
                <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Energy Knowledge Base</h2>
              </div>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post, i) => (
                <motion.div key={post.slug} {...fadeView(i)}>
                  <Link href={`/blog/${post.slug}`} className="t04-card block h-full p-7">
                    <h3 className="mb-2 text-base font-semibold">{post.titleEn}</h3>
                    <p className="line-clamp-2 text-sm text-[#9fb6ce]">{post.excerptEn ?? ""}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="t04-sec-sm bg-gradient-to-r from-cyan-700 to-sky-600">
        <div className="t04-wrap text-center">
          <motion.div {...fadeView(0)} className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-black md:text-4xl">Planning an energy project?</h2>
            <p className="mb-8 text-cyan-100">Share voltage level, capacity, site conditions, and destination market. Our engineers will prepare a tailored proposal.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded bg-white px-8 py-3.5 text-sm font-black uppercase tracking-wider text-cyan-700">Send Requirements <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/request-quote" className="inline-flex items-center gap-2 rounded border border-white/50 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white">Request Quote Form</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

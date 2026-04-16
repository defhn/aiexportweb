"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BatteryCharging, CircuitBoard, Globe2, ShieldCheck, Sparkles, Smartphone, Truck } from "lucide-react";
import type { HomePageProps } from "@/templates/types";
import { getTemplateTheme } from "@/templates/theme";

const EASE = [0.22, 1, 0.36, 1] as const;
const fv = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: i * 0.08, ease: EASE } }) as const;
const str = (p: Record<string, unknown>, k: string) => (typeof p[k] === "string" ? (p[k] as string) : "");
const arr = (p: Record<string, unknown>, k: string) => (Array.isArray(p[k]) ? (p[k] as string[]) : []);

const theme = getTemplateTheme("template-11");

export function Template11HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  return (
    <div className="antialiased min-h-screen text-white overflow-hidden" style={{ backgroundColor: theme.surface }}>
      {modules.map((m) => {
        const p = (m.payloadJson ?? {}) as Record<string, unknown>;

        if (m.moduleKey === "hero") {
          return (
            <section key="hero" className="relative py-32 lg:py-48 flex items-center min-h-[90vh]">
              {/* Deep Audit: Cyber-blue glow & carbon texture */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon pointer-events-none" />
              <div className="absolute top-1/4 -left-32 h-[800px] w-[800px] rounded-full blur-[150px] pointer-events-none" style={{ backgroundColor: `${theme.accent}15` }} />
              <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full blur-[140px] pointer-events-none" style={{ backgroundColor: `${theme.accent}10` }} />
              
              <div className="relative z-10 mx-auto max-w-7xl px-6 grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <motion.div {...fv(0)} className="mb-8 inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-md" style={{ borderColor: theme.border, backgroundColor: "rgba(255,255,255,0.02)", color: theme.accent }}>
                    <div className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: theme.accent }} />
                    {str(p, "eyebrow") || "Consumer Electronics Manufacturer"}
                  </motion.div>
                  <motion.h1 {...fv(1)} className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
                    {str(p, "title") || "Smart Consumer Electronics Built for Global Brands"}
                  </motion.h1>
                  <motion.p {...fv(2)} className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60 font-medium">
                    {str(p, "description") || "From product concept to mass production and export readiness, we support fast-moving electronics programs end to end."}
                  </motion.p>
                  <motion.div {...fv(3)} className="mt-12 flex flex-wrap gap-5">
                    <Link href={str(p, "primaryCtaHref") || "/contact"} className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-full px-8 text-sm font-black uppercase tracking-widest text-[#070b14] transition-all hover:scale-105 shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:shadow-[0_0_80px_rgba(34,211,238,0.4)]" style={{ backgroundColor: theme.accent }}>
                      {str(p, "primaryCtaLabel") || "Request OEM Quote"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link href="/products" className="inline-flex h-14 items-center justify-center rounded-full border px-8 text-sm font-black uppercase tracking-widest transition-colors hover:bg-white/5" style={{ borderColor: theme.border, color: "rgba(255,255,255,0.8)" }}>
                      Browse Products
                    </Link>
                  </motion.div>
                </div>
                
                <motion.div {...fv(1)} className="relative rounded-[3rem] border p-1 shadow-2xl" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay texture-carbon pointer-events-none rounded-[3rem]" />
                  <div className="relative z-10 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {[
                        { icon: Smartphone, title: "Mobile-first devices", desc: "Wearables and connected devices." },
                        { icon: CircuitBoard, title: "Electronics assembly", desc: "Reliable SMT and testing workflows." },
                        { icon: BatteryCharging, title: "Power integration", desc: "Advanced charging programs." },
                        { icon: ShieldCheck, title: "Quality assurance", desc: "Compliance prep and controls." }
                      ].map((item, i) => (
                        <div key={i} className="rounded-3xl border p-6 transition-colors hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(0,0,0,0.2)" }}>
                          <item.icon className="h-8 w-8 mb-5" style={{ color: theme.accent }} />
                          <h3 className="text-lg font-bold text-white">{item.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-white/50">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>
          );
        }

        if (m.moduleKey === "trust-signals") {
          const items = arr(p, "items").length ? arr(p, "items") : ["OEM / ODM development support", "Retail and e-commerce packaging", "Export compliance guidance"];
          return (
            <section key="trust-signals" className="border-y py-10 relative overflow-hidden" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
               <div className="absolute inset-0 opacity-10 mix-blend-overlay texture-carbon pointer-events-none" />
               <div className="relative z-10 mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-10 md:justify-between px-6">
                {items.map((it, i) => (
                  <motion.div key={i} {...fv(i)} className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-white/60">
                    <Globe2 className="h-5 w-5" style={{ color: theme.accent }} />
                    {it}
                  </motion.div>
                ))}
              </div>
            </section>
          );
        }

        if (m.moduleKey === "featured-categories") {
          const slugs = arr(p, "slugs");
          const featured = slugs.length ? categories.filter((c) => slugs.includes(c.slug)) : categories.slice(0, 4);
          if (!featured.length) return null;
          return (
            <section key="featured-categories" className="py-32 relative">
              <div className="mx-auto max-w-7xl px-6">
                <motion.div {...fv(0)} className="mb-20 text-center max-w-3xl mx-auto">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>Product Categories</span>
                  <h2 className="mt-6 text-4xl font-black md:text-5xl lg:text-6xl text-white">Focus <span style={{ color: theme.accent }}>Categories</span></h2>
                  <p className="mt-6 text-lg text-white/60 font-medium">A focused assortment designed for modern marketplaces and fast launches.</p>
                </motion.div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {featured.map((c, i) => (
                    <motion.div key={c.slug} {...fv(i)}>
                      <Link href={`/products/${c.slug}`} className="group relative block h-full rounded-[2.5rem] border p-8 transition-all hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(34,211,238,0.15)] overflow-hidden" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon" />
                        <div className="relative z-10">
                          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.03)", color: theme.accent }}>
                            <Truck className="h-8 w-8 group-hover:scale-110 transition-transform" />
                          </div>
                          <h3 className="text-2xl font-black">{c.nameEn}</h3>
                          <p className="mt-4 text-sm leading-relaxed text-white/50">{c.summaryEn}</p>
                          <span className="mt-8 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                            Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </Link>
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
        <section className="py-32 relative border-t" style={{ borderColor: theme.border, backgroundColor: "rgba(0,0,0,0.2)" }}>
          <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full blur-[150px] pointer-events-none" style={{ backgroundColor: `${theme.accent}10`, transform: 'translate(30%, -30%)' }} />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <motion.div {...fv(0)} className="mb-20">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>Featured Products</span>
              <h2 className="mt-6 text-4xl font-black md:text-5xl lg:text-6xl text-white">Core Technology</h2>
            </motion.div>
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {products.slice(0, 6).map((p, i) => (
                <motion.div key={p.slug} {...fv(i)}>
                  <Link href={`/products/${p.categorySlug}/${p.slug}`} className="group relative block h-full overflow-hidden rounded-[2.5rem] border shadow-2xl transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(34,211,238,0.15)]" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
                    <div className="relative aspect-[4/3] bg-black overflow-hidden">
                      {p.coverImageUrl ? <img src={p.coverImageUrl} alt={p.coverImageAlt ?? p.nameEn} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]" /> : <div className="absolute inset-0 flex items-center justify-center text-cyan-300"><Sparkles className="h-12 w-12" /></div>}
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none rounded-t-[2.5rem]" />
                    </div>
                    <div className="p-8 relative">
                      <div className="absolute inset-0 opacity-20 mix-blend-overlay texture-carbon pointer-events-none" />
                      <h3 className="relative z-10 text-xl font-black text-white">{p.nameEn}</h3>
                      <p className="relative z-10 mt-3 line-clamp-2 text-sm text-white/50 leading-relaxed">{p.shortDescriptionEn ?? ""}</p>
                      <span className="relative z-10 mt-6 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                        View Details <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {blogPosts.length > 0 && (
        <section className="py-32 relative">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fv(0)} className="mb-20">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>Insights</span>
              <h2 className="mt-6 text-4xl font-black md:text-5xl text-white">Sourcing Guides</h2>
            </motion.div>
            <div className="grid gap-8 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((b, i) => (
                <motion.article key={b.slug} {...fv(i)} className="group relative rounded-[2.5rem] border p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2" style={{ borderColor: theme.border, backgroundColor: theme.surfaceAlt }}>
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay texture-carbon rounded-[2.5rem]" />
                  <Link href={`/blog/${b.slug}`} className="relative z-10 flex flex-col h-full">
                    <h3 className="text-xl font-black leading-[1.4] text-white group-hover:text-white/80 transition-colors">{b.titleEn}</h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-white/50">{b.excerptEn ?? ""}</p>
                    <div className="mt-auto pt-8">
                       <span className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                        Read Story
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

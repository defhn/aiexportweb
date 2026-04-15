"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Factory,
  Globe2,
  PackageCheck,
  Settings2,
  Zap,
} from "lucide-react";
import type { HomePageProps } from "@/templates/types";

// ─── 工具函数 ───────────────────────────────────────────────────────────────
function readString(payload: Record<string, unknown>, key: string): string {
  const v = payload[key];
  return typeof v === "string" ? v : "";
}

function readStringArray(payload: Record<string, unknown>, key: string): string[] {
  const v = payload[key];
  return Array.isArray(v) ? (v as string[]) : [];
}

// ─── 淡入动画工厂 ────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

function fadeUp(i: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE },
  } as const;
}

function fadeUpView(i: number) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE },
  } as const;
}

// ─── 应用场景图标 ────────────────────────────────────────────────────────────
const APP_ICONS: Record<string, React.ReactNode> = {
  "Packaging": <PackageCheck className="h-5 w-5" />,
  "Food processing": <Factory className="h-5 w-5" />,
  "Assembly automation": <Cpu className="h-5 w-5" />,
};

// ═══════════════════════════════════════════════════════════════════════════════
//  Template-02 首页 — 工业设备 / 深黑 + 工业橙
// ═══════════════════════════════════════════════════════════════════════════════
export function Template02HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  return (
    <div className="t02 bg-[#0f1117] text-white antialiased">
      <style>{`
        .t02 { --or:#f97316; --or2:#c2410c; --sf:#161b27; --bd:#1e2535; }
        .t02-tag { display:inline-block; padding:4px 12px; background:rgba(249,115,22,.12);
          border:1px solid rgba(249,115,22,.3); color:#f97316; font-size:.72rem;
          font-weight:700; letter-spacing:.12em; text-transform:uppercase; border-radius:3px; }
        .t02-card { background:var(--sf); border:1px solid var(--bd); border-radius:8px; overflow:hidden;
          transition:border-color .22s, transform .22s; }
        .t02-card:hover { border-color:#f97316; transform:translateY(-4px); }
        .t02-btn-or { display:inline-flex; align-items:center; gap:8px; padding:14px 28px;
          background:#f97316; color:#fff; font-weight:700; font-size:.85rem;
          letter-spacing:.05em; text-transform:uppercase; border-radius:4px; transition:background .18s; }
        .t02-btn-or:hover { background:#c2410c; }
        .t02-btn-out { display:inline-flex; align-items:center; gap:8px; padding:13px 26px;
          border:1.5px solid rgba(255,255,255,.2); color:#fff; font-weight:600; font-size:.85rem;
          letter-spacing:.05em; text-transform:uppercase; border-radius:4px; transition:border-color .18s; }
        .t02-btn-out:hover { border-color:#f97316; }
        .t02-sec { padding:88px 0; }
        .t02-sec-sm { padding:60px 0; }
        .t02-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
      `}</style>

      {/* ═══════════ MODULES ═══════════════════════════════════════════════ */}
      {modules.map((module) => {
        const p = module.payloadJson as Record<string, unknown>;

        /* ── Hero ─────────────────────────────────────────────────────── */
        if (module.moduleKey === "hero") {
          return (
            <section key="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
              {/* 光晕 */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-orange-600/10 blur-[130px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.035]"
                  style={{ backgroundImage:"linear-gradient(rgba(249,115,22,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.8) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
              </div>

              <div className="t02-wrap relative z-10 py-28">
                <div className="max-w-3xl">
                  <motion.div {...fadeUp(0)} className="mb-6">
                    <span className="t02-tag">{readString(p, "eyebrow") || "Automation Equipment Manufacturer"}</span>
                  </motion.div>

                  <motion.h1 {...fadeUp(1)} className="text-5xl md:text-6xl font-black leading-[1.07] tracking-tight mb-6">
                    {readString(p, "title") || "Custom Industrial Equipment Built for Efficient Production"}
                  </motion.h1>

                  <motion.p {...fadeUp(2)} className="text-lg text-gray-400 mb-10 max-w-2xl leading-relaxed">
                    {readString(p, "description") || "Help buyers launch production lines faster with tailored automation equipment and dependable engineering support."}
                  </motion.p>

                  <motion.div {...fadeUp(3)} className="flex flex-wrap gap-4">
                    <Link href={readString(p, "primaryCtaHref") || "/contact"} className="t02-btn-or">
                      {readString(p, "primaryCtaLabel") || "Request Solution"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/products" className="t02-btn-out">Browse Equipment <ChevronRight className="h-4 w-4" /></Link>
                  </motion.div>

                  {/* 统计 */}
                  <motion.div {...fadeUp(4)} className="mt-20 grid grid-cols-3 gap-8 border-t border-[#1e2535] pt-10 max-w-lg">
                    {[
                      { val: "500+", lbl: "Equipment Delivered" },
                      { val: "35+",  lbl: "Countries Served" },
                      { val: "10Y+", lbl: "Engineering Exp." },
                    ].map((s) => (
                      <div key={s.lbl}>
                        <div className="text-4xl font-black text-orange-500 leading-none">{s.val}</div>
                        <div className="text-[.7rem] text-gray-500 uppercase tracking-widest mt-1">{s.lbl}</div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </section>
          );
        }

        /* ── Applications ─────────────────────────────────────────────── */
        if (module.moduleKey === "applications") {
          const items = readStringArray(p, "items").length
            ? readStringArray(p, "items")
            : ["Packaging", "Food processing", "Assembly automation"];

          return (
            <section key="applications" className="t02-sec-sm border-y border-[#1e2535]">
              <div className="t02-wrap">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600 whitespace-nowrap">Key Applications</p>
                  <div className="hidden md:block h-px flex-1 bg-[#1e2535]" />
                  <div className="flex flex-wrap gap-4">
                    {items.map((item, i) => (
                      <motion.div key={i} {...fadeUpView(i)}
                        className="flex items-center gap-3 bg-[#161b27] border border-[#1e2535] rounded-lg px-5 py-3">
                        <span className="text-orange-500">{APP_ICONS[item] ?? <Settings2 className="h-5 w-5" />}</span>
                        <span className="font-semibold text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        /* ── Featured Categories ───────────────────────────────────────── */
        if (module.moduleKey === "featured-categories") {
          const slugs = readStringArray(p, "slugs");
          const featured = slugs.length ? categories.filter((c) => slugs.includes(c.slug)) : categories.slice(0, 4);
          if (!featured.length) return null;

          return (
            <section key="featured-categories" className="t02-sec">
              <div className="t02-wrap">
                <motion.div {...fadeUpView(0)} className="mb-14">
                  <span className="t02-tag">Equipment Categories</span>
                  <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3">
                    Solutions by <span className="text-orange-500">Application</span>
                  </h2>
                  <p className="text-gray-400 max-w-xl leading-relaxed">Engineered systems for assembly, packaging, inspection, and material handling.</p>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {featured.map((cat, i) => (
                    <motion.div key={cat.slug} {...fadeUpView(i)}>
                      <Link href={`/products/${cat.slug}`} className="block t02-card group h-full">
                        <div className="h-1 w-full bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-8">
                          <div className="mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                              <Cpu className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold">{cat.nameEn}</h3>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed mb-6">{cat.summaryEn}</p>
                          <span className="inline-flex items-center gap-2 text-orange-500 text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all">
                            Explore Products <ArrowRight className="h-3.5 w-3.5" />
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

      {/* ═══════════ 工厂能力（静态）════════════════════════════════════════ */}
      <section className="t02-sec bg-[#161b27] border-y border-[#1e2535]">
        <div className="t02-wrap">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUpView(0)}>
              <span className="t02-tag">Factory Capability</span>
              <h2 className="text-3xl md:text-4xl font-black mt-4 mb-5">
                From Concept to <span className="text-orange-500">Commissioning</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Engineering, fabrication, assembly, and testing are managed in-house for better lead-time control and quality consistency.
              </p>
              <ul className="space-y-3">
                {[
                  "Custom mechanical design and DFM review",
                  "In-house fabrication and welding",
                  "PLC / servo motor integration",
                  "Factory acceptance testing (FAT)",
                  "Remote commissioning support",
                  "CE & ISO documentation prepared",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div {...fadeUpView(1)} className="grid grid-cols-2 gap-4">
              {[
                { icon: <Factory className="h-6 w-6" />,  val: "15,000㎡", lbl: "Production Floor" },
                { icon: <Zap className="h-6 w-6" />,      val: "80+",     lbl: "Engineers On Staff" },
                { icon: <Globe2 className="h-6 w-6" />,   val: "35+",     lbl: "Export Countries" },
                { icon: <Settings2 className="h-6 w-6" />, val: "25-45d", lbl: "Typical Lead Time" },
              ].map((s, i) => (
                <div key={i} className="t02-card p-6 flex flex-col gap-3">
                  <div className="text-orange-500">{s.icon}</div>
                  <div className="text-2xl font-black">{s.val}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{s.lbl}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ 精选产品 ═══════════════════════════════════════════════ */}
      {products.length > 0 && (
        <section className="t02-sec">
          <div className="t02-wrap">
            <motion.div {...fadeUpView(0)} className="flex items-end justify-between mb-12">
              <div>
                <span className="t02-tag">Equipment Portfolio</span>
                <h2 className="text-3xl md:text-4xl font-black mt-4">
                  Standard & Custom <span className="text-orange-500">Machines</span>
                </h2>
              </div>
              <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product, i) => (
                <motion.div key={product.slug} {...fadeUpView(i)}>
                  <Link href={`/products/${product.categorySlug}/${product.slug}`} className="block t02-card group h-full">
                    <div className="relative aspect-[4/3] bg-[#1e2535] overflow-hidden">
                      {product.coverImageUrl ? (
                        <img src={product.coverImageUrl} alt={product.coverImageAlt ?? product.nameEn}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Settings2 className="h-12 w-12 text-gray-700" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-base mb-1">{product.nameEn}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{product.shortDescriptionEn ?? ""}</p>
                      <span className="inline-flex items-center gap-1.5 text-orange-500 text-xs font-bold uppercase tracking-wider">
                        View Details <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ 流程 ═══════════════════════════════════════════════════ */}
      <section className="t02-sec bg-[#161b27] border-t border-[#1e2535]">
        <div className="t02-wrap">
          <motion.div {...fadeUpView(0)} className="text-center mb-14">
            <span className="t02-tag">How We Work</span>
            <h2 className="text-3xl md:text-4xl font-black mt-4">
              Project <span className="text-orange-500">Process</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n:"01", t:"Requirement Review", d:"Share your process targets, layout, and output requirements for initial evaluation." },
              { n:"02", t:"Solution Design",    d:"We deliver a proposal with layout drawings, specs, and delivery plan." },
              { n:"03", t:"Build & Test",       d:"Fabrication, assembly and full FAT completed with documentation." },
              { n:"04", t:"Delivery & Support", d:"Export packing, on-site or remote commissioning, and ongoing support." },
            ].map((s, i) => (
              <motion.div key={s.n} {...fadeUpView(i)} className="t02-card p-6">
                <div className="text-5xl font-black text-orange-500/20 mb-4 leading-none">{s.n}</div>
                <h3 className="font-bold text-base mb-2">{s.t}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 博客 ═══════════════════════════════════════════════════ */}
      {blogPosts.length > 0 && (
        <section className="t02-sec border-t border-[#1e2535]">
          <div className="t02-wrap">
            <motion.div {...fadeUpView(0)} className="flex items-end justify-between mb-12">
              <div>
                <span className="t02-tag">Knowledge Base</span>
                <h2 className="text-3xl font-black mt-4">Equipment <span className="text-orange-500">Insights</span></h2>
              </div>
              <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-orange-500 text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all">
                All Articles <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map((post, i) => (
                <motion.div key={post.slug} {...fadeUpView(i)}>
                  <Link href={`/blog/${post.slug}`} className="block t02-card group h-full p-7">
                    {post.categorySlug && (
                      <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3 block">
                        {post.categorySlug.replace(/-/g, " ")}
                      </span>
                    )}
                    <h3 className="font-bold text-base leading-snug mb-3 group-hover:text-orange-400 transition-colors">{post.titleEn}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerptEn ?? ""}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ Final CTA ══════════════════════════════════════════════ */}
      <section className="t02-sec-sm bg-gradient-to-r from-orange-700 to-orange-500">
        <div className="t02-wrap text-center">
          <motion.div {...fadeUpView(0)}>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-5 block">Available for New Projects</span>
            <h2 className="text-3xl md:text-4xl font-black mb-5">Ready to build your production line?</h2>
            <p className="text-orange-100 mb-10 max-w-xl mx-auto">Share your process requirements and output targets — our engineering team will prepare a tailored equipment proposal.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-700 font-black text-sm uppercase tracking-wider rounded hover:bg-orange-50 transition-colors">
                Send Requirements <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold text-sm uppercase tracking-wider rounded hover:border-white transition-colors">
                Browse Catalog
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

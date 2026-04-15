"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe,
  Layers,
  Package,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import type { HomePageProps } from "@/templates/types";

function str(payload: Record<string, unknown>, key: string): string {
  const v = payload[key];
  return typeof v === "string" ? v : "";
}
function arr(payload: Record<string, unknown>, key: string): string[] {
  const v = payload[key];
  return Array.isArray(v) ? (v as string[]) : [];
}

const EASE = [0.25, 1, 0.35, 1] as const;
const fu = (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: i * 0.08, ease: EASE } }) as const;
const fuv = (i: number) => ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: i * 0.08, ease: EASE } }) as const;

const TRUST_ICONS = [
  <Package key="a" className="h-5 w-5" />,
  <Ruler key="b" className="h-5 w-5" />,
  <Truck key="c" className="h-5 w-5" />,
];

export function Template03HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  return (
    <div className="t03 bg-[#fafaf8] text-[#1c1917] antialiased">
      <style>{`
        .t03 { --gold:#b8936a; --gold-lt:#e8d5c0; --charcoal:#1c1917; --stone:#78716c; --surface:#f5f4f0; --border:#e7e5e0; }
        .t03-gold { color: var(--gold); }
        .t03-tag { display:inline-block; padding:4px 14px; border:1px solid var(--gold-lt); color:var(--gold); font-size:.72rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; border-radius:2px; background: rgba(184,147,106,.06); }
        .t03-btn-primary { display:inline-flex; align-items:center; gap:8px; padding:14px 32px; background:var(--charcoal); color:#fff; font-weight:700; font-size:.85rem; letter-spacing:.06em; text-transform:uppercase; border-radius:2px; transition:background .2s, transform .15s; }
        .t03-btn-primary:hover { background:#292524; transform:translateY(-1px); }
        .t03-btn-outline { display:inline-flex; align-items:center; gap:8px; padding:13px 30px; border:1.5px solid var(--charcoal); color:var(--charcoal); font-weight:600; font-size:.85rem; letter-spacing:.06em; text-transform:uppercase; border-radius:2px; transition:background .2s; }
        .t03-btn-outline:hover { background:var(--charcoal); color:#fff; }
        .t03-card { background:#fff; border:1px solid var(--border); border-radius:4px; overflow:hidden; transition:box-shadow .25s, transform .25s, border-color .25s; }
        .t03-card:hover { box-shadow:0 8px 32px rgba(0,0,0,.08); transform:translateY(-4px); border-color:var(--gold-lt); }
        .t03-sec { padding:96px 0; }
        .t03-sec-sm { padding:60px 0; }
        .t03-wrap { max-width:1200px; margin:0 auto; padding:0 32px; }
        .t03-accent-bar { width:40px; height:3px; background:var(--gold); display:block; }
      `}</style>

      {modules.map((module) => {
        const p = module.payloadJson as Record<string, unknown>;

        if (module.moduleKey === "hero") {
          return (
            <section key="hero" className="relative overflow-hidden bg-[#fafaf8]">
              <div className="absolute right-0 top-0 w-[45%] h-full pointer-events-none overflow-hidden">
                <div className="absolute inset-0 opacity-60" style={{ background: "linear-gradient(135deg, #f0ebe3 0%, #e8ddd2 40%, #ddd5c8 100%)" }} />
                {[12, 28, 44, 60, 76].map((pct, i) => (
                  <div key={i} className="absolute top-0 h-full w-px opacity-20" style={{ left: `${pct}%`, background: "linear-gradient(180deg, transparent, #a89880, transparent)" }} />
                ))}
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #fafaf8 0%, transparent 30%)" }} />
              </div>

              <div className="t03-wrap relative z-10 py-36">
                <div className="max-w-2xl">
                  <motion.div {...fu(0)} className="mb-6"><span className="t03-tag">{str(p, "eyebrow") || "Architectural Metal Supplier"}</span></motion.div>
                  <motion.span {...fu(1)} className="t03-accent-bar mb-6 block" />
                  <motion.h1 {...fu(1)} className="text-5xl md:text-6xl font-light leading-[1.1] tracking-tight mb-6 text-[#1c1917]">{str(p, "title") || "Decorative Metal Products for Modern Building Projects"}</motion.h1>
                  <motion.p {...fu(2)} className="text-lg text-[#78716c] leading-relaxed mb-10 max-w-xl">{str(p, "description") || "Support contractors and distributors with export-ready metal panels, railings, and project documentation."}</motion.p>
                  <motion.div {...fu(3)} className="flex flex-wrap gap-4">
                    <Link href={str(p, "primaryCtaHref") || "/contact"} className="t03-btn-primary">{str(p, "primaryCtaLabel") || "Request Catalog"}<ArrowRight className="h-4 w-4" /></Link>
                    <Link href="/products" className="t03-btn-outline">View Products <ChevronRight className="h-4 w-4" /></Link>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "trust-signals") {
          const items = arr(p, "items").length ? arr(p, "items") : ["Project documentation support", "Surface finish customization", "Stable export packaging"];
          return (
            <section key="trust-signals" className="bg-[#1c1917] py-8">
              <div className="t03-wrap">
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
                  {items.map((item, i) => (
                    <motion.div key={i} {...fuv(i)} className="flex items-center gap-3">
                      <span className="text-[#b8936a]">{TRUST_ICONS[i % TRUST_ICONS.length]}</span>
                      <span className="text-white/80 text-sm font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "featured-categories") {
          const slugs = arr(p, "slugs");
          const featured = slugs.length ? categories.filter((c) => slugs.includes(c.slug)) : categories.slice(0, 4);
          if (!featured.length) return null;
          return (
            <section key="featured-categories" className="t03-sec bg-[#fafaf8]">
              <div className="t03-wrap">
                <motion.div {...fuv(0)} className="mb-16">
                  <span className="t03-tag">Product Range</span>
                  <h2 className="text-3xl md:text-4xl font-light mt-5 mb-4 tracking-tight">Material <span className="t03-gold font-normal">Collections</span></h2>
                  <p className="text-[#78716c] max-w-lg leading-relaxed">Architectural-grade metal products designed for project specifications and export compliance.</p>
                </motion.div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((cat, i) => (
                    <motion.div key={cat.slug} {...fuv(i)}>
                      <Link href={`/products/${cat.slug}`} className="block t03-card group h-full">
                        <div className="h-0.5 w-0 bg-gradient-to-r from-[#b8936a] to-[#d4af87] group-hover:w-full transition-all duration-500" />
                        <div className="p-8">
                          <div className="mb-5 w-10 h-10 rounded-full bg-[#f5f4f0] border border-[#e7e5e0] flex items-center justify-center"><Layers className="h-5 w-5 text-[#b8936a]" /></div>
                          <h3 className="text-lg font-semibold mb-2 tracking-tight">{cat.nameEn}</h3>
                          <p className="text-[#78716c] text-sm leading-relaxed mb-6 line-clamp-3">{cat.summaryEn}</p>
                          <span className="inline-flex items-center gap-2 text-[#b8936a] text-xs font-bold uppercase tracking-wider group-hover:gap-3 transition-all">Explore Range <ArrowRight className="h-3 w-3" /></span>
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

      <section className="t03-sec bg-[#f5f4f0] border-y border-[#e7e5e0]">
        <div className="t03-wrap">
          <motion.div {...fuv(0)} className="flex items-end justify-between mb-14">
            <div>
              <span className="t03-tag">Featured Products</span>
              <h2 className="text-3xl md:text-4xl font-light mt-5 tracking-tight">Project-Ready <span className="t03-gold">Materials</span></h2>
            </div>
            <Link href="/products" className="hidden md:inline-flex items-center gap-2 text-[#b8936a] text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all">Full Catalog <ArrowRight className="h-4 w-4" /></Link>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product, i) => (
              <motion.div key={product.slug} {...fuv(i)}>
                <Link href={`/products/${product.categorySlug}/${product.slug}`} className="block t03-card group h-full">
                  <div className="relative aspect-[4/3] bg-[#ede9e4] overflow-hidden">
                    {product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.coverImageAlt ?? product.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="absolute inset-0 flex items-center justify-center"><Building2 className="h-12 w-12 text-[#c8bfb4]" /></div>}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b8936a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-base mb-1 tracking-tight">{product.nameEn}</h3>
                    <p className="text-xs text-[#78716c] leading-relaxed line-clamp-2 mb-4">{product.shortDescriptionEn ?? ""}</p>
                    <span className="inline-flex items-center gap-1.5 text-[#b8936a] text-xs font-bold uppercase tracking-wider">View Specs <ChevronRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="t03-sec bg-[#fafaf8]">
        <div className="t03-wrap">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div {...fuv(0)}>
              <span className="t03-tag">Why Work With Us</span>
              <span className="t03-accent-bar mt-5 mb-5 block" />
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">Built for <span className="t03-gold">Project-Based</span> Supply</h2>
              <p className="text-[#78716c] leading-relaxed mb-8">We help buyers coordinate finish options, dimensions, and shipment schedules for construction projects — from small quantity samples to large-volume export orders.</p>
              <ul className="space-y-4">
                {[
                  "Custom finish: anodized, powder coated, mill finish",
                  "Cut-to-length and dimension consistency",
                  "Project documentation: CO, Test Reports, SGS",
                  "Sea freight packing and FOB Guangdong",
                  "Minimum order flexibility for project phases",
                  "Bilingual sales support for specification review",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#44403c]"><CheckCircle2 className="h-4 w-4 text-[#b8936a] mt-0.5 shrink-0" />{item}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fuv(1)}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { icon: <Building2 className="h-6 w-6" />, val: "500+", lbl: "Projects Supplied" },
                  { icon: <Globe className="h-6 w-6" />, val: "40+", lbl: "Countries" },
                  { icon: <Award className="h-6 w-6" />, val: "12+", lbl: "Certifications" },
                  { icon: <Ruler className="h-6 w-6" />, val: "200+", lbl: "Finish Options" },
                ].map((s, i) => (
                  <div key={i} className="t03-card p-6 text-center">
                    <div className="flex justify-center mb-3 text-[#b8936a]">{s.icon}</div>
                    <div className="text-3xl font-light text-[#1c1917] mb-1">{s.val}</div>
                    <div className="text-[.7rem] text-[#78716c] uppercase tracking-widest">{s.lbl}</div>
                  </div>
                ))}
              </div>
              <blockquote className="t03-card p-6 border-l-4 border-[#b8936a] rounded-none">
                <p className="text-[#44403c] text-sm leading-relaxed italic mb-3">&ldquo;Delivered exactly to our project specifications. The finish consistency across 2,000 panels was exceptional, and documentation was complete for customs.&rdquo;</p>
                <cite className="text-xs text-[#78716c] not-italic font-semibold uppercase tracking-wider">— Project Buyer, UAE</cite>
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="t03-sec-sm bg-[#1c1917]">
        <div className="t03-wrap">
          <motion.div {...fuv(0)} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 border border-[#b8936a]/30 text-[#b8936a] text-xs font-bold uppercase tracking-widest rounded-sm mb-5">Order Process</span>
            <h2 className="text-3xl font-light text-white tracking-tight">From Specification to <span className="text-[#b8936a]">Delivery</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2c2825]">
            {[
              { n: "01", t: "Share Specs", d: "Send drawings, finish requirements, quantities and project timeline." },
              { n: "02", t: "Quotation", d: "We confirm materials, pricing, sample availability, and delivery plan." },
              { n: "03", t: "Sample & Approve", d: "Physical finish samples dispatched for your approval before production." },
              { n: "04", t: "Production & Ship", d: "Full production run with QC inspection, packing, and export documents." },
            ].map((s, i) => (
              <motion.div key={s.n} {...fuv(i)} className="bg-[#1c1917] p-8">
                <div className="text-4xl font-light text-[#b8936a]/30 mb-4 leading-none">{s.n}</div>
                <h3 className="font-semibold text-white text-base mb-2">{s.t}</h3>
                <p className="text-[#a8a29e] text-sm leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {blogPosts.length > 0 && (
        <section className="t03-sec bg-[#fafaf8]">
          <div className="t03-wrap">
            <motion.div {...fuv(0)} className="flex items-end justify-between mb-14">
              <div>
                <span className="t03-tag">Insights</span>
                <h2 className="text-3xl font-light mt-5 tracking-tight">Material <span className="t03-gold">Knowledge</span></h2>
              </div>
              <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-[#b8936a] text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all">All Articles <ArrowRight className="h-4 w-4" /></Link>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map((post, i) => (
                <motion.div key={post.slug} {...fuv(i)}>
                  <Link href={`/blog/${post.slug}`} className="block t03-card group h-full p-8">
                    <span className="t03-accent-bar mb-5 block group-hover:w-[60px] transition-all duration-300" style={{ width: "40px" }} />
                    {post.categorySlug && <span className="text-xs font-bold uppercase tracking-widest text-[#b8936a] mb-3 block">{post.categorySlug.replace(/-/g, " ")}</span>}
                    <h3 className="font-semibold text-base leading-snug mb-3 group-hover:text-[#b8936a] transition-colors tracking-tight">{post.titleEn}</h3>
                    <p className="text-[#78716c] text-sm leading-relaxed line-clamp-2">{post.excerptEn ?? ""}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="t03-sec-sm bg-[#f5f4f0] border-t border-[#e7e5e0]">
        <div className="t03-wrap">
          <motion.div {...fuv(0)} className="max-w-2xl mx-auto text-center">
            <span className="t03-tag mb-6 inline-block">Project Enquiry</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Ready to discuss your project specifications?</h2>
            <p className="text-[#78716c] leading-relaxed mb-10">Share your architectural metalwork requirements — material, finish, quantity, and destination — and we&apos;ll prepare a detailed quotation within 24 hours.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="t03-btn-primary">Send Enquiry <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/request-quote" className="t03-btn-outline">Request Quote Form</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Box, ChevronRight, Package2, Scissors, Shirt } from "lucide-react";
import type { HomePageProps } from "@/templates/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const fv = (i: number) =>
  ({ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: i * 0.08, ease: EASE } }) as const;
const str = (p: Record<string, unknown>, k: string) => (typeof p[k] === "string" ? (p[k] as string) : "");
const arr = (p: Record<string, unknown>, k: string) => (Array.isArray(p[k]) ? (p[k] as string[]) : []);

export function Template10HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  return (
    <div className="t10 bg-[#f5f6ff] text-[#22223b] antialiased">
      <style>{`.t10-wrap{max-width:1200px;margin:0 auto;padding:0 24px}.t10-sec{padding:90px 0}.t10-tag{display:inline-block;padding:4px 12px;border:1px solid #cdcfff;border-radius:999px;color:#4f46e5;background:#eef0ff;font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.t10-card{background:#fff;border:1px solid #dcdefc;border-radius:10px;overflow:hidden;transition:all .2s}.t10-card:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(79,70,229,.12)}`}</style>
      {modules.map((m) => {
        const p = (m.payloadJson ?? {}) as Record<string, unknown>;
        if (m.moduleKey === "hero") return <section key="hero" className="t10-sec"><div className="t10-wrap"><motion.span {...fv(0)} className="t10-tag mb-6 inline-block">{str(p, "eyebrow") || "Textile & Packaging Supplier"}</motion.span><motion.h1 {...fv(1)} className="mb-5 max-w-3xl text-5xl font-black leading-[1.08] md:text-6xl">{str(p, "title") || "Flexible Textile and Packaging Solutions for Brands and Distributors"}</motion.h1><motion.p {...fv(2)} className="mb-10 max-w-2xl text-lg text-[#5d5f87]">{str(p, "description") || "From material sourcing to customized packaging production with reliable export fulfillment."}</motion.p><motion.div {...fv(3)} className="flex flex-wrap gap-4"><Link href={str(p, "primaryCtaHref") || "/contact"} className="inline-flex items-center gap-2 rounded bg-violet-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-violet-500">{str(p, "primaryCtaLabel") || "Request Samples"}<ArrowRight className="h-4 w-4" /></Link><Link href="/products" className="inline-flex items-center gap-2 rounded border border-violet-300 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-violet-700 hover:bg-violet-50">View Products<ChevronRight className="h-4 w-4" /></Link></motion.div></div></section>;
        if (m.moduleKey === "trust-signals") {
          const items = arr(p, "items").length ? arr(p, "items") : ["Fabric and paper material options", "Private label and custom sizing support", "Low-MOQ launch orders available"];
          return <section key="trust-signals" className="border-y border-[#dcdefc] bg-[#fbfbff] py-7"><div className="t10-wrap flex flex-wrap items-center justify-center gap-8 md:justify-between">{items.map((it, i) => <motion.div key={i} {...fv(i)} className="flex items-center gap-3 text-sm text-[#4e5074]"><span className="text-violet-600">{[<Shirt key="a" className="h-5 w-5" />, <Scissors key="b" className="h-5 w-5" />, <Package2 key="c" className="h-5 w-5" />][i % 3]}</span><span>{it}</span></motion.div>)}</div></section>;
        }
        if (m.moduleKey === "featured-categories") {
          const slugs = arr(p, "slugs");
          const featured = slugs.length ? categories.filter((c) => slugs.includes(c.slug)) : categories.slice(0, 4);
          if (!featured.length) return null;
          return <section key="featured-categories" className="t10-sec"><div className="t10-wrap"><motion.div {...fv(0)} className="mb-14"><span className="t10-tag">Product Categories</span><h2 className="mt-4 text-3xl font-black md:text-4xl">Textile & <span className="text-violet-700">Packaging Range</span></h2></motion.div><div className="grid gap-6 sm:grid-cols-2">{featured.map((c, i) => <motion.div key={c.slug} {...fv(i)}><Link href={`/products/${c.slug}`} className="t10-card block h-full p-7"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-violet-100 text-violet-700"><Box className="h-5 w-5" /></div><h3 className="mb-2 text-xl font-bold">{c.nameEn}</h3><p className="mb-5 text-sm text-[#5d5f87]">{c.summaryEn}</p><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">Explore <ArrowRight className="h-3.5 w-3.5" /></span></Link></motion.div>)}</div></div></section>;
        }
        return null;
      })}
      {products.length > 0 && <section className="t10-sec border-y border-[#dcdefc] bg-[#fbfbff]"><div className="t10-wrap"><motion.div {...fv(0)} className="mb-12"><span className="t10-tag">Featured Products</span><h2 className="mt-4 text-3xl font-black md:text-4xl">Best Seller SKUs</h2></motion.div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, 6).map((p, i) => <motion.div key={p.slug} {...fv(i)}><Link href={`/products/${p.categorySlug}/${p.slug}`} className="t10-card block h-full"><div className="relative aspect-[4/3] bg-[#eceeff]">{p.coverImageUrl ? <img src={p.coverImageUrl} alt={p.coverImageAlt ?? p.nameEn} className="h-full w-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-violet-300"><Package2 className="h-12 w-12" /></div>}</div><div className="p-5"><h3 className="mb-1 text-base font-bold">{p.nameEn}</h3><p className="mb-4 line-clamp-2 text-xs text-[#5d5f87]">{p.shortDescriptionEn ?? ""}</p><span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-700">Details<ChevronRight className="h-3.5 w-3.5" /></span></div></Link></motion.div>)}</div></div></section>}
      {blogPosts.length > 0 && <section className="t10-sec"><div className="t10-wrap"><motion.div {...fv(0)} className="mb-12"><span className="t10-tag">Insights</span><h2 className="mt-4 text-3xl font-black md:text-4xl">Sourcing Articles</h2></motion.div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{blogPosts.slice(0, 3).map((b, i) => <motion.div key={b.slug} {...fv(i)} className="t10-card p-7"><Link href={`/blog/${b.slug}`}><h3 className="mb-2 text-base font-semibold">{b.titleEn}</h3><p className="line-clamp-2 text-sm text-[#5d5f87]">{b.excerptEn ?? ""}</p></Link></motion.div>)}</div></div></section>}
    </div>
  );
}

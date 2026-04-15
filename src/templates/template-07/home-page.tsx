"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Factory, Lightbulb, Sun, Zap } from "lucide-react";

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
const fv = (i: number) =>
  ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE },
  }) as const;

export function Template07HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  return (
    <div className="t07 bg-[#0f0d09] text-white antialiased">
      <style>{`
        .t07 { --ac:#f59e0b; --sf:#1a1510; --bd:#3b2f1d; --tx:#b8a994; }
        .t07-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }
        .t07-sec { padding:92px 0; }
        .t07-sec-sm { padding:62px 0; }
        .t07-tag { display:inline-block; padding:4px 12px; border:1px solid rgba(245,158,11,.45); border-radius:999px; color:#fcd34d;
          background:rgba(245,158,11,.12); font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; }
        .t07-card { background:var(--sf); border:1px solid var(--bd); border-radius:10px; overflow:hidden; transition:transform .2s, border-color .2s; }
        .t07-card:hover { transform:translateY(-4px); border-color:#f59e0b; }
      `}</style>

      {modules.map((module) => {
        const p = module.payloadJson as Record<string, unknown>;
        if (module.moduleKey === "hero") {
          return (
            <section key="hero" className="relative overflow-hidden">
              <div className="t07-wrap py-28">
                <motion.span {...fv(0)} className="t07-tag mb-6 inline-block">{str(p, "eyebrow") || "Lighting Manufacturer"}</motion.span>
                <motion.h1 {...fv(1)} className="mb-5 max-w-3xl text-5xl font-black leading-[1.08] tracking-tight md:text-6xl">
                  {str(p, "title") || "Professional Lighting Solutions for Retail, Office, and Industrial Spaces"}
                </motion.h1>
                <motion.p {...fv(2)} className="mb-10 max-w-2xl text-lg text-[#b8a994]">
                  {str(p, "description") || "High-efficiency fixtures with OEM support and project-ready export delivery."}
                </motion.p>
                <motion.div {...fv(3)} className="flex flex-wrap gap-4">
                  <Link href={str(p, "primaryCtaHref") || "/contact"} className="inline-flex items-center gap-2 rounded bg-amber-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#1f1405] hover:bg-amber-400">
                    {str(p, "primaryCtaLabel") || "Request Catalog"} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/products" className="inline-flex items-center gap-2 rounded border border-amber-500/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-amber-200 hover:border-amber-400">
                    View Products <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </section>
          );
        }
        if (module.moduleKey === "trust-signals") {
          const items = arr(p, "items").length
            ? arr(p, "items")
            : ["Photometric test reports", "Stable LED driver supply", "Project packaging support"];
          return (
            <section key="trust-signals" className="border-y border-[#3b2f1d] bg-[#15110d] py-7">
              <div className="t07-wrap flex flex-wrap items-center justify-center gap-8 md:justify-between">
                {items.map((item, i) => (
                  <motion.div key={i} {...fv(i)} className="flex items-center gap-3 text-sm text-amber-100">
                    <span className="text-amber-300">{[<Lightbulb key="a" className="h-5 w-5" />, <Sun key="b" className="h-5 w-5" />, <Zap key="c" className="h-5 w-5" />][i % 3]}</span>
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
            <section key="featured-categories" className="t07-sec">
              <div className="t07-wrap">
                <motion.div {...fv(0)} className="mb-14">
                  <span className="t07-tag">Lighting Categories</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                    Product <span className="text-amber-300">Collections</span>
                  </h2>
                </motion.div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {featured.map((cat, i) => (
                    <motion.div key={cat.slug} {...fv(i)}>
                      <Link href={`/products/${cat.slug}`} className="t07-card block h-full p-7">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-amber-500/15 text-amber-300">
                          <Lightbulb className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold">{cat.nameEn}</h3>
                        <p className="mb-5 text-sm text-[#b8a994]">{cat.summaryEn}</p>
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                          Explore <ArrowRight className="h-3.5 w-3.5" />
                        </span>
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
        <section className="t07-sec border-y border-[#3b2f1d] bg-[#15110d]">
          <div className="t07-wrap">
            <motion.div {...fv(0)} className="mb-12">
              <span className="t07-tag">Featured Products</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Lighting Fixtures</h2>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product, i) => (
                <motion.div key={product.slug} {...fv(i)}>
                  <Link href={`/products/${product.categorySlug}/${product.slug}`} className="t07-card block h-full">
                    <div className="relative aspect-[4/3] bg-[#2a2218]">
                      {product.coverImageUrl ? (
                        <img src={product.coverImageUrl} alt={product.coverImageAlt ?? product.nameEn} className="h-full w-full object-cover opacity-90" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-amber-700">
                          <Factory className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="mb-1 text-base font-bold">{product.nameEn}</h3>
                      <p className="mb-4 line-clamp-2 text-xs text-[#b8a994]">{product.shortDescriptionEn ?? ""}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                        Details <ChevronRight className="h-3.5 w-3.5" />
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
        <section className="t07-sec">
          <div className="t07-wrap">
            <motion.div {...fv(0)} className="mb-12">
              <span className="t07-tag">Insights</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Lighting Design Notes</h2>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post, i) => (
                <motion.div key={post.slug} {...fv(i)} className="t07-card p-7">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="mb-2 text-base font-semibold">{post.titleEn}</h3>
                    <p className="line-clamp-2 text-sm text-[#b8a994]">{post.excerptEn ?? ""}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="t07-sec-sm bg-amber-500">
        <div className="t07-wrap text-center text-[#1f1405]">
          <motion.div {...fv(0)} className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-black md:text-4xl">Need a project lighting proposal?</h2>
            <p className="mb-8 text-amber-900">Share application, target lux level, and certification requirements. We will send recommended fixture options.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded bg-[#1f1405] px-8 py-3.5 text-sm font-black uppercase tracking-wider text-amber-100">
              Contact Team <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

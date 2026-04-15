"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Factory,
  Home,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sofa,
  Sparkles,
  Sun,
  Truck,
} from "lucide-react";

import type { HomePageProps } from "@/templates/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const fv = (i: number) =>
  ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE },
  }) as const;
const str = (payload: Record<string, unknown>, key: string) =>
  typeof payload[key] === "string" ? (payload[key] as string) : "";
const arr = (payload: Record<string, unknown>, key: string) =>
  Array.isArray(payload[key]) ? (payload[key] as string[]) : [];

export function Template09HomePage({ modules, products, categories, blogPosts }: HomePageProps) {
  return (
    <div className="t09 bg-[#fffaf2] text-[#2a2016] antialiased">
      <style>{`.t09-wrap{max-width:1200px;margin:0 auto;padding:0 24px}.t09-sec{padding:90px 0}.t09-tag{display:inline-block;padding:4px 12px;border:1px solid #e6d2ba;border-radius:999px;color:#7c5a3a;background:#fff3e3;font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.t09-card{background:#fff;border:1px solid #ecdfcf;border-radius:10px;overflow:hidden;transition:all .2s}.t09-card:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(66,48,30,.12)}`}</style>

      {modules.map((module) => {
        const payload = (module.payloadJson ?? {}) as Record<string, unknown>;

        if (module.moduleKey === "hero") {
          return (
            <section key="hero" className="t09-sec">
              <div className="t09-wrap">
                <motion.span {...fv(0)} className="t09-tag mb-6 inline-block">
                  {str(payload, "eyebrow") || "Outdoor Furniture Exporter"}
                </motion.span>
                <motion.h1
                  {...fv(1)}
                  className="mb-5 max-w-3xl text-5xl font-black leading-[1.08] md:text-6xl"
                >
                  {str(payload, "title") ||
                    "Stylish Indoor and Outdoor Furniture for Retail and Project Buyers"}
                </motion.h1>
                <motion.p {...fv(2)} className="mb-10 max-w-2xl text-lg text-[#6b5d4d]">
                  {str(payload, "description") ||
                    "Factory-direct supply with material options, packaging customization, and global shipping support."}
                </motion.p>
                <motion.div {...fv(3)} className="flex flex-wrap gap-4">
                  <Link
                    href={str(payload, "primaryCtaHref") || "/contact"}
                    className="inline-flex items-center gap-2 rounded bg-[#2a2016] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#f5e8d8] hover:bg-[#3a2b1c]"
                  >
                    {str(payload, "primaryCtaLabel") || "Request Catalog"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded border border-[#bda183] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#7c5a3a] hover:bg-[#fff3e3]"
                  >
                    View Products
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "trust-signals") {
          const items = arr(payload, "items").length
            ? arr(payload, "items")
            : [
                "Material and finish customization",
                "Drop test packaging support",
                "Project and wholesale order handling",
              ];
          const icons = [
            <Sofa key="sofa" className="h-5 w-5" />,
            <Leaf key="leaf" className="h-5 w-5" />,
            <Sun key="sun" className="h-5 w-5" />,
          ];

          return (
            <section key="trust-signals" className="border-y border-[#ecdfcf] bg-[#fffdf8] py-7">
              <div className="t09-wrap flex flex-wrap items-center justify-center gap-8 md:justify-between">
                {items.map((item, index) => (
                  <motion.div
                    key={item}
                    {...fv(index)}
                    className="flex items-center gap-3 text-sm text-[#5c4d3d]"
                  >
                    <span className="text-[#9b7b57]">{icons[index % icons.length]}</span>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        }

        if (module.moduleKey === "featured-categories") {
          const slugs = arr(payload, "slugs");
          const featured = slugs.length
            ? categories.filter((category) => slugs.includes(category.slug))
            : categories.slice(0, 4);

          if (!featured.length) return null;

          return (
            <section key="featured-categories" className="t09-sec">
              <div className="t09-wrap">
                <motion.div {...fv(0)} className="mb-14">
                  <span className="t09-tag">Collections</span>
                  <h2 className="mt-4 text-3xl font-black md:text-4xl">
                    Furniture <span className="text-[#9b7b57]">Categories</span>
                  </h2>
                </motion.div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {featured.map((category, index) => (
                    <motion.div key={category.slug} {...fv(index)}>
                      <Link href={`/products/${category.slug}`} className="t09-card block h-full p-7">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-[#f7efe4] text-[#9b7b57]">
                          <Home className="h-5 w-5" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold">{category.nameEn}</h3>
                        <p className="mb-5 text-sm text-[#6b5d4d]">{category.summaryEn}</p>
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9b7b57]">
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

        if (module.moduleKey === "factory-capability") {
          const stats = [
            { icon: <Factory className="h-6 w-6" />, value: "10,000 sqm", label: "Workshop Area" },
            { icon: <Sparkles className="h-6 w-6" />, value: "70+", label: "Skilled Staff" },
            { icon: <Truck className="h-6 w-6" />, value: "35+", label: "Export Markets" },
            { icon: <ShieldCheck className="h-6 w-6" />, value: "20-40d", label: "Lead Time" },
          ];

          return (
            <section key="factory-capability" className="t09-sec border-y border-[#ecdfcf] bg-[#fffdf8]">
              <div className="t09-wrap">
                <div className="grid gap-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
                  <motion.div {...fv(0)}>
                    <span className="t09-tag">Factory Capability</span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                      Made for Seasonal and Project Orders
                    </h2>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-[#6b5d4d]">
                      We coordinate material sourcing, upholstery, packaging, and shipping schedules
                      for retail and contract buyers.
                    </p>
                    <ul className="mt-8 space-y-3">
                      {[
                        "Frame and upholstery customization",
                        "Outdoor-grade material options",
                        "Packaging tests for long-distance shipping",
                        "Assembly and container loading support",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-[#4f4031]">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9b7b57]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div {...fv(1)} className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="t09-card p-6">
                        <div className="text-[#9b7b57]">{stat.icon}</div>
                        <div className="mt-3 text-2xl font-black">{stat.value}</div>
                        <div className="mt-1 text-xs uppercase tracking-widest text-[#8f7963]">
                          {stat.label}
                        </div>
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
            <section key="quality-certifications" className="t09-sec">
              <div className="t09-wrap">
                <motion.div {...fv(0)} className="mb-10">
                  <span className="t09-tag">Quality & Compliance</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                    Packaging and Quality Controls
                  </h2>
                </motion.div>
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    "Material traceability",
                    "Drop test and carton durability checks",
                    "Sustainable material options",
                  ].map((item, index) => (
                    <motion.div key={item} {...fv(index)} className="t09-card p-6">
                      <PackageCheck className="h-6 w-6 text-[#9b7b57]" />
                      <h3 className="mt-4 text-base font-bold">{item}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#6b5d4d]">
                        Practical controls that protect product appearance and reduce shipping damage.
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (module.moduleKey === "process-steps") {
          const items = arr(payload, "items").length
            ? arr(payload, "items")
            : [
                "Style review",
                "Sampling and material approval",
                "Production and packing",
                "Shipment and after-sales support",
              ];

          return (
            <section key="process-steps" className="t09-sec border-y border-[#ecdfcf] bg-[#fffdf8]">
              <div className="t09-wrap">
                <motion.div {...fv(0)} className="mb-12 text-center">
                  <span className="t09-tag">Delivery Process</span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                    From Concept to Shipment
                  </h2>
                </motion.div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((step, index) => (
                    <motion.div key={step} {...fv(index)} className="t09-card p-6">
                      <div className="mb-3 text-3xl font-black text-[#9b7b57]/40">
                        {`0${index + 1}`}
                      </div>
                      <p className="text-sm text-[#4f4031]">{step}</p>
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
        <section className="t09-sec border-y border-[#ecdfcf] bg-[#fffdf8]">
          <div className="t09-wrap">
            <motion.div {...fv(0)} className="mb-12">
              <span className="t09-tag">Featured Products</span>
              <h2 className="mt-4 text-3xl font-black md:text-4xl">Best-Selling Ranges</h2>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product, index) => (
                <motion.div key={product.slug} {...fv(index)}>
                  <Link
                    href={`/products/${product.categorySlug}/${product.slug}`}
                    className="t09-card block h-full"
                  >
                    <div className="relative aspect-[4/3] bg-[#f1e5d6]">
                      {product.coverImageUrl ? (
                        <img
                          src={product.coverImageUrl}
                          alt={product.coverImageAlt ?? product.nameEn}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[#b89b7f]">
                          <Sofa className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="mb-1 text-base font-bold">{product.nameEn}</h3>
                      <p className="mb-4 line-clamp-2 text-xs text-[#6b5d4d]">
                        {product.shortDescriptionEn ?? ""}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9b7b57]">
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
        <section className="t09-sec">
          <div className="t09-wrap">
            <motion.div {...fv(0)} className="mb-12">
              <span className="t09-tag">Insights</span>
              <h2 className="mt-4 text-3xl font-black md:text-4xl">Sourcing Guides</h2>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.slice(0, 3).map((post, index) => (
                <motion.div key={post.slug} {...fv(index)} className="t09-card p-7">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="mb-2 text-base font-semibold">{post.titleEn}</h3>
                    <p className="line-clamp-2 text-sm text-[#6b5d4d]">{post.excerptEn ?? ""}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="t09-sec bg-gradient-to-r from-[#7c5a3a] to-[#a77b54]">
        <div className="t09-wrap text-center">
          <motion.div {...fv(0)} className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
              Need furniture for a new collection or project?
            </h2>
            <p className="mb-8 text-[#fff3e3]">
              Send your target style, materials, and order volume and we&apos;ll prepare a
              practical sourcing plan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded bg-white px-8 py-3.5 text-sm font-black uppercase tracking-wider text-[#7c5a3a]"
              >
                Send Requirements <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/request-quote"
                className="inline-flex items-center gap-2 rounded border border-white/50 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white"
              >
                Request Quote Form
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

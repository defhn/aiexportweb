"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

type CategoryGridProps = {
  items: Array<{
    slug: string;
    nameEn: string;
    summaryEn: string;
    imageUrl?: string | null;
    imageAlt?: string | null;
  }>;
  accentColor?: string;
  badgeLabel?: string;
  linkLabel?: string;
  fallbackImage?: string;
};

export function CategoryGrid({
  items,
  accentColor = "#2563eb",
  badgeLabel = "Product Solution",
  linkLabel = "Explore Collection",
  fallbackImage = "/images/export_packaging_shipping_1775635539838.png",
}: CategoryGridProps) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((category, index) => {
        const bgImage = category.imageUrl || fallbackImage;

        return (
          <motion.article
            key={category.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            viewport={{ once: true }}
            style={{ 
              backgroundColor: "#0c0a09" // Stone-950 equivalent for dark cards
            }}
            className="group relative flex h-[420px] flex-col overflow-hidden rounded-[2rem] border border-stone-800 transition-all hover:shadow-2xl"
          >
             {/* Dynamic hover shadow using accent color */}
            <div 
              className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${accentColor}25, transparent 70%)` }}
            />

            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={bgImage}
                alt={category.imageAlt || category.nameEn}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent opacity-95" />

            <div className="relative flex h-full flex-col justify-end p-7">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm" style={{ backgroundColor: `${accentColor}22`, borderColor: `${accentColor}55`, color: accentColor }}>
                  {badgeLabel}
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  {category.nameEn}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-300">
                  {category.summaryEn}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <Link
                  href={`/products/${category.slug}`}
                  className="flex items-center gap-2 text-sm font-semibold text-white transition-colors"
                >
                  <span className="transition-colors group-hover:opacity-80" style={{ color: accentColor }}>{linkLabel}</span>
                  <div 
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-all group-hover:scale-110"
                    style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

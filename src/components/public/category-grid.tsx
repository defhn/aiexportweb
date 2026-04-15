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

function getCategoryImage(slug: string, name: string, fallbackImage: string) {
  const lower = slug.toLowerCase() + name.toLowerCase();
  if (lower.includes("aluminum")) return "/images/aluminum_machining_parts_1775636011369.png";
  if (lower.includes("stainless")) return "/images/stainless_steel_components_1775636038441.png";
  if (lower.includes("turn")) return "/images/precision_turning_parts_1775636067122.png";
  return fallbackImage;
}

export function CategoryGrid({
  items,
  accentColor = "#2563eb",
  badgeLabel = "Product Solution",
  linkLabel = "Explore Collection",
  fallbackImage = "/images/export_packaging_shipping_1775635539838.png",
}: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-7xl mx-auto">
      {items.map((category, index) => {
        const bgImage = category.imageUrl || getCategoryImage(category.slug, category.nameEn, fallbackImage);
        
        return (
          <motion.article
            key={category.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-stone-900 border border-stone-800 transition-all hover:shadow-2xl hover:shadow-blue-500/20 h-[450px]"
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={bgImage}
                  alt={category.imageAlt || category.nameEn}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
                />
            </div>
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-90" />

            {/* Content overlay */}
            <div className="relative h-full w-full p-8 flex flex-col justify-end">
              <div>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border backdrop-blur-sm" style={{ backgroundColor: accentColor + "22", borderColor: accentColor + "55", color: accentColor }}>
                  {badgeLabel}
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white transition-colors" style={{ color: "#fff" }}>
                  {category.nameEn}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-300">
                  {category.summaryEn}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  href={`/products/${category.slug}`}
                  className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-blue-400 transition-colors"
                >
                  {linkLabel}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-blue-600">
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

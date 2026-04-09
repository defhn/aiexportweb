"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type ProductCardProps = {
  categorySlug: string;
  slug: string;
  nameEn: string;
  shortDescriptionEn: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export function ProductCard({
  categorySlug,
  slug,
  nameEn,
  shortDescriptionEn,
  imageUrl,
  imageAlt,
}: ProductCardProps) {
  const href = `/products/${categorySlug}/${slug}`;

  return (
    <motion.article whileHover={{ y: -6 }} className="group">
      <Link href={href} className="block h-full" aria-label={`View ${nameEn}`}>
        {/* Image â€?full-bleed, fixed aspect ratio */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100">
          {imageUrl ? (
            <img
              alt={imageAlt || nameEn}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              src={imageUrl}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-100">
              <div className="h-10 w-10 rounded-xl border-2 border-dashed border-stone-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">
                No Image
              </span>
            </div>
          )}

          {/* Hover overlay with quick-view icon */}
          <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-4">
            <span className="flex items-center justify-center h-9 w-9 rounded-full bg-white/90 text-stone-900 shadow-lg ring-1 ring-black/5">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Text content */}
        <div className="mt-4 px-1">
          <h3 className="text-base font-bold tracking-tight text-stone-900 group-hover:text-blue-600 transition-colors leading-snug">
            {nameEn}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-500">
            {shortDescriptionEn}
          </p>
          <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-stone-400 group-hover:text-blue-600 transition-colors flex items-center gap-1">
            View Specs
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

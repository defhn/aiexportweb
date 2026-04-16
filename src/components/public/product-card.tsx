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
  accentColor?: string;
  linkLabel?: string;
};

export function ProductCard({
  categorySlug,
  slug,
  nameEn,
  shortDescriptionEn,
  imageUrl,
  imageAlt,
  accentColor = "#2563eb",
  linkLabel = "View Details",
}: ProductCardProps) {
  const href = `/products/${categorySlug}/${slug}`;

  return (
    <motion.article whileHover={{ y: -4 }} className="group">
      <Link href={href} className="block h-full" aria-label={`View ${nameEn}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-stone-100 ring-1 ring-stone-200/70">
          {imageUrl ? (
            <img
              alt={imageAlt || nameEn}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              src={imageUrl}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-50">
              <div className="h-10 w-10 rounded-xl border border-dashed border-stone-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">No Image</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-stone-900 shadow-lg ring-1 ring-black/5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 px-1">
          <h3 className="text-base font-semibold tracking-tight text-stone-900 transition-colors leading-snug">
            {nameEn}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-500">
            {shortDescriptionEn}
          </p>
          <p className="mt-3 flex items-center gap-1 text-xs font-black uppercase tracking-[0.2em] transition-colors" style={{ color: accentColor }}>
            {linkLabel}
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <motion.article 
      whileHover={{ y: -8 }}
      className="group relative flex flex-col items-center p-8 text-center"
    >
      <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-[2.5rem] bg-stone-100 flex items-center justify-center p-12 transition-all group-hover:bg-blue-50/50">
        {imageUrl ? (
          <img
            alt={imageAlt || nameEn}
            className="h-full w-full rounded-2xl object-cover"
            loading="lazy"
            src={imageUrl}
          />
        ) : (
          <div className="h-full w-full rounded-2xl border-2 border-dashed border-stone-300 opacity-40 flex items-center justify-center">
            <span className="text-stone-300 font-bold uppercase tracking-widest text-[10px]">Product Media</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-blue-600 transition-colors">
          {nameEn}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500 max-w-xs mx-auto">
          {shortDescriptionEn}
        </p>
      </div>

      <Link
        href={`/products/${categorySlug}/${slug}`}
        className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-stone-400 transition-all group-hover:text-blue-600"
      >
        View Specs
        <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
      </Link>
    </motion.article>
  );
}

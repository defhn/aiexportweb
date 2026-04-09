"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[95vh] min-h-[700px] w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center font-sans perspective-1000"
    >
      {/* Parallax Background Layer */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0 origin-center"
      >
        <Image
          src="/hero-bg.png"
          alt="Industrial Precision Background"
          fill
          sizes="100vw"
          className="object-cover opacity-55 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/20" />
        
        {/* Animated Glowing Orbs representing precision/tech */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/30 blur-[130px] mix-blend-screen"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-[15%] w-[800px] h-[800px] rounded-full bg-indigo-500/20 blur-[150px] mix-blend-screen"
        />
        
        <div className="absolute inset-0 texture-carbon opacity-10 mix-blend-overlay" />
      </motion.div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl px-6 pt-20">
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-5 backdrop-blur-md mb-8"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              NEW
            </span>
            <span className="text-sm font-semibold tracking-wide text-white/90">
              {eyebrow}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            aria-label={title}
            className="max-w-5xl text-5xl font-extrabold tracking-tighter text-white sm:text-6xl md:text-8xl leading-[1.05]"
          >
            {(() => {
              const t = title || "Precision Parts, Built for Global Buyers";
              const words = t.split(" ");
              const half = Math.ceil(words.length / 2);
              return (
                <>
                  <span>{words.slice(0, half).join(" ")} </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    {words.slice(half).join(" ")}
                  </span>
                </>
              );
            })()}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-8 max-w-2xl text-lg md:text-xl font-medium text-stone-300/80 leading-relaxed"
          >
            {description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
          >
            <Link
              href={primaryCtaHref}
              className="group relative flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-base font-bold text-[#0a0a0a] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
            >
              <span>{primaryCtaLabel}</span>
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-[#0a0a0a] text-white transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>

            {secondaryCtaLabel && secondaryCtaHref && (
              <Link
                href={secondaryCtaHref}
                className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-lg transition-all hover:border-white/20"
              >
                <Play className="h-4 w-4 text-blue-400 group-hover:text-blue-300" fill="currentColor" />
                <span>{secondaryCtaLabel}</span>
              </Link>
            )}
          </motion.div>
          
        </div>
      </div>

      {/* Decorative Floor Glow targeting Strengths Section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20" />
    </section>
  );
}

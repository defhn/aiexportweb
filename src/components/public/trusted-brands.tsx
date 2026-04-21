"use client";

import { motion } from "framer-motion";

const defaultBrands = [
  "Siemens",
  "General Electric",
  "Boeing",
  "Airbus",
  "Tesla",
  "SpaceX",
  "Medtronic",
  "Honeywell",
];

type TrustedBrandsProps = {
  title?: string;
  brands?: string[];
  surface?: string;
};

export function TrustedBrands({
  title = "Trusted by Industry Leaders Worldwide",
  brands = defaultBrands,
  surface = "#ffffff",
}: TrustedBrandsProps) {
  const items = brands.length ? brands : defaultBrands;

  const isDark = surface !== "#ffffff" && surface !== "#fffaf2" && surface !== "#f5f6ff" && surface !== "#fffaf4";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "";

  return (
    <section className="relative z-20 overflow-hidden border-y py-10" style={{ backgroundColor: surface, borderColor: isDark ? "rgba(255,255,255,0.06)" : "#f5f5f4" }}>
      <div className="mx-auto mb-6 max-w-7xl px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest" style={{ color: textMuted || "#a8a29e" }}>
          {title}
        </p>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute left-0 z-10 h-full w-32" style={{ background: `linear-gradient(to right, ${surface}, transparent)` }} />
        <div className="pointer-events-none absolute right-0 z-10 h-full w-32" style={{ background: `linear-gradient(to left, ${surface}, transparent)` }} />

        <div className="flex w-[200vw] sm:w-max">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex w-max items-center justify-around gap-16 px-8 sm:gap-24"
          >
            {[...items, ...items].map((brand, index) => (
              <div
                key={`${brand}-${index}`}
                className="flex cursor-default items-center justify-center opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              >
                <span className="select-none text-2xl font-black tracking-tighter text-stone-500 drop-shadow-sm hover:text-stone-900">
                  {brand.toUpperCase()}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

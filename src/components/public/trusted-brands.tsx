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
};

export function TrustedBrands({
  title = "Trusted by Industry Leaders Worldwide",
  brands = defaultBrands,
}: TrustedBrandsProps) {
  const items = brands.length ? brands : defaultBrands;

  return (
    <section className="relative z-20 overflow-hidden border-y border-stone-100 bg-white py-10">
      <div className="mx-auto mb-6 max-w-7xl px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-stone-400">
          {title}
        </p>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute left-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent" />

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

"use client";

import { ShieldCheck, Zap, Globe, Cpu, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

type StrengthsSectionProps = {
  items: string[];
  cardBg?: string;
  cardBorder?: string;
};

const imageMap: Record<string, string> = {
  quality: "/images/precision_quality_inspection_1775635476602.png",
  speed: "/images/cnc_turning_machine_1775635506691.png",
  global: "/images/export_packaging_shipping_1775635539838.png",
  tech: "/images/cnc_machining_center_1775635445683.png",
  default: "/images/export_packaging_shipping_1775635539838.png",
};

const iconMap: Record<string, any> = {
  quality: ShieldCheck,
  speed: Zap,
  global: Globe,
  tech: Cpu,
  default: CheckCircle2,
};

function getMapping(text: string) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("quality") || lowerText.includes("iso")) return { icon: iconMap.quality, image: imageMap.quality };
  if (lowerText.includes("rapid") || lowerText.includes("speed") || lowerText.includes("days")) return { icon: iconMap.speed, image: imageMap.speed };
  if (lowerText.includes("export") || lowerText.includes("global") || lowerText.includes("documentation")) return { icon: iconMap.global, image: imageMap.global };
  if (lowerText.includes("aluminum") || lowerText.includes("mixed production") || lowerText.includes("tech")) return { icon: iconMap.tech, image: imageMap.tech };
  return { icon: iconMap.default, image: imageMap.default };
}

export function StrengthsSection({ items, cardBg = "#ffffff", cardBorder = "#e7e5e4" }: StrengthsSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 relative z-30">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const { icon: Icon, image } = getMapping(item);
          const title = item.split(" - ")[0] || item;
          const desc = item.split(" - ")[1] || "Industry-leading manufacturing standard and export compliance.";
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              key={index}
              className="group relative flex flex-col rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)] border"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              {/* Image half */}
              <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                <Image 
                  src={image}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-xl">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              
              {/* Text half */}
              <div className="flex-1 p-6 flex flex-col" style={{ backgroundColor: cardBg }}>
                <h3 className="text-xl font-bold text-stone-900 transition-colors leading-tight mb-3 group-hover:text-blue-600">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-500 font-medium">
                  {desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

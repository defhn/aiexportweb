import Image from "next/image";
import { Check } from "lucide-react";

const defaultFeatures = [
  "5-Axis CNC Machining Centers",
  "Automated Robotic Assembly Arms",
  "ISO Class 8 Cleanrooms",
  "Hexagon CMM Inspection Systems",
  "High-Tonnage Injection Molding",
  "ERP Integrated Smart Factory",
];

type FactoryEquipmentProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  features?: string[];
  statOneValue?: string;
  statOneLabel?: string;
  statTwoValue?: string;
  statTwoLabel?: string;
};

export function FactoryEquipment({
  eyebrow = "World-Class Facility",
  title = "Engineered for Scale. Built for Precision.",
  description = "Our facility is equipped for rapid prototyping, stable export production, and disciplined quality control across every batch.",
  features = defaultFeatures,
  statOneValue = "100k+",
  statOneLabel = "Sq Ft Facility",
  statTwoValue = "150+",
  statTwoLabel = "Advanced Machines",
}: FactoryEquipmentProps) {
  const featureItems = features.length ? features : defaultFeatures;

  return (
    <section className="overflow-hidden bg-stone-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-sm font-black uppercase tracking-[0.4em] text-blue-600">
              {eyebrow}
            </h2>
            <h3 className="text-4xl font-bold tracking-tight text-stone-900 md:text-5xl md:leading-[1.1]">
              {title}
            </h3>
            <p className="mt-6 text-lg leading-relaxed text-stone-600">{description}</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {featureItems.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-stone-800">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-4xl font-black text-blue-600">{statOneValue}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-stone-400">
                  {statOneLabel}
                </p>
              </div>
              <div className="h-12 w-px bg-stone-200" />
              <div>
                <p className="text-4xl font-black text-blue-600">{statTwoValue}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-stone-400">
                  {statTwoLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-1/2 h-[120%] w-full -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-[100px] bg-blue-100 opacity-50 blur-3xl" />

            <div className="relative grid h-[500px] grid-cols-2 gap-4 md:h-[600px]">
              <div className="relative mb-0 mt-12 overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/images/cnc_machining_center_1775635445683.png"
                  alt="5-Axis CNC Machining Center"
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative mb-12 mt-0 overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/images/precision_quality_inspection_1775635476602.png"
                  alt="Precision engineering inspection"
                  fill
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute left-1/2 top-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-8 border-stone-50 bg-white shadow-xl">
                <div className="text-center">
                  <p className="text-2xl font-black leading-none text-stone-900">
                    24<span className="text-blue-600">/</span>7
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    Running
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

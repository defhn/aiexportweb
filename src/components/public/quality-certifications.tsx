import { Activity, Award, FileWarning, Shield } from "lucide-react";
import Image from "next/image";

const defaultCerts = [
  {
    icon: Shield,
    title: "ISO 9001:2015",
    description: "Certified quality management system for consistent excellence.",
    image: "/images/iso_9001_cert_1775636090178.png",
  },
  {
    icon: Activity,
    title: "AS9100D",
    description: "Meeting rigorous standards for aviation, space, and defense.",
    image: "/images/as9100d_aerospace_1775636135305.png",
  },
  {
    icon: Award,
    title: "SGS Verified",
    description: "Factory audited and verified onsite by SGS Group.",
    image: "/images/precision_quality_inspection_1775635476602.png",
  },
  {
    icon: FileWarning,
    title: "RoHS Compliant",
    description: "Strict adherence to hazardous material restrictions.",
    image: "/images/export_packaging_shipping_1775635539838.png",
  },
];

type QualityCertificationsProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: string[];
  theme?: { surface?: string; surfaceAlt?: string; border?: string; accent?: string };
};

export function QualityCertifications({
  eyebrow = "Uncompromising Quality",
  title = "Export-Ready Compliance",
  description = "We reduce supply-chain risk by keeping certification, inspection, and documentation standards visible from the first inquiry.",
  items = [],
  theme,
}: QualityCertificationsProps) {
  const surface = theme?.surface ?? "#ffffff";
  const border = theme?.border ?? "#e7e5e4";
  const accent = theme?.accent ?? "#2563eb";
  // Determine if dark or light based on surface color
  const isDark = surface !== "#ffffff" && surface !== "#fffaf2" && surface !== "#f5f6ff" && surface !== "#fffaf4";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "#ffffff";
  const titleColor = isDark ? "#ffffff" : "#0c0a09";
  const textColor = isDark ? "rgba(255,255,255,0.6)" : "#78716c";
  const eyebrowHex = accent;
  const certs = defaultCerts.map((cert, index) => {
    const override = items[index];

    if (!override) {
      return cert;
    }

    const [itemTitle, itemDescription] = override.split("|").map((value) => value.trim());

    return {
      ...cert,
      title: itemTitle || cert.title,
      description: itemDescription || cert.description,
    };
  });

  return (
    <section className="relative py-24" style={{ backgroundColor: surface }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-sm font-black uppercase tracking-[0.4em]" style={{ color: eyebrowHex }}>
            {eyebrow}
          </h2>
          <h3 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl" style={{ color: titleColor }}>
            {title}
          </h3>
          <p className="mt-4 text-lg" style={{ color: textColor }}>{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {certs.map((cert, index) => {
            const Icon = cert.icon;

            return (
              <div
                key={`${cert.title}-${index}`}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)] border"
                style={{ backgroundColor: cardBg, borderColor: border }}
              >
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-md">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6" style={{ backgroundColor: cardBg }}>
                  <h4 className="mb-3 text-xl font-bold leading-tight transition-colors group-hover:opacity-80" style={{ color: titleColor }}>
                    {cert.title}
                  </h4>
                  <p className="text-sm font-medium leading-relaxed" style={{ color: textColor }}>
                    {cert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

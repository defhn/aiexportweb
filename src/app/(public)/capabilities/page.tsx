import Image from "next/image";
import { CheckCircle2, Layers, Settings } from "lucide-react";

import { getActiveTemplate, getTemplateTheme } from "@/templates";

export default function CapabilitiesPage() {
  const template = getActiveTemplate();
  const theme = getTemplateTheme(template.id);

  return (
    <main className="min-h-screen pb-32 pt-24" style={{ backgroundColor: theme.surfaceAlt }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h1
            className="mb-4 text-sm font-black uppercase tracking-[0.4em]"
            style={{ color: theme.accent }}
          >
            {theme.capabilities.eyebrow}
          </h1>
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-stone-900 md:text-5xl">
            {theme.capabilities.title}
          </h2>
          <p className="mt-4 text-lg text-stone-500">{theme.capabilities.description}</p>
        </div>

        <div className="space-y-12">
          {theme.capabilities.highlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className={[
                "flex flex-col overflow-hidden rounded-[2.5rem] border bg-white shadow-xl",
                index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row",
              ].join(" ")}
              style={{ borderColor: theme.border }}
            >
              <div className="flex w-full flex-col justify-center p-10 md:p-16 lg:w-1/2">
                <div
                  className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
                >
                  {index % 2 === 0 ? <Settings className="h-8 w-8" /> : <Layers className="h-8 w-8" />}
                </div>
                <h3 className="mb-6 text-3xl font-bold text-stone-900">{highlight.title}</h3>
                <p className="mb-8 text-lg leading-relaxed text-stone-500">
                  {highlight.description}
                </p>
                <div className="space-y-4">
                  {highlight.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: theme.accent }} />
                      <span className="font-medium text-stone-700">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[400px] w-full bg-stone-100 lg:w-1/2">
                <Image
                  src={highlight.image}
                  alt={highlight.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-2">
          {theme.capabilities.specGroups.map((group, index) => (
            <div
              key={group.title}
              className={[
                "relative overflow-hidden rounded-[2rem] p-10",
                index === 0 ? "text-white" : "border bg-white shadow-sm",
              ].join(" ")}
              style={{
                backgroundColor: index === 0 ? theme.surface : "white",
                borderColor: theme.border,
              }}
            >
              <div className="absolute right-0 top-0 p-8 opacity-10">
                {index === 0 ? (
                  <Layers className="h-32 w-32 text-white" />
                ) : (
                  <Settings className="h-32 w-32 text-stone-900" />
                )}
              </div>
              <h4 className={["mb-6 text-2xl font-bold", index === 0 ? "text-white" : "text-stone-900"].join(" ")}>
                {group.title}
              </h4>
              <ul className="relative z-10 space-y-4">
                {group.rows.map((row) => (
                  <li
                    key={row.label}
                    className={[
                      "flex items-center justify-between border-b pb-2",
                      index === 0 ? "border-white/10 text-white/65" : "border-stone-100 text-stone-500",
                    ].join(" ")}
                  >
                    <span className={["font-medium", index === 0 ? "text-white" : "text-stone-900"].join(" ")}>
                      {row.label}
                    </span>
                    <span className="text-right text-sm">{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

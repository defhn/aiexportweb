import Image from "next/image";
import { CheckCircle2, Layers, Settings } from "lucide-react";

import { getCurrentSiteFromRequest } from "@/features/sites/queries";
import { getTemplateById, getTemplateTheme } from "@/templates";

export default async function CapabilitiesPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const template = getTemplateById(currentSite.templateId);
  const theme = getTemplateTheme(template.id);
  const isDark = theme.surface !== "#ffffff" && theme.surface !== "#fffaf2" && theme.surface !== "#f5f6ff" && theme.surface !== "#fffaf4";
  const textColor = isDark ? "text-white" : "text-stone-900";
  const textMuted = isDark ? "text-white/60" : "text-stone-500";
  const cardBg = isDark ? "rgba(255,255,255,0.02)" : "#ffffff";

  return (
    <main className="min-h-screen pb-32 pt-32" style={{ backgroundColor: theme.surface }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <p className="mb-5 text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
            {theme.capabilities.eyebrow}
          </p>
          <h1 className={`text-4xl font-black leading-[1.1] tracking-tight md:text-6xl ${textColor}`}>
            {theme.capabilities.title}
          </h1>
          <p className={`mt-6 text-lg leading-relaxed font-medium ${textMuted}`}>{theme.capabilities.description}</p>
        </div>

        <div className="space-y-16">
          {theme.capabilities.highlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className={[
                "flex flex-col flex-col-reverse overflow-hidden rounded-[3rem] border shadow-2xl transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]",
                index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row",
              ].join(" ")}
              style={{ borderColor: theme.border, backgroundColor: cardBg }}
            >
              <div className="flex w-full flex-col justify-center p-12 md:p-20 lg:w-1/2 relative bg-cover bg-center" style={{ backgroundImage: isDark ? "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" : "none" }}>
                <div
                  className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border"
                  style={{ backgroundColor: isDark ? "rgba(249,115,22,0.1)" : theme.accentSoft, color: theme.accent, borderColor: isDark ? "rgba(249,115,22,0.3)" : "rgba(0,0,0,0.05)" }}
                >
                  {index % 2 === 0 ? <Settings className="h-10 w-10" /> : <Layers className="h-10 w-10" />}
                </div>
                <h3 className={`mb-6 text-4xl font-black ${textColor}`}>{highlight.title}</h3>
                <p className={`mb-10 text-lg leading-relaxed ${textMuted}`}>
                  {highlight.description}
                </p>
                <div className="space-y-5">
                  {highlight.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-4">
                      <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: theme.accent }} />
                      <span className={`font-bold ${textColor}`}>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[500px] w-full bg-stone-100 lg:w-1/2 overflow-hidden">
                <Image
                  src={highlight.image}
                  alt={highlight.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[2s] hover:scale-110"
                />
                <div className="absolute inset-0 mix-blend-overlay opacity-30 texture-carbon" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 grid grid-cols-1 gap-8 md:grid-cols-2">
          {theme.capabilities.specGroups.map((group, index) => (
            <div
              key={group.title}
              className={[
                "relative overflow-hidden rounded-[3rem] p-12 transition-transform hover:-translate-y-2",
                index === 0 ? "text-white shadow-2xl" : "border shadow-lg",
              ].join(" ")}
              style={{
                backgroundColor: index === 0 ? theme.surfaceAlt : cardBg,
                borderColor: theme.border,
              }}
            >
              <div className="absolute right-0 top-0 p-8 opacity-10">
                {index === 0 ? (
                  <Layers className="h-40 w-40 text-white" />
                ) : (
                  <Settings className="h-40 w-40" style={{ color: isDark ? "white" : "#000" }} />
                )}
              </div>
              <h4 className={["mb-8 text-3xl font-black", index === 0 ? "text-white" : textColor].join(" ")}>
                {group.title}
              </h4>
              <ul className="relative z-10 space-y-5">
                {group.rows.map((row) => (
                  <li
                    key={row.label}
                    className={[
                      "flex items-center justify-between border-b pb-3",
                      index === 0 ? "border-white/10 text-white/70" : `border-stone-100/10 ${textMuted}`,
                    ].join(" ")}
                  >
                    <span className={["font-bold", index === 0 ? "text-white" : textColor].join(" ")}>
                      {row.label}
                    </span>
                    <span className="font-medium text-sm">{row.value}</span>
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

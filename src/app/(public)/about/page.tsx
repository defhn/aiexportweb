import { getPageModules } from "@/features/pages/queries";
import { getSiteSettings } from "@/features/settings/queries";

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export default async function AboutPage() {
  const [settings, modules] = await Promise.all([
    getSiteSettings(),
    getPageModules("about"),
  ]);
  const aboutModule = modules[0];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          About Us
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">
          {readString(aboutModule?.payloadJson ?? {}, "title") ||
            "Trusted manufacturing partner"}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          {readString(aboutModule?.payloadJson ?? {}, "description") ||
            settings.taglineEn}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl bg-stone-50 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Company
            </p>
            <p className="mt-3 text-lg font-semibold text-stone-950">
              {settings.companyNameEn}
            </p>
          </article>
          <article className="rounded-2xl bg-stone-50 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Address
            </p>
            <p className="mt-3 text-lg font-semibold text-stone-950">
              {settings.addressEn}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

import { getPageModules } from "@/features/pages/queries";
import { getSiteSettings } from "@/features/settings/queries";

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export default async function ContactPage() {
  const [settings, modules] = await Promise.all([
    getSiteSettings(),
    getPageModules("contact"),
  ]);
  const contactModule = modules[0];

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          Contact
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">
          {readString(contactModule?.payloadJson ?? {}, "title") ||
            "Tell us about your project"}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600">
          {readString(contactModule?.payloadJson ?? {}, "description") ||
            "Send your RFQ, target material, and quantity requirements to start the conversation."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl bg-stone-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Email
            </p>
            <p className="mt-3 text-sm font-medium text-stone-950">
              {settings.email}
            </p>
          </article>
          <article className="rounded-2xl bg-stone-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Phone
            </p>
            <p className="mt-3 text-sm font-medium text-stone-950">
              {settings.phone}
            </p>
          </article>
          <article className="rounded-2xl bg-stone-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              WhatsApp
            </p>
            <p className="mt-3 text-sm font-medium text-stone-950">
              {settings.whatsapp}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

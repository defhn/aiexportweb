import { buildLegalPageContent } from "@/features/public/site-page-copy";
import { getSiteSettings } from "@/features/settings/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

export default async function PrivacyPolicyPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const settings = await getSiteSettings(currentSite.seedPackKey, currentSite.id ?? null);
  const content = buildLegalPageContent("privacy", currentSite, settings);

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-6 py-20">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          {content.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950">{content.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{content.summary}</p>
      </div>
      <div className="space-y-4 text-sm leading-7 text-slate-700">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

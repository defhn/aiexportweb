import type { FeatureKey, SitePlan } from "@/lib/plans";
import type { SiteRecord } from "@/lib/sites";

type SiteSettingsLike = {
  companyNameEn: string;
  companyNameZh?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  addressEn?: string;
  addressZh?: string;
  siteUrl?: string;
};

type LegalPageKind = "privacy" | "terms";

const planLabels: Record<SitePlan, string> = {
  basic: "Basic",
  growth: "Growth",
  ai_sales: "AI Sales",
};

function resolvePrimaryHost(site: SiteRecord, settings: SiteSettingsLike) {
  try {
    if (settings.siteUrl) {
      return new URL(settings.siteUrl).host;
    }
  } catch {}

  return site.domain || (site.subdomain ? `${site.subdomain}.yourdomain.com` : site.slug);
}

function describeFeatureAddOns(features: readonly FeatureKey[] | undefined) {
  const count = features?.length ?? 0;
  return count > 0 ? ` with ${count} extra add-on module${count > 1 ? "s" : ""}` : "";
}

export function buildPricingPageContent(site: SiteRecord, settings: SiteSettingsLike) {
  const companyName = settings.companyNameEn || site.companyName || site.name;
  const host = resolvePrimaryHost(site, settings);
  const currentPlanLabel = planLabels[site.plan];
  const addOnSummary = describeFeatureAddOns(site.enabledFeaturesJson);

  return {
    eyebrow: `${companyName} Pricing Overview`,
    headline: `${companyName} website packages`,
    description: `${companyName} runs on ${host} with the ${currentPlanLabel} package${addOnSummary}. The same core platform stays in place while content, branding, and visible capabilities follow this site.`,
    currentPlanLabel: `Current package: ${currentPlanLabel}`,
    ctaLabel: `Talk to ${companyName} sales`,
    consultationTitle: `Why ${companyName} uses custom quoting`,
    consultationBody: `${companyName} can keep one shared framework while still adjusting modules, content structure, and delivery details to match each client project.`,
  };
}

export function buildLegalPageContent(
  kind: LegalPageKind,
  site: SiteRecord,
  settings: SiteSettingsLike,
) {
  const companyName = settings.companyNameEn || site.companyName || site.name;
  const host = resolvePrimaryHost(site, settings);
  const email = settings.email || "the email listed on the contact page";
  const phone = settings.phone || settings.whatsapp || "our listed business contact";
  const address = settings.addressEn || settings.addressZh || "our registered business address";

  if (kind === "privacy") {
    return {
      eyebrow: "Privacy Policy",
      title: "Privacy Policy",
      summary: `${companyName} handles enquiry and contact data for the ${host} website.`,
      paragraphs: [
        `${companyName} collects contact details, enquiry content, and uploaded materials only for quotation follow-up, order communication, and pre-sales support related to ${host}.`,
        `Files and enquiry materials submitted through this site are reviewed only by ${companyName} or its direct service providers for evaluating the request and are not shared with unrelated third parties.`,
        `If you would like us to update or delete submitted information, contact ${email} or reach our team through ${phone}. Our current business address is ${address}.`,
      ],
    };
  }

  return {
    eyebrow: "Terms",
    title: "Terms of Use",
    summary: `${companyName} publishes commercial and product information for the ${host} website under these terms.`,
    paragraphs: [
      `Product information, visuals, and downloadable materials shown on ${host} are provided by ${companyName} for business communication and quotation reference.`,
      `Final specifications, pricing, MOQ, lead times, and delivery arrangements remain subject to written confirmation between ${companyName} and the customer.`,
      `Unauthorized reproduction of product images, copy, catalog files, or other downloadable materials from ${companyName} is prohibited without prior written permission. For formal notices, contact ${email}.`,
    ],
  };
}

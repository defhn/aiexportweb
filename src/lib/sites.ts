import type { SeedPackKey } from "@/db/seed";
import type { FeatureKey, SitePlan } from "@/lib/plans";

export const DEFAULT_SITE_SLUG = "cnc-demo";
export const DEFAULT_TEMPLATE_ID = "template-01";
export const DEFAULT_SITE_PLAN: SitePlan = "basic";

export type SiteStatus = "active" | "draft" | "suspended";
export type SiteDealStage =
  | "lead"
  | "proposal"
  | "negotiation"
  | "active_client"
  | "renewal_due"
  | "churn_risk";

export type SiteRecord = {
  id?: number;
  name: string;
  slug: string;
  domain: string | null;
  subdomain: string | null;
  templateId: string;
  seedPackKey: SeedPackKey;
  plan: SitePlan;
  status: SiteStatus;
  companyName: string;
  logoUrl: string | null;
  primaryColor: string | null;
  enabledFeaturesJson?: FeatureKey[];
  salesOwner?: string | null;
  renewalDate?: Date | null;
  dealStage?: SiteDealStage;
  contractNotes?: string | null;
  domainAliases?: string[];
};

export type SiteLookup =
  | { kind: "slug"; value: string }
  | { kind: "host"; value: string };

const TEMPLATE_TO_SEED_PACK: Record<string, SeedPackKey> = {
  "template-01": "cnc",
  "template-02": "industrial-equipment",
  "template-03": "building-materials",
  "template-04": "energy-power",
  "template-05": "medical-health",
  "template-06": "fluid-hvac",
  "template-07": "lighting",
  "template-08": "hardware-plastics",
  "template-09": "furniture-outdoor",
  "template-10": "textile-packaging",
  "template-11": "consumer-electronics",
  "template-12": "lifestyle",
};

const DEMO_SITE_INPUTS: Array<{
  name: string;
  slug: string;
  subdomain: string;
  templateId: string;
}> = [
  { name: "CNC Precision Demo", slug: "cnc-demo", subdomain: "cnc", templateId: "template-01" },
  {
    name: "Industrial Equipment Demo",
    slug: "equipment-demo",
    subdomain: "equipment",
    templateId: "template-02",
  },
  {
    name: "Building Materials Demo",
    slug: "building-demo",
    subdomain: "building",
    templateId: "template-03",
  },
  { name: "Energy Power Demo", slug: "energy-demo", subdomain: "energy", templateId: "template-04" },
  {
    name: "Medical Health Demo",
    slug: "medical-demo",
    subdomain: "medical",
    templateId: "template-05",
  },
  { name: "Fluid HVAC Demo", slug: "hvac-demo", subdomain: "hvac", templateId: "template-06" },
  { name: "Lighting Demo", slug: "lighting-demo", subdomain: "lighting", templateId: "template-07" },
  {
    name: "Hardware Plastics Demo",
    slug: "hardware-demo",
    subdomain: "hardware",
    templateId: "template-08",
  },
  {
    name: "Furniture Outdoor Demo",
    slug: "furniture-demo",
    subdomain: "furniture",
    templateId: "template-09",
  },
  {
    name: "Textile Packaging Demo",
    slug: "packaging-demo",
    subdomain: "packaging",
    templateId: "template-10",
  },
  {
    name: "Consumer Electronics Demo",
    slug: "electronics-demo",
    subdomain: "electronics",
    templateId: "template-11",
  },
  { name: "Lifestyle Gifts Demo", slug: "gifts-demo", subdomain: "gifts", templateId: "template-12" },
];

export function normalizeHost(host: string | null | undefined) {
  return (host ?? "").trim().toLowerCase().replace(/:\d+$/, "");
}

export function normalizeSiteDomain(value: string | null | undefined) {
  const raw = (value ?? "").trim().toLowerCase();

  if (!raw) return "";

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//.test(raw) ? raw : `https://${raw}`;

  try {
    return normalizeHost(new URL(withProtocol).host);
  } catch {
    return normalizeHost(raw.split("/")[0]);
  }
}

export function parseSiteDomainAliases(input: string | null | undefined) {
  const seen = new Set<string>();
  const aliases: string[] = [];

  for (const line of (input ?? "").split(/\r?\n|,/)) {
    const normalized = normalizeSiteDomain(line);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      aliases.push(normalized);
    }
  }

  return aliases;
}

export function getSeedPackKeyForTemplate(templateId: string): SeedPackKey {
  return TEMPLATE_TO_SEED_PACK[templateId] ?? "cnc";
}

export function resolveSiteLookup(input: { host?: string | null; site?: string | null }): SiteLookup {
  const explicitSite = input.site?.trim();

  if (explicitSite) {
    return { kind: "slug", value: explicitSite };
  }

  const host = normalizeHost(input.host);

  if (host) {
    return { kind: "host", value: host };
  }

  return { kind: "slug", value: DEFAULT_SITE_SLUG };
}

export function buildDemoSites(baseDomain = "demo.localhost"): SiteRecord[] {
  return DEMO_SITE_INPUTS.map((site) => ({
    name: site.name,
    slug: site.slug,
    domain: `${site.subdomain}.${baseDomain}`,
    subdomain: site.subdomain,
    templateId: site.templateId,
    seedPackKey: getSeedPackKeyForTemplate(site.templateId),
    plan: DEFAULT_SITE_PLAN,
    status: "active",
    companyName: site.name,
    logoUrl: null,
    primaryColor: null,
    enabledFeaturesJson: [],
    salesOwner: null,
    renewalDate: null,
    dealStage: "lead",
    contractNotes: null,
    domainAliases: [`${site.subdomain}.${baseDomain}`],
  }));
}

export function getFallbackSite(slug = DEFAULT_SITE_SLUG): SiteRecord {
  return buildDemoSites().find((site) => site.slug === slug) ?? buildDemoSites()[0]!;
}

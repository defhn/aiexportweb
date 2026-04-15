import { eq, inArray, or } from "drizzle-orm";
import { headers } from "next/headers";

import { getDb } from "@/db/client";
import { siteDomains, sites } from "@/db/schema";
import {
  DEFAULT_SITE_SLUG,
  buildDemoSites,
  getFallbackSite,
  normalizeSiteDomain,
  resolveSiteLookup,
  type SiteDealStage,
  type SiteRecord,
} from "@/lib/sites";
import type { FeatureKey } from "@/lib/plans";

function mapSiteRecord(
  record: typeof sites.$inferSelect,
  domainAliases: string[] = [],
): SiteRecord {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    domain: record.domain,
    subdomain: record.subdomain,
    templateId: record.templateId,
    seedPackKey: record.seedPackKey as SiteRecord["seedPackKey"],
    plan: record.plan,
    status: record.status,
    companyName: record.companyName,
    logoUrl: record.logoUrl,
    primaryColor: record.primaryColor,
    enabledFeaturesJson: (record.enabledFeaturesJson ?? []) as FeatureKey[],
    salesOwner: record.salesOwner,
    renewalDate: record.renewalDate,
    dealStage: record.dealStage as SiteDealStage,
    contractNotes: record.contractNotes,
    domainAliases,
  };
}

async function attachDomainAliases(records: Array<typeof sites.$inferSelect>) {
  const ids = records.map((record) => record.id);
  if (!ids.length) {
    return records.map((record) => mapSiteRecord(record));
  }

  const db = getDb();
  const aliases = await db
    .select({
      siteId: siteDomains.siteId,
      host: siteDomains.host,
    })
    .from(siteDomains)
    .where(inArray(siteDomains.siteId, ids));
  const aliasesBySite = new Map<number, string[]>();

  for (const alias of aliases) {
    const current = aliasesBySite.get(alias.siteId) ?? [];
    current.push(alias.host);
    aliasesBySite.set(alias.siteId, current);
  }

  return records.map((record) => mapSiteRecord(record, aliasesBySite.get(record.id) ?? []));
}

export async function getSiteBySlug(slug: string): Promise<SiteRecord | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const db = getDb();
  try {
    const [record] = await db.select().from(sites).where(eq(sites.slug, slug)).limit(1);
    if (!record) return null;
    const [site] = await attachDomainAliases([record]);
    return site ?? null;
  } catch (error) {
    console.warn("Falling back after site slug lookup failure.", error);
    return null;
  }
}

export async function getSiteById(id: number): Promise<SiteRecord | null> {
  if (!process.env.DATABASE_URL) {
    return buildDemoSites().find((site) => site.id === id) ?? null;
  }

  const db = getDb();
  try {
    const [record] = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
    if (!record) return null;
    const [site] = await attachDomainAliases([record]);
    return site ?? null;
  } catch (error) {
    console.warn("Falling back after site id lookup failure.", error);
    return null;
  }
}

export async function listSites(): Promise<SiteRecord[]> {
  if (!process.env.DATABASE_URL) {
    return buildDemoSites();
  }

  try {
    const db = getDb();
    const records = await db.select().from(sites).orderBy(sites.id);
    return attachDomainAliases(records);
  } catch (error) {
    console.warn("Falling back to demo sites after site list read failure.", error);
    return buildDemoSites();
  }
}

export async function getSiteByHost(host: string): Promise<SiteRecord | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const normalizedHost = normalizeSiteDomain(host);

  if (!normalizedHost) {
    return null;
  }

  const subdomain = normalizedHost.split(".")[0] ?? "";
  const db = getDb();
  let record: typeof sites.$inferSelect | undefined;

  try {
    const [domainRecord] = await db
      .select({
        siteId: siteDomains.siteId,
      })
      .from(siteDomains)
      .where(eq(siteDomains.host, normalizedHost))
      .limit(1);

    if (domainRecord) {
      return getSiteById(domainRecord.siteId);
    }

    [record] = await db
      .select()
      .from(sites)
      .where(or(eq(sites.domain, normalizedHost), eq(sites.subdomain, subdomain)))
      .limit(1);
  } catch (error) {
    console.warn("Falling back after site host lookup failure.", error);
    return null;
  }

  return record ? mapSiteRecord(record) : null;
}

export async function getCurrentSite(input?: {
  host?: string | null;
  site?: string | null;
}): Promise<SiteRecord> {
  const lookup = resolveSiteLookup({
    host: input?.host,
    site: input?.site ?? process.env.SITE_SLUG ?? null,
  });

  const record =
    lookup.kind === "slug" ? await getSiteBySlug(lookup.value) : await getSiteByHost(lookup.value);

  return record ?? getFallbackSite(lookup.kind === "slug" ? lookup.value : DEFAULT_SITE_SLUG);
}

export async function getCurrentSiteFromRequest(searchParams?: {
  site?: string | string[] | undefined;
}): Promise<SiteRecord> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const rawSite = searchParams?.site;
  const site = Array.isArray(rawSite)
    ? rawSite[0]
    : rawSite ?? requestHeaders.get("x-preview-site");

  return getCurrentSite({ host, site });
}

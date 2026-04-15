import { eq, or } from "drizzle-orm";
import { headers } from "next/headers";

import { getDb } from "@/db/client";
import { sites } from "@/db/schema";
import {
  DEFAULT_SITE_SLUG,
  buildDemoSites,
  getFallbackSite,
  normalizeHost,
  resolveSiteLookup,
  type SiteRecord,
} from "@/lib/sites";

function mapSiteRecord(record: typeof sites.$inferSelect): SiteRecord {
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
  };
}

export async function getSiteBySlug(slug: string): Promise<SiteRecord | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const db = getDb();
  const [record] = await db.select().from(sites).where(eq(sites.slug, slug)).limit(1);
  return record ? mapSiteRecord(record) : null;
}

export async function listSites(): Promise<SiteRecord[]> {
  if (!process.env.DATABASE_URL) {
    return buildDemoSites();
  }

  try {
    const db = getDb();
    const records = await db.select().from(sites).orderBy(sites.id);
    return records.map(mapSiteRecord);
  } catch (error) {
    console.warn("Falling back to demo sites after site list read failure.", error);
    return buildDemoSites();
  }
}

export async function getSiteByHost(host: string): Promise<SiteRecord | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const normalizedHost = normalizeHost(host);

  if (!normalizedHost) {
    return null;
  }

  const subdomain = normalizedHost.split(".")[0] ?? "";
  const db = getDb();
  const [record] = await db
    .select()
    .from(sites)
    .where(or(eq(sites.domain, normalizedHost), eq(sites.subdomain, subdomain)))
    .limit(1);

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

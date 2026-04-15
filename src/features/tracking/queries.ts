import { and, desc, eq, gte, isNotNull, sql, type SQL } from "drizzle-orm";

import { getDb } from "@/db/client";
import { inquiries } from "@/db/schema";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

function withSiteScope(siteId: number | null, condition: SQL) {
  return siteId ? and(eq(inquiries.siteId, siteId), condition) : condition;
}

function siteOnlyScope(siteId: number | null) {
  return siteId ? eq(inquiries.siteId, siteId) : sql`true`;
}

export async function getUtmAttributionSummary() {
  const db = getDb();
  const currentSite = await getCurrentSiteFromRequest();
  const siteId = currentSite.id ?? null;
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const bySource = await db
    .select({
      utmSource: inquiries.utmSource,
      count: sql<number>`count(*)::int`,
    })
    .from(inquiries)
    .where(withSiteScope(siteId, gte(inquiries.createdAt, cutoff)))
    .groupBy(inquiries.utmSource)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const byCampaign = await db
    .select({
      utmCampaign: inquiries.utmCampaign,
      utmSource: inquiries.utmSource,
      count: sql<number>`count(*)::int`,
    })
    .from(inquiries)
    .where(withSiteScope(siteId, gte(inquiries.createdAt, cutoff)))
    .groupBy(inquiries.utmCampaign, inquiries.utmSource)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  const gclidRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(withSiteScope(siteId, isNotNull(inquiries.gclid)));
  const gclidCount = gclidRows[0]?.count ?? 0;

  const trackedRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(withSiteScope(siteId, isNotNull(inquiries.utmSource)));
  const trackedCount = trackedRows[0]?.count ?? 0;

  const totalRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(siteOnlyScope(siteId));
  const totalCount = totalRows[0]?.count ?? 0;

  const highValueRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(withSiteScope(siteId, isNotNull(inquiries.companyWebsite)));
  const highValueCount = highValueRows[0]?.count ?? 0;

  const recentTracked = await db
    .select({
      id: inquiries.id,
      name: inquiries.name,
      companyName: inquiries.companyName,
      country: inquiries.country,
      utmSource: inquiries.utmSource,
      utmMedium: inquiries.utmMedium,
      utmCampaign: inquiries.utmCampaign,
      gclid: inquiries.gclid,
      annualVolume: inquiries.annualVolume,
      companyWebsite: inquiries.companyWebsite,
      createdAt: inquiries.createdAt,
    })
    .from(inquiries)
    .where(withSiteScope(siteId, isNotNull(inquiries.utmSource)))
    .orderBy(desc(inquiries.createdAt))
    .limit(20);

  return {
    bySource,
    byCampaign,
    gclidCount,
    trackedCount,
    totalCount,
    highValueCount,
    recentTracked,
  };
}

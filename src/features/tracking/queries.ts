import { desc, gte, isNotNull, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { inquiries } from "@/db/schema";

/** 获取 UTM 来源归因摘要（最近 30 天） */
export async function getUtmAttributionSummary() {
  const db = getDb();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // 按 utm_source 分组统计
  const bySource = await db
    .select({
      utmSource: inquiries.utmSource,
      count: sql<number>`count(*)::int`,
    })
    .from(inquiries)
    .where(gte(inquiries.createdAt, cutoff))
    .groupBy(inquiries.utmSource)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // 按 utm_campaign 分组统计
  const byCampaign = await db
    .select({
      utmCampaign: inquiries.utmCampaign,
      utmSource: inquiries.utmSource,
      count: sql<number>`count(*)::int`,
    })
    .from(inquiries)
    .where(gte(inquiries.createdAt, cutoff))
    .groupBy(inquiries.utmCampaign, inquiries.utmSource)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // GCLID 命中量（Google Ads 专属追踪）
  const gclidRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNotNull(inquiries.gclid));

  const gclidCount = gclidRows[0]?.count ?? 0;

  // 有无 UTM / GCLID 对比（有来源 vs 直接访问）
  const trackedRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNotNull(inquiries.utmSource));
  const trackedCount = trackedRows[0]?.count ?? 0;

  const totalRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries);
  const totalCount = totalRows[0]?.count ?? 0;

  // 高质量线索（企业网址或年采购量已填写）
  const highValueRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNotNull(inquiries.companyWebsite));
  const highValueCount = highValueRows[0]?.count ?? 0;

  // 最近 20 条有 UTM 的高质量询盘
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
    .where(isNotNull(inquiries.utmSource))
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

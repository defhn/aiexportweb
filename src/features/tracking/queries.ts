import { desc, gte, isNotNull, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { inquiries } from "@/db/schema";

/** 获取 UTM 流量归因统计数据，默认分析最近 30 天数据 */
export async function getUtmAttributionSummary() {
  const db = getDb();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // 按 utm_source 聚合排序
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

  // 按 utm_campaign 聚合排序
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

  // GCLID 统计：来自 Google Ads 点击的询盘数量
  const gclidRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNotNull(inquiries.gclid));

  const gclidCount = gclidRows[0]?.count ?? 0;

  // 统计有 UTM / GCLID 的已归因询盘 vs 无追踪参数的直接访问
  const trackedRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNotNull(inquiries.utmSource));
  const trackedCount = trackedRows[0]?.count ?? 0;

  const totalRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries);
  const totalCount = totalRows[0]?.count ?? 0;

  // 高价值询盘：含公司网站的询盘通常来自企业买家，转化价值更高
  const highValueRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNotNull(inquiries.companyWebsite));
  const highValueCount = highValueRows[0]?.count ?? 0;

  // 最近 20 条含 UTM 参数的询盘明细
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

import { desc, gte, isNotNull, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { inquiries } from "@/db/schema";

/** 閼惧嘲褰� UTM 閺夈儲绨ぐ鎺戞礈閹芥ǹ顩﹂敍鍫熸付鏉╋拷 30 婢垛晪绱� */
export async function getUtmAttributionSummary() {
  const db = getDb();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // 閹革拷 utm_source 閸掑棛绮嶇紒鐔活吀
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

  // 閹革拷 utm_campaign 閸掑棛绮嶇紒鐔活吀
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

  // GCLID 閸涙垝鑵戦柌蹇ョ礄Google Ads 娑撴挸鐫樻潻鍊熼嚋閿涳拷
  const gclidRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNotNull(inquiries.gclid));

  const gclidCount = gclidRows[0]?.count ?? 0;

  // 閺堝妫� UTM / GCLID 鐎佃鐦敍鍫熸箒閺夈儲绨� vs 閻╁瓨甯寸拋鍧楁６閿涳拷
  const trackedRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNotNull(inquiries.utmSource));
  const trackedCount = trackedRows[0]?.count ?? 0;

  const totalRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries);
  const totalCount = totalRows[0]?.count ?? 0;

  // 妤傛ǹ宸濋柌蹇曞殠缁鳖澁绱欐导浣风瑹缂冩垵娼冮幋鏍у嬀闁插洩鍠橀柌蹇撳嚒婵夘偄鍟撻敍锟�
  const highValueRows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(isNotNull(inquiries.companyWebsite));
  const highValueCount = highValueRows[0]?.count ?? 0;

  // 閺堚偓鏉╋拷 20 閺夆剝婀� UTM 閻ㄥ嫰鐝拹銊╁櫤鐠囥垻娲�
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

import { eq, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { featureUsageCounters } from "@/db/schema";
import { env } from "@/env";
import {
  type FeatureAvailability,
  type FeatureKey,
  type SitePlan,
  getFeatureAvailability,
  getPlanSummary,
  getPricingPageHref,
  isPricingPageEnabled,
  normalizeSitePlan,
} from "@/lib/plans";

export type FeatureGate = FeatureAvailability & {
  pricingHref: string | null;
  salesContactHref: string;
  currentPlanNameZh: string;
};

export function getCurrentSitePlan(): SitePlan {
  return normalizeSitePlan(env.SITE_PLAN);
}

export function getSalesContactHref() {
  return env.SALES_CONTACT_URL.trim() || "/contact";
}

export function getPricingHref() {
  return getPricingPageHref(isPricingPageEnabled(env.ENABLE_PRICING_PAGE));
}

export async function getFeatureUsageCount(featureKey: FeatureKey) {
  if (!process.env.DATABASE_URL) {
    return 0;
  }

  try {
    const db = getDb();
    const [record] = await db
      .select({ usageCount: featureUsageCounters.usageCount })
      .from(featureUsageCounters)
      .where(eq(featureUsageCounters.featureKey, featureKey))
      .limit(1);

    return record?.usageCount ?? 0;
  } catch (error) {
    if (
      error instanceof Error &&
      /feature_usage_counters|does not exist|42P01/i.test(error.message)
    ) {
      return 0;
    }

    throw error;
  }
}

export async function getFeatureGate(
  featureKey: FeatureKey,
  sitePlan?: SitePlan | null,
): Promise<FeatureGate> {
  const currentPlan = sitePlan ?? getCurrentSitePlan();
  const usageCount = await getFeatureUsageCount(featureKey);
  const availability = getFeatureAvailability({
    currentPlan,
    featureKey,
    usageCount,
  });

  return {
    ...availability,
    pricingHref: getPricingHref(),
    salesContactHref: getSalesContactHref(),
    currentPlanNameZh: getPlanSummary(currentPlan).nameZh,
  };
}

export async function incrementFeatureUsage(featureKey: FeatureKey) {
  if (!process.env.DATABASE_URL) {
    return;
  }

  try {
    const db = getDb();

    await db
      .insert(featureUsageCounters)
      .values({
        featureKey,
        usageCount: 1,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: featureUsageCounters.featureKey,
        set: {
          usageCount: sql`${featureUsageCounters.usageCount} + 1`,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    if (
      error instanceof Error &&
      /feature_usage_counters|does not exist|42P01/i.test(error.message)
    ) {
      return;
    }

    throw error;
  }
}

export function buildLockedApiResponse(gate: FeatureGate) {
  const limitCopy =
    gate.limit !== null
      ? `当前套餐试用额度已用完（${gate.usageCount}/${gate.limit}）。`
      : "当前套餐暂未包含此功能。";

  return {
    error: `${gate.labelZh}暂不可用。${limitCopy}`,
    upgradeTitle: gate.upgradeTitle,
    upgradeDescription: gate.upgradeDescription,
    salesContactHref: gate.salesContactHref,
    pricingHref: gate.pricingHref,
    requiredPlan: gate.requiredPlan,
    currentPlan: gate.currentPlan,
    remaining: gate.remaining,
    limit: gate.limit,
  };
}

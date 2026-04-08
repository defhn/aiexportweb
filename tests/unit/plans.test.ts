import { describe, expect, it } from "vitest";

import {
  getFeatureAvailability,
  getPlanCardSummaries,
  getPricingPageHref,
  isPricingPageEnabled,
  normalizeSitePlan,
} from "@/lib/plans";

describe("plan and pricing helpers", () => {
  it("normalizes unknown plans to ai sales by default", () => {
    expect(normalizeSitePlan(undefined)).toBe("ai_sales");
    expect(normalizeSitePlan("unknown")).toBe("ai_sales");
  });

  it("locks growth features for the basic plan", () => {
    const availability = getFeatureAvailability({
      currentPlan: "basic",
      featureKey: "dashboard_analytics",
    });

    expect(availability.status).toBe("locked");
    expect(availability.upgradePlan).toBe("growth");
    expect(availability.requiredPlan).toBe("growth");
  });

  it("gives the growth plan a limited ai trial", () => {
    const availability = getFeatureAvailability({
      currentPlan: "growth",
      featureKey: "ai_product_copy",
      usageCount: 2,
    });

    expect(availability.status).toBe("trial");
    expect(availability.limit).toBe(3);
    expect(availability.remaining).toBe(1);
    expect(availability.upgradePlan).toBe("ai_sales");
  });

  it("locks ai tools after the growth trial is exhausted", () => {
    const availability = getFeatureAvailability({
      currentPlan: "growth",
      featureKey: "ai_inquiry_reply",
      usageCount: 5,
    });

    expect(availability.status).toBe("locked");
    expect(availability.remaining).toBe(0);
    expect(availability.upgradePlan).toBe("ai_sales");
  });

  it("keeps ai sales fully unlocked", () => {
    const availability = getFeatureAvailability({
      currentPlan: "ai_sales",
      featureKey: "ai_inquiry_classification",
      usageCount: 999,
    });

    expect(availability.status).toBe("included");
    expect(availability.limit).toBeNull();
    expect(availability.remaining).toBeNull();
  });

  it("uses fixed chinese pricing", () => {
    const summaries = getPlanCardSummaries();

    expect(summaries.map((item) => item.price)).toEqual([9980, 19800, 29800]);
    expect(summaries.map((item) => item.nameZh)).toEqual([
      "基础版",
      "获客版",
      "AI销售版",
    ]);
  });

  it("supports turning the pricing page on and off", () => {
    expect(isPricingPageEnabled("true")).toBe(true);
    expect(isPricingPageEnabled("1")).toBe(true);
    expect(isPricingPageEnabled("false")).toBe(false);
    expect(getPricingPageHref(true)).toBe("/pricing");
    expect(getPricingPageHref(false)).toBeNull();
  });
});

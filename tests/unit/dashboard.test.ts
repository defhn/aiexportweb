import { describe, expect, it } from "vitest";

import { buildDashboardSnapshot } from "@/features/dashboard/queries";

describe("dashboard snapshot", () => {
  it("aggregates inquiry counts, trend, countries, and top products", () => {
    const snapshot = buildDashboardSnapshot({
      now: new Date("2026-04-08T12:00:00.000Z"),
      inquiries: [
        {
          id: 1,
          status: "new",
          createdAt: new Date("2026-04-08T03:00:00.000Z"),
          countryCode: "US",
          countryGroup: "North America",
          inquiryType: "quotation",
          productId: 8,
          productName: "Bracket",
        },
        {
          id: 2,
          status: "processing",
          createdAt: new Date("2026-04-07T03:00:00.000Z"),
          countryCode: "US",
          countryGroup: "North America",
          inquiryType: "sample",
          productId: 8,
          productName: "Bracket",
        },
        {
          id: 3,
          status: "done",
          createdAt: new Date("2026-04-01T03:00:00.000Z"),
          countryCode: "DE",
          countryGroup: "Europe",
          inquiryType: "technical",
          productId: 9,
          productName: "Housing",
        },
      ],
      productViews: [
        { productId: 8, productName: "Bracket" },
        { productId: 8, productName: "Bracket" },
        { productId: 9, productName: "Housing" },
      ],
    });

    expect(snapshot.cards.today).toBe(1);
    expect(snapshot.cards.thisWeek).toBe(2);
    expect(snapshot.cards.thisMonth).toBe(3);
    expect(snapshot.cards.pending).toBe(2);
    expect(snapshot.topProductsByInquiry[0]).toMatchObject({
      productId: 8,
      count: 2,
    });
    expect(snapshot.topCountries[0]).toMatchObject({
      countryCode: "US",
      count: 2,
    });
    expect(snapshot.topProductsByViews[0]).toMatchObject({
      productId: 8,
      count: 2,
    });
    expect(snapshot.trend).toHaveLength(7);
  });
});

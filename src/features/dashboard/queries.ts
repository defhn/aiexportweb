import { listInquiries } from "@/features/inquiries/queries";
import { listRecentProductViews } from "@/features/products/views";

type DashboardInquiry = {
  id: number;
  status: string;
  createdAt: Date;
  countryCode?: string | null;
  countryGroup?: string | null;
  inquiryType?: string | null;
  productId?: number | null;
  productName?: string | null;
};

type DashboardProductView = {
  productId: number;
  productName?: string | null;
};

function formatDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, delta: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + delta);
  return next;
}

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function buildDashboardSnapshot(input: {
  now?: Date;
  inquiries: DashboardInquiry[];
  productViews?: DashboardProductView[];
}) {
  const now = input.now ?? new Date();
  const todayStart = startOfUtcDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const weekStart = addDays(todayStart, -6);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const trendMap = new Map<string, number>();

  for (let index = 0; index < 7; index += 1) {
    trendMap.set(formatDayKey(addDays(weekStart, index)), 0);
  }

  const topProductsByInquiryMap = new Map<number, { productId: number; productName: string; count: number }>();
  const topCountriesMap = new Map<string, { countryCode: string; countryGroup: string; count: number }>();
  const topProductsByViewsMap = new Map<number, { productId: number; productName: string; count: number }>();

  let today = 0;
  let thisWeek = 0;
  let thisMonth = 0;
  let pending = 0;

  for (const inquiry of input.inquiries) {
    const createdAt = inquiry.createdAt;

    if (createdAt >= todayStart && createdAt < tomorrowStart) {
      today += 1;
    }
    if (createdAt >= weekStart && createdAt < tomorrowStart) {
      thisWeek += 1;
      const key = formatDayKey(createdAt);
      if (trendMap.has(key)) {
        trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
      }
    }
    if (createdAt >= monthStart && createdAt < tomorrowStart) {
      thisMonth += 1;
    }
    if (inquiry.status !== "done") {
      pending += 1;
    }
    if (inquiry.productId) {
      const current = topProductsByInquiryMap.get(inquiry.productId) ?? {
        productId: inquiry.productId,
        productName: inquiry.productName ?? `Product #${inquiry.productId}`,
        count: 0,
      };
      current.count += 1;
      topProductsByInquiryMap.set(inquiry.productId, current);
    }
    if (inquiry.countryCode) {
      const current = topCountriesMap.get(inquiry.countryCode) ?? {
        countryCode: inquiry.countryCode,
        countryGroup: inquiry.countryGroup ?? "Other",
        count: 0,
      };
      current.count += 1;
      topCountriesMap.set(inquiry.countryCode, current);
    }
  }

  for (const view of input.productViews ?? []) {
    const current = topProductsByViewsMap.get(view.productId) ?? {
      productId: view.productId,
      productName: view.productName ?? `Product #${view.productId}`,
      count: 0,
    };
    current.count += 1;
    topProductsByViewsMap.set(view.productId, current);
  }

  return {
    cards: {
      today,
      thisWeek,
      thisMonth,
      pending,
    },
    trend: Array.from(trendMap.entries()).map(([date, count]) => ({ date, count })),
    topProductsByInquiry: Array.from(topProductsByInquiryMap.values()).sort(
      (left, right) => right.count - left.count,
    ),
    topCountries: Array.from(topCountriesMap.values()).sort(
      (left, right) => right.count - left.count,
    ),
    topProductsByViews: Array.from(topProductsByViewsMap.values()).sort(
      (left, right) => right.count - left.count,
    ),
  };
}

export async function getDashboardSnapshot() {
  const [inquiriesResult, productViewsResult] = await Promise.allSettled([
    listInquiries(),
    listRecentProductViews(),
  ]);

  if (inquiriesResult.status === "rejected") {
    console.error("Falling back to empty inquiry dashboard data.", inquiriesResult.reason);
  }

  if (productViewsResult.status === "rejected") {
    console.error(
      "Falling back to empty product-view dashboard data.",
      productViewsResult.reason,
    );
  }

  const inquiries =
    inquiriesResult.status === "fulfilled" ? inquiriesResult.value : [];
  const productViews =
    productViewsResult.status === "fulfilled" ? productViewsResult.value : [];

  return buildDashboardSnapshot({
    inquiries: inquiries.map((item) => ({
      id: item.id,
      status: item.status,
      createdAt: item.createdAt,
      countryCode: item.countryCode,
      countryGroup: item.countryGroup,
      inquiryType: item.inquiryType,
      productId: item.productId,
      productName: item.productName,
    })),
    productViews: productViews.map((item) => ({
      productId: item.productId,
      productName: item.productName,
    })),
  });
}

import { and, asc, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { pageModules } from "@/db/schema";
import {
  getSeedPack,
  type SeedPackKey,
  type SeedPageKey,
  type SeedPageModule,
} from "@/db/seed";

type PageModuleRecord = {
  isEnabled: boolean;
  sortOrder: number;
};

type FeaturedPayload = {
  featuredCategoryIds?: unknown;
  featuredProductIds?: unknown;
};

function toNumberArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is number => typeof item === "number");
}

function normalizeScalar(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function normalizeList(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return value
    ?.split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

export function normalizePageModules<T extends PageModuleRecord>(records: T[]) {
  return records
    .filter((record) => record.isEnabled)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function mergePageModulesWithDefaults<T extends SeedPageModule>(
  records: T[],
  defaults: SeedPageModule[],
) {
  const recordMap = new Map(records.map((record) => [record.moduleKey, record]));

  const mergedDefaults = defaults.map((fallbackModule) => {
    const record = recordMap.get(fallbackModule.moduleKey);

    if (!record) {
      return fallbackModule;
    }

    return {
      ...fallbackModule,
      ...record,
      payloadJson: {
        ...fallbackModule.payloadJson,
        ...(record.payloadJson ?? {}),
      },
    };
  });

  const extraRecords = records.filter(
    (record) => !defaults.some((fallbackModule) => fallbackModule.moduleKey === record.moduleKey),
  );

  return [...mergedDefaults, ...extraRecords];
}

export function extractFeaturedIds(payload: FeaturedPayload) {
  return {
    featuredCategoryIds: toNumberArray(payload.featuredCategoryIds),
    featuredProductIds: toNumberArray(payload.featuredProductIds),
  };
}

export function buildModulePayload(
  moduleKey: string,
  values: Record<string, string | string[] | undefined>,
) {
  const scalarPayload = Object.fromEntries(
    Object.entries(values)
      .filter(([, value]) => !Array.isArray(value))
      .map(([key, value]) => [key, normalizeScalar(value)])
      .filter(([, value]) => value.length > 0),
  );

  if (moduleKey === "hero") {
    return {
      eyebrow: normalizeScalar(values.eyebrow),
      title: normalizeScalar(values.title),
      description: normalizeScalar(values.description),
      primaryCtaLabel: normalizeScalar(values.primaryCtaLabel),
      primaryCtaHref: normalizeScalar(values.primaryCtaHref),
      secondaryCtaLabel: normalizeScalar(values.secondaryCtaLabel),
      secondaryCtaHref: normalizeScalar(values.secondaryCtaHref),
    };
  }

  if (
    moduleKey === "strengths" ||
    moduleKey === "trust-signals" ||
    moduleKey === "quality-certifications" ||
    moduleKey === "process-steps"
  ) {
    return {
      ...scalarPayload,
      items: normalizeList(values.items),
    };
  }

  if (
    moduleKey === "featured-categories" ||
    moduleKey === "featured-products"
  ) {
    return {
      ...scalarPayload,
      slugs: normalizeList(values.slugs),
    };
  }

  return scalarPayload;
}

export async function getPageModules(
  pageKey: SeedPageKey,
  seedPackKey: SeedPackKey = "cnc",
  siteId?: number | null,
) {
  const defaults = getSeedPack(seedPackKey).pages[pageKey];

  if (!process.env.DATABASE_URL) {
    return normalizePageModules<SeedPageModule>([...defaults]);
  }

  const db = getDb();
  let records: (typeof pageModules.$inferSelect)[];

  try {
    records = await db
      .select()
      .from(pageModules)
      .where(
        siteId
          ? and(eq(pageModules.pageKey, pageKey), eq(pageModules.siteId, siteId))
          : eq(pageModules.pageKey, pageKey),
      )
      .orderBy(asc(pageModules.sortOrder), asc(pageModules.id));
  } catch (error) {
    console.warn("Falling back to seed page modules after database read failure.", error);
    return normalizePageModules<SeedPageModule>([...defaults]);
  }

  if (records.length) {
    return normalizePageModules(mergePageModulesWithDefaults(records, defaults));
  }

  return normalizePageModules<SeedPageModule>([...defaults]);
}

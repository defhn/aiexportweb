import { getSeedPack, type SeedPackKey, type SeedPageKey, type SeedPageModule } from "@/db/seed";

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

export function normalizePageModules<T extends PageModuleRecord>(records: T[]) {
  return records
    .filter((record) => record.isEnabled)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}

export function extractFeaturedIds(payload: FeaturedPayload) {
  return {
    featuredCategoryIds: toNumberArray(payload.featuredCategoryIds),
    featuredProductIds: toNumberArray(payload.featuredProductIds),
  };
}

export async function getPageModules(
  pageKey: SeedPageKey,
  seedPackKey: SeedPackKey = "cnc",
) {
  const pack = getSeedPack(seedPackKey);

  return normalizePageModules<SeedPageModule>([...pack.pages[pageKey]]);
}

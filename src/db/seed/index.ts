import { defaultFieldDefinitions } from "./default-field-defs";
import { buildingMaterialsSeedPack } from "./packs/building-materials";
import { cncSeedPack } from "./packs/cnc";
import { industrialEquipmentSeedPack } from "./packs/industrial-equipment";
import type { SeedPack, SeedPackKey } from "./types";

export { defaultFieldDefinitions };
export type {
  SeedBlogCategory,
  SeedBlogPost,
  SeedCategory,
  SeedCustomField,
  SeedPack,
  SeedPackKey,
  SeedPageKey,
  SeedPageModule,
  SeedProduct,
  SeedProductFieldValue,
  SeedSiteSettings,
} from "./types";

export const seedPacks: Record<SeedPackKey, SeedPack> = {
  cnc: cncSeedPack,
  "industrial-equipment": industrialEquipmentSeedPack,
  "building-materials": buildingMaterialsSeedPack,
};

export const seedPackKeys = Object.keys(seedPacks) as SeedPackKey[];

export function getSeedPack(key: SeedPackKey) {
  return seedPacks[key];
}

export function listSeedPacks() {
  return seedPackKeys.map((key) => seedPacks[key]);
}

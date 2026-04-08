import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { pageModules } from "@/db/schema";
import { getSeedPack, type SeedPageKey, type SeedPageModule } from "@/db/seed";

import { buildModulePayload } from "./queries";

export function buildPageModuleDraft(
  input: Partial<SeedPageModule> & Pick<SeedPageModule, "moduleKey">,
): SeedPageModule {
  return {
    moduleKey: input.moduleKey,
    moduleNameZh: input.moduleNameZh ?? "模块",
    moduleNameEn: input.moduleNameEn ?? "Module",
    isEnabled: input.isEnabled ?? true,
    sortOrder: input.sortOrder ?? 100,
    payloadJson: input.payloadJson ?? {},
  };
}

export function applyModuleOrdering(modules: SeedPageModule[]) {
  return modules.map((module, index) => ({
    ...module,
    sortOrder: (index + 1) * 10,
  }));
}

function readFormValues(formData: FormData, moduleKey: string) {
  const values: Record<string, string | string[] | undefined> = {};
  const prefix = `${moduleKey}__`;
  const keys = Array.from(new Set(Array.from(formData.keys())));

  for (const key of keys) {
    if (!key.startsWith(prefix)) {
      continue;
    }

    const fieldKey = key.slice(prefix.length);

    if (fieldKey === "enabled" || fieldKey === "sortOrder") {
      continue;
    }

    const rawValues = formData
      .getAll(key)
      .filter((value): value is string => typeof value === "string");

    values[fieldKey] =
      rawValues.length > 1 ? rawValues : (rawValues[0] ?? undefined);
  }

  return values;
}

function readEnabled(formData: FormData, moduleKey: string) {
  return formData.get(`${moduleKey}__enabled`) === "on";
}

function readSortOrder(formData: FormData, moduleKey: string, fallback: number) {
  const raw = formData.get(`${moduleKey}__sortOrder`);
  const value = typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;

  return Number.isFinite(value) ? value : fallback;
}

export async function savePageModules(pageKey: SeedPageKey, formData: FormData) {
  "use server";

  const db = getDb();
  const defaults = getSeedPack("cnc").pages[pageKey];

  const rows = defaults.map((module) => ({
    pageKey,
    moduleKey: module.moduleKey,
    moduleNameZh: module.moduleNameZh,
    moduleNameEn: module.moduleNameEn,
    isEnabled: readEnabled(formData, module.moduleKey),
    sortOrder: readSortOrder(formData, module.moduleKey, module.sortOrder),
    payloadJson: buildModulePayload(
      module.moduleKey,
      readFormValues(formData, module.moduleKey),
    ),
  }));

  await db.delete(pageModules).where(eq(pageModules.pageKey, pageKey));

  if (rows.length) {
    await db.insert(pageModules).values(rows);
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath(`/admin/pages/${pageKey}`);

  redirect(`/admin/pages/${pageKey}?saved=1`);
}

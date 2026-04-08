import type { SeedPageModule } from "@/db/seed";

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

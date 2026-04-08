import { ModuleEditor } from "@/components/admin/module-editor";
import { extractFeaturedIds, getPageModules } from "@/features/pages/queries";

export default async function AdminHomeModulesPage() {
  const modules = await getPageModules("home");

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">首页管理</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          通过固定模块方式维护 Hero、卖点、推荐分类和推荐产品，后续这里会接排序、开关和推荐内容选择器。
        </p>
      </section>

      {modules.map((module) => {
        const featured = extractFeaturedIds(module.payloadJson);

        return (
          <ModuleEditor
            key={module.moduleKey}
            description={module.moduleNameEn}
            enabled={module.isEnabled}
            featuredCategoryIds={featured.featuredCategoryIds}
            featuredProductIds={featured.featuredProductIds}
            sortOrder={module.sortOrder}
            title={module.moduleNameZh}
          />
        );
      })}
    </div>
  );
}

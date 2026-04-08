import { getPageModules } from "@/features/pages/queries";

export default async function AdminAboutPage() {
  const modules = await getPageModules("about");

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">关于我们</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          当前使用演示包默认模块渲染，后续会接企业简介、工厂图片、证书和设备管理。
        </p>
      </section>

      {modules.map((module) => (
        <article
          key={module.moduleKey}
          className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-stone-950">
            {module.moduleNameZh}
          </h3>
          <p className="mt-2 text-sm text-stone-600">{module.moduleNameEn}</p>
        </article>
      ))}
    </div>
  );
}

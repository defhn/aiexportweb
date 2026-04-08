import { getPageModules } from "@/features/pages/queries";

export default async function AdminContactPage() {
  const modules = await getPageModules("contact");

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">联系我们</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          当前页面会承接询盘入口和联系资料，后续会接 Brevo 通知、Turnstile 和附件上传规则。
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

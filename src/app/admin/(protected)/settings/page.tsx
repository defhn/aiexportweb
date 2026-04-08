import { getSiteSettings } from "@/features/settings/queries";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">站点设置</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          这里会统一管理公司信息、联系方式、页脚资料和默认 SEO 设置，当前先使用行业演示包的默认值渲染。
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            公司英文名
          </p>
          <p className="mt-3 text-lg font-semibold text-stone-950">
            {settings.companyNameEn}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            询盘邮箱
          </p>
          <p className="mt-3 text-lg font-semibold text-stone-950">
            {settings.email}
          </p>
        </article>
      </div>
    </div>
  );
}

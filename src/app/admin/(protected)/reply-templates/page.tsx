import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { getFeatureGate } from "@/features/plans/access";
import {
  deleteReplyTemplate,
  saveReplyTemplate,
} from "@/features/reply-templates/actions";
import { listReplyTemplates } from "@/features/reply-templates/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

export const dynamic = "force-dynamic";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

type AdminReplyTemplatesPageProps = {
  searchParams?: Promise<{ saved?: string; deleted?: string }>;
};

export default async function AdminReplyTemplatesPage({
  searchParams,
}: AdminReplyTemplatesPageProps) {
  const currentSite = await getCurrentSiteFromRequest();
  const gate = await getFeatureGate("reply_templates", currentSite.plan, currentSite.id);

  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }

  const params = (await searchParams) ?? {};
  const templates = await listReplyTemplates(currentSite.id);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">回复模板</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          在此管理邮件回复模板，可在询盘页面快速引用，提升响应效率。支持中英文双语模板，英文模板为必填项。
        </p>
        {params.saved ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            模板已保存。
          </p>
        ) : null}
        {params.deleted ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            模板已删除。
          </p>
        ) : null}
      </section>

      {/* AI 联动说明 */}
      <section className="rounded-2xl border border-blue-100 bg-blue-50 px-6 py-4">
        <p className="text-sm font-semibold text-blue-800">💡 这些模板会影响 AI 的回复风格</p>
        <p className="mt-1 text-sm text-blue-700 leading-6">
          AI 不会直接套用模板，而是<strong>参考模板的语气、结构和称呼习惯</strong>，为每条询盘生成一封<strong>个性化</strong>的回复草稿。
          模板越完整，AI 回复越贴近你的真实风格。建议至少添加 1 个「报价咨询」和 1 个「样品申请」类型的模板。
        </p>
      </section>

      <form
        action={saveReplyTemplate}
        className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-stone-950">新建模板</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-stone-700">
            模板标题
            <input className={inputClassName} name="title" required />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            分类
            <input
              className={inputClassName}
              name="category"
              placeholder="quotation / sample / technical"
            />
          </label>
          <label className="block text-sm font-medium text-stone-700 md:col-span-2">
            中文内容
            <textarea className={`${inputClassName} min-h-24`} name="contentZh" />
          </label>
          <label className="block text-sm font-medium text-stone-700 md:col-span-2">
            英文内容（必填）
            <textarea
              className={`${inputClassName} min-h-40`}
              name="contentEn"
              placeholder="Hello {{name}},"
              required
            />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            适用场景
            <input className={inputClassName} name="applicableScene" placeholder="quotation" />
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            type="submit"
          >
            保存模板
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {templates.map((template) => (
          <article
            key={template.id}
            className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <form action={saveReplyTemplate} className="grid gap-4 md:grid-cols-2">
              <input name="id" type="hidden" value={template.id} />
              <label className="block text-sm font-medium text-stone-700">
                模板标题
                <input
                  className={inputClassName}
                  defaultValue={template.title}
                  name="title"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                分类
                <input
                  className={inputClassName}
                  defaultValue={template.category ?? ""}
                  name="category"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                中文内容
                <textarea
                  className={`${inputClassName} min-h-24`}
                  defaultValue={template.contentZh ?? ""}
                  name="contentZh"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                英文内容（必填）
                <textarea
                  className={`${inputClassName} min-h-40`}
                  defaultValue={template.contentEn}
                  name="contentEn"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                适用场景
                <input
                  className={inputClassName}
                  defaultValue={template.applicableScene ?? ""}
                  name="applicableScene"
                />
              </label>
              <div className="flex flex-wrap items-end justify-end gap-3 md:col-span-2">
                <button
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                  type="submit"
                >
                  保存更改
                </button>
              </div>
            </form>

            <form action={deleteReplyTemplate} className="mt-3 flex justify-end">
              <input name="id" type="hidden" value={template.id} />
              <button
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                type="submit"
              >
                删除模板
              </button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}

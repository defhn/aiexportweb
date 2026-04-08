import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { getFeatureGate } from "@/features/plans/access";
import {
  deleteReplyTemplate,
  saveReplyTemplate,
} from "@/features/reply-templates/actions";
import { listReplyTemplates } from "@/features/reply-templates/queries";

export const dynamic = "force-dynamic";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

type AdminReplyTemplatesPageProps = {
  searchParams?: Promise<{ saved?: string; deleted?: string }>;
};

export default async function AdminReplyTemplatesPage({
  searchParams,
}: AdminReplyTemplatesPageProps) {
  const gate = await getFeatureGate("reply_templates");

  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }

  const params = (await searchParams) ?? {};
  const templates = await listReplyTemplates();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">回复模板</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          统一管理报价、打样、技术沟通等英文回复模板，方便助理和业务员快速复制使用。
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
            中文说明
            <textarea className={`${inputClassName} min-h-24`} name="contentZh" />
          </label>
          <label className="block text-sm font-medium text-stone-700 md:col-span-2">
            英文模板正文
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
                中文说明
                <textarea
                  className={`${inputClassName} min-h-24`}
                  defaultValue={template.contentZh ?? ""}
                  name="contentZh"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                英文模板正文
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
                  保存修改
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

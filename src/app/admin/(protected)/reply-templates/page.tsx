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
        <h2 className="text-2xl font-semibold text-stone-950">閸ョ偛顦插Ο鈩冩緲</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          缂佺喍绔寸粻锛勬倞閹躲儰鐜妴浣瑰ⅵ閺嶆灚鈧焦濡ч張顖涚煛闁氨鐡戦懟杈ㄦ瀮閸ョ偛顦插Ο鈩冩緲閿涘本鏌熸笟鍨И閻炲棗鎷版稉姘閸涙ê鎻╅柅鐔奉槻閸掓湹濞囬悽銊ｂ偓?        </p>
        {params.saved ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            濡剝婢樺韫箽鐎涙ǜ鈧�?          </p>
        ) : null}
        {params.deleted ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            濡剝婢樺鎻掑灩闂勩們鈧�?          </p>
        ) : null}
      </section>

      <form
        action={saveReplyTemplate}
        className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-stone-950">閺傛澘缂撳Ο鈩冩緲</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-stone-700">
            濡剝婢橀弽鍥暯
            <input className={inputClassName} name="title" required />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            閸掑棛琚�
            <input
              className={inputClassName}
              name="category"
              placeholder="quotation / sample / technical"
            />
          </label>
          <label className="block text-sm font-medium text-stone-700 md:col-span-2">
            娑擃厽鏋冪拠瀛樻
            <textarea className={`${inputClassName} min-h-24`} name="contentZh" />
          </label>
          <label className="block text-sm font-medium text-stone-700 md:col-span-2">
            閼昏鲸鏋冨Ο鈩冩緲濮濓絾鏋�
            <textarea
              className={`${inputClassName} min-h-40`}
              name="contentEn"
              placeholder="Hello {{name}},"
              required
            />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            闁倻鏁ら崷鐑樻珯
            <input className={inputClassName} name="applicableScene" placeholder="quotation" />
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            type="submit"
          >
            娣囨繂鐡ㄥΟ鈩冩緲
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
                濡剝婢橀弽鍥暯
                <input
                  className={inputClassName}
                  defaultValue={template.title}
                  name="title"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                閸掑棛琚�
                <input
                  className={inputClassName}
                  defaultValue={template.category ?? ""}
                  name="category"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                娑擃厽鏋冪拠瀛樻
                <textarea
                  className={`${inputClassName} min-h-24`}
                  defaultValue={template.contentZh ?? ""}
                  name="contentZh"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                閼昏鲸鏋冨Ο鈩冩緲濮濓絾鏋�
                <textarea
                  className={`${inputClassName} min-h-40`}
                  defaultValue={template.contentEn}
                  name="contentEn"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                闁倻鏁ら崷鐑樻珯
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
                  娣囨繂鐡ㄦ穱顔芥暭
                </button>
              </div>
            </form>

            <form action={deleteReplyTemplate} className="mt-3 flex justify-end">
              <input name="id" type="hidden" value={template.id} />
              <button
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                type="submit"
              >
                閸掔娀娅庡Ο鈩冩緲
              </button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}

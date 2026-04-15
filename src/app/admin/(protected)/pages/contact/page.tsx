import { savePageModules } from "@/features/pages/actions";
import { getPageModules } from "@/features/pages/queries";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

const textareaClassName = `${inputClassName} min-h-28`;

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export default async function AdminContactPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const action = savePageModules.bind(null, "contact");
  const modules = await getPageModules("contact", currentSite.seedPackKey, currentSite.id);
  const module = modules.find((item) => item.moduleKey === "contact-card");

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">
          {"联系我们"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "在这里维护 Contact 页面的联系说明、业务对接方式和前台展示文案，保存后会直接同步到官网。"
          }
        </p>
      </section>

      <form action={action} className="space-y-6">
        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-stone-950">
                {"联系信息卡片"}
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                {
                  "用于维护 Contact 页面的主标题和说明文案，前台会直接调用这里的内容。"
                }
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <input
                defaultChecked={module?.isEnabled ?? true}
                name="contact-card__enabled"
                type="checkbox"
              />
              {"启用"}
            </label>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="block text-sm font-medium text-stone-700">
              {"排序"}
              <input
                className={inputClassName}
                defaultValue={module?.sortOrder ?? 10}
                name="contact-card__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"主标题"}
              <input
                className={inputClassName}
                defaultValue={readString(module?.payloadJson ?? {}, "title")}
                name="contact-card__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"描述"}
              <textarea
                className={textareaClassName}
                defaultValue={readString(
                  module?.payloadJson ?? {},
                  "description",
                )}
                name="contact-card__description"
              />
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            type="submit"
          >
            {"保存 Contact 页面"}
          </button>
        </div>
      </form>
    </div>
  );
}

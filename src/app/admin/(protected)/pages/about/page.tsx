import { savePageModules } from "@/features/pages/actions";
import { getPageModules } from "@/features/pages/queries";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

const textareaClassName = `${inputClassName} min-h-28`;

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export default async function AdminAboutPage() {
  const action = savePageModules.bind(null, "about");
  const modules = await getPageModules("about");
  const module = modules.find((item) => item.moduleKey === "company-story");

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">
          {"关于我们"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "在这里维护 About 页面的公司介绍、品牌故事和对外展示文案，保存后会同步到前台页面。"
          }
        </p>
      </section>

      <form action={action} className="space-y-6">
        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-stone-950">
                {"公司故事"}
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                {
                  "用于维护 About 页面的主标题和公司简介，前台会直接使用这里的内容。"
                }
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <input
                defaultChecked={module?.isEnabled ?? true}
                name="company-story__enabled"
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
                name="company-story__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"主标题"}
              <input
                className={inputClassName}
                defaultValue={readString(module?.payloadJson ?? {}, "title")}
                name="company-story__title"
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
                name="company-story__description"
              />
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            type="submit"
          >
            {"保存 About 页面"}
          </button>
        </div>
      </form>
    </div>
  );
}

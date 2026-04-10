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
          {"\u5173\u4e8e\u6211\u4eec"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "\u5728\u8fd9\u91cc\u7ef4\u62a4 About \u9875\u9762\u7684\u516c\u53f8\u4ecb\u7ecd\u3001\u54c1\u724c\u6545\u4e8b\u548c\u5bf9\u5916\u5c55\u793a\u6587\u6848\uff0c\u4fdd\u5b58\u540e\u4f1a\u540c\u6b65\u5230\u524d\u53f0\u9875\u9762\u3002"
          }
        </p>
      </section>

      <form action={action} className="space-y-6">
        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-stone-950">
                {"\u516c\u53f8\u6545\u4e8b"}
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                {
                  "\u7528\u4e8e\u7ef4\u62a4 About \u9875\u9762\u7684\u4e3b\u6807\u9898\u548c\u516c\u53f8\u7b80\u4ecb\uff0c\u524d\u53f0\u4f1a\u76f4\u63a5\u4f7f\u7528\u8fd9\u91cc\u7684\u5185\u5bb9\u3002"
                }
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <input
                defaultChecked={module?.isEnabled ?? true}
                name="company-story__enabled"
                type="checkbox"
              />
              {"\u542f\u7528"}
            </label>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="block text-sm font-medium text-stone-700">
              {"\u6392\u5e8f"}
              <input
                className={inputClassName}
                defaultValue={module?.sortOrder ?? 10}
                name="company-story__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"\u4e3b\u6807\u9898"}
              <input
                className={inputClassName}
                defaultValue={readString(module?.payloadJson ?? {}, "title")}
                name="company-story__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"\u63cf\u8ff0"}
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
            {"\u4fdd\u5b58 About \u9875\u9762"}
          </button>
        </div>
      </form>
    </div>
  );
}

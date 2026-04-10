import { savePageModules } from "@/features/pages/actions";
import { getPageModules } from "@/features/pages/queries";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

const textareaClassName = `${inputClassName} min-h-28`;

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

export default async function AdminContactPage() {
  const action = savePageModules.bind(null, "contact");
  const modules = await getPageModules("contact");
  const module = modules.find((item) => item.moduleKey === "contact-card");

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">
          {"\u8054\u7cfb\u6211\u4eec"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "\u5728\u8fd9\u91cc\u7ef4\u62a4 Contact \u9875\u9762\u7684\u8054\u7cfb\u8bf4\u660e\u3001\u4e1a\u52a1\u5bf9\u63a5\u65b9\u5f0f\u548c\u524d\u53f0\u5c55\u793a\u6587\u6848\uff0c\u4fdd\u5b58\u540e\u4f1a\u76f4\u63a5\u540c\u6b65\u5230\u5b98\u7f51\u3002"
          }
        </p>
      </section>

      <form action={action} className="space-y-6">
        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-stone-950">
                {"\u8054\u7cfb\u4fe1\u606f\u5361\u7247"}
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                {
                  "\u7528\u4e8e\u7ef4\u62a4 Contact \u9875\u9762\u7684\u4e3b\u6807\u9898\u548c\u8bf4\u660e\u6587\u6848\uff0c\u524d\u53f0\u4f1a\u76f4\u63a5\u8c03\u7528\u8fd9\u91cc\u7684\u5185\u5bb9\u3002"
                }
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <input
                defaultChecked={module?.isEnabled ?? true}
                name="contact-card__enabled"
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
                name="contact-card__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"\u4e3b\u6807\u9898"}
              <input
                className={inputClassName}
                defaultValue={readString(module?.payloadJson ?? {}, "title")}
                name="contact-card__title"
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
            {"\u4fdd\u5b58 Contact \u9875\u9762"}
          </button>
        </div>
      </form>
    </div>
  );
}

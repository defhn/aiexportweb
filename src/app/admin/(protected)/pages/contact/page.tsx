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
        <h2 className="text-2xl font-semibold text-stone-950">閼辨梻閮撮幋鎴滄粦</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          缂佸瓨濮㈤崗顒€绱戠粩?Contact 妞ょ敻娼伴弽鍥暯閸滃苯绱╃€靛吋鏋冨鍫涒偓?        </p>
      </section>

      <form action={action} className="space-y-6">
        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-stone-950">閼辨梻閮村鏇烆嚤濡€虫健</h3>
              <p className="mt-2 text-sm text-stone-600">
                閼辨梻閮撮弬鐟扮础閺堫剝闊╅弶銉ㄥ殰缁旀瑧鍋ｇ拋鍓х枂閿涘矁绻栭柌灞藉涧缁狅繝銆夐棃銏＄垼妫版ê鎷伴幓蹇氬牚閵�?              </p>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <input
                defaultChecked={module?.isEnabled ?? true}
                name="contact-card__enabled"
                type="checkbox"
              />
              閸氼垳鏁�
            </label>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="block text-sm font-medium text-stone-700">
              閹烘帒绨�
              <input
                className={inputClassName}
                defaultValue={module?.sortOrder ?? 10}
                name="contact-card__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閺嶅洭顣�
              <input
                className={inputClassName}
                defaultValue={readString(module?.payloadJson ?? {}, "title")}
                name="contact-card__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閹诲繗鍫�
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
            娣囨繂鐡� Contact 妞ょ敻娼�
          </button>
        </div>
      </form>
    </div>
  );
}

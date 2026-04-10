import { PlanBadge } from "@/components/admin/plan-badge";
import {
  getCurrentSitePlan,
  getPricingHref,
  getSalesContactHref,
} from "@/features/plans/access";
import { saveSiteSettings } from "@/features/settings/actions";
import { getSiteSettings } from "@/features/settings/queries";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

const textareaClassName = `${inputClassName} min-h-28`;

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  const currentPlan = getCurrentSitePlan();
  const pricingHref = getPricingHref();
  const salesContactHref = getSalesContactHref();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">
          {"\u7ad9\u70b9\u8bbe\u7f6e"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "\u914d\u7f6e\u7ad9\u70b9\u57fa\u7840\u4fe1\u606f\u3001\u8054\u7cfb\u8d44\u6599\u548c SEO \u8bbe\u7f6e\uff0c\u8fd9\u4e9b\u5185\u5bb9\u4f1a\u540c\u6b65\u5f71\u54cd\u524d\u53f0\u5c55\u793a\u4e0e\u641c\u7d22\u5f15\u64ce\u8f93\u51fa\u3002"
          }
        </p>
      </section>

      <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-stone-950">
            {"\u5f53\u524d\u5957\u9910"}
          </h3>
          <PlanBadge plan={currentPlan} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">
            <p className="font-medium text-stone-950">
              {"\u5347\u7ea7\u8054\u7cfb\u5730\u5740"}
            </p>
            <p className="mt-2 break-all">{salesContactHref}</p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">
            <p className="font-medium text-stone-950">
              {"\u5b9a\u4ef7\u9875\u72b6\u6001"}
            </p>
            <p className="mt-2">{pricingHref ? "\u5df2\u5f00\u542f" : "\u5df2\u5173\u95ed"}</p>
            <p className="mt-2 break-all">
              {pricingHref ?? "\u5f53\u524d\u672a\u5f00\u653e /pricing"}
            </p>
          </div>
        </div>
      </section>

      <form action={saveSiteSettings} className="space-y-6">
        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">
            {"\u516c\u53f8\u4fe1\u606f"}
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              {"\u516c\u53f8\u540d\u79f0\uff08\u4e2d\u6587\uff09"}
              <input
                className={inputClassName}
                defaultValue={settings.companyNameZh}
                name="companyNameZh"
                required
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"Company Name\uff08\u82f1\u6587\uff09"}
              <input
                className={inputClassName}
                defaultValue={settings.companyNameEn}
                name="companyNameEn"
                required
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"\u516c\u53f8\u6807\u8bed\uff08\u4e2d\u6587\uff09"}
              <textarea
                className={textareaClassName}
                defaultValue={settings.taglineZh}
                name="taglineZh"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"Tagline\uff08\u82f1\u6587\uff09"}
              <textarea
                className={textareaClassName}
                defaultValue={settings.taglineEn}
                name="taglineEn"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">
            {"\u8054\u7cfb\u8d44\u6599"}
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              {"\u90ae\u7bb1"}
              <input
                className={inputClassName}
                defaultValue={settings.email}
                name="email"
                required
                type="email"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"\u7535\u8bdd"}
              <input
                className={inputClassName}
                defaultValue={settings.phone}
                name="phone"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"WhatsApp"}
              <input
                className={inputClassName}
                defaultValue={settings.whatsapp}
                name="whatsapp"
              />
            </label>
            <div />
            <label className="block text-sm font-medium text-stone-700">
              {"\u5730\u5740\uff08\u4e2d\u6587\uff09"}
              <textarea
                className={textareaClassName}
                defaultValue={settings.addressZh}
                name="addressZh"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {"Address\uff08\u82f1\u6587\uff09"}
              <textarea
                className={textareaClassName}
                defaultValue={settings.addressEn}
                name="addressEn"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50/40 p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-stone-950">
              {"SEO \u57fa\u7840\u8bbe\u7f6e"}
            </h3>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {"Google \u641c\u7d22\u5c55\u793a"}
            </span>
          </div>
          <p className="mb-5 text-sm leading-6 text-stone-500">
            {
              "\u8fd9\u91cc\u914d\u7f6e\u7ad9\u70b9\u9ed8\u8ba4\u7684 SEO \u6807\u9898\u6a21\u677f\u3001\u57df\u540d\u548c\u9ed8\u8ba4 OG \u56fe\uff0c\u4f1a\u5f71\u54cd\u641c\u7d22\u5f15\u64ce\u6458\u8981\u4e0e\u793e\u4ea4\u5206\u4eab\u9884\u89c8\u3002"
            }
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {"\u7ad9\u70b9 URL"}
              <input
                className={inputClassName}
                defaultValue={"siteUrl" in settings ? (settings.siteUrl as string) : ""}
                name="siteUrl"
                placeholder="https://www.your-domain.com"
                type="url"
              />
            </label>

            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {"SEO \u6807\u9898\u6a21\u677f"}
              <input
                className={inputClassName}
                defaultValue={
                  "seoTitleTemplate" in settings
                    ? (settings.seoTitleTemplate as string)
                    : ""
                }
                name="seoTitleTemplate"
                placeholder="%s | Your Brand CNC Machining"
              />
              <span className="mt-1 block text-xs text-stone-400">
                {"\u4f8b\u5982\uff1a"}
                <code className="rounded bg-stone-100 px-1">%s | Acme CNC</code>{" "}
                {"\u4f1a\u8f93\u51fa\u6210 "}
                {"\"Contact Us | Acme CNC\""}
              </span>
            </label>

            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {"\u9ed8\u8ba4 OG \u56fe\u7247\u5a92\u4f53 ID\uff08\u53ef\u9009\uff09"}
              <input
                className={inputClassName}
                defaultValue={
                  "seoOgImageMediaId" in settings && settings.seoOgImageMediaId
                    ? String(settings.seoOgImageMediaId)
                    : ""
                }
                name="seoOgImageMediaId"
                placeholder="\u586b\u5199\u5a92\u4f53\u5e93\u56fe\u7247 ID\uff0c\u4f8b\u5982 42"
                type="number"
              />
              <span className="mt-1 block text-xs text-stone-400">
                {
                  "\u5efa\u8bae\u4f7f\u7528 1200 x 630 \u5c3a\u5bf8\u7684\u6a2a\u7248\u56fe\u7247\uff0c\u586b\u5199\u5a92\u4f53\u5e93\u4e2d\u5bf9\u5e94\u7d20\u6750\u7684 ID \u540e\uff0cTwitter \u548c Facebook \u5206\u4eab\u9884\u89c8\u4f1a\u4f18\u5148\u4f7f\u7528\u8fd9\u5f20\u56fe\u3002"
                }
              </span>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            type="submit"
          >
            {"\u4fdd\u5b58\u7ad9\u70b9\u8bbe\u7f6e"}
          </button>
        </div>
      </form>
    </div>
  );
}

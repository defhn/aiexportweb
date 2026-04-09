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
        <h2 className="text-2xl font-semibold text-stone-950">站点设置</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          这里统一维护公司名称、页眉页脚联系方式，以及公开站点使用的基础品牌信息�?        </p>
      </section>

      <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-stone-950">套餐与销售页</h3>
          <PlanBadge plan={currentPlan} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">
            <p className="font-medium text-stone-950">升级联系地址</p>
            <p className="mt-2 break-all">{salesContactHref}</p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">
            <p className="font-medium text-stone-950">定价页状�?/p>
            <p className="mt-2">{pricingHref ? "已开�? : "已关�?}</p>
            <p className="mt-2 break-all">{pricingHref ?? "当前未开�?/pricing"}</p>
          </div>
        </div>
      </section>

      <form action={saveSiteSettings} className="space-y-6">
        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">公司信息</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              公司名称（中文）
              <input
                className={inputClassName}
                defaultValue={settings.companyNameZh}
                name="companyNameZh"
                required
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Company Name（英文）
              <input
                className={inputClassName}
                defaultValue={settings.companyNameEn}
                name="companyNameEn"
                required
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              品牌标语（中文）
              <textarea
                className={textareaClassName}
                defaultValue={settings.taglineZh}
                name="taglineZh"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Tagline（英文）
              <textarea
                className={textareaClassName}
                defaultValue={settings.taglineEn}
                name="taglineEn"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">联系方式</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              询盘邮箱
              <input
                className={inputClassName}
                defaultValue={settings.email}
                name="email"
                required
                type="email"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              电话
              <input
                className={inputClassName}
                defaultValue={settings.phone}
                name="phone"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              WhatsApp
              <input
                className={inputClassName}
                defaultValue={settings.whatsapp}
                name="whatsapp"
              />
            </label>
            <div />
            <label className="block text-sm font-medium text-stone-700">
              地址（中文）
              <textarea
                className={textareaClassName}
                defaultValue={settings.addressZh}
                name="addressZh"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Address（英文）
              <textarea
                className={textareaClassName}
                defaultValue={settings.addressEn}
                name="addressEn"
              />
            </label>
          </div>
        </section>

        {/* ——�?SEO 全局配置 ——�?*/}
        <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50/40 p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-stone-950">SEO 全局配置</h3>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Google 搜索优化</span>
          </div>
          <p className="mb-5 text-sm leading-6 text-stone-500">
            填写后所有页面自动生效，无需改代码。企业自定义关键词、标题模板和默认分享图�?          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              网站域名（必填，用于 Canonical �?Sitemap�?              <input
                className={inputClassName}
                defaultValue={"siteUrl" in settings ? (settings.siteUrl as string) : ""}
                name="siteUrl"
                placeholder="https://www.your-domain.com"
                type="url"
              />
              <span className="mt-1 block text-xs text-stone-400">格式示例：https://acme.com（无尾斜杠）</span>
            </label>

            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              页面标题模板�?s 为各页面的子标题�?              <input
                className={inputClassName}
                defaultValue={"seoTitleTemplate" in settings ? (settings.seoTitleTemplate as string) : ""}
                name="seoTitleTemplate"
                placeholder="%s | Your Brand CNC Machining"
              />
              <span className="mt-1 block text-xs text-stone-400">
                示例�?code className="rounded bg-stone-100 px-1">%s | Acme CNC</code>
                {" "}�?联系页将显示�?"Contact Us | Acme CNC"
              </span>
            </label>

            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              默认 OG 分享图片 ID（从媒体库获取）
              <input
                className={inputClassName}
                defaultValue={"seoOgImageMediaId" in settings && settings.seoOgImageMediaId ? String(settings.seoOgImageMediaId) : ""}
                name="seoOgImageMediaId"
                placeholder="填入图片资产 ID，例�?42"
                type="number"
              />
              <span className="mt-1 block text-xs text-stone-400">
                前往【媒体库】上传一�?1200×630 的品牌图，复制其数字 ID 填入此处�?                Twitter / Facebook 分享链接时会自动使用此图�?              </span>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            type="submit"
          >
            保存站点设置
          </button>
        </div>
      </form>
    </div>
  );
}


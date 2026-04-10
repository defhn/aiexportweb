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
          配置站点基础信息、联系资料和 SEO 设置，这些内容会同步影响前台展示与搜索引擎输出。        </p>
      </section>

      <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-stone-950">当前套餐</h3>
          <PlanBadge plan={currentPlan} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">
            <p className="font-medium text-stone-950">升级联系地址</p>
            <p className="mt-2 break-all">{salesContactHref}</p>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-7 text-stone-700">
            <p className="font-medium text-stone-950">定价页状态</p>
            <p className="mt-2">{pricingHref ? "已开启" : "已关闭"}</p>
            <p className="mt-2 break-all">{pricingHref ?? "当前未开放 /pricing"}</p>
          </div>
        </div>
      </section>

      <form action={saveSiteSettings} className="space-y-6">
        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">閸忣剙寰冩穱鈩冧紖</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              閸忣剙寰冮崥宥囆為敍鍫滆厬閺傚浄绱?
              <input
                className={inputClassName}
                defaultValue={settings.companyNameZh}
                name="companyNameZh"
                required
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Company Name閿涘牐瀚抽弬鍥风礆
              <input
                className={inputClassName}
                defaultValue={settings.companyNameEn}
                name="companyNameEn"
                required
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閸濅胶澧濋弽鍥嚔閿涘牅鑵戦弬鍥风礆
              <textarea
                className={textareaClassName}
                defaultValue={settings.taglineZh}
                name="taglineZh"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Tagline閿涘牐瀚抽弬鍥风礆
              <textarea
                className={textareaClassName}
                defaultValue={settings.taglineEn}
                name="taglineEn"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-950">閼辨梻閮撮弬鐟扮础</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              鐠囥垻娲忛柇顔绢唸
              <input
                className={inputClassName}
                defaultValue={settings.email}
                name="email"
                required
                type="email"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閻絻鐦?
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
              閸︽澘娼冮敍鍫滆厬閺傚浄绱?
              <textarea
                className={textareaClassName}
                defaultValue={settings.addressZh}
                name="addressZh"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Address閿涘牐瀚抽弬鍥风礆
              <textarea
                className={textareaClassName}
                defaultValue={settings.addressEn}
                name="addressEn"
              />
            </label>
          </div>
        </section>

        {/* 閳ユ柡鈧柡鈧?SEO 閸忋劌鐪柊宥囩枂 閳ユ柡鈧柡鈧?*/}
        <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50/40 p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-stone-950">SEO 閸忋劌鐪柊宥囩枂</h3>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Google 閹兼粎鍌ㄦ导妯哄</span>
          </div>
          <p className="mb-5 text-sm leading-6 text-stone-500">
            婵夘偄鍟撻崥搴㈠閺堝銆夐棃銏ｅ殰閸斻劎鏁撻弫鍫礉閺冪娀娓堕弨閫涘敩閻降鈧倷绱掓稉姘冲殰鐎规矮绠熼崗鎶芥暛鐠囧秲鈧焦鐖ｆ０妯荒侀弶鍨嫲姒涙顓婚崚鍡曢煩閸ヤ勘鈧?          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              站点 URL
              <input
                className={inputClassName}
                defaultValue={"siteUrl" in settings ? (settings.siteUrl as string) : ""}
                name="siteUrl"
                placeholder="https://www.your-domain.com"
                type="url"
              />
            </label>

            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              SEO 标题模板
              <input
                className={inputClassName}
                defaultValue={"seoTitleTemplate" in settings ? (settings.seoTitleTemplate as string) : ""}
                name="seoTitleTemplate"
                placeholder="%s | Your Brand CNC Machining"
              />
              <span className="mt-1 block text-xs text-stone-400">
                例如：<code className="rounded bg-stone-100 px-1">%s | Acme CNC</code>{" "}会输出成 "Contact Us | Acme CNC"
              </span>
            </label>

            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              姒涙顓?OG 閸掑棔闊╅崶鍓у ID閿涘牅绮犳刊鎺嶇秼鎼存捁骞忛崣鏍电礆
              <input
                className={inputClassName}
                defaultValue={"seoOgImageMediaId" in settings && settings.seoOgImageMediaId ? String(settings.seoOgImageMediaId) : ""}
                name="seoOgImageMediaId"
                placeholder="婵夘偄鍙嗛崶鍓у鐠у嫪楠?ID閿涘奔绶ユ俊?42"
                type="number"
              />
              <span className="mt-1 block text-xs text-stone-400">
                閸撳秴绶氶妴鎰崯娴ｆ挸绨遍妴鎴滅瑐娴肩姳绔村?1200鑴?30 閻ㄥ嫬鎼ч悧灞芥禈閿涘苯顦查崚璺哄従閺佹澘鐡?ID 婵夘偄鍙嗗銈咁槱閵?                Twitter / Facebook 閸掑棔闊╅柧鐐复閺冩湹绱伴懛顏勫З娴ｈ法鏁ゅ銈呮禈閵?              </span>
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


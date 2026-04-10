import type { ReactNode } from "react";

import { savePageModules } from "@/features/pages/actions";
import { getPageModules } from "@/features/pages/queries";
import { getAllCategories, getAllProducts } from "@/features/products/queries";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

const textareaClassName = `${inputClassName} min-h-28`;

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

function readStringArray(payload: Record<string, unknown>, key: string) {
  const value = payload[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function ModuleCard({
  title,
  description,
  moduleKey,
  enabled,
  children,
}: {
  title: string;
  description: string;
  moduleKey: string;
  enabled: boolean;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
          <p className="mt-2 text-sm text-stone-600">{description}</p>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <input defaultChecked={enabled} name={`${moduleKey}__enabled`} type="checkbox" />
          閸氼垳鏁?
        </label>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

type CheckboxItem = {
  slug: string;
  nameZh: string;
  nameEn: string;
};

function SlugCheckboxGrid({
  moduleKey,
  selected,
  items,
}: {
  moduleKey: string;
  selected: string[];
  items: CheckboxItem[];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <label
          key={item.slug}
          className="flex items-start gap-3 rounded-2xl border border-stone-200 p-4 text-sm text-stone-700"
        >
          <input
            defaultChecked={selected.includes(item.slug)}
            name={`${moduleKey}__slugs`}
            type="checkbox"
            value={item.slug}
          />
          <span>
            <span className="block font-medium text-stone-950">{item.nameZh}</span>
            <span className="mt-1 block text-xs text-stone-500">{item.nameEn}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

export default async function AdminHomeModulesPage() {
  const action = savePageModules.bind(null, "home");
  const [modules, categories, products] = await Promise.all([
    getPageModules("home"),
    getAllCategories(),
    getAllProducts(),
  ]);

  const moduleMap = new Map(modules.map((module) => [module.moduleKey, module]));
  const heroModule = moduleMap.get("hero");
  const strengthsModule = moduleMap.get("strengths");
  const trustSignalsModule = moduleMap.get("trust-signals");
  const featuredCategoryModule = moduleMap.get("featured-categories");
  const factoryCapabilityModule = moduleMap.get("factory-capability");
  const qualityModule = moduleMap.get("quality-certifications");
  const featuredProductModule = moduleMap.get("featured-products");
  const processModule = moduleMap.get("process-steps");
  const latestInsightsModule = moduleMap.get("latest-insights");
  const finalCtaModule = moduleMap.get("final-cta");

  const featuredCategorySlugs = readStringArray(
    featuredCategoryModule?.payloadJson ?? {},
    "slugs",
  );
  const featuredProductSlugs = readStringArray(
    featuredProductModule?.payloadJson ?? {},
    "slugs",
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">妫ｆ牠銆夌粻锛勬倞</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          閸︺劏绻栭柌宀€绮烘稉鈧紒瀛樺Б妫ｆ牠銆夊Ο鈥虫健閻ㄥ嫬绱戦崗鐐解偓浣瑰笓鎼村繈鈧焦鏋冨鍫濇嫲閹恒劏宕橀崘鍛啇閵嗗倸澧犻崣棰佺窗閹稿鍙庢潻娆撳櫡閻ㄥ嫰銆庢惔蹇曟纯閹恒儲瑕嗛弻鎾扁偓?        </p>
      </section>

      <form action={action} className="space-y-6">

        {/* 閳ユ柡鈧柡鈧?妫ｆ牠銆?SEO 閳ユ柡鈧柡鈧?*/}
        <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50/40 p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-stone-950">妫ｆ牠銆?SEO</h3>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Google 閹兼粎鍌ㄧ紒鎾寸亯</span>
          </div>
          <p className="mb-5 text-sm leading-6 text-stone-500">
            鏉╂瑩鍣锋繅顐㈠晸閻ㄥ嫬鍞寸€归€涚窗閻╁瓨甯撮崙铏瑰箛閸?Google 閹兼粎鍌ㄧ紒鎾寸亯闁插被鈧倻鏆€缁屽搫鍨担璺ㄦ暏缁旀瑧鍋ｉ崗銊ョ湰姒涙顓婚崐绗衡偓?          </p>
          <div className="grid gap-4">
            <label className="block text-sm font-medium text-stone-700">
              妫ｆ牠銆?SEO 閺嶅洭顣介敍?5閳?0 鐎涙顑侀敍?              <input
                className={inputClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "seoTitle")}
                name="hero__seoTitle"
                placeholder="娓氬绱癈NC Precision Machining | Acme Manufacturing"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              妫ｆ牠銆?SEO 閹诲繗鍫敍?50閳?60 鐎涙顑侀敍?              <textarea
                className={textareaClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "seoDescription")}
                name="hero__seoDescription"
                placeholder="娓氬绱癈ustom CNC machined parts with tolerances to 鍗?.005mm. ISO 9001. DDP shipping to 40+ countries."
              />
            </label>
          </div>
        </section>

        <ModuleCard
          title="Hero 首屏"
          description="控制首页第一屏标题、说明和两个按钮。"
          moduleKey="hero"
          enabled={heroModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              閹烘帒绨?
              <input
                className={inputClassName}
                defaultValue={heroModule?.sortOrder ?? 10}
                name="hero__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閻顣?
              <input
                className={inputClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "eyebrow")}
                name="hero__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閺嶅洭顣?
              <input
                className={inputClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "title")}
                name="hero__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閹诲繗鍫?
              <textarea
                className={textareaClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "description")}
                name="hero__description"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              娑撶粯瀵滈柦顔芥瀮濡?              <input
                className={inputClassName}
                defaultValue={readString(
                  heroModule?.payloadJson ?? {},
                  "primaryCtaLabel",
                )}
                name="hero__primaryCtaLabel"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              娑撶粯瀵滈柦顕€鎽奸幒?              <input
                className={inputClassName}
                defaultValue={readString(
                  heroModule?.payloadJson ?? {},
                  "primaryCtaHref",
                )}
                name="hero__primaryCtaHref"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              濞嗏剝瀵滈柦顔芥瀮濡?              <input
                className={inputClassName}
                defaultValue={readString(
                  heroModule?.payloadJson ?? {},
                  "secondaryCtaLabel",
                )}
                name="hero__secondaryCtaLabel"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              濞嗏剝瀵滈柦顕€鎽奸幒?              <input
                className={inputClassName}
                defaultValue={readString(
                  heroModule?.payloadJson ?? {},
                  "secondaryCtaHref",
                )}
                name="hero__secondaryCtaHref"
              />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title="核心优势"
          description="每行一条，前台会自动排成列表。"
          moduleKey="strengths"
          enabled={strengthsModule?.isEnabled ?? true}
        >
          <div className="grid gap-4">
            <label className="block text-sm font-medium text-stone-700">
              閹烘帒绨?
              <input
                className={inputClassName}
                defaultValue={strengthsModule?.sortOrder ?? 20}
                name="strengths__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閸楁牜鍋ｉ崚妤勩€?
              <textarea
                className={`${textareaClassName} min-h-40`}
                defaultValue={readStringArray(
                  strengthsModule?.payloadJson ?? {},
                  "items",
                ).join("\n")}
                name="strengths__items"
              />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title="品牌背书"
          description="用于滚动展示合作品牌、客户品牌或行业关键词。"
          moduleKey="trust-signals"
          enabled={trustSignalsModule?.isEnabled ?? true}
        >
          <div className="grid gap-4">
            <label className="block text-sm font-medium text-stone-700">
              閹烘帒绨?
              <input
                className={inputClassName}
                defaultValue={trustSignalsModule?.sortOrder ?? 30}
                name="trust-signals__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              濡€虫健閺嶅洭顣?
              <input
                className={inputClassName}
                defaultValue={readString(trustSignalsModule?.payloadJson ?? {}, "title")}
                name="trust-signals__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閸濅胶澧濋崚妤勩€?
              <textarea
                className={`${textareaClassName} min-h-40`}
                defaultValue={readStringArray(
                  trustSignalsModule?.payloadJson ?? {},
                  "items",
                ).join("\n")}
                name="trust-signals__items"
              />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title="推荐分类"
          description="控制首页分类模块的文案和要展示的分类。"
          moduleKey="featured-categories"
          enabled={featuredCategoryModule?.isEnabled ?? true}
        >
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-700">
                閹烘帒绨?
                <input
                  className={inputClassName}
                  defaultValue={featuredCategoryModule?.sortOrder ?? 40}
                  name="featured-categories__sortOrder"
                  type="number"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                閻顣?
                <input
                  className={inputClassName}
                  defaultValue={readString(
                    featuredCategoryModule?.payloadJson ?? {},
                    "eyebrow",
                  )}
                  name="featured-categories__eyebrow"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                閺嶅洭顣?
                <input
                  className={inputClassName}
                  defaultValue={readString(
                    featuredCategoryModule?.payloadJson ?? {},
                    "title",
                  )}
                  name="featured-categories__title"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                閹诲繗鍫?
                <textarea
                  className={textareaClassName}
                  defaultValue={readString(
                    featuredCategoryModule?.payloadJson ?? {},
                    "description",
                  )}
                  name="featured-categories__description"
                />
              </label>
            </div>
            <SlugCheckboxGrid
              items={categories.map((category) => ({
                slug: category.slug,
                nameZh: category.nameZh,
                nameEn: category.nameEn,
              }))}
              moduleKey="featured-categories"
              selected={featuredCategorySlugs}
            />
          </div>
        </ModuleCard>

        <ModuleCard
          title="工厂实力"
          description="控制工厂实力模块的标题、说明、卖点和两组统计数字。"
          moduleKey="factory-capability"
          enabled={factoryCapabilityModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              閹烘帒绨?
              <input
                className={inputClassName}
                defaultValue={factoryCapabilityModule?.sortOrder ?? 50}
                name="factory-capability__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閻顣?
              <input
                className={inputClassName}
                defaultValue={readString(
                  factoryCapabilityModule?.payloadJson ?? {},
                  "eyebrow",
                )}
                name="factory-capability__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閺嶅洭顣?
              <input
                className={inputClassName}
                defaultValue={readString(
                  factoryCapabilityModule?.payloadJson ?? {},
                  "title",
                )}
                name="factory-capability__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閹诲繗鍫?
              <textarea
                className={textareaClassName}
                defaultValue={readString(
                  factoryCapabilityModule?.payloadJson ?? {},
                  "description",
                )}
                name="factory-capability__description"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閸楁牜鍋ｉ崚妤勩€?
              <textarea
                className={`${textareaClassName} min-h-40`}
                defaultValue={readStringArray(
                  factoryCapabilityModule?.payloadJson ?? {},
                  "items",
                ).join("\n")}
                name="factory-capability__items"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              缂佺喕顓搁崐闂寸
              <input
                className={inputClassName}
                defaultValue={readString(
                  factoryCapabilityModule?.payloadJson ?? {},
                  "statOneValue",
                )}
                name="factory-capability__statOneValue"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              缂佺喕顓哥拠瀛樻娑撯偓
              <input
                className={inputClassName}
                defaultValue={readString(
                  factoryCapabilityModule?.payloadJson ?? {},
                  "statOneLabel",
                )}
                name="factory-capability__statOneLabel"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              缂佺喕顓搁崐闂寸癌
              <input
                className={inputClassName}
                defaultValue={readString(
                  factoryCapabilityModule?.payloadJson ?? {},
                  "statTwoValue",
                )}
                name="factory-capability__statTwoValue"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              缂佺喕顓哥拠瀛樻娴?              <input
                className={inputClassName}
                defaultValue={readString(
                  factoryCapabilityModule?.payloadJson ?? {},
                  "statTwoLabel",
                )}
                name="factory-capability__statTwoLabel"
              />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title="质量认证"
          description="每行格式为“标题|描述”，用于展示认证、审核和合规能力。"
          moduleKey="quality-certifications"
          enabled={qualityModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              閹烘帒绨?
              <input
                className={inputClassName}
                defaultValue={qualityModule?.sortOrder ?? 60}
                name="quality-certifications__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閻顣?
              <input
                className={inputClassName}
                defaultValue={readString(qualityModule?.payloadJson ?? {}, "eyebrow")}
                name="quality-certifications__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閺嶅洭顣?
              <input
                className={inputClassName}
                defaultValue={readString(qualityModule?.payloadJson ?? {}, "title")}
                name="quality-certifications__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閹诲繗鍫?
              <textarea
                className={textareaClassName}
                defaultValue={readString(
                  qualityModule?.payloadJson ?? {},
                  "description",
                )}
                name="quality-certifications__description"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閺夛紕娲伴崚妤勩€?
              <textarea
                className={`${textareaClassName} min-h-40`}
                defaultValue={readStringArray(
                  qualityModule?.payloadJson ?? {},
                  "items",
                ).join("\n")}
                name="quality-certifications__items"
              />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title="推荐产品"
          description="控制首页推荐产品模块的标题、按钮和产品选择。"
          moduleKey="featured-products"
          enabled={featuredProductModule?.isEnabled ?? true}
        >
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-700">
                閹烘帒绨?
                <input
                  className={inputClassName}
                  defaultValue={featuredProductModule?.sortOrder ?? 70}
                  name="featured-products__sortOrder"
                  type="number"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                閻顣?
                <input
                  className={inputClassName}
                  defaultValue={readString(
                    featuredProductModule?.payloadJson ?? {},
                    "eyebrow",
                  )}
                  name="featured-products__eyebrow"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                閺嶅洭顣?
                <input
                  className={inputClassName}
                  defaultValue={readString(
                    featuredProductModule?.payloadJson ?? {},
                    "title",
                  )}
                  name="featured-products__title"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                閹稿鎸抽弬鍥攳
                <input
                  className={inputClassName}
                  defaultValue={readString(
                    featuredProductModule?.payloadJson ?? {},
                    "ctaLabel",
                  )}
                  name="featured-products__ctaLabel"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                閹稿鎸抽柧鐐复
                <input
                  className={inputClassName}
                  defaultValue={readString(
                    featuredProductModule?.payloadJson ?? {},
                    "ctaHref",
                  )}
                  name="featured-products__ctaHref"
                />
              </label>
            </div>
            <SlugCheckboxGrid
              items={products.map((product) => ({
                slug: product.slug,
                nameZh: product.nameZh,
                nameEn: product.nameEn,
              }))}
              moduleKey="featured-products"
              selected={featuredProductSlugs}
            />
          </div>
        </ModuleCard>

        <ModuleCard
          title="合作流程"
          description="每行格式为“标题|描述”，用于展示询盘到出货的步骤。"
          moduleKey="process-steps"
          enabled={processModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              閹烘帒绨?
              <input
                className={inputClassName}
                defaultValue={processModule?.sortOrder ?? 80}
                name="process-steps__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閻顣?
              <input
                className={inputClassName}
                defaultValue={readString(processModule?.payloadJson ?? {}, "eyebrow")}
                name="process-steps__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閺嶅洭顣?
              <input
                className={inputClassName}
                defaultValue={readString(processModule?.payloadJson ?? {}, "title")}
                name="process-steps__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閺夛紕娲伴崚妤勩€?
              <textarea
                className={`${textareaClassName} min-h-40`}
                defaultValue={readStringArray(
                  processModule?.payloadJson ?? {},
                  "items",
                ).join("\n")}
                name="process-steps__items"
              />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title="博客入口"
          description="控制首页博客模块标题，文章会自动读取最新已发布内容。"
          moduleKey="latest-insights"
          enabled={latestInsightsModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              閹烘帒绨?
              <input
                className={inputClassName}
                defaultValue={latestInsightsModule?.sortOrder ?? 90}
                name="latest-insights__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閻顣?
              <input
                className={inputClassName}
                defaultValue={readString(
                  latestInsightsModule?.payloadJson ?? {},
                  "eyebrow",
                )}
                name="latest-insights__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閺嶅洭顣?
              <input
                className={inputClassName}
                defaultValue={readString(latestInsightsModule?.payloadJson ?? {}, "title")}
                name="latest-insights__title"
              />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title="底部 CTA"
          description="控制首页底部 CTA 区域的文案和按钮。"
          moduleKey="final-cta"
          enabled={finalCtaModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              閹烘帒绨?
              <input
                className={inputClassName}
                defaultValue={finalCtaModule?.sortOrder ?? 100}
                name="final-cta__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閻顣?
              <input
                className={inputClassName}
                defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "eyebrow")}
                name="final-cta__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閺嶅洭顣?
              <input
                className={inputClassName}
                defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "title")}
                name="final-cta__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              閹诲繗鍫?
              <textarea
                className={textareaClassName}
                defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "description")}
                name="final-cta__description"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閹稿鎸抽弬鍥攳
              <input
                className={inputClassName}
                defaultValue={readString(
                  finalCtaModule?.payloadJson ?? {},
                  "primaryCtaLabel",
                )}
                name="final-cta__primaryCtaLabel"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              閹稿鎸抽柧鐐复
              <input
                className={inputClassName}
                defaultValue={readString(
                  finalCtaModule?.payloadJson ?? {},
                  "primaryCtaHref",
                )}
                name="final-cta__primaryCtaHref"
              />
            </label>
          </div>
        </ModuleCard>

        <div className="flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
            type="submit"
          >
            娣囨繂鐡ㄦ＃鏍€夊Ο鈥虫健
          </button>
        </div>
      </form>
    </div>
  );
}

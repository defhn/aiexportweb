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
          启用
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
        <h2 className="text-2xl font-semibold text-stone-950">首页管理</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          在这里统一维护首页模块的开关、排序、文案和推荐内容。前台会按照这里的顺序直接渲染。
        </p>
      </section>

      <form action={action} className="space-y-6">
        <ModuleCard
          title="Hero 首屏"
          description="控制首页第一屏标题、说明和两个按钮。"
          moduleKey="hero"
          enabled={heroModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              排序
              <input
                className={inputClassName}
                defaultValue={heroModule?.sortOrder ?? 10}
                name="hero__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              眉题
              <input
                className={inputClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "eyebrow")}
                name="hero__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              标题
              <input
                className={inputClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "title")}
                name="hero__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              描述
              <textarea
                className={textareaClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "description")}
                name="hero__description"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              主按钮文案
              <input
                className={inputClassName}
                defaultValue={readString(
                  heroModule?.payloadJson ?? {},
                  "primaryCtaLabel",
                )}
                name="hero__primaryCtaLabel"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              主按钮链接
              <input
                className={inputClassName}
                defaultValue={readString(
                  heroModule?.payloadJson ?? {},
                  "primaryCtaHref",
                )}
                name="hero__primaryCtaHref"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              次按钮文案
              <input
                className={inputClassName}
                defaultValue={readString(
                  heroModule?.payloadJson ?? {},
                  "secondaryCtaLabel",
                )}
                name="hero__secondaryCtaLabel"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              次按钮链接
              <input
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
              排序
              <input
                className={inputClassName}
                defaultValue={strengthsModule?.sortOrder ?? 20}
                name="strengths__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              卖点列表
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
              排序
              <input
                className={inputClassName}
                defaultValue={trustSignalsModule?.sortOrder ?? 30}
                name="trust-signals__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              模块标题
              <input
                className={inputClassName}
                defaultValue={readString(trustSignalsModule?.payloadJson ?? {}, "title")}
                name="trust-signals__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              品牌列表
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
                排序
                <input
                  className={inputClassName}
                  defaultValue={featuredCategoryModule?.sortOrder ?? 40}
                  name="featured-categories__sortOrder"
                  type="number"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                眉题
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
                标题
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
                描述
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
              排序
              <input
                className={inputClassName}
                defaultValue={factoryCapabilityModule?.sortOrder ?? 50}
                name="factory-capability__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              眉题
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
              标题
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
              描述
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
              卖点列表
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
              统计值一
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
              统计说明一
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
              统计值二
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
              统计说明二
              <input
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
          description="每行格式为 标题|描述，用于展示认证、审核和合规能力。"
          moduleKey="quality-certifications"
          enabled={qualityModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              排序
              <input
                className={inputClassName}
                defaultValue={qualityModule?.sortOrder ?? 60}
                name="quality-certifications__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              眉题
              <input
                className={inputClassName}
                defaultValue={readString(qualityModule?.payloadJson ?? {}, "eyebrow")}
                name="quality-certifications__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              标题
              <input
                className={inputClassName}
                defaultValue={readString(qualityModule?.payloadJson ?? {}, "title")}
                name="quality-certifications__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              描述
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
              条目列表
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
                排序
                <input
                  className={inputClassName}
                  defaultValue={featuredProductModule?.sortOrder ?? 70}
                  name="featured-products__sortOrder"
                  type="number"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                眉题
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
                标题
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
                按钮文案
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
                按钮链接
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
          description="每行格式为 标题|描述，用于展示询盘到出货的步骤。"
          moduleKey="process-steps"
          enabled={processModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              排序
              <input
                className={inputClassName}
                defaultValue={processModule?.sortOrder ?? 80}
                name="process-steps__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              眉题
              <input
                className={inputClassName}
                defaultValue={readString(processModule?.payloadJson ?? {}, "eyebrow")}
                name="process-steps__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              标题
              <input
                className={inputClassName}
                defaultValue={readString(processModule?.payloadJson ?? {}, "title")}
                name="process-steps__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              条目列表
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
              排序
              <input
                className={inputClassName}
                defaultValue={latestInsightsModule?.sortOrder ?? 90}
                name="latest-insights__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              眉题
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
              标题
              <input
                className={inputClassName}
                defaultValue={readString(latestInsightsModule?.payloadJson ?? {}, "title")}
                name="latest-insights__title"
              />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title="底部转化区"
          description="控制首页底部 CTA 区域的文案和按钮。"
          moduleKey="final-cta"
          enabled={finalCtaModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              排序
              <input
                className={inputClassName}
                defaultValue={finalCtaModule?.sortOrder ?? 100}
                name="final-cta__sortOrder"
                type="number"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              眉题
              <input
                className={inputClassName}
                defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "eyebrow")}
                name="final-cta__eyebrow"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              标题
              <input
                className={inputClassName}
                defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "title")}
                name="final-cta__title"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              描述
              <textarea
                className={textareaClassName}
                defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "description")}
                name="final-cta__description"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              按钮文案
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
              按钮链接
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
            保存首页模块
          </button>
        </div>
      </form>
    </div>
  );
}

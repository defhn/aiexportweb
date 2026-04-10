import type { ReactNode } from "react";

import { savePageModules } from "@/features/pages/actions";
import { getPageModules } from "@/features/pages/queries";
import { getAllCategories, getAllProducts } from "@/features/products/queries";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

const textareaClassName = `${inputClassName} min-h-28`;

const LABEL_ENABLED = "\u542f\u7528";
const LABEL_SORT_ORDER = "\u6392\u5e8f";
const LABEL_EYEBROW = "\u5c0f\u6807\u9898";
const LABEL_TITLE = "\u4e3b\u6807\u9898";
const LABEL_DESCRIPTION = "\u63cf\u8ff0";
const LABEL_ITEMS = "\u5217\u8868\u5185\u5bb9";
const LABEL_PRIMARY_CTA_LABEL = "\u4e3b\u6309\u94ae\u6587\u6848";
const LABEL_PRIMARY_CTA_HREF = "\u4e3b\u6309\u94ae\u94fe\u63a5";
const LABEL_SECONDARY_CTA_LABEL = "\u6b21\u6309\u94ae\u6587\u6848";
const LABEL_SECONDARY_CTA_HREF = "\u6b21\u6309\u94ae\u94fe\u63a5";
const LABEL_CTA_LABEL = "\u6309\u94ae\u6587\u6848";
const LABEL_CTA_HREF = "\u6309\u94ae\u94fe\u63a5";
const LABEL_SEO_TITLE = "SEO \u6807\u9898\uff0855-60 \u5b57\u7b26\uff09";
const LABEL_SEO_DESCRIPTION = "SEO \u63cf\u8ff0\uff08150-160 \u5b57\u7b26\uff09";
const LABEL_STAT_ONE_VALUE = "\u7edf\u8ba1\u4e00\u6570\u503c";
const LABEL_STAT_ONE_LABEL = "\u7edf\u8ba1\u4e00\u6587\u6848";
const LABEL_STAT_TWO_VALUE = "\u7edf\u8ba1\u4e8c\u6570\u503c";
const LABEL_STAT_TWO_LABEL = "\u7edf\u8ba1\u4e8c\u6587\u6848";
const SAVE_LABEL = "\u4fdd\u5b58\u9996\u9875\u6a21\u5757";

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
          {LABEL_ENABLED}
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

  const featuredCategorySlugs = readStringArray(featuredCategoryModule?.payloadJson ?? {}, "slugs");
  const featuredProductSlugs = readStringArray(featuredProductModule?.payloadJson ?? {}, "slugs");

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">{"\u9996\u9875\u6a21\u5757"}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "\u5728\u8fd9\u91cc\u7edf\u4e00\u7ef4\u62a4\u9996\u9875\u5404\u6a21\u5757\u7684\u6807\u9898\u3001\u63cf\u8ff0\u3001\u6309\u94ae\u548c\u5c55\u793a\u987a\u5e8f\uff0c\u4fdd\u5b58\u540e\u524d\u53f0\u9996\u9875\u4f1a\u540c\u6b65\u66f4\u65b0\u3002"
          }
        </p>
      </section>

      <form action={action} className="space-y-6">
        <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50/40 p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-stone-950">{"\u9996\u5c4f SEO"}</h3>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {"Google \u641c\u7d22\u6458\u8981"}
            </span>
          </div>
          <p className="mb-5 text-sm leading-6 text-stone-500">
            {
              "\u8fd9\u91cc\u63a7\u5236\u9996\u9875\u5728 Google \u641c\u7d22\u7ed3\u679c\u4e2d\u7684\u6807\u9898\u548c\u63cf\u8ff0\uff0c\u6709\u52a9\u4e8e\u63d0\u5347\u70b9\u51fb\u7387\u548c\u641c\u7d22\u53ef\u89c1\u6027\u3002"
            }
          </p>
          <div className="grid gap-4">
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SEO_TITLE}
              <input
                className={inputClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "seoTitle")}
                name="hero__seoTitle"
                placeholder="CNC Precision Machining | Acme Manufacturing"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SEO_DESCRIPTION}
              <textarea
                className={textareaClassName}
                defaultValue={readString(heroModule?.payloadJson ?? {}, "seoDescription")}
                name="hero__seoDescription"
                placeholder="Custom CNC machined parts with tolerances to +/-0.005mm. ISO 9001. DDP shipping to 40+ countries."
              />
            </label>
          </div>
        </section>

        <ModuleCard
          title={"Hero \u9996\u5c4f"}
          description={"\u63a7\u5236\u9996\u9875\u7b2c\u4e00\u5c4f\u6807\u9898\u3001\u8bf4\u660e\u548c\u4e24\u4e2a\u6309\u94ae\u3002"}
          moduleKey="hero"
          enabled={heroModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SORT_ORDER}
              <input className={inputClassName} defaultValue={heroModule?.sortOrder ?? 10} name="hero__sortOrder" type="number" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_EYEBROW}
              <input className={inputClassName} defaultValue={readString(heroModule?.payloadJson ?? {}, "eyebrow")} name="hero__eyebrow" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_TITLE}
              <input className={inputClassName} defaultValue={readString(heroModule?.payloadJson ?? {}, "title")} name="hero__title" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_DESCRIPTION}
              <textarea className={textareaClassName} defaultValue={readString(heroModule?.payloadJson ?? {}, "description")} name="hero__description" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_PRIMARY_CTA_LABEL}
              <input className={inputClassName} defaultValue={readString(heroModule?.payloadJson ?? {}, "primaryCtaLabel")} name="hero__primaryCtaLabel" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_PRIMARY_CTA_HREF}
              <input className={inputClassName} defaultValue={readString(heroModule?.payloadJson ?? {}, "primaryCtaHref")} name="hero__primaryCtaHref" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SECONDARY_CTA_LABEL}
              <input className={inputClassName} defaultValue={readString(heroModule?.payloadJson ?? {}, "secondaryCtaLabel")} name="hero__secondaryCtaLabel" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SECONDARY_CTA_HREF}
              <input className={inputClassName} defaultValue={readString(heroModule?.payloadJson ?? {}, "secondaryCtaHref")} name="hero__secondaryCtaHref" />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title={"\u6838\u5fc3\u4f18\u52bf"}
          description={"\u6bcf\u884c\u4e00\u6761\uff0c\u524d\u53f0\u4f1a\u81ea\u52a8\u6392\u6210\u5217\u8868\u3002"}
          moduleKey="strengths"
          enabled={strengthsModule?.isEnabled ?? true}
        >
          <div className="grid gap-4">
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SORT_ORDER}
              <input className={inputClassName} defaultValue={strengthsModule?.sortOrder ?? 20} name="strengths__sortOrder" type="number" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_ITEMS}
              <textarea className={`${textareaClassName} min-h-40`} defaultValue={readStringArray(strengthsModule?.payloadJson ?? {}, "items").join("\n")} name="strengths__items" />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title={"\u54c1\u724c\u80cc\u4e66"}
          description={"\u7528\u4e8e\u6eda\u52a8\u5c55\u793a\u5408\u4f5c\u54c1\u724c\u3001\u5ba2\u6237\u54c1\u724c\u6216\u884c\u4e1a\u5173\u952e\u8bcd\u3002"}
          moduleKey="trust-signals"
          enabled={trustSignalsModule?.isEnabled ?? true}
        >
          <div className="grid gap-4">
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SORT_ORDER}
              <input className={inputClassName} defaultValue={trustSignalsModule?.sortOrder ?? 30} name="trust-signals__sortOrder" type="number" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_TITLE}
              <input className={inputClassName} defaultValue={readString(trustSignalsModule?.payloadJson ?? {}, "title")} name="trust-signals__title" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_ITEMS}
              <textarea className={`${textareaClassName} min-h-40`} defaultValue={readStringArray(trustSignalsModule?.payloadJson ?? {}, "items").join("\n")} name="trust-signals__items" />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title={"\u63a8\u8350\u5206\u7c7b"}
          description={"\u63a7\u5236\u9996\u9875\u5206\u7c7b\u6a21\u5757\u7684\u6587\u6848\u548c\u8981\u5c55\u793a\u7684\u5206\u7c7b\u3002"}
          moduleKey="featured-categories"
          enabled={featuredCategoryModule?.isEnabled ?? true}
        >
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-700">
                {LABEL_SORT_ORDER}
                <input className={inputClassName} defaultValue={featuredCategoryModule?.sortOrder ?? 40} name="featured-categories__sortOrder" type="number" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                {LABEL_EYEBROW}
                <input className={inputClassName} defaultValue={readString(featuredCategoryModule?.payloadJson ?? {}, "eyebrow")} name="featured-categories__eyebrow" />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                {LABEL_TITLE}
                <input className={inputClassName} defaultValue={readString(featuredCategoryModule?.payloadJson ?? {}, "title")} name="featured-categories__title" />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                {LABEL_DESCRIPTION}
                <textarea className={textareaClassName} defaultValue={readString(featuredCategoryModule?.payloadJson ?? {}, "description")} name="featured-categories__description" />
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
          title={"\u5de5\u5382\u5b9e\u529b"}
          description={"\u63a7\u5236\u5de5\u5382\u5b9e\u529b\u6a21\u5757\u7684\u6807\u9898\u3001\u8bf4\u660e\u3001\u5356\u70b9\u548c\u4e24\u7ec4\u7edf\u8ba1\u6570\u5b57\u3002"}
          moduleKey="factory-capability"
          enabled={factoryCapabilityModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SORT_ORDER}
              <input className={inputClassName} defaultValue={factoryCapabilityModule?.sortOrder ?? 50} name="factory-capability__sortOrder" type="number" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_EYEBROW}
              <input className={inputClassName} defaultValue={readString(factoryCapabilityModule?.payloadJson ?? {}, "eyebrow")} name="factory-capability__eyebrow" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_TITLE}
              <input className={inputClassName} defaultValue={readString(factoryCapabilityModule?.payloadJson ?? {}, "title")} name="factory-capability__title" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_DESCRIPTION}
              <textarea className={textareaClassName} defaultValue={readString(factoryCapabilityModule?.payloadJson ?? {}, "description")} name="factory-capability__description" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_ITEMS}
              <textarea className={`${textareaClassName} min-h-40`} defaultValue={readStringArray(factoryCapabilityModule?.payloadJson ?? {}, "items").join("\n")} name="factory-capability__items" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_STAT_ONE_VALUE}
              <input className={inputClassName} defaultValue={readString(factoryCapabilityModule?.payloadJson ?? {}, "statOneValue")} name="factory-capability__statOneValue" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_STAT_ONE_LABEL}
              <input className={inputClassName} defaultValue={readString(factoryCapabilityModule?.payloadJson ?? {}, "statOneLabel")} name="factory-capability__statOneLabel" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_STAT_TWO_VALUE}
              <input className={inputClassName} defaultValue={readString(factoryCapabilityModule?.payloadJson ?? {}, "statTwoValue")} name="factory-capability__statTwoValue" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_STAT_TWO_LABEL}
              <input className={inputClassName} defaultValue={readString(factoryCapabilityModule?.payloadJson ?? {}, "statTwoLabel")} name="factory-capability__statTwoLabel" />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title={"\u8d28\u91cf\u8ba4\u8bc1"}
          description={"\u6bcf\u884c\u683c\u5f0f\u4e3a\u201c\u6807\u9898|\u63cf\u8ff0\u201d\uff0c\u7528\u4e8e\u5c55\u793a\u8ba4\u8bc1\u3001\u5ba1\u6838\u548c\u5408\u89c4\u80fd\u529b\u3002"}
          moduleKey="quality-certifications"
          enabled={qualityModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SORT_ORDER}
              <input className={inputClassName} defaultValue={qualityModule?.sortOrder ?? 60} name="quality-certifications__sortOrder" type="number" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_EYEBROW}
              <input className={inputClassName} defaultValue={readString(qualityModule?.payloadJson ?? {}, "eyebrow")} name="quality-certifications__eyebrow" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_TITLE}
              <input className={inputClassName} defaultValue={readString(qualityModule?.payloadJson ?? {}, "title")} name="quality-certifications__title" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_DESCRIPTION}
              <textarea className={textareaClassName} defaultValue={readString(qualityModule?.payloadJson ?? {}, "description")} name="quality-certifications__description" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_ITEMS}
              <textarea className={`${textareaClassName} min-h-40`} defaultValue={readStringArray(qualityModule?.payloadJson ?? {}, "items").join("\n")} name="quality-certifications__items" />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title={"\u63a8\u8350\u4ea7\u54c1"}
          description={"\u63a7\u5236\u9996\u9875\u63a8\u8350\u4ea7\u54c1\u6a21\u5757\u7684\u6807\u9898\u3001\u6309\u94ae\u548c\u4ea7\u54c1\u9009\u62e9\u3002"}
          moduleKey="featured-products"
          enabled={featuredProductModule?.isEnabled ?? true}
        >
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-700">
                {LABEL_SORT_ORDER}
                <input className={inputClassName} defaultValue={featuredProductModule?.sortOrder ?? 70} name="featured-products__sortOrder" type="number" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                {LABEL_EYEBROW}
                <input className={inputClassName} defaultValue={readString(featuredProductModule?.payloadJson ?? {}, "eyebrow")} name="featured-products__eyebrow" />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                {LABEL_TITLE}
                <input className={inputClassName} defaultValue={readString(featuredProductModule?.payloadJson ?? {}, "title")} name="featured-products__title" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                {LABEL_CTA_LABEL}
                <input className={inputClassName} defaultValue={readString(featuredProductModule?.payloadJson ?? {}, "ctaLabel")} name="featured-products__ctaLabel" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                {LABEL_CTA_HREF}
                <input className={inputClassName} defaultValue={readString(featuredProductModule?.payloadJson ?? {}, "ctaHref")} name="featured-products__ctaHref" />
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
          title={"\u5408\u4f5c\u6d41\u7a0b"}
          description={"\u6bcf\u884c\u683c\u5f0f\u4e3a\u201c\u6807\u9898|\u63cf\u8ff0\u201d\uff0c\u7528\u4e8e\u5c55\u793a\u8be2\u76d8\u5230\u51fa\u8d27\u7684\u6b65\u9aa4\u3002"}
          moduleKey="process-steps"
          enabled={processModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SORT_ORDER}
              <input className={inputClassName} defaultValue={processModule?.sortOrder ?? 80} name="process-steps__sortOrder" type="number" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_EYEBROW}
              <input className={inputClassName} defaultValue={readString(processModule?.payloadJson ?? {}, "eyebrow")} name="process-steps__eyebrow" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_TITLE}
              <input className={inputClassName} defaultValue={readString(processModule?.payloadJson ?? {}, "title")} name="process-steps__title" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_ITEMS}
              <textarea className={`${textareaClassName} min-h-40`} defaultValue={readStringArray(processModule?.payloadJson ?? {}, "items").join("\n")} name="process-steps__items" />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title={"\u535a\u5ba2\u5165\u53e3"}
          description={"\u63a7\u5236\u9996\u9875\u535a\u5ba2\u6a21\u5757\u6807\u9898\uff0c\u6587\u7ae0\u4f1a\u81ea\u52a8\u8bfb\u53d6\u6700\u65b0\u5df2\u53d1\u5e03\u5185\u5bb9\u3002"}
          moduleKey="latest-insights"
          enabled={latestInsightsModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SORT_ORDER}
              <input className={inputClassName} defaultValue={latestInsightsModule?.sortOrder ?? 90} name="latest-insights__sortOrder" type="number" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_EYEBROW}
              <input className={inputClassName} defaultValue={readString(latestInsightsModule?.payloadJson ?? {}, "eyebrow")} name="latest-insights__eyebrow" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_TITLE}
              <input className={inputClassName} defaultValue={readString(latestInsightsModule?.payloadJson ?? {}, "title")} name="latest-insights__title" />
            </label>
          </div>
        </ModuleCard>

        <ModuleCard
          title={"\u5e95\u90e8 CTA"}
          description={"\u63a7\u5236\u9996\u9875\u5e95\u90e8 CTA \u533a\u57df\u7684\u6587\u6848\u548c\u6309\u94ae\u3002"}
          moduleKey="final-cta"
          enabled={finalCtaModule?.isEnabled ?? true}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_SORT_ORDER}
              <input className={inputClassName} defaultValue={finalCtaModule?.sortOrder ?? 100} name="final-cta__sortOrder" type="number" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_EYEBROW}
              <input className={inputClassName} defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "eyebrow")} name="final-cta__eyebrow" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_TITLE}
              <input className={inputClassName} defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "title")} name="final-cta__title" />
            </label>
            <label className="block text-sm font-medium text-stone-700 md:col-span-2">
              {LABEL_DESCRIPTION}
              <textarea className={textareaClassName} defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "description")} name="final-cta__description" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_CTA_LABEL}
              <input className={inputClassName} defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "primaryCtaLabel")} name="final-cta__primaryCtaLabel" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              {LABEL_CTA_HREF}
              <input className={inputClassName} defaultValue={readString(finalCtaModule?.payloadJson ?? {}, "primaryCtaHref")} name="final-cta__primaryCtaHref" />
            </label>
          </div>
        </ModuleCard>

        <div className="flex justify-end">
          <button className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white" type="submit">
            {SAVE_LABEL}
          </button>
        </div>
      </form>
    </div>
  );
}

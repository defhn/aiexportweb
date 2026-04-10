"use client";

import { useState } from "react";
import {
  BarChart3,
  FileText,
  Globe2,
  HelpCircle,
  Images,
  Package,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";

import { GalleryPicker } from "@/components/admin/gallery-picker";
import { ImagePicker } from "@/components/admin/image-picker";
import { ProductAiTools } from "@/components/admin/product-ai-tools";
import type { FeatureGate } from "@/features/plans/access";

type CategoryOption = {
  id: number;
  nameZh: string;
  nameEn: string;
  slug: string;
};

type FolderOption = {
  id: number;
  label: string;
};

type AssetOption = {
  id: number;
  fileName: string;
  url: string;
  folderId?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
};

type DefaultFieldRow = {
  fieldKey: string;
  labelZh: string;
  labelEn: string;
  valueZh: string;
  valueEn: string;
  isVisible: boolean;
};

type CustomFieldRow = {
  labelZh: string;
  labelEn: string;
  valueZh: string;
  valueEn: string;
  isVisible: boolean;
};

type ProductEditorValue = {
  id?: number;
  categoryId: number | null;
  nameZh: string;
  nameEn: string;
  slug: string;
  shortDescriptionZh: string;
  shortDescriptionEn: string;
  detailsZh: string;
  detailsEn: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
  status: "draft" | "published";
  isFeatured: boolean;
  showInquiryButton: boolean;
  showWhatsappButton: boolean;
  showPdfDownload: boolean;
  coverMediaId: number | null;
  pdfFileId: number | null;
  galleryMediaIds: number[];
  defaultFields: DefaultFieldRow[];
  customFields: CustomFieldRow[];
  faqsJson?: Array<{ question: string; answer: string }>;
};

type ProductEditorFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  saveCategoryAction: (formData: FormData) => void | Promise<void>;
  categories: CategoryOption[];
  imageAssets: AssetOption[];
  imageFolders: FolderOption[];
  fileAssets: AssetOption[];
  productAiGate: FeatureGate;
  product: ProductEditorValue;
  heading: string;
  description: string;
  submitLabel: string;
  returnTo: string;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

const textareaClassName = `${inputClassName} min-h-28`;

function SidebarSwitch({
  name,
  label,
  checked,
}: {
  name: string;
  label: string;
  checked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-xs font-bold text-white/70">{label}</span>
      <input
        defaultChecked={checked}
        name={name}
        type="checkbox"
        className="h-5 w-5 rounded-lg border-white/10 bg-transparent text-blue-500 focus:ring-blue-500/20"
      />
    </label>
  );
}

export function ProductEditorForm({
  action,
  saveCategoryAction,
  categories,
  imageAssets,
  imageFolders,
  fileAssets,
  productAiGate,
  product,
  heading,
  description,
  submitLabel,
  returnTo,
}: ProductEditorFormProps) {
  const customFields = [
    ...product.customFields,
    ...Array.from({ length: Math.max(0, 5 - product.customFields.length) }, () => ({
      labelZh: "",
      labelEn: "",
      valueZh: "",
      valueEn: "",
      isVisible: true,
    })),
  ];

  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    product.faqsJson ?? [],
  );

  const addFaq = () => setFaqs((prev) => [...prev, { question: "", answer: "" }]);

  const removeFaq = (index: number) =>
    setFaqs((prev) => prev.filter((_, i) => i !== index));

  const updateFaq = (index: number, field: "question" | "answer", value: string) =>
    setFaqs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );

  return (
    <div className="mx-auto max-w-[1440px] pb-40">
      <header className="mb-12">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-stone-400">
          <Package className="h-3 w-3" />
          产品编辑器
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">{heading}</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone-500">{description}</p>
      </header>

      <details className="mb-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer list-none text-sm font-semibold text-stone-950">
          在此新建分类
        </summary>
        <form action={saveCategoryAction} className="mt-4 grid gap-4 md:grid-cols-3">
          <input name="returnTo" type="hidden" value={returnTo} />
          <label className="block text-sm font-medium text-stone-700">
            分类名称（中文）
            <input className={inputClassName} name="inlineNameZh" required />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            分类名称（英文）
            <input className={inputClassName} name="inlineNameEn" required />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            固定链接
            <input className={inputClassName} name="inlineSlug" />
          </label>
          <div className="md:col-span-3">
            <input
              className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700"
              type="submit"
              value="保存分类并留在当前页面"
            />
          </div>
        </form>
      </details>

      <form
        action={action}
        id="product-editor-form"
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
      >
        {product.id ? <input name="id" type="hidden" value={product.id} /> : null}

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Images className="h-5 w-5 text-stone-400" />
              <h3 className="text-xl font-bold text-stone-900">产品图片与文件</h3>
            </div>

            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-semibold text-stone-700">封面图片</p>
                <ImagePicker
                  assets={imageAssets}
                  folders={imageFolders}
                  label="产品封面图"
                  name="coverMediaId"
                  selectedAssetId={product.coverMediaId}
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-stone-700">产品图库</p>
                <GalleryPicker
                  assets={imageAssets}
                  folders={imageFolders}
                  name="galleryMediaIds"
                  selectedIds={product.galleryMediaIds}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700">
                  关联 PDF 文件
                  <select
                    className={inputClassName}
                    defaultValue={product.pdfFileId ?? ""}
                    name="pdfFileId"
                  >
                    <option value="">未关联 PDF 下载文件</option>
                    {fileAssets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.fileName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3">
              <FileText className="h-5 w-5 text-stone-400" />
              <h3 className="text-xl font-bold text-stone-900">核心内容</h3>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block text-sm font-medium text-stone-700">
                  产品分类
                  <select
                    className={inputClassName}
                    defaultValue={product.categoryId ?? ""}
                    name="categoryId"
                  >
                    <option value="">请选择分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nameZh} / {category.nameEn}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  排序值
                  <input
                    className={inputClassName}
                    defaultValue={product.sortOrder}
                    name="sortOrder"
                    type="number"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block text-sm font-medium text-stone-700">
                  产品名称（中文）
                  <input className={inputClassName} defaultValue={product.nameZh} name="nameZh" required />
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  产品名称（英文）
                  <input className={inputClassName} defaultValue={product.nameEn} name="nameEn" required />
                </label>
              </div>

              <label className="block text-sm font-medium text-stone-700">
                URL 固定链接
                <input
                  className={inputClassName}
                  defaultValue={product.slug}
                  name="slug"
                  placeholder="custom-aluminum-cnc-bracket"
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block text-sm font-medium text-stone-700">
                  简短描述（中文）
                  <textarea
                    className={textareaClassName}
                    defaultValue={product.shortDescriptionZh}
                    name="shortDescriptionZh"
                  />
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  简短描述（英文）
                  <textarea
                    className={textareaClassName}
                    defaultValue={product.shortDescriptionEn}
                    name="shortDescriptionEn"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block text-sm font-medium text-stone-700">
                  详情说明（中文）
                  <textarea
                    className={`${textareaClassName} min-h-56`}
                    defaultValue={product.detailsZh}
                    name="detailsZh"
                  />
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  详情说明（英文）
                  <textarea
                    className={`${textareaClassName} min-h-56`}
                    defaultValue={product.detailsEn}
                    name="detailsEn"
                  />
                </label>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-blue-100 bg-blue-50 p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-700">
                <Sparkles className="h-4 w-4" />
                AI 文案辅助
              </div>
              <ProductAiTools
                categories={categories}
                formId="product-editor-form"
                gate={productAiGate}
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-stone-400" />
              <h3 className="text-xl font-bold text-stone-900">规格参数</h3>
            </div>

            <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200">
              {product.defaultFields.map((field) => (
                <div
                  key={field.fieldKey}
                  className="grid items-center gap-2 px-3 py-2 md:grid-cols-[120px_1fr_1fr_80px]"
                >
                  <span className="text-xs font-semibold text-stone-500">
                    {field.labelZh}
                  </span>
                  <input
                    className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-900 outline-none focus:border-stone-500"
                    defaultValue={field.valueZh}
                    name={`field-${field.fieldKey}__valueZh`}
                    placeholder="中文值"
                  />
                  <input
                    className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-900 outline-none focus:border-stone-500"
                    defaultValue={field.valueEn}
                    name={`field-${field.fieldKey}__valueEn`}
                    placeholder="英文值"
                  />
                  <label className="flex items-center justify-end gap-1.5 text-xs text-stone-500">
                    <input
                      defaultChecked={field.isVisible}
                      name={`field-${field.fieldKey}__isVisible`}
                      type="checkbox"
                      className="h-3.5 w-3.5"
                    />
                    显示
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-stone-900">自定义字段</h4>
              <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200">
                {customFields.map((field, index) => (
                  <div
                    key={`custom-${index + 1}`}
                    className="grid items-center gap-2 px-3 py-2 md:grid-cols-[1fr_1fr_1fr_1fr_60px]"
                  >
                    <input
                      className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-900 outline-none focus:border-stone-500"
                      defaultValue={field.labelZh}
                      name={`custom-${index}__labelZh`}
                      placeholder="字段名称（中文）"
                    />
                    <input
                      className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-900 outline-none focus:border-stone-500"
                      defaultValue={field.labelEn}
                      name={`custom-${index}__labelEn`}
                      placeholder="字段名称（英文）"
                    />
                    <input
                      className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-900 outline-none focus:border-stone-500"
                      defaultValue={field.valueZh}
                      name={`custom-${index}__valueZh`}
                      placeholder="中文值"
                    />
                    <input
                      className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-900 outline-none focus:border-stone-500"
                      defaultValue={field.valueEn}
                      name={`custom-${index}__valueEn`}
                      placeholder="英文值"
                    />
                    <label className="flex items-center justify-end gap-1.5 text-xs text-stone-500">
                      <input
                        defaultChecked={field.isVisible}
                        name={`custom-${index}__isVisible`}
                        type="checkbox"
                        className="h-3.5 w-3.5"
                      />
                      显示
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-amber-500" />
                <h3 className="text-xl font-bold text-stone-900">产品常见问题</h3>
              </div>
              <button
                type="button"
                onClick={addFaq}
                className="flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800"
              >
                <Plus className="h-3.5 w-3.5" />
                添加问题
              </button>
            </div>

            <input type="hidden" name="faqsJson" value={JSON.stringify(faqs)} />

            {faqs.length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-stone-200 py-8 text-center text-sm text-stone-400">
                还没有常见问题，点击“添加问题”开始。
              </p>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                        Q{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        删除
                      </button>
                    </div>
                    <input
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-900 outline-none focus:border-stone-500"
                      placeholder="问题（英文）"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                    />
                    <textarea
                      className="min-h-[80px] w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-500"
                      placeholder="答案（英文）"
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm">
            <div className="mb-8 flex items-center gap-3">
              <Settings2 className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-bold">发布设置</h3>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-xs font-bold text-white/60">当前状态</span>
                <select
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-white outline-none transition-colors focus:bg-white/10"
                  defaultValue={product.status}
                  name="status"
                >
                  <option value="draft" className="bg-slate-950">
                    草稿
                  </option>
                  <option value="published" className="bg-slate-950">
                    已发布
                  </option>
                </select>
              </label>

              <div className="space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6">
                <SidebarSwitch
                  checked={product.isFeatured}
                  label="设为推荐产品"
                  name="isFeatured"
                />
                <SidebarSwitch
                  checked={product.showInquiryButton}
                  label="显示询盘按钮"
                  name="showInquiryButton"
                />
                <SidebarSwitch
                  checked={product.showWhatsappButton}
                  label="显示 WhatsApp 按钮"
                  name="showWhatsappButton"
                />
                <SidebarSwitch
                  checked={product.showPdfDownload}
                  label="启用 PDF 下载"
                  name="showPdfDownload"
                />
              </div>

              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-blue-600 text-sm font-bold text-white hover:bg-blue-500"
              >
                <Save className="h-4 w-4" />
                {submitLabel}
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Globe2 className="h-5 w-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-stone-900">SEO 设置</h3>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-stone-700">
                Meta 标题
                <input className={inputClassName} defaultValue={product.seoTitle} name="seoTitle" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Meta 描述
                <textarea
                  className={textareaClassName}
                  defaultValue={product.seoDescription}
                  name="seoDescription"
                />
              </label>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

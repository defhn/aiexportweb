import {
  BarChart3,
  FileText,
  Globe2,
  Images,
  Package,
  Save,
  Settings2,
  Sparkles,
} from "lucide-react";

import { GalleryReplaceButton } from "@/components/admin/gallery-replace-button";
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
  const galleryIds = new Set(product.galleryMediaIds);
  const coverAsset = imageAssets.find((asset) => asset.id === product.coverMediaId) ?? null;
  const galleryAssets = imageAssets.filter((asset) => galleryIds.has(asset.id));

  return (
    <div className="mx-auto max-w-[1440px] pb-40">
      <header className="mb-12">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.4em] text-stone-400">
          <Package className="h-3 w-3" />
          Product Editor
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">{heading}</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone-500">{description}</p>
      </header>

      <details className="mb-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer list-none text-sm font-semibold text-stone-950">
          当前页就地新建分类
        </summary>
        <form action={saveCategoryAction} className="mt-4 grid gap-4 md:grid-cols-3">
          <input name="returnTo" type="hidden" value={returnTo} />
          <label className="block text-sm font-medium text-stone-700">
            分类名称（中文）
            <input className={inputClassName} name="inlineNameZh" required />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Category Name (EN)
            <input className={inputClassName} name="inlineNameEn" required />
          </label>
          <label className="block text-sm font-medium text-stone-700">
            Slug
            <input className={inputClassName} name="inlineSlug" />
          </label>
          <div className="md:col-span-3">
            <input
              className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700"
              type="submit"
              value="保存分类并留在当前页"
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
            <div className="mb-8 flex items-center gap-3">
              <Images className="h-5 w-5 text-stone-400" />
              <h3 className="text-xl font-bold text-stone-900">产品图片与资料</h3>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              <div className="space-y-5">
                <div className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-50">
                  <div className="aspect-[4/3] bg-stone-100">
                    {coverAsset ? (
                      <img
                        alt={coverAsset.altTextEn || coverAsset.fileName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        src={coverAsset.url}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-stone-400">
                        还没有设置产品主图
                      </div>
                    )}
                  </div>
                  <div className="border-t border-stone-200 px-5 py-4">
                    <p className="truncate text-sm font-semibold text-stone-950">
                      {coverAsset?.fileName || "未选择主图"}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      主图会显示在产品列表页、详情页首屏和推荐产品卡片中。
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-stone-900">当前已选图库</h4>
                    <span className="text-xs text-stone-500">{galleryAssets.length} 张</span>
                  </div>
                  {galleryAssets.length ? (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                      {galleryAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
                        >
                          <div className="aspect-square bg-stone-100">
                            <img
                              alt={asset.altTextEn || asset.fileName}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              src={asset.url}
                            />
                          </div>
                          <div className="space-y-2 p-3">
                            <p className="truncate text-xs font-medium text-stone-900">
                              {asset.fileName}
                            </p>
                            {product.id ? (
                              <GalleryReplaceButton
                                currentMediaId={asset.id}
                                productId={product.id}
                              />
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
                      当前还没有选择产品图库图片。
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <ImagePicker
                  assets={imageAssets}
                  folders={imageFolders}
                  label="产品主图"
                  name="coverMediaId"
                  selectedAssetId={product.coverMediaId}
                  description="主图放在最上方，和电商后台一样先确认封面，再继续编辑产品内容。"
                />

                <section className="rounded-[1.5rem] border border-stone-200 bg-stone-50/60 p-5">
                  <h4 className="text-sm font-semibold text-stone-900">资料下载</h4>
                  <label className="mt-4 block text-sm font-medium text-stone-700">
                    关联 PDF 文件
                    <select
                      className={inputClassName}
                      defaultValue={product.pdfFileId ?? ""}
                      name="pdfFileId"
                    >
                      <option value="">不绑定 PDF 下载</option>
                      {fileAssets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.fileName}
                        </option>
                      ))}
                    </select>
                  </label>
                </section>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">图库选择</h4>
                  <p className="mt-1 text-xs text-stone-500">
                    勾选后会成为产品详情页图库，支持多选。
                  </p>
                </div>
              </div>

              {imageAssets.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {imageAssets.map((asset) => (
                    <label
                      key={asset.id}
                      className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
                    >
                      <div className="aspect-[4/3] bg-stone-100">
                        <img
                          alt={asset.altTextEn || asset.fileName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          src={asset.url}
                        />
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-stone-900">
                              {asset.fileName}
                            </p>
                            <p className="mt-1 truncate text-xs text-stone-500">
                              {asset.altTextZh || asset.altTextEn || "未填写 Alt"}
                            </p>
                          </div>
                          <input
                            defaultChecked={galleryIds.has(asset.id)}
                            name="galleryMediaIds"
                            type="checkbox"
                            value={asset.id}
                            className="mt-1 h-4 w-4 rounded border-stone-300 text-blue-600 focus:ring-blue-600/20"
                          />
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
                  暂无图片素材，请先到图库上传。
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3">
              <FileText className="h-5 w-5 text-stone-400" />
              <h3 className="text-xl font-bold text-stone-900">基础内容</h3>
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
                    <option value="">请选择产品分类</option>
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
                  中文名称
                  <input className={inputClassName} defaultValue={product.nameZh} name="nameZh" required />
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  English Name
                  <input className={inputClassName} defaultValue={product.nameEn} name="nameEn" required />
                </label>
              </div>

              <label className="block text-sm font-medium text-stone-700">
                URL Slug
                <input
                  className={inputClassName}
                  defaultValue={product.slug}
                  name="slug"
                  placeholder="custom-aluminum-cnc-bracket"
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block text-sm font-medium text-stone-700">
                  中文短描述
                  <textarea
                    className={textareaClassName}
                    defaultValue={product.shortDescriptionZh}
                    name="shortDescriptionZh"
                  />
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  Short Summary (EN)
                  <textarea
                    className={textareaClassName}
                    defaultValue={product.shortDescriptionEn}
                    name="shortDescriptionEn"
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block text-sm font-medium text-stone-700">
                  中文详情
                  <textarea
                    className={`${textareaClassName} min-h-56`}
                    defaultValue={product.detailsZh}
                    name="detailsZh"
                  />
                </label>
                <label className="block text-sm font-medium text-stone-700">
                  Full Details (EN)
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
                AI 辅助文案
              </div>
              <ProductAiTools
                categories={categories}
                formId="product-editor-form"
                gate={productAiGate}
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-stone-400" />
              <h3 className="text-xl font-bold text-stone-900">技术参数</h3>
            </div>

            <div className="space-y-4">
              {product.defaultFields.map((field) => (
                <div
                  key={field.fieldKey}
                  className="grid gap-4 rounded-3xl border border-stone-100 p-6 md:grid-cols-[1fr_1fr_auto]"
                >
                  <label className="block text-sm font-medium text-stone-700">
                    {field.labelZh}
                    <input
                      className={inputClassName}
                      defaultValue={field.valueZh}
                      name={`field-${field.fieldKey}__valueZh`}
                    />
                  </label>
                  <label className="block text-sm font-medium text-stone-700">
                    {field.labelEn}
                    <input
                      className={inputClassName}
                      defaultValue={field.valueEn}
                      name={`field-${field.fieldKey}__valueEn`}
                    />
                  </label>
                  <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-stone-700">
                    <input
                      defaultChecked={field.isVisible}
                      name={`field-${field.fieldKey}__isVisible`}
                      type="checkbox"
                    />
                    前台显示
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h4 className="mb-4 text-sm font-semibold text-stone-900">自定义参数</h4>
              <div className="space-y-4">
                {customFields.map((field, index) => (
                  <div
                    key={`custom-${index + 1}`}
                    className="grid gap-4 rounded-3xl border border-stone-100 p-6 md:grid-cols-2"
                  >
                    <label className="block text-sm font-medium text-stone-700">
                      字段名称（中文）
                      <input
                        className={inputClassName}
                        defaultValue={field.labelZh}
                        name={`custom-${index}__labelZh`}
                      />
                    </label>
                    <label className="block text-sm font-medium text-stone-700">
                      Label (EN)
                      <input
                        className={inputClassName}
                        defaultValue={field.labelEn}
                        name={`custom-${index}__labelEn`}
                      />
                    </label>
                    <label className="block text-sm font-medium text-stone-700">
                      字段值（中文）
                      <input
                        className={inputClassName}
                        defaultValue={field.valueZh}
                        name={`custom-${index}__valueZh`}
                      />
                    </label>
                    <label className="block text-sm font-medium text-stone-700">
                      Value (EN)
                      <input
                        className={inputClassName}
                        defaultValue={field.valueEn}
                        name={`custom-${index}__valueEn`}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-stone-700 md:col-span-2">
                      <input
                        defaultChecked={field.isVisible}
                        name={`custom-${index}__isVisible`}
                        type="checkbox"
                      />
                      前台显示
                    </label>
                  </div>
                ))}
              </div>
            </div>
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
                    Draft / 草稿
                  </option>
                  <option value="published" className="bg-slate-950">
                    Published / 已发布
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
                  label="允许下载资料"
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
                Meta Title
                <input className={inputClassName} defaultValue={product.seoTitle} name="seoTitle" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Meta Description
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

import { BookText, FolderPlus, Save, Tag } from "lucide-react";

import { ImagePicker } from "@/components/admin/image-picker";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type BlogCategoryOption = {
  id: number;
  nameZh: string;
  nameEn: string;
  slug: string;
};

type BlogImageAssetOption = {
  id: number;
  fileName: string;
  url: string;
  folderId?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
};

type BlogFolderOption = {
  id: number;
  label: string;
};

type BlogTagOption = {
  id: number;
  nameZh: string;
  nameEn: string;
  slug: string;
};

type BlogEditorValue = {
  id?: number;
  categoryId: number | null;
  titleZh: string;
  titleEn: string;
  slug: string;
  excerptZh: string;
  excerptEn: string;
  contentZh: string;
  contentEn: string;
  coverMediaId: number | null;
  seoTitle: string;
  seoDescription: string;
  status: "draft" | "published";
  publishedAt: string;
  tags: string[];
};

type BlogEditorFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  saveCategoryAction: (formData: FormData) => void | Promise<void>;
  saveTagAction: (formData: FormData) => void | Promise<void>;
  categories: BlogCategoryOption[];
  imageAssets: BlogImageAssetOption[];
  imageFolders: BlogFolderOption[];
  existingTags: BlogTagOption[];
  post: BlogEditorValue;
  heading: string;
  description: string;
  submitLabel: string;
  returnTo: string;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

const textareaClassName = `${inputClassName} min-h-28`;

export function BlogEditorForm({
  action,
  saveCategoryAction,
  saveTagAction,
  categories,
  imageAssets,
  imageFolders,
  existingTags,
  post,
  heading,
  description,
  submitLabel,
  returnTo,
}: BlogEditorFormProps) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-8 pb-32">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.35em] text-stone-400">
          <BookText className="h-4 w-4" />
          Blog Editor
        </div>
        <h2 className="mt-4 text-3xl font-semibold text-stone-950">{heading}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">{description}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <details className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-stone-950">
            <FolderPlus className="h-4 w-4" />
            写作中就地新建分类
          </summary>
          <form action={saveCategoryAction} className="mt-4 grid gap-4">
            <input name="returnTo" type="hidden" value={returnTo} />
            <label className="block text-sm font-medium text-stone-700">
              分类名称（中文）
              <input className={inputClassName} name="inlineCategoryNameZh" required />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Category Name (EN)
              <input className={inputClassName} name="inlineCategoryNameEn" required />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Slug
              <input className={inputClassName} name="inlineCategorySlug" />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              排序
              <input className={inputClassName} defaultValue={100} name="sortOrder" type="number" />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <input defaultChecked name="isVisible" type="checkbox" />
              前台显示
            </label>
            <input
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
              type="submit"
              value="保存分类并留在当前页"
            />
          </form>
        </details>

        <details className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-stone-950">
            <Tag className="h-4 w-4" />
            写作中就地新建标签
          </summary>
          <form action={saveTagAction} className="mt-4 grid gap-4">
            <input name="returnTo" type="hidden" value={returnTo} />
            <label className="block text-sm font-medium text-stone-700">
              标签名称（中文）
              <input className={inputClassName} name="inlineTagNameZh" required />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Tag Name (EN)
              <input className={inputClassName} name="inlineTagNameEn" required />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Slug
              <input className={inputClassName} name="inlineTagSlug" />
            </label>
            <input
              className="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700"
              type="submit"
              value="保存标签并留在当前页"
            />
          </form>
        </details>
      </div>

      <form action={action} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {post.id ? <input name="id" type="hidden" value={post.id} /> : null}

        <div className="space-y-8">
          <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">基础信息</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-700">
                文章分类
                <select className={inputClassName} defaultValue={post.categoryId ?? ""} name="categoryId">
                  <option value="">请选择分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameZh} / {category.nameEn}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-stone-700">
                发布状态
                <select className={inputClassName} defaultValue={post.status} name="status">
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-stone-700">
                标题（中文）
                <input className={inputClassName} defaultValue={post.titleZh} name="titleZh" required />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Title (EN)
                <input className={inputClassName} defaultValue={post.titleEn} name="titleEn" required />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                Slug
                <input className={inputClassName} defaultValue={post.slug} name="slug" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                发布时间
                <input className={inputClassName} defaultValue={post.publishedAt} name="publishedAt" type="datetime-local" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                标签
                <input
                  className={inputClassName}
                  defaultValue={post.tags.join(", ")}
                  list="blog-tag-suggestions"
                  name="tags"
                  placeholder="如：cnc machining, supplier"
                />
                <datalist id="blog-tag-suggestions">
                  {existingTags.map((tag) => (
                    <option key={tag.id} value={tag.nameEn} />
                  ))}
                </datalist>
              </label>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">摘要</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-700">
                摘要（中文）
                <textarea className={textareaClassName} defaultValue={post.excerptZh} name="excerptZh" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                Excerpt (EN)
                <textarea className={textareaClassName} defaultValue={post.excerptEn} name="excerptEn" />
              </label>
            </div>
          </section>

          <RichTextEditor
            assets={imageAssets}
            defaultValue={post.contentZh}
            folders={imageFolders}
            label="正文（中文）"
            locale="zh"
            name="contentZh"
            placeholder="支持长文章编辑、插图、本地上传和粘贴图片。"
          />

          <RichTextEditor
            assets={imageAssets}
            defaultValue={post.contentEn}
            folders={imageFolders}
            label="Content (EN)"
            locale="en"
            name="contentEn"
            placeholder="Use this editor for the English article shown on the public website."
          />

          <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">SEO</h3>
            <div className="mt-5 grid gap-4">
              <label className="block text-sm font-medium text-stone-700">
                SEO Title
                <input className={inputClassName} defaultValue={post.seoTitle} name="seoTitle" />
              </label>
              <label className="block text-sm font-medium text-stone-700">
                SEO Description
                <textarea className={textareaClassName} defaultValue={post.seoDescription} name="seoDescription" />
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <ImagePicker
            assets={imageAssets}
            folders={imageFolders}
            label="封面图"
            name="coverMediaId"
            selectedAssetId={post.coverMediaId}
          />

          <section className="rounded-[1.5rem] border border-slate-900 bg-slate-950 p-6 text-white shadow-sm">
            <h3 className="text-lg font-semibold">发布提醒</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
              <li>1. 中文后台编辑，前台统一输出英文内容。</li>
              <li>2. 正文图片会先进入图库，再插入文章。</li>
              <li>3. 长文章下拉时，工具栏会固定在顶部。</li>
              <li>4. 新建分类和标签时不会跳离当前编辑页。</li>
            </ul>
            <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white" type="submit">
              <Save className="h-4 w-4" />
              {submitLabel}
            </button>
          </section>
        </div>
      </form>
    </div>
  );
}

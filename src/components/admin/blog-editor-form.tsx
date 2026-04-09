import { BookText, FolderPlus, Globe2, Save, Tag } from "lucide-react";

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

// 紧凑输入框样�?const input =
  "mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-950 outline-none transition-colors focus:border-stone-500 focus:ring-1 focus:ring-stone-500/20 bg-white";

const textarea = `${input} min-h-20 resize-none`;

// 侧边�?label 标题
const sideLabel = "block text-xs font-semibold text-stone-500 uppercase tracking-wide";

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
    <div className="mx-auto max-w-[1440px] pb-32">

      {/* Header �?紧凑 */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-stone-400">
            <BookText className="h-3.5 w-3.5" />
            Blog Editor
          </div>
          <h1 className="mt-1.5 text-2xl font-bold text-stone-950">{heading}</h1>
          <p className="mt-1 text-sm text-stone-500">{description}</p>
        </div>
      </div>

      {/* 主体：左栏内�?+ 右栏设置 */}
      <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {post.id ? <input name="id" type="hidden" value={post.id} /> : null}

        {/* ===== 左侧：内容区 ===== */}
        <div className="space-y-5">

          {/* 标题 + slug */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900">文章标题 &amp; Slug</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className={sideLabel}>标题（中文）</span>
                <input className={input} defaultValue={post.titleZh} name="titleZh" required />
              </label>
              <label className="block">
                <span className={sideLabel}>Title (EN)</span>
                <input className={input} defaultValue={post.titleEn} name="titleEn" required />
              </label>
              <label className="block md:col-span-2">
                <span className={sideLabel}>Slug</span>
                <input className={input} defaultValue={post.slug} name="slug" placeholder="留空自动生成" />
              </label>
            </div>
          </section>

          {/* 摘要 */}
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900">摘要 Excerpt</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className={sideLabel}>摘要（中文）</span>
                <textarea className={textarea} defaultValue={post.excerptZh} name="excerptZh" />
              </label>
              <label className="block">
                <span className={sideLabel}>Excerpt (EN)</span>
                <textarea className={textarea} defaultValue={post.excerptEn} name="excerptEn" />
              </label>
            </div>
          </section>

          {/* 正文编辑�?ZH */}
          <RichTextEditor
            assets={imageAssets}
            defaultValue={post.contentZh}
            folders={imageFolders}
            label="正文（中文）"
            locale="zh"
            name="contentZh"
            placeholder="支持长文章编辑、插图、本地上传和粘贴图片�?
          />

          {/* 正文编辑�?EN */}
          <RichTextEditor
            assets={imageAssets}
            defaultValue={post.contentEn}
            folders={imageFolders}
            label="Content (EN)"
            locale="en"
            name="contentEn"
            placeholder="Use this editor for the English article shown on the public website."
          />
        </div>

        {/* ===== 右侧：设置栏 ===== */}
        <div className="space-y-4">

          {/* 保存按钮 �?顶部置顶 */}
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <Save className="h-4 w-4" />
            {submitLabel}
          </button>

          {/* 封面�?*/}
          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-stone-500">封面�?/h3>
            <ImagePicker
              assets={imageAssets}
              folders={imageFolders}
              label="封面�?
              name="coverMediaId"
              selectedAssetId={post.coverMediaId}
            />
          </section>

          {/* 发布设置 */}
          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-stone-500">发布设置</h3>

            <label className="block">
              <span className={sideLabel}>文章分类</span>
              <select className={input} defaultValue={post.categoryId ?? ""} name="categoryId">
                <option value="">未分�?/option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameZh} / {c.nameEn}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={sideLabel}>发布状�?/span>
              <select className={input} defaultValue={post.status} name="status">
                <option value="draft">草稿</option>
                <option value="published">已发�?/option>
              </select>
            </label>

            <label className="block">
              <span className={sideLabel}>发布时间</span>
              <input
                className={input}
                defaultValue={post.publishedAt}
                name="publishedAt"
                type="datetime-local"
              />
            </label>

            <label className="block">
              <span className={sideLabel}>标签 Tags</span>
              <input
                className={input}
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
          </section>

          {/* SEO */}
          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wide text-stone-500">SEO</h3>
            </div>
            <label className="block">
              <span className={sideLabel}>Meta Title</span>
              <input className={input} defaultValue={post.seoTitle} name="seoTitle" placeholder="55-60字符" />
            </label>
            <label className="block">
              <span className={sideLabel}>Meta Description</span>
              <textarea
                className={textarea}
                defaultValue={post.seoDescription}
                name="seoDescription"
                placeholder="150-160字符"
              />
            </label>
          </section>

          {/* 就地新建分类 */}
          <details className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-xs font-semibold text-stone-600 hover:bg-stone-50 rounded-2xl">
              <FolderPlus className="h-3.5 w-3.5 text-stone-400" />
              写作中就地新建分�?            </summary>
            <div className="border-t border-stone-100 px-4 pb-4 pt-3">
              <form action={saveCategoryAction} className="space-y-2.5">
                <input name="returnTo" type="hidden" value={returnTo} />
                <label className="block">
                  <span className={sideLabel}>分类名（中文�?/span>
                  <input className={input} name="inlineCategoryNameZh" required />
                </label>
                <label className="block">
                  <span className={sideLabel}>Name (EN)</span>
                  <input className={input} name="inlineCategoryNameEn" required />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className={sideLabel}>Slug</span>
                    <input className={input} name="inlineCategorySlug" placeholder="自动生成" />
                  </label>
                  <label className="block">
                    <span className={sideLabel}>排序</span>
                    <input className={input} defaultValue={100} name="sortOrder" type="number" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-stone-500">
                    <input defaultChecked name="isVisible" type="checkbox" className="h-3.5 w-3.5" />
                    前台显示
                  </label>
                  <button
                    className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                    type="submit"
                  >
                    新建并留在当前页
                  </button>
                </div>
              </form>
            </div>
          </details>

          {/* 就地新建标签 */}
          <details className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-xs font-semibold text-stone-600 hover:bg-stone-50 rounded-2xl">
              <Tag className="h-3.5 w-3.5 text-stone-400" />
              写作中就地新建标�?            </summary>
            <div className="border-t border-stone-100 px-4 pb-4 pt-3">
              <form action={saveTagAction} className="space-y-2.5">
                <input name="returnTo" type="hidden" value={returnTo} />
                <label className="block">
                  <span className={sideLabel}>标签名（中文�?/span>
                  <input className={input} name="inlineTagNameZh" required />
                </label>
                <label className="block">
                  <span className={sideLabel}>Tag Name (EN)</span>
                  <input className={input} name="inlineTagNameEn" required />
                </label>
                <label className="block">
                  <span className={sideLabel}>Slug</span>
                  <input className={input} name="inlineTagSlug" placeholder="自动生成" />
                </label>
                <div className="flex justify-end">
                  <button
                    className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                    type="submit"
                  >
                    新建并留在当前页
                  </button>
                </div>
              </form>
            </div>
          </details>

          {/* 发布提示 */}
          <section className="rounded-2xl border border-stone-100 bg-stone-50 p-4 text-xs leading-5 text-stone-500 space-y-1.5">
            <p>💡 中文后台编辑，前台统一输出英文内容�?/p>
            <p>💡 正文图片会先进入图库，再插入文章�?/p>
            <p>💡 长文章编辑时工具栏会固定在顶部�?/p>
            <p>💡 新建分类/标签不会跳离当前编辑页�?/p>
          </section>
        </div>
      </form>
    </div>
  );
}

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

const input =
  "mt-1.5 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-950 outline-none transition-colors focus:border-stone-500 focus:ring-1 focus:ring-stone-500/20 bg-white";

const textarea = `${input} min-h-20 resize-none`;

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

      <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {post.id ? <input name="id" type="hidden" value={post.id} /> : null}

        <div className="space-y-5">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900">Post Title and Slug</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className={sideLabel}>Title (ZH)</span>
                <input className={input} defaultValue={post.titleZh} name="titleZh" required />
              </label>
              <label className="block">
                <span className={sideLabel}>Title (EN)</span>
                <input className={input} defaultValue={post.titleEn} name="titleEn" required />
              </label>
              <label className="block md:col-span-2">
                <span className={sideLabel}>Slug</span>
                <input
                  className={input}
                  defaultValue={post.slug}
                  name="slug"
                  placeholder="Leave empty to auto-generate"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900">Excerpt</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className={sideLabel}>Excerpt (ZH)</span>
                <textarea className={textarea} defaultValue={post.excerptZh} name="excerptZh" />
              </label>
              <label className="block">
                <span className={sideLabel}>Excerpt (EN)</span>
                <textarea className={textarea} defaultValue={post.excerptEn} name="excerptEn" />
              </label>
            </div>
          </section>

          <RichTextEditor
            assets={imageAssets}
            defaultValue={post.contentZh}
            folders={imageFolders}
            label="Content (ZH)"
            locale="zh"
            name="contentZh"
            placeholder="Write the Chinese article content here."
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
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-500"
          >
            <Save className="h-4 w-4" />
            {submitLabel}
          </button>

          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-stone-500">Cover Image</h3>
            <ImagePicker
              assets={imageAssets}
              folders={imageFolders}
              label="Cover Image"
              name="coverMediaId"
              selectedAssetId={post.coverMediaId}
            />
          </section>

          <section className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wide text-stone-500">Publishing</h3>

            <label className="block">
              <span className={sideLabel}>Category</span>
              <select className={input} defaultValue={post.categoryId ?? ""} name="categoryId">
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameZh} / {c.nameEn}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={sideLabel}>Status</span>
              <select className={input} defaultValue={post.status} name="status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>

            <label className="block">
              <span className={sideLabel}>Published At</span>
              <input
                className={input}
                defaultValue={post.publishedAt}
                name="publishedAt"
                type="datetime-local"
              />
            </label>

            <label className="block">
              <span className={sideLabel}>Tags</span>
              <input
                className={input}
                defaultValue={post.tags.join(", ")}
                list="blog-tag-suggestions"
                name="tags"
                placeholder="For example: cnc machining, supplier"
              />
              <datalist id="blog-tag-suggestions">
                {existingTags.map((tag) => (
                  <option key={tag.id} value={tag.nameEn} />
                ))}
              </datalist>
            </label>
          </section>

          <section className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wide text-stone-500">SEO</h3>
            </div>
            <label className="block">
              <span className={sideLabel}>Meta Title</span>
              <input
                className={input}
                defaultValue={post.seoTitle}
                name="seoTitle"
                placeholder="55-60 characters"
              />
            </label>
            <label className="block">
              <span className={sideLabel}>Meta Description</span>
              <textarea
                className={textarea}
                defaultValue={post.seoDescription}
                name="seoDescription"
                placeholder="150-160 characters"
              />
            </label>
          </section>

          <details className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold text-stone-600 hover:bg-stone-50">
              <FolderPlus className="h-3.5 w-3.5 text-stone-400" />
              Create Category Inline
            </summary>
            <div className="border-t border-stone-100 px-4 pb-4 pt-3">
              <form action={saveCategoryAction} className="space-y-2.5">
                <input name="returnTo" type="hidden" value={returnTo} />
                <label className="block">
                  <span className={sideLabel}>Category Name (ZH)</span>
                  <input className={input} name="inlineCategoryNameZh" required />
                </label>
                <label className="block">
                  <span className={sideLabel}>Category Name (EN)</span>
                  <input className={input} name="inlineCategoryNameEn" required />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className={sideLabel}>Slug</span>
                    <input className={input} name="inlineCategorySlug" placeholder="Auto-generate if empty" />
                  </label>
                  <label className="block">
                    <span className={sideLabel}>Sort Order</span>
                    <input className={input} defaultValue={100} name="sortOrder" type="number" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-stone-500">
                    <input defaultChecked name="isVisible" type="checkbox" className="h-3.5 w-3.5" />
                    Visible on site
                  </label>
                  <button
                    className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                    type="submit"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </details>

          <details className="rounded-2xl border border-stone-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold text-stone-600 hover:bg-stone-50">
              <Tag className="h-3.5 w-3.5 text-stone-400" />
              Create Tag Inline
            </summary>
            <div className="border-t border-stone-100 px-4 pb-4 pt-3">
              <form action={saveTagAction} className="space-y-2.5">
                <input name="returnTo" type="hidden" value={returnTo} />
                <label className="block">
                  <span className={sideLabel}>Tag Name (ZH)</span>
                  <input className={input} name="inlineTagNameZh" required />
                </label>
                <label className="block">
                  <span className={sideLabel}>Tag Name (EN)</span>
                  <input className={input} name="inlineTagNameEn" required />
                </label>
                <label className="block">
                  <span className={sideLabel}>Slug</span>
                  <input className={input} name="inlineTagSlug" placeholder="Auto-generate if empty" />
                </label>
                <div className="flex justify-end">
                  <button
                    className="rounded-lg bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
                    type="submit"
                  >
                    Create Tag
                  </button>
                </div>
              </form>
            </div>
          </details>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useRef, useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  ImageOff,
  PenLine,
  Plus,
  Save,
  Star,
  Trash2,
} from "lucide-react";

import {
  bulkDeleteCategories,
  deleteCategory,
  saveCategory,
} from "@/features/products/actions";
import { ImagePicker } from "@/components/admin/image-picker";

const inputCls =
  "w-full rounded-xl border border-stone-200 px-3 py-1.5 text-sm text-stone-900 outline-none focus:border-stone-600";

export type CategoryAsset = {
  id: number;
  fileName: string;
  url: string;
  folderId?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
};

export type CategoryItem = {
  id?: number;
  nameZh: string;
  nameEn: string;
  slug: string;
  summaryZh: string;
  summaryEn: string;
  imageMediaId?: number | null;
  sortOrder: number;
  isVisible: boolean;
  isFeatured: boolean;
};

export function CategoryRow({
  category,
  imageAssets,
  imageFolders,
  bulkFormId,
  coverUrl,
}: {
  category: CategoryItem;
  imageAssets: CategoryAsset[];
  imageFolders: { id: number; label: string }[];
  bulkFormId: string;
  coverUrl?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <tr className="group border-b border-stone-100 hover:bg-stone-50/60">
        <td className="w-8 px-3 py-2.5">
          {category.id ? (
            <input
              form={bulkFormId}
              name="selectedIds"
              type="checkbox"
              value={category.id}
              className="h-3.5 w-3.5 rounded border-stone-300 text-blue-600"
            />
          ) : null}
        </td>

        <td className="w-10 px-2 py-2">
          <div className="h-9 w-9 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
            {coverUrl ? (
              <img alt={category.nameZh} className="h-full w-full object-cover" src={coverUrl} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageOff className="h-3.5 w-3.5 text-stone-300" />
              </div>
            )}
          </div>
        </td>

        <td className="px-3 py-2.5">
          <p className="text-sm font-semibold text-stone-900">
            {category.nameZh || <span className="text-stone-400">--</span>}
          </p>
          <p className="text-xs text-stone-400">{category.nameEn}</p>
        </td>

        <td className="hidden px-3 py-2.5 md:table-cell">
          <code className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
            {category.slug || "--"}
          </code>
        </td>

        <td className="hidden w-16 px-3 py-2.5 text-center text-sm text-stone-500 md:table-cell">
          {category.sortOrder}
        </td>

        <td className="hidden px-3 py-2.5 md:table-cell">
          <div className="flex gap-2">
            {category.isVisible ? (
              <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                <Globe className="h-2.5 w-2.5" /> 可见
              </span>
            ) : (
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500">
                隐藏
              </span>
            )}
            {category.isFeatured ? (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                <Star className="h-2.5 w-2.5" /> 推荐
              </span>
            ) : null}
          </div>
        </td>

        <td className="px-3 py-2.5">
          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-800"
              onClick={() => setExpanded((v) => !v)}
              title="编辑分类"
              type="button"
            >
              <PenLine className="h-4 w-4" />
            </button>
            {category.id ? (
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <button
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"
                  title="删除分类"
                  type="submit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            ) : null}
          </div>
        </td>
      </tr>

      {expanded ? (
        <tr className="bg-stone-50/80">
          <td colSpan={7} className="px-4 pb-4 pt-3">
            <form
              action={async (fd) => {
                startTransition(async () => {
                  await saveCategory(fd);
                  setExpanded(false);
                });
              }}
              className="grid gap-3"
            >
              {category.id ? <input name="id" type="hidden" value={category.id} /> : null}

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <input
                  className={inputCls}
                  defaultValue={category.nameZh}
                  name="nameZh"
                  placeholder="分类名称（中文）"
                  required
                />
                <input
                  className={inputCls}
                  defaultValue={category.nameEn}
                  name="nameEn"
                  placeholder="分类名称（英文）"
                  required
                />
                <input
                  className={inputCls}
                  defaultValue={category.slug}
                  name="slug"
                  placeholder="slug"
                />
                <input
                  className={inputCls}
                  defaultValue={category.sortOrder}
                  name="sortOrder"
                  type="number"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <textarea
                  className={`${inputCls} min-h-16 resize-none`}
                  defaultValue={category.summaryZh}
                  name="summaryZh"
                  placeholder="中文简介"
                />
                <textarea
                  className={`${inputCls} min-h-16 resize-none`}
                  defaultValue={category.summaryEn}
                  name="summaryEn"
                  placeholder="英文简介"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-0 flex-1">
                  <ImagePicker
                    assets={imageAssets}
                    folders={imageFolders}
                    label="分类封面"
                    name="imageMediaId"
                    selectedAssetId={category.imageMediaId}
                  />
                </div>
                <label className="flex items-center gap-1.5 text-sm text-stone-700">
                  <input
                    defaultChecked={category.isVisible}
                    name="isVisible"
                    type="checkbox"
                    className="h-3.5 w-3.5"
                  />
                  公开显示
                </label>
                <label className="flex items-center gap-1.5 text-sm text-stone-700">
                  <input
                    defaultChecked={category.isFeatured}
                    name="isFeatured"
                    type="checkbox"
                    className="h-3.5 w-3.5"
                  />
                  推荐分类
                </label>
                <button
                  className="flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                  disabled={pending}
                  type="submit"
                >
                  <Save className="h-3.5 w-3.5" />
                  保存
                </button>
                <button
                  className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600"
                  onClick={() => setExpanded(false)}
                  type="button"
                >
                  取消
                </button>
              </div>
            </form>
          </td>
        </tr>
      ) : null}
    </>
  );
}

export function NewCategoryPanel({
  imageAssets,
  imageFolders,
  nextSortOrder,
}: {
  imageAssets: CategoryAsset[];
  imageFolders: { id: number; label: string }[];
  nextSortOrder: number;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <button
        className="flex w-full items-center gap-2 px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 hover:text-stone-900"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <Plus className="h-4 w-4 text-stone-400" />
        新增分类
        {open ? (
          <ChevronUp className="ml-auto h-4 w-4 text-stone-400" />
        ) : (
          <ChevronDown className="ml-auto h-4 w-4 text-stone-400" />
        )}
      </button>

      {open ? (
        <div className="border-t border-stone-100 px-5 pb-5 pt-4">
          <form
            ref={formRef}
            action={async (fd) => {
              await saveCategory(fd);
              formRef.current?.reset();
              setOpen(false);
            }}
            className="grid gap-3"
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <input className={inputCls} name="nameZh" placeholder="分类名称（中文）" required />
              <input className={inputCls} name="nameEn" placeholder="分类名称（英文）" required />
              <input className={inputCls} name="slug" placeholder="slug（留空自动生成）" />
              <input
                className={inputCls}
                defaultValue={nextSortOrder}
                name="sortOrder"
                placeholder="排序"
                type="number"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <textarea
                className={`${inputCls} min-h-16 resize-none`}
                name="summaryZh"
                placeholder="中文简介"
              />
              <textarea
                className={`${inputCls} min-h-16 resize-none`}
                name="summaryEn"
                placeholder="英文简介"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <ImagePicker
                  assets={imageAssets}
                  folders={imageFolders}
                  label="分类封面"
                  name="imageMediaId"
                  selectedAssetId={null}
                />
              </div>
              <label className="flex items-center gap-1.5 text-sm text-stone-700">
                <input defaultChecked name="isVisible" type="checkbox" className="h-3.5 w-3.5" />
                公开显示
              </label>
              <label className="flex items-center gap-1.5 text-sm text-stone-700">
                <input name="isFeatured" type="checkbox" className="h-3.5 w-3.5" />
                推荐分类
              </label>
              <button
                className="flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                type="submit"
              >
                <Plus className="h-3.5 w-3.5" />
                创建分类
              </button>
              <button
                className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-600"
                onClick={() => setOpen(false)}
                type="button"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function BulkActionsBar({ bulkFormId }: { bulkFormId: string }) {
  return (
    <form
      id={bulkFormId}
      className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-3 shadow-sm"
    >
      <button
        formAction={bulkDeleteCategories}
        type="submit"
        className="flex items-center gap-2 rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        批量删除所选
      </button>
      <p className="text-xs text-stone-400">勾选分类后可批量删除，请谨慎操作。</p>
    </form>
  );
}

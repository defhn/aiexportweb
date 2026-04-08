"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bold,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Undo2,
  Upload,
} from "lucide-react";

import { buildEditorFigureHtml, normalizeEditorHtml } from "@/lib/rich-text-editor";

type RichTextAsset = {
  id: number;
  fileName: string;
  url: string;
  folderId?: number | null;
  altTextZh?: string | null;
  altTextEn?: string | null;
};

type FolderOption = {
  id: number;
  label: string;
};

type RichTextEditorProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  assets?: RichTextAsset[];
  folders?: FolderOption[];
  locale?: "zh" | "en";
};

type UploadedAsset = RichTextAsset & {
  mimeType?: string;
};

const toolbarButtonClassName =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-stone-200 bg-white px-3 text-sm font-medium text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950";

function isImageClipboardItem(item: DataTransferItem) {
  return item.kind === "file" && item.type.startsWith("image/");
}

export function RichTextEditor({
  label,
  name,
  defaultValue = "",
  placeholder = "请输入正文内容",
  assets = [],
  folders = [],
  locale = "zh",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectionRangeRef = useRef<Range | null>(null);
  const [html, setHtml] = useState(() => normalizeEditorHtml(defaultValue));
  const [assetLibrary, setAssetLibrary] = useState<RichTextAsset[]>(assets);
  const [showLibrary, setShowLibrary] = useState(false);
  const [mediaQuery, setMediaQuery] = useState("");
  const [activeFolderId, setActiveFolderId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const normalized = normalizeEditorHtml(defaultValue);
    setHtml(normalized);

    if (editorRef.current && editorRef.current.innerHTML !== normalized) {
      editorRef.current.innerHTML = normalized;
    }
  }, [defaultValue]);

  const filteredAssets = useMemo(() => {
    const query = mediaQuery.trim().toLowerCase();
    const folderId = activeFolderId ? Number.parseInt(activeFolderId, 10) : null;

    return assetLibrary.filter((asset) => {
      const matchesFolder = folderId ? asset.folderId === folderId : true;
      const matchesQuery =
        !query ||
        `${asset.fileName} ${asset.altTextZh ?? ""} ${asset.altTextEn ?? ""}`
          .toLowerCase()
          .includes(query);

      return matchesFolder && matchesQuery;
    });
  }, [activeFolderId, assetLibrary, mediaQuery]);

  function syncFromEditor() {
    const nextValue = editorRef.current?.innerHTML?.trim() || "<p></p>";
    setHtml(nextValue);
  }

  function rememberSelection() {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    selectionRangeRef.current = selection.getRangeAt(0).cloneRange();
  }

  function restoreSelection() {
    const selection = window.getSelection();
    const range = selectionRangeRef.current;

    if (!selection || !range) {
      return false;
    }

    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  }

  function focusEditor() {
    editorRef.current?.focus();
  }

  function exec(command: string, value?: string) {
    focusEditor();
    restoreSelection();
    document.execCommand(command, false, value);
    syncFromEditor();
    rememberSelection();
  }

  function applyHeading(level: "H1" | "H2" | "P") {
    exec("formatBlock", level);
  }

  function insertHtmlFragment(fragment: string) {
    focusEditor();
    restoreSelection();
    document.execCommand("insertHTML", false, fragment);
    syncFromEditor();
    rememberSelection();
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (activeFolderId) {
        formData.append("folderId", activeFolderId);
      }

      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as UploadedAsset & { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "图片上传失败，请稍后重试。");
        return null;
      }

      const nextAsset: RichTextAsset = {
        id: payload.id,
        fileName: payload.fileName,
        url: payload.url,
        folderId: payload.folderId ?? null,
        altTextZh: payload.altTextZh ?? file.name,
        altTextEn: payload.altTextEn ?? file.name,
      };

      setAssetLibrary((current) => [nextAsset, ...current]);
      setMessage(`${payload.fileName} 上传成功，可直接插入正文。`);

      return nextAsset;
    } catch {
      setError("图片上传失败，请检查网络或 R2 配置。");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleLocalFile(file?: File | null) {
    if (!file) {
      return;
    }

    const asset = await uploadImage(file);

    if (!asset) {
      return;
    }

    insertHtmlFragment(
      buildEditorFigureHtml({
        url: asset.url,
        alt: locale === "zh" ? asset.altTextZh : asset.altTextEn,
        caption: asset.fileName,
      }),
    );
  }

  async function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const items = Array.from(event.clipboardData.items);
    const imageItem = items.find(isImageClipboardItem);

    if (!imageItem) {
      return;
    }

    event.preventDefault();
    const file = imageItem.getAsFile();
    await handleLocalFile(file);
  }

  return (
    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-950">{label}</h3>
          <p className="mt-2 text-sm text-stone-500">
            支持标题、列表、引用、链接、插图，本地上传和粘贴图片也会自动入库。
          </p>
        </div>
        <div className="text-xs text-stone-400">{locale === "zh" ? "中文编辑区" : "英文编辑区"}</div>
      </div>

      <div
        data-testid="rich-text-toolbar"
        className="sticky top-4 z-20 mt-5 rounded-2xl border border-stone-200 bg-stone-50/95 p-3 backdrop-blur"
      >
        <div className="flex flex-wrap gap-2">
          <button className={toolbarButtonClassName} onClick={() => applyHeading("H1")} type="button">
            <Heading1 className="h-4 w-4" />
          </button>
          <button className={toolbarButtonClassName} onClick={() => applyHeading("H2")} type="button">
            <Heading2 className="h-4 w-4" />
          </button>
          <button className={toolbarButtonClassName} onClick={() => applyHeading("P")} type="button">
            段落
          </button>
          <button className={toolbarButtonClassName} onClick={() => exec("bold")} type="button">
            <Bold className="h-4 w-4" />
          </button>
          <button className={toolbarButtonClassName} onClick={() => exec("italic")} type="button">
            <Italic className="h-4 w-4" />
          </button>
          <button className={toolbarButtonClassName} onClick={() => exec("insertUnorderedList")} type="button">
            <List className="h-4 w-4" />
          </button>
          <button className={toolbarButtonClassName} onClick={() => exec("insertOrderedList")} type="button">
            <ListOrdered className="h-4 w-4" />
          </button>
          <button className={toolbarButtonClassName} onClick={() => exec("formatBlock", "BLOCKQUOTE")} type="button">
            <Quote className="h-4 w-4" />
          </button>
          <button
            className={toolbarButtonClassName}
            onClick={() => {
              const link = window.prompt("请输入要插入的链接地址");
              if (link) {
                exec("createLink", link.trim());
              }
            }}
            type="button"
          >
            <Link2 className="h-4 w-4" />
          </button>
          <button
            aria-label="插入图片"
            className={toolbarButtonClassName}
            onClick={() => {
              rememberSelection();
              setShowLibrary(true);
            }}
            type="button"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">插入图片</span>
          </button>
          <button
            aria-label="上传图片"
            className={toolbarButtonClassName}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Upload className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">上传图片</span>
          </button>
          <button className={toolbarButtonClassName} onClick={() => exec("removeFormat")} type="button">
            <RemoveFormatting className="h-4 w-4" />
          </button>
          <button className={toolbarButtonClassName} onClick={() => exec("undo")} type="button">
            <Undo2 className="h-4 w-4" />
          </button>
          <button className={toolbarButtonClassName} onClick={() => exec("redo")} type="button">
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
        {message ? <p className="mt-3 text-xs text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
      </div>

      <div className="relative mt-5">
        <div
          data-testid={`rich-text-editor-surface-${name}`}
          ref={editorRef}
          className="min-h-[420px] rounded-[1.5rem] border border-stone-300 px-5 py-4 text-sm leading-7 text-stone-900 outline-none transition-colors focus:border-stone-950"
          contentEditable
          onInput={syncFromEditor}
          onKeyUp={rememberSelection}
          onMouseUp={rememberSelection}
          onPaste={handlePaste}
          suppressContentEditableWarning
        />
        {!html || html === "<p></p>" ? (
          <div className="pointer-events-none absolute left-5 top-4 text-sm text-stone-400">{placeholder}</div>
        ) : null}
      </div>

      <input name={name} type="hidden" value={html} />
      <input
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          void handleLocalFile(file);
          event.currentTarget.value = "";
        }}
        type="file"
      />

      {showLibrary ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-6">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
              <div>
                <h4 className="text-lg font-semibold text-stone-950">从图库插入图片</h4>
                <p className="mt-1 text-sm text-stone-500">
                  可搜索已有素材，也可以先本地上传再插入正文。
                </p>
              </div>
              <button
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                onClick={() => setShowLibrary(false)}
                type="button"
              >
                关闭
              </button>
            </div>
            <div className="border-b border-stone-200 px-6 py-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm"
                  onChange={(event) => setMediaQuery(event.target.value)}
                  placeholder="搜索文件名或 Alt 文案"
                  value={mediaQuery}
                />
                <select
                  className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
                  onChange={(event) => setActiveFolderId(event.target.value)}
                  value={activeFolderId}
                >
                  <option value="">全部文件夹</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.label}
                    </option>
                  ))}
                </select>
                <button
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  {uploading ? "上传中..." : "本地上传"}
                </button>
              </div>
            </div>
            <div className="grid max-h-[60vh] gap-4 overflow-y-auto p-6 md:grid-cols-2 xl:grid-cols-4">
              {filteredAssets.length ? (
                filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    className="overflow-hidden rounded-2xl border border-stone-200 bg-white text-left transition-colors hover:border-blue-500"
                    onClick={() => {
                      insertHtmlFragment(
                        buildEditorFigureHtml({
                          url: asset.url,
                          alt: locale === "zh" ? asset.altTextZh : asset.altTextEn,
                          caption: asset.fileName,
                        }),
                      );
                      setShowLibrary(false);
                    }}
                    type="button"
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
                      <p className="text-sm font-medium text-stone-900">{asset.fileName}</p>
                      <p className="line-clamp-2 text-xs text-stone-500">
                        {(locale === "zh" ? asset.altTextZh : asset.altTextEn) || "未设置 Alt 文案"}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-sm text-stone-500">
                  当前没有匹配的图片素材。
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

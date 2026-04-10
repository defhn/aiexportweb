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

function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let inList = false;
  let listType = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^### (.+)/.test(line)) {
      if (inList) { result.push(`</${listType}>`); inList = false; }
      result.push(`<h3>${line.replace(/^### /, "")}</h3>`);
      continue;
    }
    if (/^## (.+)/.test(line)) {
      if (inList) { result.push(`</${listType}>`); inList = false; }
      result.push(`<h2>${line.replace(/^## /, "")}</h2>`);
      continue;
    }
    if (/^# (.+)/.test(line)) {
      if (inList) { result.push(`</${listType}>`); inList = false; }
      result.push(`<h1>${line.replace(/^# /, "")}</h1>`);
      continue;
    }

    if (/^> (.+)/.test(line)) {
      if (inList) { result.push(`</${listType}>`); inList = false; }
      result.push(`<blockquote>${line.replace(/^> /, "")}</blockquote>`);
      continue;
    }

    if (/^- (.+)/.test(line) || /^\* (.+)/.test(line)) {
      if (!inList || listType !== "ul") {
        if (inList) result.push(`</${listType}>`);
        result.push("<ul>");
        inList = true; listType = "ul";
      }
      result.push(`<li>${line.replace(/^[-*] /, "")}</li>`);
      continue;
    }

    if (/^\d+\. (.+)/.test(line)) {
      if (!inList || listType !== "ol") {
        if (inList) result.push(`</${listType}>`);
        result.push("<ol>");
        inList = true; listType = "ol";
      }
      result.push(`<li>${line.replace(/^\d+\. /, "")}</li>`);
      continue;
    }

    if (line.trim() === "") {
      if (inList) { result.push(`</${listType}>`); inList = false; }
      continue;
    }

    if (inList) { result.push(`</${listType}>`); inList = false; }
    const inline = line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    result.push(`<p>${inline}</p>`);
  }

  if (inList) result.push(`</${listType}>`);
  return result.join("\n");
}

function looksLikeMarkdown(text: string): boolean {
  return /^#{1,6} |^\*\*|^- |^\* |^\d+\. |^> /m.test(text);
}

function isImageClipboardItem(item: DataTransferItem) {
  return item.kind === "file" && item.type.startsWith("image/");
}

const btnCls =
  "inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 border border-transparent hover:border-stone-200";

export function RichTextEditor({
  label,
  name,
  defaultValue = "",
  placeholder = "请输入内容...",
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
    if (!selection || selection.rangeCount === 0) return;
    selectionRangeRef.current = selection.getRangeAt(0).cloneRange();
  }

  function restoreSelection() {
    const selection = window.getSelection();
    const range = selectionRangeRef.current;
    if (!selection || !range) return false;
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

  async function uploadImage(file: File): Promise<RichTextAsset | null> {
    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (activeFolderId) formData.append("folderId", activeFolderId);

      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as UploadedAsset & { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "图片上传失败，请检查文件格式。");
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
      setMessage(`已上传 ${payload.fileName}，点击插入。`);
      return nextAsset;
    } catch {
      setError("图片上传失败，请检查网络或 R2 配置。");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleLocalFile(file?: File | null) {
    if (!file) return;
    const asset = await uploadImage(file);
    if (!asset) return;

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
    if (imageItem) {
      event.preventDefault();
      setMessage("正在上传剪贴板中的图片...");
      const file = imageItem.getAsFile();
      await handleLocalFile(file);
      return;
    }

    const textItem = items.find((i) => i.kind === "string" && i.type === "text/plain");
    if (textItem) {
      textItem.getAsString((text) => {
        if (looksLikeMarkdown(text)) {
          event.preventDefault();
          const converted = markdownToHtml(text);
          insertHtmlFragment(converted);
          setMessage("已识别 Markdown 格式并转换为富文本。");
        }
      });
    }
  }

  const localeBadge =
    locale === "zh" ? (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
        中文
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
        英文
      </span>
    );

  return (
    <section className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-3.5">
        <h3 className="text-sm font-bold text-stone-900">{label}</h3>
        <div className="flex items-center gap-2">
          {localeBadge}
          <span className="text-xs text-stone-400">
            {locale === "zh"
              ? "支持直接粘贴图片，Markdown 会自动转换。"
              : "英文编辑区支持直接粘贴图片，Markdown 会自动转换。"}
          </span>
        </div>
      </div>

      <div
        data-testid="rich-text-toolbar"
        className="sticky top-0 z-20 border-b border-stone-100 bg-white/98 backdrop-blur-sm px-4 py-2.5 shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <button className={btnCls} onClick={() => applyHeading("H1")} type="button" title="H1 标题">
              <Heading1 className="h-3.5 w-3.5" />
            </button>
            <button className={btnCls} onClick={() => applyHeading("H2")} type="button" title="H2 标题">
              <Heading2 className="h-3.5 w-3.5" />
            </button>
            <button className={`${btnCls} px-3`} onClick={() => applyHeading("P")} type="button" title="正文段落">
              P
            </button>
          </div>

          <div className="h-5 w-px bg-stone-200" />

          <div className="flex items-center gap-0.5">
            <button className={btnCls} onClick={() => exec("bold")} type="button" title="加粗">
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button className={btnCls} onClick={() => exec("italic")} type="button" title="斜体">
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button className={btnCls} onClick={() => exec("formatBlock", "BLOCKQUOTE")} type="button" title="引用">
              <Quote className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-stone-200" />

          <div className="flex items-center gap-0.5">
            <button className={btnCls} onClick={() => exec("insertUnorderedList")} type="button" title="无序列表">
              <List className="h-3.5 w-3.5" />
            </button>
            <button className={btnCls} onClick={() => exec("insertOrderedList")} type="button" title="有序列表">
              <ListOrdered className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-stone-200" />

          <button
            className={btnCls}
            onClick={() => {
              const link = window.prompt("请输入链接地址");
              if (link) exec("createLink", link.trim());
            }}
            type="button"
            title="插入链接"
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>

          <div className="h-5 w-px bg-stone-200" />

          <button
            className={`${btnCls} gap-1.5`}
            onClick={() => { rememberSelection(); setShowLibrary(true); }}
            type="button"
            title="从图库插入图片"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">插图</span>
          </button>
          <button
            className={`${btnCls} gap-1.5`}
            onClick={() => fileInputRef.current?.click()}
            type="button"
            title="上传图片"
            disabled={uploading}
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">
              {uploading ? "上传中..." : "上传"}
            </span>
          </button>

          <div className="h-5 w-px bg-stone-200" />

          <div className="flex items-center gap-0.5">
            <button className={btnCls} onClick={() => exec("undo")} type="button" title="撤销">
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button className={btnCls} onClick={() => exec("redo")} type="button" title="重做">
              <Redo2 className="h-3.5 w-3.5" />
            </button>
            <button className={btnCls} onClick={() => exec("removeFormat")} type="button" title="清除格式">
              <RemoveFormatting className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {message ? (
          <p className="mt-2 text-[11px] text-emerald-700">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-2 text-[11px] text-red-600">{error}</p>
        ) : null}
      </div>

      <div className="relative">
        <div
          data-testid={`rich-text-editor-surface-${name}`}
          ref={editorRef}
          className="min-h-[400px] px-5 py-4 text-sm leading-7 text-stone-900 outline-none"
          contentEditable
          onInput={syncFromEditor}
          onKeyUp={rememberSelection}
          onMouseUp={rememberSelection}
          onPaste={handlePaste}
          suppressContentEditableWarning
        />
        {!html || html === "<p></p>" ? (
          <div className="pointer-events-none absolute left-5 top-4 text-sm text-stone-400">
            {placeholder}
          </div>
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/50 p-0 sm:p-6">
          <div className="max-h-[92vh] sm:max-h-[90vh] w-full sm:max-w-5xl overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div>
                <h4 className="text-base font-bold text-stone-950">从图库插入图片</h4>
                <p className="mt-0.5 text-xs text-stone-500">
                  点击图片插入正文，或先上传新图。
                </p>
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-100"
                onClick={() => setShowLibrary(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="border-b border-stone-200 px-5 py-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-500"
                  onChange={(e) => setMediaQuery(e.target.value)}
                  placeholder="搜索文件名或 Alt 文案"
                  value={mediaQuery}
                />
                <select
                  className="rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none"
                  onChange={(e) => setActiveFolderId(e.target.value)}
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
                  className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  disabled={uploading}
                >
                  {uploading ? "上传中..." : "本地上传"}
                </button>
              </div>
            </div>
            <div className="grid max-h-[56vh] gap-3 overflow-y-auto p-5 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
              {filteredAssets.length ? (
                filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    className="overflow-hidden rounded-2xl border border-stone-200 bg-white text-left transition-all hover:border-blue-400 hover:shadow-md"
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
                    <div className="p-2.5">
                      <p className="truncate text-xs font-medium text-stone-900">{asset.fileName}</p>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-stone-500">
                        {(locale === "zh" ? asset.altTextZh : asset.altTextEn) || "未设置 Alt 文案"}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-stone-300 px-4 py-8 text-center text-sm text-stone-500">
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


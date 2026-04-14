"use client";

import { useState, useRef, useTransition } from "react";
import {
  Save,
  CheckCircle,
  Globe,
  ChevronRight,
  Plus,
  Trash2,
  Settings,
} from "lucide-react";

import {
  UNIVERSAL_SECTIONS,
  INDUSTRY_SECTIONS,
  INDUSTRY_OPTIONS,
  type SectionDef,
  type FieldDef,
} from "@/lib/knowledge-taxonomy";
import type { KnowledgeJson } from "@/lib/knowledge-to-markdown";

// ─── Props ─────────────────────────────────────────────────────────────────

interface Props {
  saveAction: (formData: FormData) => Promise<void>;
  initialIndustryCode: string;
  initialData: KnowledgeJson;
}

// ─── 自定义字段行（行业专属手动添加）──────────────────────────────────────

interface CustomField {
  id: string;
  label: string;
  value: string;
}

function CustomFieldsEditor({
  fields,
  onChange,
}: {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}) {
  function addField() {
    onChange([...fields, { id: crypto.randomUUID(), label: "", value: "" }]);
  }

  function updateField(id: string, key: "label" | "value", val: string) {
    onChange(fields.map((f) => (f.id === id ? { ...f, [key]: val } : f)));
  }

  function removeField(id: string) {
    onChange(fields.filter((f) => f.id !== id));
  }

  const base =
    "rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-700 focus:ring-1 focus:ring-stone-700";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-700">自定义字段（手动添加行业特有信息）</p>
        <button
          type="button"
          onClick={addField}
          className="flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-stone-700"
        >
          <Plus className="h-3.5 w-3.5" />
          添加字段
        </button>
      </div>
      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 py-8 text-center">
          <p className="text-sm text-stone-400">暂无自定义字段，点击右上角添加</p>
          <p className="mt-1 text-xs text-stone-300">例如：特有工艺参数、专业认证、行业标准等</p>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="flex gap-2">
              <input
                type="text"
                className={`w-2/5 ${base}`}
                placeholder="字段名称（如：热处理工艺）"
                value={field.label}
                onChange={(e) => updateField(field.id, "label", e.target.value)}
              />
              <input
                type="text"
                className={`flex-1 ${base}`}
                placeholder="填写内容"
                value={field.value}
                onChange={(e) => updateField(field.id, "value", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeField(field.id)}
                className="shrink-0 rounded-xl border border-red-100 p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 字段渲染 ────────────────────────────────────────────────────────────────

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | string[] | undefined;
  onChange: (val: string | string[]) => void;
}) {
  const base =
    "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-700 focus:ring-1 focus:ring-stone-700";

  if (field.type === "textarea") {
    return (
      <textarea
        className={`${base} min-h-[80px] resize-y`}
        placeholder={field.placeholder}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        className={base}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">— 请选择 —</option>
        {field.options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-wrap gap-2">
        {field.options?.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onChange(selected.filter((s) => s !== opt));
                } else {
                  onChange([...selected, opt]);
                }
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                isSelected
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {isSelected ? "✓ " : ""}
              {opt}
            </button>
          );
        })}
      </div>
    );
  }

  if (field.type === "yesno") {
    const strVal =
      value === "true" || value === "yes"
        ? "yes"
        : value === "false" || value === "no"
          ? "no"
          : "";
    return (
      <div className="flex gap-3">
        {[
          { val: "yes", label: "✅ 是" },
          { val: "no", label: "❌ 否" },
        ].map(({ val, label }) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
              strVal === val
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  if (field.type === "list") {
    const items: string[] = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              className={base}
              value={item}
              placeholder={field.placeholder}
              onChange={(e) => {
                const next = [...items];
                next[idx] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="shrink-0 text-stone-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="rounded-lg border border-dashed border-stone-300 px-4 py-1.5 text-xs text-stone-400 hover:border-stone-500 hover:text-stone-600"
        >
          + 添加一条
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        type={field.type === "number" ? "number" : "text"}
        className={`${base} ${field.unit ? "pr-16" : ""}`}
        placeholder={field.placeholder}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.unit && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">
          {field.unit}
        </span>
      )}
    </div>
  );
}

// ─── 单个 Section 详情面板 ────────────────────────────────────────────────────

function SectionPanel({
  section,
  data,
  onChange,
  customFields,
  onCustomChange,
  isIndustry,
}: {
  section: SectionDef;
  data: KnowledgeJson[string];
  onChange: (sub: string, key: string, val: string | string[]) => void;
  customFields?: CustomField[];
  onCustomChange?: (fields: CustomField[]) => void;
  isIndustry?: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
        <span className="text-2xl">{section.icon}</span>
        <div>
          <h2 className="text-lg font-bold text-stone-900">{section.title}</h2>
          {section.description && (
            <p className="mt-0.5 text-sm text-stone-500">{section.description}</p>
          )}
        </div>
        {isIndustry && (
          <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            行业专属
          </span>
        )}
      </div>

      {/* 字段 */}
      {section.subsections.map((sub) => (
        <div key={sub.key} className="rounded-2xl border border-stone-100 bg-stone-50 p-5">
          <h3 className="mb-4 text-sm font-semibold text-stone-700">{sub.title}</h3>
          <div className="space-y-4">
            {sub.fields.map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 block text-sm font-medium text-stone-800">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-400">*</span>}
                </label>
                {field.hint && (
                  <p className="mb-1.5 text-xs text-stone-400">{field.hint}</p>
                )}
                <FieldInput
                  field={field}
                  value={data?.[sub.key]?.[field.key]}
                  onChange={(val) => onChange(sub.key, field.key, val)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 行业专属：自定义字段 */}
      {isIndustry && customFields !== undefined && onCustomChange && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <CustomFieldsEditor fields={customFields} onChange={onCustomChange} />
        </div>
      )}
    </div>
  );
}

// ─── 行业选择面板 ─────────────────────────────────────────────────────────────

function IndustryPickerPanel({
  industryCode,
  onChange,
}: {
  industryCode: string;
  onChange: (code: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-stone-500" />
          <h2 className="text-lg font-bold text-stone-900">行业设置</h2>
        </div>
        <p className="mt-1 text-sm text-stone-500">
          选择客户행业，AI 会在回复询盘时注入该行业专属的知识（材质、认证、工艺参数等）
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {INDUSTRY_OPTIONS.map((opt) => (
          <button
            key={opt.code}
            type="button"
            onClick={() => onChange(opt.code)}
            className={`rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
              industryCode === opt.code
                ? "bg-stone-900 text-white ring-2 ring-stone-900"
                : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-stone-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange("")}
          className={`rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
            !industryCode
              ? "bg-stone-200 text-stone-700 ring-2 ring-stone-400"
              : "bg-white text-stone-400 ring-1 ring-stone-200 hover:ring-stone-400"
          }`}
        >
          暂不选择
        </button>
      </div>

      {industryCode ? (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
          ✅ 已选行业：
          <strong>{INDUSTRY_OPTIONS.find((o) => o.code === industryCode)?.label}</strong>
          ，左侧导航底部将出现「行业专属」模块
        </div>
      ) : (
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          💡 未选择行业，AI 将只使用通用知识回复询盘
        </div>
      )}
    </div>
  );
}

// ─── 整体完成度计算 ───────────────────────────────────────────────────────────

function calcPct(section: SectionDef, data: KnowledgeJson[string]) {
  const total = section.subsections.reduce((s, sub) => s + sub.fields.length, 0);
  const filled = section.subsections.reduce(
    (s, sub) =>
      s +
      sub.fields.filter((f) => {
        const v = data?.[sub.key]?.[f.key];
        return Array.isArray(v) ? v.length > 0 : Boolean(v);
      }).length,
    0,
  );
  return total > 0 ? Math.round((filled / total) * 100) : 0;
}

// ─── 主组件 ──────────────────────────────────────────────────────────────────

const INDUSTRY_PANEL = "__industry__";

export default function KnowledgeEditor({ saveAction, initialIndustryCode, initialData }: Props) {
  const [industryCode, setIndustryCode] = useState(initialIndustryCode);
  const [data, setData] = useState<KnowledgeJson>(
    initialData && Object.keys(initialData).length > 0 ? initialData : {},
  );
  // 自定义行业字段（存在 data["__custom__"] 下）
  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    const raw = (initialData as Record<string, unknown>)["__custom__"];
    if (Array.isArray(raw)) return raw as CustomField[];
    return [];
  });

  const [activePanel, setActivePanel] = useState<string>(INDUSTRY_PANEL);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const activeIndustrySection = INDUSTRY_SECTIONS.find((s) => s.industryCode === industryCode);

  function updateField(sectionCode: string, subKey: string, fieldKey: string, val: string | string[]) {
    setData((prev) => ({
      ...prev,
      [sectionCode]: {
        ...prev[sectionCode],
        [subKey]: {
          ...prev[sectionCode]?.[subKey],
          [fieldKey]: val,
        },
      },
    }));
  }

  function handleSubmit() {
    const fd = new FormData();
    fd.set("industryCode", industryCode);
    // 把自定义字段合并进 data
    const mergedData = { ...data, __custom__: customFields as unknown };
    fd.set("knowledgeSectionsJson", JSON.stringify(mergedData));

    startTransition(async () => {
      await saveAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  // 导航菜单项
  type NavItem = { id: string; icon: string; label: string; pct: number; isIndustry?: boolean };
  const navItems: NavItem[] = [
    {
      id: INDUSTRY_PANEL,
      icon: "🌐",
      label: "行业设置",
      pct: industryCode ? 100 : 0,
    },
    ...UNIVERSAL_SECTIONS.map((s) => ({
      id: s.code,
      icon: s.icon,
      label: s.title,
      pct: calcPct(s, data[s.code] ?? {}),
    })),
    ...(activeIndustrySection
      ? [
          {
            id: activeIndustrySection.code,
            icon: activeIndustrySection.icon,
            label: `${activeIndustrySection.title}（专属）`,
            pct: calcPct(activeIndustrySection, data[activeIndustrySection.code] ?? {}),
            isIndustry: true,
          },
        ]
      : []),
  ];

  // 当前面板：industry picker 或具体 section
  const currentSection =
    activePanel === INDUSTRY_PANEL
      ? null
      : ([...UNIVERSAL_SECTIONS, ...(activeIndustrySection ? [activeIndustrySection] : [])].find(
          (s) => s.code === activePanel,
        ) ?? null);

  const isCurrentIndustry = currentSection?.code === activeIndustrySection?.code;

  return (
    <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <div className="flex min-h-[600px] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

        {/* ── 左侧导航 ── */}
        <aside className="w-56 shrink-0 border-r border-stone-100 bg-stone-50">
          <div className="p-3">
            <p className="px-2 pb-2 text-[10px] font-black uppercase tracking-widest text-stone-400">
              知识库模块
            </p>
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = activePanel === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePanel(item.id)}
                    className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
                      isActive
                        ? "bg-stone-900 text-white"
                        : "text-stone-700 hover:bg-stone-200 hover:text-stone-900"
                    }`}
                  >
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className="flex-1 text-xs font-medium leading-tight">{item.label}</span>

                    {/* 完成度小圆点 */}
                    <span
                      className={`shrink-0 rounded-full text-[9px] font-bold transition ${
                        item.pct === 100
                          ? isActive
                            ? "bg-green-400 px-1.5 py-0.5 text-white"
                            : "bg-green-100 px-1.5 py-0.5 text-green-700"
                          : item.pct > 0
                            ? isActive
                              ? "bg-amber-400 px-1.5 py-0.5 text-white"
                              : "bg-amber-100 px-1.5 py-0.5 text-amber-700"
                            : isActive
                              ? "text-stone-400"
                              : "text-stone-300"
                      }`}
                    >
                      {item.pct > 0 ? `${item.pct}%` : ""}
                    </span>

                    {!isActive && <ChevronRight className="h-3 w-3 shrink-0 text-stone-300 group-hover:text-stone-500" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 行业专属提示 */}
          {!activeIndustrySection && (
            <div className="m-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="text-xs leading-5 text-amber-700">
                💡 点击「行业设置」选择行业后，这里会出现<strong>行业专属</strong>模块
              </p>
            </div>
          )}
        </aside>

        {/* ── 右侧内容 ── */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 p-6">
            {activePanel === INDUSTRY_PANEL ? (
              <IndustryPickerPanel
                industryCode={industryCode}
                onChange={(code) => {
                  setIndustryCode(code);
                  if (code) {
                    const sec = INDUSTRY_SECTIONS.find((s) => s.industryCode === code);
                    if (sec) setActivePanel(sec.code);
                  }
                }}
              />
            ) : currentSection ? (
              <SectionPanel
                section={currentSection}
                data={data[currentSection.code] ?? {}}
                onChange={(sub, key, val) => updateField(currentSection.code, sub, key, val)}
                isIndustry={isCurrentIndustry}
                customFields={isCurrentIndustry ? customFields : undefined}
                onCustomChange={isCurrentIndustry ? setCustomFields : undefined}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-300">
                <Settings className="h-8 w-8" />
              </div>
            )}
          </div>

          {/* ── 底部保存栏 ── */}
          <div className="sticky bottom-0 flex items-center justify-between border-t border-stone-100 bg-white/80 px-6 py-4 backdrop-blur">
            <p className="text-xs text-stone-400">
              总完成度：
              {Math.round(
                navItems.slice(1).reduce((sum, n) => sum + n.pct, 0) /
                  Math.max(navItems.slice(1).length, 1),
              )}
              %
            </p>
            <button
              type="submit"
              disabled={isPending}
              className={`flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-semibold text-white shadow-md transition ${
                saved
                  ? "bg-green-600"
                  : "bg-stone-900 hover:bg-stone-700 disabled:opacity-60"
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  已保存！AI 正在学习...
                </>
              ) : isPending ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  保存 &amp; 让 AI 学习
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </form>
  );
}

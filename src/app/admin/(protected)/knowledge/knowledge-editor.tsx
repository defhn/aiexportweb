"use client";

import { useState, useRef, useTransition } from "react";
import {
  Save,
  CheckCircle,
  Globe,
  Plus,
  Trash2,
  Settings,
  ChevronDown,
} from "lucide-react";

import {
  UNIVERSAL_SECTIONS,
  INDUSTRY_SECTIONS,
  INDUSTRY_OPTIONS,
  type SectionDef,
  type FieldDef,
} from "@/lib/knowledge-taxonomy";
import type { KnowledgeJson } from "@/lib/knowledge-to-markdown";

interface Props {
  saveAction: (formData: FormData) => Promise<void>;
  initialIndustryCode: string;
  initialData: KnowledgeJson;
}

// ─── 自定义字段（行业专属手动添加）─────────────────────────────────────────

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
  const base =
    "rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-stone-700 focus:ring-1 focus:ring-stone-700";

  function addField() {
    onChange([...fields, { id: crypto.randomUUID(), label: "", value: "" }]);
  }
  function updateField(id: string, key: "label" | "value", val: string) {
    onChange(fields.map((f) => (f.id === id ? { ...f, [key]: val } : f)));
  }
  function removeField(id: string) {
    onChange(fields.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-700">
          自定义字段
          <span className="ml-2 text-xs font-normal text-stone-400">手动添加行业特有信息</span>
        </p>
        <button
          type="button"
          onClick={addField}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-3.5 w-3.5" />
          添加字段
        </button>
      </div>
      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 py-6 text-center">
          <p className="text-sm text-stone-400">暂无自定义字段，点击右上角「添加字段」</p>
          <p className="mt-1 text-xs text-stone-300">例如：特有工艺参数、专业认证、行业标准编号等</p>
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="flex gap-2">
              <input
                type="text"
                className={`w-1/3 ${base}`}
                placeholder="字段名（如：热处理工艺）"
                value={field.label}
                onChange={(e) => updateField(field.id, "label", e.target.value)}
              />
              <input
                type="text"
                className={`flex-1 ${base}`}
                placeholder="内容"
                value={field.value}
                onChange={(e) => updateField(field.id, "value", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeField(field.id)}
                className="shrink-0 rounded-xl border border-red-100 p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
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
              onClick={() =>
                onChange(isSelected ? selected.filter((s) => s !== opt) : [...selected, opt])
              }
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
      value === "true" || value === "yes" ? "yes" : value === "false" || value === "no" ? "no" : "";
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

// ─── Section 内容面板 ────────────────────────────────────────────────────────

// ─── 英文填写提示横幅 ───────────────────────────────────────────────────────

function EnglishTip() {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
      <span className="mt-0.5 text-lg leading-none">💡</span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-amber-800">
          建议用英文填写此模块
        </p>
        <p className="text-xs leading-relaxed text-amber-700">
          这里的内容会被 AI 直接注入到给欧美客户的邮件回复中。
          <strong>用中文填写会产生「翻译损耗」</strong>——
          AI 需要先理解中文、再翻译成英文输出，专业术语（如材质牌号、认证标准、交货条款）
          容易变得不准确或不地道，同时也会消耗更多 AI 算力。
          直接用英文填写，AI 可以原文引用，回复更精准、更专业。
        </p>
      </div>
    </div>
  );
}

function SectionContent({
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
      {/* 英文填写提示 */}
      <EnglishTip />
      {/* 字段按子分类分组，每组 2 列网格 */}
      {section.subsections.map((sub) => (
        <div key={sub.key}>
          <h3 className="mb-4 text-sm font-semibold text-stone-600">{sub.title}</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 xl:grid-cols-3">
            {sub.fields.map((field) => (
              <div
                key={field.key}
                className={
                  field.type === "textarea" || field.type === "list"
                    ? "col-span-2 xl:col-span-3"
                    : field.type === "multiselect" || field.type === "yesno"
                      ? "col-span-2 xl:col-span-2"
                      : ""
                }
              >
                <label className="mb-1.5 block text-sm font-medium text-stone-800">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-400">*</span>}
                </label>
                {field.hint && <p className="mb-1.5 text-xs text-stone-400">{field.hint}</p>}
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
        <div className="border-t border-blue-100 pt-6">
          <CustomFieldsEditor fields={customFields} onChange={onCustomChange} />
        </div>
      )}
    </div>
  );
}

// ─── 行业选择 Tab 内容 ───────────────────────────────────────────────────────

function IndustryPickerContent({
  industryCode,
  onChange,
}: {
  industryCode: string;
  onChange: (code: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-stone-700">
          选择你的行业类别
        </h3>
        <p className="mt-1 text-xs text-stone-400">
          选中后，页面右侧会出现该行业专属 Tab（如材质牌号、认证、工艺参数等），AI 精准注入对应知识
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {INDUSTRY_OPTIONS.map((opt) => (
          <button
            key={opt.code}
            type="button"
            onClick={() => onChange(opt.code)}
            className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              industryCode === opt.code
                ? "bg-stone-900 text-white ring-2 ring-stone-900"
                : "bg-stone-50 text-stone-700 ring-1 ring-stone-200 hover:bg-stone-100"
            }`}
          >
            {opt.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange("")}
          className={`rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
            !industryCode
              ? "bg-stone-200 text-stone-700 ring-2 ring-stone-400"
              : "bg-stone-50 text-stone-400 ring-1 ring-stone-200 hover:bg-stone-100"
          }`}
        >
          暂不选择
        </button>
      </div>

      {industryCode ? (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
          ✅ 已选：
          <strong>{INDUSTRY_OPTIONS.find((o) => o.code === industryCode)?.label}</strong>
          ——顶部 Tab 栏已出现「行业专属」标签
        </div>
      ) : (
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          💡 未选择行业时，AI 只使用通用知识回复询盘
        </div>
      )}
    </div>
  );
}

// ─── 完成度计算 ──────────────────────────────────────────────────────────────

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

const INDUSTRY_TAB = "__industry__";

export default function KnowledgeEditor({ saveAction, initialIndustryCode, initialData }: Props) {
  const [industryCode, setIndustryCode] = useState(initialIndustryCode);
  const [data, setData] = useState<KnowledgeJson>(
    initialData && Object.keys(initialData).length > 0 ? initialData : {},
  );
  const [customFields, setCustomFields] = useState<CustomField[]>(() => {
    const raw = (initialData as Record<string, unknown>)["__custom__"];
    return Array.isArray(raw) ? (raw as CustomField[]) : [];
  });
  const [activeTab, setActiveTab] = useState<string>(
    UNIVERSAL_SECTIONS[0]?.code ?? INDUSTRY_TAB,
  );
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const activeIndustrySec = INDUSTRY_SECTIONS.find((s) => s.industryCode === industryCode);

  function updateField(sectionCode: string, subKey: string, fieldKey: string, val: string | string[]) {
    setData((prev) => ({
      ...prev,
      [sectionCode]: {
        ...prev[sectionCode],
        [subKey]: { ...prev[sectionCode]?.[subKey], [fieldKey]: val },
      },
    }));
  }

  function handleSubmit() {
    const fd = new FormData();
    fd.set("industryCode", industryCode);
    const mergedData = { ...data, __custom__: customFields as unknown };
    fd.set("knowledgeSectionsJson", JSON.stringify(mergedData));
    startTransition(async () => {
      await saveAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  // 建立 Tab 列表
  type TabItem = { id: string; icon: string; label: string; pct: number; isIndustry?: boolean };
  const tabs: TabItem[] = [
    { id: INDUSTRY_TAB, icon: "🌐", label: "行业设置", pct: industryCode ? 100 : 0 },
    ...UNIVERSAL_SECTIONS.map((s) => ({
      id: s.code,
      icon: s.icon,
      label: s.title,
      pct: calcPct(s, data[s.code] ?? {}),
    })),
    ...(activeIndustrySec
      ? [
          {
            id: activeIndustrySec.code,
            icon: activeIndustrySec.icon,
            label: "行业专属",
            pct: calcPct(activeIndustrySec, data[activeIndustrySec.code] ?? {}),
            isIndustry: true,
          },
        ]
      : []),
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) ?? tabs[0]!;
  const currentSection =
    activeTab === INDUSTRY_TAB
      ? null
      : ([...UNIVERSAL_SECTIONS, ...(activeIndustrySec ? [activeIndustrySec] : [])].find(
          (s) => s.code === activeTab,
        ) ?? null);

  // 总完成度
  const avgPct = Math.round(
    tabs.slice(1).reduce((sum, t) => sum + t.pct, 0) / Math.max(tabs.slice(1).length, 1),
  );

  return (
    <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {/* ── Tab 导航栏 ── */}
      <div className="mb-0 overflow-x-auto">
        <div className="flex min-w-max border-b border-stone-200">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex shrink-0 items-center gap-2 px-5 py-3.5 text-sm font-medium transition ${
                  isActive
                    ? "text-stone-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-stone-900"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <span className="text-base leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.isIndustry && (
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
                    专属
                  </span>
                )}
                {/* 完成度徽章 */}
                {tab.pct > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      tab.pct === 100
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {tab.pct}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 内容区 ── */}
      <div className="rounded-b-2xl border border-t-0 border-stone-200 bg-white">
        <div className="p-6">
          {activeTab === INDUSTRY_TAB ? (
            <IndustryPickerContent
              industryCode={industryCode}
              onChange={(code) => {
                setIndustryCode(code);
                if (code) {
                  const sec = INDUSTRY_SECTIONS.find((s) => s.industryCode === code);
                  if (sec) setActiveTab(sec.code);
                }
              }}
            />
          ) : currentSection ? (
            <SectionContent
              section={currentSection}
              data={data[currentSection.code] ?? {}}
              onChange={(sub, key, val) => updateField(currentSection.code, sub, key, val)}
              isIndustry={currentTab.isIndustry}
              customFields={currentTab.isIndustry ? customFields : undefined}
              onCustomChange={currentTab.isIndustry ? setCustomFields : undefined}
            />
          ) : (
            <div className="flex items-center justify-center py-12 text-stone-300">
              <Settings className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* ── 底部保存栏 ── */}
        <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <p className="text-xs text-stone-500">
              总完成度
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-stone-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    avgPct === 100 ? "bg-green-500" : avgPct > 40 ? "bg-amber-400" : "bg-stone-400"
                  }`}
                  style={{ width: `${avgPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-stone-700">{avgPct}%</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className={`flex items-center gap-2 rounded-2xl px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
              saved ? "bg-green-600" : "bg-stone-900 hover:bg-stone-700 disabled:opacity-60"
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
      </div>
    </form>
  );
}

"use client";

import { useState, useRef, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle,
  Factory,
  Globe,
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

// ─── 小工具：字段渲染 ────────────────────────────────────────────────────────

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
              {isSelected ? "✓ " : ""}{opt}
            </button>
          );
        })}
      </div>
    );
  }

  if (field.type === "yesno") {
    const strVal = value === "true" || value === "yes" ? "yes" : value === "false" || value === "no" ? "no" : "";
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

    function handleItemChange(idx: number, val: string) {
      const next = [...items];
      next[idx] = val;
      onChange(next);
    }

    function addItem() {
      onChange([...items, ""]);
    }

    function removeItem(idx: number) {
      const next = items.filter((_, i) => i !== idx);
      onChange(next);
    }

    return (
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              className={base}
              value={item}
              placeholder={field.placeholder}
              onChange={(e) => handleItemChange(idx, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="shrink-0 text-stone-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="rounded-lg border border-dashed border-stone-300 px-4 py-1.5 text-xs text-stone-400 hover:border-stone-500 hover:text-stone-600"
        >
          + 添加一条
        </button>
      </div>
    );
  }

  // text / number
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

// ─── Section 手风琴 ──────────────────────────────────────────────────────────

function SectionAccordion({
  section,
  data,
  onChange,
}: {
  section: SectionDef;
  data: KnowledgeJson[string];
  onChange: (sub: string, key: string, val: string | string[]) => void;
}) {
  const [open, setOpen] = useState(true);

  // 计算此 section 的填写完成度
  const totalFields = section.subsections.reduce((s, sub) => s + sub.fields.length, 0);
  const filledFields = section.subsections.reduce((s, sub) => {
    return (
      s +
      sub.fields.filter((f) => {
        const v = data?.[sub.key]?.[f.key];
        return Array.isArray(v) ? v.length > 0 : Boolean(v);
      }).length
    );
  }, 0);
  const pct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-stone-50"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <div>
            <span className="font-semibold text-stone-900">{section.title}</span>
            {section.layer === "industry" && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                行业专属
              </span>
            )}
          </div>
          {/* 填写进度 */}
          <div className="ml-4 flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full transition-all ${
                  pct === 100 ? "bg-green-500" : pct > 0 ? "bg-amber-400" : "bg-stone-200"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-stone-400">{pct}%</span>
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-stone-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-stone-400" />
        )}
      </button>

      {open && (
        <div className="divide-y divide-stone-100 border-t border-stone-100">
          {section.subsections.map((sub) => (
            <div key={sub.key} className="p-5">
              <h3 className="mb-4 text-sm font-medium text-stone-600">{sub.title}</h3>
              <div className="space-y-4">
                {sub.fields.map((field) => (
                  <div key={field.key}>
                    <label className="mb-1.5 block text-sm font-medium text-stone-800">
                      {field.label}
                      {field.required && <span className="ml-1 text-red-500">*</span>}
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
        </div>
      )}
    </div>
  );
}

// ─── 主组件 ──────────────────────────────────────────────────────────────────

export default function KnowledgeEditor({
  saveAction,
  initialIndustryCode,
  initialData,
}: Props) {
  const [industryCode, setIndustryCode] = useState(initialIndustryCode);
  const [data, setData] = useState<KnowledgeJson>(
    initialData && Object.keys(initialData).length > 0 ? initialData : {},
  );
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const activeIndustrySection = INDUSTRY_SECTIONS.find(
    (s) => s.industryCode === industryCode,
  );

  function updateField(
    sectionCode: string,
    subKey: string,
    fieldKey: string,
    val: string | string[],
  ) {
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
    fd.set("knowledgeSectionsJson", JSON.stringify(data));

    startTransition(async () => {
      await saveAction(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {/* ── 行业选择 ── */}
      <div className="mb-6 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-stone-500" />
          <span className="text-sm font-semibold text-stone-700">
            第一步：选择你的行业类别
          </span>
          {industryCode && (
            <span className="ml-auto rounded-xl bg-stone-900 px-3 py-1 text-xs text-white">
              已选：{INDUSTRY_OPTIONS.find((o) => o.code === industryCode)?.label}
            </span>
          )}
        </div>
        <p className="mb-4 text-xs text-stone-400">
          选择后，页面底部会出现该行业专属的知识填写区（如材质、认证、工艺等）
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {INDUSTRY_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setIndustryCode(opt.code)}
              className={`rounded-xl px-3 py-2.5 text-left text-xs font-medium transition ${
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
            onClick={() => setIndustryCode("")}
            className={`rounded-xl px-3 py-2.5 text-left text-xs font-medium transition ${
              !industryCode
                ? "bg-stone-200 text-stone-700 ring-2 ring-stone-400"
                : "bg-white text-stone-400 ring-1 ring-stone-200 hover:ring-stone-400"
            }`}
          >
            暂不选择
          </button>
        </div>
      </div>

      {/* ── 通用模块 U1-U8 ── */}
      <div className="mb-2 flex items-center gap-2">
        <Factory className="h-4 w-4 text-stone-500" />
        <span className="text-sm font-semibold text-stone-700">通用信息（所有询盘 AI 都会参考）</span>
      </div>
      <div className="mb-6 space-y-3">
        {UNIVERSAL_SECTIONS.map((section) => (
          <SectionAccordion
            key={section.code}
            section={section}
            data={data[section.code] ?? {}}
            onChange={(sub, key, val) => updateField(section.code, sub, key, val)}
          />
        ))}
      </div>

      {/* ── 行业专属模块 ── */}
      {activeIndustrySection && (
        <>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl">{activeIndustrySection.icon}</span>
            <span className="text-sm font-semibold text-blue-700">
              行业专属信息（仅对{" "}
              {INDUSTRY_OPTIONS.find((o) => o.code === industryCode)?.label} 类询盘精准注入）
            </span>
          </div>
          <div className="mb-6 space-y-3">
            <SectionAccordion
              key={activeIndustrySection.code}
              section={activeIndustrySection}
              data={data[activeIndustrySection.code] ?? {}}
              onChange={(sub, key, val) =>
                updateField(activeIndustrySection.code, sub, key, val)
              }
            />
          </div>
        </>
      )}

      {!industryCode && (
        <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
          💡 请在上方选择行业，将解锁更精准的行业专属知识模块（如材质牌号、认证类型、工艺参数等）
        </div>
      )}

      {/* ── 保存按钮 ── */}
      <div className="sticky bottom-6 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition ${
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
    </form>
  );
}

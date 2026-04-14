/**
 * knowledge-to-markdown.ts
 *
 * 将结构化 JSON 知识库 → 格式化 Markdown（供 RAG 使用）
 * 用户只填表单，系统自动生成 Markdown，用户永远看不到 Markdown。
 */

import {
  UNIVERSAL_SECTIONS,
  INDUSTRY_SECTIONS,
  type SectionDef,
  getIndustryLabel,
} from "@/lib/knowledge-taxonomy";

export type KnowledgeJson = Record<string, Record<string, Record<string, string | string[]>>>;

/**
 * 将存储在 DB 中的 knowledge_sections_json 转换为 RAG 用 Markdown。
 * 每个 section 独立为一个 ## 章节，便于分块向量化。
 */
export function convertKnowledgeToMarkdown(
  data: KnowledgeJson,
  industryCode: string | null | undefined,
): string {
  const parts: string[] = [];

  // 参与生成的 sections
  const activeSections: SectionDef[] = [...UNIVERSAL_SECTIONS];

  if (industryCode) {
    const industrySec = INDUSTRY_SECTIONS.find((s) => s.industryCode === industryCode);
    if (industrySec) {
      activeSections.push(industrySec);
    }
  }

  for (const section of activeSections) {
    const sectionData = data[section.code];
    if (!sectionData) continue;

    const sectionLines: string[] = [];

    for (const sub of section.subsections) {
      const subData = sectionData[sub.key];
      if (!subData) continue;

      const fieldLines: string[] = [];

      for (const field of sub.fields) {
        const rawValue = subData[field.key];
        if (!rawValue) continue;

        let displayValue: string;

        if (Array.isArray(rawValue)) {
          if (rawValue.length === 0) continue;
          if (field.type === "list") {
            // list → markdown 列表
            displayValue = rawValue.map((item) => `\n  - ${item}`).join("");
          } else {
            // multiselect → 逗号分隔
            displayValue = rawValue.join(", ");
          }
        } else {
          const strVal = String(rawValue).trim();
          if (!strVal) continue;
          displayValue =
            field.type === "yesno"
              ? strVal === "true" || strVal === "yes"
                ? "Yes"
                : "No"
              : strVal;
        }

        const unit = field.unit ? ` (${field.unit})` : "";
        fieldLines.push(`- **${field.label}${unit}**: ${displayValue}`);
      }

      if (fieldLines.length > 0) {
        sectionLines.push(`### ${sub.title}\n${fieldLines.join("\n")}`);
      }
    }

    if (sectionLines.length > 0) {
      const heading =
        section.layer === "industry"
          ? `## ${section.icon} ${section.title} [${getIndustryLabel(industryCode ?? "")}]`
          : `## ${section.icon} ${section.title}`;
      parts.push(`${heading}\n\n${sectionLines.join("\n\n")}`);
    }
  }

  return parts.join("\n\n---\n\n");
}

/**
 * 将单个 section+subsection 的值转换为简短 Markdown 片段。
 * 用于细粒度分块向量化（每个 chunk 对应一个 subsection）。
 */
export function convertSubsectionToMarkdown(
  sectionCode: string,
  subsectionKey: string,
  subsectionTitle: string,
  sectionTitle: string,
  fields: Array<{ label: string; key: string; type: string; unit?: string }>,
  values: Record<string, string | string[]>,
): string {
  const lines: string[] = [`## ${sectionTitle} › ${subsectionTitle}`];

  for (const field of fields) {
    const rawValue = values[field.key];
    if (!rawValue) continue;

    let displayValue: string;
    if (Array.isArray(rawValue)) {
      if (rawValue.length === 0) continue;
      displayValue =
        field.type === "list"
          ? rawValue.map((i) => `\n  - ${i}`).join("")
          : rawValue.join(", ");
    } else {
      const strVal = String(rawValue).trim();
      if (!strVal) continue;
      displayValue =
        field.type === "yesno" ? (strVal === "true" ? "Yes" : "No") : strVal;
    }

    const unit = field.unit ? ` (${field.unit})` : "";
    lines.push(`- **${field.label}${unit}**: ${displayValue}`);
  }

  return lines.join("\n");
}

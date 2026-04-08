import { toSlug } from "@/lib/slug";

export type ProductImportRow = {
  nameZh: string;
  nameEn: string;
  category: string;
  material: string;
  process: string;
  moq: string;
  leadTime: string;
  application: string;
};

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

export function parseProductImportCsv(csvText: string): ProductImportRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  const headers = parseCsvLine(lines[0] ?? "");
  const rows = lines.slice(1).map((line) => parseCsvLine(line));
  const headerIndex = new Map(headers.map((header, index) => [header, index]));

  return rows.map((cells) => ({
    nameZh: cells[headerIndex.get("name_zh") ?? -1] ?? "",
    nameEn: cells[headerIndex.get("name_en") ?? -1] ?? "",
    category: cells[headerIndex.get("category") ?? -1] ?? "",
    material: cells[headerIndex.get("material") ?? -1] ?? "",
    process: cells[headerIndex.get("process") ?? -1] ?? "",
    moq: cells[headerIndex.get("moq") ?? -1] ?? "",
    leadTime: cells[headerIndex.get("lead_time") ?? -1] ?? "",
    application: cells[headerIndex.get("application") ?? -1] ?? "",
  }));
}

export function mapProductCsvRowToImportDraft(
  row: ProductImportRow,
  category: { categoryId: number | null; categoryNameEn: string },
) {
  const nameEn = row.nameEn.trim();

  return {
    product: {
      categoryId: category.categoryId,
      nameZh: row.nameZh.trim(),
      nameEn,
      slug: toSlug(nameEn),
      shortDescriptionEn: `${nameEn} for ${row.application.trim() || "OEM manufacturing"}`,
      shortDescriptionZh: row.nameZh.trim(),
      detailsEn: `${nameEn} manufactured for export projects in ${category.categoryNameEn}.`,
      detailsZh: row.nameZh.trim(),
      status: "draft" as const,
      isFeatured: false,
      showInquiryButton: true,
      showWhatsappButton: true,
      showPdfDownload: false,
      sortOrder: 100,
    },
    defaultFields: {
      material: row.material.trim(),
      process: row.process.trim(),
      moq: row.moq.trim(),
      leadTime: row.leadTime.trim(),
      application: row.application.trim(),
    },
  };
}

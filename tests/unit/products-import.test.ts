import { describe, expect, it } from "vitest";

import {
  mapProductCsvRowToImportDraft,
  parseProductImportCsv,
} from "@/features/products/import";

describe("product csv import helpers", () => {
  it("parses csv rows with the expected headers", () => {
    const rows = parseProductImportCsv(`name_zh,name_en,category,material,process,moq,lead_time,application
支架,Custom Bracket,CNC Parts,Aluminum 6061,CNC Milling,500 pcs,20 days,Industrial enclosure`);

    expect(rows).toEqual([
      {
        nameZh: "支架",
        nameEn: "Custom Bracket",
        category: "CNC Parts",
        material: "Aluminum 6061",
        process: "CNC Milling",
        moq: "500 pcs",
        leadTime: "20 days",
        application: "Industrial enclosure",
      },
    ]);
  });

  it("maps csv rows into product drafts and default fields", () => {
    const draft = mapProductCsvRowToImportDraft(
      {
        nameZh: "支架",
        nameEn: "Custom Bracket",
        category: "CNC Parts",
        material: "Aluminum 6061",
        process: "CNC Milling",
        moq: "500 pcs",
        leadTime: "20 days",
        application: "Industrial enclosure",
      },
      {
        categoryId: 5,
        categoryNameEn: "CNC Parts",
      },
    );

    expect(draft.product).toMatchObject({
      categoryId: 5,
      nameEn: "Custom Bracket",
      slug: "custom-bracket",
    });
    expect(draft.defaultFields).toMatchObject({
      material: "Aluminum 6061",
      process: "CNC Milling",
      moq: "500 pcs",
      leadTime: "20 days",
      application: "Industrial enclosure",
    });
  });
});

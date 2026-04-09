/**
 * Industry Template Initialization Script
 * Usage: npx tsx src/scripts/init-industry-template.ts [template_id]
 * Example: npx tsx src/scripts/init-industry-template.ts precision_machining
 */
import { eq } from "drizzle-orm";
import { getDb } from "../db/client";
import { siteSettings } from "../db/schema";


type FormField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "file";
  required: boolean;
  placeholder?: string;
};

type TemplatePreset = {
  themePrimaryColor: string;
  themeBorderRadius: string;
  themeFontFamily: string;
  formFields: FormField[];
};

// 预设了刚刚帮您切分的 12 大行业模板。这里写入了最典型�?3 个进行打�?const TEMPLATES: Record<string, TemplatePreset> = {
  precision_machining: {
    themePrimaryColor: "#0f172a", // Slate-900 工业�?    themeBorderRadius: "0rem",    // 极简冷酷倒角
    themeFontFamily: "Inter, sans-serif",
    formFields: [
      { name: "material", label: "Required Raw Material", type: "text", required: true, placeholder: "e.g., AL6061-T6, SUS304" },
      { name: "tolerances", label: "Tolerances & Surface Finish", type: "text", required: true, placeholder: "e.g., Anodized, +/- 0.05mm" },
      { name: "volume", label: "Estimated Batch Quantity", type: "text", required: true, placeholder: "e.g., 500 pcs" },
      { name: "drawing", label: "Upload CAD/3D Drawings (.step/.stp)", type: "file", required: true },
    ]
  },
  bulk_chemicals: {
    themePrimaryColor: "#15803d", // Green-700 环保材料�?    themeBorderRadius: "0.25rem", 
    themeFontFamily: "Inter, sans-serif",
    formFields: [
      { name: "purity", label: "Target Purity / Tech Grade", type: "text", required: true, placeholder: "e.g., 99% Tech Grade" },
      { name: "moq", label: "Target Purchasing Volume (MOQ)", type: "text", required: true, placeholder: "e.g., 2 Containers / 50 Tons" },
      { name: "port", label: "Target Destination Port", type: "text", required: false, placeholder: "e.g., Port of Long Beach" },
      { name: "application", label: "End Application", type: "textarea", required: false, placeholder: "What will you use this material for?" },
    ]
  },
  beauty_fmcg: {
    themePrimaryColor: "#e11d48", // Rose-600 莫兰迪高奢风
    themeBorderRadius: "2rem",    // 极致圆润
    themeFontFamily: "Playfair Display, serif",
    formFields: [
      { name: "target_sku", label: "Interested SKUs / Niche", type: "text", required: true, placeholder: "e.g., Lip Gloss, Eye Shadow" },
      { name: "private_label", label: "Do you need Private Labeling?", type: "text", required: true, placeholder: "Yes, I need my logo on it" },
      { name: "social", label: "WhatsApp / Instagram Handle", type: "text", required: true, placeholder: "Fastest way to reach you" },
    ]
  }
};

async function main() {
  const args = process.argv.slice(2);
  const templateId = args[0] || "precision_machining";

  const preset = TEMPLATES[templateId];
  if (!preset) {
    console.error(`Template "${templateId}" not found. Available templates: ${Object.keys(TEMPLATES).join(", ")}`);
    process.exit(1);
  }

  const db = getDb();
  console.log(`[🚀] Initializing Database with Template: ${templateId}...`);

  // 取到当前�?settings
  const currentSettings = await db.select().from(siteSettings).limit(1);

  if (currentSettings.length === 0) {
    // 还没初始化过，先插一条假的兜�?    console.log("No existing settings found. Inserting default settings row then updating...");
    await db.insert(siteSettings).values({
      companyNameZh: "默认科技",
      companyNameEn: "Default Tech",
      email: "hello@example.com",
    });
  }

  // 开始执行覆�?  await db.update(siteSettings).set({
    themePrimaryColor: preset.themePrimaryColor,
    themeBorderRadius: preset.themeBorderRadius,
    themeFontFamily: preset.themeFontFamily,
    formFieldsJson: preset.formFields,
  });

  console.log(`[✅] Successfully applied preset "${templateId}" to settings!`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed template:", err);
  process.exit(1);
});

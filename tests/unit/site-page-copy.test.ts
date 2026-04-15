import { describe, expect, it } from "vitest";

import {
  buildLegalPageContent,
  buildPricingPageContent,
} from "@/features/public/site-page-copy";

const site = {
  name: "Medical Demo",
  slug: "medical-demo",
  domain: "medical.example.com",
  subdomain: "medical",
  templateId: "template-05",
  seedPackKey: "medical-health",
  plan: "growth",
  status: "active",
  companyName: "Medical Demo",
  enabledFeaturesJson: ["blog_management"],
} as const;

const settings = {
  companyNameEn: "MedCore Devices Co., Ltd.",
  companyNameZh: "美德医疗器械有限公司",
  email: "sales@medcore.example",
  phone: "+86 755 0000 1111",
  whatsapp: "+86 13800001111",
  addressEn: "Biomedical Park, Shenzhen, China",
  addressZh: "深圳生物医药产业园",
  siteUrl: "https://medical.example.com",
} as const;

describe("site page copy", () => {
  it("builds pricing copy from the current site and settings", () => {
    const content = buildPricingPageContent(site, settings);

    expect(content.eyebrow).toContain("MedCore");
    expect(content.headline).toContain("MedCore Devices");
    expect(content.description).toContain("medical.example.com");
    expect(content.currentPlanLabel).toContain("Growth");
    expect(content.ctaLabel).toContain("MedCore");
  });

  it("builds privacy policy copy with site-specific legal details", () => {
    const content = buildLegalPageContent("privacy", site, settings);

    expect(content.title).toBe("Privacy Policy");
    expect(content.summary).toContain("MedCore Devices");
    expect(content.paragraphs.join(" ")).toContain("sales@medcore.example");
    expect(content.paragraphs.join(" ")).toContain("Biomedical Park, Shenzhen, China");
  });

  it("builds terms copy with site-specific company and domain references", () => {
    const content = buildLegalPageContent("terms", site, settings);

    expect(content.title).toBe("Terms of Use");
    expect(content.summary).toContain("MedCore Devices");
    expect(content.paragraphs.join(" ")).toContain("medical.example.com");
    expect(content.paragraphs.join(" ")).toContain("MedCore Devices");
  });
});

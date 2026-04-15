import type { SeedPack } from "../types";

export const hardwarePlasticsSeedPack: SeedPack = {
  key: "hardware-plastics",
  site: {
    companyNameZh: "五金塑胶科技有限公司",
    companyNameEn: "Hardware Plastics Technology Co., Ltd.",
    taglineZh: "为工业客户提供五金件与塑胶件一体化制造服务。",
    taglineEn: "Integrated hardware and plastic component manufacturing for industrial buyers.",
    email: "sales@hardware-plastics-demo.com",
    phone: "+86 769 8888 8808",
    whatsapp: "+86 13800000008",
    addressZh: "广东省东莞市制造产业园",
    addressEn: "Manufacturing Industrial Park, Dongguan, Guangdong, China",
  },
  pages: {
    home: [
      { moduleKey: "hero", moduleNameZh: "首页横幅", moduleNameEn: "Hero", isEnabled: true, sortOrder: 10, payloadJson: { eyebrow: "Hardware & Plastics Supplier", title: "Precision Hardware and Plastic Components for OEM Production", description: "Stable quality, tight tolerance, and project-based export support for industrial buyers.", primaryCtaLabel: "Request Quote", primaryCtaHref: "/contact" } },
      { moduleKey: "trust-signals", moduleNameZh: "信任标识", moduleNameEn: "Trust Signals", isEnabled: true, sortOrder: 20, payloadJson: { items: ["CNC and injection molding workflow", "PPAP/inspection report support", "Flexible MOQ for pilot orders"] } },
      { moduleKey: "featured-categories", moduleNameZh: "推荐分类", moduleNameEn: "Featured Categories", isEnabled: true, sortOrder: 30, payloadJson: { slugs: ["precision-hardware-parts", "injection-molded-parts"] } },
    ],
    about: [{ moduleKey: "factory-capability", moduleNameZh: "工厂能力", moduleNameEn: "Factory Capability", isEnabled: true, sortOrder: 10, payloadJson: { title: "From design review to mass production", description: "One-stop workflow for machining, molding, assembly, and export shipment." } }],
    contact: [{ moduleKey: "project-brief", moduleNameZh: "项目简介", moduleNameEn: "Project Brief", isEnabled: true, sortOrder: 10, payloadJson: { title: "Send drawing and annual demand", description: "Share tolerances, material grades, and shipping target for fast quoting." } }],
  },
  categories: [
    { nameZh: "精密五金件", nameEn: "Precision Hardware Parts", slug: "precision-hardware-parts", summaryZh: "适用于工业设备与电子产品的精密五金组件。", summaryEn: "Precision metal parts for industrial equipment and electronics.", sortOrder: 10, isFeatured: true },
    { nameZh: "注塑塑胶件", nameEn: "Injection Molded Parts", slug: "injection-molded-parts", summaryZh: "支持结构件与外观件的注塑生产方案。", summaryEn: "Injection molded structural and cosmetic parts for OEM projects.", sortOrder: 20, isFeatured: true },
  ],
  products: [
    { nameZh: "CNC 铝合金支架", nameEn: "CNC Aluminum Bracket", slug: "cnc-aluminum-bracket", categorySlug: "precision-hardware-parts", shortDescriptionZh: "用于自动化设备装配的高精度铝支架。", shortDescriptionEn: "High-precision aluminum bracket for automation assembly.", detailsZh: "可按图纸加工，支持阳极和喷砂表面处理。", detailsEn: "Custom machining by drawing with anodized and sandblasted finish options.", seoTitle: "CNC Aluminum Bracket Manufacturer", seoDescription: "Source precision CNC aluminum brackets with stable export quality.", sortOrder: 10, isFeatured: true, defaultFields: { model: { valueZh: "HB-100", valueEn: "HB-100", visible: true }, material: { valueZh: "AL6061", valueEn: "AL6061", visible: true }, moq: { valueZh: "500 件", valueEn: "500 pcs", visible: true }, lead_time: { valueZh: "15-20 天", valueEn: "15-20 days", visible: true } }, customFields: [{ labelZh: "公差", labelEn: "Tolerance", valueZh: "+/-0.02mm", valueEn: "+/-0.02mm", visible: true, sortOrder: 10 }] },
    { nameZh: "注塑外壳", nameEn: "Injection Molded Housing", slug: "injection-molded-housing", categorySlug: "injection-molded-parts", shortDescriptionZh: "用于消费电子和工控设备的注塑外壳。", shortDescriptionEn: "Injection molded housing for consumer and industrial electronics.", detailsZh: "支持阻燃材料与丝印工艺，适配 OEM 批量生产。", detailsEn: "Supports flame-retardant resin and silk printing for OEM mass production.", seoTitle: "Injection Molded Housing Supplier", seoDescription: "Order custom injection molded housings with quality and delivery control.", sortOrder: 20, isFeatured: false, defaultFields: { model: { valueZh: "IP-220", valueEn: "IP-220", visible: true }, material: { valueZh: "ABS / PC", valueEn: "ABS / PC", visible: true }, moq: { valueZh: "1000 件", valueEn: "1000 pcs", visible: true }, lead_time: { valueZh: "18-25 天", valueEn: "18-25 days", visible: true } }, customFields: [{ labelZh: "颜色", labelEn: "Color", valueZh: "Pantone 定制", valueEn: "Pantone custom", visible: true, sortOrder: 10 }] },
  ],
  blogCategories: [{ nameZh: "制造工艺", nameEn: "Manufacturing Process", slug: "manufacturing-process" }],
  blogPosts: [{ titleZh: "五金+塑胶组合件打样前要确认的参数", titleEn: "Parameters to Confirm Before Prototyping Hardware and Plastic Assemblies", slug: "parameters-before-prototyping-hardware-and-plastic-assemblies", excerptZh: "帮助买家减少打样返工和量产风险。", excerptEn: "A practical checklist to reduce prototype rework and mass-production risk.", contentZh: "建议先确认装配公差、材料收缩率、螺纹方案和表面工艺。", contentEn: "Confirm assembly tolerances, shrinkage rates, thread design, and surface treatment in advance.", categorySlug: "manufacturing-process", tags: ["hardware", "plastics"], publishedAt: "2026-04-14T09:00:00.000Z" }],
  featuredCategorySlugs: ["precision-hardware-parts", "injection-molded-parts"],
  featuredProductSlugs: ["cnc-aluminum-bracket"],
};

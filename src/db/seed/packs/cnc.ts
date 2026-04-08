import type { SeedPack } from "../types";

export const cncSeedPack: SeedPack = {
  key: "cnc",
  site: {
    companyNameZh: "精密数控演示工厂",
    companyNameEn: "Precision CNC Components Co., Ltd.",
    taglineZh: "面向海外买家的高精度 CNC 加工演示站",
    taglineEn: "High-precision CNC machining for global OEM buyers.",
    email: "sales@precision-cnc-demo.com",
    phone: "+86 769 8888 1200",
    whatsapp: "+86 13800000001",
    addressZh: "中国广东省东莞市长安镇智能制造产业园",
    addressEn:
      "Smart Manufacturing Park, Chang'an Town, Dongguan, Guangdong, China",
  },
  pages: {
    home: [
      {
        moduleKey: "hero",
        moduleNameZh: "首屏横幅",
        moduleNameEn: "Hero",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          eyebrow: "Precision CNC Manufacturing",
          title: "Custom CNC Machining Parts for Global OEM Buyers",
          description:
            "From prototypes to volume production, deliver precision, speed, and export-ready quality.",
          primaryCtaLabel: "Get a Quote",
          primaryCtaHref: "/contact",
          secondaryCtaLabel: "Browse Products",
          secondaryCtaHref: "/products",
        },
      },
      {
        moduleKey: "strengths",
        moduleNameZh: "核心优势",
        moduleNameEn: "Core Strengths",
        isEnabled: true,
        sortOrder: 20,
        payloadJson: {
          items: [
            "ISO-ready quality control",
            "Rapid prototyping in 5-7 days",
            "Stable export packaging and documentation",
          ],
        },
      },
      {
        moduleKey: "featured-categories",
        moduleNameZh: "推荐分类",
        moduleNameEn: "Featured Categories",
        isEnabled: true,
        sortOrder: 30,
        payloadJson: {
          slugs: ["aluminum-machining-parts", "stainless-steel-components"],
        },
      },
      {
        moduleKey: "featured-products",
        moduleNameZh: "推荐产品",
        moduleNameEn: "Featured Products",
        isEnabled: true,
        sortOrder: 40,
        payloadJson: {
          slugs: ["custom-aluminum-cnc-bracket", "precision-steel-drive-shaft"],
        },
      },
    ],
    about: [
      {
        moduleKey: "company-story",
        moduleNameZh: "公司介绍",
        moduleNameEn: "Company Story",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          title: "Trusted CNC Manufacturing Partner",
          description:
            "We support overseas sourcing teams with precise machining, stable communication, and transparent lead times.",
        },
      },
    ],
    contact: [
      {
        moduleKey: "contact-card",
        moduleNameZh: "联系信息",
        moduleNameEn: "Contact Card",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          title: "Send your RFQ today",
          description:
            "Share drawings, target material, and quantity so our sales team can prepare a quote.",
        },
      },
    ],
  },
  categories: [
    {
      nameZh: "铝件加工",
      nameEn: "Aluminum Machining Parts",
      slug: "aluminum-machining-parts",
      summaryZh: "适合轻量化结构件、支架和外壳。",
      summaryEn: "Ideal for lightweight brackets, housings, and structural parts.",
      sortOrder: 10,
      isFeatured: true,
    },
    {
      nameZh: "不锈钢零件",
      nameEn: "Stainless Steel Components",
      slug: "stainless-steel-components",
      summaryZh: "适合高强度、耐腐蚀工况。",
      summaryEn: "Suitable for high-strength and corrosion-resistant applications.",
      sortOrder: 20,
      isFeatured: true,
    },
  ],
  products: [
    {
      nameZh: "定制铝合金 CNC 支架",
      nameEn: "Custom Aluminum CNC Bracket",
      slug: "custom-aluminum-cnc-bracket",
      categorySlug: "aluminum-machining-parts",
      shortDescriptionZh: "面向机器人和自动化设备的轻量化精密支架。",
      shortDescriptionEn:
        "A lightweight precision bracket for robotics and automation assemblies.",
      detailsZh:
        "支持来图定制，适合小批量打样和批量交付，表面可阳极氧化处理。",
      detailsEn:
        "Built for custom drawings, this bracket supports prototyping and mass production with anodized surface options.",
      seoTitle: "Custom Aluminum CNC Bracket Manufacturer in China",
      seoDescription:
        "Source custom aluminum CNC brackets with fast sampling, stable tolerances, and export-ready quality control.",
      sortOrder: 10,
      isFeatured: true,
      defaultFields: {
        model: { valueZh: "CNC-BR-001", valueEn: "CNC-BR-001", visible: true },
        material: { valueZh: "6061 铝合金", valueEn: "Aluminum 6061", visible: true },
        process: { valueZh: "CNC 铣削", valueEn: "CNC Milling", visible: true },
        size: { valueZh: "按图纸定制", valueEn: "Custom per drawing", visible: true },
        tolerance: { valueZh: "+/-0.01mm", valueEn: "+/-0.01 mm", visible: true },
        surface_treatment: {
          valueZh: "阳极氧化",
          valueEn: "Anodizing",
          visible: true,
        },
        application: {
          valueZh: "机器人支架、自动化夹具",
          valueEn: "Robot brackets and automation fixtures",
          visible: true,
        },
        moq: { valueZh: "100 件", valueEn: "100 pcs", visible: true },
        sample_lead_time: { valueZh: "5-7 天", valueEn: "5-7 days", visible: true },
        lead_time: { valueZh: "15-20 天", valueEn: "15-20 days", visible: true },
        packaging: {
          valueZh: "防震袋 + 外箱",
          valueEn: "Protective bag + export carton",
          visible: true,
        },
        place_of_origin: { valueZh: "中国东莞", valueEn: "Dongguan, China", visible: true },
        supply_ability: {
          valueZh: "每月 50,000 件",
          valueEn: "50,000 pcs per month",
          visible: true,
        },
        certification: { valueZh: "ISO 9001", valueEn: "ISO 9001", visible: true },
      },
      customFields: [
        {
          labelZh: "硬度",
          labelEn: "Hardness",
          valueZh: "HB 95",
          valueEn: "HB 95",
          visible: true,
          sortOrder: 10,
        },
      ],
    },
    {
      nameZh: "精密不锈钢传动轴",
      nameEn: "Precision Steel Drive Shaft",
      slug: "precision-steel-drive-shaft",
      categorySlug: "stainless-steel-components",
      shortDescriptionZh: "适用于工业传动系统的高同轴度轴类零件。",
      shortDescriptionEn:
        "A high-concentricity shaft component for industrial transmission systems.",
      detailsZh:
        "采用车铣复合工艺，支持热处理和表面抛光，适合出口设备配套。",
      detailsEn:
        "Manufactured with turning and milling processes, this shaft supports heat treatment and polishing for export equipment assembly.",
      seoTitle: "Precision Steel Drive Shaft Supplier",
      seoDescription:
        "Find a reliable supplier for precision steel drive shafts with stable concentricity and on-time delivery.",
      sortOrder: 20,
      isFeatured: true,
      defaultFields: {
        model: { valueZh: "SHAFT-018", valueEn: "SHAFT-018", visible: true },
        material: { valueZh: "SUS 304", valueEn: "SUS 304", visible: true },
        process: { valueZh: "车削 + 铣削", valueEn: "Turning + Milling", visible: true },
        size: { valueZh: "直径 18mm", valueEn: "Diameter 18 mm", visible: true },
        tolerance: { valueZh: "+/-0.005mm", valueEn: "+/-0.005 mm", visible: true },
        application: {
          valueZh: "工业驱动模组",
          valueEn: "Industrial drive modules",
          visible: true,
        },
        moq: { valueZh: "200 件", valueEn: "200 pcs", visible: true },
        lead_time: { valueZh: "18 天", valueEn: "18 days", visible: true },
        certification: { valueZh: "RoHS", valueEn: "RoHS", visible: true },
      },
      customFields: [],
    },
  ],
  blogCategories: [
    {
      nameZh: "CNC 指南",
      nameEn: "CNC Guides",
      slug: "cnc-guides",
    },
  ],
  blogPosts: [
    {
      titleZh: "如何选择中国 CNC 加工供应商",
      titleEn: "How to Choose a CNC Machining Supplier in China",
      slug: "how-to-choose-a-cnc-machining-supplier-in-china",
      excerptZh: "采购团队在筛选供应商时最应该检查的 5 个点。",
      excerptEn:
        "Five practical checks overseas buyers should make before choosing a CNC supplier.",
      contentZh:
        "重点关注公差能力、打样速度、质量体系、沟通效率和稳定交期。",
      contentEn:
        "Focus on tolerance control, prototype speed, quality systems, communication, and delivery consistency.",
      categorySlug: "cnc-guides",
      tags: ["cnc machining", "supplier"],
      publishedAt: "2026-04-01T09:00:00.000Z",
    },
  ],
  featuredCategorySlugs: [
    "aluminum-machining-parts",
    "stainless-steel-components",
  ],
  featuredProductSlugs: [
    "custom-aluminum-cnc-bracket",
    "precision-steel-drive-shaft",
  ],
};

import type { SeedPack } from "../types";

export const buildingMaterialsSeedPack: SeedPack = {
  key: "building-materials",
  site: {
    companyNameZh: "建材金属演示工厂",
    companyNameEn: "Architectural Metal Materials Co., Ltd.",
    taglineZh: "建筑金属与装饰材料的外贸模板站",
    taglineEn: "Architectural metal products for contractors, distributors, and project buyers.",
    email: "sales@building-materials-demo.com",
    phone: "+86 757 7777 3300",
    whatsapp: "+86 13800000003",
    addressZh: "中国广东省佛山市南海区建筑材料产业带",
    addressEn:
      "Building Materials Industrial Zone, Nanhai District, Foshan, Guangdong, China",
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
          eyebrow: "Architectural Metal Supplier",
          title: "Decorative Metal Products for Modern Building Projects",
          description:
            "Support contractors and distributors with export-ready metal panels, railings, and project documentation.",
          primaryCtaLabel: "Request Catalog",
          primaryCtaHref: "/contact",
        },
      },
      {
        moduleKey: "trust-signals",
        moduleNameZh: "信任背书",
        moduleNameEn: "Trust Signals",
        isEnabled: true,
        sortOrder: 20,
        payloadJson: {
          items: [
            "Project documentation support",
            "Surface finish customization",
            "Stable export packaging",
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
          slugs: ["decorative-metal-panels", "architectural-railings"],
        },
      },
    ],
    about: [
      {
        moduleKey: "factory-capability",
        moduleNameZh: "制造能力",
        moduleNameEn: "Manufacturing Capability",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          title: "Built for project-based export supply",
          description:
            "We help buyers coordinate finish options, dimensions, and shipment schedules for construction projects.",
        },
      },
    ],
    contact: [
      {
        moduleKey: "quote-support",
        moduleNameZh: "报价支持",
        moduleNameEn: "Quotation Support",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          title: "Send drawings or BOQ for quotation",
          description:
            "Our team can help match finishes, thickness, and package requirements for your project.",
        },
      },
    ],
  },
  categories: [
    {
      nameZh: "装饰金属板",
      nameEn: "Decorative Metal Panels",
      slug: "decorative-metal-panels",
      summaryZh: "适用于幕墙、室内装饰和立面系统。",
      summaryEn:
        "Ideal for facades, interior cladding, and architectural feature walls.",
      sortOrder: 10,
      isFeatured: true,
    },
    {
      nameZh: "建筑栏杆",
      nameEn: "Architectural Railings",
      slug: "architectural-railings",
      summaryZh: "适用于商业和住宅项目的栏杆系统。",
      summaryEn:
        "Railing systems for commercial and residential construction projects.",
      sortOrder: 20,
      isFeatured: true,
    },
  ],
  products: [
    {
      nameZh: "铝蜂窝墙板",
      nameEn: "Aluminum Honeycomb Wall Panel",
      slug: "aluminum-honeycomb-wall-panel",
      categorySlug: "decorative-metal-panels",
      shortDescriptionZh: "轻量化、高平整度的建筑幕墙与内装墙板方案。",
      shortDescriptionEn:
        "A lightweight, high-flatness panel solution for facades and interior walls.",
      detailsZh:
        "支持颜色、厚度和安装结构定制，适合项目制采购和出口包装运输。",
      detailsEn:
        "Available in customized colors, thicknesses, and fixing structures for project supply and export shipping.",
      seoTitle: "Aluminum Honeycomb Wall Panel Manufacturer",
      seoDescription:
        "Order architectural aluminum honeycomb wall panels with custom finishes, thickness options, and export support.",
      sortOrder: 10,
      isFeatured: true,
      defaultFields: {
        model: { valueZh: "AHP-12", valueEn: "AHP-12", visible: true },
        material: { valueZh: "铝板 + 蜂窝芯", valueEn: "Aluminum sheet + honeycomb core", visible: true },
        size: { valueZh: "1220 x 2440 mm", valueEn: "1220 x 2440 mm", visible: true },
        surface_treatment: {
          valueZh: "PVDF 涂层",
          valueEn: "PVDF coating",
          visible: true,
        },
        color: { valueZh: "按色卡定制", valueEn: "Custom color matching", visible: true },
        application: {
          valueZh: "幕墙、室内背景墙",
          valueEn: "Facade cladding and interior feature walls",
          visible: true,
        },
        moq: { valueZh: "200 平方米", valueEn: "200 sqm", visible: true },
        lead_time: { valueZh: "20-25 天", valueEn: "20-25 days", visible: true },
        packaging: {
          valueZh: "木箱包装",
          valueEn: "Wooden crate packing",
          visible: true,
        },
        place_of_origin: { valueZh: "中国佛山", valueEn: "Foshan, China", visible: true },
        certification: { valueZh: "ISO 9001", valueEn: "ISO 9001", visible: true },
      },
      customFields: [
        {
          labelZh: "板厚",
          labelEn: "Panel Thickness",
          valueZh: "10 / 15 / 20 mm",
          valueEn: "10 / 15 / 20 mm",
          visible: true,
          sortOrder: 10,
        },
      ],
    },
    {
      nameZh: "不锈钢玻璃栏杆",
      nameEn: "Stainless Steel Glass Railing",
      slug: "stainless-steel-glass-railing",
      categorySlug: "architectural-railings",
      shortDescriptionZh: "适用于商业空间和住宅项目的现代栏杆系统。",
      shortDescriptionEn:
        "A modern railing system for commercial spaces and residential developments.",
      detailsZh:
        "可按项目尺寸、玻璃厚度和表面效果定制，支持整套五金配件供应。",
      detailsEn:
        "Customizable by project dimensions, glass thickness, and finish, with full hardware supply available.",
      seoTitle: "Stainless Steel Glass Railing Supplier",
      seoDescription:
        "Source export-ready stainless steel glass railings for building and renovation projects.",
      sortOrder: 20,
      isFeatured: false,
      defaultFields: {
        model: { valueZh: "RLG-08", valueEn: "RLG-08", visible: true },
        material: { valueZh: "不锈钢 304 / 316", valueEn: "Stainless steel 304 / 316", visible: true },
        surface_treatment: {
          valueZh: "拉丝 / 镜面",
          valueEn: "Brushed / Mirror finish",
          visible: true,
        },
        application: {
          valueZh: "阳台、楼梯、走廊",
          valueEn: "Balconies, staircases, and corridors",
          visible: true,
        },
        moq: { valueZh: "50 米", valueEn: "50 meters", visible: true },
        lead_time: { valueZh: "18-22 天", valueEn: "18-22 days", visible: true },
        certification: { valueZh: "ASTM", valueEn: "ASTM", visible: true },
      },
      customFields: [
        {
          labelZh: "玻璃厚度",
          labelEn: "Glass Thickness",
          valueZh: "10-12 mm",
          valueEn: "10-12 mm",
          visible: true,
          sortOrder: 10,
        },
      ],
    },
  ],
  blogCategories: [
    {
      nameZh: "建材选型",
      nameEn: "Material Selection",
      slug: "material-selection",
    },
  ],
  blogPosts: [
    {
      titleZh: "幕墙项目选择金属板材时要比较什么",
      titleEn: "What to Compare When Choosing Metal Panels for Facade Projects",
      slug: "what-to-compare-when-choosing-metal-panels-for-facade-projects",
      excerptZh: "帮助分销商和项目采购快速筛选合适材料。",
      excerptEn:
        "A practical comparison guide for distributors and project buyers selecting panel systems.",
      contentZh: "应重点比较平整度、涂层寿命、防火等级、安装方式和运输包装。",
      contentEn:
        "Buyers should compare flatness, coating durability, fire rating, fixing method, and shipping protection.",
      categorySlug: "material-selection",
      tags: ["metal panels", "facade"],
      publishedAt: "2026-04-03T09:00:00.000Z",
    },
  ],
  featuredCategorySlugs: ["decorative-metal-panels", "architectural-railings"],
  featuredProductSlugs: ["aluminum-honeycomb-wall-panel"],
};

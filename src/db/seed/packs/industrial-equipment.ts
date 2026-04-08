import type { SeedPack } from "../types";

export const industrialEquipmentSeedPack: SeedPack = {
  key: "industrial-equipment",
  site: {
    companyNameZh: "工业设备演示工厂",
    companyNameEn: "Industrial Equipment Systems Co., Ltd.",
    taglineZh: "自动化设备与整线方案的外贸演示站",
    taglineEn: "Automation equipment and production line solutions for export buyers.",
    email: "sales@industrial-equipment-demo.com",
    phone: "+86 512 6666 2200",
    whatsapp: "+86 13800000002",
    addressZh: "中国江苏省苏州市工业园区智能装备基地",
    addressEn:
      "Intelligent Equipment Base, Suzhou Industrial Park, Jiangsu, China",
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
          eyebrow: "Automation Equipment Manufacturer",
          title: "Custom Industrial Equipment Built for Efficient Production",
          description:
            "Help buyers launch production lines faster with tailored automation equipment and dependable engineering support.",
          primaryCtaLabel: "Request Solution",
          primaryCtaHref: "/contact",
        },
      },
      {
        moduleKey: "applications",
        moduleNameZh: "应用行业",
        moduleNameEn: "Applications",
        isEnabled: true,
        sortOrder: 20,
        payloadJson: {
          items: ["Packaging", "Food processing", "Assembly automation"],
        },
      },
      {
        moduleKey: "featured-categories",
        moduleNameZh: "推荐分类",
        moduleNameEn: "Featured Categories",
        isEnabled: true,
        sortOrder: 30,
        payloadJson: {
          slugs: ["automation-equipment", "conveying-systems"],
        },
      },
    ],
    about: [
      {
        moduleKey: "factory-capability",
        moduleNameZh: "工厂实力",
        moduleNameEn: "Factory Capability",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          title: "From concept to commissioning",
          description:
            "Engineering, fabrication, assembly, and testing are managed in-house for better lead-time control.",
        },
      },
    ],
    contact: [
      {
        moduleKey: "project-brief",
        moduleNameZh: "项目沟通",
        moduleNameEn: "Project Brief",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          title: "Share your process requirements",
          description:
            "Send output targets, factory layout, and product details for a tailored equipment proposal.",
        },
      },
    ],
  },
  categories: [
    {
      nameZh: "自动化设备",
      nameEn: "Automation Equipment",
      slug: "automation-equipment",
      summaryZh: "用于组装、检测和上下料的自动化单机设备。",
      summaryEn:
        "Standalone automation machines for assembly, inspection, and handling.",
      sortOrder: 10,
      isFeatured: true,
    },
    {
      nameZh: "输送系统",
      nameEn: "Conveying Systems",
      slug: "conveying-systems",
      summaryZh: "适用于连续生产和车间物流的输送方案。",
      summaryEn:
        "Conveyor solutions for continuous production and workshop logistics.",
      sortOrder: 20,
      isFeatured: true,
    },
  ],
  products: [
    {
      nameZh: "自动上料系统",
      nameEn: "Automatic Feeding System",
      slug: "automatic-feeding-system",
      categorySlug: "automation-equipment",
      shortDescriptionZh: "适合提升生产节拍和减少人工干预的自动上料方案。",
      shortDescriptionEn:
        "An automatic feeding system designed to raise throughput and reduce manual handling.",
      detailsZh:
        "支持按产品尺寸和节拍定制，适合与机械手、视觉检测和下游工位联动。",
      detailsEn:
        "Customizable by product size and takt time, the system integrates with robots, vision inspection, and downstream stations.",
      seoTitle: "Automatic Feeding System Manufacturer",
      seoDescription:
        "Improve production efficiency with a custom automatic feeding system built for export projects.",
      sortOrder: 10,
      isFeatured: true,
      defaultFields: {
        model: { valueZh: "AFS-200", valueEn: "AFS-200", visible: true },
        material: { valueZh: "碳钢 + 铝型材", valueEn: "Carbon steel + aluminum profile", visible: true },
        process: { valueZh: "焊接装配", valueEn: "Fabrication and assembly", visible: true },
        size: { valueZh: "按产线定制", valueEn: "Customized by line layout", visible: true },
        application: {
          valueZh: "包装、装配、检测产线",
          valueEn: "Packaging, assembly, and inspection lines",
          visible: true,
        },
        moq: { valueZh: "1 套", valueEn: "1 set", visible: true },
        lead_time: { valueZh: "25-35 天", valueEn: "25-35 days", visible: true },
        supply_ability: {
          valueZh: "每月 30 套",
          valueEn: "30 sets per month",
          visible: true,
        },
        certification: { valueZh: "CE", valueEn: "CE", visible: true },
      },
      customFields: [
        {
          labelZh: "电压",
          labelEn: "Voltage",
          valueZh: "380V / 50Hz",
          valueEn: "380V / 50Hz",
          visible: true,
          sortOrder: 10,
        },
      ],
    },
    {
      nameZh: "伺服输送线",
      nameEn: "Servo Conveyor Line",
      slug: "servo-conveyor-line",
      categorySlug: "conveying-systems",
      shortDescriptionZh: "适用于高节拍工位转运的模块化输送线。",
      shortDescriptionEn:
        "A modular conveyor line built for high-speed workstation transfer.",
      detailsZh:
        "支持定位、缓存和节拍同步，可按客户场地布局快速扩展。",
      detailsEn:
        "Supports indexing, buffering, and takt synchronization, with flexible expansion based on factory layout.",
      seoTitle: "Servo Conveyor Line Supplier",
      seoDescription:
        "Source a modular servo conveyor line for automated transfer, positioning, and buffer control.",
      sortOrder: 20,
      isFeatured: false,
      defaultFields: {
        model: { valueZh: "SCL-150", valueEn: "SCL-150", visible: true },
        material: { valueZh: "钢结构", valueEn: "Steel structure", visible: true },
        process: { valueZh: "焊接 + 装配", valueEn: "Welding + assembly", visible: true },
        application: {
          valueZh: "自动化工位转运",
          valueEn: "Automated workstation transfer",
          visible: true,
        },
        moq: { valueZh: "1 套", valueEn: "1 set", visible: true },
        lead_time: { valueZh: "20-30 天", valueEn: "20-30 days", visible: true },
        certification: { valueZh: "CE", valueEn: "CE", visible: true },
      },
      customFields: [
        {
          labelZh: "速度范围",
          labelEn: "Speed Range",
          valueZh: "5-30 m/min",
          valueEn: "5-30 m/min",
          visible: true,
          sortOrder: 10,
        },
      ],
    },
  ],
  blogCategories: [
    {
      nameZh: "设备方案",
      nameEn: "Equipment Solutions",
      slug: "equipment-solutions",
    },
  ],
  blogPosts: [
    {
      titleZh: "自动化设备项目立项前要确认的 6 件事",
      titleEn: "6 Things Buyers Should Confirm Before Ordering Automation Equipment",
      slug: "things-to-confirm-before-ordering-automation-equipment",
      excerptZh: "帮助海外买家减少返工和交期风险。",
      excerptEn:
        "A practical checklist that helps buyers reduce rework and delivery risk.",
      contentZh: "应重点确认产品节拍、场地尺寸、接口标准、安全规范和验收条件。",
      contentEn:
        "Key checkpoints include takt time, layout size, interface standards, safety requirements, and acceptance criteria.",
      categorySlug: "equipment-solutions",
      tags: ["automation", "equipment"],
      publishedAt: "2026-04-02T09:00:00.000Z",
    },
  ],
  featuredCategorySlugs: ["automation-equipment", "conveying-systems"],
  featuredProductSlugs: ["automatic-feeding-system"],
};

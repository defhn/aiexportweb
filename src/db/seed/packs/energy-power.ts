import type { SeedPack } from "../types";

export const energyPowerSeedPack: SeedPack = {
  key: "energy-power",
  site: {
    companyNameZh: "能源电力系统有限公司",
    companyNameEn: "Energy Power Systems Co., Ltd.",
    taglineZh: "为工商业项目提供稳定的电力设备与系统集成方案。",
    taglineEn: "Reliable electrical equipment and system integration for industrial and commercial projects.",
    email: "sales@energy-power-demo.com",
    phone: "+86 571 8888 4400",
    whatsapp: "+86 13800000004",
    addressZh: "浙江省杭州市高新区能源装备产业园",
    addressEn: "Energy Equipment Industrial Park, Hangzhou High-Tech Zone, Zhejiang, China",
  },
  pages: {
    home: [
      {
        moduleKey: "hero",
        moduleNameZh: "首页横幅",
        moduleNameEn: "Hero",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          eyebrow: "Power System Integrator",
          title: "Reliable Power Solutions for Industrial and Commercial Projects",
          description:
            "Delivering switchgear, energy storage, and turnkey electrical systems with global project support.",
          primaryCtaLabel: "Request Proposal",
          primaryCtaHref: "/contact",
        },
      },
      {
        moduleKey: "trust-signals",
        moduleNameZh: "信任标识",
        moduleNameEn: "Trust Signals",
        isEnabled: true,
        sortOrder: 20,
        payloadJson: {
          items: [
            "IEC / CE compliant production",
            "Battery system integration support",
            "Export delivery to 40+ countries",
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
          slugs: ["power-distribution", "battery-energy-storage"],
        },
      },
    ],
    about: [
      {
        moduleKey: "factory-capability",
        moduleNameZh: "工厂能力",
        moduleNameEn: "Factory Capability",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          title: "Integrated production for electrical projects",
          description:
            "From panel assembly to factory testing, we control quality and delivery for export projects.",
        },
      },
    ],
    contact: [
      {
        moduleKey: "project-brief",
        moduleNameZh: "项目简介",
        moduleNameEn: "Project Brief",
        isEnabled: true,
        sortOrder: 10,
        payloadJson: {
          title: "Share load profile and site conditions",
          description:
            "Send voltage level, capacity target, and destination market for a tailored proposal.",
        },
      },
    ],
  },
  categories: [
    {
      nameZh: "配电系统",
      nameEn: "Power Distribution",
      slug: "power-distribution",
      summaryZh: "适用于工业园区和商业建筑的低压配电解决方案。",
      summaryEn:
        "Low-voltage distribution solutions for industrial parks and commercial buildings.",
      sortOrder: 10,
      isFeatured: true,
    },
    {
      nameZh: "储能系统",
      nameEn: "Battery Energy Storage",
      slug: "battery-energy-storage",
      summaryZh: "用于削峰填谷和备用电源的工商业储能系统。",
      summaryEn:
        "Commercial and industrial battery systems for peak shaving and backup power.",
      sortOrder: 20,
      isFeatured: true,
    },
  ],
  products: [
    {
      nameZh: "低压开关柜",
      nameEn: "Low Voltage Switchgear",
      slug: "low-voltage-switchgear",
      categorySlug: "power-distribution",
      shortDescriptionZh: "模块化低压开关柜，支持多回路配电和现场扩展。",
      shortDescriptionEn:
        "Modular low-voltage switchgear for multi-circuit power distribution and on-site expansion.",
      detailsZh:
        "可按项目需求配置断路器、母线和保护方案，支持工厂 FAT 验证和出口包装。",
      detailsEn:
        "Configurable breakers, busbars, and protection schemes with factory FAT validation and export packaging.",
      seoTitle: "Low Voltage Switchgear Manufacturer",
      seoDescription:
        "Source project-ready low voltage switchgear with customizable configurations and export support.",
      sortOrder: 10,
      isFeatured: true,
      defaultFields: {
        model: { valueZh: "LVS-630", valueEn: "LVS-630", visible: true },
        material: { valueZh: "镀锌钢板", valueEn: "Galvanized steel enclosure", visible: true },
        application: { valueZh: "工商业配电", valueEn: "Industrial and commercial distribution", visible: true },
        moq: { valueZh: "1 套", valueEn: "1 set", visible: true },
        lead_time: { valueZh: "20-30 天", valueEn: "20-30 days", visible: true },
        certification: { valueZh: "IEC / CE", valueEn: "IEC / CE", visible: true },
      },
      customFields: [
        {
          labelZh: "额定电流",
          labelEn: "Rated Current",
          valueZh: "630A - 3200A",
          valueEn: "630A - 3200A",
          visible: true,
          sortOrder: 10,
        },
      ],
    },
    {
      nameZh: "工商业储能一体柜",
      nameEn: "C&I Battery Storage Cabinet",
      slug: "ci-battery-storage-cabinet",
      categorySlug: "battery-energy-storage",
      shortDescriptionZh: "面向工商业场景的电池储能一体化解决方案。",
      shortDescriptionEn:
        "Integrated battery energy storage solution for commercial and industrial sites.",
      detailsZh:
        "集成电池包、PCS、温控和消防模块，支持并网削峰和备用电源模式。",
      detailsEn:
        "Integrated battery packs, PCS, thermal management, and fire protection for peak shaving and backup modes.",
      seoTitle: "Commercial Battery Storage Cabinet Supplier",
      seoDescription:
        "Deploy scalable C&I battery storage cabinets with smart control and export-ready documentation.",
      sortOrder: 20,
      isFeatured: false,
      defaultFields: {
        model: { valueZh: "BESS-215", valueEn: "BESS-215", visible: true },
        application: { valueZh: "削峰填谷 / 备用供电", valueEn: "Peak shaving / Backup supply", visible: true },
        moq: { valueZh: "1 套", valueEn: "1 set", visible: true },
        lead_time: { valueZh: "25-35 天", valueEn: "25-35 days", visible: true },
        certification: { valueZh: "UN38.3 / CE", valueEn: "UN38.3 / CE", visible: true },
      },
      customFields: [
        {
          labelZh: "额定容量",
          labelEn: "Nominal Capacity",
          valueZh: "215 kWh",
          valueEn: "215 kWh",
          visible: true,
          sortOrder: 10,
        },
      ],
    },
  ],
  blogCategories: [
    {
      nameZh: "电力系统方案",
      nameEn: "Power System Design",
      slug: "power-system-design",
    },
  ],
  blogPosts: [
    {
      titleZh: "工商业储能项目选型前的5个关键参数",
      titleEn: "5 Parameters to Confirm Before Selecting a C&I Battery Storage System",
      slug: "parameters-to-confirm-before-selecting-ci-battery-storage-system",
      excerptZh: "帮助买家快速锁定储能系统配置范围，减少前期沟通成本。",
      excerptEn:
        "A practical checklist to define battery storage configurations early and reduce project rework.",
      contentZh: "建议重点确认负荷曲线、并网条件、放电时长、安装空间与消防要求。",
      contentEn:
        "Focus on load profile, grid interconnection conditions, discharge duration, installation space, and fire safety requirements.",
      categorySlug: "power-system-design",
      tags: ["energy storage", "power"],
      publishedAt: "2026-04-10T09:00:00.000Z",
    },
  ],
  featuredCategorySlugs: ["power-distribution", "battery-energy-storage"],
  featuredProductSlugs: ["low-voltage-switchgear"],
};

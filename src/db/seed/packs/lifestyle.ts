import type { SeedPack } from "../types";

export const lifestyleSeedPack: SeedPack = {
  key: "lifestyle",
  site: {
    companyNameZh: "生活礼品文创有限公司",
    companyNameEn: "Lifestyle Gifts & Creative Co., Ltd.",
    taglineZh: "让礼品、文创与生活方式产品更有温度。",
    taglineEn: "Warm, practical gifts and lifestyle products for modern brands.",
    email: "sales@lifestyle-gifts-demo.com",
    phone: "+86 755 8888 1200",
    whatsapp: "+86 13800000012",
    addressZh: "广东省东莞市文创礼品产业园",
    addressEn: "Creative Gifts Industrial Park, Dongguan, Guangdong, China",
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
          eyebrow: "Lifestyle Gifts & Creative Products",
          title: "Warm, Practical Gift Products That Feel Special",
          description:
            "Create gift sets, stationery, and lifestyle items with custom branding, packaging, and export-ready support.",
          primaryCtaLabel: "Request Samples",
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
            "Private label and custom packaging",
            "Low-MOQ seasonal gift launches",
            "Sustainable material options",
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
          slugs: ["gift-sets", "stationery", "home-lifestyle"],
        },
      },
      {
        moduleKey: "final-cta",
        moduleNameZh: "底部行动号召",
        moduleNameEn: "Final CTA",
        isEnabled: true,
        sortOrder: 40,
        payloadJson: {
          eyebrow: "Seasonal Collection Planning",
          title: "Need a sourcing partner for gift and lifestyle products?",
          description:
            "Send your concept, target price, and packaging needs, and we’ll prepare a practical production plan.",
          primaryCtaLabel: "Start a Project",
          primaryCtaHref: "/contact",
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
          title: "From idea to gift-ready delivery",
          description:
            "We handle sourcing, customization, assembly, packaging, and final inspection for export programs.",
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
          title: "Share your product concept",
          description:
            "Tell us the target audience, packaging direction, and order volume for a tailored proposal.",
        },
      },
    ],
  },
  categories: [
    {
      nameZh: "礼盒套装",
      nameEn: "Gift Sets",
      slug: "gift-sets",
      summaryZh: "适合节日、活动和品牌赠礼的组合套装。",
      summaryEn: "Bundle sets for holidays, events, and branded gifting.",
      sortOrder: 10,
      isFeatured: true,
    },
    {
      nameZh: "文具用品",
      nameEn: "Stationery",
      slug: "stationery",
      summaryZh: "兼顾实用性与品牌形象的文具产品。",
      summaryEn: "Stationery products that balance usefulness and brand presence.",
      sortOrder: 20,
      isFeatured: true,
    },
    {
      nameZh: "家居生活",
      nameEn: "Home Lifestyle",
      slug: "home-lifestyle",
      summaryZh: "用于日常生活与家居场景的轻量礼品。",
      summaryEn: "Light lifestyle gifts for everyday home use.",
      sortOrder: 30,
      isFeatured: true,
    },
  ],
  products: [
    {
      nameZh: "香薰礼盒",
      nameEn: "Aroma Gift Set",
      slug: "aroma-gift-set",
      categorySlug: "gift-sets",
      shortDescriptionZh: "适合季节性活动与品牌赠礼的香薰组合。",
      shortDescriptionEn: "Aromatic gift set designed for seasonal campaigns and brand gifting.",
      detailsZh:
        "支持香型定制、盒型设计和品牌烫金，适合零售和企业礼品渠道。",
      detailsEn:
        "Supports scent customization, box design, and branded foil stamping for retail and corporate gifting.",
      seoTitle: "Aroma Gift Set Manufacturer",
      seoDescription: "Source custom aroma gift sets with private label packaging.",
      sortOrder: 10,
      isFeatured: true,
      defaultFields: {
        model: { valueZh: "AGS-01", valueEn: "AGS-01", visible: true },
        material: { valueZh: "玻璃 + 纸盒", valueEn: "Glass + paper box", visible: true },
        process: { valueZh: "灌装 + 包装", valueEn: "Filling + packaging", visible: true },
        application: { valueZh: "节日礼品", valueEn: "Seasonal gifting", visible: true },
        moq: { valueZh: "500 套", valueEn: "500 sets", visible: true },
        lead_time: { valueZh: "15-25 天", valueEn: "15-25 days", visible: true },
        supply_ability: { valueZh: "每月 20,000 套", valueEn: "20,000 sets per month", visible: true },
        certification: { valueZh: "MSDS", valueEn: "MSDS", visible: true },
      },
      customFields: [{ labelZh: "香型", labelEn: "Fragrance", valueZh: "可定制", valueEn: "Customizable", visible: true, sortOrder: 10 }],
    },
    {
      nameZh: "金属记事本",
      nameEn: "Metal Notebook",
      slug: "metal-notebook",
      categorySlug: "stationery",
      shortDescriptionZh: "适合企业赠礼与品牌活动的高质感文具。",
      shortDescriptionEn: "A premium stationery item for corporate gifting and brand events.",
      detailsZh:
        "支持封面材质、内页格式和包装方式定制，满足品牌礼品需求。",
      detailsEn:
        "Supports custom cover materials, page formats, and packaging methods for branded gifting.",
      seoTitle: "Metal Notebook Supplier",
      seoDescription: "Order premium notebooks with custom branding and packaging.",
      sortOrder: 20,
      isFeatured: false,
      defaultFields: {
        model: { valueZh: "MN-88", valueEn: "MN-88", visible: true },
        material: { valueZh: "金属 + 纸张", valueEn: "Metal + paper", visible: true },
        process: { valueZh: "压印 + 组装", valueEn: "Embossing + assembly", visible: true },
        application: { valueZh: "礼品文具", valueEn: "Gift stationery", visible: true },
        moq: { valueZh: "300 件", valueEn: "300 pcs", visible: true },
        lead_time: { valueZh: "12-20 天", valueEn: "12-20 days", visible: true },
        certification: { valueZh: "FSC 可选", valueEn: "FSC optional", visible: true },
      },
      customFields: [{ labelZh: "封面工艺", labelEn: "Cover Finish", valueZh: "激光雕刻", valueEn: "Laser engraving", visible: true, sortOrder: 10 }],
    },
  ],
  blogCategories: [{ nameZh: "礼品策划", nameEn: "Gifting Strategy", slug: "gifting-strategy" }],
  blogPosts: [
    {
      titleZh: "品牌礼品采购如何平衡预算、包装与感知价值",
      titleEn: "How Brands Balance Budget, Packaging, and Perceived Value in Gift Procurement",
      slug: "balance-budget-packaging-perceived-value",
      excerptZh: "礼品采购不只是控制成本，也要提升品牌触达。",
      excerptEn: "Gift sourcing is not just about controlling cost; it also shapes brand perception.",
      contentZh: "可通过材质选择、包装结构与组合方式提升礼品感知价值。",
      contentEn: "Perceived value can be improved through materials, packaging structure, and bundling.",
      categorySlug: "gifting-strategy",
      tags: ["gifts", "branding"],
      publishedAt: "2026-04-06T09:00:00.000Z",
    },
  ],
  featuredCategorySlugs: ["gift-sets", "stationery", "home-lifestyle"],
  featuredProductSlugs: ["aroma-gift-set"],
};

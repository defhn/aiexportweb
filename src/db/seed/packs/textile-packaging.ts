import type { SeedPack } from "../types";

export const textilePackagingSeedPack: SeedPack = {
  key: "textile-packaging",
  site: {
    companyNameZh: "轻纺包装科技有限公司",
    companyNameEn: "Textile Packaging Technology Co., Ltd.",
    taglineZh: "提供纺织制品与包装材料的一体化出口服务。",
    taglineEn: "Integrated export supply for textile goods and packaging materials.",
    email: "sales@textile-packaging-demo.com",
    phone: "+86 571 8888 8810",
    whatsapp: "+86 13800000010",
    addressZh: "浙江省绍兴市轻纺产业园",
    addressEn: "Textile Industry Park, Shaoxing, Zhejiang, China",
  },
  pages: {
    home: [
      { moduleKey: "hero", moduleNameZh: "首页横幅", moduleNameEn: "Hero", isEnabled: true, sortOrder: 10, payloadJson: { eyebrow: "Textile & Packaging Supplier", title: "Flexible Textile and Packaging Solutions for Brands and Distributors", description: "From material sourcing to customized packaging production with reliable export fulfillment.", primaryCtaLabel: "Request Samples", primaryCtaHref: "/contact" } },
      { moduleKey: "trust-signals", moduleNameZh: "信任标识", moduleNameEn: "Trust Signals", isEnabled: true, sortOrder: 20, payloadJson: { items: ["Fabric and paper material options", "Private label and custom sizing support", "Low-MOQ launch orders available"] } },
      { moduleKey: "featured-categories", moduleNameZh: "推荐分类", moduleNameEn: "Featured Categories", isEnabled: true, sortOrder: 30, payloadJson: { slugs: ["textile-accessories", "packaging-materials"] } },
    ],
    about: [{ moduleKey: "factory-capability", moduleNameZh: "工厂能力", moduleNameEn: "Factory Capability", isEnabled: true, sortOrder: 10, payloadJson: { title: "From sample swatch to bulk delivery", description: "Fast sampling, flexible production lines, and consolidated export logistics support." } }],
    contact: [{ moduleKey: "project-brief", moduleNameZh: "项目简介", moduleNameEn: "Project Brief", isEnabled: true, sortOrder: 10, payloadJson: { title: "Share product specs and launch timeline", description: "Send target material, dimensions, and packaging style to receive a quick quotation." } }],
  },
  categories: [
    { nameZh: "纺织配件", nameEn: "Textile Accessories", slug: "textile-accessories", summaryZh: "适配服装与家纺品牌的纺织辅料与成品。", summaryEn: "Textile accessories and finished goods for apparel and home textile brands.", sortOrder: 10, isFeatured: true },
    { nameZh: "包装材料", nameEn: "Packaging Materials", slug: "packaging-materials", summaryZh: "用于零售和电商发货的包装方案。", summaryEn: "Packaging solutions for retail channels and e-commerce shipment.", sortOrder: 20, isFeatured: true },
  ],
  products: [
    { nameZh: "棉帆布收纳袋", nameEn: "Cotton Canvas Storage Bag", slug: "cotton-canvas-storage-bag", categorySlug: "textile-accessories", shortDescriptionZh: "可重复使用的棉帆布收纳袋，适用于品牌礼赠和零售。", shortDescriptionEn: "Reusable cotton canvas bag for brand gifting and retail packaging.", detailsZh: "支持尺寸、印花和辅料定制，适配多场景使用。", detailsEn: "Custom sizes, printing, and trims for different campaign and retail uses.", seoTitle: "Cotton Canvas Bag Manufacturer", seoDescription: "Order custom cotton canvas bags with low-MOQ and private label support.", sortOrder: 10, isFeatured: true, defaultFields: { model: { valueZh: "TP-110", valueEn: "TP-110", visible: true }, material: { valueZh: "12oz 棉帆布", valueEn: "12oz cotton canvas", visible: true }, moq: { valueZh: "1000 件", valueEn: "1000 pcs", visible: true }, lead_time: { valueZh: "12-18 天", valueEn: "12-18 days", visible: true } }, customFields: [{ labelZh: "印刷方式", labelEn: "Printing Method", valueZh: "丝网印", valueEn: "Silk screen", visible: true, sortOrder: 10 }] },
    { nameZh: "牛皮纸邮寄袋", nameEn: "Kraft Mailer Bag", slug: "kraft-mailer-bag", categorySlug: "packaging-materials", shortDescriptionZh: "电商发货常用的环保牛皮纸邮寄袋。", shortDescriptionEn: "Eco-friendly kraft mailer bag for e-commerce shipment.", detailsZh: "支持防水内层与品牌印刷，提升运输保护与展示。", detailsEn: "Optional waterproof inner layer and custom branding for better protection and presentation.", seoTitle: "Kraft Mailer Bag Supplier", seoDescription: "Source custom kraft mailer bags for e-commerce and retail delivery.", sortOrder: 20, isFeatured: false, defaultFields: { model: { valueZh: "KM-75", valueEn: "KM-75", visible: true }, material: { valueZh: "牛皮纸 + PE", valueEn: "Kraft paper + PE", visible: true }, moq: { valueZh: "5000 件", valueEn: "5000 pcs", visible: true }, lead_time: { valueZh: "10-15 天", valueEn: "10-15 days", visible: true } }, customFields: [{ labelZh: "尺寸", labelEn: "Size", valueZh: "可定制", valueEn: "Custom", visible: true, sortOrder: 10 }] },
  ],
  blogCategories: [{ nameZh: "包装趋势", nameEn: "Packaging Trends", slug: "packaging-trends" }],
  blogPosts: [{ titleZh: "品牌电商包装如何兼顾成本与体验", titleEn: "How to Balance Cost and Unboxing Experience in DTC Packaging", slug: "balance-cost-and-unboxing-experience-in-dtc-packaging", excerptZh: "帮助品牌在预算可控下提升开箱体验的建议。", excerptEn: "Actionable ways to improve unboxing experience while keeping packaging cost controlled.", contentZh: "建议从材质分级、结构复用、印刷层级和物流体积优化切入。", contentEn: "Focus on material tiers, structural reuse, print hierarchy, and logistics volume optimization.", categorySlug: "packaging-trends", tags: ["textile", "packaging"], publishedAt: "2026-04-14T11:00:00.000Z" }],
  featuredCategorySlugs: ["textile-accessories", "packaging-materials"],
  featuredProductSlugs: ["cotton-canvas-storage-bag"],
};

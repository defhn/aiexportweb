import type { SeedPack } from "../types";
import {
  buildCncDemoCategories,
  buildCncDemoProducts,
} from "../../../features/demo-catalog/cnc-catalog";

const featuredCategorySlugs = [
  "aluminum-machining-parts",
  "stainless-steel-components",
  "precision-turning-parts",
];

const featuredProductSlugs = [
  "custom-aluminum-cnc-bracket",
  "precision-steel-drive-shaft",
  "cnc-machined-housing",
];

export const cncSeedPack: SeedPack = {
  key: "cnc",
  site: {
    companyNameZh: "精密数控演示工厂",
    companyNameEn: "Precision CNC Components Co., Ltd.",
    taglineZh: "为海外买家提供高精度 CNC 加工与稳定交付�?,
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
            "Mixed production for aluminum, steel, brass, and engineering parts",
          ],
        },
      },
      {
        moduleKey: "trust-signals",
        moduleNameZh: "品牌背书",
        moduleNameEn: "Trust Signals",
        isEnabled: true,
        sortOrder: 30,
        payloadJson: {
          title: "Trusted by global sourcing teams and engineering buyers",
          items: [
            "Siemens",
            "Honeywell",
            "Boeing",
            "Tesla",
            "Medtronic",
            "General Electric",
          ],
        },
      },
      {
        moduleKey: "featured-categories",
        moduleNameZh: "推荐分类",
        moduleNameEn: "Featured Categories",
        isEnabled: true,
        sortOrder: 40,
        payloadJson: {
          eyebrow: "Core Expertise",
          title: "Industry-Leading Solutions",
          description:
            "Organized around the machining capabilities buyers search for most often.",
          slugs: featuredCategorySlugs,
        },
      },
      {
        moduleKey: "factory-capability",
        moduleNameZh: "工厂实力",
        moduleNameEn: "Factory Capability",
        isEnabled: true,
        sortOrder: 50,
        payloadJson: {
          eyebrow: "World-Class Facility",
          title: "Engineered for Scale. Built for Precision.",
          description:
            "Our workshop combines rapid prototyping, stable export production, and disciplined inspection control for long-term OEM programs.",
          items: [
            "5-Axis CNC Machining Centers",
            "Automated Turning and Milling Cells",
            "Hexagon CMM Inspection Systems",
            "ERP-linked production scheduling",
            "Dedicated export packing station",
            "Batch traceability for every shipment",
          ],
          statOneValue: "100k+",
          statOneLabel: "Sq Ft Facility",
          statTwoValue: "150+",
          statTwoLabel: "Advanced Machines",
        },
      },
      {
        moduleKey: "quality-certifications",
        moduleNameZh: "质量认证",
        moduleNameEn: "Quality Certifications",
        isEnabled: true,
        sortOrder: 60,
        payloadJson: {
          eyebrow: "Uncompromising Quality",
          title: "Export-Ready Compliance",
          description:
            "Make inspection standards, audit readiness, and compliance visibility clear from the first RFQ.",
          items: [
            "ISO 9001:2015|Certified quality management system for consistent production quality.",
            "AS9100D|Aerospace-grade process discipline for demanding applications.",
            "SGS Verified|Factory and production workflow audited onsite by third-party inspectors.",
            "RoHS Compliant|Material compliance prepared for export projects and regulated markets.",
          ],
        },
      },
      {
        moduleKey: "featured-products",
        moduleNameZh: "推荐产品",
        moduleNameEn: "Featured Products",
        isEnabled: true,
        sortOrder: 70,
        payloadJson: {
          eyebrow: "Featured Portfolio",
          title: "Precision Parts & Custom Components",
          ctaLabel: "View All Products",
          ctaHref: "/products",
          slugs: featuredProductSlugs,
        },
      },
      {
        moduleKey: "process-steps",
        moduleNameZh: "合作流程",
        moduleNameEn: "Process Steps",
        isEnabled: true,
        sortOrder: 80,
        payloadJson: {
          eyebrow: "Streamlined Process",
          title: "How We Work",
          items: [
            "1. Upload Drawings|Share drawings, target material, and annual volume for review.",
            "2. DFM & Sampling|We confirm manufacturability and build a sample for approval.",
            "3. Stable Production|Approved parts move into controlled batch production.",
            "4. Export Delivery|Packing, labeling, and shipment documents are prepared for dispatch.",
          ],
        },
      },
      {
        moduleKey: "latest-insights",
        moduleNameZh: "博客入口",
        moduleNameEn: "Latest Insights",
        isEnabled: true,
        sortOrder: 90,
        payloadJson: {
          eyebrow: "Engineering Insights",
          title: "Industry Knowledge & News",
        },
      },
      {
        moduleKey: "final-cta",
        moduleNameZh: "底部转化�?,
        moduleNameEn: "Final CTA",
        isEnabled: true,
        sortOrder: 100,
        payloadJson: {
          eyebrow: "Available for New Projects",
          title: "Ready to manufacture with precision?",
          description:
            "Upload your 3D models or 2D drawings today for a professional quotation and DFM feedback.",
          primaryCtaLabel: "Start Your Quote",
          primaryCtaHref: "/request-quote",
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
            "Share drawings, target material, quantity, and delivery market so our sales team can prepare a quote.",
        },
      },
    ],
  },
  categories: buildCncDemoCategories(),
  products: buildCncDemoProducts(),
  blogCategories: [
    {
      nameZh: "CNC 指南",
      nameEn: "CNC Guides",
      slug: "cnc-guides",
    },
  ],
  blogPosts: [
    {
      titleZh: "如何选择中国 CNC 加工供应�?,
      titleEn: "How to Choose a CNC Machining Supplier in China",
      slug: "how-to-choose-a-cnc-machining-supplier-in-china",
      excerptZh: "采购团队在筛选供应商时最应该检查的 5 个关键点�?,
      excerptEn:
        "Five practical checks overseas buyers should make before choosing a CNC supplier.",
      contentZh:
        "重点关注公差能力、打样速度、质量体系、沟通效率和稳定交期，避免只看价格而忽略长期合作成本�?,
      contentEn:
        "Focus on tolerance control, prototype speed, quality systems, communication, and delivery consistency instead of choosing by price alone.",
      categorySlug: "cnc-guides",
      tags: ["cnc machining", "supplier"],
      publishedAt: "2026-04-01T09:00:00.000Z",
    },
  ],
  featuredCategorySlugs,
  featuredProductSlugs,
};

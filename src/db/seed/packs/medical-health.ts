import type { SeedPack } from "../types";
export const medicalHealthSeedPack: SeedPack = {
  "key": "medical-health",
  "site": {
    "companyNameZh": "医疗健康科技有限公司",
    "companyNameEn": "Medical Health Technology Co., Ltd.",
    "taglineZh": "服务全球市场的医疗耗材与康复设备供应商。",
    "taglineEn": "Medical consumables and rehabilitation equipment for global buyers.",
    "email": "sales@medical-health-demo.com",
    "phone": "+86 755 8888 5500",
    "whatsapp": "+86 13800000005",
    "addressZh": "广东省深圳市坪山区生物医药产业园",
    "addressEn": "Biomedical Industrial Park, Pingshan District, Shenzhen, China"
  },
  "pages": {
    "home": [
      {
        "moduleKey": "hero",
        "moduleNameZh": "首页横幅",
        "moduleNameEn": "Hero",
        "isEnabled": true,
        "sortOrder": 10,
        "payloadJson": {
          "eyebrow": "Medical Product Supplier",
          "title": "Reliable Medical Products for Clinical and Home Care Markets",
          "description": "Providing compliant consumables and rehabilitation equipment with export-ready documentation.",
          "primaryCtaLabel": "Request Catalog",
          "primaryCtaHref": "/contact"
        }
      },
      {
        "moduleKey": "trust-signals",
        "moduleNameZh": "信任标识",
        "moduleNameEn": "Trust Signals",
        "isEnabled": true,
        "sortOrder": 20,
        "payloadJson": {
          "items": [
            "ISO 13485 management system",
            "Batch traceability and QC records",
            "Support for CE and FDA markets"
          ]
        }
      },
      {
        "moduleKey": "featured-categories",
        "moduleNameZh": "推荐分类",
        "moduleNameEn": "Featured Categories",
        "isEnabled": true,
        "sortOrder": 30,
        "payloadJson": {
          "slugs": [
            "medical-consumables",
            "rehabilitation-devices"
          ]
        }
      }
    ],
    "about": [
      {
        "moduleKey": "factory-capability",
        "moduleNameZh": "工厂能力",
        "moduleNameEn": "Factory Capability",
        "isEnabled": true,
        "sortOrder": 10,
        "payloadJson": {
          "title": "Quality-driven production and inspection",
          "description": "Clean assembly environment, process controls, and documented final inspections for export orders."
        }
      }
    ],
    "contact": [
      {
        "moduleKey": "project-brief",
        "moduleNameZh": "项目简介",
        "moduleNameEn": "Project Brief",
        "isEnabled": true,
        "sortOrder": 10,
        "payloadJson": {
          "title": "Share quantity and market requirements",
          "description": "Send product list, certifications needed, and destination country for a fast quotation."
        }
      }
    ]
  },
  "categories": [
    {
      "nameZh": "医疗耗材",
      "nameEn": "Medical Consumables",
      "slug": "medical-consumables",
      "summaryZh": "面向医院与诊所的一次性医用耗材。",
      "summaryEn": "Single-use medical consumables for hospitals and clinics.",
      "sortOrder": 10,
      "isFeatured": true
    },
    {
      "nameZh": "康复设备",
      "nameEn": "Rehabilitation Devices",
      "slug": "rehabilitation-devices",
      "summaryZh": "用于术后恢复和居家护理的康复产品。",
      "summaryEn": "Rehabilitation products for post-surgery recovery and home care.",
      "sortOrder": 20,
      "isFeatured": true
    }
  ],
  "products": [
    {
      "nameZh": "一次性医用口罩",
      "nameEn": "Disposable Medical Mask",
      "slug": "disposable-medical-mask",
      "categorySlug": "medical-consumables",
      "shortDescriptionZh": "适用于临床与日常防护场景的一次性口罩。",
      "shortDescriptionEn": "Disposable mask solution for clinical and daily protection.",
      "detailsZh": "支持多层过滤结构与批次追溯，提供出口检测报告。",
      "detailsEn": "Supports multi-layer filtration and batch traceability with export testing reports.",
      "seoTitle": "Disposable Medical Mask Supplier",
      "seoDescription": "Source disposable medical masks with quality documentation and stable export supply.",
      "sortOrder": 10,
      "isFeatured": true,
      "defaultFields": {
        "model": {
          "valueZh": "MM-01",
          "valueEn": "MM-01",
          "visible": true
        },
        "material": {
          "valueZh": "无纺布",
          "valueEn": "Non-woven fabric",
          "visible": true
        },
        "moq": {
          "valueZh": "50000 只",
          "valueEn": "50000 pcs",
          "visible": true
        },
        "lead_time": {
          "valueZh": "15-20 天",
          "valueEn": "15-20 days",
          "visible": true
        },
        "certification": {
          "valueZh": "CE",
          "valueEn": "CE",
          "visible": true
        }
      },
      "customFields": [
        {
          "labelZh": "过滤效率",
          "labelEn": "Filtration Efficiency",
          "valueZh": ">=95%",
          "valueEn": ">=95%",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "便携康复训练器",
      "nameEn": "Portable Rehab Trainer",
      "slug": "portable-rehab-trainer",
      "categorySlug": "rehabilitation-devices",
      "shortDescriptionZh": "用于上肢与下肢功能恢复的便携训练设备。",
      "shortDescriptionEn": "Portable training device for upper and lower limb rehabilitation.",
      "detailsZh": "支持阻力调节和折叠收纳，适配机构和家庭康复场景。",
      "detailsEn": "Features adjustable resistance and foldable design for clinic and home rehab usage.",
      "seoTitle": "Portable Rehabilitation Trainer Manufacturer",
      "seoDescription": "Order portable rehabilitation trainers for therapy centers and home care channels.",
      "sortOrder": 20,
      "isFeatured": false,
      "defaultFields": {
        "model": {
          "valueZh": "RT-08",
          "valueEn": "RT-08",
          "visible": true
        },
        "material": {
          "valueZh": "ABS + 钢结构",
          "valueEn": "ABS + steel frame",
          "visible": true
        },
        "moq": {
          "valueZh": "200 台",
          "valueEn": "200 units",
          "visible": true
        },
        "lead_time": {
          "valueZh": "20-25 天",
          "valueEn": "20-25 days",
          "visible": true
        }
      },
      "customFields": [
        {
          "labelZh": "阻力档位",
          "labelEn": "Resistance Levels",
          "valueZh": "8 档",
          "valueEn": "8 levels",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "medical-health 产品 3",
      "nameEn": "medical-health Product 3",
      "slug": "medical-health-product-3-1776323529968",
      "categorySlug": "medical-consumables",
      "shortDescriptionZh": "这是 medical-health 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the medical-health industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "medical-health 产品 3",
      "seoDescription": "适用于 medical-health 行业的高质量产品。",
      "sortOrder": 4,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "medical-health 产品 4",
      "nameEn": "medical-health Product 4",
      "slug": "medical-health-product-4-1776323530173",
      "categorySlug": "medical-consumables",
      "shortDescriptionZh": "这是 medical-health 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the medical-health industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "medical-health 产品 4",
      "seoDescription": "适用于 medical-health 行业的高质量产品。",
      "sortOrder": 5,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "medical-health 产品 5",
      "nameEn": "medical-health Product 5",
      "slug": "medical-health-product-5-1776323530384",
      "categorySlug": "medical-consumables",
      "shortDescriptionZh": "这是 medical-health 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the medical-health industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "medical-health 产品 5",
      "seoDescription": "适用于 medical-health 行业的高质量产品。",
      "sortOrder": 6,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "medical-health 产品 6",
      "nameEn": "medical-health Product 6",
      "slug": "medical-health-product-6-1776323530616",
      "categorySlug": "medical-consumables",
      "shortDescriptionZh": "这是 medical-health 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the medical-health industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "medical-health 产品 6",
      "seoDescription": "适用于 medical-health 行业的高质量产品。",
      "sortOrder": 7,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "medical-health 产品 7",
      "nameEn": "medical-health Product 7",
      "slug": "medical-health-product-7-1776323530857",
      "categorySlug": "medical-consumables",
      "shortDescriptionZh": "这是 medical-health 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the medical-health industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "medical-health 产品 7",
      "seoDescription": "适用于 medical-health 行业的高质量产品。",
      "sortOrder": 8,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "medical-health 产品 8",
      "nameEn": "medical-health Product 8",
      "slug": "medical-health-product-8-1776323531073",
      "categorySlug": "medical-consumables",
      "shortDescriptionZh": "这是 medical-health 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the medical-health industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "medical-health 产品 8",
      "seoDescription": "适用于 medical-health 行业的高质量产品。",
      "sortOrder": 9,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "medical-health 产品 9",
      "nameEn": "medical-health Product 9",
      "slug": "medical-health-product-9-1776323531319",
      "categorySlug": "medical-consumables",
      "shortDescriptionZh": "这是 medical-health 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the medical-health industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "medical-health 产品 9",
      "seoDescription": "适用于 medical-health 行业的高质量产品。",
      "sortOrder": 10,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "medical-health 产品 10",
      "nameEn": "medical-health Product 10",
      "slug": "medical-health-product-10-1776323531554",
      "categorySlug": "medical-consumables",
      "shortDescriptionZh": "这是 medical-health 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the medical-health industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "medical-health 产品 10",
      "seoDescription": "适用于 medical-health 行业的高质量产品。",
      "sortOrder": 11,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    }
  ],
  "blogCategories": [
    {
      "nameZh": "合规与质量",
      "nameEn": "Compliance and Quality",
      "slug": "compliance-quality"
    }
  ],
  "blogPosts": [
    {
      "titleZh": "医疗耗材出口前应准备的合规文件",
      "titleEn": "Compliance Documents to Prepare Before Exporting Medical Consumables",
      "slug": "compliance-documents-before-exporting-medical-consumables",
      "excerptZh": "帮助买家和分销商更快通过进口审核的文件清单。",
      "excerptEn": "A checklist that helps buyers and distributors pass import reviews faster.",
      "contentZh": "建议提前准备测试报告、批次追溯记录、标签规范和合规声明。",
      "contentEn": "Prepare testing reports, batch traceability records, label standards, and declarations of conformity in advance.",
      "categorySlug": "compliance-quality",
      "tags": [
        "medical",
        "compliance"
      ],
      "publishedAt": "2026-04-11T09:00:00.000Z"
    }
  ],
  "featuredCategorySlugs": [
    "medical-consumables",
    "rehabilitation-devices"
  ],
  "featuredProductSlugs": [
    "disposable-medical-mask"
  ]
};

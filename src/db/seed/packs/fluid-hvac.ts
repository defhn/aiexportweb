import type { SeedPack } from "../types";
export const fluidHvacSeedPack: SeedPack = {
  "key": "fluid-hvac",
  "site": {
    "companyNameZh": "流体暖通工程有限公司",
    "companyNameEn": "Fluid HVAC Engineering Co., Ltd.",
    "taglineZh": "专注暖通系统和流体控制设备的出口供应。",
    "taglineEn": "Export-ready HVAC systems and fluid control equipment for global projects.",
    "email": "sales@fluid-hvac-demo.com",
    "phone": "+86 574 8888 6600",
    "whatsapp": "+86 13800000006",
    "addressZh": "浙江省宁波市高新区暖通设备基地",
    "addressEn": "HVAC Equipment Base, Ningbo High-Tech Zone, Zhejiang, China"
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
          "eyebrow": "HVAC System Supplier",
          "title": "Efficient HVAC and Fluid Solutions for Commercial Projects",
          "description": "Delivering chillers, air handling systems, and valve assemblies with engineering support.",
          "primaryCtaLabel": "Request Solution",
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
            "Project matching and sizing support",
            "Factory testing before shipment",
            "Spare parts and remote commissioning service"
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
            "hvac-equipment",
            "fluid-control-components"
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
          "title": "Engineering and manufacturing in one workflow",
          "description": "From thermal calculation to assembly testing, we help buyers reduce delivery risks."
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
          "title": "Share cooling load and system drawings",
          "description": "Send project specs, operating conditions, and target market for a tailored proposal."
        }
      }
    ]
  },
  "categories": [
    {
      "nameZh": "暖通设备",
      "nameEn": "HVAC Equipment",
      "slug": "hvac-equipment",
      "summaryZh": "用于商用楼宇和工业厂房的暖通核心设备。",
      "summaryEn": "Core HVAC equipment for commercial buildings and industrial facilities.",
      "sortOrder": 10,
      "isFeatured": true
    },
    {
      "nameZh": "流体控制部件",
      "nameEn": "Fluid Control Components",
      "slug": "fluid-control-components",
      "summaryZh": "用于管路系统的阀门、执行器和控制组件。",
      "summaryEn": "Valves, actuators, and control components for piping systems.",
      "sortOrder": 20,
      "isFeatured": true
    }
  ],
  "products": [
    {
      "nameZh": "风冷模块机组",
      "nameEn": "Air-Cooled Modular Chiller",
      "slug": "air-cooled-modular-chiller",
      "categorySlug": "hvac-equipment",
      "shortDescriptionZh": "适用于商业建筑的高效模块化冷水机组。",
      "shortDescriptionEn": "High-efficiency modular chiller for commercial building cooling systems.",
      "detailsZh": "支持多机并联和智能控制，便于分期建设项目部署。",
      "detailsEn": "Supports multi-unit parallel operation and smart control for phased project deployment.",
      "seoTitle": "Air-Cooled Modular Chiller Supplier",
      "seoDescription": "Deploy modular chillers with smart controls and export-ready support for commercial HVAC projects.",
      "sortOrder": 10,
      "isFeatured": true,
      "defaultFields": {
        "model": {
          "valueZh": "AMC-180",
          "valueEn": "AMC-180",
          "visible": true
        },
        "application": {
          "valueZh": "商业建筑制冷",
          "valueEn": "Commercial cooling",
          "visible": true
        },
        "moq": {
          "valueZh": "1 套",
          "valueEn": "1 set",
          "visible": true
        },
        "lead_time": {
          "valueZh": "25-30 天",
          "valueEn": "25-30 days",
          "visible": true
        }
      },
      "customFields": [
        {
          "labelZh": "制冷量",
          "labelEn": "Cooling Capacity",
          "valueZh": "180 kW",
          "valueEn": "180 kW",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "电动调节阀组",
      "nameEn": "Motorized Control Valve Set",
      "slug": "motorized-control-valve-set",
      "categorySlug": "fluid-control-components",
      "shortDescriptionZh": "适用于暖通和工业流体系统的电动调节阀组件。",
      "shortDescriptionEn": "Motorized control valve assembly for HVAC and industrial fluid systems.",
      "detailsZh": "支持多口径和执行器选型，适配楼宇自控系统。",
      "detailsEn": "Available in multiple diameters with actuator options for BMS integration.",
      "seoTitle": "Motorized Control Valve Set Manufacturer",
      "seoDescription": "Source motorized valve sets with reliable flow control and project integration support.",
      "sortOrder": 20,
      "isFeatured": false,
      "defaultFields": {
        "model": {
          "valueZh": "MCV-50",
          "valueEn": "MCV-50",
          "visible": true
        },
        "material": {
          "valueZh": "黄铜 / 不锈钢",
          "valueEn": "Brass / Stainless steel",
          "visible": true
        },
        "moq": {
          "valueZh": "300 套",
          "valueEn": "300 sets",
          "visible": true
        },
        "lead_time": {
          "valueZh": "18-22 天",
          "valueEn": "18-22 days",
          "visible": true
        }
      },
      "customFields": [
        {
          "labelZh": "口径范围",
          "labelEn": "Size Range",
          "valueZh": "DN15 - DN100",
          "valueEn": "DN15 - DN100",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "fluid-hvac 产品 3",
      "nameEn": "fluid-hvac Product 3",
      "slug": "fluid-hvac-product-3-1776323519507",
      "categorySlug": "hvac-equipment",
      "shortDescriptionZh": "这是 fluid-hvac 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the fluid-hvac industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "fluid-hvac 产品 3",
      "seoDescription": "适用于 fluid-hvac 行业的高质量产品。",
      "sortOrder": 4,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "fluid-hvac 产品 4",
      "nameEn": "fluid-hvac Product 4",
      "slug": "fluid-hvac-product-4-1776323519735",
      "categorySlug": "hvac-equipment",
      "shortDescriptionZh": "这是 fluid-hvac 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the fluid-hvac industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "fluid-hvac 产品 4",
      "seoDescription": "适用于 fluid-hvac 行业的高质量产品。",
      "sortOrder": 5,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "fluid-hvac 产品 5",
      "nameEn": "fluid-hvac Product 5",
      "slug": "fluid-hvac-product-5-1776323519950",
      "categorySlug": "hvac-equipment",
      "shortDescriptionZh": "这是 fluid-hvac 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the fluid-hvac industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "fluid-hvac 产品 5",
      "seoDescription": "适用于 fluid-hvac 行业的高质量产品。",
      "sortOrder": 6,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "fluid-hvac 产品 6",
      "nameEn": "fluid-hvac Product 6",
      "slug": "fluid-hvac-product-6-1776323520152",
      "categorySlug": "hvac-equipment",
      "shortDescriptionZh": "这是 fluid-hvac 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the fluid-hvac industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "fluid-hvac 产品 6",
      "seoDescription": "适用于 fluid-hvac 行业的高质量产品。",
      "sortOrder": 7,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "fluid-hvac 产品 7",
      "nameEn": "fluid-hvac Product 7",
      "slug": "fluid-hvac-product-7-1776323520383",
      "categorySlug": "hvac-equipment",
      "shortDescriptionZh": "这是 fluid-hvac 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the fluid-hvac industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "fluid-hvac 产品 7",
      "seoDescription": "适用于 fluid-hvac 行业的高质量产品。",
      "sortOrder": 8,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "fluid-hvac 产品 8",
      "nameEn": "fluid-hvac Product 8",
      "slug": "fluid-hvac-product-8-1776323520589",
      "categorySlug": "hvac-equipment",
      "shortDescriptionZh": "这是 fluid-hvac 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the fluid-hvac industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "fluid-hvac 产品 8",
      "seoDescription": "适用于 fluid-hvac 行业的高质量产品。",
      "sortOrder": 9,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "fluid-hvac 产品 9",
      "nameEn": "fluid-hvac Product 9",
      "slug": "fluid-hvac-product-9-1776323520822",
      "categorySlug": "hvac-equipment",
      "shortDescriptionZh": "这是 fluid-hvac 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the fluid-hvac industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "fluid-hvac 产品 9",
      "seoDescription": "适用于 fluid-hvac 行业的高质量产品。",
      "sortOrder": 10,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "fluid-hvac 产品 10",
      "nameEn": "fluid-hvac Product 10",
      "slug": "fluid-hvac-product-10-1776323521033",
      "categorySlug": "hvac-equipment",
      "shortDescriptionZh": "这是 fluid-hvac 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the fluid-hvac industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "fluid-hvac 产品 10",
      "seoDescription": "适用于 fluid-hvac 行业的高质量产品。",
      "sortOrder": 11,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    }
  ],
  "blogCategories": [
    {
      "nameZh": "项目选型",
      "nameEn": "Project Sizing",
      "slug": "project-sizing"
    }
  ],
  "blogPosts": [
    {
      "titleZh": "暖通项目设备选型前必须确认的参数",
      "titleEn": "Key Parameters to Confirm Before HVAC Equipment Selection",
      "slug": "key-parameters-before-hvac-equipment-selection",
      "excerptZh": "减少后期改造和返工风险的前期参数核对建议。",
      "excerptEn": "A practical parameter checklist to reduce redesign and rework risks in HVAC projects.",
      "contentZh": "重点包括负荷曲线、工况温度、系统控制方式和维护策略。",
      "contentEn": "Focus on load profile, operating temperature, control method, and maintenance strategy.",
      "categorySlug": "project-sizing",
      "tags": [
        "hvac",
        "fluid"
      ],
      "publishedAt": "2026-04-12T09:00:00.000Z"
    }
  ],
  "featuredCategorySlugs": [
    "hvac-equipment",
    "fluid-control-components"
  ],
  "featuredProductSlugs": [
    "air-cooled-modular-chiller"
  ]
};

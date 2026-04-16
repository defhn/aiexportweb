import type { SeedPack } from "../types";
export const consumerElectronicsSeedPack: SeedPack = {
  "key": "consumer-electronics",
  "site": {
    "companyNameZh": "消费电子科技有限公司",
    "companyNameEn": "Consumer Electronics Technology Co., Ltd.",
    "taglineZh": "面向全球品牌的智能消费电子与配件方案。",
    "taglineEn": "Smart consumer electronics and accessories for global brands.",
    "email": "sales@consumer-electronics-demo.com",
    "phone": "+86 755 8888 1100",
    "whatsapp": "+86 13800000011",
    "addressZh": "广东省深圳市宝安区智能终端产业园",
    "addressEn": "Smart Device Industrial Park, Bao'an, Shenzhen, China"
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
          "eyebrow": "Consumer Electronics OEM / ODM",
          "title": "Smart Devices and Accessories Built for Fast-Moving Markets",
          "description": "Support product launches with dependable electronics development, assembly, packaging, and export fulfillment.",
          "primaryCtaLabel": "Request OEM Quote",
          "primaryCtaHref": "/contact"
        }
      },
      {
        "moduleKey": "trust-signals",
        "moduleNameZh": "信任背书",
        "moduleNameEn": "Trust Signals",
        "isEnabled": true,
        "sortOrder": 20,
        "payloadJson": {
          "items": [
            "OEM / ODM development support",
            "Retail and e-commerce packaging",
            "Export compliance guidance"
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
            "smart-accessories",
            "portable-devices"
          ]
        }
      },
      {
        "moduleKey": "final-cta",
        "moduleNameZh": "底部行动号召",
        "moduleNameEn": "Final CTA",
        "isEnabled": true,
        "sortOrder": 40,
        "payloadJson": {
          "eyebrow": "Launch Your Next Product",
          "title": "Need a partner for consumer electronics production?",
          "description": "Share your product brief, target market, and packaging needs, and we’ll prepare a clear manufacturing proposal.",
          "primaryCtaLabel": "Start a Project",
          "primaryCtaHref": "/contact"
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
          "title": "From product concept to mass production",
          "description": "We coordinate engineering, sourcing, assembly, and packaging with tight quality control for launch-ready delivery."
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
          "title": "Tell us about your product brief",
          "description": "Send target specs, packaging preferences, and forecast quantities for a tailored electronics proposal."
        }
      }
    ]
  },
  "categories": [
    {
      "nameZh": "智能配件",
      "nameEn": "Smart Accessories",
      "slug": "smart-accessories",
      "summaryZh": "适用于手机、平板和日常数字设备的智能配件。",
      "summaryEn": "Smart accessories for phones, tablets, and everyday digital devices.",
      "sortOrder": 10,
      "isFeatured": true
    },
    {
      "nameZh": "便携设备",
      "nameEn": "Portable Devices",
      "slug": "portable-devices",
      "summaryZh": "面向便携使用场景的消费电子设备。",
      "summaryEn": "Consumer devices designed for portable everyday use.",
      "sortOrder": 20,
      "isFeatured": true
    }
  ],
  "products": [
    {
      "nameZh": "无线充电底座",
      "nameEn": "Wireless Charging Dock",
      "slug": "wireless-charging-dock",
      "categorySlug": "smart-accessories",
      "shortDescriptionZh": "适合桌面和零售渠道的无线充电解决方案。",
      "shortDescriptionEn": "A wireless charging solution for desks and retail channels.",
      "detailsZh": "支持多设备兼容、礼盒包装和 OEM 定制外观，适合品牌渠道和分销商。",
      "detailsEn": "Supports multi-device compatibility, gift-box packaging, and OEM customization for brands and distributors.",
      "seoTitle": "Wireless Charging Dock Manufacturer",
      "seoDescription": "Source custom wireless charging docks for retail and brand programs.",
      "sortOrder": 10,
      "isFeatured": true,
      "defaultFields": {
        "model": {
          "valueZh": "WCD-100",
          "valueEn": "WCD-100",
          "visible": true
        },
        "material": {
          "valueZh": "ABS + PC",
          "valueEn": "ABS + PC",
          "visible": true
        },
        "process": {
          "valueZh": "注塑 + 装配",
          "valueEn": "Injection molding + assembly",
          "visible": true
        },
        "size": {
          "valueZh": "可定制",
          "valueEn": "Customizable",
          "visible": true
        },
        "application": {
          "valueZh": "桌面充电",
          "valueEn": "Desktop charging",
          "visible": true
        },
        "moq": {
          "valueZh": "500 件",
          "valueEn": "500 pcs",
          "visible": true
        },
        "lead_time": {
          "valueZh": "18-28 天",
          "valueEn": "18-28 days",
          "visible": true
        },
        "supply_ability": {
          "valueZh": "每月 50,000 件",
          "valueEn": "50,000 pcs per month",
          "visible": true
        },
        "certification": {
          "valueZh": "CE / FCC",
          "valueEn": "CE / FCC",
          "visible": true
        }
      },
      "customFields": [
        {
          "labelZh": "接口",
          "labelEn": "Interface",
          "valueZh": "USB-C",
          "valueEn": "USB-C",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "便携蓝牙音箱",
      "nameEn": "Portable Bluetooth Speaker",
      "slug": "portable-bluetooth-speaker",
      "categorySlug": "portable-devices",
      "shortDescriptionZh": "适合电商和礼品市场的便携音频产品。",
      "shortDescriptionEn": "A portable audio product for e-commerce and gifting markets.",
      "detailsZh": "支持多种表面处理、定制包装和礼盒套装，适合品牌出海。",
      "detailsEn": "Supports multiple finishes, custom packaging, and gift sets for brand export programs.",
      "seoTitle": "Portable Bluetooth Speaker Supplier",
      "seoDescription": "Order portable Bluetooth speakers with branding and packaging options.",
      "sortOrder": 20,
      "isFeatured": false,
      "defaultFields": {
        "model": {
          "valueZh": "PBS-260",
          "valueEn": "PBS-260",
          "visible": true
        },
        "material": {
          "valueZh": "ABS + 金属网",
          "valueEn": "ABS + metal mesh",
          "visible": true
        },
        "process": {
          "valueZh": "注塑 + 喇叭装配",
          "valueEn": "Injection molding + speaker assembly",
          "visible": true
        },
        "application": {
          "valueZh": "家庭与户外",
          "valueEn": "Home and outdoor",
          "visible": true
        },
        "moq": {
          "valueZh": "300 件",
          "valueEn": "300 pcs",
          "visible": true
        },
        "lead_time": {
          "valueZh": "20-30 天",
          "valueEn": "20-30 days",
          "visible": true
        },
        "certification": {
          "valueZh": "CE / RoHS",
          "valueEn": "CE / RoHS",
          "visible": true
        }
      },
      "customFields": [
        {
          "labelZh": "续航",
          "labelEn": "Battery Life",
          "valueZh": "8 小时",
          "valueEn": "8 hours",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "consumer-electronics 产品 3",
      "nameEn": "consumer-electronics Product 3",
      "slug": "consumer-electronics-product-3-1776323514683",
      "categorySlug": "smart-accessories",
      "shortDescriptionZh": "这是 consumer-electronics 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the consumer-electronics industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "consumer-electronics 产品 3",
      "seoDescription": "适用于 consumer-electronics 行业的高质量产品。",
      "sortOrder": 4,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "consumer-electronics 产品 4",
      "nameEn": "consumer-electronics Product 4",
      "slug": "consumer-electronics-product-4-1776323514884",
      "categorySlug": "smart-accessories",
      "shortDescriptionZh": "这是 consumer-electronics 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the consumer-electronics industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "consumer-electronics 产品 4",
      "seoDescription": "适用于 consumer-electronics 行业的高质量产品。",
      "sortOrder": 5,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "consumer-electronics 产品 5",
      "nameEn": "consumer-electronics Product 5",
      "slug": "consumer-electronics-product-5-1776323515090",
      "categorySlug": "smart-accessories",
      "shortDescriptionZh": "这是 consumer-electronics 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the consumer-electronics industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "consumer-electronics 产品 5",
      "seoDescription": "适用于 consumer-electronics 行业的高质量产品。",
      "sortOrder": 6,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "consumer-electronics 产品 6",
      "nameEn": "consumer-electronics Product 6",
      "slug": "consumer-electronics-product-6-1776323515334",
      "categorySlug": "smart-accessories",
      "shortDescriptionZh": "这是 consumer-electronics 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the consumer-electronics industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "consumer-electronics 产品 6",
      "seoDescription": "适用于 consumer-electronics 行业的高质量产品。",
      "sortOrder": 7,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "consumer-electronics 产品 7",
      "nameEn": "consumer-electronics Product 7",
      "slug": "consumer-electronics-product-7-1776323515542",
      "categorySlug": "smart-accessories",
      "shortDescriptionZh": "这是 consumer-electronics 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the consumer-electronics industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "consumer-electronics 产品 7",
      "seoDescription": "适用于 consumer-electronics 行业的高质量产品。",
      "sortOrder": 8,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "consumer-electronics 产品 8",
      "nameEn": "consumer-electronics Product 8",
      "slug": "consumer-electronics-product-8-1776323515772",
      "categorySlug": "smart-accessories",
      "shortDescriptionZh": "这是 consumer-electronics 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the consumer-electronics industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "consumer-electronics 产品 8",
      "seoDescription": "适用于 consumer-electronics 行业的高质量产品。",
      "sortOrder": 9,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "consumer-electronics 产品 9",
      "nameEn": "consumer-electronics Product 9",
      "slug": "consumer-electronics-product-9-1776323515976",
      "categorySlug": "smart-accessories",
      "shortDescriptionZh": "这是 consumer-electronics 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the consumer-electronics industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "consumer-electronics 产品 9",
      "seoDescription": "适用于 consumer-electronics 行业的高质量产品。",
      "sortOrder": 10,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "consumer-electronics 产品 10",
      "nameEn": "consumer-electronics Product 10",
      "slug": "consumer-electronics-product-10-1776323517137",
      "categorySlug": "smart-accessories",
      "shortDescriptionZh": "这是 consumer-electronics 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the consumer-electronics industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "consumer-electronics 产品 10",
      "seoDescription": "适用于 consumer-electronics 行业的高质量产品。",
      "sortOrder": 11,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    }
  ],
  "blogCategories": [
    {
      "nameZh": "电子产品方案",
      "nameEn": "Electronics Solutions",
      "slug": "electronics-solutions"
    }
  ],
  "blogPosts": [
    {
      "titleZh": "消费电子品牌出海前要确认的5个包装细节",
      "titleEn": "5 Packaging Details Consumer Electronics Brands Should Confirm Before Export",
      "slug": "packaging-details-consumer-electronics-export",
      "excerptZh": "包装设计会直接影响运输损耗、开箱体验和品牌认知。",
      "excerptEn": "Packaging design directly affects shipping damage, unboxing experience, and brand perception.",
      "contentZh": "需要重点确认内衬结构、外箱强度、插画语言、合规标识和条码位置。",
      "contentEn": "Confirm inner protection, carton strength, artwork language, compliance labels, and barcode placement.",
      "categorySlug": "electronics-solutions",
      "tags": [
        "packaging",
        "consumer-electronics"
      ],
      "publishedAt": "2026-04-05T09:00:00.000Z"
    }
  ],
  "featuredCategorySlugs": [
    "smart-accessories",
    "portable-devices"
  ],
  "featuredProductSlugs": [
    "wireless-charging-dock"
  ]
};

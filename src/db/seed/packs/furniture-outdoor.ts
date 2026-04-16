import type { SeedPack } from "../types";
export const furnitureOutdoorSeedPack: SeedPack = {
  "key": "furniture-outdoor",
  "site": {
    "companyNameZh": "家居户外用品有限公司",
    "companyNameEn": "Furniture Outdoor Products Co., Ltd.",
    "taglineZh": "服务批发商和项目买家的家具与户外产品供应商。",
    "taglineEn": "Furniture and outdoor living products for wholesale and project buyers.",
    "email": "sales@furniture-outdoor-demo.com",
    "phone": "+86 757 8888 8809",
    "whatsapp": "+86 13800000009",
    "addressZh": "广东省佛山市顺德区家具产业带",
    "addressEn": "Furniture Industry Zone, Shunde District, Foshan, Guangdong, China"
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
          "eyebrow": "Outdoor Furniture Exporter",
          "title": "Stylish Indoor and Outdoor Furniture for Retail and Project Buyers",
          "description": "Factory-direct supply with material options, packaging customization, and global shipping support.",
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
            "Material and finish customization",
            "Drop test packaging support",
            "Project and wholesale order handling"
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
            "outdoor-seating",
            "living-room-furniture"
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
          "title": "Flexible production for seasonal collections",
          "description": "From sample development to container loading with quality and lead-time control."
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
          "title": "Share target market and channel",
          "description": "Send style direction, quantities, and destination country for a quick proposal."
        }
      }
    ]
  },
  "categories": [
    {
      "nameZh": "户外座椅",
      "nameEn": "Outdoor Seating",
      "slug": "outdoor-seating",
      "summaryZh": "适用于阳台、庭院和商业户外场景的座椅产品。",
      "summaryEn": "Outdoor seating collections for balcony, patio, and hospitality spaces.",
      "sortOrder": 10,
      "isFeatured": true
    },
    {
      "nameZh": "客厅家具",
      "nameEn": "Living Room Furniture",
      "slug": "living-room-furniture",
      "summaryZh": "现代风格客厅家具与配套软装产品。",
      "summaryEn": "Modern living room furniture with coordinated home styling options.",
      "sortOrder": 20,
      "isFeatured": true
    }
  ],
  "products": [
    {
      "nameZh": "铝编藤休闲椅",
      "nameEn": "Aluminum Wicker Lounge Chair",
      "slug": "aluminum-wicker-lounge-chair",
      "categorySlug": "outdoor-seating",
      "shortDescriptionZh": "轻量耐候，适用于户外项目和零售渠道。",
      "shortDescriptionEn": "Lightweight weather-resistant chair for outdoor projects and retail.",
      "detailsZh": "支持坐垫面料和框架颜色定制，适配不同市场偏好。",
      "detailsEn": "Custom cushion fabrics and frame colors to match regional market preferences.",
      "seoTitle": "Aluminum Wicker Lounge Chair Supplier",
      "seoDescription": "Source outdoor lounge chairs with customization and export logistics support.",
      "sortOrder": 10,
      "isFeatured": true,
      "defaultFields": {
        "model": {
          "valueZh": "FO-301",
          "valueEn": "FO-301",
          "visible": true
        },
        "material": {
          "valueZh": "铝合金 + PE 藤",
          "valueEn": "Aluminum + PE wicker",
          "visible": true
        },
        "moq": {
          "valueZh": "200 件",
          "valueEn": "200 pcs",
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
          "labelZh": "坐垫面料",
          "labelEn": "Cushion Fabric",
          "valueZh": "防水涤纶",
          "valueEn": "Water-resistant polyester",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "布艺沙发组合",
      "nameEn": "Fabric Sofa Set",
      "slug": "fabric-sofa-set",
      "categorySlug": "living-room-furniture",
      "shortDescriptionZh": "适合家居和公寓项目的模块化沙发组合。",
      "shortDescriptionEn": "Modular fabric sofa set for home and apartment furnishing projects.",
      "detailsZh": "可选多种面料和尺寸配置，适合电商和线下零售。",
      "detailsEn": "Available in multiple fabrics and dimensions for online and offline retail channels.",
      "seoTitle": "Fabric Sofa Set Manufacturer",
      "seoDescription": "Order modular fabric sofa sets with packaging and customization options.",
      "sortOrder": 20,
      "isFeatured": false,
      "defaultFields": {
        "model": {
          "valueZh": "FS-902",
          "valueEn": "FS-902",
          "visible": true
        },
        "material": {
          "valueZh": "实木框架 + 布艺",
          "valueEn": "Wood frame + fabric",
          "visible": true
        },
        "moq": {
          "valueZh": "80 套",
          "valueEn": "80 sets",
          "visible": true
        },
        "lead_time": {
          "valueZh": "30-40 天",
          "valueEn": "30-40 days",
          "visible": true
        }
      },
      "customFields": [
        {
          "labelZh": "面料克重",
          "labelEn": "Fabric Weight",
          "valueZh": "320gsm",
          "valueEn": "320gsm",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "furniture-outdoor 产品 3",
      "nameEn": "furniture-outdoor Product 3",
      "slug": "furniture-outdoor-product-3-1776323521271",
      "categorySlug": "outdoor-seating",
      "shortDescriptionZh": "这是 furniture-outdoor 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the furniture-outdoor industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "furniture-outdoor 产品 3",
      "seoDescription": "适用于 furniture-outdoor 行业的高质量产品。",
      "sortOrder": 4,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "furniture-outdoor 产品 4",
      "nameEn": "furniture-outdoor Product 4",
      "slug": "furniture-outdoor-product-4-1776323521477",
      "categorySlug": "outdoor-seating",
      "shortDescriptionZh": "这是 furniture-outdoor 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the furniture-outdoor industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "furniture-outdoor 产品 4",
      "seoDescription": "适用于 furniture-outdoor 行业的高质量产品。",
      "sortOrder": 5,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "furniture-outdoor 产品 5",
      "nameEn": "furniture-outdoor Product 5",
      "slug": "furniture-outdoor-product-5-1776323521708",
      "categorySlug": "outdoor-seating",
      "shortDescriptionZh": "这是 furniture-outdoor 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the furniture-outdoor industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "furniture-outdoor 产品 5",
      "seoDescription": "适用于 furniture-outdoor 行业的高质量产品。",
      "sortOrder": 6,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "furniture-outdoor 产品 6",
      "nameEn": "furniture-outdoor Product 6",
      "slug": "furniture-outdoor-product-6-1776323521910",
      "categorySlug": "outdoor-seating",
      "shortDescriptionZh": "这是 furniture-outdoor 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the furniture-outdoor industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "furniture-outdoor 产品 6",
      "seoDescription": "适用于 furniture-outdoor 行业的高质量产品。",
      "sortOrder": 7,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "furniture-outdoor 产品 7",
      "nameEn": "furniture-outdoor Product 7",
      "slug": "furniture-outdoor-product-7-1776323522110",
      "categorySlug": "outdoor-seating",
      "shortDescriptionZh": "这是 furniture-outdoor 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the furniture-outdoor industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "furniture-outdoor 产品 7",
      "seoDescription": "适用于 furniture-outdoor 行业的高质量产品。",
      "sortOrder": 8,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "furniture-outdoor 产品 8",
      "nameEn": "furniture-outdoor Product 8",
      "slug": "furniture-outdoor-product-8-1776323522312",
      "categorySlug": "outdoor-seating",
      "shortDescriptionZh": "这是 furniture-outdoor 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the furniture-outdoor industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "furniture-outdoor 产品 8",
      "seoDescription": "适用于 furniture-outdoor 行业的高质量产品。",
      "sortOrder": 9,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "furniture-outdoor 产品 9",
      "nameEn": "furniture-outdoor Product 9",
      "slug": "furniture-outdoor-product-9-1776323522556",
      "categorySlug": "outdoor-seating",
      "shortDescriptionZh": "这是 furniture-outdoor 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the furniture-outdoor industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "furniture-outdoor 产品 9",
      "seoDescription": "适用于 furniture-outdoor 行业的高质量产品。",
      "sortOrder": 10,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    },
    {
      "nameZh": "furniture-outdoor 产品 10",
      "nameEn": "furniture-outdoor Product 10",
      "slug": "furniture-outdoor-product-10-1776323522773",
      "categorySlug": "outdoor-seating",
      "shortDescriptionZh": "这是 furniture-outdoor 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the furniture-outdoor industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "furniture-outdoor 产品 10",
      "seoDescription": "适用于 furniture-outdoor 行业的高质量产品。",
      "sortOrder": 11,
      "isFeatured": false,
      "defaultFields": {},
      "customFields": []
    }
  ],
  "blogCategories": [
    {
      "nameZh": "选品与市场",
      "nameEn": "Sourcing and Market",
      "slug": "sourcing-market"
    }
  ],
  "blogPosts": [
    {
      "titleZh": "户外家具出口包装要点",
      "titleEn": "Key Packaging Practices for Exporting Outdoor Furniture",
      "slug": "packaging-practices-for-exporting-outdoor-furniture",
      "excerptZh": "降低运输损耗并提升客户签收体验的实用方法。",
      "excerptEn": "Practical tips to reduce transit damage and improve customer delivery experience.",
      "contentZh": "建议关注跌落测试、边角防护、五金配件分装和外箱标识。",
      "contentEn": "Focus on drop tests, corner protection, hardware segregation, and carton marking.",
      "categorySlug": "sourcing-market",
      "tags": [
        "furniture",
        "outdoor"
      ],
      "publishedAt": "2026-04-14T10:00:00.000Z"
    }
  ],
  "featuredCategorySlugs": [
    "outdoor-seating",
    "living-room-furniture"
  ],
  "featuredProductSlugs": [
    "aluminum-wicker-lounge-chair"
  ]
};

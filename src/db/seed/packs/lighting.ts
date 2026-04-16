export const lightingSeedPack: SeedPack = {
  "key": "lighting",
  "site": {
    "companyNameZh": "照明科技有限公司",
    "companyNameEn": "Lighting Technology Co., Ltd.",
    "taglineZh": "面向全球市场的商业与工业照明产品制造商。",
    "taglineEn": "Commercial and industrial lighting products for global projects.",
    "email": "sales@lighting-demo.com",
    "phone": "+86 760 8888 7700",
    "whatsapp": "+86 13800000007",
    "addressZh": "广东省中山市灯饰产业园",
    "addressEn": "Lighting Industrial Park, Zhongshan, Guangdong, China"
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
          "eyebrow": "Lighting Manufacturer",
          "title": "Professional Lighting Solutions for Retail, Office, and Industrial Spaces",
          "description": "Providing high-efficiency lighting fixtures with flexible OEM/ODM support and export compliance.",
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
            "Photometric test reports available",
            "Stable LED driver supply chain",
            "Project-based packaging and shipping support"
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
            "commercial-lighting",
            "industrial-lighting"
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
          "title": "From optical design to mass production",
          "description": "In-house engineering and production workflow helps buyers launch projects faster."
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
          "title": "Share project type and target illuminance",
          "description": "Send fixture requirements, certification needs, and destination market for quick quoting."
        }
      }
    ]
  },
  "categories": [
    {
      "nameZh": "商业照明",
      "nameEn": "Commercial Lighting",
      "slug": "commercial-lighting",
      "summaryZh": "适用于商场、展厅和办公场景的照明产品。",
      "summaryEn": "Lighting fixtures for retail stores, showrooms, and office projects.",
      "sortOrder": 10,
      "isFeatured": true
    },
    {
      "nameZh": "工业照明",
      "nameEn": "Industrial Lighting",
      "slug": "industrial-lighting",
      "summaryZh": "面向工厂仓储与高位空间的高亮度照明方案。",
      "summaryEn": "High-output lighting solutions for factories, warehouses, and high-bay spaces.",
      "sortOrder": 20,
      "isFeatured": true
    }
  ],
  "products": [
    {
      "nameZh": "LED 线性灯",
      "nameEn": "LED Linear Light",
      "slug": "led-linear-light",
      "categorySlug": "commercial-lighting",
      "shortDescriptionZh": "适用于办公和零售场景的模块化 LED 线性灯。",
      "shortDescriptionEn": "Modular LED linear fixture for office and retail lighting projects.",
      "detailsZh": "支持多长度拼接和多种色温，便于项目标准化部署。",
      "detailsEn": "Supports multi-length connection and color temperature options for standardized deployment.",
      "seoTitle": "LED Linear Light Manufacturer",
      "seoDescription": "Source modular LED linear lights with project-friendly configurations and export support.",
      "sortOrder": 10,
      "isFeatured": true,
      "defaultFields": {
        "model": {
          "valueZh": "LL-1200",
          "valueEn": "LL-1200",
          "visible": true
        },
        "material": {
          "valueZh": "铝型材 + PC",
          "valueEn": "Aluminum + PC",
          "visible": true
        },
        "moq": {
          "valueZh": "500 套",
          "valueEn": "500 sets",
          "visible": true
        },
        "lead_time": {
          "valueZh": "18-22 天",
          "valueEn": "18-22 days",
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
          "labelZh": "光效",
          "labelEn": "Luminous Efficacy",
          "valueZh": "120 lm/W",
          "valueEn": "120 lm/W",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "高棚工矿灯",
      "nameEn": "High Bay Industrial Light",
      "slug": "high-bay-industrial-light",
      "categorySlug": "industrial-lighting",
      "shortDescriptionZh": "适用于仓储和工业厂房的高棚 LED 工矿灯。",
      "shortDescriptionEn": "LED high-bay fixture for warehouse and industrial facility lighting.",
      "detailsZh": "支持不同功率和配光角度，满足多种安装高度需求。",
      "detailsEn": "Available in multiple wattages and beam angles for different mounting heights.",
      "seoTitle": "High Bay Industrial Light Supplier",
      "seoDescription": "Deploy durable LED high-bay lights for industrial and warehouse lighting projects.",
      "sortOrder": 20,
      "isFeatured": false,
      "defaultFields": {
        "model": {
          "valueZh": "HB-200",
          "valueEn": "HB-200",
          "visible": true
        },
        "application": {
          "valueZh": "工业与仓储",
          "valueEn": "Industrial and warehouse",
          "visible": true
        },
        "moq": {
          "valueZh": "300 套",
          "valueEn": "300 sets",
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
          "labelZh": "功率范围",
          "labelEn": "Power Range",
          "valueZh": "100W - 240W",
          "valueEn": "100W - 240W",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "lighting 产品 3",
      "nameEn": "lighting Product 3",
      "slug": "lighting-product-3-1776323528172",
      "shortDescriptionZh": "这是 lighting 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the lighting industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "lighting 产品 3",
      "seoDescription": "适用于 lighting 行业的高质量产品。",
      "sortOrder": 4,
      "isFeatured": false,
      "defaultFields": {
        "price": {
          "valueZh": "¥1000",
          "valueEn": "$150",
          "visible": true
        },
        "sku": {
          "valueZh": "SKU001",
          "valueEn": "SKU001",
          "visible": true
        },
        "stock": {
          "valueZh": "100",
          "valueEn": "100",
          "visible": true
        }
      },
      "customFields": []
    },
    {
      "nameZh": "lighting 产品 4",
      "nameEn": "lighting Product 4",
      "slug": "lighting-product-4-1776323528400",
      "shortDescriptionZh": "这是 lighting 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the lighting industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "lighting 产品 4",
      "seoDescription": "适用于 lighting 行业的高质量产品。",
      "sortOrder": 5,
      "isFeatured": false,
      "defaultFields": {
        "price": {
          "valueZh": "¥1000",
          "valueEn": "$150",
          "visible": true
        },
        "sku": {
          "valueZh": "SKU001",
          "valueEn": "SKU001",
          "visible": true
        },
        "stock": {
          "valueZh": "100",
          "valueEn": "100",
          "visible": true
        }
      },
      "customFields": []
    },
    {
      "nameZh": "lighting 产品 5",
      "nameEn": "lighting Product 5",
      "slug": "lighting-product-5-1776323528619",
      "shortDescriptionZh": "这是 lighting 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the lighting industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "lighting 产品 5",
      "seoDescription": "适用于 lighting 行业的高质量产品。",
      "sortOrder": 6,
      "isFeatured": false,
      "defaultFields": {
        "price": {
          "valueZh": "¥1000",
          "valueEn": "$150",
          "visible": true
        },
        "sku": {
          "valueZh": "SKU001",
          "valueEn": "SKU001",
          "visible": true
        },
        "stock": {
          "valueZh": "100",
          "valueEn": "100",
          "visible": true
        }
      },
      "customFields": []
    },
    {
      "nameZh": "lighting 产品 6",
      "nameEn": "lighting Product 6",
      "slug": "lighting-product-6-1776323528818",
      "shortDescriptionZh": "这是 lighting 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the lighting industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "lighting 产品 6",
      "seoDescription": "适用于 lighting 行业的高质量产品。",
      "sortOrder": 7,
      "isFeatured": false,
      "defaultFields": {
        "price": {
          "valueZh": "¥1000",
          "valueEn": "$150",
          "visible": true
        },
        "sku": {
          "valueZh": "SKU001",
          "valueEn": "SKU001",
          "visible": true
        },
        "stock": {
          "valueZh": "100",
          "valueEn": "100",
          "visible": true
        }
      },
      "customFields": []
    },
    {
      "nameZh": "lighting 产品 7",
      "nameEn": "lighting Product 7",
      "slug": "lighting-product-7-1776323529049",
      "shortDescriptionZh": "这是 lighting 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the lighting industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "lighting 产品 7",
      "seoDescription": "适用于 lighting 行业的高质量产品。",
      "sortOrder": 8,
      "isFeatured": false,
      "defaultFields": {
        "price": {
          "valueZh": "¥1000",
          "valueEn": "$150",
          "visible": true
        },
        "sku": {
          "valueZh": "SKU001",
          "valueEn": "SKU001",
          "visible": true
        },
        "stock": {
          "valueZh": "100",
          "valueEn": "100",
          "visible": true
        }
      },
      "customFields": []
    },
    {
      "nameZh": "lighting 产品 8",
      "nameEn": "lighting Product 8",
      "slug": "lighting-product-8-1776323529323",
      "shortDescriptionZh": "这是 lighting 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the lighting industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "lighting 产品 8",
      "seoDescription": "适用于 lighting 行业的高质量产品。",
      "sortOrder": 9,
      "isFeatured": false,
      "defaultFields": {
        "price": {
          "valueZh": "¥1000",
          "valueEn": "$150",
          "visible": true
        },
        "sku": {
          "valueZh": "SKU001",
          "valueEn": "SKU001",
          "visible": true
        },
        "stock": {
          "valueZh": "100",
          "valueEn": "100",
          "visible": true
        }
      },
      "customFields": []
    },
    {
      "nameZh": "lighting 产品 9",
      "nameEn": "lighting Product 9",
      "slug": "lighting-product-9-1776323529526",
      "shortDescriptionZh": "这是 lighting 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the lighting industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "lighting 产品 9",
      "seoDescription": "适用于 lighting 行业的高质量产品。",
      "sortOrder": 10,
      "isFeatured": false,
      "defaultFields": {
        "price": {
          "valueZh": "¥1000",
          "valueEn": "$150",
          "visible": true
        },
        "sku": {
          "valueZh": "SKU001",
          "valueEn": "SKU001",
          "visible": true
        },
        "stock": {
          "valueZh": "100",
          "valueEn": "100",
          "visible": true
        }
      },
      "customFields": []
    },
    {
      "nameZh": "lighting 产品 10",
      "nameEn": "lighting Product 10",
      "slug": "lighting-product-10-1776323529726",
      "shortDescriptionZh": "这是 lighting 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the lighting industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "lighting 产品 10",
      "seoDescription": "适用于 lighting 行业的高质量产品。",
      "sortOrder": 11,
      "isFeatured": false,
      "defaultFields": {
        "price": {
          "valueZh": "¥1000",
          "valueEn": "$150",
          "visible": true
        },
        "sku": {
          "valueZh": "SKU001",
          "valueEn": "SKU001",
          "visible": true
        },
        "stock": {
          "valueZh": "100",
          "valueEn": "100",
          "visible": true
        }
      },
      "customFields": []
    }
  ],
  "blogCategories": [
    {
      "nameZh": "照明设计",
      "nameEn": "Lighting Design",
      "slug": "lighting-design"
    }
  ],
  "blogPosts": [
    {
      "titleZh": "商业照明项目中常见的选型误区",
      "titleEn": "Common Selection Mistakes in Commercial Lighting Projects",
      "slug": "common-selection-mistakes-in-commercial-lighting-projects",
      "excerptZh": "帮助买家在方案阶段避免眩光、照度不足和维护成本过高问题。",
      "excerptEn": "Avoid glare, under-illumination, and high maintenance costs during lighting planning.",
      "contentZh": "建议优先核对照度需求、显指、UGR 和驱动稳定性等关键指标。",
      "contentEn": "Prioritize illuminance targets, CRI, UGR, and driver stability in early-stage selection.",
      "categorySlug": "lighting-design",
      "tags": [
        "lighting",
        "project"
      ],
      "publishedAt": "2026-04-13T09:00:00.000Z"
    }
  ],
  "featuredCategorySlugs": [
    "commercial-lighting",
    "industrial-lighting"
  ],
  "featuredProductSlugs": [
    "led-linear-light"
  ]
};

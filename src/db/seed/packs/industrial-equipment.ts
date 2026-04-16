export const industrialEquipmentSeedPack: SeedPack = {
  "key": "industrial-equipment",
  "site": {
    "companyNameZh": "工业设备系统有限公司",
    "companyNameEn": "Industrial Equipment Systems Co., Ltd.",
    "taglineZh": "自动化设备和生产线解决方案，服务出口买家。",
    "taglineEn": "Automation equipment and production line solutions for export buyers.",
    "email": "sales@industrial-equipment-demo.com",
    "phone": "+86 512 6666 2200",
    "whatsapp": "+86 13800000002",
    "addressZh": "江苏省苏州市工业园区智能装备基地",
    "addressEn": "Intelligent Equipment Base, Suzhou Industrial Park, Jiangsu, China"
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
          "eyebrow": "Automation Equipment Manufacturer",
          "title": "Custom Industrial Equipment Built for Efficient Production",
          "description": "Help buyers launch production lines faster with tailored automation equipment and dependable engineering support.",
          "primaryCtaLabel": "Request Solution",
          "primaryCtaHref": "/contact"
        }
      },
      {
        "moduleKey": "applications",
        "moduleNameZh": "应用场景",
        "moduleNameEn": "Applications",
        "isEnabled": true,
        "sortOrder": 20,
        "payloadJson": {
          "items": [
            "Packaging",
            "Food processing",
            "Assembly automation"
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
            "automation-equipment",
            "conveying-systems"
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
          "title": "From concept to commissioning",
          "description": "Engineering, fabrication, assembly, and testing are managed in-house for better lead-time control."
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
          "title": "Share your process requirements",
          "description": "Send output targets, factory layout, and product details for a tailored equipment proposal."
        }
      }
    ]
  },
  "categories": [
    {
      "nameZh": "自动化设备",
      "nameEn": "Automation Equipment",
      "slug": "automation-equipment",
      "summaryZh": "用于装配、检测和搬运的独立自动化设备。",
      "summaryEn": "Standalone automation machines for assembly, inspection, and handling.",
      "sortOrder": 10,
      "isFeatured": true
    },
    {
      "nameZh": "输送系统",
      "nameEn": "Conveying Systems",
      "slug": "conveying-systems",
      "summaryZh": "用于连续生产和车间物流的输送解决方案。",
      "summaryEn": "Conveyor solutions for continuous production and workshop logistics.",
      "sortOrder": 20,
      "isFeatured": true
    }
  ],
  "products": [
    {
      "nameZh": "自动供料系统",
      "nameEn": "Automatic Feeding System",
      "slug": "automatic-feeding-system",
      "categorySlug": "automation-equipment",
      "shortDescriptionZh": "为提高产量和减少人工操作而设计的自动供料系统。",
      "shortDescriptionEn": "An automatic feeding system designed to raise throughput and reduce manual handling.",
      "detailsZh": "可按产品尺寸和节拍时间定制，系统可与机器人、视觉检测和下游工位集成。",
      "detailsEn": "Customizable by product size and takt time, the system integrates with robots, vision inspection, and downstream stations.",
      "seoTitle": "Automatic Feeding System Manufacturer",
      "seoDescription": "Improve production efficiency with a custom automatic feeding system built for export projects.",
      "sortOrder": 10,
      "isFeatured": true,
      "defaultFields": {
        "model": {
          "valueZh": "AFS-200",
          "valueEn": "AFS-200",
          "visible": true
        },
        "material": {
          "valueZh": "碳钢 + 铝型材",
          "valueEn": "Carbon steel + aluminum profile",
          "visible": true
        },
        "process": {
          "valueZh": "钣金加工",
          "valueEn": "Fabrication and assembly",
          "visible": true
        },
        "size": {
          "valueZh": "按生产线定制",
          "valueEn": "Customized by line layout",
          "visible": true
        },
        "application": {
          "valueZh": "包装、装配和检测线",
          "valueEn": "Packaging, assembly, and inspection lines",
          "visible": true
        },
        "moq": {
          "valueZh": "1 套",
          "valueEn": "1 set",
          "visible": true
        },
        "lead_time": {
          "valueZh": "25-35 天",
          "valueEn": "25-35 days",
          "visible": true
        },
        "supply_ability": {
          "valueZh": "每月 30 套",
          "valueEn": "30 sets per month",
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
          "labelZh": "电压",
          "labelEn": "Voltage",
          "valueZh": "380V / 50Hz",
          "valueEn": "380V / 50Hz",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "伺服输送线",
      "nameEn": "Servo Conveyor Line",
      "slug": "servo-conveyor-line",
      "categorySlug": "conveying-systems",
      "shortDescriptionZh": "用于高速工位转移的模块化输送线。",
      "shortDescriptionEn": "A modular conveyor line built for high-speed workstation transfer.",
      "detailsZh": "支持分度、缓冲和节拍同步，可根据工厂布局灵活扩展。",
      "detailsEn": "Supports indexing, buffering, and takt synchronization, with flexible expansion based on factory layout.",
      "seoTitle": "Servo Conveyor Line Supplier",
      "seoDescription": "Source a modular servo conveyor line for automated transfer, positioning, and buffer control.",
      "sortOrder": 20,
      "isFeatured": false,
      "defaultFields": {
        "model": {
          "valueZh": "SCL-150",
          "valueEn": "SCL-150",
          "visible": true
        },
        "material": {
          "valueZh": "钢结构",
          "valueEn": "Steel structure",
          "visible": true
        },
        "process": {
          "valueZh": "焊接 + 组装",
          "valueEn": "Welding + assembly",
          "visible": true
        },
        "application": {
          "valueZh": "自动化工位转移",
          "valueEn": "Automated workstation transfer",
          "visible": true
        },
        "moq": {
          "valueZh": "1 套",
          "valueEn": "1 set",
          "visible": true
        },
        "lead_time": {
          "valueZh": "20-30 天",
          "valueEn": "20-30 days",
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
          "labelZh": "速度范围",
          "labelEn": "Speed Range",
          "valueZh": "5-30 m/min",
          "valueEn": "5-30 m/min",
          "visible": true,
          "sortOrder": 10
        }
      ]
    },
    {
      "nameZh": "industrial-equipment 产品 3",
      "nameEn": "industrial-equipment Product 3",
      "slug": "industrial-equipment-product-3-1776323524782",
      "shortDescriptionZh": "这是 industrial-equipment 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the industrial-equipment industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "industrial-equipment 产品 3",
      "seoDescription": "适用于 industrial-equipment 行业的高质量产品。",
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
      "nameZh": "industrial-equipment 产品 4",
      "nameEn": "industrial-equipment Product 4",
      "slug": "industrial-equipment-product-4-1776323524979",
      "shortDescriptionZh": "这是 industrial-equipment 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the industrial-equipment industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "industrial-equipment 产品 4",
      "seoDescription": "适用于 industrial-equipment 行业的高质量产品。",
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
      "nameZh": "industrial-equipment 产品 5",
      "nameEn": "industrial-equipment Product 5",
      "slug": "industrial-equipment-product-5-1776323525185",
      "shortDescriptionZh": "这是 industrial-equipment 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the industrial-equipment industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "industrial-equipment 产品 5",
      "seoDescription": "适用于 industrial-equipment 行业的高质量产品。",
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
      "nameZh": "industrial-equipment 产品 6",
      "nameEn": "industrial-equipment Product 6",
      "slug": "industrial-equipment-product-6-1776323525421",
      "shortDescriptionZh": "这是 industrial-equipment 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the industrial-equipment industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "industrial-equipment 产品 6",
      "seoDescription": "适用于 industrial-equipment 行业的高质量产品。",
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
      "nameZh": "industrial-equipment 产品 7",
      "nameEn": "industrial-equipment Product 7",
      "slug": "industrial-equipment-product-7-1776323525620",
      "shortDescriptionZh": "这是 industrial-equipment 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the industrial-equipment industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "industrial-equipment 产品 7",
      "seoDescription": "适用于 industrial-equipment 行业的高质量产品。",
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
      "nameZh": "industrial-equipment 产品 8",
      "nameEn": "industrial-equipment Product 8",
      "slug": "industrial-equipment-product-8-1776323525824",
      "shortDescriptionZh": "这是 industrial-equipment 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the industrial-equipment industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "industrial-equipment 产品 8",
      "seoDescription": "适用于 industrial-equipment 行业的高质量产品。",
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
      "nameZh": "industrial-equipment 产品 9",
      "nameEn": "industrial-equipment Product 9",
      "slug": "industrial-equipment-product-9-1776323526033",
      "shortDescriptionZh": "这是 industrial-equipment 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the industrial-equipment industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "industrial-equipment 产品 9",
      "seoDescription": "适用于 industrial-equipment 行业的高质量产品。",
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
      "nameZh": "industrial-equipment 产品 10",
      "nameEn": "industrial-equipment Product 10",
      "slug": "industrial-equipment-product-10-1776323526251",
      "shortDescriptionZh": "这是 industrial-equipment 行业的示例产品。",
      "shortDescriptionEn": "This is a sample product for the industrial-equipment industry.",
      "detailsZh": "详细描述（中文）……",
      "detailsEn": "Detailed description (English)…",
      "seoTitle": "industrial-equipment 产品 10",
      "seoDescription": "适用于 industrial-equipment 行业的高质量产品。",
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
      "nameZh": "设备方案",
      "nameEn": "Equipment Solutions",
      "slug": "equipment-solutions"
    }
  ],
  "blogPosts": [
    {
      "titleZh": "订购自动化设备前买家应确认的6件事",
      "titleEn": "6 Things Buyers Should Confirm Before Ordering Automation Equipment",
      "slug": "things-to-confirm-before-ordering-automation-equipment",
      "excerptZh": "帮助买家减少返工和交付风险的实用清单。",
      "excerptEn": "A practical checklist that helps buyers reduce rework and delivery risk.",
      "contentZh": "关键检查点包括节拍时间、布局尺寸、接口标准、安全要求和验收标准。",
      "contentEn": "Key checkpoints include takt time, layout size, interface standards, safety requirements, and acceptance criteria.",
      "categorySlug": "equipment-solutions",
      "tags": [
        "automation",
        "equipment"
      ],
      "publishedAt": "2026-04-02T09:00:00.000Z"
    }
  ],
  "featuredCategorySlugs": [
    "automation-equipment",
    "conveying-systems"
  ],
  "featuredProductSlugs": [
    "automatic-feeding-system"
  ]
};

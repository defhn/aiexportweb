/**
 * knowledge-taxonomy.ts
 *
 * AI 知识库分类体系：
 *   - Universal（通用）: U1~U8，所有行业都使用，每次询盘全量注入
 *   - Industry（专属）: I01~I12，根据网站行业选择，精准注入
 *
 * 字段类型说明：
 *   text        单行文本
 *   textarea    多行文本
 *   number      数字（可带单位）
 *   select      单选（options 列表）
 *   multiselect 多选（options 列表，逗号分隔存储）
 *   list        可增删的文本列表（JSON array 存储）
 *   yesno       是/否
 */

export type FieldType = "text" | "textarea" | "number" | "select" | "multiselect" | "list" | "yesno";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  unit?: string;
  hint?: string;
  options?: string[]; // for select / multiselect
  required?: boolean;
};

export type SubsectionDef = {
  key: string;
  title: string;
  fields: FieldDef[];
};

export type SectionDef = {
  code: string;          // "U1" | "U2" | ... | "I01" | "I12"
  title: string;
  icon: string;
  layer: "universal" | "industry";
  industryCode?: string; // for industry sections, e.g. "I01"
  description?: string;  // 简短说明，在右侧面板标题下方展示
  subsections: SubsectionDef[];
};

// ─── 12 大行业选项 ────────────────────────────────────────────────────────────

export const INDUSTRY_OPTIONS = [
  { code: "I01", label: "金属 / 五金制品", labelEn: "Metal / Hardware" },
  { code: "I02", label: "机械 / 设备", labelEn: "Machinery / Equipment" },
  { code: "I03", label: "电子 / 电器 / 智能硬件", labelEn: "Electronics / Smart Hardware" },
  { code: "I04", label: "建材 / 家居装饰", labelEn: "Building Materials / Home Decor" },
  { code: "I05", label: "纺织 / 服装 / 鞋帽", labelEn: "Textile / Apparel / Footwear" },
  { code: "I06", label: "化工 / 原材料 / 塑料", labelEn: "Chemicals / Raw Materials" },
  { code: "I07", label: "食品 / 农产品 / 保健品", labelEn: "Food / Agriculture / Health" },
  { code: "I08", label: "医疗器械 / 健康产品", labelEn: "Medical Devices / Healthcare" },
  { code: "I09", label: "汽配 / 交通运输配件", labelEn: "Auto Parts / Transportation" },
  { code: "I10", label: "户外 / 运动 / 休闲", labelEn: "Outdoor / Sports / Recreation" },
  { code: "I11", label: "包装 / 印刷 / 纸品", labelEn: "Packaging / Printing / Paper" },
  { code: "I12", label: "礼品 / 工艺品 / 玩具", labelEn: "Gifts / Crafts / Toys" },
] as const;

export type IndustryCode = (typeof INDUSTRY_OPTIONS)[number]["code"];

// ─── Universal Sections（通用，8 大类）──────────────────────────────────────

export const UNIVERSAL_SECTIONS: SectionDef[] = [
  // ── U1 公司简介 ────────────────────────────────────────────────────────────
  {
    code: "U1",
    title: "公司简介",
    icon: "🏢",
    layer: "universal",
    subsections: [
      {
        key: "basicInfo",
        title: "基本信息",
        fields: [
          { key: "companyNameZh", label: "公司中文名", type: "text", placeholder: "深圳市XX科技有限公司", required: true },
          { key: "companyNameEn", label: "公司英文名 (对外显示)", type: "text", placeholder: "Acme Technology Co., Ltd.", required: true },
          { key: "founded", label: "成立年份", type: "number", placeholder: "2005", unit: "年" },
          { key: "location", label: "工厂所在地", type: "text", placeholder: "广东省深圳市宝安区" },
          { key: "factoryAddress", label: "工厂详细地址（英文）", type: "text", placeholder: "No.88, Baoan District, Shenzhen, Guangdong, China" },
        ],
      },
      {
        key: "scale",
        title: "工厂规模",
        fields: [
          { key: "factoryArea", label: "工厂面积", type: "number", unit: "㎡", placeholder: "5000" },
          { key: "employees", label: "员工总数", type: "number", unit: "人", placeholder: "150" },
          { key: "engineers", label: "研发/技术人员数量", type: "number", unit: "人", placeholder: "25" },
          { key: "productionLines", label: "主要生产线数量", type: "number", unit: "条", placeholder: "8" },
          { key: "annualRevenue", label: "年营业额区间", type: "select", options: ["$100万以下", "$100-500万", "$500-1000万", "$1000-5000万", "$5000万以上"] },
        ],
      },
      {
        key: "exportExperience",
        title: "外贸资历",
        fields: [
          { key: "exportYears", label: "出口年限", type: "number", unit: "年", placeholder: "10" },
          { key: "countriesServed", label: "已服务国家/地区数量", type: "number", unit: "个", placeholder: "60" },
          { key: "mainClientTypes", label: "主要客户类型", type: "multiselect", options: ["品牌商", "批发商", "零售商", "Amazon 卖家", "政府/采购商", "工程承包商", "超市/连锁", "线上平台"] },
          { key: "tradingPlatforms", label: "主要贸易平台", type: "multiselect", options: ["阿里巴巴国际站", "Made-in-China", "Global Sources", "亚马逊", "速卖通", "Indiamart", "自有官网", "其他"] },
        ],
      },
      {
        key: "milestones",
        title: "重要荣誉与里程碑",
        fields: [
          { key: "awards", label: "获得荣誉/评级（如阿里巴巴金牌供应商）", type: "list", placeholder: "例：阿里巴巴金牌供应商（2018-2024）" },
          { key: "majorEvents", label: "重大发展事件", type: "list", placeholder: "例：2020年新增五轴加工车间" },
        ],
      },
    ],
  },

  // ── U2 生产能力 ───────────────────────────────────────────────────────────
  {
    code: "U2",
    title: "生产能力",
    icon: "🔧",
    layer: "universal",
    subsections: [
      {
        key: "capacity",
        title: "产能数据",
        fields: [
          { key: "monthlyCapacity", label: "月标准产能（主要产品）", type: "text", placeholder: "例：钛杯 10,000件/月；不锈钢杯 50,000件/月" },
          { key: "maxCapacity", label: "最大产能（满负荷/加班）", type: "text", placeholder: "例：旺季可达 80,000件/月" },
          { key: "peakSeason", label: "旺季时间", type: "text", placeholder: "例：每年 8-11 月" },
        ],
      },
      {
        key: "equipment",
        title: "关键设备",
        fields: [
          { key: "keyEquipment", label: "主要生产设备（型号/数量/精度）", type: "list", placeholder: "例：五轴CNC加工中心 × 12台，定位精度 ±0.005mm" },
          { key: "testingEquipment", label: "主要检测设备", type: "list", placeholder: "例：三坐标测量机（CMM）× 2台" },
        ],
      },
      {
        key: "customization",
        title: "定制化能力",
        fields: [
          { key: "supportsOEM", label: "是否支持 OEM（贴客户牌）", type: "yesno" },
          { key: "supportsODM", label: "是否支持 ODM（客户提需求，我们设计）", type: "yesno" },
          { key: "oemMinAmount", label: "OEM 起始金额要求", type: "text", placeholder: "例：$5,000 或无限制" },
          { key: "designCapability", label: "产品设计能力说明", type: "textarea", placeholder: "例：我司有5名工业设计师，可从草图到3D打印到量产全程服务" },
        ],
      },
      {
        key: "moq",
        title: "最小起订量 MOQ",
        fields: [
          { key: "moqStandard", label: "标准款 MOQ", type: "text", placeholder: "例：50 件" },
          { key: "moqCustom", label: "定制款 MOQ（开模/改色）", type: "text", placeholder: "例：500 件" },
          { key: "moqMix", label: "混款 MOQ", type: "text", placeholder: "例：允许不同款式混单，合计≥100件" },
          { key: "moqFlexible", label: "首单 MOQ 政策", type: "textarea", placeholder: "例：新客户首单可接受 MOQ 50% 的小单试样，但需全款" },
        ],
      },
      {
        key: "sample",
        title: "打样与样品政策",
        fields: [
          { key: "sampleLeadTime", label: "标准样品周期", type: "number", unit: "天（工作日）", placeholder: "7" },
          { key: "sampleCost", label: "样品费用", type: "text", placeholder: "例：$50-$200，视复杂程度" },
          { key: "sampleFeeRefund", label: "批量下单后样品费是否退还", type: "yesno" },
          { key: "sampleCourier", label: "样品快递运费承担方", type: "select", options: ["客户承担（到付）", "我司承担", "到$200以上订单退还运费"] },
        ],
      },
    ],
  },

  // ── U3 质量与认证 ─────────────────────────────────────────────────────────
  {
    code: "U3",
    title: "质量与认证",
    icon: "🏅",
    layer: "universal",
    subsections: [
      {
        key: "qms",
        title: "质量管理体系",
        fields: [
          { key: "isoVersion", label: "ISO 认证版本", type: "select", options: ["ISO 9001:2015", "ISO 9001:2008 (旧版)", "ISO 14001:2015", "ISO 45001:2018", "暂无 ISO 认证"] },
          { key: "isoCertNo", label: "ISO 证书编号", type: "text", placeholder: "例：CN-2024-QM-00012" },
          { key: "isoExpiry", label: "ISO 证书有效期", type: "text", placeholder: "例：2027-06-30" },
          { key: "lastAudit", label: "最近外部审核日期", type: "text", placeholder: "例：2024-03" },
        ],
      },
      {
        key: "certifications",
        title: "其他行业认证",
        fields: [
          { key: "certList", label: "认证列表（名称 / 证书编号 / 到期年份 / 适用市场）", type: "list", placeholder: "例：FDA 食品接触合规 / FCE 1234567 / 长期有效 / 美国市场" },
        ],
      },
      {
        key: "qcProcess",
        title: "质检流程",
        fields: [
          { key: "iqc", label: "来料检验（IQC）说明", type: "textarea", placeholder: "例：所有原材料入库前做成分光谱抽检，留样备查" },
          { key: "ipqc", label: "过程检验（IPQC）说明", type: "textarea", placeholder: "例：每班次首件确认，每50件全尺寸抽检" },
          { key: "fqc", label: "出货检验（FQC）说明", type: "textarea", placeholder: "例：100% 外观检验 + 随机量尺，生成出货质检报告" },
          { key: "defectPolicy", label: "不良品处理政策", type: "textarea", placeholder: "例：客户可在到货后7天内提出质量索赔，附照片/视频" },
        ],
      },
    ],
  },

  // ── U4 贸易条款 ──────────────────────────────────────────────────────────
  {
    code: "U4",
    title: "贸易条款",
    icon: "💳",
    layer: "universal",
    subsections: [
      {
        key: "leadtime",
        title: "交期",
        fields: [
          { key: "standardLeadTime", label: "标准生产周期（工作日）", type: "number", unit: "天", placeholder: "15" },
          { key: "rushLeadTime", label: "加急订单最短周期", type: "number", unit: "天", placeholder: "7", hint: "需提前沟通，可能有加急费" },
          { key: "holidayNote", label: "节假日说明", type: "textarea", placeholder: "例：春节（1-2月）停工约2周，旺季前建议提前下单" },
        ],
      },
      {
        key: "payment",
        title: "付款方式",
        fields: [
          { key: "ttTerms", label: "T/T 电汇条款", type: "text", placeholder: "例：30% 定金，70% 见提单副本后付清" },
          { key: "lcAccepted", label: "是否接受信用证 L/C", type: "yesno" },
          { key: "lcMinAmount", label: "L/C 接受的最低金额", type: "text", placeholder: "例：$50,000 以上" },
          { key: "otherPayments", label: "其他付款方式", type: "multiselect", options: ["PayPal（样品/小额）", "信用卡（需收手续费）", "西联汇款", "Escrow（担保交易）", "赊账（长期客户）"] },
          { key: "currency", label: "报价货币", type: "multiselect", options: ["USD（主要）", "EUR", "GBP", "CNY（国内）", "AUD"] },
        ],
      },
      {
        key: "pricing",
        title: "价格条款",
        fields: [
          { key: "priceBase", label: "标准报价基准", type: "select", options: ["FOB 深圳", "FOB 上海", "FOB 宁波", "CIF", "DDP（完税交货）", "EXW（工厂交货）"] },
          { key: "priceValidity", label: "价格有效期", type: "number", unit: "天", placeholder: "30" },
          { key: "minimumOrderValue", label: "最低订单金额（USD）", type: "number", unit: "USD", placeholder: "500" },
          { key: "volumeDiscount", label: "批量折扣政策", type: "textarea", placeholder: "例：$5,000起 95折，$10,000起 92折，$50,000+ 面谈" },
        ],
      },
    ],
  },

  // ── U5 包装与物流 ─────────────────────────────────────────────────────────
  {
    code: "U5",
    title: "包装与物流",
    icon: "📦",
    layer: "universal",
    subsections: [
      {
        key: "standardPackaging",
        title: "标准包装",
        fields: [
          { key: "innerPackaging", label: "内包装方式", type: "text", placeholder: "例：独立气泡袋 + 防锈膜" },
          { key: "outerCarton", label: "外箱规格", type: "text", placeholder: "例：每箱48件，尺寸 60×40×40cm，毛重约18kg" },
          { key: "packagingMaterial", label: "外箱材质", type: "select", options: ["5层瓦楞纸箱（B/C Flute）", "3层瓦楞纸箱", "木箱/托盘", "编织袋", "钢桶"] },
        ],
      },
      {
        key: "customPackaging",
        title: "定制包装",
        fields: [
          { key: "privateLabelMoq", label: "私标（贴客户Logo）起订量", type: "text", placeholder: "例：MOQ 500件" },
          { key: "colorBoxMoq", label: "彩盒/礼品盒定制起订量", type: "text", placeholder: "例：MOQ 1,000个" },
          { key: "packagingDesignSupport", label: "是否提供包装设计支持", type: "yesno" },
        ],
      },
      {
        key: "logistics",
        title: "物流能力",
        fields: [
          { key: "mainPorts", label: "主要出货港口", type: "multiselect", options: ["深圳盐田港", "广州南沙港", "上海洋山港", "宁波舟山港", "天津港", "厦门港"] },
          { key: "shippingMethods", label: "常用运输方式", type: "multiselect", options: ["海运 FCL（整柜）", "海运 LCL（拼柜）", "空运（合作：DHL/FedEx/国际EMS）", "快递（DHL/FedEx/UPS/TNT）", "铁路（中欧/中亚班列）"] },
          { key: "ddpCapability", label: "是否支持 DDP（含税送到门）", type: "yesno" },
          { key: "ddpMarkets", label: "DDP 可服务的市场", type: "text", placeholder: "例：美国、德国、英国、澳大利亚" },
          { key: "freightForwarder", label: "合作货代说明", type: "textarea", placeholder: "例：长期合作3家国际货代，可协助比价、订舱、报关" },
        ],
      },
    ],
  },

  // ── U6 目标市场 ──────────────────────────────────────────────────────────
  {
    code: "U6",
    title: "目标市场",
    icon: "🌍",
    layer: "universal",
    subsections: [
      {
        key: "mainMarkets",
        title: "主力出口市场",
        fields: [
          { key: "markets", label: "主要出口国家/地区（按占比排序）", type: "multiselect", options: ["美国", "德国", "英国", "法国", "澳大利亚", "日本", "韩国", "东南亚（越南/泰国等）", "中东（阿联酋/沙特）", "巴西", "墨西哥", "加拿大", "印度", "俄罗斯", "其他"] },
          { key: "usShare", label: "美国市场出口占比", type: "text", placeholder: "例：40%" },
          { key: "euShare", label: "欧洲市场出口占比", type: "text", placeholder: "例：30%" },
          { key: "marketStrategy", label: "重点市场策略说明", type: "textarea", placeholder: "例：美国市场主攻 Amazon FBA 卖家，欧洲主攻 B2B 批发商" },
        ],
      },
      {
        key: "language",
        title: "语言沟通能力",
        fields: [
          { key: "bizLanguages", label: "业务沟通支持语言", type: "multiselect", options: ["英语（流利）", "西班牙语（基础）", "德语（基础）", "法语（基础）", "阿拉伯语（基础）", "日语（翻译辅助）"] },
          { key: "docLanguages", label: "产品文档/说明书语言", type: "multiselect", options: ["英语", "西班牙语", "德语", "法语", "阿拉伯语", "俄语", "日语", "按需定制"] },
        ],
      },
      {
        key: "tradeEvents",
        title: "展会参展",
        fields: [
          { key: "tradeFairs", label: "近期参展展会（方便约见）", type: "list", placeholder: "例：Canton Fair（广交会）/ 2024年10月 / B区 Hall 4.2 / 摊位 B4-K08" },
        ],
      },
    ],
  },

  // ── U7 售后政策 ──────────────────────────────────────────────────────────
  {
    code: "U7",
    title: "售后政策",
    icon: "🔄",
    layer: "universal",
    subsections: [
      {
        key: "warranty",
        title: "质保与质量保证",
        fields: [
          { key: "warrantyPeriod", label: "质保期限", type: "text", placeholder: "例：产品出货后12个月" },
          { key: "warrantyCoverage", label: "质保覆盖范围", type: "textarea", placeholder: "例：材料缺陷、工艺问题；不包含人为损坏、使用不当" },
          { key: "claimProcess", label: "质量索赔流程", type: "textarea", placeholder: "例：到货7天内提交照片/短视频，附订单号，我司在5个工作日内给出解决方案" },
          { key: "compensationType", label: "赔偿方式", type: "multiselect", options: ["补发缺失/损坏品", "按比例退款", "赠送下次订单折扣", "全额退款（严重质量问题）"] },
        ],
      },
      {
        key: "technicalSupport",
        title: "技术支持",
        fields: [
          { key: "documentTypes", label: "提供的产品文件", type: "multiselect", options: ["产品规格书（Spec Sheet）", "安装说明书（IFU）", "安全数据表（SDS）", "检测报告", "认证证书扫描件", "3D图纸/2D工程图"] },
          { key: "techConsult", label: "技术咨询支持方式", type: "multiselect", options: ["邮件（24h内回复）", "WhatsApp 视频通话", "远程视频调试", "现场工程师服务（需报价）"] },
          { key: "sparePartsSupply", label: "备件/易损件供应期限", type: "text", placeholder: "例：产品停产后仍保证5年备件供应" },
        ],
      },
    ],
  },

  // ── U8 沟通与响应 ─────────────────────────────────────────────────────────
  {
    code: "U8",
    title: "沟通与响应",
    icon: "📞",
    layer: "universal",
    subsections: [
      {
        key: "contact",
        title: "联系渠道",
        fields: [
          { key: "bizEmail", label: "业务邮箱", type: "text", placeholder: "sales@yourfactory.com" },
          { key: "whatsapp", label: "WhatsApp 号码", type: "text", placeholder: "+86 138 xxxx xxxx" },
          { key: "wechatId", label: "企业微信 / WeChat ID", type: "text", placeholder: "YourFactory_Sales" },
          { key: "linkedin", label: "公司 LinkedIn 主页", type: "text", placeholder: "https://linkedin.com/company/..." },
        ],
      },
      {
        key: "responseTime",
        title: "响应时间承诺",
        fields: [
          { key: "workingHours", label: "工作时间（UTC+8）", type: "text", placeholder: "例：周一至周六 9:00-18:00" },
          { key: "emailResponse", label: "邮件响应承诺", type: "select", options: ["当天内（8h）", "24小时内", "48小时内", "2-3个工作日"] },
          { key: "quotationTime", label: "标准报价出具时间", type: "select", options: ["当天内", "1-2个工作日", "3-5个工作日", "5个工作日以上"] },
          { key: "sampleTime", label: "打样方案出具时间", type: "select", options: ["1-3个工作日", "3-5个工作日", "1周", "2周"] },
        ],
      },
    ],
  },

  // ── U9 产品系列概览（新产品/爆款/产品线）────────────────────────────────────
  // 说明：这里填写的是「工厂层面的产品战略概况」，不是单品详情。
  // 单品详情（名称/图片/规格）在「产品管理」模块中维护，每次保存后自动向量化。
  // 两者协同工作：U9 告诉 AI「大方向」，产品记录的 embedding 负责「精准匹配」。
  // ⚠️ 任何字段不填均自动跳过，不影响其他模块的 AI 调用。
  {
    code: "U9",
    title: "产品系列概览",
    icon: "📋",
    layer: "universal",
    subsections: [
      {
        key: "productLines",
        title: "主营产品线",
        fields: [
          {
            key: "mainProductLines",
            label: "主营产品系列（每行一条，含产品线名称和简短描述）",
            type: "list",
            placeholder: "例：钛合金户外餐具系列 — 钛杯、钛碗、钛筷、钛勺，主打轻量化和食品级安全",
            hint: "此处描述的是产品大类，具体型号在「产品管理」中录入",
          },
          {
            key: "totalSkus",
            label: "当前在售 SKU 数量（约）",
            type: "number",
            unit: "个",
            placeholder: "50",
          },
          {
            key: "newProductFrequency",
            label: "新品推出频率",
            type: "select",
            options: ["每月推新", "每季度推新", "每半年推新", "每年推新", "按需/客户定制为主"],
          },
        ],
      },
      {
        key: "newProducts",
        title: "近期新品 / 当季重点产品",
        fields: [
          {
            key: "latestNewProducts",
            label: "最新上市产品（写清楚产品名 + 核心卖点）",
            type: "list",
            placeholder: "例：TC4 双层钛杯 450ml — 2024年9月新品，双层隔热设计，净重仅 85g，已获 FDA 食品接触合规",
          },
          {
            key: "seasonalHero",
            label: "当前主推/爆款产品（1-3 款最重要的）",
            type: "list",
            placeholder: "例：登山钛餐盒套装（杯+锅+餐具）— 今年全年主推，已有 200+ 五星评价",
          },
          {
            key: "comingSoon",
            label: "即将上市产品（预计发布时间）",
            type: "list",
            placeholder: "例：超轻折叠钛锅（预计2025年Q1上市，已接受预订）",
          },
        ],
      },
      {
        key: "productUsps",
        title: "产品核心竞争力（USP）",
        fields: [
          {
            key: "uniqueAdvantages",
            label: "与竞品相比的核心差异点（直接影响 AI 如何介绍产品优势）",
            type: "list",
            placeholder: "例：我们是国内少数拥有全流程钛加工能力的工厂，从原材料到成品出货不依赖外协",
          },
          {
            key: "targetCustomerPain",
            label: "主要解决客户的什么问题",
            type: "textarea",
            placeholder: "例：外国买家对中国供应商的常见担忧是材质造假（用不锈钢冒充钛）。我们提供每批次 SGS 成分检测报告消除顾虑。",
          },
          {
            key: "pricePositioning",
            label: "价格定位",
            type: "select",
            options: ["经济型（价格优先）", "中端（性价比均衡）", "中高端（品质优先）", "高端定制（溢价市场）"],
          },
        ],
      },
      {
        key: "productLimitations",
        title: "产品限制与不做说明",
        fields: [
          {
            key: "whatWeDoNotMake",
            label: "明确不做的产品类型（帮助 AI 避免承诺做不到的东西）",
            type: "list",
            placeholder: "例：我们不做不锈钢产品，只专注钛 / 我们不做 A4 以上尺寸的精密零件",
          },
          {
            key: "categoryRestrictions",
            label: "出口限制说明（如存在）",
            type: "textarea",
            placeholder: "例：目前不向俄罗斯出口 / 部分军工配件产品需提供最终用户证明",
          },
        ],
      },
    ],
  },
];

// ── 追加 U10 / U11 / U12（三个核心缺口，独立 push 保持文件结构清晰）─────────────

UNIVERSAL_SECTIONS.push(

  // ── U10 研发与知识产权保护 ────────────────────────────────────────────────
  // 买家发来 DWG/STEP 图纸前，必须知道你能保密、能加工、能签NDA
  {
    code: "U10",
    title: "研发与知识产权保护",
    icon: "🔬",
    layer: "universal",
    subsections: [
      {
        key: "drawingAcceptance",
        title: "接受图纸与设计文件",
        fields: [
          {
            key: "acceptedFormats",
            label: "可接受的设计文件格式",
            type: "multiselect",
            options: ["DWG（AutoCAD）", "DXF", "STEP（.stp/.step）", "IGES（.igs）", "PDF（标注图）", "SolidWorks（.SLDPRT）", "AI/EPS（图形）", "手绘草图 + 尺寸说明"],
            hint: "填写越多，AI 越能准确告诉客户「可以直接发图纸」",
          },
          {
            key: "reverseEngineering",
            label: "是否支持逆向工程（客户提供实物样品，我们出图+生产）",
            type: "yesno",
          },
          {
            key: "designService",
            label: "是否提供正向设计服务（从草图/需求描述到最终设计图）",
            type: "yesno",
          },
          {
            key: "prototypingCapability",
            label: "快速原型/手板能力",
            type: "text",
            placeholder: "例：3D 打印手板 5-7 天，CNC 手板 7-10 天，造价另报",
          },
        ],
      },
      {
        key: "ndaAndConfidentiality",
        title: "保密协议与知识产权",
        fields: [
          {
            key: "ndaSigningPolicy",
            label: "是否接受客户 NDA（保密协议）",
            type: "yesno",
          },
          {
            key: "ndaResponseTime",
            label: "NDA 签署响应时间",
            type: "select",
            options: ["当天内可签", "1-3 个工作日", "需法务审核（3-5工作日）", "不接受客户 NDA，只使用我司标准保密条款"],
          },
          {
            key: "ipSegregation",
            label: "客户定制设计是否专属保护（不复制给其他客户）",
            type: "yesno",
          },
          {
            key: "moldOwnership",
            label: "开模费归属说明",
            type: "textarea",
            placeholder: "例：模具费由客户全额支付后，模具产权归客户所有，我司负责维护保管，客户有权转移至其他工厂",
          },
          {
            key: "patentStatus",
            label: "我司拥有的专利数量/类型（可选填，增强信任度）",
            type: "text",
            placeholder: "例：已申请实用新型专利 12 项，发明专利 3 项，外观专利 8 项",
          },
        ],
      },
    ],
  },

  // ── U11 合作流程与贸易合规 ────────────────────────────────────────────────
  // 新买家最怕「不知道下一步该怎么做」；HS Code / 原产地证是每笔订单必问项
  {
    code: "U11",
    title: "合作流程与贸易合规",
    icon: "📑",
    layer: "universal",
    subsections: [
      {
        key: "cooperationProcess",
        title: "新客户合作流程（步骤说明）",
        fields: [
          {
            key: "inquiryToOrder",
            label: "从询盘到下单的标准流程",
            type: "textarea",
            placeholder: `例：
Step 1：发送询盘（产品名/数量/目的地/需求说明）→ 24h 内回复
Step 2：提供初步报价单（含 FOB 单价、MOQ、交期、可选规格）
Step 3：确认样品需求 → 下样品单 → 打样周期 7 天 → 收到样品后反馈
Step 4：修改确认 → 核准样（Golden Sample）签字
Step 5：下正式采购订单（PO）→ 支付 30% 定金
Step 6：生产跟进（每周发进度照片/视频）
Step 7：出货前 QC → 发 QC 报告 → 支付余款 70%
Step 8：安排订舱/报关/发货 → 发 BL + 全套单据
Step 9：货到目的港 → 售后跟进`,
          },
          {
            key: "sampleToMassFlow",
            label: "首样确认到批量生产特殊说明",
            type: "textarea",
            placeholder: "例：正式下单前必须有核准样（客户签字盖章），以此为生产基准，避免后续扯皮",
          },
        ],
      },
      {
        key: "tradeCompliance",
        title: "贸易合规（HS Code / 原产地证）",
        fields: [
          {
            key: "hsCodeInfo",
            label: "主要产品 HS Code（海关税号）",
            type: "list",
            placeholder: "例：钛杯（HS 7616.99）/ 不锈钢杯（HS 7323.93）/ 野营炊具套装（HS 7321.11）",
            hint: "填写 HS Code 后，AI 可以直接告知买家该产品的进口税号，大幅提升专业度",
          },
          {
            key: "coTypes",
            label: "可提供的原产地证类型",
            type: "multiselect",
            options: ["普通 CO（商会签发）", "Form A（发展中国家优惠产地证，GSP）", "Form E（中国-东盟自贸区）", "Form F（中国-智利）", "EUR.1（中欧）", "RCEP 原产地证"],
          },
          {
            key: "antidumpingStatus",
            label: "是否存在反倾销税风险（主要出口产品）",
            type: "textarea",
            placeholder: "例：我司铝合金产品出口美国目前不在反倾销税范围（Section 232 豁免品类）。出口欧盟钢铁产品需注意 EU 保障措施关税，建议客户提前确认。",
          },
          {
            key: "exportLicenseRequired",
            label: "是否需要出口许可证",
            type: "select",
            options: ["无特殊出口限制", "部分产品需要出口许可证（已具备）", "部分产品受到出口管制（请在订单前说明用途）"],
          },
        ],
      },
      {
        key: "thirdPartyInspection",
        title: "第三方检验政策",
        fields: [
          {
            key: "tpiAccepted",
            label: "是否接受客户安排的第三方检验（SGS / QIMA / Bureau Veritas 等）",
            type: "yesno",
          },
          {
            key: "tpiArrangement",
            label: "第三方检验安排说明",
            type: "textarea",
            placeholder: "例：支持在出货前 3 天在工厂接受 SGS/QIMA 驻厂验货，检验费用由客户承担，我司提供检验场地和样品配合。如验货不通过，返工后可二次验货。",
          },
          {
            key: "residentQcAccepted",
            label: "是否接受客户驻厂 QC（长驻质检员）",
            type: "yesno",
          },
        ],
      },
      {
        key: "documentPackage",
        title: "可提供的出口单据清单",
        fields: [
          {
            key: "standardDocs",
            label: "标准随附单据",
            type: "multiselect",
            options: [
              "商业发票（Commercial Invoice）",
              "装箱单（Packing List）",
              "提单（Bill of Lading / Air Waybill）",
              "原产地证（Certificate of Origin）",
              "质检报告（QC Report / Inspection Report）",
              "材质证书（Mill Test Report）",
              "出货前照片（Pre-shipment Photos）",
            ],
          },
          {
            key: "optionalDocs",
            label: "按要求可额外提供的文件",
            type: "multiselect",
            options: [
              "SGS 第三方检测报告",
              "认证证书复印件（FDA/CE/ISO等）",
              "MSDS / SDS 安全数据表",
              "重量证明（Weight Certificate）",
              "熏蒸证明（Fumigation Certificate，木材包装）",
              "海关价值声明（Customs Value Declaration）",
              "进出口商品检验证明（CIQ）",
            ],
          },
          {
            key: "insurancePolicy",
            label: "海运货物保险安排",
            type: "select",
            options: [
              "CIF 条款下由我司投保",
              "CFR/FOB 条款下由买家自理",
              "可协助购买中国人保/平安货运险（加收保费）",
            ],
          },
        ],
      },
      {
        key: "disputeAndForceMajeure",
        title: "争议处理与不可抗力",
        fields: [
          {
            key: "latePenaltyPolicy",
            label: "交货延误赔偿政策",
            type: "textarea",
            placeholder: "例：生产延误超过 5 个工作日（非客户原因），我司承担额外空运费用差价或按每天 0.1% 货款给予补偿，最高不超过 5%",
          },
          {
            key: "forceMajeureClause",
            label: "不可抗力条款说明",
            type: "textarea",
            placeholder: "例：自然灾害、政府政策、大规模疫情等不可抗力导致延误，双方均不承担违约责任，但需在 7 天内书面通知对方并提供证明，双方协商新的交期",
          },
          {
            key: "disputeResolution",
            label: "争议解决方式",
            type: "select",
            options: [
              "中国国际经济贸易仲裁委员会（CIETAC）仲裁",
              "香港国际仲裁中心（HKIAC）仲裁",
              "双方协商和解优先，协商不成提交仲裁",
              "适用中国法律，在工厂所在地法院诉讼",
            ],
          },
        ],
      },
    ],
  },

  // ── U12 可持续发展与供应链稳健性 ────────────────────────────────────────────
  // 欧盟买家 2024+ 越来越必问 ESG；供应链稳定性是长期合作的基础信心保障
  {
    code: "U12",
    title: "可持续发展与供应链",
    icon: "🌱",
    layer: "universal",
    subsections: [
      {
        key: "laborCompliance",
        title: "劳工与社会合规",
        fields: [
          {
            key: "socialAudit",
            label: "社会责任审计认证",
            type: "multiselect",
            options: [
              "BSCI（Business Social Compliance Initiative）",
              "SMETA / Sedex（社会和道德贸易审计）",
              "SA8000（社会责任国际标准）",
              "WRAP（美国良好制造流程认证）",
              "Disney ILS / Walmart FCCA",
              "暂未取得（可接受客户委托审计）",
            ],
          },
          {
            key: "workingHoursPolicy",
            label: "工时与加班政策",
            type: "text",
            placeholder: "例：标准工时8小时/天，加班需员工自愿且符合国家规定，旺季加班有1.5-2倍工资补贴",
          },
          {
            key: "noChildLabor",
            label: "无童工承诺",
            type: "yesno",
          },
          {
            key: "factoryVisitPolicy",
            label: "工厂参观安排",
            type: "textarea",
            placeholder: "例：欢迎买家预约参观。提前3天通知即可安排，我司提供全程英语陪同接待。如无法现场，可安排视频直播参观（提前预约）。前往方式：深圳宝安区，最近地铁站 XXX 站，可接送。",
          },
        ],
      },
      {
        key: "environmental",
        title: "环保与碳排放",
        fields: [
          {
            key: "iso14001",
            label: "ISO 14001 环境管理体系认证",
            type: "yesno",
          },
          {
            key: "carbonReduction",
            label: "碳减排/碳中和承诺或计划",
            type: "textarea",
            placeholder: "例：已完成工厂碳盘查，计划 2030 年前实现碳中和；已安装 200kW 屋顶光伏系统，年减排约 120 吨 CO₂",
          },
          {
            key: "wastePolicy",
            label: "生产废弃物处理方式",
            type: "textarea",
            placeholder: "例：金属边角料100%回收再利用，废水经三级处理后达标排放，持有危废处理资质",
          },
          {
            key: "recycledMaterial",
            label: "使用再生/回收原材料比例",
            type: "text",
            placeholder: "例：铝合金产品约含 30% 再生铝，可根据客户要求提供更高比例（GRS 认证）",
          },
          {
            key: "packagingEco",
            label: "包装环保措施",
            type: "textarea",
            placeholder: "例：标准外箱使用再生纸板，可提供无塑料包装选项（FSC 纸质内衬替代气泡袋）",
          },
        ],
      },
      {
        key: "supplyChainResilience",
        title: "供应链稳健性",
        fields: [
          {
            key: "rawMaterialSourcing",
            label: "主要原材料来源说明",
            type: "textarea",
            placeholder: "例：钛原材料主要来自攀钢、宝钛两家国内头部企业，同时备有 3 家候选供应商，原材料安全库存周期约 45 天",
          },
          {
            key: "backupSuppliers",
            label: "是否有备用供应商体系",
            type: "yesno",
          },
          {
            key: "disruptionHistory",
            label: "近 3 年有无重大供应中断事件（如有，说明如何应对）",
            type: "textarea",
            placeholder: "例：2022 年受疫情影响延误约 2 周，通过提前备料和分批发货降低客户损失，最终全部按期交付",
          },
          {
            key: "inventoryPolicy",
            label: "成品/半成品库存策略",
            type: "textarea",
            placeholder: "例：主力款保持 500 件以上安全库存，长期客户可签季度框架协议预留产能",
          },
          {
            key: "peerReferences",
            label: "可提供的同行业客户参考（不透露名称，只描述类型）",
            type: "textarea",
            placeholder: "例：我们已为欧洲 3 家头部户外品牌供货 5 年以上，其中 1 家是全球 Top 10 户外零售商的自有品牌",
          },
        ],
      },
    ],
  },

);

// ─── Industry-Specific Sections（行业专属，12 大类）──────────────────────────

export const INDUSTRY_SECTIONS: SectionDef[] = [

  // ── I01 金属/五金制品 ──────────────────────────────────────────────────────
  {
    code: "I01",
    title: "金属 / 五金专项",
    icon: "🔩",
    layer: "industry",
    industryCode: "I01",
    subsections: [
      {
        key: "materials",
        title: "可加工材质",
        fields: [
          { key: "metalGrades", label: "主要材质牌号", type: "list", placeholder: "例：纯钛 TA1 / TC4（Grade 2/Grade 5）、SUS 304 / 316L、6061-T6 铝、H62 黄铜" },
          { key: "materialStandard", label: "材质标准体系", type: "multiselect", options: ["ASTM（美国）", "DIN（德国）", "JIS（日本）", "GB（中国）", "AMS（航空）"] },
          { key: "materialCert", label: "材质证明文件", type: "multiselect", options: ["原厂材质证书（Mill Test Report）", "SGS 成分检测报告", "RoHS 合规声明", "食品接触材料合规（FDA/EU）"] },
        ],
      },
      {
        key: "processes",
        title: "加工工艺",
        fields: [
          { key: "machiningProcess", label: "主要加工方式", type: "multiselect", options: ["CNC 精密加工（3轴/4轴/5轴）", "锻造（热锻/冷锻）", "冲压/钣金", "压铸（铝/锌合金）", "砂铸/失蜡铸造", "MIM（金属注射成型）", "冷镦/滚丝", "激光切割"] },
          { key: "weldingProcess", label: "焊接能力", type: "multiselect", options: ["TIG 氩弧焊", "MIG 二保焊", "激光焊接", "超声波焊接", "不焊接"] },
          { key: "tolerance", label: "标准公差等级", type: "text", placeholder: "例：ISO 2768 中等级（m）/ 精密级（f），最高可达 IT6（±0.01mm）" },
          { key: "roughness", label: "表面粗糙度", type: "text", placeholder: "例：标准 Ra 1.6，最优 Ra 0.2（镜面）" },
        ],
      },
      {
        key: "surfaceTreatment",
        title: "表面处理",
        fields: [
          { key: "treatments", label: "支持的表面处理", type: "multiselect", options: ["阳极氧化（铝/钛）", "硬质阳极氧化", "电镀（镀镍/镀铬/镀锌/镀金）", "电泳涂装", "喷粉/静电喷涂", "喷砂处理", "拉丝处理", "抛光（镜面/缎面）", "PVD 镀膜", "达克罗/锌镍合金", "激光雕刻/打标", "丝印/移印"] },
          { key: "colorCustom", label: "颜色定制方式", type: "text", placeholder: "例：支持 Pantone 对色（色差 ΔE < 1.5），阳极氧化可实现 20+ 种颜色" },
        ],
      },
    ],
  },

  // ── I02 机械/设备 ─────────────────────────────────────────────────────────
  {
    code: "I02",
    title: "机械 / 设备专项",
    icon: "⚙️",
    layer: "industry",
    industryCode: "I02",
    subsections: [
      {
        key: "electricalSpec",
        title: "电气规格",
        fields: [
          { key: "voltage", label: "供电电压规格", type: "multiselect", options: ["220V/50Hz（亚洲/欧洲）", "380V/50Hz（工业）", "110V/60Hz（美洲）", "460V/60Hz（北美工业）", "可定制电压"] },
          { key: "motorPower", label: "主要电机功率范围", type: "text", placeholder: "例：0.75kW ~ 55kW 可选" },
          { key: "controlSystem", label: "控制系统", type: "text", placeholder: "例：西门子 S7-1200 PLC + 触摸屏 HMI（中英文切换）" },
        ],
      },
      {
        key: "certifications",
        title: "安全认证",
        fields: [
          { key: "machineCerts", label: "机械安全认证", type: "multiselect", options: ["CE 机械指令（2006/42/EC）", "压力容器认证（ASME/PED）", "防爆认证（ATEX/IECEx）", "UL/CSA（北美）", "EAC（俄/白/哈）"] },
        ],
      },
      {
        key: "service",
        title: "安装调试与服务",
        fields: [
          { key: "installService", label: "是否提供海外安装调试", type: "yesno" },
          { key: "installCost", label: "海外安装费用说明", type: "text", placeholder: "例：工程师差旅费用由客户承担，每天 $300 服务费" },
          { key: "remoteSupport", label: "远程技术支持能力", type: "text", placeholder: "例：支持远程视频指导，提供中/英文操作手册" },
          { key: "sparePartsStocking", label: "关键备件备货说明", type: "text", placeholder: "例：标准易损件常备库存，可支持次日发货" },
        ],
      },
    ],
  },

  // ── I03 电子/电器/智能硬件 ────────────────────────────────────────────────
  {
    code: "I03",
    title: "电子 / 电器专项",
    icon: "⚡",
    layer: "industry",
    industryCode: "I03",
    subsections: [
      {
        key: "electricalCerts",
        title: "电气安全认证",
        fields: [
          { key: "certs", label: "已取得认证", type: "multiselect", options: ["CE（RED/LVD/EMC）", "FCC ID（美国）", "RoHS 2.0", "WEEE", "UL（美国）", "ETL（美国）", "PSE（日本）", "KC（韩国）", "EAC（俄罗斯）", "INMETRO（巴西）", "SAA（澳洲）", "BIS（印度）"] },
          { key: "rohsScope", label: "RoHS 合规范围说明", type: "text", placeholder: "例：全系列产品符合 RoHS 2.0（2011/65/EU + 委托法规 2015/863）" },
          { key: "reachSvhc", label: "REACH SVHC 声明", type: "text", placeholder: "例：产品不含 240 项 SVHC 高度关注物质，有第三方 SGS 声明" },
        ],
      },
      {
        key: "electricalSpec",
        title: "电气规格",
        fields: [
          { key: "inputVoltage", label: "输入电压范围", type: "text", placeholder: "例：AC 100-240V, 50/60Hz（全球通用）/ DC 5-24V" },
          { key: "powerRange", label: "功率范围", type: "text", placeholder: "例：5W ~ 2000W" },
          { key: "ipRating", label: "防护等级", type: "multiselect", options: ["IP20（室内普通）", "IP44（防溅水）", "IP65（防尘防喷水）", "IP67（短时浸水）", "IP68（长期浸水）", "IP69K（高压冲洗）"] },
        ],
      },
      {
        key: "wireless",
        title: "无线协议支持",
        fields: [
          { key: "wirelessProtocols", label: "支持的无线协议", type: "multiselect", options: ["WiFi 802.11 b/g/n/ac（2.4GHz/5GHz）", "Bluetooth 5.0 BLE", "Zigbee 3.0", "Z-Wave", "Thread / Matter", "LoRa", "NB-IoT / 4G LTE", "无无线功能"] },
        ],
      },
      {
        key: "customization",
        title: "软件/固件定制",
        fields: [
          { key: "firmwareOem", label: "固件 OEM 定制（客户 Logo/功能）", type: "yesno" },
          { key: "appOem", label: "APP 私标定制", type: "yesno" },
          { key: "cloudIntegration", label: "云平台对接能力", type: "text", placeholder: "例：支持 AWS IoT、阿里云 IoT、Tuya 平台接入" },
        ],
      },
    ],
  },

  // ── I04 建材/家居装饰 ─────────────────────────────────────────────────────
  {
    code: "I04",
    title: "建材 / 家居专项",
    icon: "🏗️",
    layer: "industry",
    industryCode: "I04",
    subsections: [
      {
        key: "productSpec",
        title: "产品规格",
        fields: [
          { key: "materials", label: "主要材质", type: "multiselect", options: ["天然石材（大理石/花岗岩）", "人造石/石英石", "釉面砖", "通体砖", "抛光砖", "实木", "多层板/MDF", "铝合金/铝型材", "钢化玻璃", "工程塑料"] },
          { key: "sizeRange", label: "标准尺寸/规格范围", type: "text", placeholder: "例：60×60cm、80×80cm、120×60cm；厚度 8-20mm" },
          { key: "tolerance", label: "尺寸公差", type: "text", placeholder: "例：长宽 ±0.5mm，厚度 ±0.3mm，对角线误差 <1mm" },
          { key: "customSize", label: "是否支持定制尺寸", type: "yesno" },
        ],
      },
      {
        key: "performance",
        title: "性能参数",
        fields: [
          { key: "fireRating", label: "防火等级", type: "text", placeholder: "例：A1 不燃（EN 13501-1）/ Class A（ASTM E84）" },
          { key: "slipRating", label: "防滑等级（地板类）", type: "text", placeholder: "例：R10（室内）/ R11（室内潮湿）/ R13（室外坡道）" },
          { key: "loadBearing", label: "承重/抗压强度", type: "text", placeholder: "例：抗折强度 ≥35MPa" },
          { key: "weatherProof", label: "耐候/耐冻融性", type: "text", placeholder: "例：经 25 次冻融循环测试无裂纹" },
        ],
      },
      {
        key: "ecoStandards",
        title: "环保认证",
        fields: [
          { key: "formaldehydeLevel", label: "甲醛释放量", type: "select", options: ["E0（≤0.05mg/m³）", "E1（≤0.124mg/m³）", "E2（≤0.5mg/m³）", "不适用（石材/金属）"] },
          { key: "fscCert", label: "FSC 木材认证（木制产品）", type: "yesno" },
          { key: "vocLevel", label: "VOC 含量声明（涂料/胶水）", type: "text", placeholder: "例：Low VOC，符合 CARB Phase 2" },
          { key: "greenguard", label: "GREENGUARD 认证（室内空气质量）", type: "yesno" },
        ],
      },
    ],
  },

  // ── I05 纺织/服装/鞋帽 ─────────────────────────────────────────────────────
  {
    code: "I05",
    title: "纺织 / 服装专项",
    icon: "👗",
    layer: "industry",
    industryCode: "I05",
    subsections: [
      {
        key: "fabricCapability",
        title: "面料能力",
        fields: [
          { key: "fabricTypes", label: "主要面料品类", type: "multiselect", options: ["梭织（平织/斜纹/缎纹）", "针织（单面/双面/卫衣布）", "牛仔布", "户外功能面料", "无纺布", "皮革/人造革", "网布/蕾丝"] },
          { key: "weightRange", label: "面料克重范围", type: "text", placeholder: "例：80gsm ~ 600gsm" },
          { key: "functionalFabric", label: "功能性面料", type: "multiselect", options: ["防水（WR/WP）", "透气速干（DWR）", "防紫外线（UPF 50+）", "阻燃（FR）", "抗菌防臭", "弹力（Lycra/Spandex）", "保暖绒面"] },
        ],
      },
      {
        key: "certifications",
        title: "面料与原材料认证",
        fields: [
          { key: "fabricCerts", label: "面料/原材料认证", type: "multiselect", options: ["OEKO-TEX STANDARD 100", "GOTS 有机棉", "BCI 棉花", "Bluesign®", "GRS 再生纤维认证", "FSC 天丝/莱赛尔", "Fairtrade 公平贸易"] },
        ],
      },
      {
        key: "patternSizing",
        title: "版型与尺码",
        fields: [
          { key: "sizeSystem", label: "尺码体系", type: "multiselect", options: ["美码（XS-3XL）", "欧码（EU 32-52）", "英码（UK 8-22）", "亚码（S/M/L/XL）", "大码（Plus Size）", "童装（按月龄/年龄）"] },
          { key: "patternDevelopment", label: "开版能力", type: "yesno" },
          { key: "patternLock", label: "是否提供版型封版服务", type: "yesno", hint: "即客户的设计版型只服务该客户，其他客户无法使用" },
          { key: "gradingService", label: "是否提供 Grading（档差分码）服务", type: "yesno" },
        ],
      },
      {
        key: "printEmbroidery",
        title: "印花与绣花",
        fields: [
          { key: "printMethods", label: "印花方式", type: "multiselect", options: ["丝网印花", "热转印", "数码直喷（DTG）", "升华印花（化纤）", "植绒印花"] },
          { key: "embroidery", label: "刺绣能力", type: "yesno" },
          { key: "colorFastness", label: "颜色牢度等级", type: "text", placeholder: "例：洗涤牢度 ≥4 级（ISO 105-C06），摩擦牢度 ≥3 级" },
        ],
      },
    ],
  },

  // ── I06 化工/原材料/塑料 ──────────────────────────────────────────────────
  {
    code: "I06",
    title: "化工 / 原材料专项",
    icon: "🧪",
    layer: "industry",
    industryCode: "I06",
    subsections: [
      {
        key: "productSpec",
        title: "产品技术规格",
        fields: [
          { key: "casNumber", label: "主要产品 CAS 编号", type: "list", placeholder: "例：乙醇 CAS 64-17-5，纯度 ≥99.9%" },
          { key: "physicalProps", label: "基本物性", type: "textarea", placeholder: "例：熔点 58-62°C，沸点 182°C，密度 0.92g/cm³，外观白色颗粒" },
          { key: "puritySpec", label: "纯度/浓度规格", type: "text", placeholder: "例：工业级 99%，试剂级 99.9%，食品级 99.5%" },
        ],
      },
      {
        key: "hazardous",
        title: "危险品分类",
        fields: [
          { key: "unNumber", label: "UN 危险品编号（如适用）", type: "text", placeholder: "例：UN1170（乙醇溶液）" },
          { key: "ghsClass", label: "GHS 危险类别", type: "text", placeholder: "例：易燃液体 类别3，皮肤刺激 类别2" },
          { key: "hazmatTransport", label: "危险货物运输资质", type: "multiselect", options: ["有 IATA 危险品运输许可（空运）", "有 IMDG 危险品运输许可（海运）", "非危险货物", "限量例外品"] },
        ],
      },
      {
        key: "safetyDocs",
        title: "安全文件",
        fields: [
          { key: "sdsLanguages", label: "SDS 安全数据表可提供语言", type: "multiselect", options: ["英文", "德文", "法文", "西班牙文", "日文", "中文"] },
          { key: "coaProvision", label: "COA 分析证书提供方式", type: "text", placeholder: "例：每批次随货附 COA，可提供第三方 SGS 测试报告（加费）" },
        ],
      },
      {
        key: "reachCompliance",
        title: "环保合规",
        fields: [
          { key: "reachStatus", label: "REACH 注册状态", type: "select", options: ["已完成 REACH 注册（有 SVHC 声明）", "豁免登记范围", "不适用（非欧盟出口）", "注册中"] },
          { key: "restrictedSubstances", label: "禁限用物质说明", type: "textarea", placeholder: "例：产品不含 SVHC 候选清单中任何物质，无 POPs 名单化合物" },
        ],
      },
    ],
  },

  // ── I07 食品/农产品/保健品 ────────────────────────────────────────────────
  {
    code: "I07",
    title: "食品 / 农产品专项",
    icon: "🍎",
    layer: "industry",
    industryCode: "I07",
    subsections: [
      {
        key: "origin",
        title: "原料溯源",
        fields: [
          { key: "rawMaterialOrigin", label: "主要原料产地", type: "text", placeholder: "例：四川攀枝花芒果、新疆天山蜂蜜" },
          { key: "processingLocation", label: "加工/生产地点", type: "text", placeholder: "例：食品工厂位于浙江舟山海洋食品产业园" },
          { key: "harvestSeason", label: "原料采购季节窗口", type: "text", placeholder: "例：每年 6-8 月为新鲜采购期，全年常规补货靠库存" },
        ],
      },
      {
        key: "foodSafetyCerts",
        title: "食品安全认证",
        fields: [
          { key: "foodCerts", label: "食品安全认证", type: "multiselect", options: ["HACCP（危害分析关键控制点）", "BRC（英国零售商联盟）A级", "SQF Level 3", "IFS Food v6", "ISO 22000", "Halal（清真）", "Kosher（犹太）", "USDA Organic 有机", "欧盟有机（EU 2018/848）", "无特殊认证"] },
          { key: "fdaFacilityReg", label: "FDA 工厂注册号（美国市场）", type: "text", placeholder: "例：FDA FCE: 14-3456789" },
        ],
      },
      {
        key: "nutrition",
        title: "营养与合规",
        fields: [
          { key: "allergenStatement", label: "过敏原声明（8大类）", type: "textarea", placeholder: "例：不含花生、树坚果、牛奶、鸡蛋、小麦、大豆、鱼类、贝类" },
          { key: "gmoStatus", label: "GMO 状态", type: "select", options: ["非转基因（Non-GMO）", "含转基因成分（已标注）", "不明确"] },
          { key: "shelfLife", label: "保质期", type: "text", placeholder: "例：常温24个月，冷冻36个月，开封后3天内食用" },
          { key: "coldChain", label: "冷链运输要求", type: "select", options: ["常温即可（-15°C ~ 35°C）", "冷藏（0~4°C）", "冷冻（-18°C以下）", "超低温（-60°C）"] },
        ],
      },
    ],
  },

  // ── I08 医疗器械/健康 ────────────────────────────────────────────────────
  {
    code: "I08",
    title: "医疗器械专项",
    icon: "🏥",
    layer: "industry",
    industryCode: "I08",
    subsections: [
      {
        key: "deviceClass",
        title: "产品分类与注册",
        fields: [
          { key: "riskClass", label: "医疗器械风险等级", type: "select", options: ["Class I（低风险/免于510k）", "Class II（中风险/需510k）", "Class III（高风险/需PMA）", "欧盟 Class I", "欧盟 Class IIa", "欧盟 Class IIb", "欧盟 Class III"] },
          { key: "nmpaCert", label: "国内 NMPA 注册/备案号", type: "text", placeholder: "例：国械注准 20213130XXX" },
        ],
      },
      {
        key: "internationalReg",
        title: "国际注册认证",
        fields: [
          { key: "fdaNumber", label: "FDA 510(k) 预市批准号", type: "text", placeholder: "例：K231234 / 或 Class I Exempt" },
          { key: "ceMdrCert", label: "CE 认证（MDR 2017/745）公告机构和证书号", type: "text", placeholder: "例：NB BSI Kitemark，证书号 MD XXXXXX" },
          { key: "otherRegs", label: "其他国家注册", type: "multiselect", options: ["MHLW/PMDA（日本 ）", "TGA（澳洲）", "Health Canada（加拿大）", "Anvisa（巴西）", "KFDA（韩国）"] },
        ],
      },
      {
        key: "sterilization",
        title: "无菌与灭菌",
        fields: [
          { key: "sterileProduct", label: "是否为无菌产品供应", type: "yesno" },
          { key: "sterilizationMethod", label: "灭菌方式", type: "multiselect", options: ["环氧乙烷（EO）", "伽玛射线（γ）", "高温高压蒸汽（Autoclave）", "电子束（E-Beam）", "非无菌供应（终端使用前灭菌）"] },
          { key: "sterileExpiry", label: "无菌有效期", type: "text", placeholder: "例：独立无菌包装，有效期 5 年" },
        ],
      },
      {
        key: "biocompatibility",
        title: "生物相容性",
        fields: [
          { key: "iso10993", label: "ISO 10993 测试项目", type: "multiselect", options: ["细胞毒性（Cytotoxicity）", "致敏性（Sensitization）", "皮内刺激（Intracutaneous Reactivity）", "全身急性毒性（Acute Systemic Toxicity）", "热原（Pyrogenicity）", "慢性毒性/致癌性", "遗传毒性（Genotoxicity）"] },
        ],
      },
    ],
  },

  // ── I09 汽配/交通运输 ─────────────────────────────────────────────────────
  {
    code: "I09",
    title: "汽配 / 交通运输专项",
    icon: "🚗",
    layer: "industry",
    industryCode: "I09",
    subsections: [
      {
        key: "vehicleApplication",
        title: "适用车型",
        fields: [
          { key: "oeNumbers", label: "OEM / OE 代码列表", type: "list", placeholder: "例：12345678 (BMW N55)，AB3Z-1234-A (Ford F150 2015-2021)" },
          { key: "fitment", label: "适用品牌/车型/年款范围", type: "textarea", placeholder: "例：适用于宝马 3系（E90/F30 2005-2020），可提供交叉参考表" },
        ],
      },
      {
        key: "autoCerts",
        title: "汽车行业认证",
        fields: [
          { key: "iatf16949", label: "IATF 16949 认证", type: "yesno" },
          { key: "emark", label: "E-Mark 道路认证（欧洲）", type: "yesno" },
          { key: "dotSae", label: "DOT / SAE 认证（美国）", type: "yesno" },
          { key: "ppapCapability", label: "PPAP 能力（生产件批准程序）", type: "select", options: ["Level 3（含完整 PPAP 提交）", "Level 2（部分文件）", "不支持 PPAP"] },
        ],
      },
      {
        key: "durability",
        title: "耐久性与性能测试",
        fields: [
          { key: "designLife", label: "设计使用寿命", type: "text", placeholder: "例：100,000 公里 或 10年" },
          { key: "saltSpray", label: "盐雾测试时长", type: "number", unit: "小时", placeholder: "240" },
          { key: "vibrationTest", label: "振动测试规格", type: "text", placeholder: "例：通过 SAE J2380 振动标准" },
        ],
      },
    ],
  },

  // ── I10 户外/运动/休闲 ────────────────────────────────────────────────────
  {
    code: "I10",
    title: "户外 / 运动专项",
    icon: "🏕️",
    layer: "industry",
    industryCode: "I10",
    subsections: [
      {
        key: "environment",
        title: "使用环境与防护",
        fields: [
          { key: "tempRange", label: "适用温度范围", type: "text", placeholder: "例：-30°C ~ +60°C（四季户外）" },
          { key: "waterproof", label: "防水等级", type: "multiselect", options: ["IPX0（无防护）", "IPX4（防溅）", "IPX5（防喷）", "IPX7（浸水30min）", "IPX8（深水浸泡）", "WP 10,000mm（织物）", "WP 20,000mm（高端面料）"] },
          { key: "uvResistance", label: "抗紫外线耐候性", type: "text", placeholder: "例：通过 QUV-B 1,000小时测试，UPF 50+" },
        ],
      },
      {
        key: "materialSpec",
        title: "主要材质与重量",
        fields: [
          { key: "mainMaterials", label: "核心材质", type: "text", placeholder: "例：杆：7075-T6铝合金，布：210D Ripstop尼龙（PU2000mm），扣件：YKK拉链" },
          { key: "productWeight", label: "核心产品重量范围", type: "text", placeholder: "例：单人帐 1.8kg，双人帐 2.5kg（含配件）" },
          { key: "packSize", label: "收纳尺寸", type: "text", placeholder: "例：收纳后 40×18cm，可装入大多数登山包侧袋" },
        ],
      },
      {
        key: "safetyCerts",
        title: "安全认证",
        fields: [
          { key: "enCerts", label: "EN 欧洲安全认证", type: "list", placeholder: "例：EN 362（钩扣）/ EN 12492（头盔）/ EN 892（动力绳）" },
          { key: "astmCerts", label: "ASTM 美国标准", type: "list", placeholder: "例：ASTM F2011（吊床）" },
          { key: "uiaa", label: "UIAA 国际登山联合会认证", type: "yesno" },
          { key: "prop65", label: "California Prop 65 合规声明", type: "yesno" },
        ],
      },
    ],
  },

  // ── I11 包装/印刷/纸品 ────────────────────────────────────────────────────
  {
    code: "I11",
    title: "包装 / 印刷专项",
    icon: "📦",
    layer: "industry",
    industryCode: "I11",
    subsections: [
      {
        key: "materials",
        title: "材质规格",
        fields: [
          { key: "paperGrade", label: "主要纸张克重范围", type: "text", placeholder: "例：200g/m²（内页）~ 400g/m²（封面），灰板 1.5mm" },
          { key: "corrugatedType", label: "瓦楞层数（纸箱）", type: "multiselect", options: ["3层 B/C 瓦楞", "5层 BC 双瓦楞", "7层 BCB 三瓦楞", "蜂窝板", "不生产纸箱"] },
          { key: "coating", label: "覆膜/涂布工艺", type: "multiselect", options: ["哑光膜", "高光膜", "镭射膜", "触感膜（软）", "水性涂布", "UV 局部上光"] },
        ],
      },
      {
        key: "printing",
        title: "印刷工艺",
        fields: [
          { key: "printingProcess", label: "印刷方式", type: "multiselect", options: ["胶印（CMYK + 专色Pantone）", "数码印刷", "UV 印刷", "凸版印刷", "移印"] },
          { key: "specialProcess", label: "特殊工艺", type: "multiselect", options: ["烫金/烫银（热烫/冷烫）", "凸击印（压凸）", "凹击印（压凹）", "模切/开窗", "激光雕刻纸板"] },
          { key: "plateCost", label: "起版费（制版/刀版）", type: "text", placeholder: "例：制版费 RMB 500-2,000，刀版费 RMB 300-1,000，可分摊" },
          { key: "minimumRun", label: "最小起印量", type: "text", placeholder: "例：胶印 MOQ 500件，数码印 MOQ 50件（无起版费）" },
        ],
      },
      {
        key: "eco",
        title: "环保认证",
        fields: [
          { key: "fscCert", label: "FSC 认证（可持续纸张）", type: "yesno" },
          { key: "biodegradable", label: "可降解材料能力", type: "text", placeholder: "例：可替换为 PLA / PBAT 降解塑料，需提前报价" },
          { key: "foodContact", label: "食品接触材料合规", type: "text", placeholder: "例：食品接触用包装符合 EU 10/2011 和 FDA 21 CFR" },
        ],
      },
    ],
  },

  // ── I12 礼品/工艺品/玩具 ──────────────────────────────────────────────────
  {
    code: "I12",
    title: "礼品 / 工艺品专项",
    icon: "🎁",
    layer: "industry",
    industryCode: "I12",
    subsections: [
      {
        key: "materials",
        title: "主要材质",
        fields: [
          { key: "giftMaterials", label: "可生产材质", type: "multiselect", options: ["ABS / PP 塑料", "锌合金压铸", "铝合金", "实木", "竹制品", "陶瓷/瓷器", "玻璃", "皮革/PU革", "纺织（绒/棉）", "树脂/硅胶"] },
        ],
      },
      {
        key: "toySafety",
        title: "玩具安全认证",
        fields: [
          { key: "toyStandards", label: "玩具安全标准认证", type: "multiselect", options: ["EN 71 Part 1-3（欧洲玩具）", "ASTM F963（美国玩具）", "CPSC / CPSIA 儿童品监管", "GB 6675（中国玩具）", "AS/NZS 8124（澳大利亚）", "无（非玩具类产品）"] },
          { key: "ageRange", label: "适用年龄范围", type: "text", placeholder: "例：3岁以上 / 14岁以上" },
        ],
      },
      {
        key: "personalization",
        title: "个性化定制",
        fields: [
          { key: "customizationMethods", label: "个性化方式", type: "multiselect", options: ["激光雕刻（金属/木材/皮革）", "丝印（平面）", "UV 喷印（平面/曲面）", "热转印", "压花/压字", "刺绣", "全彩数码印花"] },
          { key: "minLogoSize", label: "最小 Logo 印制尺寸", type: "text", placeholder: "例：最小字高 1mm，丝印最细线宽 0.2mm" },
          { key: "giftSetCapability", label: "礼品套装定制能力", type: "textarea", placeholder: "例：可做多品类组合礼盒（如：杯+杯垫+礼盒），MOQ 100套" },
        ],
      },
      {
        key: "hazardousSubstances",
        title: "有害物质合规",
        fields: [
          { key: "heavyMetals", label: "重金属检测", type: "text", placeholder: "例：符合 EN 71-3，铅<90mg/kg，镉<75mg/kg（第三方SGS报告）" },
          { key: "phthalates", label: "邻苯二甲酸酯（增塑剂）合规", type: "text", placeholder: "例：符合 CPSC（DEHP+DBP+BBP<0.1%），有SGS检测报告" },
          { key: "prop65", label: "California Prop 65 合规", type: "yesno" },
        ],
      },
    ],
  },
];

// ─── Helper 函数 ─────────────────────────────────────────────────────────────

/** 根据行业代码获取对应的专属 section */
export function getIndustrySectionByCode(industryCode: string): SectionDef | undefined {
  return INDUSTRY_SECTIONS.find((s) => s.industryCode === industryCode);
}

/** 获取行业标签（中文） */
export function getIndustryLabel(industryCode: string): string {
  return INDUSTRY_OPTIONS.find((o) => o.code === industryCode)?.label ?? industryCode;
}

/** 把所有 section + subsection 展平成 key → FieldDef 的 Map，用于表单渲染 */
export function buildFieldMap(sections: SectionDef[]): Map<string, FieldDef> {
  const map = new Map<string, FieldDef>();
  for (const section of sections) {
    for (const sub of section.subsections) {
      for (const field of sub.fields) {
        map.set(`${section.code}.${sub.key}.${field.key}`, field);
      }
    }
  }
  return map;
}

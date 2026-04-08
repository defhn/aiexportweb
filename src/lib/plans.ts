export type SitePlan = "basic" | "growth" | "ai_sales";

export type FeatureKey =
  | "dashboard_analytics"
  | "blog_management"
  | "csv_import"
  | "inquiry_detail"
  | "reply_templates"
  | "quotes"
  | "request_quote"
  | "ai_product_copy"
  | "ai_inquiry_reply"
  | "ai_inquiry_classification";

type FeatureRule = {
  labelZh: string;
  requiredPlan: SitePlan;
  trialLimitByPlan?: Partial<Record<SitePlan, number>>;
  upgradeTitle: string;
  upgradeDescription: string;
  benefits: string[];
};

type PlanCardSummary = {
  key: SitePlan;
  nameZh: string;
  nameEn: string;
  price: number;
  taglineZh: string;
  descriptionZh: string;
};

type ComparisonRow = {
  label: string;
  basic: boolean;
  growth: boolean;
  ai_sales: boolean;
};

type ComparisonSection = {
  title: string;
  rows: ComparisonRow[];
};

type FeatureAvailabilityInput = {
  currentPlan: SitePlan;
  featureKey: FeatureKey;
  usageCount?: number;
};

export type FeatureAvailability = {
  featureKey: FeatureKey;
  labelZh: string;
  currentPlan: SitePlan;
  requiredPlan: SitePlan;
  status: "included" | "trial" | "locked";
  limit: number | null;
  remaining: number | null;
  usageCount: number;
  upgradePlan: SitePlan | null;
  upgradeTitle: string;
  upgradeDescription: string;
  benefits: string[];
};

const planOrder: SitePlan[] = ["basic", "growth", "ai_sales"];

const planCards: PlanCardSummary[] = [
  {
    key: "basic",
    nameZh: "基础版",
    nameEn: "Basic",
    price: 9980,
    taglineZh: "专业英文外贸展示站",
    descriptionZh: "适合先把英文官网搭起来，尽快上线展示产品和承接基础询盘。",
  },
  {
    key: "growth",
    nameZh: "获客版",
    nameEn: "Growth",
    price: 19800,
    taglineZh: "外贸获客系统",
    descriptionZh: "适合要持续接询盘、做内容运营、管理销售跟进的制造业企业。",
  },
  {
    key: "ai_sales",
    nameZh: "AI销售版",
    nameEn: "AI Sales",
    price: 29800,
    taglineZh: "AI外贸获客与销售系统",
    descriptionZh: "适合已经有销售动作，想用 AI 加快产品录入、询盘分类和回复效率的团队。",
  },
];

const featureRules: Record<FeatureKey, FeatureRule> = {
  dashboard_analytics: {
    labelZh: "询盘数据看板",
    requiredPlan: "growth",
    upgradeTitle: "询盘数据看板属于获客版功能",
    upgradeDescription:
      "升级后可以直接看到今日、本周、本月询盘趋势，以及国家来源和热门产品排行。",
    benefits: [
      "老板能快速判断网站最近有没有带来客户",
      "能看出哪些产品更容易带来询盘",
      "国家来源统计更方便安排重点市场",
    ],
  },
  blog_management: {
    labelZh: "博客系统",
    requiredPlan: "growth",
    upgradeTitle: "博客系统属于获客版功能",
    upgradeDescription:
      "升级后可以持续发布英文 SEO 内容，承接 Google 长尾流量并提高专业感。",
    benefits: [
      "持续更新英文内容，帮助 SEO 获客",
      "文章可反向导流到产品页与询盘表单",
      "让网站长期保持活跃，而不是一次性展示页",
    ],
  },
  csv_import: {
    labelZh: "产品 CSV 批量导入",
    requiredPlan: "growth",
    upgradeTitle: "产品批量导入属于获客版功能",
    upgradeDescription:
      "升级后可以用 CSV 批量导入产品，减少助理和运营手工录入的时间。",
    benefits: [
      "大量产品可一次性录入",
      "更适合工厂目录型产品结构",
      "能显著减少反复手工维护",
    ],
  },
  inquiry_detail: {
    labelZh: "询盘详情与跟进",
    requiredPlan: "growth",
    upgradeTitle: "询盘详情页属于获客版功能",
    upgradeDescription:
      "升级后可以查看询盘详情、附件、内部备注，并统一做状态流转。",
    benefits: [
      "销售跟进信息不会散落在聊天记录里",
      "可在后台统一查看附件、产品和备注",
      "后续接入回复模板和报价流程更顺手",
    ],
  },
  reply_templates: {
    labelZh: "快速回复模板",
    requiredPlan: "growth",
    upgradeTitle: "快速回复模板属于获客版功能",
    upgradeDescription:
      "升级后可以统一维护报价、打样、MOQ、交期等英文回复模板。",
    benefits: [
      "外贸助理回复更快",
      "统一公司对外口径，减少沟通误差",
      "和询盘详情页联动后更省时间",
    ],
  },
  quotes: {
    labelZh: "报价申请系统",
    requiredPlan: "growth",
    upgradeTitle: "报价申请系统属于获客版功能",
    upgradeDescription:
      "升级后可接收更完整的 RFQ 信息，并在后台集中管理报价申请。",
    benefits: [
      "客户可以提交数量、备注和附件",
      "更适合金额更高、规格更复杂的产品",
      "报价入口独立，销售动作更清晰",
    ],
  },
  request_quote: {
    labelZh: "公开报价申请页",
    requiredPlan: "growth",
    upgradeTitle: "报价申请页属于获客版功能",
    upgradeDescription:
      "升级后会开放前台 RFQ 页面，帮助客户提交更完整的报价需求。",
    benefits: [
      "承接更高意向的客户",
      "比普通联系表单拿到更完整的信息",
      "有助于业务员更快整理报价单",
    ],
  },
  ai_product_copy: {
    labelZh: "AI 产品英文文案",
    requiredPlan: "ai_sales",
    trialLimitByPlan: { growth: 3 },
    upgradeTitle: "AI 产品文案属于 AI销售版功能",
    upgradeDescription:
      "升级后可以快速生成英文产品标题、描述和 SEO 文案，减少人工写稿时间。",
    benefits: [
      "产品上新更快",
      "英文文案风格更统一",
      "更适合需要频繁更新产品的团队",
    ],
  },
  ai_inquiry_reply: {
    labelZh: "AI 英文回复草稿",
    requiredPlan: "ai_sales",
    trialLimitByPlan: { growth: 5 },
    upgradeTitle: "AI 英文回复属于 AI销售版功能",
    upgradeDescription:
      "升级后可根据询盘内容和产品参数自动生成英文回复草稿，人工确认后发送。",
    benefits: [
      "减少销售和助理重复写邮件",
      "回复速度更快，减少漏答关键信息",
      "适合高频处理询盘的团队",
    ],
  },
  ai_inquiry_classification: {
    labelZh: "AI 询盘分类",
    requiredPlan: "ai_sales",
    trialLimitByPlan: { growth: 20 },
    upgradeTitle: "AI 询盘分类属于 AI销售版功能",
    upgradeDescription:
      "升级后可自动判断报价、样品、技术等询盘类型，减少人工分类时间。",
    benefits: [
      "询盘越多越能体现价值",
      "更适合多人协作跟进",
      "方便统计高价值线索类型",
    ],
  },
};

const comparisonSections: ComparisonSection[] = [
  {
    title: "网站底座",
    rows: [
      { label: "英文前台网站", basic: true, growth: true, ai_sales: true },
      { label: "中文后台", basic: true, growth: true, ai_sales: true },
      { label: "首页 / About / Contact", basic: true, growth: true, ai_sales: true },
      { label: "产品分类页 / 产品详情页", basic: true, growth: true, ai_sales: true },
      { label: "图库管理", basic: true, growth: true, ai_sales: true },
      { label: "文件资料库", basic: true, growth: true, ai_sales: true },
      { label: "基础 SEO 与大模型抓取友好", basic: true, growth: true, ai_sales: true },
    ],
  },
  {
    title: "获客与运营",
    rows: [
      { label: "询盘表单 + Brevo 通知 + 入库", basic: true, growth: true, ai_sales: true },
      { label: "询盘附件上传", basic: true, growth: true, ai_sales: true },
      { label: "博客系统", basic: false, growth: true, ai_sales: true },
      { label: "首页模块排序 / 推荐内容", basic: false, growth: true, ai_sales: true },
      { label: "产品 CSV 批量导入", basic: false, growth: true, ai_sales: true },
      { label: "公开报价申请页", basic: false, growth: true, ai_sales: true },
    ],
  },
  {
    title: "销售协同与 AI",
    rows: [
      { label: "数据看板与国家来源统计", basic: false, growth: true, ai_sales: true },
      { label: "询盘详情页 / 状态流转 / 内部备注", basic: false, growth: true, ai_sales: true },
      { label: "回复模板", basic: false, growth: true, ai_sales: true },
      { label: "后台报价申请管理", basic: false, growth: true, ai_sales: true },
      { label: "AI 产品英文文案", basic: false, growth: false, ai_sales: true },
      { label: "AI 询盘分类", basic: false, growth: false, ai_sales: true },
      { label: "AI 英文回复草稿", basic: false, growth: false, ai_sales: true },
    ],
  },
];

function planIndex(plan: SitePlan) {
  return planOrder.indexOf(plan);
}

export function normalizeSitePlan(value?: string | null): SitePlan {
  if (value === "basic" || value === "growth" || value === "ai_sales") {
    return value;
  }

  return "ai_sales";
}

export function isPricingPageEnabled(value?: string | null) {
  return value === "1" || value === "true";
}

export function getPricingPageHref(enabled: boolean) {
  return enabled ? "/pricing" : null;
}

export function getPlanCardSummaries() {
  return planCards;
}

export function getComparisonSections() {
  return comparisonSections;
}

export function getPlanSummary(plan: SitePlan) {
  return planCards.find((item) => item.key === plan) ?? planCards[2];
}

export function getFeatureRule(featureKey: FeatureKey) {
  return featureRules[featureKey];
}

export function getFeatureAvailability({
  currentPlan,
  featureKey,
  usageCount = 0,
}: FeatureAvailabilityInput): FeatureAvailability {
  const rule = getFeatureRule(featureKey);
  const trialLimit = rule.trialLimitByPlan?.[currentPlan] ?? null;

  if (planIndex(currentPlan) >= planIndex(rule.requiredPlan)) {
    return {
      featureKey,
      labelZh: rule.labelZh,
      currentPlan,
      requiredPlan: rule.requiredPlan,
      status: "included",
      limit: null,
      remaining: null,
      usageCount,
      upgradePlan: null,
      upgradeTitle: rule.upgradeTitle,
      upgradeDescription: rule.upgradeDescription,
      benefits: rule.benefits,
    };
  }

  if (trialLimit !== null) {
    const remaining = Math.max(trialLimit - usageCount, 0);

    return {
      featureKey,
      labelZh: rule.labelZh,
      currentPlan,
      requiredPlan: rule.requiredPlan,
      status: remaining > 0 ? "trial" : "locked",
      limit: trialLimit,
      remaining,
      usageCount,
      upgradePlan: rule.requiredPlan,
      upgradeTitle: rule.upgradeTitle,
      upgradeDescription: rule.upgradeDescription,
      benefits: rule.benefits,
    };
  }

  return {
    featureKey,
    labelZh: rule.labelZh,
    currentPlan,
    requiredPlan: rule.requiredPlan,
    status: "locked",
    limit: null,
    remaining: null,
    usageCount,
    upgradePlan: rule.requiredPlan,
    upgradeTitle: rule.upgradeTitle,
    upgradeDescription: rule.upgradeDescription,
    benefits: rule.benefits,
  };
}

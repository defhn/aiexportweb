import { eq, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { featureUsageCounters } from "@/db/schema";

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
  | "ai_inquiry_classification"
  | "utm_attribution"
  | "pipeline_kanban"
  | "rag_factory";

export const allFeatureKeys: FeatureKey[] = [
  "dashboard_analytics",
  "blog_management",
  "csv_import",
  "inquiry_detail",
  "reply_templates",
  "quotes",
  "request_quote",
  "ai_product_copy",
  "ai_inquiry_reply",
  "ai_inquiry_classification",
  "utm_attribution",
  "pipeline_kanban",
  "rag_factory",
];

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
  enabledFeatures?: FeatureKey[];
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
    taglineZh: "快速建站，轻松展示品牌",
    descriptionZh:
      "适合中小外贸工厂，快速搭建专业外贸网站，多语言展示产品与品牌，开启独立站获客之旅",
  },
  {
    key: "growth",
    nameZh: "成长版",
    nameEn: "Growth",
    price: 19800,
    taglineZh: "升级CRM，系统管理客户",
    descriptionZh:
      "适合已有询盘基础的工厂，完整CRM工具加持，博客营销、精准归因分析、CSV批量导入，全面提升转化率",
  },
  {
    key: "ai_sales",
    nameZh: "AI销售版",
    nameEn: "AI Sales",
    price: 29800,
    taglineZh: "AI驱动，智能开单提效",
    descriptionZh:
      "适合重视销售效率的工厂，AI自动生成产品文案、智能分类询盘、RAG知识库问答，让AI成为你的24小时销售助手",
  },
];

const featureRules: Record<FeatureKey, FeatureRule> = {
  dashboard_analytics: {
    labelZh: "数据分析看板",
    requiredPlan: "growth",
    upgradeTitle: "数据分析看板，升级成长版解锁",
    upgradeDescription:
      "升级后，即可查看访客行为、流量来源、询盘转化漏斗等核心指标，告别盲目运营，用数据驱动决策",
    benefits: [
      "实时查看页面PV/UV、来源国家、设备分布",
      "分析各渠道询盘转化率，找到最佳获客来源",
      "追踪关键词表现，优化SEO内容策略",
    ],
  },
  blog_management: {
    labelZh: "博客内容管理",
    requiredPlan: "growth",
    upgradeTitle: "博客内容管理，驱动SEO长效增长，升级成长版解锁",
    upgradeDescription:
      "升级后，即可创建SEO友好的博客文章，持续输出行业干货，让Google长期为你带来免费精准流量",
    benefits: [
      "批量创建带SEO元数据的博客文章，快速布局关键词",
      "支持富文本编辑、图片上传、相关文章关联推荐",
      "自动生成结构化数据，提升Google搜索展示效果",
    ],
  },
  csv_import: {
    labelZh: "批量导入CSV产品/询盘",
    requiredPlan: "growth",
    upgradeTitle: "批量导入询盘/产品，升级成长版解锁",
    upgradeDescription:
      "升级后，可用CSV一键批量导入产品目录或历史询盘数据，快速完成数据迁移，无需逐条手动录入",
    benefits: [
      "支持导入大量产品或询盘数据",
      "自动校验数据格式，导入前可预览确认",
      "历史数据无缝迁移，保留原始字段信息",
    ],
  },
  inquiry_detail: {
    labelZh: "询盘详情与跟进记录",
    requiredPlan: "growth",
    upgradeTitle: "询盘详情页，完整跟进客户旅程，升级成长版解锁",
    upgradeDescription:
      "升级后，可查看每条询盘的完整消息体、附件、跟进时间线，让每一次客户沟通都有迹可查",
    benefits: [
      "查看询盘正文、附件、IP定位等完整信息",
      "时间线记录每次跟进动作，回溯客户完整旅程",
      "标记询盘优先级，集中精力处理高价值客户",
    ],
  },
  reply_templates: {
    labelZh: "回复话术模板库",
    requiredPlan: "growth",
    upgradeTitle: "回复话术模板库，提升回复效率，升级成长版解锁",
    upgradeDescription:
      "升级后，可创建标准化询盘回复模板，一键套用，确保专业回复不遗漏，提高询盘处理效率",
    benefits: [
      "预设常用回复话术，一键快速套用",
      "支持模板分类管理，不同场景灵活切换",
      "团队共享话术库，统一回复标准提升形象",
    ],
  },
  quotes: {
    labelZh: "报价单管理",
    requiredPlan: "growth",
    upgradeTitle: "报价单管理，升级成长版解锁",
    upgradeDescription:
      "升级后，可将收到的询价通过/request-quote页面转化为正式报价单，追踪报价状态，提高成单效率",
    benefits: [
      "在线生成专业报价单，一键发送给客户",
      "追踪报价状态：新建、审核中、已报价、已关闭",
      "报价单与询盘自动关联，完整留存商务往来",
    ],
  },
  request_quote: {
    labelZh: "客户在线询价表单",
    requiredPlan: "growth",
    upgradeTitle: "报价单管理，查看并跟进询价，升级成长版解锁",
    upgradeDescription:
      "升级后，客户通过/request-quote页面提交的询价将进入报价单系统，支持状态追踪和AI辅助报价",
    benefits: [
      "专属在线询价表单，收集标准化客户需求",
      "询价自动进入后台，无需手动整理",
      "结合报价单功能，快速生成并发送报价",
    ],
  },
  utm_attribution: {
    labelZh: "UTM流量归因分析",
    requiredPlan: "growth",
    upgradeTitle: "UTM流量归因分析，升级成长版解锁",
    upgradeDescription:
      "升级后，可追踪每条询盘的真实来源渠道，区分Google / 小红书 / 抖音等不同推广渠道效果，同时支持GCLID精准归因，帮助优化广告预算",
    benefits: [
      "精准归因每条询盘来自哪个Google广告系列或关键词",
      "自动识别并记录广告点击ID，分析不同渠道广告ROI回报",
      "持续追踪GCLID，助力精准优化出价策略",
    ],
  },
  pipeline_kanban: {
    labelZh: "Pipeline看板管理",
    requiredPlan: "growth",
    upgradeTitle: "Pipeline看板，升级成长版解锁",
    upgradeDescription:
      "升级后，可用可视化Kanban看板管理所有销售线索，从首次接触到成交，每个环节一目了然，不漏掉任何潜在客户",
    benefits: [
      "可视化Kanban拖拽管理销售阶段，一目了然",
      "自定义阶段标签，灵活适配不同销售流程",
      "快速查看每阶段询盘数量，掌握整体销售健康度",
    ],
  },
  ai_product_copy: {
    labelZh: "AI自动生成产品文案",
    requiredPlan: "ai_sales",
    trialLimitByPlan: { growth: 3 },
    upgradeTitle: "AI自动生成产品文案，升级AI销售版解锁",
    upgradeDescription:
      "升级后，可一键调用AI为每个产品生成SEO优化的英文标题、描述和卖点，大幅缩短文案创作时间",
    benefits: [
      "一键生成专业产品文案",
      "文案自动含关键词，提升SEO收录",
      "支持批量处理多个产品，效率翻倍",
    ],
  },
  ai_inquiry_reply: {
    labelZh: "AI询盘智能回复",
    requiredPlan: "ai_sales",
    trialLimitByPlan: { growth: 5 },
    upgradeTitle: "AI询盘智能回复，升级AI销售版解锁",
    upgradeDescription:
      "升级后，AI可根据询盘内容和产品知识库，自动起草专业的英文回复草稿，大幅节省外贸业务员回复时间",
    benefits: [
      "智能分析询盘意图，起草精准专业回复",
      "结合产品知识库，回复内容更贴合实际产品",
      "全自动起草流程，销售人员只需审核确认",
    ],
  },
  ai_inquiry_classification: {
    labelZh: "AI询盘智能分类",
    requiredPlan: "ai_sales",
    trialLimitByPlan: { growth: 20 },
    upgradeTitle: "AI询盘智能分类，升级AI销售版解锁",
    upgradeDescription:
      "升级后，AI将自动对每条新询盘进行意图识别和优先级评分，让销售团队第一时间处理最有价值的高意向客户",
    benefits: [
      "询盘自动打标签分类，优先处理高意向询盘",
      "支持自定义分类规则，适配不同行业场景",
      "可视化分类报告，掌握询盘质量分布趋势",
    ],
  },
  rag_factory: {
    labelZh: "RAG产品知识库",
    requiredPlan: "ai_sales",
    upgradeTitle: "RAG产品知识库，升级AI销售版解锁",
    upgradeDescription:
      "升级后，AI可基于你上传的产品资料、规格参数、FAQ文档等构建专属知识库，回答客户咨询时更精准、更专业",
    benefits: [
      "AI回复自动调取知识库，引用真实产品参数和FAQ",
      "支持上传PDF、Word、Excel等多格式文档构建知识库",
      "持续迭代更新知识库，AI越用越懂你的产品",
    ],
  },
};

const comparisonSections: ComparisonSection[] = [
  {
    title: "基础展示功能",
    rows: [
      { label: "产品目录与多语言展示", basic: true, growth: true, ai_sales: true },
      { label: "多行业首页模版", basic: true, growth: true, ai_sales: true },
      { label: "主页 / About / Contact", basic: true, growth: true, ai_sales: true },
      { label: "产品搜索 / 产品详情", basic: true, growth: true, ai_sales: true },
      { label: "移动端响应式", basic: true, growth: true, ai_sales: true },
      { label: "自定义域名绑定", basic: true, growth: true, ai_sales: true },
      { label: "基础SEO配置与动态站点地图", basic: true, growth: true, ai_sales: true },
      { label: "JSON-LD结构化数据 Product / Organization / Blog", basic: true, growth: true, ai_sales: true },
    ],
  },
  {
    title: "成长营销功能",
    rows: [
      { label: "询盘接收 + Brevo邮件 + 通知", basic: true, growth: true, ai_sales: true },
      { label: "询盘列表与快速查看", basic: true, growth: true, ai_sales: true },
      { label: "附件安全URL生成（有效期15天）", basic: false, growth: true, ai_sales: true },
      { label: "博客内容管理", basic: false, growth: true, ai_sales: true },
      { label: "主页模块 / 关于页编辑", basic: false, growth: true, ai_sales: true },
      { label: "批量导入CSV产品/询盘", basic: false, growth: true, ai_sales: true },
      { label: "客户在线询价表单", basic: false, growth: true, ai_sales: true },
      { label: "追踪广告UTM参数 utm_source / medium / campaign / gclid", basic: false, growth: true, ai_sales: true },
    ],
  },
  {
    title: "智能化CRM",
    rows: [
      { label: "询盘来源标签与客户旅程追踪", basic: false, growth: true, ai_sales: true },
      { label: "询盘详情页 / 跟进记录 / 附件查看", basic: false, growth: true, ai_sales: true },
      { label: "回复话术模板库", basic: false, growth: true, ai_sales: true },
      { label: "客户报价单管理", basic: false, growth: true, ai_sales: true },
      { label: "UTM来源归因 + ROI广告追踪效果", basic: false, growth: true, ai_sales: true },
      { label: "Pipeline看板（6阶段Kanban可视化管理）", basic: false, growth: true, ai_sales: true },
      { label: "询盘数据CSV导出", basic: false, growth: true, ai_sales: true },
    ],
  },
  {
    title: "AI功能",
    rows: [
      { label: "AI自动生成产品文案", basic: false, growth: false, ai_sales: true },
      { label: "AI询盘智能分类", basic: false, growth: false, ai_sales: true },
      { label: "AI询盘智能回复", basic: false, growth: false, ai_sales: true },
      { label: "RAG产品知识库（精准引用产品参数解答客户）", basic: false, growth: false, ai_sales: true },
      { label: "AI销售助手（24小时问答 + 客户意图识别 + 自动草稿）", basic: false, growth: false, ai_sales: true },
      { label: "向量检索（text-embedding-004）", basic: false, growth: false, ai_sales: true },
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

export function isFeatureOverrideEnabled(
  featureKey: FeatureKey,
  enabledFeatures?: FeatureKey[] | null,
) {
  return (enabledFeatures ?? []).includes(featureKey);
}

export function getFeatureAvailability({
  currentPlan,
  featureKey,
  usageCount = 0,
  enabledFeatures = [],
}: FeatureAvailabilityInput): FeatureAvailability {
  const rule = getFeatureRule(featureKey);
  const trialLimit = rule.trialLimitByPlan?.[currentPlan] ?? null;

  if (isFeatureOverrideEnabled(featureKey, enabledFeatures)) {
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

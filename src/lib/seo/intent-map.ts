/**
 * SEO 意图词库（CEO 亲自维护的核心资产）
 *
 * ⚠️ 战略壁垒说明：这个文件里的每一条词组，都是针对西方 B2B 采购决策者
 * 实际搜索行为的精准映射。是你的 AI 内容引擎能比竞争对手
 * 更精准拦截 Google 流量的核心原因。
 *
 * 维护规则：
 * 1. 每个行业至少 20 条高意图词组
 * 2. 优先级分三级：HIGH（采购决策词）/ MEDIUM（调研词）/ LOW（泛知识词）
 * 3. 每季度根据 Google Search Console 数据更新一次
 */

export type IntentPhrase = {
  phrase: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  intent: "transactional" | "informational" | "commercial";
};

export type IndustryIntentMap = {
  industry: string;
  phrases: IntentPhrase[];
};

// ─── CNC 精密加工意图词库 ──────────────────────────────────────────────────────

const cncIntentPhrases: IntentPhrase[] = [
  // HIGH：采购决策者直接寻找供应商
  { phrase: "custom CNC machining service", priority: "HIGH", intent: "transactional" },
  { phrase: "precision CNC milling manufacturer China", priority: "HIGH", intent: "transactional" },
  { phrase: "CNC machining for aerospace parts", priority: "HIGH", intent: "transactional" },
  { phrase: "low volume CNC prototype manufacturer", priority: "HIGH", intent: "transactional" },
  { phrase: "CNC turning service stainless steel", priority: "HIGH", intent: "transactional" },
  { phrase: "5-axis CNC machining center factory", priority: "HIGH", intent: "transactional" },
  { phrase: "ISO 9001 CNC machining supplier", priority: "HIGH", intent: "transactional" },
  { phrase: "aluminum CNC parts manufacturer", priority: "HIGH", intent: "transactional" },
  { phrase: "medical grade CNC machining", priority: "HIGH", intent: "transactional" },
  { phrase: "CNC machining tight tolerance 0.005mm", priority: "HIGH", intent: "transactional" },

  // MEDIUM：比较和调研阶段
  { phrase: "CNC machining cost per part", priority: "MEDIUM", intent: "commercial" },
  { phrase: "how to choose CNC machining supplier", priority: "MEDIUM", intent: "commercial" },
  { phrase: "CNC machining vs injection molding", priority: "MEDIUM", intent: "informational" },
  { phrase: "CNC machining surface finish options", priority: "MEDIUM", intent: "informational" },
  { phrase: "what is 5-axis CNC machining", priority: "MEDIUM", intent: "informational" },
  { phrase: "CNC machining tolerances explained", priority: "MEDIUM", intent: "informational" },
  { phrase: "anodizing vs powder coating aluminum", priority: "MEDIUM", intent: "informational" },
  { phrase: "DFM analysis for CNC parts", priority: "MEDIUM", intent: "commercial" },
  { phrase: "minimum order quantity CNC machining", priority: "MEDIUM", intent: "commercial" },
  { phrase: "CNC machining lead time from China", priority: "MEDIUM", intent: "commercial" },

  // LOW：泛知识类
  { phrase: "CNC machining process overview", priority: "LOW", intent: "informational" },
  { phrase: "types of CNC machine tools", priority: "LOW", intent: "informational" },
  { phrase: "G-code programming basics", priority: "LOW", intent: "informational" },
];

// ─── 医疗器械意图词库 ─────────────────────────────────────────────────────────

const medicalIntentPhrases: IntentPhrase[] = [
  { phrase: "ISO 13485 manufacturer China", priority: "HIGH", intent: "transactional" },
  { phrase: "FDA registered medical device factory", priority: "HIGH", intent: "transactional" },
  { phrase: "class II medical device contract manufacturer", priority: "HIGH", intent: "transactional" },
  { phrase: "sterile medical packaging supplier", priority: "HIGH", intent: "transactional" },
  { phrase: "CE marked medical device OEM", priority: "HIGH", intent: "transactional" },
  { phrase: "biocompatible plastic parts manufacturer", priority: "HIGH", intent: "transactional" },
  { phrase: "MDR compliant medical components", priority: "HIGH", intent: "transactional" },
  { phrase: "medical grade silicone manufacturer", priority: "HIGH", intent: "transactional" },
  { phrase: "cost of medical device manufacturing China", priority: "MEDIUM", intent: "commercial" },
  { phrase: "how to find medical device OEM supplier", priority: "MEDIUM", intent: "commercial" },
  { phrase: "ISO 13485 vs ISO 9001 difference", priority: "MEDIUM", intent: "informational" },
  { phrase: "medical device regulatory requirements China export", priority: "MEDIUM", intent: "informational" },
];

// ─── 消费电子意图词库 ─────────────────────────────────────────────────────────

const electronicsIntentPhrases: IntentPhrase[] = [
  { phrase: "PCBA manufacturer China low MOQ", priority: "HIGH", intent: "transactional" },
  { phrase: "turnkey PCB assembly service", priority: "HIGH", intent: "transactional" },
  { phrase: "IoT device contract manufacturer", priority: "HIGH", intent: "transactional" },
  { phrase: "FCC CE certified electronics OEM", priority: "HIGH", intent: "transactional" },
  { phrase: "DFM support PCB design China factory", priority: "HIGH", intent: "transactional" },
  { phrase: "consumer electronics white label manufacturer", priority: "HIGH", intent: "transactional" },
  { phrase: "PCB assembly cost calculator", priority: "MEDIUM", intent: "commercial" },
  { phrase: "how to source electronics from China", priority: "MEDIUM", intent: "informational" },
  { phrase: "electronics certification process FCC CE", priority: "MEDIUM", intent: "informational" },
  { phrase: "Bluetooth module integration manufacturer", priority: "MEDIUM", intent: "commercial" },
];

// ─── 钣金/金属加工意图词库 ───────────────────────────────────────────────────

const metalFabIntentPhrases: IntentPhrase[] = [
  { phrase: "custom sheet metal fabrication China", priority: "HIGH", intent: "transactional" },
  { phrase: "laser cutting bending welding service", priority: "HIGH", intent: "transactional" },
  { phrase: "stainless steel enclosure manufacturer", priority: "HIGH", intent: "transactional" },
  { phrase: "powder coated aluminum extrusion supplier", priority: "HIGH", intent: "transactional" },
  { phrase: "ISO 3834 certified welding factory", priority: "HIGH", intent: "transactional" },
  { phrase: "sheet metal prototyping low volume", priority: "MEDIUM", intent: "transactional" },
  { phrase: "metal stamping vs fabrication comparison", priority: "MEDIUM", intent: "informational" },
  { phrase: "galvanizing vs powder coating outdoor use", priority: "MEDIUM", intent: "informational" },
];

// ─── 全局意图词库注册表 ────────────────────────────────────────────────────────

const INTENT_MAP: Record<string, IntentPhrase[]> = {
  cnc: cncIntentPhrases,
  medical: medicalIntentPhrases,
  electronics: electronicsIntentPhrases,
  metal_fab: metalFabIntentPhrases,
};

/**
 * 获取行业意图词（按优先级过滤）
 *
 * @param industry 行业 key
 * @param priority 最低优先级过滤（默认仅返回 HIGH + MEDIUM）
 * @param limit 返回条数限制
 */
export function getIntentPhrases(
  industry: string,
  priority: "HIGH" | "MEDIUM" | "LOW" = "MEDIUM",
  limit = 15,
): string[] {
  const phrases = INTENT_MAP[industry] ?? INTENT_MAP.cnc;

  const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const minPriority = priorityOrder[priority];

  return phrases
    .filter((p) => priorityOrder[p.priority] >= minPriority)
    .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
    .slice(0, limit)
    .map((p) => p.phrase);
}

/**
 * 获取高意图采购词（仅 HIGH priority transactional）
 * 用于 H1 和标题优先匹配
 */
export function getHighIntentTransactionalPhrases(industry: string): string[] {
  const phrases = INTENT_MAP[industry] ?? INTENT_MAP.cnc;
  return phrases
    .filter((p) => p.priority === "HIGH" && p.intent === "transactional")
    .map((p) => p.phrase);
}

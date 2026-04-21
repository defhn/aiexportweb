/**
 * 工业参数提取 Schema 定义（Zod 强类型验证）
 *
 * ⚠️ 战略核心：这是整个 AI 流水线的"地基"。
 * 所有 Agent 的输入/输出都基于这些 Schema。
 * Schema 不对，后续所有内容必然是废话。
 *
 * 行业扩展：CNC → Medical → Electronics → General
 */

import { z } from "zod";

// ─── 通用制造 Schema（所有行业的最小公约数）────────────────────────────────────

export const GenericManufacturingSchema = z.object({
  // 产品基础信息
  productName: z.string().default(""),
  productCategory: z.string().default(""),

  // 材料与规格
  materials: z.array(z.string()).default([]),        // 如 ["6061 aluminum", "304 stainless steel"]
  specifications: z.record(z.string(), z.unknown()).default({}),   // Key-value pairs, e.g. { "tolerance": "±0.05mm" }

  // 应用场景
  applications: z.array(z.string()).default([]),      // 如 ["aerospace", "automotive"]

  // 质量认证
  certifications: z.array(z.string()).default([]),    // 如 ["ISO 9001", "AS9100D"]

  // 供应链信息
  leadTime: z.string().optional(),                    // 如 "7-14 business days"
  moq: z.string().optional(),                         // 如 "50 pieces"

  // 提取质量分（0-100，AI 自评提取置信度）
  extractionConfidence: z.number().min(0).max(100).default(50),

  // 原始提取到的关键文本片段（用于 Reviewer 校验）
  rawKeyDataPoints: z.array(z.string()).default([]),
});

export type GenericManufacturingData = z.infer<typeof GenericManufacturingSchema>;

// ─── CNC 精密加工 Schema ──────────────────────────────────────────────────────

export const CncMachiningSchema = GenericManufacturingSchema.extend({
  industry: z.literal("cnc"),

  // 加工能力
  tolerances: z.string().optional(),                  // "±0.005mm", "±0.0002 inch"
  surfaceFinishes: z.array(z.string()).default([]),   // ["anodizing", "chrome plating"]
  machiningProcesses: z.array(z.string()).default([]), // ["CNC milling", "CNC turning", "EDM"]

  // 设备信息
  equipment: z.array(z.string()).default([]),         // ["5-axis machining center", "Swiss lathe"]
  workingArea: z.string().optional(),                 // "800mm x 600mm x 500mm"

  // 能力范围
  partSizeRange: z.string().optional(),               // "from 1mm to 1200mm"
  productionCapacity: z.string().optional(),          // "50,000 parts/month"
});

export type CncMachiningData = z.infer<typeof CncMachiningSchema>;

// ─── 医疗器械 Schema ──────────────────────────────────────────────────────────

export const MedicalDeviceSchema = GenericManufacturingSchema.extend({
  industry: z.literal("medical"),

  // 法规合规
  deviceClass: z.string().optional(),                 // "Class I", "Class II", "Class III"
  regulatoryStatus: z.array(z.string()).default([]),  // ["FDA 510(k)", "CE marking", "MDR"]
  qualitySystem: z.string().optional(),               // "ISO 13485:2016"

  // 材料合规
  biocompatibleMaterials: z.array(z.string()).default([]),
  sterilizationMethods: z.array(z.string()).default([]), // ["EO gas", "Gamma", "Autoclave"]

  // 临床应用
  clinicalApplications: z.array(z.string()).default([]),
  bodyContact: z.string().optional(),                 // "skin contact", "blood contact"
});

export type MedicalDeviceData = z.infer<typeof MedicalDeviceSchema>;

// ─── 消费电子 Schema ──────────────────────────────────────────────────────────

export const ElectronicsSchema = GenericManufacturingSchema.extend({
  industry: z.literal("electronics"),

  // 电气参数
  powerRating: z.string().optional(),                 // "5V DC, 2A"
  operatingTemp: z.string().optional(),               // "-20°C to 85°C"
  ingressProtection: z.string().optional(),           // "IP67"

  // 连接与通信
  connectivity: z.array(z.string()).default([]),      // ["Bluetooth 5.0", "Wi-Fi 6", "USB-C"]
  protocols: z.array(z.string()).default([]),         // ["MQTT", "Zigbee"]

  // 认证
  emc: z.array(z.string()).default([]),               // ["FCC", "CE", "RoHS"]

  // 生产
  pcbLayers: z.number().optional(),
  assemblyType: z.string().optional(),                // "SMT", "THT", "Mixed"
});

export type ElectronicsData = z.infer<typeof ElectronicsSchema>;

// ─── 建材/钣金/结构件 Schema ──────────────────────────────────────────────────

export const MetalFabricationSchema = GenericManufacturingSchema.extend({
  industry: z.literal("metal_fab"),

  // 加工工艺
  fabricationProcesses: z.array(z.string()).default([]), // ["laser cutting", "welding", "bending"]
  materialThickness: z.string().optional(),              // "0.5mm to 20mm"
  weldingStandards: z.array(z.string()).default([]),    // ["AWS D1.1", "ISO 3834"]

  // 表面处理
  coatings: z.array(z.string()).default([]),            // ["powder coating", "galvanizing"]

  // 结构强度
  loadCapacity: z.string().optional(),
});

export type MetalFabricationData = z.infer<typeof MetalFabricationSchema>;

// ─── 联合类型（用于函数重载）─────────────────────────────────────────────────

export type IndustryData =
  | CncMachiningData
  | MedicalDeviceData
  | ElectronicsData
  | MetalFabricationData
  | GenericManufacturingData;

export type IndustryKey = "cnc" | "medical" | "electronics" | "metal_fab" | "generic";

// 根据行业 key 获取对应 Schema
export function getIndustrySchema(industry: IndustryKey) {
  switch (industry) {
    case "cnc":
      return CncMachiningSchema;
    case "medical":
      return MedicalDeviceSchema;
    case "electronics":
      return ElectronicsSchema;
    case "metal_fab":
      return MetalFabricationSchema;
    default:
      return GenericManufacturingSchema;
  }
}

// 根据行业 key 获取 System Prompt 中的工业描述
export function getIndustryContext(industry: IndustryKey): string {
  const contexts: Record<IndustryKey, string> = {
    cnc: "precision CNC machining and custom metal parts manufacturing",
    medical: "medical device and healthcare product manufacturing",
    electronics: "consumer electronics and PCB assembly manufacturing",
    metal_fab: "metal fabrication, sheet metal, and structural steel manufacturing",
    generic: "industrial manufacturing and component production",
  };
  return contexts[industry] ?? contexts.generic;
}

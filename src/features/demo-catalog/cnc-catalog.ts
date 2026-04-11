import type { DefaultFieldKey } from "@/db/seed/default-field-defs";
import type {
  SeedCategory,
  SeedCustomField,
  SeedProduct,
  SeedProductFieldValue,
} from "@/db/seed/types";

export type CncImageVariant = "catalog" | "scene";

type ShapeKind =
  | "bracket"
  | "shaft"
  | "housing"
  | "flange"
  | "connector"
  | "bushing"
  | "heatsink"
  | "block"
  | "endcap"
  | "sensor-mount";

type MaterialTone = "silver" | "steel" | "graphite" | "brass" | "anodized";

type ProductSpec = {
  slug: string;
  categorySlug: string;
  nameZh: string;
  nameEn: string;
  shortDescriptionZh: string;
  shortDescriptionEn: string;
  detailLeadZh: string;
  detailLeadEn: string;
  model: string;
  materialZh: string;
  materialEn: string;
  processZh: string;
  processEn: string;
  sizeZh: string;
  sizeEn: string;
  tolerance: string;
  surfaceTreatmentZh: string;
  surfaceTreatmentEn: string;
  colorZh: string;
  colorEn: string;
  applicationZh: string;
  applicationEn: string;
  moq: string;
  sampleLeadTime: string;
  leadTime: string;
  packagingZh: string;
  packagingEn: string;
  placeOfOriginZh: string;
  placeOfOriginEn: string;
  supplyAbilityZh: string;
  supplyAbilityEn: string;
  certification: string;
  customFields: SeedCustomField[];
  shape: ShapeKind;
  tone: MaterialTone;
  sceneAccent: string;
  sortOrder: number;
  isFeatured: boolean;
};

const companyNameEn = "Precision CNC Components Co., Ltd.";

const categorySpecs: SeedCategory[] = [
  {
    nameZh: "铝加工零件",
    nameEn: "Aluminum Machining Parts",
    slug: "aluminum-machining-parts",
    summaryZh: "适用于轻量化支架、外壳、散热件和精密夹具。",
    summaryEn:
      "Ideal for lightweight brackets, housings, thermal parts, and precision fixtures.",
    sortOrder: 10,
    isFeatured: true,
  },
  {
    nameZh: "不锈钢组件",
    nameEn: "Stainless Steel Components",
    slug: "stainless-steel-components",
    summaryZh: "适用于工业系统中的耐腐蚀、高强度组件。",
    summaryEn:
      "Suitable for corrosion-resistant, high-strength components in industrial systems.",
    sortOrder: 20,
    isFeatured: true,
  },
  {
    nameZh: "精密车削零件",
    nameEn: "Precision Turning Parts",
    slug: "precision-turning-parts",
    summaryZh: "用于轴、连接器、衬套和其他高公差车削零件。",
    summaryEn:
      "Built for shafts, connectors, bushings, and other tight-tolerance turned parts.",
    sortOrder: 30,
    isFeatured: true,
  },
];

function makeField(valueZh: string, valueEn: string, visible = true): SeedProductFieldValue {
  return {
    valueZh,
    valueEn,
    visible,
  };
}

function buildDefaultFields(
  spec: ProductSpec,
): Partial<Record<DefaultFieldKey, SeedProductFieldValue>> {
  return {
    model: makeField(spec.model, spec.model),
    material: makeField(spec.materialZh, spec.materialEn),
    process: makeField(spec.processZh, spec.processEn),
    size: makeField(spec.sizeZh, spec.sizeEn),
    tolerance: makeField(spec.tolerance, spec.tolerance),
    surface_treatment: makeField(spec.surfaceTreatmentZh, spec.surfaceTreatmentEn),
    color: makeField(spec.colorZh, spec.colorEn),
    application: makeField(spec.applicationZh, spec.applicationEn),
    moq: makeField(spec.moq, spec.moq),
    sample_lead_time: makeField(spec.sampleLeadTime, spec.sampleLeadTime),
    lead_time: makeField(spec.leadTime, spec.leadTime),
    packaging: makeField(spec.packagingZh, spec.packagingEn),
    place_of_origin: makeField(spec.placeOfOriginZh, spec.placeOfOriginEn),
    supply_ability: makeField(spec.supplyAbilityZh, spec.supplyAbilityEn),
    certification: makeField(spec.certification, spec.certification),
  };
}

function buildDetails(spec: ProductSpec, language: "zh" | "en") {
  if (language === "zh") {
    return [
      spec.detailLeadZh,
      `采用 ${spec.processZh} 工艺，使用 ${spec.materialZh}，标准公差 ${spec.tolerance}。`,
      `典型应用包括 ${spec.applicationZh}，量产周期 ${spec.leadTime}，样品周期 ${spec.sampleLeadTime}。`,
    ].join("\n\n");
  }

  return [
    spec.detailLeadEn,
    `Produced with ${spec.processEn} using ${spec.materialEn}, this part keeps a standard tolerance of ${spec.tolerance}.`,
    `Typical applications include ${spec.applicationEn.toLowerCase()}, with ${spec.leadTime} lead time for production and ${spec.sampleLeadTime} for sampling.`,
  ].join("\n\n");
}

function buildSeoTitle(spec: ProductSpec) {
  return `${spec.nameEn} Manufacturer | ${companyNameEn}`;
}

function buildSeoDescription(spec: ProductSpec) {
  return `Source ${spec.nameEn.toLowerCase()} with ${spec.materialEn.toLowerCase()}, ${spec.processEn.toLowerCase()}, and export-ready quality control from ${companyNameEn}.`;
}

function cloneCustomFields(fields: SeedCustomField[]) {
  return fields.map((field) => ({ ...field }));
}

const productSpecs: ProductSpec[] = [
  {
    slug: "custom-aluminum-cnc-bracket",
    categorySlug: "aluminum-machining-parts",
    nameZh: "定制铝合金 CNC 支架",
    nameEn: "Custom Aluminum CNC Bracket",
    shortDescriptionZh: "用于自动化框架和机器人装配的轻量化精密支架。",
    shortDescriptionEn:
      "A lightweight precision bracket for automation frames and robotic assemblies.",
    detailLeadZh: "该支架专为需要低重量和稳定安装精度的自动化项目设计。",
    detailLeadEn:
      "This bracket is designed for automation projects that need low weight and stable mounting accuracy.",
    model: "CNC-BR-001",
    materialZh: "6061 铝合金",
    materialEn: "Aluminum 6061",
    processZh: "CNC 铣削",
    processEn: "CNC Milling",
    sizeZh: "按图纸定制",
    sizeEn: "Custom per drawing",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "阳极氧化",
    surfaceTreatmentEn: "Anodizing",
    colorZh: "银色 / 黑色",
    colorEn: "Silver / Black",
    applicationZh: "机器人支架、自动化夹具和传送带模块",
    applicationEn: "robot brackets, automation fixtures, and conveyor modules",
    moq: "100 pcs",
    sampleLeadTime: "5-7 days",
    leadTime: "15-20 days",
    packagingZh: "防护袋 + 出口纸箱",
    packagingEn: "Protective bag + export carton",
    placeOfOriginZh: "中国东莞",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 50,000 件",
    supplyAbilityEn: "50,000 pcs per month",
    certification: "ISO 9001",
    customFields: [
      { labelZh: "硬度", labelEn: "Hardness", valueZh: "HB 95", valueEn: "HB 95", visible: true, sortOrder: 10 },
      { labelZh: "检测方式", labelEn: "Inspection", valueZh: "CMM 全检", valueEn: "Full CMM inspection", visible: true, sortOrder: 20 },
    ],
    shape: "bracket",
    tone: "anodized",
    sceneAccent: "#2dd4bf",
    sortOrder: 10,
    isFeatured: true,
  },
  {
    slug: "precision-steel-drive-shaft",
    categorySlug: "precision-turning-parts",
    nameZh: "精密钢制传动轴",
    nameEn: "Precision Steel Drive Shaft",
    shortDescriptionZh: "适用于工业传动系统的高同心度轴类零件。",
    shortDescriptionEn:
      "A high-concentricity shaft component for industrial transmission systems.",
    detailLeadZh: "该传动轴常用于需要长时间稳定运行的电动驱动组件。",
    detailLeadEn:
      "This shaft is commonly used in motorized drive assemblies that require long, stable operation.",
    model: "SHAFT-018",
    materialZh: "SUS 304 / 42CrMo",
    materialEn: "SUS 304 / 42CrMo",
    processZh: "CNC 车削 + 磨削",
    processEn: "CNC Turning + Grinding",
    sizeZh: "直径 18-42 mm",
    sizeEn: "Diameter 18-42 mm",
    tolerance: "+/-0.005 mm",
    surfaceTreatmentZh: "抛光 / 发黑",
    surfaceTreatmentEn: "Polishing / Black Oxide",
    colorZh: "金属原色",
    colorEn: "Metallic",
    applicationZh: "工业变速箱、电机驱动和包装设备",
    applicationEn: "industrial gearboxes, motor drives, and packaging equipment",
    moq: "200 pcs",
    sampleLeadTime: "7 days",
    leadTime: "18 days",
    packagingZh: "防锈油 + 泡棉 + 出口木箱",
    packagingEn: "Anti-rust oil + foam + export case",
    placeOfOriginZh: "中国东莞",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 30,000 件",
    supplyAbilityEn: "30,000 pcs per month",
    certification: "ISO 9001 / RoHS",
    customFields: [
      { labelZh: "同心度", labelEn: "Concentricity", valueZh: "0.01 mm", valueEn: "0.01 mm", visible: true, sortOrder: 10 },
      { labelZh: "热处理", labelEn: "Heat Treatment", valueZh: "可选感应淬火", valueEn: "Optional induction hardening", visible: true, sortOrder: 20 },
    ],
    shape: "shaft",
    tone: "steel",
    sceneAccent: "#38bdf8",
    sortOrder: 20,
    isFeatured: true,
  },
  {
    slug: "cnc-machined-housing",
    categorySlug: "aluminum-machining-parts",
    nameZh: "CNC 精密加工壳体",

    nameEn: "CNC Machined Housing",
    shortDescriptionZh: "适用于控制器、传感器与工业终端的定制屏蔽件，铝合金定制铣削。",

    shortDescriptionEn:
      "A custom enclosure part for controllers, sensors, and industrial terminals.",
    detailLeadZh: "适用于对外观、安装孔精度及散热性能有要求的电子屏蔽壳体。",

    detailLeadEn:
      "Built for electronic enclosures that require clean appearance, accurate mounting holes, and stable thermal performance.",
    model: "HSG-220",
    materialZh: "6063 铝合金",

    materialEn: "Aluminum 6063",
    processZh: "CNC 铣削 + 攻丝",

    processEn: "CNC Milling + Tapping",
    sizeZh: "220 x 145 x 68 mm",
    sizeEn: "220 x 145 x 68 mm",
    tolerance: "+/-0.02 mm",
    surfaceTreatmentZh: "喷砂阳极氧化",

    surfaceTreatmentEn: "Sandblasted Anodizing",
    colorZh: "黑色 / 深灰",

    colorEn: "Black / Dark Gray",
    applicationZh: "控制器壳体、工业网关及传感器模块封装件",

    applicationEn: "controller housings, industrial gateways, and sensor modules",
    moq: "80 pcs",
    sampleLeadTime: "6 days",
    leadTime: "16-22 days",
    packagingZh: "泡棉隔板 + 出口纸箱",

    packagingEn: "Foam divider + export carton",
    placeOfOriginZh: "中国东莞",

    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 20,000 件",

    supplyAbilityEn: "20,000 pcs per month",
    certification: "ISO 9001",
    customFields: [
      { labelZh: "防护等级", labelEn: "Protection Rating", valueZh: "可选 IP54 密封", valueEn: "Optional IP54 sealing", visible: true, sortOrder: 10 },
      { labelZh: "螺纹标准", labelEn: "Thread Standard", valueZh: "M3 / M4", valueEn: "M3 / M4", visible: true, sortOrder: 20 },
    ],
    shape: "housing",
    tone: "graphite",
    sceneAccent: "#f97316",
    sortOrder: 30,
    isFeatured: true,
  },
  {
    slug: "stainless-steel-flange-plate",
    categorySlug: "stainless-steel-components",
    nameZh: "不锈钢法兰盘",

    nameEn: "Stainless Steel Flange Plate",
    shortDescriptionZh: "适用于流体设备与安装系统的高强度法兰盘。",

    shortDescriptionEn:
      "A high-strength flange plate for fluid equipment and mounting systems.",
    detailLeadZh: "适用于泵体、阀门组件、过滤设备及管道安装系统。",

    detailLeadEn:
      "Suitable for pumps, valve assemblies, filtration equipment, and pipeline mounting systems.",
    model: "FLG-316-12",
    materialZh: "SUS 316L",
    materialEn: "SUS 316L",
    processZh: "CNC 铣削 + 倒角",

    processEn: "CNC Milling + Chamfering",
    sizeZh: "180 x 180 x 12 mm",
    sizeEn: "180 x 180 x 12 mm",
    tolerance: "+/-0.02 mm",
    surfaceTreatmentZh: "钝化处理",

    surfaceTreatmentEn: "Passivation",
    colorZh: "金属原色",

    colorEn: "Metallic",
    applicationZh: "泵体系统、过滤器安装及食品加工设备",

    applicationEn: "pump systems, filter mounting, and food-processing equipment",
    moq: "120 pcs",
    sampleLeadTime: "7 days",
    leadTime: "18-24 days",
    packagingZh: "保护膜 + 分格纸箱",

    packagingEn: "Protective film + divided carton",
    placeOfOriginZh: "中国东莞",

    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 18,000 件",

    supplyAbilityEn: "18,000 pcs per month",
    certification: "ISO 9001 / FDA material compliance",
    customFields: [
      { labelZh: "平面度", labelEn: "Flatness", valueZh: "0.03 mm", valueEn: "0.03 mm", visible: true, sortOrder: 10 },
      { labelZh: "盐雾测试", labelEn: "Salt Spray", valueZh: "96 小时", valueEn: "96 hours", visible: true, sortOrder: 20 },
    ],
    shape: "flange",
    tone: "steel",
    sceneAccent: "#22c55e",
    sortOrder: 40,
    isFeatured: false,
  },
  {
    slug: "brass-threaded-connector",
    categorySlug: "precision-turning-parts",
    nameZh: "黄铜螺纹接头",

    nameEn: "Brass Threaded Connector",
    shortDescriptionZh: "适用于流体、电气和仪表系统的精密螺纹接头。",

    shortDescriptionEn:
      "A precision threaded connector for fluid, electrical, and instrumentation systems.",
    detailLeadZh: "专为需要导电性、密封稳定性和精确螺纹的连接点设计。",

    detailLeadEn:
      "Designed for connection points that require conductivity, sealing stability, and accurate threads.",
    model: "BRC-M12",
    materialZh: "H59 黄铜",

    materialEn: "Brass H59",
    processZh: "CNC 车削 + 滚花",

    processEn: "CNC Turning + Knurling",
    sizeZh: "M12 / M16 / M20",
    sizeEn: "M12 / M16 / M20",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "镀镍",

    surfaceTreatmentEn: "Nickel Plating",
    colorZh: "银色",

    colorEn: "Silver",
    applicationZh: "气动接头、仪表连接件和电气零件",

    applicationEn: "pneumatic fittings, instrumentation connectors, and electrical parts",
    moq: "500 pcs",
    sampleLeadTime: "4-5 days",
    leadTime: "12-18 days",
    packagingZh: "PE 袋 + 标签盒",

    packagingEn: "PE bag + labeled box",
    placeOfOriginZh: "中国东莞",

    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 80,000 件",

    supplyAbilityEn: "80,000 pcs per month",
    certification: "RoHS",
    customFields: [
      { labelZh: "螺纹标准", labelEn: "Thread Standard", valueZh: "Metric / BSP", valueEn: "Metric / BSP", visible: true, sortOrder: 10 },

      { labelZh: "表面粗糙度", labelEn: "Surface Roughness", valueZh: "Ra 0.8", valueEn: "Ra 0.8", visible: true, sortOrder: 20 },
    ],
    shape: "connector",
    tone: "brass",
    sceneAccent: "#eab308",
    sortOrder: 50,
    isFeatured: false,
  },
  {
    slug: "cnc-turning-bushing",
    categorySlug: "precision-turning-parts",
    nameZh: "CNC 车削套筒",

    nameEn: "CNC Turning Bushing",
    shortDescriptionZh: "用于旋转导向、对中和阻尼组件的高精度套筒。",

    shortDescriptionEn:
      "A high-precision bushing for rotary guidance, alignment, and damping assemblies.",
    detailLeadZh: "该套筒支持尺寸稳定性和光滑表面质量要求较高的往复运动应用场景。",

    detailLeadEn:
      "This bushing supports repeated motion applications where dimensional stability and smooth finish matter.",
    model: "BSH-028",
    materialZh: "SUS 303 / C45",
    materialEn: "SUS 303 / C45",
    processZh: "CNC 车削",

    processEn: "CNC Turning",
    sizeZh: "外径 28 mm",

    sizeEn: "Outer diameter 28 mm",
    tolerance: "+/-0.008 mm",
    surfaceTreatmentZh: "去毛刺 + 抛光",

    surfaceTreatmentEn: "Deburring + Polishing",
    colorZh: "金属原色",

    colorEn: "Metallic",
    applicationZh: "轴承座、滑动系统和包装机械",

    applicationEn: "bearing seats, sliding systems, and packaging machinery",
    moq: "300 pcs",
    sampleLeadTime: "5 days",
    leadTime: "14-18 days",
    packagingZh: "防锈袋 + 出口纸箱",

    packagingEn: "Anti-rust bag + export carton",
    placeOfOriginZh: "中国东莞",

    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 60,000 件",

    supplyAbilityEn: "60,000 pcs per month",
    certification: "ISO 9001",
    customFields: [
      { labelZh: "圆度", labelEn: "Roundness", valueZh: "0.005 mm", valueEn: "0.005 mm", visible: true, sortOrder: 10 },

      { labelZh: "气检验收", labelEn: "Inspection", valueZh: "气规检测", valueEn: "Air gauge inspection", visible: true, sortOrder: 20 },

    ],
    shape: "bushing",
    tone: "steel",
    sceneAccent: "#a855f7",
    sortOrder: 60,
    isFeatured: false,
  },
  {
    slug: "aluminum-heat-sink-base",
    categorySlug: "aluminum-machining-parts",
    nameZh: "铝合金散热基板",

    nameEn: "Aluminum Heat Sink Base",
    shortDescriptionZh: "用于功率器件和热管理模块的高导热铝合金散热基板。",

    shortDescriptionEn:
      "A precision heat sink base for power modules and control systems.",
    detailLeadZh: "适用于高功率密度模块，要求表面平整度和导热接触面精度的场合。",

    detailLeadEn:
      "Developed for electronic assemblies that need both heat dissipation and accurate mounting geometry.",
    model: "HSB-160",
    materialZh: "6061-T6 铝合金",

    materialEn: "Aluminum 6061-T6",
    processZh: "CNC 铣削 + 精磨",

    processEn: "CNC Milling + Slotting",
    sizeZh: "160 x 90 x 18 mm",
    sizeEn: "160 x 90 x 18 mm",
    tolerance: "+/-0.02 mm",
    surfaceTreatmentZh: "阳极氧化",

    surfaceTreatmentEn: "Sandblasted Anodizing",
    colorZh: "黑色 / 银色",

    colorEn: "Black / Silver",
    applicationZh: "电源模块、IGBT 散热底板和工业变频器",

    applicationEn: "inverters, power modules, and industrial controllers",
    moq: "150 pcs",
    sampleLeadTime: "5 days",
    leadTime: "15-18 days",
    packagingZh: "珍珠棉袋 + 出口纸箱",

    packagingEn: "Individual divider + export carton",
    placeOfOriginZh: "中国东莞",

    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 40,000 件",

    supplyAbilityEn: "40,000 pcs per month",
    certification: "RoHS",
    customFields: [
      { labelZh: "散热优先级", labelEn: "Thermal Requirement", valueZh: "优先保证平面贴合导热", valueEn: "Priority on flat thermal contact", visible: true, sortOrder: 10 },

      { labelZh: "翅片间距", labelEn: "Fin Pitch", valueZh: "3.5 mm", valueEn: "3.5 mm", visible: true, sortOrder: 20 },
    ],
    shape: "heatsink",
    tone: "anodized",
    sceneAccent: "#06b6d4",
    sortOrder: 70,
    isFeatured: false,
  },
  {
    slug: "precision-mounting-block",
    categorySlug: "aluminum-machining-parts",
    nameZh: "精密铣削安装块",

    nameEn: "Precision Mounting Block",
    shortDescriptionZh: "用于结构支撑与设备安装的高强度铝合金精密铣削块。",

    shortDescriptionEn:
      "A precision mounting block for automation tooling and reference positioning.",
    detailLeadZh: "适用于需要高刚性、重复定位精度和多面加工的安装基座应用。",

    detailLeadEn:
      "Built for repeated-position assemblies such as fixtures, motion slides, and vision systems.",
    model: "MBL-064",
    materialZh: "7075 铝合金",

    materialEn: "Aluminum 7075",
    processZh: "CNC 铣削 + 钻孔",

    processEn: "CNC Milling + Drilling",
    sizeZh: "64 x 64 x 28 mm",
    sizeEn: "64 x 64 x 28 mm",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "硬质阳极氧化",

    surfaceTreatmentEn: "Hard Anodizing",
    colorZh: "黑色",

    colorEn: "Black",
    applicationZh: "机器人结构件、精密夹具和自动化设备安装基座",

    applicationEn: "automation fixtures, linear slide mounts, and vision camera bases",
    moq: "100 pcs",
    sampleLeadTime: "4-6 days",
    leadTime: "12-16 days",
    packagingZh: "泡棉袋 + 木箱",

    packagingEn: "Protective film + divided box",
    placeOfOriginZh: "中国东莞",

    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 35,000 件",

    supplyAbilityEn: "35,000 pcs per month",
    certification: "ISO 9001",
    customFields: [
      { labelZh: "垂直度", labelEn: "Perpendicularity", valueZh: "0.01 mm", valueEn: "0.01 mm", visible: true, sortOrder: 10 },
      { labelZh: "表面粗糙度", labelEn: "Surface Roughness", valueZh: "Ra 1.6", valueEn: "Ra 1.6", visible: true, sortOrder: 20 },

    ],
    shape: "block",
    tone: "graphite",
    sceneAccent: "#84cc16",
    sortOrder: 80,
    isFeatured: false,
  },
  {
    slug: "cnc-motor-end-cap",
    categorySlug: "stainless-steel-components",
    nameZh: "CNC 车削主轴套",

    nameEn: "CNC Motor End Cap",
    shortDescriptionZh: "用于主轴、滚珠丝杠和直线导轨系统的高精度套管。",

    shortDescriptionEn:
      "A precision end cap for servo motors and industrial drive units.",
    detailLeadZh: "适用于需要同轴度、内孔光洁度和精确配合公差的传动部件应用。",

    detailLeadEn:
      "Focused on bearing-seat accuracy, hole consistency, and stable mass-production repeatability.",
    model: "MEC-102",
    materialZh: "SUS 304 / 铝合金",

    materialEn: "SUS 304 / Aluminum",
    processZh: "CNC 车铣复合加工",

    processEn: "Turn-Mill Machining",
    sizeZh: "内径 102 mm",

    sizeEn: "Diameter 102 mm",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "阳极氧化 / 抛光",

    surfaceTreatmentEn: "Bead Blasting / Polishing",
    colorZh: "金属原色",

    colorEn: "Metallic",
    applicationZh: "主轴系统、线性传动和工业机器人关节",

    applicationEn: "servo motors, drive units, and blower assemblies",
    moq: "120 pcs",
    sampleLeadTime: "6 days",
    leadTime: "15-20 days",
    packagingZh: "防锈袋 + 海绵托盘",

    packagingEn: "Anti-rust bag + layered carton",
    placeOfOriginZh: "中国东莞",

    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 25,000 件",

    supplyAbilityEn: "25,000 pcs per month",
    certification: "ISO 9001",
    customFields: [
      { labelZh: "轴承孔公差", labelEn: "Bearing Seat Tolerance", valueZh: "H7", valueEn: "H7", visible: true, sortOrder: 10 },

      { labelZh: "检测方式", labelEn: "Inspection", valueZh: "CMM + 通止规", valueEn: "CMM + go/no-go gauge", visible: true, sortOrder: 20 },
    ],
    shape: "endcap",
    tone: "steel",
    sceneAccent: "#ef4444",
    sortOrder: 90,
    isFeatured: false,
  },
  {
    slug: "custom-sensor-mount",
    categorySlug: "aluminum-machining-parts",
    nameZh: "精密铣削电机端盖",

    nameEn: "Custom Sensor Mount",
    shortDescriptionZh: "适用于精密电机和编码器的 CNC 铣削铝合金端盖。",

    shortDescriptionEn:
      "A stable mounting base for vision, sensing, and positioning systems.",
    detailLeadZh: "适用于电机壳体封装、编码器安装及轴承支撑的高精度端盖。",

    detailLeadEn:
      "Ideal for sensor support projects that need compact structure, low weight, and quick sampling.",
    model: "SMT-045",
    materialZh: "6061 铝合金",

    materialEn: "Aluminum 6061",
    processZh: "CNC 铣削 + 精磨",

    processEn: "CNC Milling + Tapping",
    sizeZh: "45 x 38 x 22 mm",
    sizeEn: "45 x 38 x 22 mm",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "黑色阳极氧化",

    surfaceTreatmentEn: "Black Anodizing",
    colorZh: "黑色",

    colorEn: "Black",
    applicationZh: "精密电机端盖、编码器支架和轴承座",

    applicationEn: "vision sensors, photoelectric inspection, and positioning assemblies",
    moq: "200 pcs",
    sampleLeadTime: "3-5 days",
    leadTime: "10-15 days",
    packagingZh: "珍珠棉袋 + 出口纸箱",

    packagingEn: "Individual small bag + export carton",
    placeOfOriginZh: "中国东莞",

    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "每月 70,000 件",

    supplyAbilityEn: "70,000 pcs per month",
    certification: "RoHS",
    customFields: [
      { labelZh: "安装方式", labelEn: "Mounting Method", valueZh: "侧装 / 顶装", valueEn: "Side mount / top mount", visible: true, sortOrder: 10 },
      { labelZh: "重量", labelEn: "Weight", valueZh: "58 g", valueEn: "58 g", visible: true, sortOrder: 20 },
    ],
    shape: "sensor-mount",
    tone: "anodized",
    sceneAccent: "#14b8a6",
    sortOrder: 100,
    isFeatured: false,
  },
];

const productSpecMap = new Map(productSpecs.map((spec) => [spec.slug, spec]));

function buildSeedProduct(spec: ProductSpec): SeedProduct {
  return {
    nameZh: spec.nameZh,
    nameEn: spec.nameEn,
    slug: spec.slug,
    categorySlug: spec.categorySlug,
    shortDescriptionZh: spec.shortDescriptionZh,
    shortDescriptionEn: spec.shortDescriptionEn,
    detailsZh: buildDetails(spec, "zh"),
    detailsEn: buildDetails(spec, "en"),
    seoTitle: buildSeoTitle(spec),
    seoDescription: buildSeoDescription(spec),
    sortOrder: spec.sortOrder,
    isFeatured: spec.isFeatured,
    defaultFields: buildDefaultFields(spec),
    customFields: cloneCustomFields(spec.customFields),
  };
}

export function buildCncDemoCategories() {
  return categorySpecs.map((item) => ({ ...item }));
}

export function buildCncDemoProducts() {
  return productSpecs.map((spec) => buildSeedProduct(spec));
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function tonePalette(tone: MaterialTone) {
  switch (tone) {
    case "steel":
      return { primary: "#d6dde6", secondary: "#8192a8", accent: "#3f4f62" };
    case "graphite":
      return { primary: "#6b7280", secondary: "#374151", accent: "#111827" };
    case "brass":
      return { primary: "#f6d36a", secondary: "#d29b18", accent: "#7c5510" };
    case "anodized":
      return { primary: "#778da9", secondary: "#415a77", accent: "#1b263b" };
    case "silver":
    default:
      return { primary: "#eef2f7", secondary: "#b6c0cf", accent: "#64748b" };
  }
}

function renderShape(spec: ProductSpec, variant: CncImageVariant) {
  const palette = tonePalette(spec.tone);
  const shadowOpacity = variant === "catalog" ? "0.18" : "0.32";

  switch (spec.shape) {
    case "bracket":
      return `
        <ellipse cx="800" cy="820" rx="260" ry="48" fill="#0f172a" opacity="${shadowOpacity}" />
        <g>
          <rect x="585" y="420" width="210" height="250" rx="28" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="10" />
          <rect x="735" y="520" width="290" height="150" rx="28" fill="${palette.secondary}" stroke="${palette.accent}" stroke-width="10" />
          <circle cx="665" cy="510" r="26" fill="#ffffff" opacity="0.95" />
          <circle cx="900" cy="595" r="24" fill="#ffffff" opacity="0.9" />
        </g>
      `;
    case "shaft":
      return `
        <ellipse cx="800" cy="820" rx="280" ry="44" fill="#0f172a" opacity="${shadowOpacity}" />
        <g transform="rotate(-12 800 600)">
          <rect x="430" y="560" width="740" height="90" rx="42" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="8" />
          <rect x="430" y="578" width="110" height="54" rx="22" fill="${palette.secondary}" />
          <rect x="1060" y="578" width="110" height="54" rx="22" fill="${palette.secondary}" />
          <circle cx="555" cy="605" r="24" fill="${palette.accent}" opacity="0.3" />
          <circle cx="1045" cy="605" r="24" fill="${palette.accent}" opacity="0.3" />
        </g>
      `;
    case "housing":
      return `
        <ellipse cx="800" cy="835" rx="290" ry="46" fill="#0f172a" opacity="${shadowOpacity}" />
        <g>
          <rect x="510" y="420" width="580" height="280" rx="42" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="10" />
          <rect x="580" y="480" width="440" height="120" rx="26" fill="${palette.secondary}" opacity="0.8" />
          <circle cx="635" cy="555" r="22" fill="#ffffff" opacity="0.92" />
          <circle cx="965" cy="555" r="22" fill="#ffffff" opacity="0.92" />
        </g>
      `;
    case "flange":
      return `
        <ellipse cx="800" cy="840" rx="250" ry="40" fill="#0f172a" opacity="${shadowOpacity}" />
        <g>
          <circle cx="800" cy="575" r="185" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="10" />
          <circle cx="800" cy="575" r="82" fill="${variant === "catalog" ? "#ffffff" : "#e2e8f0"}" stroke="${palette.secondary}" stroke-width="10" />
          <circle cx="680" cy="470" r="20" fill="${palette.secondary}" />
          <circle cx="920" cy="470" r="20" fill="${palette.secondary}" />
          <circle cx="680" cy="680" r="20" fill="${palette.secondary}" />
          <circle cx="920" cy="680" r="20" fill="${palette.secondary}" />
        </g>
      `;
    case "connector":
      return `
        <ellipse cx="800" cy="830" rx="230" ry="40" fill="#0f172a" opacity="${shadowOpacity}" />
        <g>
          <rect x="525" y="520" width="420" height="130" rx="38" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="8" />
          <rect x="935" y="545" width="140" height="82" rx="18" fill="${palette.secondary}" stroke="${palette.accent}" stroke-width="8" />
          <path d="M555 520 L555 650 M595 520 L595 650 M635 520 L635 650" stroke="${palette.accent}" stroke-width="8" opacity="0.4" />
        </g>
      `;
    case "bushing":
      return `
        <ellipse cx="800" cy="830" rx="215" ry="36" fill="#0f172a" opacity="${shadowOpacity}" />
        <g>
          <circle cx="800" cy="585" r="150" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="10" />
          <circle cx="800" cy="585" r="80" fill="${variant === "catalog" ? "#ffffff" : "#cbd5e1"}" stroke="${palette.secondary}" stroke-width="10" />
          <ellipse cx="800" cy="585" rx="145" ry="52" fill="${palette.secondary}" opacity="0.25" />
        </g>
      `;
    case "heatsink":
      return `
        <ellipse cx="800" cy="835" rx="275" ry="42" fill="#0f172a" opacity="${shadowOpacity}" />
        <g>
          <rect x="500" y="560" width="600" height="120" rx="18" fill="${palette.secondary}" stroke="${palette.accent}" stroke-width="8" />
          <path d="M560 420 L560 560 M635 420 L635 560 M710 420 L710 560 M785 420 L785 560 M860 420 L860 560 M935 420 L935 560 M1010 420 L1010 560" stroke="${palette.primary}" stroke-width="32" stroke-linecap="round" />
        </g>
      `;
    case "block":
      return `
        <ellipse cx="800" cy="835" rx="220" ry="38" fill="#0f172a" opacity="${shadowOpacity}" />
        <g>
          <rect x="585" y="455" width="430" height="250" rx="24" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="10" />
          <rect x="655" y="520" width="290" height="120" rx="18" fill="${palette.secondary}" opacity="0.7" />
          <circle cx="680" cy="555" r="18" fill="#ffffff" opacity="0.92" />
          <circle cx="920" cy="555" r="18" fill="#ffffff" opacity="0.92" />
        </g>
      `;
    case "endcap":
      return `
        <ellipse cx="800" cy="840" rx="235" ry="40" fill="#0f172a" opacity="${shadowOpacity}" />
        <g>
          <circle cx="800" cy="585" r="165" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="10" />
          <circle cx="800" cy="585" r="95" fill="${palette.secondary}" opacity="0.6" />
          <circle cx="800" cy="585" r="48" fill="${variant === "catalog" ? "#ffffff" : "#dbeafe"}" />
          <circle cx="710" cy="505" r="16" fill="${palette.accent}" opacity="0.35" />
          <circle cx="890" cy="505" r="16" fill="${palette.accent}" opacity="0.35" />
        </g>
      `;
    case "sensor-mount":
    default:
      return `
        <ellipse cx="800" cy="830" rx="220" ry="38" fill="#0f172a" opacity="${shadowOpacity}" />
        <g>
          <rect x="600" y="515" width="320" height="130" rx="28" fill="${palette.secondary}" stroke="${palette.accent}" stroke-width="8" />
          <rect x="720" y="430" width="86" height="125" rx="24" fill="${palette.primary}" stroke="${palette.accent}" stroke-width="8" />
          <circle cx="762" cy="485" r="18" fill="#ffffff" opacity="0.95" />
        </g>
      `;
  }
}

export function buildCncProductImageSvg(product: SeedProduct, variant: CncImageVariant) {
  const spec = productSpecMap.get(product.slug);

  if (!spec) {
    throw new Error(`Unknown CNC demo product slug: ${product.slug}`);
  }

  const palette = tonePalette(spec.tone);
  const title = escapeXml(product.nameEn);
  const material = escapeXml(product.defaultFields.material?.valueEn ?? spec.materialEn);
  const process = escapeXml(product.defaultFields.process?.valueEn ?? spec.processEn);
  const application = escapeXml(
    product.defaultFields.application?.valueEn ?? spec.applicationEn,
  );

  if (variant === "catalog") {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200" role="img" aria-label="${title}">
  <rect width="1600" height="1200" fill="#f8fafc" />
  <rect x="80" y="80" width="1440" height="1040" rx="48" fill="#ffffff" stroke="#e2e8f0" stroke-width="4" />
  <text x="140" y="170" fill="#0f172a" font-family="Arial, sans-serif" font-size="56" font-weight="700">${title}</text>
  <text x="140" y="225" fill="#64748b" font-family="Arial, sans-serif" font-size="28">${escapeXml(companyNameEn)}</text>
  <text x="140" y="270" fill="#94a3b8" font-family="Arial, sans-serif" font-size="24">white catalog render</text>
  ${renderShape(spec, variant)}
  <rect x="1180" y="300" width="250" height="180" rx="24" fill="#f8fafc" stroke="#dbe4f0" />
  <text x="1210" y="360" fill="#0f172a" font-family="Arial, sans-serif" font-size="22" font-weight="700">Material</text>
  <text x="1210" y="400" fill="#475569" font-family="Arial, sans-serif" font-size="20">${material}</text>
  <text x="1210" y="455" fill="#0f172a" font-family="Arial, sans-serif" font-size="22" font-weight="700">Process</text>
  <text x="1210" y="495" fill="#475569" font-family="Arial, sans-serif" font-size="20">${process}</text>
  <rect x="140" y="980" width="1320" height="72" rx="20" fill="#f8fafc" stroke="#e2e8f0" />
  <text x="180" y="1027" fill="#334155" font-family="Arial, sans-serif" font-size="22">Demo catalog image generated for CNC showcase seeding</text>
</svg>`.trim();
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="scene-bg" x1="0%" x2="100%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="accent-bar" x1="0%" x2="100%" y1="0%" y2="0%">
      <stop offset="0%" stop-color="${spec.sceneAccent}" />
      <stop offset="100%" stop-color="${palette.secondary}" />
    </linearGradient>
  </defs>
  <rect width="1600" height="1200" fill="url(#scene-bg)" />
  <rect x="110" y="120" width="1380" height="960" rx="42" fill="#0b1120" stroke="#1f2937" stroke-width="4" />
  <rect x="180" y="260" width="280" height="560" rx="26" fill="#111827" />
  <rect x="1140" y="240" width="250" height="600" rx="26" fill="#111827" />
  <rect x="500" y="740" width="600" height="48" rx="20" fill="#1f2937" />
  <rect x="480" y="720" width="640" height="18" rx="9" fill="url(#accent-bar)" opacity="0.85" />
  ${renderShape(spec, variant)}
  <text x="170" y="190" fill="#f8fafc" font-family="Arial, sans-serif" font-size="54" font-weight="700">${title}</text>
  <text x="170" y="242" fill="#94a3b8" font-family="Arial, sans-serif" font-size="24">${escapeXml(companyNameEn)}</text>
  <text x="170" y="280" fill="${spec.sceneAccent}" font-family="Arial, sans-serif" font-size="24">industrial machining scene</text>
  <rect x="170" y="870" width="1260" height="145" rx="22" fill="#0f172a" stroke="#233047" />
  <text x="210" y="928" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="24" font-weight="700">Application</text>
  <text x="210" y="970" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="21">${application}</text>
  <text x="210" y="1014" fill="#94a3b8" font-family="Arial, sans-serif" font-size="20">Material: ${material} | Process: ${process}</text>
</svg>`.trim();
}


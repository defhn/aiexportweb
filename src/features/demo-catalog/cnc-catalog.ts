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
    nameZh: "绮惧瘑杞﹀墛闆朵欢",
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
    nameZh: "閻庤鑹鹃崺妤呮煣濠靛棙鍊ら梺锟?CNC 闁衡偓椤栨稓浠",
    nameEn: "Custom Aluminum CNC Bracket",
    shortDescriptionZh: "闂傚牄鍨归幃婊堟嚊椤忓嫬袟闁告牗鐗為鏇熷緞閸パ勫闁哄牆鎼▍鎺撶閾忓湱娉㈤柡瀣濞堟垶娼繝姘闁告牗鐗滅花璺ㄢ偓闈涙閺侇噣寮搁煬娴嬪亾",
    shortDescriptionEn:
      "A lightweight precision bracket for automation frames and robotic assemblies.",
    detailLeadZh: "閺夆晜鐟﹂娆撳绩椤栨稓浠搁梺顐㈠€搁幃搴ㄦ閳ь剛鎲版担鎴掓唉闂佹彃绻愮€垫煡宕畝鈧彊閻庤淇洪ˉ濠囨煀瀹ュ洨缈遍幖杈惧濞堟垿鎳涢鍕楅柛鏍ㄧ墵閵嗗秹鎯勯琛″亾",
    detailLeadEn:
      "This bracket is designed for automation projects that need low weight and stable mounting accuracy.",
    model: "CNC-BR-001",
    materialZh: "6061 闂佺偓绻傞幃搴ㄦ煂",
    materialEn: "Aluminum 6061",
    processZh: "CNC 闂佹拝绲芥晶锟",
    processEn: "CNC Milling",
    sizeZh: "闁圭顦ù妯肩棯缁嬭法鏆伴柛锟",
    sizeEn: "Custom per drawing",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "闂傚啳娅曢悗顒€顫濊鐎碉拷",
    surfaceTreatmentEn: "Anodizing",
    colorZh: "闂佺偓鍎兼竟锟?/ 濮掓稒鍨兼竟锟",
    colorEn: "Silver / Black",
    applicationZh: "闁哄牆鎼▍鎺撶閻戞ɑ鏆滈柡瀣堪閳ь兛娴囬崵婊堝礉閵娿儱顕у鍓佹嚀閸欏潡濡存担椋庣倞闂侇偂鑳堕崵搴∥熼敍鍕煁",
    applicationEn: "robot brackets, automation fixtures, and conveyor modules",
    moq: "100 pcs",
    sampleLeadTime: "5-7 days",
    leadTime: "15-20 days",
    packagingZh: "闁告娲戝▎銏＄┍濠靛洤袘閻烇拷?+ 闁告垵鎼ぐ娑氱棯閸濄儺鍞",
    packagingEn: "Protective bag + export carton",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?50,000 濞达拷",
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
    nameZh: "缂侇喗鍎抽惁鎴︽煢閵忕姴鐓戝ù鑲╁Т婵晜娼",
    nameEn: "Precision Steel Drive Shaft",
    shortDescriptionZh: "闂侇偄鍊婚弫銈嗙鎼粹€茬矗濞戞挻鐭槐鍫曞礉閵娧囧厙缂備胶鍠撳▓鎴烆殗濡儤鍊遍弶鐐存綑鐎硅櫕娼€垫瓕顫﹂梻鍡樻构濞嗐垽濡",
    shortDescriptionEn:
      "A high-concentricity shaft component for industrial transmission systems.",
    detailLeadZh: "閻犲洢鍎撮柊杈╃尵鐠佹娊鐛撻柛婵呯閻栧爼鎮介妸銈囪壘闂傗偓閹稿孩鍩傞弶鈺冨仧閻㈢粯娼婚幇顖ｆ斀闁汇劌瀚弫鎼佸嫉閸濆嫭瀚插ù鑲╁Т婵晛螣閿涘嫮鐭嬮柕锟",
    detailLeadEn:
      "This shaft is commonly used in motorized drive assemblies that require long, stable operation.",
    model: "SHAFT-018",
    materialZh: "SUS 304 / 42CrMo",
    materialEn: "SUS 304 / 42CrMo",
    processZh: "CNC 閺夌儑绠戞晶锟?+ 缂侇喖澧介敍锟",
    processEn: "CNC Turning + Grinding",
    sizeZh: "闁烩晜娼欑欢锟?18-42 mm",
    sizeEn: "Diameter 18-42 mm",
    tolerance: "+/-0.005 mm",
    surfaceTreatmentZh: "闁硅埖绋戦崢锟?/ 闁告瑦鍨跨划锟",
    surfaceTreatmentEn: "Polishing / Black Oxide",
    colorZh: "闂佸弶鍨甸惈姗€寮甸鍐棌",
    colorEn: "Metallic",
    applicationZh: "鐎规悶鍎扮粭鐔煎礄韫囨稈鍋撻悢鍛婄皻闁靛棔鑳堕弫鎼佸嫉鏉炴壆鐐婇柛鏂诲妸閳ь兛绀佺€垫鎲楅崨閭﹀晭濠拷",
    applicationEn: "industrial gearboxes, motor drives, and packaging equipment",
    moq: "200 pcs",
    sampleLeadTime: "7 days",
    leadTime: "18 days",
    packagingZh: "闂傚啯鐓￠弨顒€鈻?+ 闁绘繂绉惰ぐ鏂课?+ 闁哄牄鍔庨锟",
    packagingEn: "Anti-rust oil + foam + export case",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?30,000 濞达拷",
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
    nameZh: "CNC 缂侇喗鍎抽惁鎴﹀礉閻樿弓绱ｅ鑸电墪閿涳拷",
    nameEn: "CNC Machined Housing",
    shortDescriptionZh: "闁烩偓鍔嬬花顒勫箳瑜嶉崺妤呭闯閵婏絺鍋撴担椋庣倞闁规壆鍠庡▍鎺楀椽鐏炴垝绱ｅ☉鎾存皑缁挾绮╅婊勭暠閻庤鑹鹃崺妤佸緞閺嵮嶇处濞寸姾缈伴埀锟",
    shortDescriptionEn:
      "A custom enclosure part for controllers, sensors, and industrial terminals.",
    detailLeadZh: "闂侇偄鍊搁幃搴ｂ偓鐢垫嚀椤﹁崵鎲撮崒妯峰亾娴ｇ瓔妫呴梺鏉跨Т閻＄喐鎷呭鍛闁轰緤绲块崕褰掑箑瑜戦崗姗€寮垫径搴矗婵懓鍊诲▓鎴︽偨闂堟稓鎽嶉悹浣瑰劤椤︻剚寰勯弽褝绱﹀銈呮贡濞蹭即濡",
    detailLeadEn:
      "Built for electronic enclosures that require clean appearance, accurate mounting holes, and stable thermal performance.",
    model: "HSG-220",
    materialZh: "6063 闂佺偓绻傞幃搴ㄦ煂",
    materialEn: "Aluminum 6063",
    processZh: "CNC 闂佹拝绲芥晶锟?+ 闁衡偓閼姐倕顫",
    processEn: "CNC Milling + Tapping",
    sizeZh: "220 x 145 x 68 mm",
    sizeEn: "220 x 145 x 68 mm",
    tolerance: "+/-0.02 mm",
    surfaceTreatmentZh: "闁哥娀顥撻悥鐐烘⒓閾忣偆鈧拷",
    surfaceTreatmentEn: "Sandblasted Anodizing",
    colorZh: "濮掓稒鍨兼竟锟?/ 婵烇綀浜导锟",
    colorEn: "Black / Dark Gray",
    applicationZh: "闁硅矇鍐ㄧ厬闁革絻鍔岄ˇ缁樼珶閻愯В鍋撴担闀愮矗濞戞挻姘ㄧ紞澶愬礂閻愯В鍋撴担椋庣倞闁规壆鍠愯啯闁革拷",
    applicationEn: "controller housings, industrial gateways, and sensor modules",
    moq: "80 pcs",
    sampleLeadTime: "6 days",
    leadTime: "16-22 days",
    packagingZh: "闁绘繂绉惰ぐ鏂课涙径鎰吘閻忥拷?+ 濠㈣埖鐗滈锟",
    packagingEn: "Foam divider + export carton",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?20,000 濞达拷",
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
    nameZh: "濞戞挸绉归弨顒勬煢閵忥紕銆婇柛蹇曞濠拷",
    nameEn: "Stainless Steel Flange Plate",
    shortDescriptionZh: "闂傚牄鍨归幃婊兠规担椋庣Ъ閻犱焦鍎抽ˇ顒勫椽鐏炵晫鏆旈悷浣告噽闁绱掗悢鐑樼暠濡ゅ倹锚瀹歌鲸鎯旈敂鐣屻€婇柛蹇斿缁绘盯骞掗妷锔界凡闁碉拷",
    shortDescriptionEn:
      "A high-strength flange plate for fluid equipment and mounting systems.",
    detailLeadZh: "闂侇偄鍊搁幃搴♀枖閻㈠憡顬婇柕鍡曟祰缁诲啫饪伴妶鍫晭濠㈣泛娲ら幏鎵不閿熺姳澹曢悗鐟邦槼椤ュ﹥銇勯崷顓熺獥闁汇劌瀚换娑㈠箳閵夈倗鐟㈤悗瑙勭煯缂嶅懘濡",
    detailLeadEn:
      "Suitable for pumps, valve assemblies, filtration equipment, and pipeline mounting systems.",
    model: "FLG-316-12",
    materialZh: "SUS 316L",
    materialEn: "SUS 316L",
    processZh: "CNC 闂佹拝绲芥晶锟?+ 闁稿﹥甯熼～锟",
    processEn: "CNC Milling + Chamfering",
    sizeZh: "180 x 180 x 12 mm",
    sizeEn: "180 x 180 x 12 mm",
    tolerance: "+/-0.02 mm",
    surfaceTreatmentZh: "闂佽姤绻傜€碉拷",
    surfaceTreatmentEn: "Passivation",
    colorZh: "闂佸弶鍨甸惈姗€寮甸鍐棌",
    colorEn: "Metallic",
    applicationZh: "婵炲鏁诲鍓у寲閼姐倗鍩犻柕鍡曟祰缁诲啫饪伴妶鍛彜閻庣懓顦抽ˉ濠囧Υ娓氣偓椤ャ倝宕担绛嬪晭濠拷",
    applicationEn: "pump systems, filter mounting, and food-processing equipment",
    moq: "120 pcs",
    sampleLeadTime: "7 days",
    leadTime: "18-24 days",
    packagingZh: "闂傚啯褰冮崺澶愭嚉?+ 闁告帒妫欓悧鍝ョ不",
    packagingEn: "Protective film + divided carton",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?18,000 濞达拷",
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
    nameZh: "濮掓稑瀚伴幗鎰版懚閾忚鐫忛弶鈺冨仦鐢瓨绂",
    nameEn: "Brass Threaded Connector",
    shortDescriptionZh: "闂侇偄鍊搁幃搴∶规担椋庣Ъ闁靛棔鑳堕弫绋款潩閺傛寧瀚插ù鐙€浜ｉ妴鍐寲閼姐倗鍩犻柣銊ュ缁ㄨ法鈧潧妫滈悘顏嗙棯绾懐绠鹃柟鎭掑劙濞嗐垽濡",
    shortDescriptionEn:
      "A precision threaded connector for fluid, electrical, and instrumentation systems.",
    detailLeadZh: "闂侇偄鍊搁幃搴ㄦ閳ь剛鎲版笟鈧悵顔锯偓浣冨亹閺佹悂骞€瑜嶉幏鎵矙閸愯尙鏆伴悗闈涙閻ㄦ繈骞€瑜戦崗姗€鎯冮崟顔剧闁规亽鍎卞┃鈧柡鍜佸灛閳э拷",
    detailLeadEn:
      "Designed for connection points that require conductivity, sealing stability, and accurate threads.",
    model: "BRC-M12",
    materialZh: "H59 濮掓稑瀚伴幗锟",
    materialEn: "Brass H59",
    processZh: "CNC 閺夌儑绠戞晶锟?+ 婵犲﹥淇烘慨锟",
    processEn: "CNC Turning + Knurling",
    sizeZh: "M12 / M16 / M20",
    sizeEn: "M12 / M16 / M20",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "闂傗偓閳ь剟姊",
    surfaceTreatmentEn: "Nickel Plating",
    colorZh: "闂佺偓鍎兼竟锟",
    colorEn: "Silver",
    applicationZh: "婵ɑ鏌ㄦ慨鈺呭箳閵夈儯浠堥柕鍡曟閸楀海鎮伴妸銊х闁规亽鍎埀顑胯兌閺佺顫濋弮鍫濆姤濞达拷",
    applicationEn: "pneumatic fittings, instrumentation connectors, and electrical parts",
    moq: "500 pcs",
    sampleLeadTime: "4-5 days",
    leadTime: "12-18 days",
    packagingZh: "PE 閻烇拷?+ 闁哄秴娲ㄩ鐑芥儎",
    packagingEn: "PE bag + labeled box",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?80,000 濞达拷",
    supplyAbilityEn: "80,000 pcs per month",
    certification: "RoHS",
    customFields: [
      { labelZh: "闁炬槒娅ｅЧ妤呭冀閸パ冩珯", labelEn: "Thread Standard", valueZh: "Metric / BSP", valueEn: "Metric / BSP", visible: true, sortOrder: 10 },
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
    nameZh: "CNC 閺夌儑绠戞晶娑氭偘椤掆偓椤拷",
    nameEn: "CNC Turning Bushing",
    shortDescriptionZh: "闁烩偓鍔嬬花顒佹姜椤掆偓婵晠濡存担鍓插殼闁告碍鍨甸幏浼村礄韫囨柨鐩佺紓浣稿濞嗐垽鎯冮崟顖滃蒋缂侇喗鍎崇€瑰磭鎮伴鈧〃婊勭闊祴鍋",
    shortDescriptionEn:
      "A high-precision bushing for rotary guidance, alignment, and damping assemblies.",
    detailLeadZh: "閻犲洢鍎撮垾鏍ㄧ附濡ゅ應鍋撻崒姘€ら梻鈧幐搴㈠焸闂佹澘绉撮幃搴㈡交閹邦剙袟闁革妇鍎ゅ▍娆撴晬鐏炶棄绻侀悹瀣暙閺勫倻鈧潧鎽滆彊閻庤鑹鹃幏鎵偘閵娾晜妗ㄩ悹鎰╁姂閸ｆ椽濡",
    detailLeadEn:
      "This bushing supports repeated motion applications where dimensional stability and smooth finish matter.",
    model: "BSH-028",
    materialZh: "SUS 303 / C45",
    materialEn: "SUS 303 / C45",
    processZh: "CNC 閺夌儑绠戞晶锟",
    processEn: "CNC Turning",
    sizeZh: "濠㈣埖鐗曠欢锟?28 mm",
    sizeEn: "Outer diameter 28 mm",
    tolerance: "+/-0.008 mm",
    surfaceTreatmentZh: "闁告绮惁娲礆?+ 闁硅埖绋戦崢锟",
    surfaceTreatmentEn: "Deburring + Polishing",
    colorZh: "闂佸弶鍨甸惈姗€寮甸鍐棌",
    colorEn: "Metallic",
    applicationZh: "閺夌偛鐡ㄦ竟娆愭償瑜嬮埀顑跨劍缁箓宕濋妸锔界皻闁哄瀚ㄩ埀顑跨鐎垫鎲楅崨顔界皻婵拷",
    applicationEn: "bearing seats, sliding systems, and packaging machinery",
    moq: "300 pcs",
    sampleLeadTime: "5 days",
    leadTime: "14-18 days",
    packagingZh: "闂傚啯鐓￠弨顒傛偖?+ 闁告垵鎼ぐ娑氱棯閸濄儺鍞",
    packagingEn: "Anti-rust bag + export carton",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?60,000 濞达拷",
    supplyAbilityEn: "60,000 pcs per month",
    certification: "ISO 9001",
    customFields: [
      { labelZh: "闁革箑妫楃€癸拷", labelEn: "Roundness", valueZh: "0.005 mm", valueEn: "0.005 mm", visible: true, sortOrder: 10 },
      { labelZh: "检测方式", labelEn: "Inspection", valueZh: "气动量仪检测", valueEn: "Air gauge inspection", visible: true, sortOrder: 20 },
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
    nameZh: "闂佺偓绻傞幃搴ㄦ煂閹寸偞娈犻柣鎴幖缁ㄨ櫕鎯",
    nameEn: "Aluminum Heat Sink Base",
    shortDescriptionZh: "闂侇偄鍊婚弫銈嗙鎼达絾鏆╂繝褎鍔栬啯闁秆勵殔閹蜂即骞掕閸╂鍖栭懡銈囧煚闁汇劌瀚花璺ㄢ偓闈涙閺嗗酣鎮滈鐐典亢閹煎洷浣插亾",
    shortDescriptionEn:
      "A precision heat sink base for power modules and control systems.",
    detailLeadZh: "闂傚牄鍨归幃婊堟倻椤撶媭鍚€闁荤偛妫滈々锕€效閸屾繄绐涘Δ鍌涐缚濞堟垿鎮介棃娑氭憤閻熶礁鎳橀崢銈嗐亜閸︻厽绐楅柨娑樿嫰閸氬銇勯悙顒佹疇闁绘埈鍘虹粭宀€鈧懓顦抽ˉ濠勫垝閹冾唺闁碉拷",
    detailLeadEn:
      "Developed for electronic assemblies that need both heat dissipation and accurate mounting geometry.",
    model: "HSB-160",
    materialZh: "6061-T6 闂佺偓绻傞幃搴ㄦ煂",
    materialEn: "Aluminum 6061-T6",
    processZh: "CNC 闂佹拝绲芥晶锟?+ 鐎殿喒鍋撴俊锟",
    processEn: "CNC Milling + Slotting",
    sizeZh: "160 x 90 x 18 mm",
    sizeEn: "160 x 90 x 18 mm",
    tolerance: "+/-0.02 mm",
    surfaceTreatmentZh: "闁哥娀顥撻悥鐐烘⒓閾忣偆鈧拷",
    surfaceTreatmentEn: "Sandblasted Anodizing",
    colorZh: "濮掓稒鍨兼竟锟?/ 闂佺偓鍎兼竟锟",
    colorEn: "Black / Silver",
    applicationZh: "闁告瑦锕㈤。鍫曞闯閵婏絺鍋撴担鐑樻毄婵犙勫姈鑶╅柛褎銇滈埀顑跨娴兼劖绋夊顓炰粯闁告帟娉涘▍锟",
    applicationEn: "inverters, power modules, and industrial controllers",
    moq: "150 pcs",
    sampleLeadTime: "5 days",
    leadTime: "15-18 days",
    packagingZh: "闁告娲戝▎銏ゆ⒕閺傝法婀?+ 闁告垵鎼ぐ娑氱棯閸濄儺鍞",
    packagingEn: "Individual divider + export carton",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?40,000 濞达拷",
    supplyAbilityEn: "40,000 pcs per month",
    certification: "RoHS",
    customFields: [
      { labelZh: "散热要求", labelEn: "Thermal Requirement", valueZh: "优先保证平面导热接触", valueEn: "Priority on flat thermal contact", visible: true, sortOrder: 10 },
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
    nameZh: "缂侇喗鍎抽惁鎴犫偓鐟邦槼椤ュ﹪宕",
    nameEn: "Precision Mounting Block",
    shortDescriptionZh: "闂侇偄鍊搁幃搴ㄦ嚊椤忓嫬袟闁告牗鐗曟导鎰啑閸涱厽瀚查悹浣瑰劤椤︻剟宕洪崫鍕珯閻庤鐭紞鍛存儍閸曨偆鏆旈悷浣告噹濞硷繝濡",
    shortDescriptionEn:
      "A precision mounting block for automation tooling and reference positioning.",
    detailLeadZh: "闂侇偄鍊搁幃搴㈠緞閻熸澘寰旈柕鍡曠劍缁箓宕ｉ弶鎸庡閻熸瑥妫滈～搴ｆ媼閹屾У闁汇劌瀚伴崳鍛婂緞瀹ュ懐鏆板ù锝呯Т閻ｃ劎鎲楅崨顐熷亾",
    detailLeadEn:
      "Built for repeated-position assemblies such as fixtures, motion slides, and vision systems.",
    model: "MBL-064",
    materialZh: "7075 闂佺偓绻傞幃搴ㄦ煂",
    materialEn: "Aluminum 7075",
    processZh: "CNC 闂佹拝绲芥晶锟?+ 闂佸€燁嚙閻★拷",
    processEn: "CNC Milling + Drilling",
    sizeZh: "64 x 64 x 28 mm",
    sizeEn: "64 x 64 x 28 mm",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "缁绢収鍓濆婵嬫⒓閾忣偆鈧拷",
    surfaceTreatmentEn: "Hard Anodizing",
    colorZh: "濮掓稒鍨兼竟锟",
    colorEn: "Black",
    applicationZh: "闁煎浜滄慨鈺呭礌閺嵮佷粴闁稿繑鐏氶埀顑跨劍缁箓宕ｉ弶璺ㄦ殧閻熶礁鎳岄埀顑挎祰椤鎲存径灞剧ゲ闁哄牆鎼悢鈧幖锟",
    applicationEn: "automation fixtures, linear slide mounts, and vision camera bases",
    moq: "100 pcs",
    sampleLeadTime: "4-6 days",
    leadTime: "12-16 days",
    packagingZh: "闂傚啯褰冮崺澶愭嚉?+ 闂傚懏鏌ㄩ惇浼存儎",
    packagingEn: "Protective film + divided box",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?35,000 濞达拷",
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
    nameZh: "CNC 闁汇垹鐏氬┃鈧紒鏃戝灣濞诧拷",
    nameEn: "CNC Motor End Cap",
    shortDescriptionZh: "闁烩偓鍔嬬花顒佸閻戞ɑ绠涢柣銏犵仛濠р偓闁告粌鑻导鎰▔濮樺灈鏀抽柛鏂诲妼瀹曠喖宕楅崘顏呯暠缂侇喗鍎抽惁鎴犵博椤栨粍纾伴柕锟",
    shortDescriptionEn:
      "A precision end cap for servo motors and industrial drive units.",
    detailLeadZh: "鐎殿噣缂氶惃鐔告姜鐎涙ê顥炲ù锝呯Ф缁ㄦ寧鎯旈敂琛″亾娴ｅ摜鎽曞ù锝呯С缁旀挳鎳涚€涙ǚ鍋撹閹蜂即骞嶈ぐ鎺戞缂佸鍟块悾楣冨箑瑜嬮埀锟",
    detailLeadEn:
      "Focused on bearing-seat accuracy, hole consistency, and stable mass-production repeatability.",
    model: "MEC-102",
    materialZh: "SUS 304 / 闂佺偓绻傞幃搴ㄦ煂",
    materialEn: "SUS 304 / Aluminum",
    processZh: "CNC 閺夌儑绠撻幗姘緞瀹ュ懏鍊",
    processEn: "Turn-Mill Machining",
    sizeZh: "闁烩晜娼欑欢锟?102 mm",
    sizeEn: "Diameter 102 mm",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "闁哥娀顥撻悥锟?/ 闁硅埖绋戦崢锟",
    surfaceTreatmentEn: "Bead Blasting / Polishing",
    colorZh: "闂佸弶鍨甸惈姗€寮甸鍐棌",
    colorEn: "Metallic",
    applicationZh: "濞磋偐鍎ゅ﹢鍥偨閸偅绨氶柕鍡曠窔閳瑰秹宕濋妸未渚€宕稿灏栧亾娓氣偓椤ユ捇寮甸悜妯峰亾缂佹ê鐏",
    applicationEn: "servo motors, drive units, and blower assemblies",
    moq: "120 pcs",
    sampleLeadTime: "6 days",
    leadTime: "15-20 days",
    packagingZh: "闂傚啯鐓￠弨顒傛偖?+ 闁告帒妫楅惇鎵棯閸濄儺鍞",
    packagingEn: "Anti-rust bag + layered carton",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?25,000 濞达拷",
    supplyAbilityEn: "25,000 pcs per month",
    certification: "ISO 9001",
    customFields: [
      { labelZh: "轴承位公差", labelEn: "Bearing Seat Tolerance", valueZh: "H7", valueEn: "H7", visible: true, sortOrder: 10 },
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
    nameZh: "閻庤鑹鹃崺妤佸閻樺啿濡抽柛锝冨妼閻ｃ劎鎲楅崨顓㈢崜",
    nameEn: "Custom Sensor Mount",
    shortDescriptionZh: "濞戞捇缂氶～瀣喆婢跺牃鍋撴担璇℃⒕婵炴潙顑呴幏鎵偓瑙勭煯缂嶅懐鍖栭懡銈囧煚闁圭粯鍔掔欢鐢电矙閸愯尙鏆伴悗鐟邦槼椤ュ﹪宕洪崫鍕崜闁碉拷",
    shortDescriptionEn:
      "A stable mounting base for vision, sensing, and positioning systems.",
    detailLeadZh: "闂侇偄鍊搁幃搴ㄦ閳ь剛鎲版担鎴掓唉闂佹彃绻愮€垫煡濡存担鍝ユ瘓閻忓繐鎼顓㈠椽鐏炶姤褰ラ梺顐ゅ枍濮橈箓寮芥搴㈢暠濞磋偐濮甸崝鍛村闯閵娿儲绁奸悗瑙勭煯濞嗐垺銇勯崷顓熺獥闁碉拷",
    detailLeadEn:
      "Ideal for sensor support projects that need compact structure, low weight, and quick sampling.",
    model: "SMT-045",
    materialZh: "6061 闂佺偓绻傞幃搴ㄦ煂",
    materialEn: "Aluminum 6061",
    processZh: "CNC 闂佹拝绲芥晶锟?+ 闁衡偓閼姐倕顫",
    processEn: "CNC Milling + Tapping",
    sizeZh: "45 x 38 x 22 mm",
    sizeEn: "45 x 38 x 22 mm",
    tolerance: "+/-0.01 mm",
    surfaceTreatmentZh: "濮掓稒鍨兼竟濠囨⒓閾忣偆鈧拷",
    surfaceTreatmentEn: "Black Anodizing",
    colorZh: "濮掓稒鍨兼竟锟",
    colorEn: "Black",
    applicationZh: "閻熸瑥妫滈～搴㈠閻樺啿濡抽柛锝冨妸閳ь兛绀侀崢婊堟偨閸偒姊炬繛鏉戭儍閳ь兛绀侀悾鐐媴瀹ュ洨鐭嬪ù锟",
    applicationEn: "vision sensors, photoelectric inspection, and positioning assemblies",
    moq: "200 pcs",
    sampleLeadTime: "3-5 days",
    leadTime: "10-15 days",
    packagingZh: "闁告娲戝▎銏焊韫囨凹鏆?+ 濠㈣埖鐗滈锟",
    packagingEn: "Individual small bag + export carton",
    placeOfOriginZh: "濞戞搩鍘煎ù妤佺▔濠婂棗閲",
    placeOfOriginEn: "Dongguan, China",
    supplyAbilityZh: "婵絽绻戝﹢鈧?70,000 濞达拷",
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

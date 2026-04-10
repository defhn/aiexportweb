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
    nameZh: "閸╄櫣顢呴悧锟�",
    nameEn: "Basic",
    price: 9980,
    taglineZh: "娑撴挷绗熼懟杈ㄦ瀮婢舵牞閿ょ仦鏇犮仛缁旓拷",
    descriptionZh:
      "闁倸鎮庨崗鍫熷Ω閼昏鲸鏋冪€规ḿ缍夐幖顓℃崳閺夈儻绱濈亸钘夋彥娑撳﹦鍤庣仦鏇犮仛娴溠冩惂閸滃本澹欓幒銉ョ唨绾偓鐠囥垻娲忛妴锟�",
  },
  {
    key: "growth",
    nameZh: "閼惧嘲顓归悧锟�",
    nameEn: "Growth",
    price: 19800,
    taglineZh: "婢舵牞閿ら懢宄邦吂缁崵绮�",
    descriptionZh:
      "闁倸鎮庣憰浣瑰瘮缂侇厽甯寸拠銏㈡磸閵嗕礁浠涢崘鍛啇鏉╂劘鎯€閵嗕胶顓搁悶鍡涙敘閸烆喛绐℃潻娑氭畱閸掑爼鈧姳绗熸导浣风瑹閵嗭拷",
  },
  {
    key: "ai_sales",
    nameZh: "AI闁库偓閸烆喚澧�",
    nameEn: "AI Sales",
    price: 29800,
    taglineZh: "AI婢舵牞閿ら懢宄邦吂娑撳酣鏀㈤崬顔鹃兇缂侊拷",
    descriptionZh:
      "闁倸鎮庡鑼病閺堝鏀㈤崬顔煎З娴ｆ粣绱濋幆宕囨暏 AI 閸旂姴鎻╂禍褍鎼цぐ鏇炲弳閵嗕浇顕楅惄妯哄瀻缁鎷伴崶鐐差槻閺佸牏宸奸惃鍕礋闂冪喆鈧拷",
  },
];

const featureRules: Record<FeatureKey, FeatureRule> = {
  dashboard_analytics: {
    labelZh: "鐠囥垻娲忛弫鐗堝祦閻婢�",
    requiredPlan: "growth",
    upgradeTitle: "鐠囥垻娲忛弫鐗堝祦閻婢樼仦鐐扮艾閼惧嘲顓归悧鍫濆閼筹拷",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲娴犮儳娲块幒銉ф箙閸掗绮栭弮銉ｂ偓浣规拱閸涖劊鈧焦婀伴張鍫ｎ嚄閻╂ǹ绉奸崝鍖＄礉娴犮儱寮烽崶钘夘啀閺夈儲绨崪宀€鍎归梻銊ら獓閸濅焦甯撶悰灞烩偓锟�",
    benefits: [
      "閼颁焦婢橀懗钘夋彥闁喎鍨介弬顓犵秹缁旀瑦娓舵潻鎴炴箒濞屸剝婀佺敮锔芥降鐎广垺鍩�",
      "閼崇晫婀呴崙鍝勬憿娴滄稐楠囬崫浣规纯鐎硅妲楃敮锔芥降鐠囥垻娲�",
      "閸ヨ棄顔嶉弶銉︾爱缂佺喕顓搁弴瀛樻煙娓氬灝鐣ㄩ幒鎺楀櫢閻愮懓绔堕崷锟�",
    ],
  },
  blog_management: {
    labelZh: "閸楁艾顓圭化鑽ょ埠",
    requiredPlan: "growth",
    upgradeTitle: "閸楁艾顓圭化鑽ょ埠鐏炵偘绨懢宄邦吂閻楀牆濮涢懗锟�",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲娴犮儲瀵旂紒顓炲絺鐢啳瀚抽弬锟� SEO 閸愬懎顔愰敍灞惧閹猴拷 Google 闂€鍨啲濞翠線鍣洪獮鑸靛絹妤傛ü绗撴稉姘妳閵嗭拷",
    benefits: [
      "閹镐胶鐢婚弴瀛樻煀閼昏鲸鏋冮崘鍛啇閿涘苯搴滈崝锟� SEO 閼惧嘲顓�",
      "閺傚洨鐝烽崣顖氬冀閸氭垵顕卞ù浣稿煂娴溠冩惂妞ゅ吀绗岀拠銏㈡磸鐞涖劌宕�",
      "鐠佲晝缍夌粩娆撴毐閺堢喍绻氶幐浣规た鐠哄喛绱濋懓灞肩瑝閺勵垯绔村▎鈩冣偓褍鐫嶇粈娲€�",
    ],
  },
  csv_import: {
    labelZh: "娴溠冩惂 CSV 閹靛綊鍣虹€电厧鍙�",
    requiredPlan: "growth",
    upgradeTitle: "娴溠冩惂閹靛綊鍣虹€电厧鍙嗙仦鐐扮艾閼惧嘲顓归悧鍫濆閼筹拷",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲娴犮儳鏁� CSV 閹靛綊鍣虹€电厧鍙嗘禍褍鎼ч敍灞藉櫤鐏忔垵濮悶鍡楁嫲鏉╂劘鎯€閹靛浼愯ぐ鏇炲弳閻ㄥ嫭妞傞梻娣偓锟�",
    benefits: [
      "婢堆囧櫤娴溠冩惂閸欘垯绔村▎鈩冣偓褍缍嶉崗锟�",
      "閺囨挳鈧倸鎮庡銉ュ范閻╊喖缍嶉崹瀣╅獓閸濅胶绮ㄩ弸锟�",
      "閼宠姤妯夐拋妤€鍣虹亸鎴濆冀婢跺秵澧滃銉ф樊閹讹拷",
    ],
  },
  inquiry_detail: {
    labelZh: "鐠囥垻娲忕拠锔藉剰娑撳氦绐℃潻锟�",
    requiredPlan: "growth",
    upgradeTitle: "鐠囥垻娲忕拠锔藉剰妞ら潧鐫樻禍搴ゅ箯鐎广垻澧楅崝鐔诲厴",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲娴犮儲鐓￠惇瀣嚄閻╂ǹ顕涢幆鍛偓渚€妾禒韬测偓浣稿敶闁劌顦▔顭掔礉楠炲墎绮烘稉鈧崑姘卞Ц閹焦绁︽潪顑锯偓锟�",
    benefits: [
      "闁库偓閸烆喛绐℃潻娑椾繆閹垯绗夋导姘殠閽€钘夋躬閼卞﹤銇夌拋鏉跨秿闁诧拷",
      "閸欘垰婀崥搴″酱缂佺喍绔撮弻銉ф箙闂勫嫪娆㈤妴浣烽獓閸濅礁鎷版径鍥ㄦ暈",
      "閸氬海鐢婚幒銉ュ弳閸ョ偛顦插Ο鈩冩緲閸滃本濮ゆ禒閿嬬ウ缁嬪娲挎い鐑樺",
    ],
  },
  reply_templates: {
    labelZh: "韫囶偊鈧喎娲栨径宥喣侀弶锟�",
    requiredPlan: "growth",
    upgradeTitle: "韫囶偊鈧喎娲栨径宥喣侀弶鍨潣娴滃氦骞忕€广垻澧楅崝鐔诲厴",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲娴犮儳绮烘稉鈧紒瀛樺Б閹躲儰鐜妴浣瑰ⅵ閺嶆灚鈧府OQ閵嗕椒姘﹂張鐔虹搼閼昏鲸鏋冮崶鐐差槻濡剝婢橀妴锟�",
    benefits: [
      "婢舵牞閿ら崝鈺冩倞閸ョ偛顦查弴鏉戞彥",
      "缂佺喍绔撮崗顒€寰冪€电懓顦婚崣锝呯窞閿涘苯鍣虹亸鎴炵煛闁俺顕ゅ锟�",
      "閸滃矁顕楅惄妯款嚊閹懘銆夐懕鏂垮З閸氬孩娲块惇浣规",
    ],
  },
  quotes: {
    labelZh: "閹躲儰鐜悽瀹狀嚞缁崵绮�",
    requiredPlan: "growth",
    upgradeTitle: "閹躲儰鐜悽瀹狀嚞缁崵绮虹仦鐐扮艾閼惧嘲顓归悧鍫濆閼筹拷",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲閹恒儲鏁归弴鏉戠暚閺佸娈� RFQ 娣団剝浼呴敍灞借嫙閸︺劌鎮楅崣浼存肠娑擃厾顓搁悶鍡樺Г娴犻鏁电拠鏋偓锟�",
    benefits: [
      "鐎广垺鍩涢崣顖欎簰閹绘劒姘﹂弫浼村櫤閵嗕礁顦▔銊ユ嫲闂勫嫪娆�",
      "閺囨挳鈧倸鎮庨柌鎴︻杺閺囨挳鐝妴浣筋潐閺嶅吋娲挎径宥嗘絽閻ㄥ嫪楠囬崫锟�",
      "閹躲儰鐜崗銉ュ經閻欘剛鐝涢敍宀勬敘閸烆喖濮╂担婊勬纯濞撳懏娅�",
    ],
  },
  request_quote: {
    labelZh: "閸忣剙绱戦幎銉ょ幆閻㈠疇顕い锟�",
    requiredPlan: "growth",
    upgradeTitle: "閹躲儰鐜悽瀹狀嚞妞ら潧鐫樻禍搴ゅ箯鐎广垻澧楅崝鐔诲厴",
    upgradeDescription:
      "閸楀洨楠囬崥搴濈窗瀵偓閺€鎯у閸欙拷 RFQ 妞ょ敻娼伴敍灞藉簻閸斺晛顓归幋閿嬪絹娴溿倖娲跨€瑰本鏆ｉ惃鍕Г娴犵兘娓跺Ч鍌樷偓锟�",
    benefits: [
      "閹垫寧甯撮弴鎾彯閹板繐鎮滈惃鍕吂閹达拷",
      "濮ｆ梹娅橀柅姘充粓缁槒銆冮崡鏇熷瑏閸掔増娲跨€瑰本鏆ｉ惃鍕繆閹拷",
      "閺堝濮禍搴濈瑹閸斺€虫喅閺囨潙鎻╅弫瀵告倞閹躲儰鐜�",
    ],
  },
  utm_attribution: {
    labelZh: "濞翠線鍣鸿ぐ鎺戞礈閻婢�",
    requiredPlan: "growth",
    upgradeTitle: "濞翠線鍣鸿ぐ鎺戞礈閻婢樼仦鐐扮艾閼惧嘲顓归悧鍫濆閼筹拷",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲閻鍩屽В蹇庨嚋鐠囥垻娲忛惃鍕ウ闁插繑娼靛┃鎰剁礄Google / 鐏炴洑绱� / 闁喕娆㈤敍澶涚礉楠炲灝鎲＄化璇插灙鏉烆剙瀵查弫鍫熺亯閸滐拷 GCLID 閺勫海绮忛敍灞藉簻閸斺晞鈧焦婢橀崚銈嗘焽閸濐亙閲滃〒鐘讳壕閸婄厧绶遍崝鐘层亣閹舵洖鍙嗛妴锟�",
    benefits: [
      "閻鍩岀拠銏㈡磸閺勵垯绮� Google 閹兼粎鍌ㄩ妴浣哥潔娴兼艾鎮曢悧鍥箷閺勵垰绠嶉崨濠呯箻閺夈儳娈�",
      "閸掋倖鏌囬獮鍨啞閹舵洘鏂侀弰顖氭儊鐢附娼甸惇鐔风杽鐠囥垻娲忛敍宀冣偓灞肩瑝閺勵垰甯囨担搴㈠灇閺堬拷",
      "缁儳鍣仦鏇犮仛 GCLID 楠炲灝鎲￠悙鐟板毊閺夈儲绨惃鍕彯閹板繐鎮滅€广垺鍩�",
    ],
  },
  pipeline_kanban: {
    labelZh: "Pipeline 缁捐法鍌ㄩ惇瀣緲",
    requiredPlan: "growth",
    upgradeTitle: "Pipeline 閻婢樼仦鐐扮艾閼惧嘲顓归悧鍫濆閼筹拷",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲娴犮儳鏁� Kanban 娑撯偓鐟欏牊鐓￠惇瀣閺堝鍤庣槐銏㈡畱鐠虹喕绻橀梼鑸殿唽閿涘苯鑻熸潻鍊熼嚋鐠с垹宕熼悳鍥ф嫲妫板嫭婀￠弨璺哄弳閵嗭拷",
    benefits: [
      "娑撯偓鐏炲繒婀呭〒鍛閺堝鍎规潻娑氬殠缁便垹顦╂禍搴℃憿鐏烇拷 Kanban",
      "閼崇晫婀呴崚鎷岃€介崡鏇犲芳楠炴儼鐦庢导鏉挎倗闂冭埖顔屾潪顒€瀵查弫鍫㈠芳",
      "婢舵牞閿ら懓浣规緲閸欘垰鐤勯弮鑸靛笁閹烩剝鏆ｆ稉顏堟敘閸烆喗绱￠弬妤勭箻鐏烇拷",
    ],
  },
  ai_product_copy: {
    labelZh: "AI 娴溠冩惂閼昏鲸鏋冮弬鍥攳",
    requiredPlan: "ai_sales",
    trialLimitByPlan: { growth: 3 },
    upgradeTitle: "AI 娴溠冩惂閺傚洦顢嶇仦鐐扮艾 AI闁库偓閸烆喚澧楅崝鐔诲厴",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲娴犮儱鎻╅柅鐔烘晸閹存劘瀚抽弬鍥﹂獓閸濅焦鐖ｆ０妯糕偓浣瑰伎鏉╂澘鎷� SEO 閺傚洦顢嶉敍灞藉櫤鐏忔垳姹夊銉ュ晸缁嬫寧妞傞梻娣偓锟�",
    benefits: [
      "娴溠冩惂娑撳﹥鏌婇弴鏉戞彥",
      "閼昏鲸鏋冮弬鍥攳妞嬪孩鐗搁弴瀵哥埠娑撯偓",
      "閺囨挳鈧倸鎮庨棁鈧憰渚€顣剁换浣规纯閺傞楠囬崫浣烘畱閸ャ垽妲�",
    ],
  },
  ai_inquiry_reply: {
    labelZh: "AI 閼昏鲸鏋冮崶鐐差槻閼藉枪",
    requiredPlan: "ai_sales",
    trialLimitByPlan: { growth: 5 },
    upgradeTitle: "AI 閼昏鲸鏋冮崶鐐差槻鐏炵偘绨� AI闁库偓閸烆喚澧楅崝鐔诲厴",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲閺嶈宓佺拠銏㈡磸閸愬懎顔愰崪灞奸獓閸濅礁寮弫鎷屽殰閸斻劎鏁撻幋鎰閺傚洤娲栨径宥堝磸缁嬪尅绱濇禍鍝勪紣绾喛顓婚崥搴″絺闁降鈧拷",
    benefits: [
      "閸戝繐鐨柨鈧崬顔兼嫲閸斺晝鎮婇柌宥咁槻閸愭瑩鍋栨禒锟�",
      "閸ョ偛顦查柅鐔峰閺囨潙鎻╅敍灞藉櫤鐏忔垶绱＄粵鏂垮彠闁款喕淇婇幁锟�",
      "闁倸鎮庢姗€顣舵径鍕倞鐠囥垻娲忛惃鍕礋闂冿拷",
    ],
  },
  ai_inquiry_classification: {
    labelZh: "AI 鐠囥垻娲忛崚鍡欒",
    requiredPlan: "ai_sales",
    trialLimitByPlan: { growth: 20 },
    upgradeTitle: "AI 鐠囥垻娲忛崚鍡欒鐏炵偘绨� AI闁库偓閸烆喚澧楅崝鐔诲厴",
    upgradeDescription:
      "閸楀洨楠囬崥搴″讲閼奉亜濮╅崚銈嗘焽閹躲儰鐜妴浣圭壉閸濅降鈧焦濡ч張顖滅搼鐠囥垻娲忕猾璇茬€烽敍灞藉櫤鐏忔垳姹夊銉ュ瀻缁粯妞傞梻娣偓锟�",
    benefits: [
      "鐠囥垻娲忕搾濠傤樋鐡掑﹨鍏樻担鎾跺箛娴犲嘲鈧拷",
      "閺囨挳鈧倸鎮庢径姘眽閸楀繋缍旂捄鐔荤箻",
      "閺傞€涚┒缂佺喕顓告妯圭幆閸婅偐鍤庣槐銏㈣閸拷",
    ],
  },
  rag_factory: {
    labelZh: "RAG 閻儴鐦戝銉ュ范",
    requiredPlan: "ai_sales",
    upgradeTitle: "RAG 閻儴鐦戝銉ュ范鐏炵偘绨� AI 闁库偓閸烆喚澧楅悪顒€顔嶉崝鐔诲厴",
    upgradeDescription:
      "閸楀洨楠囬崥锟� AI 閻㈢喐鍨氶惃鍕閺堝鍞寸€瑰綊鍏樼亸鍡楃唨娴滃孩鍋嶉懛顏勭箒閻ㄥ嫪楠囬崫浣虹叀鐠囧棗绨遍敍灞借嫙閼奉亜濮╅弽鍥╁娑撳海鐓＄拠鍡楃氨閻稓娴橀惃鍕Η閺堫垰寮弫鑸偓锟�",
    benefits: [
      "AI 閸愬懎顔愭稉宥呭晙闁插洨鏁ら弶鍐ㄢ枆瀵版ぞ绗夐崚鎵畱閺佺増宓侀敍灞藉弿闁劍娼甸懛顏勭潔缁€鍝勬櫌閼奉亣闊╂禍褍鎼х挧鍕灐",
      "閸愬懎顔愰崣鎴濈閸撳秴褰叉稉鈧柨顔界壋閺屻儲濡ч張顖氬棘閺佹澘鍣涵顔解偓褝绱濋梼鍙夘剾 AI 楠炴槒顫庢稉濠勫殠",
      "閸氭垿鍣虹拠顓濈疅閹兼粎鍌ㄥВ鏂垮彠闁款喛鐦濋崠褰掑帳閺囨潙鐪担蹇庣瑐娑撳鏋�",
    ],
  },
};

const comparisonSections: ComparisonSection[] = [
  {
    title: "缂冩垹鐝惔鏇為獓",
    rows: [
      { label: "閼昏鲸鏋冮崜宥呭酱缂冩垹鐝�", basic: true, growth: true, ai_sales: true },
      { label: "娑擃厽鏋冮崥搴″酱", basic: true, growth: true, ai_sales: true },
      { label: "妫ｆ牠銆� / About / Contact", basic: true, growth: true, ai_sales: true },
      { label: "娴溠冩惂閸掑棛琚い锟� / 娴溠冩惂鐠囷附鍎忔い锟�", basic: true, growth: true, ai_sales: true },
      { label: "閸ユ儳绨辩粻锛勬倞", basic: true, growth: true, ai_sales: true },
      { label: "閺傚洣娆㈢挧鍕灐鎼达拷", basic: true, growth: true, ai_sales: true },
      { label: "閸╄櫣顢� SEO 娑撳骸銇囧Ο鈥崇€烽幎鎾冲絿閸欏銈�", basic: true, growth: true, ai_sales: true },
      { label: "JSON-LD 缂佹挻鐎崠鏍ㄦ殶閹诡噯绱橮roduct / Organization / Blog閿涳拷", basic: true, growth: true, ai_sales: true },
    ],
  },
  {
    title: "閼惧嘲顓规稉搴ょ箥閽€锟�",
    rows: [
      { label: "鐠囥垻娲忕悰銊ュ礋 + Brevo 闁氨鐓� + 閸忋儱绨�", basic: true, growth: true, ai_sales: true },
      { label: "鐠囥垻娲忛梽鍕娑撳﹣绱�", basic: true, growth: true, ai_sales: true },
      { label: "闂勫嫪娆㈢€瑰鍙忔稉瀣祰閿涘牓顣╃粵鎯ф倳闁剧偓甯� 15 閸掑棝鎸撻敍锟�", basic: false, growth: true, ai_sales: true },
      { label: "閸楁艾顓圭化鑽ょ埠", basic: false, growth: true, ai_sales: true },
      { label: "妫ｆ牠銆夊Ο鈥虫健閹烘帒绨� / 閹恒劏宕橀崘鍛啇", basic: false, growth: true, ai_sales: true },
      { label: "娴溠冩惂 CSV 閹靛綊鍣虹€电厧鍙�", basic: false, growth: true, ai_sales: true },
      { label: "閸忣剙绱戦幎銉ょ幆閻㈠疇顕い锟�", basic: false, growth: true, ai_sales: true },
      { label: "閸忋劑鎽肩捄锟� UTM 鏉╁€熼嚋閿涘澆tm_source / medium / campaign / gclid閿涳拷", basic: false, growth: true, ai_sales: true },
    ],
  },
  {
    title: "闁库偓閸烆喖宕楅崥灞肩瑢 CRM",
    rows: [
      { label: "閺佺増宓侀惇瀣緲娑撳骸娴楃€硅埖娼靛┃鎰埠鐠侊拷", basic: false, growth: true, ai_sales: true },
      { label: "鐠囥垻娲忕拠锔藉剰妞わ拷 / 閻樿埖鈧焦绁︽潪锟� / 閸愬懘鍎存径鍥ㄦ暈", basic: false, growth: true, ai_sales: true },
      { label: "閸ョ偛顦插Ο鈩冩緲", basic: false, growth: true, ai_sales: true },
      { label: "閸氬骸褰撮幎銉ょ幆閻㈠疇顕粻锛勬倞", basic: false, growth: true, ai_sales: true },
      { label: "濞翠線鍣鸿ぐ鎺戞礈閻婢橀敍鍦睺M 閺夈儲绨� + 楠炲灝鎲＄化璇插灙閸掑棙鐎介敍锟�", basic: false, growth: true, ai_sales: true },
      { label: "Pipeline 閻婢橀敍锟�6 闂冭埖顔� Kanban 缁捐法鍌ㄧ捄銊╂▉閿涳拷", basic: false, growth: true, ai_sales: true },
      { label: "鐠囥垻娲� CSV 鐎电厧鍤�", basic: false, growth: true, ai_sales: true },
    ],
  },
  {
    title: "AI 閸旂喕鍏�",
    rows: [
      { label: "AI 娴溠冩惂閼昏鲸鏋冮弬鍥攳", basic: false, growth: false, ai_sales: true },
      { label: "AI 鐠囥垻娲忛崚鍡欒", basic: false, growth: false, ai_sales: true },
      { label: "AI 閼昏鲸鏋冮崶鐐差槻閼藉枪", basic: false, growth: false, ai_sales: true },
      { label: "RAG 閻儴鐦戝銉ュ范閿涘牏顫嗛張澶岀叀鐠囧棗绨遍悽鐔稿灇閿涳拷", basic: false, growth: false, ai_sales: true },
      { label: "AI 娴滃鐤勯弽鍛婄叀閿涘牊濡ч張顖氬棘閺佹壆鐓曢惄鎹愬殰閸斻劍鐖ｇ痪顫礆", basic: false, growth: false, ai_sales: true },
      { label: "閸氭垿鍣虹拠顓濈疅濡偓缁鳖澁绱檈mbedding-004閿涳拷", basic: false, growth: false, ai_sales: true },
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

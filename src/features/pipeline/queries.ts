import { desc, eq, gte, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { inquiries } from "@/db/schema";

export type PipelineStage =
  | "new"
  | "processing"
  | "contacted"
  | "quoted"
  | "won"
  | "done";

export const PIPELINE_STAGES: {
  key: PipelineStage;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    key: "new",
    label: "閺傛壆鍤庣槐锟�",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    key: "processing",
    label: "鐠虹喕绻樻稉锟�",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    key: "contacted",
    label: "瀹歌尪浠堢化锟�",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  {
    key: "quoted",
    label: "瀹稿弶濮ゆ禒锟�",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    key: "won",
    label: "鐠с垹宕� 棣冨竴",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    key: "done",
    label: "瀹告彃鐣幋锟�",
    color: "text-stone-600",
    bgColor: "bg-stone-100",
    borderColor: "border-stone-200",
  },
];

export async function getPipelineData() {
  const db = getDb();
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 閺堚偓鏉╋拷 90 婢讹拷

  const rows = await db
    .select({
      id: inquiries.id,
      name: inquiries.name,
      email: inquiries.email,
      companyName: inquiries.companyName,
      country: inquiries.country,
      countryCode: inquiries.countryCode,
      status: inquiries.status,
      inquiryType: inquiries.inquiryType,
      utmSource: inquiries.utmSource,
      annualVolume: inquiries.annualVolume,
      companyWebsite: inquiries.companyWebsite,
      productName: sql<string | null>`NULL`,
      createdAt: inquiries.createdAt,
      updatedAt: inquiries.updatedAt,
    })
    .from(inquiries)
    .where(gte(inquiries.createdAt, cutoff))
    .orderBy(desc(inquiries.updatedAt))
    .limit(200);

  // 閹革拷 status 閸掑棛绮嶉敍鍧皌atus 鐎涙顔岄崥灞炬閸忓懎缍� pipelineStage閿涳拷
  const grouped = new Map<PipelineStage, typeof rows>();
  for (const stage of PIPELINE_STAGES) {
    grouped.set(stage.key, []);
  }

  for (const row of rows) {
    const stageKey = (row.status as PipelineStage) ?? "new";
    const bucket = grouped.get(stageKey) ?? grouped.get("new")!;
    bucket.push(row);
  }

  // 缂佺喕顓搁幗妯款洣
  const stageSummary = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    count: grouped.get(stage.key)?.length ?? 0,
    leads: grouped.get(stage.key) ?? [],
  }));

  const totalActive = rows.filter((r) => r.status !== "done").length;
  const wonCount = rows.filter((r) => r.status === "won").length;
  const convRate =
    rows.length > 0 ? Math.round((wonCount / rows.length) * 100) : 0;

  return { stageSummary, totalActive, wonCount, convRate, total: rows.length };
}

/** Server Action閿涙碍娲块弬锟� inquiry 閻拷 pipeline stage */
export async function updatePipelineStage(
  inquiryId: number,
  stage: PipelineStage
) {
  const db = getDb();
  const validStages = PIPELINE_STAGES.map((s) => s.key);
  if (!validStages.includes(stage)) throw new Error("閺冪姵鏅ラ惃鍕▉濞堬拷");

  await db
    .update(inquiries)
    .set({
      status: stage as "new" | "processing" | "done",
      updatedAt: new Date(),
    })
    .where(eq(inquiries.id, inquiryId));
}

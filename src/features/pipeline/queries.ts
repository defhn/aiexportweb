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
    label: "新到询盘",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    key: "processing",
    label: "处理中",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    key: "contacted",
    label: "已联系",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  {
    key: "quoted",
    label: "已报价",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    key: "won",
    label: "已成交 ★",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    key: "done",
    label: "已完结",
    color: "text-stone-600",
    bgColor: "bg-stone-100",
    borderColor: "border-stone-200",
  },
];

export async function getPipelineData() {
  const db = getDb();
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 最近 90 天内的活跃询盘

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

  // 按 status 分组，将询盘分配到对应的 pipelineStage 分组
  const grouped = new Map<PipelineStage, typeof rows>();
  for (const stage of PIPELINE_STAGES) {
    grouped.set(stage.key, []);
  }

  for (const row of rows) {
    const stageKey = (row.status as PipelineStage) ?? "new";
    const bucket = grouped.get(stageKey) ?? grouped.get("new")!;
    bucket.push(row);
  }

  // 查询汇总数据
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

/** 更新 inquiry 的 pipeline 阶段 */
export async function updatePipelineStage(
  inquiryId: number,
  stage: PipelineStage
) {
  const db = getDb();
  const validStages = PIPELINE_STAGES.map((s) => s.key);
  if (!validStages.includes(stage)) throw new Error("无效的看板阶段，请检查传入参数");

  await db
    .update(inquiries)
    .set({
      status: stage as "new" | "processing" | "done",
      updatedAt: new Date(),
    })
    .where(eq(inquiries.id, inquiryId));
}

import Link from "next/link";
import { getPipelineData, PIPELINE_STAGES } from "@/features/pipeline/queries";
import {
  TrendingUp,
  Trophy,
  Users,
  BarChart2,
  Globe2,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

type LeadCardProps = {
  id: number;
  name: string;
  companyName?: string | null;
  country?: string | null;
  countryCode?: string | null;
  inquiryType?: string | null;
  utmSource?: string | null;
  annualVolume?: string | null;
  companyWebsite?: string | null;
  createdAt: Date;
};

function LeadCard({ lead }: { lead: LeadCardProps }) {
  return (
    <Link
      href={`/admin/inquiries/${lead.id}`}
      className="group block rounded-2xl border border-stone-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-stone-300"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-stone-900">{lead.name}</p>
          {lead.companyName && (
            <p className="truncate text-xs text-stone-400">{lead.companyName}</p>
          )}
        </div>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-stone-300 group-hover:text-stone-500 transition-colors mt-0.5" />
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {lead.countryCode && (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-50 px-2 py-0.5 text-xs text-stone-500">
            <Globe2 className="h-2.5 w-2.5" />
            {lead.countryCode}
          </span>
        )}
        {lead.utmSource && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
            {lead.utmSource}
          </span>
        )}
        {lead.inquiryType && (
          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
            {lead.inquiryType}
          </span>
        )}
      </div>

      {lead.annualVolume && (
        <p className="mt-1.5 text-xs font-medium text-emerald-600">
          年采购量: {lead.annualVolume}
        </p>
      )}

      <p className="mt-1.5 text-xs text-stone-300">
        {lead.createdAt.toLocaleDateString("zh-CN")}
      </p>
    </Link>
  );
}

export default async function AdminPipelinePage() {
  const data = await getPipelineData();

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">管理 Pipeline</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          可视化管理所有销售线索，从首次接触到成交，每个环节一目了然，仅保留最近 90 天询盘，
          已成交客户请及时归档
        </p>
      </section>

      {/* 核心统计 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            icon: Users,
            label: "活跃线索",
            value: data.totalActive,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: Trophy,
            label: "已成交",
            value: data.wonCount,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            icon: TrendingUp,
            label: "成交转化率",
            value: `${data.convRate}%`,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            icon: BarChart2,
            label: "总询盘 (90天)",
            value: data.total,
            color: "text-stone-600",
            bg: "bg-stone-100",
          },
        ].map((card) => (
          <article
            key={card.label}
            className="flex items-center gap-3 rounded-[1.5rem] border border-stone-100 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.color}`}
            >
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-stone-400">
                {card.label}
              </p>
              <p className="mt-0.5 text-3xl font-black tabular-nums text-stone-900">
                {card.value}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Kanban 看板 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {data.stageSummary.map((stage) => (
          <section
            key={stage.key}
            className={`flex flex-col rounded-[1.5rem] border ${stage.borderColor} ${stage.bgColor} p-4`}
          >
            {/* 阶段标题 */}
            <div className="mb-3 flex items-center justify-between">
              <h3 className={`text-xs font-black uppercase tracking-widest ${stage.color}`}>
                {stage.label}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-black ${stage.color} bg-white/60`}
              >
                {stage.count}
              </span>
            </div>

            {/* 线索卡片列表 */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[520px]">
              {stage.leads.length === 0 ? (
                <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white/50 p-6">
                  <p className="text-xs text-stone-300">暂无线索</p>
                </div>
              ) : (
                stage.leads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))
              )}
            </div>
          </section>
        ))}
      </div>

      {/* 使用说明 */}
      <section className="rounded-[1.5rem] border border-stone-100 bg-stone-50 p-5">
        <p className="text-xs text-stone-400">
          点击 <strong>任意线索卡片进入询盘详情页</strong>，在详情页修改 Pipeline 阶段即可移动卡片 →
          新询盘自动进入「新询盘」列 → 按阶段跟进直至成交，每步变更均有时间戳记录
        </p>
      </section>
    </div>
  );
}

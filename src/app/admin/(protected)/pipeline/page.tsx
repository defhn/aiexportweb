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
          闁插洩鍠橀柌锟�: {lead.annualVolume}
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
      {/* 閳光偓閳光偓 閺嶅洭顣� 閳光偓閳光偓 */}
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">缁捐法鍌� Pipeline</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          閸欘垵顫嬮崠鏍嫹闊亝澧嶉張澶屽殠缁鳖澀绮犻妴灞炬煀缁捐法鍌ㄩ妴宥呭煂閵嗗矁鑰介崡鏇樷偓宥囨畱閺冨懐鈻奸敍宀冪箮 90 婢垛晜鏆熼幑顔衡偓锟�
          閻愮懓鍤崡锛勫鏉╂稑鍙嗙拠锔藉剰閹广垻濮搁幀浣碘偓锟�
        </p>
      </section>

      {/* 閳光偓閳光偓 閺嶇ǹ绺鹃弫鏉跨摟 閳光偓閳光偓 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            icon: Users,
            label: "濞叉槒绌痪璺ㄥ偍",
            value: data.totalActive,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: Trophy,
            label: "鐠с垹宕�",
            value: data.wonCount,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            icon: TrendingUp,
            label: "鏉烆剙瀵查悳锟�",
            value: `${data.convRate}%`,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            icon: BarChart2,
            label: "閹崵鍤庣槐锟� (90婢讹拷)",
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

      {/* 閳光偓閳光偓 Kanban 閻婢� 閳光偓閳光偓 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {data.stageSummary.map((stage) => (
          <section
            key={stage.key}
            className={`flex flex-col rounded-[1.5rem] border ${stage.borderColor} ${stage.bgColor} p-4`}
          >
            {/* 閸掓鐖ｆ０锟� */}
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

            {/* 缁捐法鍌ㄩ崡锛勫閸掓銆� */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[520px]">
              {stage.leads.length === 0 ? (
                <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white/50 p-6">
                  <p className="text-xs text-stone-300">閺嗗倹妫ょ痪璺ㄥ偍</p>
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

      {/* 閳光偓閳光偓 閻樿埖鈧礁褰夐弴纾嬵嚛閺勶拷 閳光偓閳光偓 */}
      <section className="rounded-[1.5rem] border border-stone-100 bg-stone-50 p-5">
        <p className="text-xs text-stone-400">
          棣冩寱 <strong>婵″倷缍嶉幒銊ㄧ箻缁捐法鍌ㄩ梼鑸殿唽閿涳拷</strong> 閻愮懓鍤崡锛勫鏉╂稑鍙嗙拠銏㈡磸鐠囷附鍎忔い锟� 閳拷
          閸欏厖鏅堕悩鑸碘偓浣风瑓閹峰顢嬮柅澶嬪閺備即妯佸▓锟� 閳拷 娣囨繂鐡ㄩ崡鍐插讲閿涘苯褰夐弴缈犵窗鐎圭偞妞傞崣宥嗘Ё閸掔増顒濋惇瀣緲閵嗭拷
        </p>
      </section>
    </div>
  );
}

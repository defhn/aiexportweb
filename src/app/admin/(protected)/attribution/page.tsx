import { getUtmAttributionSummary } from "@/features/tracking/queries";
import {
  TrendingUp,
  Globe2,
  Megaphone,
  Target,
  MousePointerClick,
  Building2,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ─── 辅助：数字卡片 ───────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "blue",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  sub?: string;
  color?: "blue" | "emerald" | "amber" | "violet";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };
  return (
    <article className="flex flex-col gap-4 rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colorMap[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-stone-400">{label}</p>
        <p className="mt-1 text-4xl font-black tabular-nums text-stone-900">{value}</p>
        {sub && <p className="mt-1 text-xs text-stone-400">{sub}</p>}
      </div>
    </article>
  );
}

// ─── 来源分布条形图 ────────────────────────────────────────────
function SourceBar({
  label,
  count,
  max,
  color = "blue",
}: {
  label: string;
  count: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-400",
    violet: "bg-violet-500",
    rose: "bg-rose-500",
    stone: "bg-stone-400",
  };
  const colors = Object.values(colorMap);
  const bg = colors[Math.abs(label.length) % colors.length];
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-xs font-bold text-stone-600">
        {label || "直接访问"}
      </span>
      <div className="flex-1 rounded-full bg-stone-100 h-2">
        <div className={`h-2 rounded-full ${bg} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right text-xs font-black tabular-nums text-stone-900">{count}</span>
    </div>
  );
}

export default async function AdminAttributionPage() {
  const data = await getUtmAttributionSummary();
  const trackRate =
    data.totalCount > 0 ? Math.round((data.trackedCount / data.totalCount) * 100) : 0;
  const maxSource = Math.max(...data.bySource.map((r) => r.count), 1);
  const maxCampaign = Math.max(...data.byCampaign.map((r) => r.count), 1);

  return (
    <div className="space-y-6">
      {/* ── 标题 ── */}
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">流量归因看板</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          基于 UTM 参数与 Google Ads GCLID 的全链路追踪分析，近 30 天数据。
        </p>
      </section>

      {/* ── 核心指标卡片 ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Globe2}
          label="有来源询盘"
          value={data.trackedCount}
          sub={`全部 ${data.totalCount} 条中占 ${trackRate}%`}
          color="blue"
        />
        <StatCard
          icon={Target}
          label="Google Ads 命中"
          value={data.gclidCount}
          sub="GCLID 有效覆盖"
          color="amber"
        />
        <StatCard
          icon={Building2}
          label="企业级线索"
          value={data.highValueCount}
          sub="已填写公司网址"
          color="emerald"
        />
        <StatCard
          icon={TrendingUp}
          label="总询盘量"
          value={data.totalCount}
          sub="全部时间"
          color="violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── UTM Source 分布 ── */}
        <section className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold text-stone-900">
            <Globe2 className="h-4 w-4 text-blue-500" />
            来源 (utm_source) 分布
          </h3>
          <div className="mt-5 space-y-3">
            {data.bySource.length === 0 ? (
              <p className="text-sm text-stone-400">暂无来源数据，等待带 UTM 参数的访客提交询盘。</p>
            ) : (
              data.bySource.map((row) => (
                <SourceBar
                  key={row.utmSource ?? "direct"}
                  label={row.utmSource ?? "直接访问"}
                  count={row.count}
                  max={maxSource}
                />
              ))
            )}
          </div>
        </section>

        {/* ── Campaign 分布 ── */}
        <section className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold text-stone-900">
            <Megaphone className="h-4 w-4 text-amber-500" />
            广告系列 (utm_campaign) 分布
          </h3>
          <div className="mt-5 space-y-3">
            {data.byCampaign.length === 0 ? (
              <p className="text-sm text-stone-400">暂无 Campaign 数据。</p>
            ) : (
              data.byCampaign.map((row, idx) => (
                <SourceBar
                  key={`${row.utmCampaign ?? "none"}-${idx}`}
                  label={row.utmCampaign ?? "未设置"}
                  count={row.count}
                  max={maxCampaign}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {/* ── 高质量 UTM 线索明细 ── */}
      <section className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-base font-semibold text-stone-900">
          <MousePointerClick className="h-4 w-4 text-emerald-500" />
          近期有效来源询盘明细
        </h3>
        <div className="mt-4 overflow-x-auto">
          {data.recentTracked.length === 0 ? (
            <p className="text-sm text-stone-400 py-4">
              暂无数据——在推广链接中添加 UTM 参数后即可在此看到归因数据。
            </p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-left text-stone-400 font-black uppercase tracking-widest">
                  <th className="py-2 pr-4">客户</th>
                  <th className="py-2 pr-4">来源</th>
                  <th className="py-2 pr-4">媒介</th>
                  <th className="py-2 pr-4">系列</th>
                  <th className="py-2 pr-4">Google Ads</th>
                  <th className="py-2 pr-4">公司网址</th>
                  <th className="py-2">时间</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTracked.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors"
                  >
                    <td className="py-2 pr-4">
                      <p className="font-bold text-stone-900">{row.name}</p>
                      <p className="text-stone-400">{row.companyName ?? "—"}</p>
                    </td>
                    <td className="py-2 pr-4">
                      {row.utmSource ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 font-bold">
                          {row.utmSource}
                        </span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-stone-500">{row.utmMedium ?? "—"}</td>
                    <td className="py-2 pr-4 text-stone-500">{row.utmCampaign ?? "—"}</td>
                    <td className="py-2 pr-4">
                      {row.gclid ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 font-bold">
                          ✓ Ads
                        </span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      {row.companyWebsite ? (
                        <a
                          href={row.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-[120px] block"
                        >
                          {row.companyWebsite}
                        </a>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="py-2 text-stone-400">
                      {row.createdAt.toLocaleDateString("zh-CN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

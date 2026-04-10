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

// 閳光偓閳光偓閳光偓 鏉堝懎濮敍姘殶鐎涙宕遍悧锟� 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
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

// 閳光偓閳光偓閳光偓 閺夈儲绨崚鍡楃閺夆€宠埌閸ワ拷 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
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
        {label || "閻╁瓨甯寸拋鍧楁６"}
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
      {/* 閳光偓閳光偓 閺嶅洭顣� 閳光偓閳光偓 */}
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">濞翠線鍣鸿ぐ鎺戞礈閻婢�</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          閸╄桨绨� UTM 閸欏倹鏆熸稉锟� Google Ads GCLID 閻ㄥ嫬鍙忛柧鎹愮熅鏉╁€熼嚋閸掑棙鐎介敍宀冪箮 30 婢垛晜鏆熼幑顔衡偓锟�
        </p>
      </section>

      {/* 閳光偓閳光偓 閺嶇ǹ绺鹃幐鍥ㄧ垼閸楋紕澧� 閳光偓閳光偓 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Globe2}
          label="閺堝娼靛┃鎰嚄閻╋拷"
          value={data.trackedCount}
          sub={`閸忋劑鍎� ${data.totalCount} 閺夆€茶厬閸楋拷 ${trackRate}%`}
          color="blue"
        />
        <StatCard
          icon={Target}
          label="Google Ads 閸涙垝鑵�"
          value={data.gclidCount}
          sub="GCLID 閺堝鏅ョ憰鍡欐磰"
          color="amber"
        />
        <StatCard
          icon={Building2}
          label="娴间椒绗熺痪褏鍤庣槐锟�"
          value={data.highValueCount}
          sub="瀹告彃锝為崘娆忓彆閸欏摜缍夐崸鈧�"
          color="emerald"
        />
        <StatCard
          icon={TrendingUp}
          label="閹槒顕楅惄姗€鍣�"
          value={data.totalCount}
          sub="閸忋劑鍎撮弮鍫曟？"
          color="violet"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 閳光偓閳光偓 UTM Source 閸掑棗绔� 閳光偓閳光偓 */}
        <section className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold text-stone-900">
            <Globe2 className="h-4 w-4 text-blue-500" />
            閺夈儲绨� (utm_source) 閸掑棗绔�
          </h3>
          <div className="mt-5 space-y-3">
            {data.bySource.length === 0 ? (
              <p className="text-sm text-stone-400">閺嗗倹妫ら弶銉︾爱閺佺増宓侀敍宀€鐡戝鍛敨 UTM 閸欏倹鏆熼惃鍕問鐎广垺褰佹禍銈堫嚄閻╂ǜ鈧拷</p>
            ) : (
              data.bySource.map((row) => (
                <SourceBar
                  key={row.utmSource ?? "direct"}
                  label={row.utmSource ?? "閻╁瓨甯寸拋鍧楁６"}
                  count={row.count}
                  max={maxSource}
                />
              ))
            )}
          </div>
        </section>

        {/* 閳光偓閳光偓 Campaign 閸掑棗绔� 閳光偓閳光偓 */}
        <section className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold text-stone-900">
            <Megaphone className="h-4 w-4 text-amber-500" />
            楠炲灝鎲＄化璇插灙 (utm_campaign) 閸掑棗绔�
          </h3>
          <div className="mt-5 space-y-3">
            {data.byCampaign.length === 0 ? (
              <p className="text-sm text-stone-400">閺嗗倹妫� Campaign 閺佺増宓侀妴锟�</p>
            ) : (
              data.byCampaign.map((row, idx) => (
                <SourceBar
                  key={`${row.utmCampaign ?? "none"}-${idx}`}
                  label={row.utmCampaign ?? "閺堫亣顔曠純锟�"}
                  count={row.count}
                  max={maxCampaign}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {/* 閳光偓閳光偓 妤傛ǹ宸濋柌锟� UTM 缁捐法鍌ㄩ弰搴ｇ矎 閳光偓閳光偓 */}
      <section className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-base font-semibold text-stone-900">
          <MousePointerClick className="h-4 w-4 text-emerald-500" />
          鏉╂垶婀￠張澶嬫櫏閺夈儲绨拠銏㈡磸閺勫海绮�
        </h3>
        <div className="mt-4 overflow-x-auto">
          {data.recentTracked.length === 0 ? (
            <p className="text-sm text-stone-400 py-4">
              閺嗗倹妫ら弫鐗堝祦閳ユ柡鈧柨婀幒銊ョ畭闁剧偓甯存稉顓熷潑閸旓拷 UTM 閸欏倹鏆熼崥搴″祮閸欘垰婀銈囨箙閸掓澘缍婇崶鐘虫殶閹诡喓鈧拷
            </p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-left text-stone-400 font-black uppercase tracking-widest">
                  <th className="py-2 pr-4">鐎广垺鍩�</th>
                  <th className="py-2 pr-4">閺夈儲绨�</th>
                  <th className="py-2 pr-4">婵帊绮�</th>
                  <th className="py-2 pr-4">缁鍨�</th>
                  <th className="py-2 pr-4">Google Ads</th>
                  <th className="py-2 pr-4">閸忣剙寰冪純鎴濇絻</th>
                  <th className="py-2">閺冨爼妫�</th>
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
                      <p className="text-stone-400">{row.companyName ?? "閳ワ拷"}</p>
                    </td>
                    <td className="py-2 pr-4">
                      {row.utmSource ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 font-bold">
                          {row.utmSource}
                        </span>
                      ) : (
                        <span className="text-stone-300">閳ワ拷</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-stone-500">{row.utmMedium ?? "閳ワ拷"}</td>
                    <td className="py-2 pr-4 text-stone-500">{row.utmCampaign ?? "閳ワ拷"}</td>
                    <td className="py-2 pr-4">
                      {row.gclid ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 font-bold">
                          閴侊拷 Ads
                        </span>
                      ) : (
                        <span className="text-stone-300">閳ワ拷</span>
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
                        <span className="text-stone-300">閳ワ拷</span>
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

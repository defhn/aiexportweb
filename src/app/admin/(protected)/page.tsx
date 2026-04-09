import {
  CalendarClock,
  FileText,
  Globe2,
  Layers,
  MessageSquare,
  MousePointer2,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";

import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { listAdminBlogPosts } from "@/features/blog/queries";
import { getDashboardSnapshot } from "@/features/dashboard/queries";
import { getFeatureGate } from "@/features/plans/access";
import { listAdminCategories, listAdminProducts } from "@/features/products/queries";

export const dynamic = "force-dynamic";

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Users;
  color: "blue" | "emerald" | "amber" | "stone";
}) {
  const colorClass =
    color === "blue"
      ? "bg-blue-50 text-blue-600"
      : color === "emerald"
        ? "bg-emerald-50 text-emerald-600"
        : color === "amber"
          ? "bg-amber-50 text-amber-600"
          : "bg-stone-50 text-stone-600";

  return (
    <article className="group relative flex flex-col rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
      <div className="mb-8 flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="text-xs font-black uppercase tracking-widest text-stone-300">Metric</div>
      </div>

      <p className="mb-1 text-sm font-bold text-stone-400">{label}</p>
      <p className="text-4xl font-black leading-none tracking-tight text-stone-900 tabular-nums">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-6 border-t border-stone-50 pt-4 text-xs font-medium leading-relaxed text-stone-500">
        {description}
      </p>
    </article>
  );
}

export default async function AdminDashboardPage() {
  const gate = await getFeatureGate("dashboard_analytics");

  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }

  const [snapshot, products, posts, categories] = await Promise.all([
    getDashboardSnapshot(),
    listAdminProducts(),
    listAdminBlogPosts(),
    listAdminCategories(),
  ]);

  const cards = [
    {
      label: "今日新增询盘",
      value: snapshot.cards.today,
      description: "今天新收到的询盘数量，帮助你快速判断当天获客情况�?,
      icon: Users,
      color: "blue" as const,
    },
    {
      label: "本周询盘总量",
      value: snapshot.cards.thisWeek,
      description: "最�?7 天的累计询盘数量，便于观察周趋势�?,
      icon: TrendingUp,
      color: "emerald" as const,
    },
    {
      label: "待处理询�?,
      value: snapshot.cards.pending,
      description: "状态不是已完成的询盘，代表当前需要业务继续跟进的机会�?,
      icon: CalendarClock,
      color: "amber" as const,
    },
    {
      label: "产品总数",
      value: products.length,
      description: "当前后台可管理的产品数量，包含草稿和已发布产品�?,
      icon: Package,
      color: "stone" as const,
    },
    {
      label: "博客文章�?,
      value: posts.length,
      description: "用于 SEO 和内容获客的文章数量�?,
      icon: FileText,
      color: "stone" as const,
    },
    {
      label: "产品分类�?,
      value: categories.length,
      description: "当前启用的产品分类数量，不再使用占位统计�?,
      icon: Layers,
      color: "stone" as const,
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      <section>
        <p className="mb-2 text-xs font-black uppercase tracking-[0.4em] text-stone-400">
          System Control Center
        </p>
        <h1 className="text-4xl font-bold leading-none tracking-tight text-stone-900">
          管理中控�?        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone-500">
          在这里查看询盘趋势、国家来源、热门产品和站点内容规模，快速判断当前站点的获客情况�?        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-[3rem] border border-stone-100 bg-white p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-stone-900">询盘趋势</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-stone-400">
                Inquiry Generation Trend
              </p>
            </div>
            <div className="flex h-8 items-center rounded-full bg-stone-100 p-1">
              <button className="h-full rounded-full bg-white px-4 text-[10px] font-black uppercase tracking-widest text-stone-900 shadow-sm">
                最�?7 �?              </button>
            </div>
          </div>

          <div className="space-y-6">
            {snapshot.trend.map((item) => (
              <div key={item.date} className="flex items-center gap-6">
                <span className="w-24 text-[10px] font-black uppercase tracking-widest text-stone-400 tabular-nums">
                  {item.date}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-stone-50">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-1000"
                    style={{ width: `${Math.max(item.count * 12, item.count ? 8 : 0)}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-bold tabular-nums text-stone-900">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="relative overflow-hidden rounded-[3rem] bg-stone-900 p-10 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10 texture-carbon" />
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-3">
              <Globe2 className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-bold">询盘国家分布</h3>
            </div>

            <div className="space-y-4">
              {snapshot.topCountries.length ? (
                snapshot.topCountries.slice(0, 6).map((item) => (
                  <div
                    key={item.countryCode}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[10px] font-black">
                        {item.countryCode}
                      </div>
                      <div>
                        <p className="text-xs font-bold capitalize text-white">
                          {item.countryGroup || item.countryCode}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-black tabular-nums">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="py-10 text-center text-sm italic text-stone-500">
                  暂无国家分布数据
                </p>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <article className="rounded-[3rem] border border-stone-100 bg-white p-10">
          <div className="mb-8 flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-stone-900">询盘转化排行</h3>
          </div>
          <div className="space-y-3">
            {snapshot.topProductsByInquiry.length ? (
              snapshot.topProductsByInquiry.slice(0, 5).map((item, index) => (
                <div
                  key={`inquiry-${item.productId}`}
                  className="flex items-center justify-between rounded-2xl border border-stone-50 p-4 transition-all hover:border-amber-100 hover:bg-amber-50/20"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-stone-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-bold text-stone-900">{item.productName}</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-amber-600">
                    {item.count} Inquiries
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm italic text-stone-400">暂无询盘排行数据</p>
            )}
          </div>
        </article>

        <article className="rounded-[3rem] border border-stone-100 bg-white p-10">
          <div className="mb-8 flex items-center gap-3">
            <MousePointer2 className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-bold text-stone-900">高频浏览产品</h3>
          </div>
          <div className="space-y-3">
            {snapshot.topProductsByViews.length ? (
              snapshot.topProductsByViews.slice(0, 5).map((item, index) => (
                <div
                  key={`view-${item.productId}`}
                  className="flex items-center justify-between rounded-2xl border border-stone-50 p-4 transition-all hover:border-blue-100 hover:bg-blue-50/20"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-stone-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-bold text-stone-900">{item.productName}</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                    {item.count} Views
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm italic text-stone-400">暂无浏览排行数据</p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  FileText,
  Globe2,
  Layers,
  MessageSquare,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";

import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { listAdminBlogPosts } from "@/features/blog/queries";
import { getDashboardSnapshot } from "@/features/dashboard/queries";
import { getFeatureGate } from "@/features/plans/access";
import { listAdminCategories, listAdminProducts } from "@/features/products/queries";
import { listRecentSiteChangeLogs } from "@/features/sites/change-logs";
import { getCurrentSiteFromRequest } from "@/features/sites/queries";

export const dynamic = "force-dynamic";

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: typeof Users;
}) {
  return (
    <article className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-50 text-stone-700">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-300">
          Metric
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold text-stone-500">{label}</p>
      <p className="mt-2 text-4xl font-black tracking-tight text-stone-950">{value}</p>
      <p className="mt-4 text-sm leading-6 text-stone-500">{description}</p>
    </article>
  );
}

export default async function AdminDashboardPage() {
  const currentSite = await getCurrentSiteFromRequest();
  const gate = await getFeatureGate("dashboard_analytics", currentSite.plan, currentSite.id);

  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }

  const [snapshot, products, posts, categories, siteChangeLogs] = await Promise.all([
    getDashboardSnapshot(currentSite.id),
    listAdminProducts(currentSite.seedPackKey, undefined, currentSite.id),
    listAdminBlogPosts(currentSite.seedPackKey, undefined, currentSite.id),
    listAdminCategories(currentSite.seedPackKey, currentSite.id),
    listRecentSiteChangeLogs(6, currentSite.id),
  ]);

  const cards = [
    {
      label: "New inquiries today",
      value: snapshot.cards.today,
      description: "Fresh leads received today for the current client site.",
      icon: Users,
    },
    {
      label: "Inquiries this week",
      value: snapshot.cards.thisWeek,
      description: "Seven-day inquiry trend for this site.",
      icon: TrendingUp,
    },
    {
      label: "Pending follow-up",
      value: snapshot.cards.pending,
      description: "Open inquiries that still need a response or next action.",
      icon: CalendarClock,
    },
    {
      label: "Products",
      value: products.length,
      description: "Products currently available in the admin catalog.",
      icon: Package,
    },
    {
      label: "Blog posts",
      value: posts.length,
      description: "Published and draft blog content owned by this site.",
      icon: FileText,
    },
    {
      label: "Categories",
      value: categories.length,
      description: "Product categories currently structuring the catalog.",
      icon: Layers,
    },
  ];

  const setupProgressSteps = [
    {
      done: products.length >= 3,
      label: `Upload at least 3 products (${products.length} now)`,
      href: "/admin/products/new",
      cta: "Add product",
    },
    {
      done: posts.length >= 1,
      label: `Publish at least 1 blog post (${posts.length} now)`,
      href: "/admin/blog/new",
      cta: "Create post",
    },
    {
      done: categories.length >= 2,
      label: `Create at least 2 product categories (${categories.length} now)`,
      href: "/admin/categories",
      cta: "Manage categories",
    },
    {
      done: snapshot.cards.pending === 0 && snapshot.cards.thisWeek > 0,
      label: "Clear the current inquiry queue",
      href: "/admin/inquiries",
      cta: "View inquiries",
    },
  ];

  const setupProgress = Math.round(
    (setupProgressSteps.filter((step) => step.done).length / setupProgressSteps.length) * 100,
  );

  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-stone-400">
              Client dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">
              {currentSite.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500">
              This view gives you the operating summary for the active client site: package,
              content readiness, inquiry load, and the latest commercial changes.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">Plan</p>
              <p className="mt-2 text-2xl font-bold text-stone-950">{currentSite.plan}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                Recent changes
              </p>
              <p className="mt-2 text-2xl font-bold text-stone-950">{siteChangeLogs.length}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
              Sales owner
            </p>
            <p className="mt-2 text-lg font-bold text-stone-950">
              {currentSite.salesOwner || "Unassigned"}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
              Deal stage
            </p>
            <p className="mt-2 text-lg font-bold text-stone-950">
              {currentSite.dealStage || "lead"}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
              Renewal date
            </p>
            <p className="mt-2 text-lg font-bold text-stone-950">
              {currentSite.renewalDate
                ? new Date(currentSite.renewalDate).toLocaleDateString("zh-CN")
                : "Not set"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                Setup progress
              </p>
              <h2 className="mt-2 text-2xl font-bold text-stone-950">Client handoff readiness</h2>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-right">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-600">
                Progress
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-700">{setupProgress}%</p>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${setupProgress}%` }} />
          </div>

          <div className="mt-6 space-y-3">
            {setupProgressSteps.map((step) => (
              <div
                className="flex flex-col gap-3 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                key={step.label}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step.done ? "bg-emerald-100 text-emerald-700" : "bg-white text-stone-400"
                    }`}
                  >
                    {step.done ? <Activity className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                  </div>
                  <span className={`text-sm ${step.done ? "text-stone-400 line-through" : "font-medium text-stone-900"}`}>
                    {step.label}
                  </span>
                </div>
                {!step.done ? (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
                    href={step.href}
                  >
                    {step.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                Commercial history
              </p>
              <h2 className="mt-2 text-2xl font-bold text-stone-950">Recent plan changes</h2>
            </div>
            <Link className="text-sm font-semibold text-blue-600 hover:text-blue-700" href="/admin/sites">
              Open site control
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {siteChangeLogs.length ? (
              siteChangeLogs.map((log) => (
                <div className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-4" key={log.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{log.summary}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        {log.actorLabel} / {new Date(log.createdAt).toLocaleString("zh-CN")}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                      {log.actionType}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-200 px-4 py-5 text-sm text-stone-500">
                No plan or feature override changes have been recorded yet.
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-stone-950">Top inquiry countries</h2>
          </div>
          <div className="mt-5 space-y-3">
            {snapshot.topCountries.length ? (
              snapshot.topCountries.slice(0, 6).map((item) => (
                <div
                  className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 px-4 py-4"
                  key={item.countryCode}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-black text-stone-700">
                      {item.countryCode}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {item.countryGroup || item.countryCode}
                      </p>
                      <p className="text-xs text-stone-500">{item.countryCode}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-stone-900">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-stone-200 px-4 py-5 text-sm text-stone-500">
                No country data yet.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-bold text-stone-950">Top products by inquiry</h2>
          </div>
          <div className="mt-5 space-y-3">
            {snapshot.topProductsByInquiry.length ? (
              snapshot.topProductsByInquiry.slice(0, 6).map((item, index) => (
                <div
                  className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 px-4 py-4"
                  key={item.productId}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-black text-stone-700">
                      {index + 1}
                    </div>
                    <p className="text-sm font-semibold text-stone-900">{item.productName}</p>
                  </div>
                  <span className="text-sm font-bold text-stone-900">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-stone-200 px-4 py-5 text-sm text-stone-500">
                No inquiry-linked products yet.
              </p>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

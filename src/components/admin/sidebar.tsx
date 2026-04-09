"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getFeatureAvailability, type FeatureKey, type SitePlan } from "@/lib/plans";

const navItems = [
  { label: "仪表�?, href: "/admin", featureKey: "dashboard_analytics" as const },
  { label: "首页管理", href: "/admin/pages/home" },
  { label: "关于我们", href: "/admin/pages/about" },
  { label: "联系我们", href: "/admin/pages/contact" },
  { label: "站点设置", href: "/admin/settings" },
  { label: "产品分类", href: "/admin/categories" },
  { label: "产品管理", href: "/admin/products" },
  { label: "博客管理", href: "/admin/blog", featureKey: "blog_management" as const },
  { label: "图库管理", href: "/admin/media" },
  { label: "文件管理", href: "/admin/files" },
  { label: "询盘管理", href: "/admin/inquiries" },
  {
    label: "回复模板",
    href: "/admin/reply-templates",
    featureKey: "reply_templates" as const,
  },
  { label: "报价申请", href: "/admin/quotes", featureKey: "quotes" as const },
  { label: "SEO / AI", href: "/admin/seo-ai" },
] satisfies ReadonlyArray<{
  label: string;
  href: string;
  featureKey?: FeatureKey;
}>;

function FeatureTag({
  currentPlan,
  featureKey,
}: {
  currentPlan: SitePlan;
  featureKey?: FeatureKey;
}) {
  if (!featureKey) {
    return null;
  }

  const availability = getFeatureAvailability({
    currentPlan,
    featureKey,
  });

  if (availability.status === "included") {
    return null;
  }

  const label = availability.requiredPlan === "growth" ? "获客�? : "AI�?;

  return (
    <span className="rounded-full bg-stone-200 px-2 py-1 text-[11px] font-semibold text-stone-600">
      {label}
    </span>
  );
}

export function Sidebar({ currentPlan }: { currentPlan: SitePlan }) {
  const pathname = usePathname();

  return (
    <aside className="border-r border-stone-200 bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
        Unified Admin
      </p>
      <p className="mt-3 text-2xl font-semibold text-stone-950">管理中心</p>
      <nav className="mt-8 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              className={[
                "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-stone-950 text-white"
                  : "text-stone-700 hover:bg-stone-100",
              ].join(" ")}
              href={item.href}
            >
              <span>{item.label}</span>
              {!isActive ? (
                <FeatureTag currentPlan={currentPlan} featureKey={item.featureKey} />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

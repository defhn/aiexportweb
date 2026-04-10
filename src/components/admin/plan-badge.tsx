import { getPlanSummary, type SitePlan } from "@/lib/plans";

export function PlanBadge({ plan }: { plan: SitePlan }) {
  const summary = getPlanSummary(plan);
  const className =
    plan === "basic"
      ? "bg-stone-100 text-stone-700"
      : plan === "growth"
        ? "bg-amber-100 text-amber-800"
        : "bg-emerald-100 text-emerald-800";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      当前套餐：{summary.nameZh}
    </span>
  );
}

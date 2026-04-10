import { getPlanSummary, type SitePlan } from "@/lib/plans";

export function PlanBadge({ plan }: { plan: SitePlan }) {
  const summary = getPlanSummary(plan);
  const planNameZh =
    plan === "basic"
      ? "\u57fa\u7840\u7248"
      : plan === "growth"
        ? "\u589e\u957f\u7248"
        : "AI\u9500\u552e\u589e\u957f\u7248";

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
      {"\u5f53\u524d\u5957\u9910\uff1a"}
      {planNameZh || summary.nameZh}
    </span>
  );
}

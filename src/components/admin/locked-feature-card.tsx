import Link from "next/link";

import type { FeatureGate } from "@/features/plans/access";
import { getPlanSummary } from "@/lib/plans";

export function LockedFeatureCard({
  gate,
  compact = false,
}: {
  gate: FeatureGate;
  compact?: boolean;
}) {
  const upgradePlanName = gate.upgradePlan
    ? getPlanSummary(gate.upgradePlan).nameZh
    : "Higher Plan";
  const isTrialExhausted = gate.limit !== null && gate.usageCount >= gate.limit;

  return (
    <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
        Upgrade Required
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-stone-950">{gate.upgradeTitle}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-700">
        {gate.upgradeDescription}
      </p>

      <div className="mt-5 rounded-2xl bg-white/80 p-4 text-sm text-stone-700">
        <p>
          Current plan:{" "}
          <span className="font-semibold text-stone-950">{gate.currentPlanNameZh}</span>
        </p>
        <p className="mt-2">
          Recommended upgrade:{" "}
          <span className="font-semibold text-stone-950">{upgradePlanName}</span>
        </p>
        {gate.limit !== null ? (
          <p className="mt-2">
            Current usage:{" "}
            <span className="font-semibold text-stone-950">
              {gate.usageCount}/{gate.limit}
            </span>
          </p>
        ) : null}
        <p className="mt-2 text-xs text-stone-500">
          {isTrialExhausted
            ? "The trial quota for this feature has been used up on the current site. Upgrade the site plan and refresh to unlock it immediately."
            : "Change the site plan in /admin/sites and this module will unlock for the current site without redeploying."}
        </p>
      </div>

      <ul className="mt-5 space-y-3 text-sm text-stone-700">
        {gate.benefits.map((benefit) => (
          <li
            key={benefit}
            className="rounded-2xl bg-white/80 px-4 py-3 leading-6 text-stone-700"
          >
            {benefit}
          </li>
        ))}
      </ul>

      <div className={`mt-6 flex flex-wrap gap-3 ${compact ? "" : "items-center"}`}>
        <Link
          className="rounded-full bg-stone-950 px-5 py-2 text-sm font-medium text-white"
          href={gate.salesContactHref}
        >
          Upgrade to {upgradePlanName}
        </Link>
        {gate.pricingHref ? (
          <Link
            className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700"
            href={gate.pricingHref}
          >
            View Plans
          </Link>
        ) : null}
        <Link
          className="rounded-full border border-amber-300 bg-white px-5 py-2 text-sm font-medium text-amber-800"
          href="/admin/sites"
        >
          Change Current Site Plan
        </Link>
      </div>
    </section>
  );
}

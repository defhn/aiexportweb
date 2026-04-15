import Link from "next/link";

import { seedPackKeys } from "@/db/seed";
import { saveSiteAction } from "@/features/sites/actions";
import { listRecentSiteChangeLogs } from "@/features/sites/change-logs";
import { listSites } from "@/features/sites/queries";
import { getAdminSessionFromCookies } from "@/lib/admin-auth";
import {
  allFeatureKeys,
  type FeatureKey,
  getFeatureAvailability,
  getFeatureRule,
  getPlanSummary,
  type SitePlan,
} from "@/lib/plans";
import { getAllTemplates } from "@/templates";

const inputClassName =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClassName = "text-xs font-bold uppercase tracking-[0.2em] text-stone-500";

const planOrder: SitePlan[] = ["basic", "growth", "ai_sales"];
const priceFormatter = new Intl.NumberFormat("en-US");
const dealStageLabels: Record<string, string> = {
  lead: "Lead",
  proposal: "Proposal",
  negotiation: "Negotiation",
  active_client: "Active client",
  renewal_due: "Renewal due",
  churn_risk: "Churn risk",
};

function getDefaultPlanFeatures(requiredPlan: SitePlan) {
  return allFeatureKeys.filter((featureKey) => getFeatureRule(featureKey).requiredPlan === requiredPlan);
}

function getFeatureStateLabel(
  sitePlan: SitePlan,
  featureKey: FeatureKey,
  enabledFeatures: FeatureKey[] = [],
) {
  const availability = getFeatureAvailability({
    currentPlan: sitePlan,
    featureKey,
    enabledFeatures,
  });

  if (enabledFeatures.includes(featureKey) && planOrder.indexOf(sitePlan) < planOrder.indexOf(availability.requiredPlan)) {
    return {
      label: "Manual override",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: availability.status === "included" ? "Included by plan" : "Locked by plan",
    className:
      availability.status === "included"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-stone-100 text-stone-600",
  };
}

function getIncludedFeatureCount(sitePlan: SitePlan) {
  return allFeatureKeys.filter((featureKey) => {
    const availability = getFeatureAvailability({ currentPlan: sitePlan, featureKey });
    return availability.status === "included";
  }).length;
}

function getManualOverrideFeatures(sitePlan: SitePlan, enabledFeatures: FeatureKey[]) {
  return enabledFeatures.filter((featureKey) => {
    const availability = getFeatureAvailability({ currentPlan: sitePlan, featureKey });
    return availability.status !== "included";
  });
}

function getNextUpgrade(sitePlan: SitePlan) {
  const currentIndex = planOrder.indexOf(sitePlan);
  return currentIndex >= planOrder.length - 1 ? null : getPlanSummary(planOrder[currentIndex + 1]!);
}

export default async function AdminSitesPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  const session = await getAdminSessionFromCookies();
  const [allSites, params, recentLogs] = await Promise.all([
    listSites(),
    searchParams,
    listRecentSiteChangeLogs(10),
  ]);
  const templates = getAllTemplates();
  const saved = params?.saved === "1";
  const sites =
    session?.role === "super_admin" || !session?.siteId
      ? allSites
      : allSites.filter((site) => site.id === session.siteId);
  const canCreateSite = session?.role === "super_admin";

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">
            Multi-site control
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
            Sites, plans, and upsells
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Keep one shared codebase, then use this page to switch each client site between core
            plans and one-off feature upgrades. Changes apply on the next request with no redeploy.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Client admins can manage their own site package here. Employees can still see locked
            modules in the menu, but they cannot change plans or unlock features.
          </p>
        </div>
        {saved ? (
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Saved
          </div>
        ) : null}
      </div>

      <section className="grid gap-5">
        {recentLogs.length ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                  Recent activity
                </p>
                <h2 className="mt-2 text-lg font-bold text-stone-950">Plan and add-on changes</h2>
              </div>
              <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600">
                {recentLogs.length} recent records
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {recentLogs.map((log) => (
                <div
                  className="flex flex-col gap-2 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-4 md:flex-row md:items-start md:justify-between"
                  key={log.id}
                >
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
              ))}
            </div>
          </div>
        ) : null}

        {sites.map((site) => {
          const enabledFeatures = site.enabledFeaturesJson ?? [];
          const includedFeatureCount = getIncludedFeatureCount(site.plan);
          const manualOverrides = getManualOverrideFeatures(site.plan, enabledFeatures);
          const nextUpgrade = getNextUpgrade(site.plan);
          return (
            <form
              action={saveSiteAction}
              className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
              key={site.slug}
            >
              <input name="id" type="hidden" value={site.id ?? ""} />

              <div className="mb-4 flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-stone-950">{site.name}</p>
                  <p className="text-xs text-stone-500">
                    Current package: {getPlanSummary(site.plan).nameZh} / {getPlanSummary(site.plan).nameEn}
                  </p>
                </div>
                <p className="max-w-xl text-xs leading-5 text-stone-500">
                  {getPlanSummary(site.plan).descriptionZh}
                </p>
              </div>

              <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                    Package price
                  </p>
                  <p className="mt-2 text-2xl font-bold text-stone-950">
                    RMB {priceFormatter.format(getPlanSummary(site.plan).price)}
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                    Included modules
                  </p>
                  <p className="mt-2 text-2xl font-bold text-stone-950">{includedFeatureCount}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                    Manual add-ons
                  </p>
                  <p className="mt-2 text-2xl font-bold text-stone-950">{manualOverrides.length}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                    Next upsell
                  </p>
                  <p className="mt-2 text-lg font-bold text-stone-950">
                    {nextUpgrade ? nextUpgrade.nameEn : "Top package"}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {nextUpgrade ? `Unlock more modules at RMB ${priceFormatter.format(nextUpgrade.price)}.` : "This site already uses the highest package."}
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 md:col-span-2 xl:col-span-4">
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                        Sales owner
                      </p>
                      <p className="mt-2 text-lg font-bold text-stone-950">
                        {site.salesOwner || "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                        Deal stage
                      </p>
                      <p className="mt-2 text-lg font-bold text-stone-950">
                        {dealStageLabels[site.dealStage ?? "lead"] ?? "Lead"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-stone-400">
                        Renewal date
                      </p>
                      <p className="mt-2 text-lg font-bold text-stone-950">
                        {site.renewalDate
                          ? new Date(site.renewalDate).toLocaleDateString("zh-CN")
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
                <label className="space-y-2">
                  <span className={labelClassName}>Site name</span>
                  <input className={inputClassName} defaultValue={site.name} name="name" />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Slug</span>
                  <input className={inputClassName} defaultValue={site.slug} name="slug" />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Plan</span>
                  <select className={inputClassName} defaultValue={site.plan} name="plan">
                    <option value="basic">Basic</option>
                    <option value="growth">Growth</option>
                    <option value="ai_sales">AI Sales</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Status</span>
                  <select className={inputClassName} defaultValue={site.status} name="status">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-4">
                <label className="space-y-2">
                  <span className={labelClassName}>Template</span>
                  <select className={inputClassName} defaultValue={site.templateId} name="templateId">
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} / {template.id}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Seed pack</span>
                  <select className={inputClassName} defaultValue={site.seedPackKey} name="seedPackKey">
                    {seedPackKeys.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Domain</span>
                  <input className={inputClassName} defaultValue={site.domain ?? ""} name="domain" />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Subdomain</span>
                  <input className={inputClassName} defaultValue={site.subdomain ?? ""} name="subdomain" />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className={labelClassName}>Domain aliases</span>
                <textarea
                  className={`${inputClassName} min-h-24 resize-y`}
                  defaultValue={(site.domainAliases ?? []).join("\n")}
                  name="domainAliases"
                  placeholder={"example.com\nwww.example.com\npreview.example.com"}
                />
                <span className="block text-xs leading-5 text-stone-500">
                  Add every host that should resolve to this site. The primary domain above is synced
                  automatically, and each extra host can be entered on a new line.
                </span>
              </label>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_0.6fr]">
                <label className="space-y-2">
                  <span className={labelClassName}>Client company</span>
                  <input className={inputClassName} defaultValue={site.companyName} name="companyName" />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Logo URL</span>
                  <input className={inputClassName} defaultValue={site.logoUrl ?? ""} name="logoUrl" />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Primary color</span>
                  <input
                    className={inputClassName}
                    defaultValue={site.primaryColor ?? ""}
                    name="primaryColor"
                    placeholder="#2563eb"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_0.9fr_0.9fr]">
                <label className="space-y-2">
                  <span className={labelClassName}>Sales owner</span>
                  <input
                    className={inputClassName}
                    defaultValue={site.salesOwner ?? ""}
                    name="salesOwner"
                    placeholder="Alice / Bob"
                  />
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Deal stage</span>
                  <select
                    className={inputClassName}
                    defaultValue={site.dealStage ?? "lead"}
                    name="dealStage"
                  >
                    {Object.entries(dealStageLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className={labelClassName}>Renewal date</span>
                  <input
                    className={inputClassName}
                    defaultValue={
                      site.renewalDate
                        ? new Date(site.renewalDate).toISOString().slice(0, 10)
                        : ""
                    }
                    name="renewalDate"
                    type="date"
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className={labelClassName}>Contract notes</span>
                <textarea
                  className={`${inputClassName} min-h-28 resize-y`}
                  defaultValue={site.contractNotes ?? ""}
                  name="contractNotes"
                  placeholder="Commercial notes, renewal reminders, custom terms, or internal delivery context."
                />
              </label>

              <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
                <div className="mb-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                    Sales panel
                  </p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    Each feature shows its default package and whether this site gets it through the
                    selected plan or a manual add-on.
                  </p>
                </div>

                <div className="mb-4 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                      Current add-on summary
                    </p>
                    {manualOverrides.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {manualOverrides.map((featureKey) => (
                          <span
                            className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
                            key={`${site.slug}-summary-${featureKey}`}
                          >
                            {getFeatureRule(featureKey).labelZh}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-stone-500">
                        No manual add-ons yet. This site currently follows its package defaults only.
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                      Sales talking point
                    </p>
                    <p className="mt-3 text-sm leading-6 text-stone-600">
                      {nextUpgrade
                        ? `If this client needs more automation, the clean next step is ${nextUpgrade.nameEn}. Keep the core package on plan, then use manual add-ons only for exceptions.`
                        : "This client is already on the highest package, so keep using manual add-ons only for custom commercial terms."}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  {planOrder.map((planKey) => (
                    <div className="rounded-2xl border border-stone-200 bg-white p-4" key={`${site.slug}-${planKey}`}>
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-stone-950">
                            {getPlanSummary(planKey).nameZh}
                          </p>
                          <p className="text-xs text-stone-500">{getPlanSummary(planKey).taglineZh}</p>
                        </div>
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                          Default package
                        </span>
                      </div>

                      <div className="space-y-2">
                        {getDefaultPlanFeatures(planKey).map((featureKey) => {
                          const rule = getFeatureRule(featureKey);
                          const state = getFeatureStateLabel(site.plan, featureKey, enabledFeatures);
                          return (
                            <label
                              className="flex items-start gap-3 rounded-xl border border-stone-200 px-3 py-3 text-sm"
                              key={`${site.slug}-${featureKey}`}
                            >
                              <input
                                className="mt-1 h-4 w-4 rounded border-stone-300"
                                defaultChecked={enabledFeatures.includes(featureKey)}
                                name="enabledFeaturesJson"
                                type="checkbox"
                                value={featureKey}
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block font-medium text-stone-900">{rule.labelZh}</span>
                                <span className="mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold text-stone-700">
                                  <span className={`rounded-full px-2 py-1 ${state.className}`}>{state.label}</span>
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Link
                    className="font-semibold text-blue-600 hover:text-blue-700"
                    href={`/?site=${site.slug}`}
                    target="_blank"
                  >
                    Preview site
                  </Link>
                  <span className="text-stone-400">/</span>
                  <Link className="font-semibold text-stone-700 hover:text-stone-950" href={`/admin?site=${site.slug}`}>
                    Open this site in admin
                  </Link>
                </div>
                <button
                  className="rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                  type="submit"
                >
                  Save site
                </button>
              </div>
            </form>
          );
        })}
      </section>

      {canCreateSite ? (
        <form action={saveSiteAction} className="rounded-3xl border border-dashed border-stone-300 bg-white p-5">
          <h2 className="text-lg font-bold text-stone-950">Add client site</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            New sites use the shared application immediately. The selected plan controls locked
            pages, feature quotas, and API access without a separate deployment.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            <input className={inputClassName} name="name" placeholder="Client Demo" />
            <input className={inputClassName} name="slug" placeholder="client-demo" />
            <select className={inputClassName} name="templateId">
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} / {template.id}
                </option>
              ))}
            </select>
            <select className={inputClassName} name="plan" defaultValue="basic">
              <option value="basic">Basic</option>
              <option value="growth">Growth</option>
              <option value="ai_sales">AI Sales</option>
            </select>
          </div>
          <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Optional feature overrides
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {allFeatureKeys.map((featureKey) => {
                const rule = getFeatureRule(featureKey);
                return (
                  <label
                    key={`new-${featureKey}`}
                    className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm"
                  >
                    <input
                      className="mt-1 h-4 w-4 rounded border-stone-300"
                      name="enabledFeaturesJson"
                      type="checkbox"
                      value={featureKey}
                    />
                    <span>
                      <span className="block font-medium text-stone-900">{rule.labelZh}</span>
                      <span className="block text-xs text-stone-500">
                        Default plan: {getPlanSummary(rule.requiredPlan).nameZh}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            <select className={inputClassName} name="seedPackKey" defaultValue="cnc">
              {seedPackKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
            <input className={inputClassName} name="domain" placeholder="client.example.com" />
            <input className={inputClassName} name="subdomain" placeholder="client" />
            <input className={inputClassName} name="companyName" placeholder="Client Company" />
          </div>
          <textarea
            className={`${inputClassName} mt-4 min-h-24 resize-y`}
            name="domainAliases"
            placeholder={"Optional domain aliases, one per line\nexample.com\nwww.example.com"}
          />
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <input className={inputClassName} name="salesOwner" placeholder="Sales owner" />
            <select className={inputClassName} name="dealStage" defaultValue="lead">
              {Object.entries(dealStageLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input className={inputClassName} name="renewalDate" type="date" />
          </div>
          <textarea
            className={`${inputClassName} mt-4 min-h-24 resize-y`}
            name="contractNotes"
            placeholder="Contract notes"
          />
          <button
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            type="submit"
          >
            Create site
          </button>
        </form>
      ) : null}
    </main>
  );
}

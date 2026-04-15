import Link from "next/link";

import { seedPackKeys } from "@/db/seed";
import { saveSiteAction } from "@/features/sites/actions";
import { listSites } from "@/features/sites/queries";
import { getAllTemplates } from "@/templates";

const inputClassName =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClassName = "text-xs font-bold uppercase tracking-[0.2em] text-stone-500";

export default async function AdminSitesPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  const [sites, params] = await Promise.all([listSites(), searchParams]);
  const templates = getAllTemplates();
  const saved = params?.saved === "1";

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">
            Multi-site control
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-stone-950">
            Sites, templates, and plans
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            One shared codebase can serve multiple client sites. Change the industry template,
            seed content, custom domain, and plan here. Preview locally with
            <code className="mx-1 rounded bg-stone-100 px-1 py-0.5">?site=slug</code>
            without redeploying.
          </p>
        </div>
        {saved ? (
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Saved
          </div>
        ) : null}
      </div>

      <section className="grid gap-5">
        {sites.map((site) => (
          <form
            action={saveSiteAction}
            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
            key={site.slug}
          >
            <input name="id" type="hidden" value={site.id ?? ""} />
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
                <input
                  className={inputClassName}
                  defaultValue={site.subdomain ?? ""}
                  name="subdomain"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_0.6fr]">
              <label className="space-y-2">
                <span className={labelClassName}>Client company</span>
                <input
                  className={inputClassName}
                  defaultValue={site.companyName}
                  name="companyName"
                />
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

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Link
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                href={`/?site=${site.slug}`}
                target="_blank"
              >
                Preview site
              </Link>
              <button
                className="rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                type="submit"
              >
                Save site
              </button>
            </div>
          </form>
        ))}
      </section>

      <form action={saveSiteAction} className="rounded-3xl border border-dashed border-stone-300 bg-white p-5">
        <h2 className="text-lg font-bold text-stone-950">Add client site</h2>
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
        <button
          className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          type="submit"
        >
          Create site
        </button>
      </form>
    </main>
  );
}

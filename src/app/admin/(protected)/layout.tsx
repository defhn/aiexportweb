import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Bell } from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminSiteSwitcher } from "@/components/admin/admin-site-switcher";
import { MobileDrawer } from "@/components/admin/mobile-drawer";
import { listSites, getCurrentSiteFromRequest } from "@/features/sites/queries";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const currentRole = session?.role ?? "super_admin";
  const [currentSite, allSites] = await Promise.all([
    getCurrentSiteFromRequest(),
    listSites(),
  ]);
  const sites =
    currentRole === "super_admin" || !session?.siteId
      ? allSites
      : allSites.filter((site) => site.id === session.siteId);

  return (
    <div className="flex h-screen bg-stone-50">
      <aside className="hidden w-64 shrink-0 border-r border-white/5 md:block">
        <AdminSidebar
          currentPlan={currentSite.plan}
          currentRole={currentRole}
          currentSiteName={currentSite.name}
          enabledFeatures={currentSite.enabledFeaturesJson}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4 md:px-6">
          <div className="flex flex-1 items-center gap-3">
            <MobileDrawer
              currentPlan={currentSite.plan}
              currentRole={currentRole}
              currentSiteSlug={currentSite.slug}
              currentSiteName={currentSite.name}
              enabledFeatures={currentSite.enabledFeaturesJson}
              lockSiteSelection={currentRole !== "super_admin"}
              sites={sites.map((site) => ({ slug: site.slug, name: site.name }))}
            />
            <div className="md:hidden">
              <p className="text-sm font-semibold text-stone-700">{currentSite.name}</p>
            </div>
            <div className="hidden md:block">
              <AdminSiteSwitcher
                currentSiteSlug={currentSite.slug}
                disabled={currentRole !== "super_admin"}
                options={sites.map((site) => ({ slug: site.slug, name: site.name }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
              type="button"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-blue-500" />
            </button>
            <div className="h-6 w-px bg-stone-200" />
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-400">
                操作站点
              </p>
              <p className="text-xs font-semibold text-stone-900">
                {currentSite.name} / {currentRole === "super_admin" ? "系统超管" : currentSite.plan === "basic" ? "基础版" : currentSite.plan === "growth" ? "成长版" : "AI 销售版"}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

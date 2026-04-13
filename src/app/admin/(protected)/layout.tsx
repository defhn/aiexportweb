import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Bell } from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MobileDrawer } from "@/components/admin/mobile-drawer";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const currentRole = session?.role ?? "super_admin";

  return (
    <div className="flex h-screen bg-stone-50">
      <aside className="hidden w-64 shrink-0 border-r border-white/5 md:block">
        <AdminSidebar currentRole={currentRole} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4 md:px-6">
          <div className="flex flex-1 items-center gap-2">
            <MobileDrawer currentRole={currentRole} />
            <p className="text-sm font-semibold text-stone-700 md:hidden">后台控制台</p>
            <div className="relative hidden w-full max-w-sm md:block">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx={11} cy={11} r={8} />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="w-full cursor-not-allowed rounded-full border border-stone-200 bg-stone-100 py-1.5 pl-10 pr-4 text-sm text-stone-400 outline-none"
                placeholder="全局搜索（即将上线）"
                type="text"
                disabled
                readOnly
                title="全局搜索功能正在开发中，敬请期待"
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
                管理账户
              </p>
              <p className="text-xs font-semibold text-stone-900">单管理员模式</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

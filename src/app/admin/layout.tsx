import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex h-screen bg-stone-50">
      <aside className="hidden w-64 shrink-0 border-r border-white/5 md:block">
        <AdminSidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-6">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-1.5 pl-10 pr-4 text-sm text-stone-700 outline-none transition-colors focus:border-blue-500 focus:bg-white"
                placeholder="搜索产品、询盘、文章或设置"
                type="text"
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
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-400">
                Admin Account
              </p>
              <p className="text-xs font-semibold text-stone-900">单管理员模式</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

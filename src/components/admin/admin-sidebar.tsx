"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookText,
  Box,
  FileArchive,
  FileStack,
  FolderKanban,
  Globe,
  Images,
  KanbanSquare,
  LayoutDashboard,
  Layers3,
  LogOut,
  MessageSquareMore,
  Package,
  PhoneCall,
  Radar,
  Settings,
  ShieldCheck,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getFeatureAvailability, type FeatureKey, type SitePlan } from "@/lib/plans";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  featureKey?: FeatureKey;
  group?: string;
};

const navigation: NavItem[] = [
  {
    name: "数据看板",
    href: "/admin",
    icon: LayoutDashboard,
    featureKey: "dashboard_analytics",
    group: "overview",
  },
  { name: "产品管理", href: "/admin/products", icon: Package, group: "content" },
  { name: "分类管理", href: "/admin/categories", icon: Tags, group: "content" },
  {
    name: "博客管理",
    href: "/admin/blog",
    icon: BookText,
    featureKey: "blog_management",
    group: "content",
  },
  { name: "媒体库", href: "/admin/media", icon: Images, group: "content" },
  { name: "文件管理", href: "/admin/files", icon: FileArchive, group: "content" },
  {
    name: "询盘管理",
    href: "/admin/inquiries",
    icon: MessageSquareMore,
    featureKey: "inquiry_detail",
    group: "sales",
  },
  {
    name: "报价管理",
    href: "/admin/quotes",
    icon: FileStack,
    featureKey: "quotes",
    group: "sales",
  },
  {
    name: "回复模板",
    href: "/admin/reply-templates",
    icon: FolderKanban,
    featureKey: "reply_templates",
    group: "sales",
  },
  { name: "首页模块", href: "/admin/pages/home", icon: Layers3, group: "site" },
  { name: "关于我们", href: "/admin/pages/about", icon: Globe, group: "site" },
  { name: "联系我们", href: "/admin/pages/contact", icon: PhoneCall, group: "site" },
  { name: "员工管理", href: "/admin/staff", icon: Users, group: "site" },
  { name: "SEO 与 AI", href: "/admin/seo-ai", icon: ShieldCheck, group: "site" },
  { name: "归因分析", href: "/admin/attribution", icon: TrendingUp, group: "crm" },
  { name: "线索流程", href: "/admin/pipeline", icon: KanbanSquare, group: "crm" },
  { name: "RAG 知识库", href: "/admin/rag", icon: Radar, group: "site" },
  { name: "站点设置", href: "/admin/settings", icon: Settings, group: "site" },
];

const groupLabels: Record<string, string> = {
  overview: "总览",
  content: "内容管理",
  sales: "销售管理",
  site: "站点设置",
};

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function PlanTag({
  currentPlan,
  featureKey,
}: {
  currentPlan: SitePlan;
  featureKey?: FeatureKey;
}) {
  if (!featureKey) return null;

  const availability = getFeatureAvailability({ currentPlan, featureKey });
  if (availability.status === "included") return null;

  const label = availability.requiredPlan === "growth" ? "增长版" : "AI 版";

  return (
    <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-stone-400">
      {label}
    </span>
  );
}

export function AdminSidebar({
  currentPlan = "ai_sales",
  onClose,
}: {
  currentPlan?: SitePlan;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const groups = ["overview", "content", "sales", "site"];

  return (
    <div className="flex h-full flex-col bg-stone-950 text-stone-400">
      <div className="hidden border-b border-white/5 px-5 py-5 md:block">
        <Link className="flex items-center gap-3" href="/admin">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
            <Box className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-300">
              后台
            </p>
            <p className="text-sm font-semibold text-white">中文后台</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group) => {
          const items = navigation.filter((item) => item.group === group);
          if (!items.length) return null;

          return (
            <div key={group}>
              <p className="mb-1.5 px-3 text-[9px] font-black uppercase tracking-[0.35em] text-stone-600">
                {groupLabels[group]}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                        active ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          active ? "text-blue-400" : "text-stone-500 group-hover:text-blue-300",
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                      {active ? (
                        <span className="ml-auto h-3.5 w-0.5 rounded-full bg-blue-500" />
                      ) : (
                        <PlanTag currentPlan={currentPlan} featureKey={item.featureKey} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-3">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-4 text-white shadow-xl shadow-blue-950/30">
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-blue-100/80">
            管理中心
          </p>
          <div className="mt-2.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">统一运营后台</p>
              <p className="mt-0.5 text-xs text-blue-100/80">
                产品、内容、询盘集中管理
              </p>
            </div>
            <BarChart3 className="h-4 w-4 text-blue-100" />
          </div>
        </div>

        <button
          className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-300 transition-all hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loggingOut}
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "退出中..." : "退出登录"}
        </button>
      </div>
    </div>
  );
}

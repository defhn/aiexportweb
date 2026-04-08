"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "仪表盘", href: "/admin" },
  { label: "首页管理", href: "/admin/pages/home" },
  { label: "关于我们", href: "/admin/pages/about" },
  { label: "联系我们", href: "/admin/pages/contact" },
  { label: "产品分类", href: "/admin/categories" },
  { label: "产品管理", href: "/admin/products" },
  { label: "博客管理", href: "/admin/blog" },
  { label: "图库管理", href: "/admin/media" },
  { label: "文件管理", href: "/admin/files" },
  { label: "询盘管理", href: "/admin/inquiries" },
  { label: "SEO 与 AI", href: "/admin/seo-ai" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r border-stone-200 bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
        统一后台
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
                "rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-stone-950 text-white"
                  : "text-stone-700 hover:bg-stone-100",
              ].join(" ")}
              href={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

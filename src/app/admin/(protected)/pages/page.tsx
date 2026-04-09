import Link from "next/link";
import { FileText, Home, Info, Phone } from "lucide-react";

const PAGES = [
  {
    key: "home",
    label: "首页",
    description: "Hero 首屏、优势模块、产品推荐、博客精选等所有首页模块的配置。",
    href: "/admin/pages/home",
    icon: Home,
  },
  {
    key: "about",
    label: "关于我们",
    description: "公司简介、工厂能力、团队介绍等 About 页面模块配置。",
    href: "/admin/pages/about",
    icon: Info,
  },
  {
    key: "contact",
    label: "联系我们",
    description: "联系页的标题、描述及显示的联系方式。",
    href: "/admin/pages/contact",
    icon: Phone,
  },
];

export default function AdminPagesIndexPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">页面管理</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          选择要编辑的页面，所有模块的文案、开关、排序均可在此统一配置，无需改代码。
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map(({ key, label, description, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            className="group flex flex-col gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-100">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-950">{label}</h3>
            </div>
            <p className="text-sm leading-6 text-stone-500">{description}</p>
            <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-blue-600">
              <FileText className="h-3.5 w-3.5" />
              编辑页面
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

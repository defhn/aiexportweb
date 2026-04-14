import Link from "next/link";
import { FileText, Home, Info, Phone } from "lucide-react";

const PAGES = [
  {
    key: "home",
    label: "首页模块",
    description:
      "统一管理 Hero 首屏、核心优势、品牌背书、推荐产品、合作流程与 CTA 等首页模块的文案和排序。",
    href: "/admin/pages/home",
    icon: Home,
  },
  {
    key: "about",
    label: "关于我们",
    description:
      "维护公司介绍、工厂能力、团队信息、资质与发展历程等 About 页面内容。",
    href: "/admin/pages/about",
    icon: Info,
  },
  {
    key: "contact",
    label: "联系我们",
    description:
      "配置联系方式、地址、表单说明、地图信息和常见问题等 Contact 页内容。",
    href: "/admin/pages/contact",
    icon: Phone,
  },
];

export default function AdminPagesIndexPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">
          {"站点单页管理"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "在这里分别管理首页模块、关于我们和联系我们等页面的前台展示内容，修改后会直接反映在官网页面。"
          }
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
              {"进入编辑"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

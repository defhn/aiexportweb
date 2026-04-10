import Link from "next/link";
import { FileText, Home, Info, Phone } from "lucide-react";

const PAGES = [
  {
    key: "home",
    label: "\u9996\u9875\u6a21\u5757",
    description:
      "\u7edf\u4e00\u7ba1\u7406 Hero \u9996\u5c4f\u3001\u6838\u5fc3\u4f18\u52bf\u3001\u54c1\u724c\u80cc\u4e66\u3001\u63a8\u8350\u4ea7\u54c1\u3001\u5408\u4f5c\u6d41\u7a0b\u4e0e CTA \u7b49\u9996\u9875\u6a21\u5757\u7684\u6587\u6848\u548c\u6392\u5e8f\u3002",
    href: "/admin/pages/home",
    icon: Home,
  },
  {
    key: "about",
    label: "\u5173\u4e8e\u6211\u4eec",
    description:
      "\u7ef4\u62a4\u516c\u53f8\u4ecb\u7ecd\u3001\u5de5\u5382\u80fd\u529b\u3001\u56e2\u961f\u4fe1\u606f\u3001\u8d44\u8d28\u4e0e\u53d1\u5c55\u5386\u7a0b\u7b49 About \u9875\u9762\u5185\u5bb9\u3002",
    href: "/admin/pages/about",
    icon: Info,
  },
  {
    key: "contact",
    label: "\u8054\u7cfb\u6211\u4eec",
    description:
      "\u914d\u7f6e\u8054\u7cfb\u65b9\u5f0f\u3001\u5730\u5740\u3001\u8868\u5355\u8bf4\u660e\u3001\u5730\u56fe\u4fe1\u606f\u548c\u5e38\u89c1\u95ee\u9898\u7b49 Contact \u9875\u5185\u5bb9\u3002",
    href: "/admin/pages/contact",
    icon: Phone,
  },
];

export default function AdminPagesIndexPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">
          {"\u7ad9\u70b9\u5355\u9875\u7ba1\u7406"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {
            "\u5728\u8fd9\u91cc\u5206\u522b\u7ba1\u7406\u9996\u9875\u6a21\u5757\u3001\u5173\u4e8e\u6211\u4eec\u548c\u8054\u7cfb\u6211\u4eec\u7b49\u9875\u9762\u7684\u524d\u53f0\u5c55\u793a\u5185\u5bb9\uff0c\u4fee\u6539\u540e\u4f1a\u76f4\u63a5\u53cd\u6620\u5728\u5b98\u7f51\u9875\u9762\u3002"
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
              {"\u8fdb\u5165\u7f16\u8f91"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

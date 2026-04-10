import Link from "next/link";
import { FileText, Home, Info, Phone } from "lucide-react";

const PAGES = [
  {
    key: "home",
    label: "妫ｆ牠銆�",
    description: "Hero 妫ｆ牕鐫嗛妴浣风喘閸旀寧膩閸фぜ鈧椒楠囬崫浣瑰腹閼芥劑鈧礁宕ョ€广垻绨块柅澶岀搼閹碘偓閺堝顩绘い鍨侀崸妤冩畱闁板秶鐤嗛妴锟�",
    href: "/admin/pages/home",
    icon: Home,
  },
  {
    key: "about",
    label: "閸忓厖绨幋鎴滄粦",
    description: "閸忣剙寰冪粻鈧禒瀣ㄢ偓浣镐紣閸樺倽鍏橀崝娑栤偓浣告礋闂冪喍绮欑紒宥囩搼 About 妞ょ敻娼板Ο鈥虫健闁板秶鐤嗛妴锟�",
    href: "/admin/pages/about",
    icon: Info,
  },
  {
    key: "contact",
    label: "閼辨梻閮撮幋鎴滄粦",
    description: "閼辨梻閮存い鐢垫畱閺嶅洭顣介妴浣瑰伎鏉╂澘寮烽弰鍓с仛閻ㄥ嫯浠堢化缁樻煙瀵繈鈧拷",
    href: "/admin/pages/contact",
    icon: Phone,
  },
];

export default function AdminPagesIndexPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">妞ょ敻娼扮粻锛勬倞</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          闁瀚ㄧ憰浣虹椽鏉堟垹娈戞い鐢告桨閿涘本澧嶉張澶嬆侀崸妤冩畱閺傚洦顢嶉妴浣哥磻閸忕偨鈧焦甯撴惔蹇撴綆閸欘垰婀銈囩埠娑撯偓闁板秶鐤嗛敍灞炬￥闂団偓閺€閫涘敩閻降鈧拷
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
              缂傛牞绶い鐢告桨
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

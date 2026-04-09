import Link from "next/link";

import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { getFeatureGate } from "@/features/plans/access";
import { updateQuoteStatus } from "@/features/quotes/actions";
import { listQuoteRequests } from "@/features/quotes/queries";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const gate = await getFeatureGate("quotes");

  if (gate.status === "locked") {
    return <LockedFeatureCard gate={gate} />;
  }

  const requests = await listQuoteRequests();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-stone-950">报价申请</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          统一查看前台 RFQ 申请，跟进状态从 new 到 quoted 即可。点击客户名称查看完整报价明细。
        </p>
      </section>

      <div className="space-y-4">
        {requests.length ? (
          requests.map((request) => (
            <article
              key={request.id}
              className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/admin/quotes/${request.id}`}
                    className="text-xl font-semibold text-stone-950 hover:text-blue-600 transition-colors"
                  >
                    {request.name}
                  </Link>
                  <p className="mt-2 text-sm text-stone-600">{request.email}</p>
                  <p className="mt-2 text-sm text-stone-600">{request.companyName || "未填写公司"}</p>
                  <p className="mt-2 text-sm text-stone-600">{request.country || "未填写国家"}</p>
                </div>
                <form action={updateQuoteStatus} className="flex items-center gap-3">
                  <input name="id" type="hidden" value={request.id} />
                  <select
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm"
                    defaultValue={request.status}
                    name="status"
                  >
                    <option value="new">🔵 新申请</option>
                    <option value="reviewing">🟡 审核中</option>
                    <option value="quoted">🟢 已报价</option>
                    <option value="closed">⚫ 已关闭</option>
                  </select>
                  <button
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    type="submit"
                  >
                    保存
                  </button>
                </form>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-stone-200 bg-white p-16 text-center text-stone-400 shadow-sm">
            <p className="text-base font-medium">暂无报价申请</p>
            <p className="mt-1 text-sm">前台 /request-quote 页面提交的 RFQ 会显示在这里</p>
          </div>
        )}
      </div>
    </div>
  );
}

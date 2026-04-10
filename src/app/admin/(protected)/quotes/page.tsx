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
        <h2 className="text-2xl font-semibold text-stone-950">报价请求管理</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          管理客户提交的 RFQ 报价请求。在此更新状态（从 new 到 quoted），并通过电子邮件与客户保持沟通。
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
                  <p className="mt-2 text-sm text-stone-600">{request.companyName || "暂无公司信息"}</p>
                  <p className="mt-2 text-sm text-stone-600">{request.country || "暂无国家信息"}</p>
                </div>
                <form action={updateQuoteStatus} className="flex items-center gap-3">
                  <input name="id" type="hidden" value={request.id} />
                  <select
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm"
                    defaultValue={request.status}
                    name="status"
                  >
                    <option value="new">待处理</option>
                    <option value="reviewing">审核中</option>
                    <option value="quoted">已报价</option>
                    <option value="closed">已关闭</option>
                  </select>
                  <button
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    type="submit"
                  >
                    更新状态
                  </button>
                </form>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-stone-200 bg-white p-16 text-center text-stone-400 shadow-sm">
            <p className="text-base font-medium">暂无报价请求</p>
            <p className="mt-1 text-sm">客户通过 /request-quote 页面提交的 RFQ 将显示在这里</p>
          </div>
        )}
      </div>
    </div>
  );
}

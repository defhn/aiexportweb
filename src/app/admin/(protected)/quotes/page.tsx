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
          统一查看前台 RFQ 申请，跟进状态从 new 到 quoted 即可。
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
                  <h3 className="text-xl font-semibold text-stone-950">{request.name}</h3>
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
                    <option value="new">new</option>
                    <option value="reviewing">reviewing</option>
                    <option value="quoted">quoted</option>
                    <option value="closed">closed</option>
                  </select>
                  <button
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                    type="submit"
                  >
                    更新状态
                  </button>
                </form>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">
                {request.message}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-8 text-sm text-stone-500">
            当前还没有报价申请记录。
          </div>
        )}
      </div>
    </div>
  );
}

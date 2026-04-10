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
        <h2 className="text-2xl font-semibold text-stone-950">閹躲儰鐜悽瀹狀嚞</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          缂佺喍绔撮弻銉ф箙閸撳秴褰� RFQ 閻㈠疇顕敍宀冪鏉╂稓濮搁幀浣风矤 new 閸掞拷 quoted 閸楀啿褰查妴鍌滃仯閸戣顓归幋宄版倳缁夌増鐓￠惇瀣暚閺佸瓨濮ゆ禒閿嬫缂佸棎鈧拷
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
                  <p className="mt-2 text-sm text-stone-600">{request.companyName || "閺堫亜锝為崘娆忓彆閸欙拷"}</p>
                  <p className="mt-2 text-sm text-stone-600">{request.country || "閺堫亜锝為崘娆忔禇鐎癸拷"}</p>
                </div>
                <form action={updateQuoteStatus} className="flex items-center gap-3">
                  <input name="id" type="hidden" value={request.id} />
                  <select
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm"
                    defaultValue={request.status}
                    name="status"
                  >
                    <option value="new">棣冩暩 閺傛壆鏁电拠锟�</option>
                    <option value="reviewing">棣冪厸 鐎光剝鐗虫稉锟�</option>
                    <option value="quoted">棣冪厺 瀹稿弶濮ゆ禒锟�</option>
                    <option value="closed">閳匡拷 瀹告彃鍙ч梻锟�</option>
                  </select>
                  <button
                    className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    type="submit"
                  >
                    娣囨繂鐡�
                  </button>
                </form>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-stone-200 bg-white p-16 text-center text-stone-400 shadow-sm">
            <p className="text-base font-medium">閺嗗倹妫ら幎銉ょ幆閻㈠疇顕�</p>
            <p className="mt-1 text-sm">閸撳秴褰� /request-quote 妞ょ敻娼伴幓鎰唉閻拷 RFQ 娴兼碍妯夌粈鍝勬躬鏉╂瑩鍣�</p>
          </div>
        )}
      </div>
    </div>
  );
}

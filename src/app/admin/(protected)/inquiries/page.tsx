import Link from "next/link";

import { saveInquiryStatus } from "@/features/inquiries/actions";
import {
  listInquiries,
  listInquiryCountryGroups,
  listInquiryTypes,
} from "@/features/inquiries/queries";

type AdminInquiriesPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: "new" | "processing" | "contacted" | "quoted" | "won" | "done" | "";
    inquiryType?: string;
    countryGroup?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({
  searchParams,
}: AdminInquiriesPageProps) {
  const params = (await searchParams) ?? {};
  const [records, inquiryTypes, countryGroups] = await Promise.all([
    listInquiries({
      query: params.q,
      status: params.status,
      inquiryType: params.inquiryType,
      countryGroup: params.countryGroup,
    }),
    listInquiryTypes(),
    listInquiryCountryGroups(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">鐠囥垻娲忕粻锛勬倞</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              缂佺喍绔撮弻銉ф箙鐠囥垻娲忛弶銉︾爱閵嗕礁娴楃€硅翰鈧胶琚崹瀣ㄢ偓渚€妾禒璺烘嫲婢跺嫮鎮婇悩鑸碘偓渚婄礉楠炴儼绻橀崗銉嚊閹懘銆夐悽銊δ侀弶鎸庡灗 AI
              閻㈢喐鍨氶懟杈ㄦ瀮閸ョ偛顦查懡澶屒归妴锟�?            </p>
          </div>
          <Link
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
            href="/admin/inquiries/export"
          >
            鐎电厧鍤� CSV
          </Link>
        </div>
      </section>

      <form className="grid gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-4 xl:grid-cols-5">
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={params.q}
          name="q"
          placeholder="閹兼粎鍌ㄦ慨鎾虫倳閵嗕線鍋栫粻渚库偓浣稿彆閸欏憡鍨ㄦ禍褍鎼�"
        />
        <select
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={params.status ?? ""}
          name="status"
        >
          <option value="">閸忋劑鍎撮悩鑸碘偓锟�</option>
          <option value="new">閺傛壆鍤庣槐锟�</option>
          <option value="processing">鐠虹喕绻樻稉锟�</option>
          <option value="contacted">瀹歌尪浠堢化锟�</option>
          <option value="quoted">瀹稿弶濮ゆ禒锟�</option>
          <option value="won">鐠с垹宕�</option>
          <option value="done">瀹告彃鐣幋锟�</option>
        </select>
        <select
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={params.inquiryType ?? ""}
          name="inquiryType"
        >
          <option value="">閸忋劑鍎寸猾璇茬€�</option>
          {inquiryTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={params.countryGroup ?? ""}
          name="countryGroup"
        >
          <option value="">閸忋劑鍎撮崷鏉垮隘</option>
          {countryGroups.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
          type="submit"
        >
          缁涙盯鈧拷?        </button>
      </form>

      <div className="space-y-4">
        {records.length ? (
          records.map((record) => (
            <article
              key={record.id}
              className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-stone-500">
                    <span>{record.sourceType || record.sourcePage || "general"}</span>
                    <span>{record.countryCode || "N/A"}</span>
                    <span>{record.countryGroup || "Unknown"}</span>
                    <span>{record.inquiryType || "untyped"}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-stone-950">{record.name}</h3>
                  <p className="text-sm text-stone-600">{record.email}</p>
                  <p className="text-sm text-stone-600">
                    {record.companyName || "閺堫亜锝為崘娆忓彆閸欙拷"}
                  </p>
                  <p className="text-sm text-stone-600">
                    {record.productName || "閺堫亜鍙ч懕鏂鹃獓閸濓拷"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <form action={saveInquiryStatus} className="flex items-center gap-3">
                    <input name="id" type="hidden" value={record.id} />
                    <input name="q" type="hidden" value={params.q ?? ""} />
                    <input name="filterStatus" type="hidden" value={params.status ?? ""} />
                    <select
                      className="rounded-full border border-stone-300 px-4 py-2 text-sm"
                      defaultValue={record.status}
                      name="status"
                    >
                      <option value="new">new</option>
                      <option value="processing">processing</option>
                      <option value="done">done</option>
                    </select>
                    <button
                      className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                      type="submit"
                    >
                      閺囧瓨鏌婇悩鑸碘偓锟�?                    </button>
                  </form>
                  <Link
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                    href={`/admin/inquiries/${record.id}`}
                  >
                    閺屻儳婀呯拠锔藉剰
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-stone-700">{record.message}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-stone-500">
                {record.sourceUrl ? <span>{record.sourceUrl}</span> : null}
                {record.attachmentUrl ? (
                  <a
                    className="text-amber-700 underline"
                    href={record.attachmentUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {record.attachmentName || "娑撳娴囬梽鍕"}
                  </a>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-8 text-sm text-stone-500">
            瑜版挸澧犳潻妯荤梾閺堝顕楅惄妯款唶瑜版洏鈧拷?          </div>
        )}
      </div>
    </div>
  );
}

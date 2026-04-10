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
            <h2 className="text-2xl font-semibold text-stone-950">询盘管理</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              查看和管理所有来自网站的询盘，支持按状态、类型、国家组筛选，快速跟进并使用 AI
              辅助生成专业回复
            </p>
          </div>
          <Link
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
            href="/admin/inquiries/export"
          >
            导出 CSV
          </Link>
        </div>
      </section>

      <form className="grid gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-4 xl:grid-cols-5">
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={params.q}
          name="q"
          placeholder="搜索姓名、邮箱、公司或询盘内容"
        />
        <select
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={params.status ?? ""}
          name="status"
        >
          <option value="">全部状态</option>
          <option value="new">待处理</option>
          <option value="processing">跟进中</option>
          <option value="contacted">已联系</option>
          <option value="quoted">已报价</option>
          <option value="won">已成交</option>
          <option value="done">已完成</option>
        </select>
        <select
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={params.inquiryType ?? ""}
          name="inquiryType"
        >
          <option value="">全部类型</option>
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
          <option value="">全部地区</option>
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
          筛选
        </button>
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
                    {record.companyName || "未填写公司名"}
                  </p>
                  <p className="text-sm text-stone-600">
                    {record.productName || "未关联产品"}
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
                      更新状态
                    </button>
                  </form>
                  <Link
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
                    href={`/admin/inquiries/${record.id}`}
                  >
                    查看详情
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
                    {record.attachmentName || "查看附件"}
                  </a>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-8 text-sm text-stone-500">
            暂无符合条件的询盘记录
          </div>
        )}
      </div>
    </div>
  );
}

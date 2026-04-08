import Link from "next/link";

import { listInquiries } from "@/features/inquiries/queries";

type AdminInquiriesPageProps = {
  searchParams?: Promise<{ q?: string; status?: "new" | "processing" | "done" | "" }>;
};

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({
  searchParams,
}: AdminInquiriesPageProps) {
  const params = (await searchParams) ?? {};
  const records = await listInquiries({
    query: params.q,
    status: params.status,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">询盘管理</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              统一查看询盘记录、附件来源、状态和来源页面，并支持 CSV 导出。
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

      <form className="grid gap-4 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_180px_auto]">
        <input
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={params.q}
          name="q"
          placeholder="搜索姓名、邮箱、公司"
        />
        <select
          className="rounded-2xl border border-stone-300 px-4 py-3 text-sm"
          defaultValue={params.status ?? ""}
          name="status"
        >
          <option value="">全部状态</option>
          <option value="new">新建</option>
          <option value="processing">处理中</option>
          <option value="done">已完成</option>
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
                <div>
                  <h3 className="text-xl font-semibold text-stone-950">
                    {record.name}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">{record.email}</p>
                  <p className="mt-2 text-sm text-stone-600">
                    {record.companyName || "No company"}
                  </p>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                  {record.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-stone-700">
                {record.message}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-8 text-sm text-stone-500">
            当前还没有询盘记录。
          </div>
        )}
      </div>
    </div>
  );
}

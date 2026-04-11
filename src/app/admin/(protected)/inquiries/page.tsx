import Link from "next/link";

import { saveInquiryStatus } from "@/features/inquiries/actions";
import {
  listInquiries,
  listInquiryCountryGroups,
  listInquiryTypes,
} from "@/features/inquiries/queries";

// 类型名称中文映射
const INQUIRY_TYPE_LABELS: Record<string, string> = {
  quotation: "询盘报价",
  general: "一般咨询",
  technical: "技术问题",
  sample: "样品申请",
  complaint: "投诉建议",
};

// 来源类型中文映射
const SOURCE_TYPE_LABELS: Record<string, string> = {
  product: "产品页",
  "request-quote": "报价页",
  contact: "联系页",
  general: "通用",
  unknown: "未知",
};

// 地区分组中文映射
const COUNTRY_GROUP_LABELS: Record<string, string> = {
  Unknown: "未知地区",
  "North America": "北美洲",
  Europe: "欧洲",
  "Asia-Pacific": "亚太地区",
  "Middle East": "中东",
  "Latin America": "拉丁美洲",
  Africa: "非洲",
  Oceania: "大洋洲",
};

function getCountryGroupLabel(group?: string | null) {
  if (!group) return "未知地区";
  return COUNTRY_GROUP_LABELS[group] ?? group;
}

function getTypeLabel(type?: string | null) {
  if (!type) return "未分类";
  return INQUIRY_TYPE_LABELS[type] ?? type;
}

function getSourceLabel(source?: string | null) {
  if (!source) return "未知来源";
  return SOURCE_TYPE_LABELS[source] ?? source;
}

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
              {getTypeLabel(item)}
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
              {getCountryGroupLabel(item)}
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
                    <span>{getSourceLabel(record.sourceType || record.sourcePage)}</span>
                    <span>{record.countryCode || "N/A"}</span>
                    <span>{record.countryGroup || "未知地区"}</span>
                    <span>{getTypeLabel(record.inquiryType)}</span>
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
                      <option value="new">待处理</option>
                      <option value="processing">跟进中</option>
                      <option value="contacted">已联系</option>
                      <option value="quoted">已报价</option>
                      <option value="won">已成交</option>
                      <option value="done">已完成</option>
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

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Mail, Phone, Globe, Building, Clock } from "lucide-react";

import { updateQuoteStatus } from "@/features/quotes/actions";
import { getQuoteRequestById } from "@/features/quotes/queries";
import { getFeatureGate } from "@/features/plans/access";
import { LockedFeatureCard } from "@/components/admin/locked-feature-card";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "新申请", color: "bg-blue-100 text-blue-700" },
  reviewing: { label: "审核中", color: "bg-amber-100 text-amber-700" },
  quoted: { label: "已报价", color: "bg-green-100 text-green-700" },
  closed: { label: "已关闭", color: "bg-stone-100 text-stone-600" },
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminQuoteDetailPage({ params }: Props) {
  const gate = await getFeatureGate("quotes");
  if (gate.status === "locked") return <LockedFeatureCard gate={gate} />;

  const { id } = await params;
  const numId = Number.parseInt(id, 10);
  if (!Number.isFinite(numId)) notFound();

  const quote = await getQuoteRequestById(numId);
  if (!quote) notFound();

  const statusMeta = STATUS_LABELS[quote.status] ?? { label: quote.status, color: "bg-stone-100 text-stone-600" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <Link
          href="/admin/quotes"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回报价列表
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-stone-950">{quote.name}</h2>
            <p className="mt-1 text-sm text-stone-500">
              申请时间：{new Date(quote.createdAt).toLocaleString("zh-CN")}
            </p>
          </div>
          <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${statusMeta.color}`}>
            {statusMeta.label}
          </span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* 主内容 */}
        <div className="space-y-6">
          {/* 联系信息 */}
          <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-stone-950">联系信息</h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { icon: Mail, label: "邮箱", value: quote.email },
                { icon: Building, label: "公司", value: quote.companyName || "未填写" },
                { icon: Globe, label: "国家/地区", value: quote.country || "未填写" },
                { icon: Phone, label: "WhatsApp", value: quote.whatsapp || "未填写" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-stone-50 p-2">
                    <Icon className="h-4 w-4 text-stone-500" />
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-stone-500">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-stone-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {/* 需求描述 */}
          {quote.message && (
            <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-stone-950">需求描述</h3>
              <p className="whitespace-pre-wrap text-sm leading-7 text-stone-700">{quote.message}</p>
            </section>
          )}

          {/* 附加字段 */}
          {quote.customFieldsJson && Object.keys(quote.customFieldsJson).length > 0 && (
            <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-stone-950">附加规格信息</h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Object.entries(quote.customFieldsJson).map(([key, value]) => (
                  <div key={key} className="rounded-xl bg-stone-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">{key}</dt>
                    <dd className="mt-1 break-words text-sm font-medium text-stone-900">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* 报价明细（quoteRequestItems）*/}
          {quote.items && quote.items.length > 0 && (
            <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-stone-950">
                <Package className="h-4 w-4 text-blue-600" />
                报价明细（{quote.items.length} 项）
              </h3>
              <div className="divide-y divide-stone-100">
                {quote.items.map((item, index) => (
                  <div key={item.id} className="py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-stone-900">
                          #{index + 1} {item.productName || `产品 ID: ${item.productId ?? "通用"}`}
                        </p>
                        {item.quantity && (
                          <p className="mt-1 text-xs text-stone-500">
                            数量：{item.quantity}{item.unit ? ` ${item.unit}` : ""}
                          </p>
                        )}
                        {item.notes && (
                          <p className="mt-2 whitespace-pre-wrap text-xs leading-6 text-stone-600">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 侧边栏 — 操作 */}
        <aside>
          <section className="sticky top-6 rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-stone-950">更新跟进状态</h3>
            <form action={updateQuoteStatus} className="space-y-4">
              <input name="id" type="hidden" value={quote.id} />
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">当前状态</label>
                <select
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  defaultValue={quote.status}
                  name="status"
                >
                  <option value="new">🔵 新申请</option>
                  <option value="reviewing">🟡 审核中</option>
                  <option value="quoted">🟢 已报价</option>
                  <option value="closed">⚫ 已关闭</option>
                </select>
              </div>
              <button
                className="w-full rounded-full bg-slate-950 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                type="submit"
              >
                保存状态
              </button>
            </form>

            <div className="mt-6 space-y-3 border-t border-stone-100 pt-6">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Clock className="h-3.5 w-3.5" />
                申请于 {new Date(quote.createdAt).toLocaleDateString("zh-CN")}
              </div>
              {quote.email && (
                <a
                  href={`mailto:${quote.email}?subject=Re: Your Quote Request`}
                  className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  发送邮件给客户
                </a>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

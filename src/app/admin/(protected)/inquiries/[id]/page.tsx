import Link from "next/link";
import { notFound } from "next/navigation";

import { InquiryReplyAssistant } from "@/components/admin/inquiry-reply-assistant";
import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { saveInquiryDetail } from "@/features/inquiries/actions";
import { getInquiryById } from "@/features/inquiries/queries";
import { getFeatureGate } from "@/features/plans/access";
import { buildVisibleSpecRows, getProductById } from "@/features/products/queries";
import { listReplyTemplates } from "@/features/reply-templates/queries";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950";

export const dynamic = "force-dynamic";

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const detailGate = await getFeatureGate("inquiry_detail");

  if (detailGate.status === "locked") {
    return <LockedFeatureCard gate={detailGate} />;
  }

  const { id } = await params;
  const inquiryId = Number.parseInt(id, 10);

  if (!Number.isFinite(inquiryId)) {
    notFound();
  }

  const inquiry = await getInquiryById(inquiryId);

  if (!inquiry) {
    notFound();
  }

  const [product, templates, replyGate, classifyGate] = await Promise.all([
    inquiry.productId ? getProductById(inquiry.productId) : Promise.resolve(null),
    listReplyTemplates(),
    getFeatureGate("ai_inquiry_reply"),
    getFeatureGate("ai_inquiry_classification"),
  ]);

  const specs = product
    ? buildVisibleSpecRows({
        defaultFields: product.defaultFields,
        customFields: product.customFields,
      }).map((item) => `${item.label}: ${item.value}`)
    : [];

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-semibold text-stone-950">询盘详情</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            在这里查看客户信息、附件、分类结果，并使用模板或 AI 生成英文回复草稿。
          </p>
        </div>
        <Link
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
          href="/admin/inquiries"
        >
          返回列表
        </Link>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">客户信息</h3>
            <div className="mt-5 space-y-3 text-sm text-stone-700">
              <p>
                <span className="font-medium text-stone-950">姓名：</span>
                {inquiry.name}
              </p>
              <p>
                <span className="font-medium text-stone-950">邮箱：</span>
                {inquiry.email}
              </p>
              <p>
                <span className="font-medium text-stone-950">公司：</span>
                {inquiry.companyName || "未填写"}
              </p>
              <p>
                <span className="font-medium text-stone-950">国家：</span>
                {inquiry.country || "未填写"}{" "}
                {inquiry.countryCode ? `(${inquiry.countryCode})` : ""}
              </p>
              <p>
                <span className="font-medium text-stone-950">WhatsApp：</span>
                {inquiry.whatsapp || "未填写"}
              </p>
              <p>
                <span className="font-medium text-stone-950">来源：</span>
                {inquiry.sourceType || inquiry.sourcePage || "unknown"}
              </p>
              <p>
                <span className="font-medium text-stone-950">产品：</span>
                {inquiry.productName || "未关联产品"}
              </p>
              <p>
                <span className="font-medium text-stone-950">当前类型：</span>
                {inquiry.inquiryType || "未分类"}
              </p>
              {inquiry.attachmentUrl ? (
                <p>
                  <span className="font-medium text-stone-950">附件：</span>
                  <a
                    className="text-amber-700 underline"
                    href={inquiry.attachmentUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {inquiry.attachmentName || "下载附件"}
                  </a>
                </p>
              ) : null}
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">询盘内容</h3>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-stone-700">
              {inquiry.message}
            </p>
            {product ? (
              <div className="mt-5 rounded-2xl bg-stone-50 p-4">
                <p className="text-sm font-medium text-stone-950">关联产品规格</p>
                <ul className="mt-3 space-y-2 text-sm text-stone-700">
                  {specs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>

          <form
            action={saveInquiryDetail}
            className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <input name="id" type="hidden" value={inquiry.id} />
            <h3 className="text-lg font-semibold text-stone-950">跟进设置</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-700">
                状态
                <select className={inputClassName} defaultValue={inquiry.status} name="status">
                  <option value="new">new</option>
                  <option value="processing">processing</option>
                  <option value="done">done</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-stone-700">
                询盘类型
                <input
                  className={inputClassName}
                  defaultValue={inquiry.inquiryType ?? ""}
                  name="inquiryType"
                  placeholder="quotation / technical / sample"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                内部备注
                <textarea
                  className={`${inputClassName} min-h-32`}
                  defaultValue={inquiry.internalNote ?? ""}
                  name="internalNote"
                />
              </label>
            </div>
            <input name="classificationMethod" type="hidden" value="manual" />
            <div className="mt-5 flex justify-end">
              <button
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white"
                type="submit"
              >
                保存跟进信息
              </button>
            </div>
          </form>
        </div>

        <InquiryReplyAssistant
          companyName={inquiry.companyName}
          classifyGate={classifyGate}
          customerEmail={inquiry.email}
          customerName={inquiry.name}
          initialInquiryType={inquiry.inquiryType}
          inquiryId={inquiry.id}
          message={inquiry.message}
          productName={inquiry.productName}
          replyGate={replyGate}
          specs={specs}
          templates={templates.map((template) => ({
            id: template.id,
            title: template.title,
            category: template.category,
            contentEn: template.contentEn,
          }))}
        />
      </section>
    </div>
  );
}

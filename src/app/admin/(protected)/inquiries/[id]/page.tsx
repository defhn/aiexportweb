import Link from "next/link";
import { notFound } from "next/navigation";

import { InquiryReplyAssistant } from "@/components/admin/inquiry-reply-assistant";
import { LockedFeatureCard } from "@/components/admin/locked-feature-card";
import { SecureAttachmentButton } from "@/components/admin/secure-attachment-button";
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
          <h2 className="text-2xl font-semibold text-stone-950">鐠囥垻娲忕拠锔藉剰</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            閸︺劏绻栭柌灞剧叀閻顓归幋铚備繆閹垬鈧線妾禒韬测偓浣稿瀻缁崵绮ㄩ弸婊愮礉楠炴湹濞囬悽銊δ侀弶鎸庡灗 AI 閻㈢喐鍨氶懟杈ㄦ瀮閸ョ偛顦查懡澶屒归妴锟�
          </p>
        </div>
        <Link
          className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700"
          href="/admin/inquiries"
        >
          鏉╂柨娲栭崚妤勩€�
        </Link>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">鐎广垺鍩涙穱鈩冧紖</h3>
            <div className="mt-5 space-y-3 text-sm text-stone-700">
              <p>
                <span className="font-medium text-stone-950">婵挸鎮曢敍锟�</span>
                {inquiry.name}
              </p>
              <p>
                <span className="font-medium text-stone-950">闁喚顔堥敍锟�</span>
                {inquiry.email}
              </p>
              <p>
                <span className="font-medium text-stone-950">閸忣剙寰冮敍锟�</span>
                {inquiry.companyName || "閺堫亜锝為崘锟�"}
              </p>
              <p>
                <span className="font-medium text-stone-950">閸ヨ棄顔嶉敍锟�</span>
                {inquiry.country || "閺堫亜锝為崘锟�"}{" "}
                {inquiry.countryCode ? `(${inquiry.countryCode})` : ""}
              </p>
              <p>
                <span className="font-medium text-stone-950">WhatsApp閿涳拷</span>
                {inquiry.whatsapp || "閺堫亜锝為崘锟�"}
              </p>
              <p>
                <span className="font-medium text-stone-950">閺夈儲绨敍锟�</span>
                {inquiry.sourceType || inquiry.sourcePage || "unknown"}
              </p>
              <p>
                <span className="font-medium text-stone-950">娴溠冩惂閿涳拷</span>
                {inquiry.productName || "閺堫亜鍙ч懕鏂鹃獓閸濓拷"}
              </p>
              <p>
                <span className="font-medium text-stone-950">瑜版挸澧犵猾璇茬€烽敍锟�</span>
                {inquiry.inquiryType || "閺堫亜鍨庣猾锟�"}
              </p>
              {inquiry.attachmentUrl ? (
                <p className="flex items-center gap-2">
                  <span className="font-medium text-stone-950">闂勫嫪娆㈤敍锟�</span>
                  <SecureAttachmentButton
                    fileName={inquiry.attachmentName}
                    inquiryId={inquiry.id}
                  />
                </p>
              ) : null}
            </div>
          </article>

          <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-950">鐠囥垻娲忛崘鍛啇</h3>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-stone-700">
              {inquiry.message}
            </p>
            {product ? (
              <div className="mt-5 rounded-2xl bg-stone-50 p-4">
                <p className="text-sm font-medium text-stone-950">閸忓疇浠堟禍褍鎼х憴鍕壐</p>
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
            <h3 className="text-lg font-semibold text-stone-950">鐠虹喕绻樼拋鍓х枂</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-stone-700">
                閻樿埖鈧拷
                <select className={inputClassName} defaultValue={inquiry.status} name="status">
                  <option value="new">閺傛壆鍤庣槐锟� (new)</option>
                  <option value="processing">鐠虹喕绻樻稉锟� (processing)</option>
                  <option value="contacted">瀹歌尪浠堢化锟� (contacted)</option>
                  <option value="quoted">瀹稿弶濮ゆ禒锟� (quoted)</option>
                  <option value="won">鐠с垹宕� (won)</option>
                  <option value="done">瀹告彃鐣幋锟� (done)</option>
                </select>
              </label>
              <label className="block text-sm font-medium text-stone-700">
                鐠囥垻娲忕猾璇茬€�
                <input
                  className={inputClassName}
                  defaultValue={inquiry.inquiryType ?? ""}
                  name="inquiryType"
                  placeholder="quotation / technical / sample"
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 md:col-span-2">
                閸愬懘鍎存径鍥ㄦ暈
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
                娣囨繂鐡ㄧ捄鐔荤箻娣団剝浼�
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

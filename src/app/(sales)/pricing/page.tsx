import Link from "next/link";
import { notFound } from "next/navigation";

import { getSalesContactHref } from "@/features/plans/access";
import { env } from "@/env";
import {
  getComparisonSections,
  getPlanCardSummaries,
  isPricingPageEnabled,
} from "@/lib/plans";

function renderCheck(value: boolean) {
  return value ? "�? : "×";
}

export default function PricingPage() {
  if (!isPricingPageEnabled(env.ENABLE_PRICING_PAGE)) {
    notFound();
  }

  const salesContactHref = getSalesContactHref();
  const plans = getPlanCardSummaries();
  const sections = getComparisonSections();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-14">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
          定价与权�?
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-950">
          外贸获客网站系统套餐
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600">
          这不是普通企业官网报价，而是面向中国制造业老板的外贸获客系统报价。网站、询盘、内容、销售跟进和
          AI 效率工具，会按套餐逐层开放�?
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.key}
            className={`rounded-[2rem] border p-8 shadow-sm ${
              plan.key === "growth"
                ? "border-amber-300 bg-amber-50"
                : "border-stone-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-stone-950">{plan.nameZh}</h2>
                <p className="mt-2 text-sm text-stone-500">{plan.nameEn}</p>
              </div>
              {plan.key === "growth" ? (
                <span className="rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold text-white">
                  主推
                </span>
              ) : null}
            </div>

            <p className="mt-6 text-4xl font-semibold text-stone-950">¥{plan.price}</p>
            <p className="mt-3 text-sm font-medium text-stone-700">{plan.taglineZh}</p>
            <p className="mt-3 text-sm leading-7 text-stone-600">{plan.descriptionZh}</p>

            <div className="mt-6 rounded-2xl bg-white/80 p-4 text-sm leading-7 text-stone-700">
              {plan.key === "basic" ? (
                <>
                  <p>适合先把英文站快速上线，先有官网，再慢慢升级获客能力�?/p>
                  <p>更像专业外贸展示站，不强调持续运营和 AI�?/p>
                </>
              ) : null}
              {plan.key === "growth" ? (
                <>
                  <p>适合绝大多数制造业客户，能看询盘、管内容、做 RFQ、做销售协同�?/p>
                  <p>如果你要把“网站”卖成“获客系统”，这档最好成交�?/p>
                </>
              ) : null}
              {plan.key === "ai_sales" ? (
                <>
                  <p>适合已经有销售动作、产品较多、询盘处理频繁的团队�?/p>
                  <p>AI 功能会明显提升文案整理、询盘分类和回复效率�?/p>
                </>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-stone-950 px-5 py-2 text-sm font-medium text-white"
                href={salesContactHref}
              >
                咨询 {plan.nameZh}
              </Link>
            </div>
          </article>
        ))}
      </section>

      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-stone-950">{section.title}</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
              <thead>
                <tr>
                  <th className="bg-stone-950 px-4 py-3 text-left text-sm font-semibold text-white">
                    功能
                  </th>
                  <th className="bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white">
                    基础�?
                  </th>
                  <th className="bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white">
                    获客�?
                  </th>
                  <th className="bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white">
                    AI销售版
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, index) => (
                  <tr key={row.label}>
                    <td
                      className={`px-4 py-4 text-sm text-stone-700 ${
                        index % 2 === 0 ? "bg-stone-50" : "bg-white"
                      }`}
                    >
                      {row.label}
                    </td>
                    <td
                      className={`px-4 py-4 text-center text-base font-semibold ${
                        index % 2 === 0 ? "bg-stone-50" : "bg-white"
                      }`}
                    >
                      {renderCheck(row.basic)}
                    </td>
                    <td
                      className={`px-4 py-4 text-center text-base font-semibold ${
                        index % 2 === 0 ? "bg-amber-50" : "bg-amber-100/40"
                      }`}
                    >
                      {renderCheck(row.growth)}
                    </td>
                    <td
                      className={`px-4 py-4 text-center text-base font-semibold ${
                        index % 2 === 0 ? "bg-emerald-50" : "bg-emerald-100/40"
                      }`}
                    >
                      {renderCheck(row.ai_sales)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-stone-950">收款方式建议</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-stone-700">
            <p>
              当前阶段更建议用“先联系你，再私下付款”的方式，不建议一开始就直接接入微信支付�?
            </p>
            <p>原因很简单：</p>
            <p>1. 这是高客单价 B2B 方案，客户通常要先沟通需求，不会像买模板一样直接秒付�?/p>
            <p>2. 微信支付会带来商户、回调、退款、对账、发票等额外开发和运营成本�?/p>
            <p>3. 先私聊成交，更适合你现在“方案销�?+ 定制部署”的模式�?/p>
            <p>
              如果后面你把它做成标�?SaaS 或低价模板商城，再接微信支付会更划算�?
            </p>
          </div>
        </article>

        <article className="rounded-[2rem] border border-stone-200 bg-stone-950 p-8 text-white shadow-sm">
          <h2 className="text-2xl font-semibold">当前推荐做法</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-stone-200">
            <p>先展示套餐和权益，用这个页面成交�?/p>
            <p>然后让客户通过微信、邮件或私聊确认版本、付款、部署周期�?/p>
            <p>等你后面形成稳定的标准化付费流程，再考虑接微信支付�?/p>
          </div>
          <div className="mt-6">
            <Link
              className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-medium text-stone-950"
              href={salesContactHref}
            >
              联系我成�?
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}

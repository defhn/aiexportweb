const cards = [
  {
    label: "本周询盘",
    value: "12",
    description: "后续会接入后台真实询盘统计和处理状态。",
  },
  {
    label: "未处理询盘",
    value: "5",
    description: "帮助销售优先跟进高意向询盘。",
  },
  {
    label: "已发布产品",
    value: "38",
    description: "支持产品分类、参数、PDF 和推荐展示。",
  },
  {
    label: "已发布博客",
    value: "16",
    description: "持续做 SEO 内容更新，提升海外曝光。",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-semibold text-stone-950">仪表盘</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          快速查看询盘、内容数量和最近的运营方向，方便老板和销售团队进入后台后先抓重点。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-stone-500">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold text-stone-950">{card.value}</p>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              {card.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

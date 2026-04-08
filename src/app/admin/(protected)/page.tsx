const cards = [
  {
    label: "本周询盘",
    value: "12",
    description: "后续会接入 Neon 真实询盘数据。",
  },
  {
    label: "已发布产品",
    value: "24",
    description: "后续会接产品和分类管理模块。",
  },
  {
    label: "博客文章",
    value: "6",
    description: "后续会接 SEO 博客编辑与发布。",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-semibold text-stone-950">统一后台</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          这里会逐步汇总固定页面、产品、博客、图库、文件和询盘管理能力，保证中国客户用中文后台就能维护英文前台站点。
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
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

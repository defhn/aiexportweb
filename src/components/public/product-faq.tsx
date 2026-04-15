export function ProductFaq({
  items,
  accentColor = "#2563eb",
  title = "FAQ",
}: {
  items: Array<{ question: string; answer: string }>;
  accentColor?: string;
  title?: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      {items.map((item) => (
        <article
          key={item.question}
          className="rounded-2xl border bg-white p-5 shadow-sm"
          style={{ borderColor: "rgba(148, 163, 184, 0.25)" }}
        >
          <h3 className="text-base font-semibold text-slate-950" style={{ color: accentColor }}>
            {item.question}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
        </article>
      ))}
    </section>
  );
}

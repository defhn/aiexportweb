export function ProductFaq({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-950">FAQ</h2>
      {items.map((item) => (
        <article
          key={item.question}
          className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-950">
            {item.question}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
        </article>
      ))}
    </section>
  );
}

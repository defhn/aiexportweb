export function ProductFaq({
  items,
  accentColor = "#2563eb",
  title = "FAQ",
  cardBg = "#ffffff",
  cardBorder = "rgba(148, 163, 184, 0.25)",
}: {
  items: Array<{ question: string; answer: string }>;
  accentColor?: string;
  title?: string;
  cardBg?: string;
  cardBorder?: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold" style={{ color: cardBg === "#ffffff" ? "#0f172a" : "#ffffff" }}>{title}</h2>
      {items.map((item) => (
        <article
          key={item.question}
          className="rounded-2xl border p-5 shadow-sm"
          style={{ borderColor: cardBorder, backgroundColor: cardBg }}
        >
          <h3 className="text-base font-semibold" style={{ color: accentColor }}>
            {item.question}
          </h3>
          <p className="mt-2 text-sm leading-6" style={{ color: cardBg === "#ffffff" ? "#475569" : "rgba(255,255,255,0.7)" }}>{item.answer}</p>
        </article>
      ))}
    </section>
  );
}

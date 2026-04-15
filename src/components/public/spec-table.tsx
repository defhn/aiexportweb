export function SpecTable({
  rows,
  accentColor = "#2563eb",
  title = "Product Details",
}: {
  rows: Array<{ label: string; value: string }>;
  accentColor?: string;
  title?: string;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border bg-white/50 p-8 shadow-sm backdrop-blur-sm" style={{ borderColor: "rgba(148, 163, 184, 0.25)" }}>
      <h3 className="mb-8 px-4 text-sm font-black uppercase tracking-[0.4em] text-stone-400">{title}</h3>
      <table className="w-full border-collapse">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="group border-b border-stone-100 transition-colors last:border-b-0 hover:bg-stone-50/50">
              <th className="w-1/3 px-4 py-5 text-left text-xs font-black uppercase tracking-[0.2em] text-stone-400 transition-colors group-hover:opacity-80" style={{ color: accentColor }}>
                {row.label}
              </th>
              <td className="py-5 px-4 text-sm font-medium leading-relaxed text-stone-900 tabular-nums">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

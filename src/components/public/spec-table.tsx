export function SpecTable({
  rows,
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="overflow-hidden bg-white/50 backdrop-blur-sm rounded-[2rem] border border-stone-100 p-8 shadow-sm">
      <h3 className="text-sm font-black uppercase tracking-[0.4em] text-stone-400 mb-8 px-4">Technical Specifications</h3>
      <table className="w-full border-collapse">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="group border-b border-stone-100 last:border-b-0 hover:bg-stone-50/50 transition-colors">
              <th className="w-1/3 py-5 px-4 text-left text-xs font-black uppercase tracking-[0.2em] text-stone-400 group-hover:text-blue-600 transition-colors">
                {row.label}
              </th>
              <td className="py-5 px-4 text-sm font-medium text-stone-900 leading-relaxed tabular-nums">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

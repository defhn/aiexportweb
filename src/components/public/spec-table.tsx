export function SpecTable({
  rows,
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-stone-200 last:border-b-0">
            <th className="w-1/3 bg-stone-50 px-4 py-3 text-left text-sm font-medium text-stone-700">
              {row.label}
            </th>
            <td className="px-4 py-3 text-sm text-stone-900">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DataTable({ columns, rows, renderRow }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-cyber-muted">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-6 py-4 font-bold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row, index) => renderRow(row, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

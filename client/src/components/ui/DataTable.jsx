export function DataTable({
  columns = [],
  rows = [],
  renderRow,
  className = "",
  emptyMessage = "No data available",
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/10 bg-[#080808] ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-left">
          {/* TABLE HEADER */}
          <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-cyber-muted">
            <tr>
              {columns.length > 0 ? (
                columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-4 text-left font-bold break-words whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))
              ) : (
                <th className="px-4 py-4 text-left font-bold">
                  Data
                </th>
              )}
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-white/10">
            {rows.length > 0 ? (
              typeof renderRow === "function" ? (
                rows.map((row, index) =>
                  renderRow(row, index)
                )
              ) : (
                rows.map((row, index) => (
                  <tr
                    key={index}
                    className="transition-colors duration-300 hover:bg-white/[0.03]"
                  >
                    {Object.values(row).map((value, valueIndex) => (
                      <td
                        key={valueIndex}
                        className="px-4 py-4 text-sm text-white/80"
                      >
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-4 py-12 text-center text-sm text-white/45"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
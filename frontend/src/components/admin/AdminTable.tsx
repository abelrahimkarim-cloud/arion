type AdminTableProps = {
  columns: string[];
  rows: React.ReactNode[][];
  caption?: string;
};

export default function AdminTable({ columns, rows, caption }: AdminTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {caption ? (
        <div className="border-b border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700 sm:px-6">
          {caption}
        </div>
      ) : null}

      {/* Mobile: Card view */}
      <div className="divide-y divide-slate-200 sm:hidden">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="space-y-3 p-4">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">{columns[cellIndex]}</span>
                <span className="text-right text-sm text-slate-700">{cell}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop: Table view */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-4 font-semibold text-slate-700 sm:px-6">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-4 align-top text-slate-700 sm:px-6">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

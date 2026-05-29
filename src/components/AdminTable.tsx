import { ReactNode } from "react";

interface Column {
  header: string;
  accessor: string;
  render?: (item: any) => ReactNode;
}

interface Props {
  columns: Column[];
  data: any[];
  keyField?: string;
  emptyMessage?: string;
}

export function AdminTable({ columns, data, keyField = "_id", emptyMessage = "No records found" }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
            <tr>
              {columns.map((col) => (
                <th key={col.accessor || col.header} className="px-6 py-4 font-bold uppercase tracking-wider text-xs whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 font-medium">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row[keyField] || i} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.accessor || col.header} className="px-6 py-4">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

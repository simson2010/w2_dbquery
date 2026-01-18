import Loading from './common/Loading';

interface ResultTableProps {
  columns: string[];
  rows: unknown[][];
  rowCount: number;
  loading: boolean;
}

export default function ResultTable({ columns, rows, rowCount, loading }: ResultTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loading text="查询中..." />
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
        <p>查询结果区域</p>
        <p className="text-sm mt-1">执行 SQL 后，结果将显示在这里</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500">
        <p>查询完成，但没有返回数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        共 <span className="font-medium">{rowCount}</span> 条记录
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-2 border-b border-gray-100 whitespace-nowrap"
                    >
                      {cell === null ? (
                        <span className="text-gray-400 italic">NULL</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { TableSchema } from '../types';
import Loading from './common/Loading';

interface SchemaViewerProps {
  schema: TableSchema[];
  loading: boolean;
}

export default function SchemaViewer({ schema, loading }: SchemaViewerProps) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(tableName)) {
        next.delete(tableName);
      } else {
        next.add(tableName);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedTables(new Set(schema.map((t) => t.table_name)));
  };

  const collapseAll = () => {
    setExpandedTables(new Set());
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loading size="sm" text="加载 Schema..." />
      </div>
    );
  }

  if (schema.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        <p>暂无 Schema 信息</p>
        <p className="text-xs mt-1">请先选择数据库连接</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">数据库结构</h3>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-blue-500 hover:underline"
          >
            展开全部
          </button>
          <button
            onClick={collapseAll}
            className="text-xs text-blue-500 hover:underline"
          >
            收起全部
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        {schema.map((table) => (
          <div key={table.table_name}>
            <button
              onClick={() => toggleTable(table.table_name)}
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-mono text-sm text-gray-800">
                {table.table_name}
              </span>
              <span className="text-gray-400 text-xs">
                {expandedTables.has(table.table_name) ? '▼' : '▶'}
              </span>
            </button>

            {expandedTables.has(table.table_name) && (
              <div className="bg-gray-50 px-3 py-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left py-1">列名</th>
                      <th className="text-left py-1">类型</th>
                      <th className="text-left py-1">可空</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col) => (
                      <tr key={col.column_name} className="text-gray-700">
                        <td className="py-1 font-mono">{col.column_name}</td>
                        <td className="py-1 text-gray-500">{col.data_type}</td>
                        <td className="py-1">
                          {col.is_nullable ? (
                            <span className="text-green-600">是</span>
                          ) : (
                            <span className="text-red-600">否</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

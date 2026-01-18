import type { Connection } from '../types';

interface ConnectionSelectorProps {
  connections: Connection[];
  selectedId: number | null;
  onChange: (id: number) => void;
  disabled?: boolean;
}

export default function ConnectionSelector({
  connections,
  selectedId,
  onChange,
  disabled = false,
}: ConnectionSelectorProps) {
  if (connections.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        暂无可用连接，请先
        <a href="/connections" className="text-blue-500 hover:underline ml-1">
          添加数据库连接
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="connection-select" className="text-sm font-medium text-gray-700">
        选择数据库：
      </label>
      <select
        id="connection-select"
        value={selectedId ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
      >
        <option value="" disabled>
          请选择连接
        </option>
        {connections.map((conn) => (
          <option key={conn.id} value={conn.id}>
            {conn.name}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SqlPreviewProps {
  sql: string;
  explanation: string;
  onChange: (sql: string) => void;
  onExecute: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function SqlPreview({
  sql,
  explanation,
  onChange,
  onExecute,
  loading,
  disabled,
}: SqlPreviewProps) {
  if (!sql && !explanation) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
        <p>SQL 预览区域</p>
        <p className="text-sm mt-1">输入自然语言查询后，生成的 SQL 将显示在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {explanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-1">AI 解释</h4>
          <p className="text-sm text-blue-700">{explanation}</p>
        </div>
      )}

      <div>
        <label htmlFor="sql-preview" className="block text-sm font-medium text-gray-700 mb-2">
          SQL 语句（可编辑）
        </label>
        <textarea
          id="sql-preview"
          value={sql}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          disabled={disabled || loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm resize-none bg-gray-50"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onExecute}
          disabled={disabled || loading || !sql.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '执行中...' : '执行查询'}
        </button>
      </div>
    </div>
  );
}

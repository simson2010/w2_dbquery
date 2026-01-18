import { useCallback } from 'react';

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function QueryInput({
  value,
  onChange,
  onSubmit,
  loading,
  disabled,
}: QueryInputProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl+Enter 或 Cmd+Enter 提交
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && !loading && value.trim()) {
          onSubmit();
        }
      }
    },
    [disabled, loading, value, onSubmit]
  );

  return (
    <div className="space-y-3">
      <label htmlFor="query-input" className="block text-sm font-medium text-gray-700">
        自然语言查询
      </label>
      <textarea
        id="query-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="请描述您想查询的数据...&#10;例如：查询所有用户的姓名和邮箱"
        rows={4}
        disabled={disabled || loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">提示：按 Ctrl+Enter 快速生成 SQL</span>
        <button
          onClick={onSubmit}
          disabled={disabled || loading || !value.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '生成中...' : '生成 SQL'}
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';

type TabType = 'natural-language' | 'sql-editor';

interface QueryEditorProps {
  naturalLanguageQuery: string;
  onNaturalLanguageChange: (value: string) => void;
  onGenerateSql: () => void;
  generateLoading: boolean;
  sql: string;
  explanation: string;
  onSqlChange: (value: string) => void;
  onExecuteSql: () => void;
  executeLoading: boolean;
  disabled: boolean;
}

export default function QueryEditor({
  naturalLanguageQuery,
  onNaturalLanguageChange,
  onGenerateSql,
  generateLoading,
  sql,
  explanation,
  onSqlChange,
  onExecuteSql,
  executeLoading,
  disabled,
}: QueryEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('natural-language');
  const [prevSql, setPrevSql] = useState(sql);

  // 当 SQL 从空变为有值时，自动切换到 SQL 编辑 Tab
  useEffect(() => {
    if (sql && !prevSql && activeTab === 'natural-language') {
      setActiveTab('sql-editor');
    }
    setPrevSql(sql);
  }, [sql, prevSql, activeTab]);

  const handleNaturalLanguageKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && !generateLoading && naturalLanguageQuery.trim()) {
          onGenerateSql();
        }
      }
    },
    [disabled, generateLoading, naturalLanguageQuery, onGenerateSql]
  );

  const handleSqlKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && !executeLoading && sql.trim()) {
          onExecuteSql();
        }
      }
    },
    [disabled, executeLoading, sql, onExecuteSql]
  );

  const tabs = [
    { id: 'natural-language' as TabType, label: '自然语言' },
    { id: 'sql-editor' as TabType, label: 'SQL 编辑' },
  ];

  return (
    <div className="space-y-4">
      {/* Tab 栏 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab 内容 */}
      {activeTab === 'natural-language' ? (
        <div className="space-y-3">
          <textarea
            value={naturalLanguageQuery}
            onChange={(e) => onNaturalLanguageChange(e.target.value)}
            onKeyDown={handleNaturalLanguageKeyDown}
            placeholder="请描述您想查询的数据...&#10;例如：查询所有用户的姓名和邮箱"
            rows={4}
            disabled={disabled || generateLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              提示：按 Ctrl+Enter 快速生成 SQL
            </span>
            <button
              onClick={onGenerateSql}
              disabled={disabled || generateLoading || !naturalLanguageQuery.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generateLoading ? '生成中...' : '生成 SQL'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-1">AI 解释</h4>
              <p className="text-sm text-blue-700">{explanation}</p>
            </div>
          )}

          <textarea
            value={sql}
            onChange={(e) => onSqlChange(e.target.value)}
            onKeyDown={handleSqlKeyDown}
            placeholder="在此输入 SQL 查询语句..."
            rows={6}
            disabled={disabled || executeLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm resize-none bg-gray-50"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              提示：按 Ctrl+Enter 快速执行查询
            </span>
            <button
              onClick={onExecuteSql}
              disabled={disabled || executeLoading || !sql.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {executeLoading ? '执行中...' : '执行查询'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import type {
  Connection,
  TableSchema,
  ExecuteSqlResponse,
  ToastMessage,
} from '../types';
import {
  getConnections,
  getSchema,
  generateSql,
  executeSql,
} from '../services/api';
import ConnectionSelector from '../components/ConnectionSelector';
import SchemaViewer from '../components/SchemaViewer';
import QueryInput from '../components/QueryInput';
import SqlPreview from '../components/SqlPreview';
import ResultTable from '../components/ResultTable';
import Toast from '../components/common/Toast';

export default function Home() {
  // 连接相关状态
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<number | null>(null);
  const [connectionsLoading, setConnectionsLoading] = useState(true);

  // Schema 相关状态
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [schemaLoading, setSchemaLoading] = useState(false);

  // 查询相关状态
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [generatedSql, setGeneratedSql] = useState('');
  const [explanation, setExplanation] = useState('');
  const [generateLoading, setGenerateLoading] = useState(false);

  // 执行结果相关状态
  const [queryResult, setQueryResult] = useState<ExecuteSqlResponse | null>(null);
  const [executeLoading, setExecuteLoading] = useState(false);

  // Toast 消息
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 获取连接列表
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setConnectionsLoading(true);
        const data = await getConnections();
        setConnections(data);
      } catch (error) {
        addToast('error', error instanceof Error ? error.message : '获取连接列表失败');
      } finally {
        setConnectionsLoading(false);
      }
    };
    fetchConnections();
  }, [addToast]);

  // 选择连接后获取 Schema
  useEffect(() => {
    if (!selectedConnectionId) {
      setSchema([]);
      return;
    }

    const fetchSchema = async () => {
      try {
        setSchemaLoading(true);
        const data = await getSchema(selectedConnectionId);
        setSchema(data.tables);
      } catch (error) {
        addToast('error', error instanceof Error ? error.message : '获取 Schema 失败');
        setSchema([]);
      } finally {
        setSchemaLoading(false);
      }
    };
    fetchSchema();
  }, [selectedConnectionId, addToast]);

  // 生成 SQL
  const handleGenerateSql = async () => {
    if (!selectedConnectionId || !naturalLanguageQuery.trim()) return;

    try {
      setGenerateLoading(true);
      const result = await generateSql({
        connection_id: selectedConnectionId,
        natural_language_query: naturalLanguageQuery.trim(),
      });
      setGeneratedSql(result.sql);
      setExplanation(result.explanation);
      // 清空之前的查询结果
      setQueryResult(null);
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : '生成 SQL 失败');
    } finally {
      setGenerateLoading(false);
    }
  };

  // 执行 SQL
  const handleExecuteSql = async () => {
    if (!selectedConnectionId || !generatedSql.trim()) return;

    try {
      setExecuteLoading(true);
      const result = await executeSql({
        connection_id: selectedConnectionId,
        sql: generatedSql.trim(),
      });
      setQueryResult(result);
      addToast('success', `查询成功，返回 ${result.row_count} 条记录`);
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : '执行 SQL 失败');
    } finally {
      setExecuteLoading(false);
    }
  };

  const isConnectionSelected = selectedConnectionId !== null;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">SQL 查询助手</h1>

      {/* 连接选择器 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <ConnectionSelector
          connections={connections}
          selectedId={selectedConnectionId}
          onChange={setSelectedConnectionId}
          disabled={connectionsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：Schema 查看器 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <SchemaViewer schema={schema} loading={schemaLoading} />
          </div>
        </div>

        {/* 右侧：查询区域 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 自然语言输入 */}
          <div className="bg-white rounded-lg shadow p-4">
            <QueryInput
              value={naturalLanguageQuery}
              onChange={setNaturalLanguageQuery}
              onSubmit={handleGenerateSql}
              loading={generateLoading}
              disabled={!isConnectionSelected}
            />
          </div>

          {/* SQL 预览 */}
          <div className="bg-white rounded-lg shadow p-4">
            <SqlPreview
              sql={generatedSql}
              explanation={explanation}
              onChange={setGeneratedSql}
              onExecute={handleExecuteSql}
              loading={executeLoading}
              disabled={!isConnectionSelected}
            />
          </div>

          {/* 查询结果 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">查询结果</h3>
            <ResultTable
              columns={queryResult?.columns ?? []}
              rows={queryResult?.rows ?? []}
              rowCount={queryResult?.row_count ?? 0}
              loading={executeLoading}
            />
          </div>
        </div>
      </div>

      <Toast messages={toasts} onClose={removeToast} />
    </div>
  );
}

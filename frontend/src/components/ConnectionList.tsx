import { useState } from 'react';
import type { Connection } from '../types';
import Loading from './common/Loading';

interface ConnectionListProps {
  connections: Connection[];
  onDelete: (id: number) => void;
  onTest: (id: number) => void;
  onSelect?: (id: number) => void;
  loading?: boolean;
}

interface TestStatus {
  [key: number]: {
    loading: boolean;
    success?: boolean;
    message?: string;
  };
}

export default function ConnectionList({
  connections,
  onDelete,
  onTest,
  onSelect,
  loading = false,
}: ConnectionListProps) {
  const [testStatus, setTestStatus] = useState<TestStatus>({});

  const handleTest = async (id: number) => {
    setTestStatus((prev) => ({ ...prev, [id]: { loading: true } }));
    try {
      await onTest(id);
      setTestStatus((prev) => ({
        ...prev,
        [id]: { loading: false, success: true, message: '连接成功' },
      }));
    } catch (error) {
      setTestStatus((prev) => ({
        ...prev,
        [id]: {
          loading: false,
          success: false,
          message: error instanceof Error ? error.message : '连接失败',
        },
      }));
    }
  };

  const maskConnectionString = (str: string): string => {
    // 隐藏密码部分
    return str.replace(/:([^:@]+)@/, ':****@');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loading text="加载中..." />
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>暂无数据库连接</p>
        <p className="text-sm mt-1">请添加一个新的连接</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {connections.map((conn) => (
        <div
          key={conn.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div
              className={`flex-1 ${onSelect ? 'cursor-pointer' : ''}`}
              onClick={() => onSelect?.(conn.id)}
            >
              <h3 className="font-medium text-gray-800">{conn.name}</h3>
              <p className="text-sm text-gray-500 font-mono mt-1 break-all">
                {maskConnectionString(conn.connection_string)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                创建于: {new Date(conn.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleTest(conn.id)}
                disabled={testStatus[conn.id]?.loading}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {testStatus[conn.id]?.loading ? '测试中...' : '测试'}
              </button>
              <button
                onClick={() => onDelete(conn.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
          {testStatus[conn.id] && !testStatus[conn.id].loading && (
            <div
              className={`mt-2 text-sm px-3 py-1 rounded ${
                testStatus[conn.id].success
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {testStatus[conn.id].message}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

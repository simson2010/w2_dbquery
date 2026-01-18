import { useState, useEffect, useCallback } from 'react';
import type { Connection, ConnectionCreate, ToastMessage } from '../types';
import { getConnections, createConnection, deleteConnection, testConnection } from '../services/api';
import ConnectionList from '../components/ConnectionList';
import ConnectionForm from '../components/ConnectionForm';
import Toast from '../components/common/Toast';

export default function Connections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConnections();
      setConnections(data);
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : '获取连接列表失败');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleCreate = async (data: ConnectionCreate) => {
    try {
      setFormLoading(true);
      const newConnection = await createConnection(data);
      setConnections((prev) => [...prev, newConnection]);
      addToast('success', '连接添加成功');
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : '添加连接失败');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个连接吗？')) return;

    try {
      await deleteConnection(id);
      setConnections((prev) => prev.filter((c) => c.id !== id));
      addToast('success', '连接已删除');
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : '删除连接失败');
    }
  };

  const handleTest = async (id: number) => {
    const result = await testConnection(id);
    if (result.success) {
      addToast('success', result.message);
    } else {
      addToast('error', result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">数据库连接管理</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 添加连接表单 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">添加新连接</h2>
          <ConnectionForm onSubmit={handleCreate} loading={formLoading} />
        </div>

        {/* 连接列表 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">已保存的连接</h2>
          <ConnectionList
            connections={connections}
            onDelete={handleDelete}
            onTest={handleTest}
            loading={loading}
          />
        </div>
      </div>

      <Toast messages={toasts} onClose={removeToast} />
    </div>
  );
}

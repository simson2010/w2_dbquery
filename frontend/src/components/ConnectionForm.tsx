import { useState } from 'react';
import type { ConnectionCreate } from '../types';

interface ConnectionFormProps {
  onSubmit: (data: ConnectionCreate) => void;
  loading: boolean;
}

export default function ConnectionForm({ onSubmit, loading }: ConnectionFormProps) {
  const [name, setName] = useState('');
  const [connectionString, setConnectionString] = useState('');
  const [errors, setErrors] = useState<{ name?: string; connectionString?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; connectionString?: string } = {};

    if (!name.trim()) {
      newErrors.name = '请输入连接名称';
    }

    if (!connectionString.trim()) {
      newErrors.connectionString = '请输入连接字符串';
    } else if (!connectionString.startsWith('postgresql://')) {
      newErrors.connectionString = '连接字符串必须以 postgresql:// 开头';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      connection_string: connectionString.trim(),
    });

    // 清空表单
    setName('');
    setConnectionString('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          连接名称
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：生产数据库"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="connectionString" className="block text-sm font-medium text-gray-700 mb-1">
          连接字符串
        </label>
        <input
          type="text"
          id="connectionString"
          value={connectionString}
          onChange={(e) => setConnectionString(e.target.value)}
          placeholder="postgresql://user:password@host:port/database"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
            errors.connectionString ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors.connectionString && (
          <p className="text-red-500 text-sm mt-1">{errors.connectionString}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          格式：postgresql://user:password@host:port/database
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '添加中...' : '添加连接'}
      </button>
    </form>
  );
}

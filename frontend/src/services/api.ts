import axios from 'axios';
import type {
  Connection,
  ConnectionCreate,
  ConnectionTestResponse,
  SchemaResponse,
  GenerateSqlRequest,
  GenerateSqlResponse,
  ExecuteSqlRequest,
  ExecuteSqlResponse,
} from '../types';

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 统一错误处理
    const message = error.response?.data?.detail || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

// ==================== Connections API ====================

/**
 * 获取所有数据库连接
 */
export async function getConnections(): Promise<Connection[]> {
  const response = await api.get<Connection[]>('/connections');
  return response.data;
}

/**
 * 创建新的数据库连接
 */
export async function createConnection(data: ConnectionCreate): Promise<Connection> {
  const response = await api.post<Connection>('/connections', data);
  return response.data;
}

/**
 * 删除数据库连接
 */
export async function deleteConnection(id: number): Promise<void> {
  await api.delete(`/connections/${id}`);
}

/**
 * 测试数据库连接
 */
export async function testConnection(id: number): Promise<ConnectionTestResponse> {
  const response = await api.post<ConnectionTestResponse>(`/connections/${id}/test`);
  return response.data;
}

/**
 * 获取数据库 Schema
 */
export async function getSchema(id: number): Promise<SchemaResponse> {
  const response = await api.get<SchemaResponse>(`/connections/${id}/schema`);
  return response.data;
}

// ==================== Query API ====================

/**
 * 生成 SQL（自然语言转 SQL）
 */
export async function generateSql(data: GenerateSqlRequest): Promise<GenerateSqlResponse> {
  const response = await api.post<GenerateSqlResponse>('/generate-sql', data);
  return response.data;
}

/**
 * 执行 SQL 查询
 */
export async function executeSql(data: ExecuteSqlRequest): Promise<ExecuteSqlResponse> {
  const response = await api.post<ExecuteSqlResponse>('/execute-sql', data);
  return response.data;
}

export default api;

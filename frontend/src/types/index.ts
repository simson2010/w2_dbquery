// 数据库连接
export interface Connection {
  id: number;
  name: string;
  connection_string: string;
  created_at: string;
}

export interface ConnectionCreate {
  name: string;
  connection_string: string;
}

export interface ConnectionTestResponse {
  success: boolean;
  message: string;
}

// Schema
export interface ColumnSchema {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
}

export interface TableSchema {
  table_name: string;
  columns: ColumnSchema[];
}

export interface SchemaResponse {
  tables: TableSchema[];
}

// SQL 生成
export interface GenerateSqlRequest {
  connection_id: number;
  natural_language_query: string;
}

export interface GenerateSqlResponse {
  sql: string;
  explanation: string;
}

// SQL 执行
export interface ExecuteSqlRequest {
  connection_id: number;
  sql: string;
}

export interface ExecuteSqlResponse {
  columns: string[];
  rows: unknown[][];
  row_count: number;
}

// Toast 通知
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

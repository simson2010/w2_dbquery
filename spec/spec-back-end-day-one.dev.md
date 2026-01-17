# Backend Day One 开发清单

基于 `spec/instructions.md` 规格说明，按文件结构分步实现后端功能。

---

## Step 1: 项目基础结构 ✅ 已完成

### 1.1 创建目录结构 ✅
```
backend/
├── main.py
├── config.py
├── database.py
├── routers/
│   ├── __init__.py
│   ├── connections.py
│   └── query.py
├── services/
│   ├── __init__.py
│   ├── llm.py
│   ├── postgres.py
│   └── sql_validator.py
└── models/
    ├── __init__.py
    └── schemas.py
```

### 1.2 更新 pyproject.toml ✅
已添加依赖：
- fastapi>=0.109.0
- uvicorn[standard]>=0.27.0
- psycopg2-binary>=2.9.9
- python-dotenv>=1.0.0
- openai>=1.12.0
- pydantic>=2.6.0

---

## Step 2: 配置与数据库初始化

### 2.1 backend/config.py
- [ ] 定义配置类/常量
- [ ] LLM API Key 配置（从环境变量读取）
- [ ] SQLite 数据库路径配置
- [ ] 查询结果行数限制配置（默认 1000）

### 2.2 backend/database.py
- [ ] SQLite 数据库连接初始化
- [ ] 创建 `connections` 表
  ```sql
  CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      connection_string TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] 提供数据库会话获取函数

---

## Step 3: Pydantic 数据模型

### 3.1 backend/models/schemas.py
- [ ] `ConnectionCreate` - 创建连接请求体
  - name: str
  - connection_string: str
- [ ] `ConnectionResponse` - 连接响应
  - id: int
  - name: str
  - connection_string: str
  - created_at: datetime
- [ ] `GenerateSqlRequest` - 生成 SQL 请求体
  - connection_id: int
  - natural_language_query: str
- [ ] `GenerateSqlResponse` - 生成 SQL 响应
  - sql: str
  - explanation: str
- [ ] `ExecuteSqlRequest` - 执行 SQL 请求体
  - connection_id: int
  - sql: str
- [ ] `ExecuteSqlResponse` - 执行 SQL 响应
  - columns: List[str]
  - rows: List[List[Any]]
  - row_count: int
- [ ] `SchemaResponse` - Schema 响应
  - tables: List[TableSchema]
- [ ] `TableSchema` - 表结构
  - table_name: str
  - columns: List[ColumnSchema]
- [ ] `ColumnSchema` - 列结构
  - column_name: str
  - data_type: str
  - is_nullable: bool

---

## Step 4: 服务层实现

### 4.1 backend/services/sql_validator.py
- [ ] `validate_select_only(sql: str) -> bool`
  - 验证 SQL 是否为只读 SELECT 语句
  - 禁止 INSERT/UPDATE/DELETE/DROP/ALTER/TRUNCATE 等
  - 禁止多语句执行（分号分隔）

### 4.2 backend/services/postgres.py
- [ ] `test_connection(connection_string: str) -> bool`
  - 测试 PostgreSQL 连接是否有效
- [ ] `get_schema(connection_string: str) -> List[TableSchema]`
  - 查询 information_schema 获取表结构
  - 返回所有表名、列名、数据类型
- [ ] `execute_query(connection_string: str, sql: str, limit: int) -> ExecuteSqlResponse`
  - 执行 SELECT 查询
  - 返回列名、数据行、行数
  - 应用行数限制

### 4.3 backend/services/llm.py
- [ ] `generate_sql(schema: List[TableSchema], natural_language: str) -> GenerateSqlResponse`
  - 构建 prompt（包含 schema 上下文）
  - 调用 LLM API
  - 解析响应，提取 SQL 和解释
  - Prompt 要点：
    - 只生成 SELECT 语句
    - 基于提供的 schema
    - 返回 JSON 格式 {sql, explanation}

---

## Step 5: 路由层实现

### 5.1 backend/routers/connections.py
- [ ] `POST /api/connections` - 添加新连接
  - 接收 ConnectionCreate
  - 存入 SQLite
  - 返回 ConnectionResponse
- [ ] `GET /api/connections` - 获取所有连接
  - 查询 SQLite
  - 返回 List[ConnectionResponse]
- [ ] `DELETE /api/connections/{id}` - 删除连接
  - 从 SQLite 删除
  - 返回成功/失败
- [ ] `POST /api/connections/{id}/test` - 测试连接
  - 获取连接字符串
  - 调用 postgres.test_connection
  - 返回测试结果
- [ ] `GET /api/connections/{id}/schema` - 获取 Schema
  - 获取连接字符串
  - 调用 postgres.get_schema
  - 返回 SchemaResponse

### 5.2 backend/routers/query.py
- [ ] `POST /api/generate-sql` - 生成 SQL
  - 接收 GenerateSqlRequest
  - 获取连接的 schema
  - 调用 llm.generate_sql
  - 返回 GenerateSqlResponse
- [ ] `POST /api/execute-sql` - 执行 SQL
  - 接收 ExecuteSqlRequest
  - 调用 sql_validator.validate_select_only
  - 验证失败返回 400 错误
  - 调用 postgres.execute_query
  - 返回 ExecuteSqlResponse

---

## Step 6: FastAPI 入口

### 6.1 backend/main.py
- [ ] 创建 FastAPI 应用实例
- [ ] 配置 CORS（允许前端跨域）
- [ ] 注册路由
  - include_router(connections.router, prefix="/api")
  - include_router(query.router, prefix="/api")
- [ ] 启动时初始化数据库
- [ ] 健康检查端点 `GET /health`

---

## Step 7: 测试与验证

### 7.1 手动测试
- [ ] 启动服务 `uvicorn backend.main:app --reload`
- [ ] 测试 `/health` 端点
- [ ] 测试添加连接 `POST /api/connections`
- [ ] 测试获取连接列表 `GET /api/connections`
- [ ] 测试连接测试 `POST /api/connections/{id}/test`
- [ ] 测试获取 Schema `GET /api/connections/{id}/schema`
- [ ] 测试生成 SQL `POST /api/generate-sql`
- [ ] 测试执行 SQL `POST /api/execute-sql`
- [ ] 测试 SQL 验证（尝试执行 DELETE 语句应被拒绝）

---

## 开发顺序建议

按依赖关系，推荐开发顺序：

1. **Step 1** - 创建目录结构
2. **Step 2.1** - config.py（配置）
3. **Step 3** - schemas.py（数据模型）
4. **Step 2.2** - database.py（SQLite 初始化）
5. **Step 4.1** - sql_validator.py（SQL 验证）
6. **Step 4.2** - postgres.py（PostgreSQL 操作）
7. **Step 4.3** - llm.py（LLM 调用）
8. **Step 5.1** - connections.py（连接管理路由）
9. **Step 5.2** - query.py（查询路由）
10. **Step 6** - main.py（FastAPI 入口）
11. **Step 7** - 测试验证

---

## 文件清单

| 文件路径 | 功能 | 依赖 |
|---------|------|------|
| `backend/config.py` | 配置管理 | 无 |
| `backend/models/schemas.py` | Pydantic 模型 | 无 |
| `backend/database.py` | SQLite 管理 | config |
| `backend/services/sql_validator.py` | SQL 验证 | 无 |
| `backend/services/postgres.py` | PostgreSQL 操作 | schemas, config |
| `backend/services/llm.py` | LLM 调用 | schemas, config |
| `backend/routers/connections.py` | 连接管理 API | database, postgres, schemas |
| `backend/routers/query.py` | 查询 API | llm, postgres, sql_validator, schemas |
| `backend/main.py` | 应用入口 | routers, database |

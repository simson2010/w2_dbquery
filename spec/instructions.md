# Natural Language to SQL Query Demo

## 项目概述

构建一个自然语言转SQL查询的Demo应用。用户输入自然语言描述，系统通过LLM生成对应的SQL查询语句，用户确认后可执行查询并查看结果。

## 技术栈

### 后端
- Python (FastAPI)
- SQLite (存储用户数据库连接配置)
- PostgreSQL 客户端 (psycopg2/asyncpg)
- LLM API 调用

### 前端
- React JS
- Tailwind CSS
- Axios (HTTP 请求)

## 功能模块

### 1. 数据库连接管理

**功能描述：**
- 用户可添加 PostgreSQL 数据库连接字符串
- 连接信息保存在本地 SQLite 数据库
- 支持连接测试
- 支持查看/删除已保存的连接

**数据模型：**
```
connections:
  - id: INTEGER PRIMARY KEY
  - name: TEXT (连接名称)
  - connection_string: TEXT (PostgreSQL 连接字符串)
  - created_at: TIMESTAMP
```

**API 端点：**
- `POST /api/connections` - 添加新连接
- `GET /api/connections` - 获取所有连接
- `DELETE /api/connections/{id}` - 删除连接
- `POST /api/connections/{id}/test` - 测试连接

### 2. 自然语言转 SQL

**功能描述：**
- 用户选择目标数据库连接
- 输入自然语言查询描述
- 系统获取数据库 schema 信息
- 调用 LLM 生成 SQL 查询语句
- 返回生成的 SQL 供用户确认

**API 端点：**
- `POST /api/generate-sql`
  - 请求体：`{ connection_id, natural_language_query }`
  - 响应：`{ sql, explanation }`

**LLM Prompt 设计要点：**
- 提供数据库 schema 上下文
- 明确只生成 SELECT 查询
- 返回结构化的 SQL 和解释

### 3. SQL 执行

**功能描述：**
- 接收前端提交的 SQL 语句
- 验证 SQL 为只读查询（仅允许 SELECT）
- 执行查询并返回结果
- 结果以二维表格式返回

**API 端点：**
- `POST /api/execute-sql`
  - 请求体：`{ connection_id, sql }`
  - 响应：`{ columns, rows, row_count }`

**安全限制：**
- 仅允许 SELECT 语句
- 禁止 INSERT/UPDATE/DELETE/DROP/ALTER 等操作
- 查询结果行数限制（如最多 1000 行）

### 4. Schema 获取

**功能描述：**
- 获取指定数据库的表结构信息
- 用于 LLM 上下文和前端展示

**API 端点：**
- `GET /api/connections/{id}/schema`
  - 响应：表名、列名、数据类型等信息

## 前端页面

### 页面结构

1. **数据库连接管理页**
   - 连接列表
   - 添加连接表单
   - 连接测试按钮

2. **查询页面（主页）**
   - 数据库连接选择器
   - 自然语言输入框
   - 生成 SQL 按钮
   - SQL 预览/编辑区域
   - 执行按钮
   - 结果表格展示

### 组件划分

```
src/
  components/
    ConnectionList.jsx      # 连接列表
    ConnectionForm.jsx      # 添加连接表单
    QueryInput.jsx          # 自然语言输入
    SqlPreview.jsx          # SQL 预览/编辑
    ResultTable.jsx         # 结果表格
    SchemaViewer.jsx        # Schema 查看器
  pages/
    Home.jsx                # 查询主页
    Connections.jsx         # 连接管理页
```

## 项目结构

```
w2_dbquery/
├── backend/
│   ├── main.py             # FastAPI 入口
│   ├── config.py           # 配置
│   ├── database.py         # SQLite 连接管理
│   ├── routers/
│   │   ├── connections.py  # 连接管理路由
│   │   ├── query.py        # 查询相关路由
│   ├── services/
│   │   ├── llm.py          # LLM 调用服务
│   │   ├── postgres.py     # PostgreSQL 操作
│   │   ├── sql_validator.py # SQL 验证
│   └── models/
│       └── schemas.py      # Pydantic 模型
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/       # API 调用
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
├── spec/
│   └── instructions.md
└── pyproject.toml
```

## Day One 范围

1. 后端基础框架搭建 (FastAPI)
2. SQLite 本地存储连接信息
3. PostgreSQL 连接管理 API
4. Schema 获取功能
5. LLM 调用生成 SQL
6. SQL 验证（仅 SELECT）
7. SQL 执行与结果返回
8. 前端基础页面
9. 连接管理界面
10. 查询界面与结果展示

## 后续扩展（Day One 不包含）

- 支持 MySQL、SQLite 等其他数据库
- 查询历史记录
- SQL 语法高亮
- 结果导出 (CSV/Excel)
- 用户认证

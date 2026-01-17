# Frontend Day One 开发清单

基于 `spec/instructions.md` 规格说明，按文件结构分步实现前端功能。

---

## Step 1: 项目初始化

### 1.1 创建 React 项目
```bash
cd w2_dbquery
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

### 1.2 安装依赖
```bash
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 1.3 目录结构
```
frontend/
├── src/
│   ├── components/
│   │   ├── ConnectionList.jsx
│   │   ├── ConnectionForm.jsx
│   │   ├── QueryInput.jsx
│   │   ├── SqlPreview.jsx
│   │   ├── ResultTable.jsx
│   │   └── SchemaViewer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Connections.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Step 2: Tailwind CSS 配置

### 2.1 tailwind.config.js
- [ ] 配置 content 路径
- [ ] 配置主题色（可选）

### 2.2 src/index.css
- [ ] 添加 Tailwind 指令
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 3: API 服务层

### 3.1 src/services/api.js
- [ ] 创建 axios 实例，配置 baseURL
- [ ] `getConnections()` - GET /api/connections
- [ ] `createConnection(data)` - POST /api/connections
- [ ] `deleteConnection(id)` - DELETE /api/connections/{id}
- [ ] `testConnection(id)` - POST /api/connections/{id}/test
- [ ] `getSchema(id)` - GET /api/connections/{id}/schema
- [ ] `generateSql(data)` - POST /api/generate-sql
- [ ] `executeSql(data)` - POST /api/execute-sql

---

## Step 4: 组件实现

### 4.1 src/components/ConnectionList.jsx
**功能：** 显示已保存的数据库连接列表

- [ ] Props: `connections`, `onDelete`, `onTest`, `onSelect`
- [ ] 列表展示连接名称和连接字符串（部分隐藏）
- [ ] 每行操作按钮：测试、删除
- [ ] 空状态提示
- [ ] 测试结果状态显示（成功/失败）

### 4.2 src/components/ConnectionForm.jsx
**功能：** 添加新数据库连接的表单

- [ ] Props: `onSubmit`, `loading`
- [ ] 表单字段：
  - 连接名称 (name)
  - 连接字符串 (connection_string)
- [ ] 表单验证（必填）
- [ ] 提交按钮（带 loading 状态）
- [ ] 连接字符串格式提示：`postgresql://user:password@host:port/database`

### 4.3 src/components/QueryInput.jsx
**功能：** 自然语言查询输入

- [ ] Props: `value`, `onChange`, `onSubmit`, `loading`, `disabled`
- [ ] 多行文本输入框
- [ ] 占位符提示（如："请描述您想查询的数据..."）
- [ ] 生成 SQL 按钮
- [ ] 快捷键支持（Ctrl+Enter 提交）

### 4.4 src/components/SqlPreview.jsx
**功能：** SQL 预览和编辑

- [ ] Props: `sql`, `explanation`, `onChange`, `onExecute`, `loading`, `disabled`
- [ ] SQL 文本编辑区域（可编辑）
- [ ] LLM 解释说明展示
- [ ] 执行按钮
- [ ] 空状态（未生成 SQL 时）

### 4.5 src/components/ResultTable.jsx
**功能：** 查询结果二维表格展示

- [ ] Props: `columns`, `rows`, `rowCount`, `loading`
- [ ] 表头（列名）
- [ ] 数据行
- [ ] 行数统计显示
- [ ] 空状态（无数据时）
- [ ] 加载状态
- [ ] 横向滚动支持（列多时）

### 4.6 src/components/SchemaViewer.jsx
**功能：** 数据库 Schema 查看器

- [ ] Props: `schema`, `loading`
- [ ] 表列表（可折叠）
- [ ] 每个表显示列信息：列名、数据类型、是否可空
- [ ] 加载状态
- [ ] 空状态

---

## Step 5: 页面实现

### 5.1 src/pages/Connections.jsx
**功能：** 数据库连接管理页面

- [ ] 状态管理：
  - connections 列表
  - loading 状态
  - 表单提交状态
- [ ] 页面加载时获取连接列表
- [ ] 集成 ConnectionList 组件
- [ ] 集成 ConnectionForm 组件
- [ ] 处理添加连接
- [ ] 处理删除连接
- [ ] 处理测试连接
- [ ] 错误提示

### 5.2 src/pages/Home.jsx
**功能：** 查询主页面

- [ ] 状态管理：
  - 选中的连接 ID
  - 连接列表
  - 自然语言输入
  - 生成的 SQL
  - LLM 解释
  - 查询结果 (columns, rows, rowCount)
  - Schema 数据
  - 各种 loading 状态
- [ ] 页面布局：
  - 顶部：连接选择器
  - 左侧/上方：Schema 查看器（可选显示）
  - 中间：查询输入 → SQL 预览 → 结果表格
- [ ] 功能流程：
  1. 选择数据库连接
  2. 加载 Schema
  3. 输入自然语言
  4. 点击生成 SQL
  5. 预览/编辑 SQL
  6. 点击执行
  7. 查看结果
- [ ] 错误处理和提示

---

## Step 6: 应用入口与路由

### 6.1 src/App.jsx
- [ ] 配置 React Router
- [ ] 路由定义：
  - `/` - Home 页面
  - `/connections` - Connections 页面
- [ ] 导航栏组件
  - Logo/标题
  - 导航链接：查询、连接管理
- [ ] 页面布局容器

### 6.2 src/main.jsx
- [ ] 渲染 App 组件
- [ ] 引入全局样式

---

## Step 7: 样式与 UI 优化

### 7.1 通用样式
- [ ] 按钮样式（primary, secondary, danger）
- [ ] 输入框样式
- [ ] 卡片容器样式
- [ ] 表格样式
- [ ] Loading 状态样式

### 7.2 响应式布局
- [ ] 移动端适配
- [ ] 桌面端布局优化

---

## Step 8: 测试与验证

### 8.1 启动开发服务器
```bash
cd frontend
npm run dev
```

### 8.2 功能测试
- [ ] 连接管理页面
  - [ ] 添加新连接
  - [ ] 查看连接列表
  - [ ] 测试连接
  - [ ] 删除连接
- [ ] 查询页面
  - [ ] 选择数据库连接
  - [ ] 查看 Schema
  - [ ] 输入自然语言查询
  - [ ] 生成 SQL
  - [ ] 编辑 SQL
  - [ ] 执行查询
  - [ ] 查看结果表格
- [ ] 错误处理
  - [ ] 网络错误提示
  - [ ] 无效 SQL 错误提示
  - [ ] 空状态显示

---

## 开发顺序建议

按依赖关系，推荐开发顺序：

1. **Step 1** - 项目初始化
2. **Step 2** - Tailwind CSS 配置
3. **Step 3** - API 服务层 (api.js)
4. **Step 4.1-4.2** - ConnectionList + ConnectionForm
5. **Step 5.1** - Connections 页面
6. **Step 4.3-4.5** - QueryInput + SqlPreview + ResultTable
7. **Step 4.6** - SchemaViewer
8. **Step 5.2** - Home 页面
9. **Step 6** - App.jsx 路由配置
10. **Step 7** - 样式优化
11. **Step 8** - 测试验证

---

## 文件清单

| 文件路径 | 功能 | 依赖 |
|---------|------|------|
| `frontend/tailwind.config.js` | Tailwind 配置 | 无 |
| `frontend/src/index.css` | 全局样式 | tailwind |
| `frontend/src/services/api.js` | API 调用封装 | axios |
| `frontend/src/components/ConnectionList.jsx` | 连接列表组件 | 无 |
| `frontend/src/components/ConnectionForm.jsx` | 添加连接表单 | 无 |
| `frontend/src/components/QueryInput.jsx` | 自然语言输入 | 无 |
| `frontend/src/components/SqlPreview.jsx` | SQL 预览编辑 | 无 |
| `frontend/src/components/ResultTable.jsx` | 结果表格 | 无 |
| `frontend/src/components/SchemaViewer.jsx` | Schema 查看器 | 无 |
| `frontend/src/pages/Connections.jsx` | 连接管理页 | ConnectionList, ConnectionForm, api |
| `frontend/src/pages/Home.jsx` | 查询主页 | QueryInput, SqlPreview, ResultTable, SchemaViewer, api |
| `frontend/src/App.jsx` | 应用入口 | pages, react-router-dom |
| `frontend/src/main.jsx` | 渲染入口 | App |

---

## API 接口对接

| 前端方法 | 后端端点 | 用途 |
|---------|---------|------|
| `getConnections()` | GET /api/connections | 获取连接列表 |
| `createConnection(data)` | POST /api/connections | 添加连接 |
| `deleteConnection(id)` | DELETE /api/connections/{id} | 删除连接 |
| `testConnection(id)` | POST /api/connections/{id}/test | 测试连接 |
| `getSchema(id)` | GET /api/connections/{id}/schema | 获取 Schema |
| `generateSql(data)` | POST /api/generate-sql | 生成 SQL |
| `executeSql(data)` | POST /api/execute-sql | 执行 SQL |

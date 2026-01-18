# Frontend Day One 开发清单

基于 `spec/instructions.md` 规格说明，按文件结构分步实现前端功能。

**开发语言：TypeScript**

---

## Step 1: 项目初始化 ✅ 已完成

### 1.1 创建 React + TypeScript 项目 ✅
```bash
cd w2_dbquery
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

### 1.2 安装依赖 ✅
```bash
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node
```

**实际安装的依赖版本：**
| 包名 | 版本 | 类型 |
|------|------|------|
| react | ^19.2.0 | 运行时 |
| react-dom | ^19.2.0 | 运行时 |
| axios | ^1.13.2 | 运行时 |
| react-router-dom | ^7.12.0 | 运行时 |
| tailwindcss | ^4.1.18 | 开发 |
| postcss | ^8.5.6 | 开发 |
| autoprefixer | ^10.4.23 | 开发 |
| @types/node | ^24.10.9 | 开发 |
| typescript | ~5.9.3 | 开发 |
| vite | ^7.2.4 | 开发 |

> **注意：** Tailwind CSS v4 不再需要 `npx tailwindcss init -p` 命令，配置方式有所变化。

### 1.3 目录结构 ✅
```
frontend/
├── src/
│   ├── components/
│   │   └── common/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── assets/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── vite.config.ts
```

---

## Step 2: 配置文件 ✅ 已完成

### 2.1 vite.config.ts（API 代理配置） ✅
- [x] 配置开发服务器代理
- [x] 将 `/api` 请求代理到后端 `http://localhost:8000`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### 2.2 环境变量配置 ✅
- [x] 创建 `.env.example` 文件
```
VITE_API_BASE_URL=http://localhost:8000
```
- [ ] 创建 `.env` 文件（本地开发用，不提交到 git）

### 2.3 tailwind.config.js ✅
- [x] 配置 content 路径
- [x] 配置主题色（可选）
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2.4 postcss.config.js ✅
- [x] 确认 Tailwind 和 Autoprefixer 配置
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 2.5 src/index.css ✅
- [x] 添加 Tailwind 指令
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
body {
  margin: 0;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
}
```

### 2.6 index.html ✅
- [x] 配置页面标题
- [x] 配置语言为 zh-CN
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SQL Query Assistant</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Step 3: TypeScript 类型定义 ✅ 已完成

### 3.1 src/types/index.ts ✅
- [x] 定义所有 API 相关类型
```typescript
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
```

> **注意：** 使用 `unknown[][]` 替代 `any[][]` 以提高类型安全性。

---

## Step 4: API 服务层

### 4.1 src/services/api.ts
- [ ] 创建 axios 实例，配置 baseURL
- [ ] 添加请求/响应拦截器（错误处理）
- [ ] `getConnections(): Promise<Connection[]>` - GET /api/connections
- [ ] `createConnection(data: ConnectionCreate): Promise<Connection>` - POST /api/connections
- [ ] `deleteConnection(id: number): Promise<void>` - DELETE /api/connections/{id}
- [ ] `testConnection(id: number): Promise<ConnectionTestResponse>` - POST /api/connections/{id}/test
- [ ] `getSchema(id: number): Promise<SchemaResponse>` - GET /api/connections/{id}/schema
- [ ] `generateSql(data: GenerateSqlRequest): Promise<GenerateSqlResponse>` - POST /api/generate-sql
- [ ] `executeSql(data: ExecuteSqlRequest): Promise<ExecuteSqlResponse>` - POST /api/execute-sql

---

## Step 5: 通用组件

### 5.1 src/components/common/Loading.tsx
**功能：** 统一的加载状态显示

- [ ] Props: `size?: 'sm' | 'md' | 'lg'`, `text?: string`
- [ ] Spinner 动画
- [ ] 可选的加载文字

### 5.2 src/components/common/Toast.tsx
**功能：** 统一的消息提示组件

- [ ] Props: `messages: ToastMessage[]`, `onClose: (id: string) => void`
- [ ] 支持 success/error/info/warning 类型
- [ ] 自动消失（可配置时间）
- [ ] 手动关闭按钮

### 5.3 src/components/common/ErrorBoundary.tsx
**功能：** React 错误边界，捕获组件渲染错误

- [ ] 捕获子组件错误
- [ ] 显示友好的错误提示
- [ ] 提供重试按钮

---

## Step 6: 业务组件实现

### 6.1 src/components/ConnectionList.tsx
**功能：** 显示已保存的数据库连接列表

- [ ] Props: `connections: Connection[]`, `onDelete: (id: number) => void`, `onTest: (id: number) => void`, `onSelect?: (id: number) => void`
- [ ] 列表展示连接名称和连接字符串（部分隐藏）
- [ ] 每行操作按钮：测试、删除
- [ ] 空状态提示
- [ ] 测试结果状态显示（成功/失败）

### 6.2 src/components/ConnectionForm.tsx
**功能：** 添加新数据库连接的表单

- [ ] Props: `onSubmit: (data: ConnectionCreate) => void`, `loading: boolean`
- [ ] 表单字段：
  - 连接名称 (name)
  - 连接字符串 (connection_string)
- [ ] 表单验证（必填）
- [ ] 提交按钮（带 loading 状态）
- [ ] 连接字符串格式提示：`postgresql://user:password@host:port/database`

### 6.3 src/components/ConnectionSelector.tsx
**功能：** 数据库连接选择下拉框

- [ ] Props: `connections: Connection[]`, `selectedId: number | null`, `onChange: (id: number) => void`, `disabled?: boolean`
- [ ] 下拉选择框
- [ ] 显示连接名称
- [ ] 空状态提示（无可用连接）

### 6.4 src/components/QueryInput.tsx
**功能：** 自然语言查询输入

- [ ] Props: `value: string`, `onChange: (value: string) => void`, `onSubmit: () => void`, `loading: boolean`, `disabled: boolean`
- [ ] 多行文本输入框
- [ ] 占位符提示（如："请描述您想查询的数据..."）
- [ ] 生成 SQL 按钮
- [ ] 快捷键支持（Ctrl+Enter 提交）

### 6.5 src/components/SqlPreview.tsx
**功能：** SQL 预览和编辑

- [ ] Props: `sql: string`, `explanation: string`, `onChange: (sql: string) => void`, `onExecute: () => void`, `loading: boolean`, `disabled: boolean`
- [ ] SQL 文本编辑区域（可编辑）
- [ ] LLM 解释说明展示
- [ ] 执行按钮
- [ ] 空状态（未生成 SQL 时）

### 6.6 src/components/ResultTable.tsx
**功能：** 查询结果二维表格展示

- [ ] Props: `columns: string[]`, `rows: any[][]`, `rowCount: number`, `loading: boolean`
- [ ] 表头（列名）
- [ ] 数据行
- [ ] 行数统计显示
- [ ] 空状态（无数据时）
- [ ] 加载状态
- [ ] 横向滚动支持（列多时）

### 6.7 src/components/SchemaViewer.tsx
**功能：** 数据库 Schema 查看器

- [ ] Props: `schema: TableSchema[]`, `loading: boolean`
- [ ] 表列表（可折叠）
- [ ] 每个表显示列信息：列名、数据类型、是否可空
- [ ] 加载状态
- [ ] 空状态

---

## Step 7: 页面实现

### 7.1 src/pages/Connections.tsx
**功能：** 数据库连接管理页面

- [ ] 状态管理：
  - connections: Connection[]
  - loading: boolean
  - formLoading: boolean
- [ ] 页面加载时获取连接列表
- [ ] 集成 ConnectionList 组件
- [ ] 集成 ConnectionForm 组件
- [ ] 处理添加连接
- [ ] 处理删除连接
- [ ] 处理测试连接
- [ ] 错误提示（使用 Toast）

### 7.2 src/pages/Home.tsx
**功能：** 查询主页面

- [ ] 状态管理：
  - selectedConnectionId: number | null
  - connections: Connection[]
  - naturalLanguageQuery: string
  - generatedSql: string
  - explanation: string
  - queryResult: ExecuteSqlResponse | null
  - schema: TableSchema[]
  - 各种 loading 状态
- [ ] 页面布局：
  - 顶部：连接选择器 (ConnectionSelector)
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
- [ ] 错误处理和提示（使用 Toast）

---

## Step 8: 应用入口与路由

### 8.1 src/App.tsx
- [ ] 配置 React Router
- [ ] 路由定义：
  - `/` - Home 页面
  - `/connections` - Connections 页面
- [ ] 导航栏组件
  - Logo/标题
  - 导航链接：查询、连接管理
- [ ] 页面布局容器
- [ ] 包裹 ErrorBoundary
- [ ] Toast 容器

### 8.2 src/main.tsx
- [ ] 渲染 App 组件
- [ ] 引入全局样式
- [ ] 配置 BrowserRouter

---

## Step 9: 样式与 UI 优化

### 9.1 通用样式
- [ ] 按钮样式（primary, secondary, danger）
- [ ] 输入框样式
- [ ] 卡片容器样式
- [ ] 表格样式
- [ ] Loading 状态样式

### 9.2 响应式布局
- [ ] 移动端适配
- [ ] 桌面端布局优化

---

## Step 10: 测试与验证

### 10.1 启动开发服务器
```bash
cd frontend
npm run dev
```

### 10.2 功能测试
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
- [ ] TypeScript 类型检查
  - [ ] 运行 `npm run build` 确保无类型错误

---

## 开发顺序建议

按依赖关系，推荐开发顺序：

1. **Step 1** - 项目初始化（React + TypeScript）
2. **Step 2** - 配置文件（vite.config.ts, tailwind, 环境变量）
3. **Step 3** - TypeScript 类型定义 (types/index.ts)
4. **Step 4** - API 服务层 (api.ts)
5. **Step 5** - 通用组件 (Loading, Toast, ErrorBoundary)
6. **Step 6.1-6.2** - ConnectionList + ConnectionForm
7. **Step 7.1** - Connections 页面
8. **Step 6.3-6.6** - ConnectionSelector + QueryInput + SqlPreview + ResultTable
9. **Step 6.7** - SchemaViewer
10. **Step 7.2** - Home 页面
11. **Step 8** - App.tsx 路由配置
12. **Step 9** - 样式优化
13. **Step 10** - 测试验证

---

## 文件清单

| 文件路径 | 功能 | 依赖 |
|---------|------|------|
| `frontend/vite.config.ts` | Vite 配置（含 API 代理） | 无 |
| `frontend/.env.example` | 环境变量模板 | 无 |
| `frontend/tailwind.config.js` | Tailwind 配置 | 无 |
| `frontend/postcss.config.js` | PostCSS 配置 | tailwind |
| `frontend/index.html` | HTML 入口 | 无 |
| `frontend/src/index.css` | 全局样式 | tailwind |
| `frontend/src/types/index.ts` | TypeScript 类型定义 | 无 |
| `frontend/src/services/api.ts` | API 调用封装 | axios, types |
| `frontend/src/components/common/Loading.tsx` | 加载组件 | 无 |
| `frontend/src/components/common/Toast.tsx` | 消息提示组件 | types |
| `frontend/src/components/common/ErrorBoundary.tsx` | 错误边界组件 | 无 |
| `frontend/src/components/ConnectionList.tsx` | 连接列表组件 | types |
| `frontend/src/components/ConnectionForm.tsx` | 添加连接表单 | types |
| `frontend/src/components/ConnectionSelector.tsx` | 连接选择器 | types |
| `frontend/src/components/QueryInput.tsx` | 自然语言输入 | 无 |
| `frontend/src/components/SqlPreview.tsx` | SQL 预览编辑 | 无 |
| `frontend/src/components/ResultTable.tsx` | 结果表格 | types |
| `frontend/src/components/SchemaViewer.tsx` | Schema 查看器 | types |
| `frontend/src/pages/Connections.tsx` | 连接管理页 | ConnectionList, ConnectionForm, api, Toast |
| `frontend/src/pages/Home.tsx` | 查询主页 | ConnectionSelector, QueryInput, SqlPreview, ResultTable, SchemaViewer, api, Toast |
| `frontend/src/App.tsx` | 应用入口 | pages, react-router-dom, ErrorBoundary, Toast |
| `frontend/src/main.tsx` | 渲染入口 | App |

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

---

## TypeScript 配置说明

### tsconfig.json 关键配置
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 类型检查命令
```bash
# 检查类型错误
npx tsc --noEmit

# 构建（包含类型检查）
npm run build
```

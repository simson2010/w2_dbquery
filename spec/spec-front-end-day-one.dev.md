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

## Step 4: API 服务层 ✅ 已完成

### 4.1 src/services/api.ts ✅
- [x] 创建 axios 实例，配置 baseURL (`/api`)
- [x] 添加请求拦截器
- [x] 添加响应拦截器（统一错误处理）
- [x] `getConnections(): Promise<Connection[]>` - GET /api/connections
- [x] `createConnection(data: ConnectionCreate): Promise<Connection>` - POST /api/connections
- [x] `deleteConnection(id: number): Promise<void>` - DELETE /api/connections/{id}
- [x] `testConnection(id: number): Promise<ConnectionTestResponse>` - POST /api/connections/{id}/test
- [x] `getSchema(id: number): Promise<SchemaResponse>` - GET /api/connections/{id}/schema
- [x] `generateSql(data: GenerateSqlRequest): Promise<GenerateSqlResponse>` - POST /api/generate-sql
- [x] `executeSql(data: ExecuteSqlRequest): Promise<ExecuteSqlResponse>` - POST /api/execute-sql

**实现细节：**
- 使用 `/api` 作为 baseURL，配合 Vite 代理转发到后端
- 请求超时设置为 30 秒
- 响应拦截器统一处理错误，提取 `detail` 字段作为错误信息

---

## Step 5: 通用组件 ✅ 已完成

### 5.1 src/components/common/Loading.tsx ✅
**功能：** 统一的加载状态显示

- [x] Props: `size?: 'sm' | 'md' | 'lg'`, `text?: string`
- [x] Spinner 动画（CSS border + animate-spin）
- [x] 可选的加载文字

### 5.2 src/components/common/Toast.tsx ✅
**功能：** 统一的消息提示组件

- [x] Props: `messages: ToastMessage[]`, `onClose: (id: string) => void`, `autoCloseDuration?: number`
- [x] 支持 success/error/info/warning 类型（不同颜色和图标）
- [x] 自动消失（默认 3 秒）
- [x] 手动关闭按钮
- [x] 固定定位在右上角

### 5.3 src/components/common/ErrorBoundary.tsx ✅
**功能：** React 错误边界，捕获组件渲染错误

- [x] 捕获子组件错误
- [x] 显示友好的错误提示
- [x] 提供重试按钮
- [x] 支持自定义 fallback

---

## Step 6: 业务组件实现 ✅ 已完成

### 6.1 src/components/ConnectionList.tsx ✅
**功能：** 显示已保存的数据库连接列表

- [x] Props: `connections: Connection[]`, `onDelete: (id: number) => void`, `onTest: (id: number) => void`, `onSelect?: (id: number) => void`, `loading?: boolean`
- [x] 列表展示连接名称和连接字符串（密码部分隐藏为 `****`）
- [x] 每行操作按钮：测试、删除
- [x] 空状态提示
- [x] 测试结果状态显示（成功/失败，带颜色区分）
- [x] 加载状态支持

### 6.2 src/components/ConnectionForm.tsx ✅
**功能：** 添加新数据库连接的表单

- [x] Props: `onSubmit: (data: ConnectionCreate) => void`, `loading: boolean`
- [x] 表单字段：连接名称、连接字符串
- [x] 表单验证（必填、格式校验）
- [x] 提交按钮（带 loading 状态）
- [x] 连接字符串格式提示

### 6.3 src/components/ConnectionSelector.tsx ✅
**功能：** 数据库连接选择下拉框

- [x] Props: `connections: Connection[]`, `selectedId: number | null`, `onChange: (id: number) => void`, `disabled?: boolean`
- [x] 下拉选择框
- [x] 显示连接名称
- [x] 空状态提示（带跳转链接）

### 6.4 src/components/QueryInput.tsx ✅
**功能：** 自然语言查询输入

- [x] Props: `value: string`, `onChange: (value: string) => void`, `onSubmit: () => void`, `loading: boolean`, `disabled: boolean`
- [x] 多行文本输入框
- [x] 占位符提示
- [x] 生成 SQL 按钮
- [x] 快捷键支持（Ctrl+Enter / Cmd+Enter 提交）

### 6.5 src/components/SqlPreview.tsx ✅
**功能：** SQL 预览和编辑

- [x] Props: `sql: string`, `explanation: string`, `onChange: (sql: string) => void`, `onExecute: () => void`, `loading: boolean`, `disabled: boolean`
- [x] SQL 文本编辑区域（可编辑，等宽字体）
- [x] LLM 解释说明展示（蓝色背景卡片）
- [x] 执行按钮（绿色）
- [x] 空状态（未生成 SQL 时）

### 6.6 src/components/ResultTable.tsx ✅
**功能：** 查询结果二维表格展示

- [x] Props: `columns: string[]`, `rows: unknown[][]`, `rowCount: number`, `loading: boolean`
- [x] 表头（列名）
- [x] 数据行（斑马纹）
- [x] 行数统计显示
- [x] 空状态（无数据时）
- [x] 加载状态
- [x] 横向滚动支持
- [x] NULL 值特殊显示

### 6.7 src/components/SchemaViewer.tsx ✅
**功能：** 数据库 Schema 查看器

- [x] Props: `schema: TableSchema[]`, `loading: boolean`
- [x] 表列表（可折叠/展开）
- [x] 每个表显示列信息：列名、数据类型、是否可空
- [x] 展开全部/收起全部按钮
- [x] 加载状态
- [x] 空状态
- [x] 最大高度限制，支持滚动

---

## Step 7: 页面实现 ✅ 已完成

### 7.1 src/pages/Connections.tsx ✅
**功能：** 数据库连接管理页面

- [x] 状态管理：
  - connections: Connection[]
  - loading: boolean
  - formLoading: boolean
  - toasts: ToastMessage[]
- [x] 页面加载时获取连接列表
- [x] 集成 ConnectionList 组件
- [x] 集成 ConnectionForm 组件
- [x] 处理添加连接
- [x] 处理删除连接（带确认对话框）
- [x] 处理测试连接
- [x] 错误提示（使用 Toast）
- [x] 两栏布局（表单 + 列表）

### 7.2 src/pages/Home.tsx ✅
**功能：** 查询主页面

- [x] 状态管理：
  - selectedConnectionId: number | null
  - connections: Connection[]
  - naturalLanguageQuery: string
  - generatedSql: string
  - explanation: string
  - queryResult: ExecuteSqlResponse | null
  - schema: TableSchema[]
  - 各种 loading 状态
- [x] 页面布局：
  - 顶部：连接选择器 (ConnectionSelector)
  - 左侧：Schema 查看器（1/4 宽度）
  - 右侧：查询输入 → SQL 预览 → 结果表格（3/4 宽度）
- [x] 功能流程：
  1. 选择数据库连接
  2. 自动加载 Schema
  3. 输入自然语言
  4. 点击生成 SQL
  5. 预览/编辑 SQL
  6. 点击执行
  7. 查看结果
- [x] 错误处理和提示（使用 Toast）
- [x] 成功提示（显示返回记录数）

---

## Step 8: 应用入口与路由 ✅ 已完成

### 8.1 src/App.tsx ✅
- [x] 配置 React Router (Routes, Route)
- [x] 路由定义：
  - `/` - Home 页面
  - `/connections` - Connections 页面
- [x] 导航栏组件
  - Logo/标题（点击返回首页）
  - 导航链接：查询、连接管理
  - 当前页面高亮显示
- [x] 页面布局容器（灰色背景）
- [x] 包裹 ErrorBoundary

### 8.2 src/main.tsx ✅
- [x] 渲染 App 组件
- [x] 引入全局样式 (index.css)
- [x] 配置 BrowserRouter
- [x] StrictMode 包裹

**清理：**
- [x] 删除未使用的 App.css

---

## Step 9: 样式与 UI 优化 ✅ 已完成

### 9.1 通用样式 ✅
在 `src/index.css` 中使用 `@layer components` 定义了以下样式类：

- [x] 按钮样式：`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-success`
- [x] 输入框样式：`.input`, `.input-error`
- [x] 卡片容器样式：`.card`, `.card-header`
- [x] 表格样式：`.table` (含 th, td, 斑马纹)
- [x] 标签样式：`.label`
- [x] 空状态样式：`.empty-state`
- [x] 等宽字体样式：`.mono`
- [x] 工具类：`.scrollbar-hide`

### 9.2 响应式布局 ✅
- [x] 导航栏移动端适配
  - 较小的内边距和字体
  - 标题在小屏幕显示简短版本
  - 导航栏固定在顶部 (sticky)
- [x] Home 页面响应式布局
  - 移动端单列布局
  - 桌面端 1:3 比例布局（Schema : 查询区域）
- [x] Connections 页面响应式布局
  - 移动端单列布局
  - 桌面端两栏布局

---

## Step 10: 测试与验证 ✅ 已完成

### 10.1 TypeScript 类型检查与构建 ✅
```bash
cd frontend
npm run build
```

**构建结果：**
```
✓ 104 modules transformed.
dist/index.html                   0.47 kB │ gzip:  0.30 kB
dist/assets/index-DntcugJO.css   17.44 kB │ gzip:  4.26 kB
dist/assets/index-DvZzgOlj.js   284.32 kB │ gzip: 93.08 kB
✓ built in 1.09s
```

### 10.2 Tailwind CSS v4 配置修正 ✅
由于 Tailwind CSS v4 配置方式变更，进行了以下修正：

1. 安装 `@tailwindcss/postcss` 包
2. 更新 `postcss.config.js`：
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```
3. 更新 `src/index.css`：
```css
@import "tailwindcss";
```

> **注意：** Tailwind CSS v4 不再使用 `@tailwind base/components/utilities` 指令，改用 `@import "tailwindcss"`。自定义 `@layer components` 样式类需要使用其他方式实现。

### 10.3 启动开发服务器
```bash
cd frontend
npm run dev
```

### 10.4 功能测试清单
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

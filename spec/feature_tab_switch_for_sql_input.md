# 功能 ： FEATURE INPUT SWITCHED TAB

## 描述
用户可以用自然语言生成查询SQL或直接编写SQL。输入框用Tab切换编写SQL和自然语言输入。
当自然语言输入并生成完SQL后，将生成的SQL填充回SQL编辑框，并切换Tab到编写SQL。用户可以在此界面执行SQL。

---

## 用户故事

作为一个数据库用户，我希望能够：
1. 通过自然语言描述来生成 SQL 查询
2. 直接编写 SQL 查询
3. 在两种输入方式之间自由切换
4. 当 AI 生成 SQL 后，自动跳转到 SQL 编辑界面进行微调和执行

### 验收标准
- 输入区域有两个 Tab：「自然语言」和「SQL 编辑」
- 点击 Tab 可以切换输入模式
- 在「自然语言」Tab 生成 SQL 后，自动切换到「SQL 编辑」Tab
- 生成的 SQL 自动填充到 SQL 编辑器中
- 在「SQL 编辑」Tab 可以直接编写和执行 SQL
- 两个 Tab 的内容独立保存，切换时不丢失

---

## 功能需求

### FR-1: Tab 切换功能
- **FR-1.1**: 提供两个 Tab 选项：「自然语言」和「SQL 编辑」
- **FR-1.2**: 默认显示「自然语言」Tab
- **FR-1.3**: 点击 Tab 可切换输入模式
- **FR-1.4**: 当前激活的 Tab 有明显的视觉区分

### FR-2: 自然语言输入模式
- **FR-2.1**: 提供文本输入框用于输入自然语言描述
- **FR-2.2**: 提供「生成 SQL」按钮
- **FR-2.3**: 支持 Ctrl+Enter 快捷键生成 SQL
- **FR-2.4**: 生成 SQL 后自动切换到「SQL 编辑」Tab

### FR-3: SQL 编辑模式
- **FR-3.1**: 提供代码编辑器用于编写/编辑 SQL
- **FR-3.2**: 显示 AI 生成的解释说明（如果有）
- **FR-3.3**: 提供「执行查询」按钮
- **FR-3.4**: 支持 Ctrl+Enter 快捷键执行 SQL

### FR-4: 状态同步
- **FR-4.1**: 自然语言生成的 SQL 自动同步到 SQL 编辑器
- **FR-4.2**: 切换 Tab 时保留各自的输入内容
- **FR-4.3**: SQL 编辑器中的修改不影响自然语言输入

---

## 非功能需求

### NFR-1: 用户体验
- Tab 切换应即时响应，无延迟
- 自动切换 Tab 时应有平滑过渡
- 保持与现有 UI 风格一致

### NFR-2: 可访问性
- Tab 支持键盘导航
- 有适当的 ARIA 标签

---

## UI/UX 设计

### 界面布局

```
┌─────────────────────────────────────────────────────────────┐
│  [自然语言]  [SQL 编辑]                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  (Tab 内容区域)                                      │   │
│  │                                                     │   │
│  │  - 自然语言 Tab: 文本输入 + 生成按钮                  │   │
│  │  - SQL 编辑 Tab: SQL 编辑器 + 执行按钮               │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tab 样式

```
激活状态:   [  自然语言  ]     SQL 编辑
            ─────────────
            蓝色下划线/背景

未激活状态:    自然语言     [  SQL 编辑  ]
                           ─────────────
```

### 交互流程

**流程 1: 自然语言生成 SQL**
1. 用户在「自然语言」Tab 输入查询描述
2. 点击「生成 SQL」或按 Ctrl+Enter
3. 系统生成 SQL 并自动切换到「SQL 编辑」Tab
4. SQL 编辑器显示生成的 SQL 和 AI 解释
5. 用户可编辑 SQL 后点击「执行查询」

**流程 2: 直接编写 SQL**
1. 用户点击「SQL 编辑」Tab
2. 在 SQL 编辑器中直接编写 SQL
3. 点击「执行查询」或按 Ctrl+Enter

---

## 技术方案

### 方案概述

将现有的 `QueryInput` 和 `SqlPreview` 组件合并为一个新的 `QueryEditor` 组件，内部实现 Tab 切换逻辑。

### 组件结构

```
QueryEditor (新组件)
├── TabBar (Tab 切换栏)
├── NaturalLanguageTab (自然语言输入)
│   ├── TextArea
│   └── GenerateButton
└── SqlEditorTab (SQL 编辑)
    ├── ExplanationBox (可选)
    ├── SqlTextArea
    └── ExecuteButton
```

---

## 文件变更清单

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 新增 | `frontend/src/components/QueryEditor.tsx` | 新的带 Tab 切换的查询编辑器组件 |
| 修改 | `frontend/src/pages/Home.tsx` | 替换 QueryInput 和 SqlPreview 为 QueryEditor |
| 删除 | `frontend/src/components/QueryInput.tsx` | 功能已合并到 QueryEditor（可选保留） |
| 删除 | `frontend/src/components/SqlPreview.tsx` | 功能已合并到 QueryEditor（可选保留） |

---

## 详细开发步骤

### Step 1: 创建 QueryEditor 组件

**文件**: `frontend/src/components/QueryEditor.tsx`

**任务**:
1. 创建 Tab 切换状态管理
2. 实现 Tab 栏 UI
3. 实现自然语言输入面板
4. 实现 SQL 编辑面板
5. 实现自动切换逻辑

**组件 Props 设计**:

```typescript
interface QueryEditorProps {
  // 自然语言相关
  naturalLanguageQuery: string;
  onNaturalLanguageChange: (value: string) => void;
  onGenerateSql: () => void;
  generateLoading: boolean;

  // SQL 相关
  sql: string;
  explanation: string;
  onSqlChange: (value: string) => void;
  onExecuteSql: () => void;
  executeLoading: boolean;

  // 通用
  disabled: boolean;
}
```

**代码实现**:

```typescript
import { useState, useEffect, useCallback } from 'react';

type TabType = 'natural-language' | 'sql-editor';

interface QueryEditorProps {
  naturalLanguageQuery: string;
  onNaturalLanguageChange: (value: string) => void;
  onGenerateSql: () => void;
  generateLoading: boolean;
  sql: string;
  explanation: string;
  onSqlChange: (value: string) => void;
  onExecuteSql: () => void;
  executeLoading: boolean;
  disabled: boolean;
}

export default function QueryEditor({
  naturalLanguageQuery,
  onNaturalLanguageChange,
  onGenerateSql,
  generateLoading,
  sql,
  explanation,
  onSqlChange,
  onExecuteSql,
  executeLoading,
  disabled,
}: QueryEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('natural-language');
  const [prevSql, setPrevSql] = useState(sql);

  // 当 SQL 从空变为有值时，自动切换到 SQL 编辑 Tab
  useEffect(() => {
    if (sql && !prevSql && activeTab === 'natural-language') {
      setActiveTab('sql-editor');
    }
    setPrevSql(sql);
  }, [sql, prevSql, activeTab]);

  const handleNaturalLanguageKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && !generateLoading && naturalLanguageQuery.trim()) {
          onGenerateSql();
        }
      }
    },
    [disabled, generateLoading, naturalLanguageQuery, onGenerateSql]
  );

  const handleSqlKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!disabled && !executeLoading && sql.trim()) {
          onExecuteSql();
        }
      }
    },
    [disabled, executeLoading, sql, onExecuteSql]
  );

  const tabs = [
    { id: 'natural-language' as TabType, label: '自然语言' },
    { id: 'sql-editor' as TabType, label: 'SQL 编辑' },
  ];

  return (
    <div className="space-y-4">
      {/* Tab 栏 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab 内容 */}
      {activeTab === 'natural-language' ? (
        <div className="space-y-3">
          <textarea
            value={naturalLanguageQuery}
            onChange={(e) => onNaturalLanguageChange(e.target.value)}
            onKeyDown={handleNaturalLanguageKeyDown}
            placeholder="请描述您想查询的数据...&#10;例如：查询所有用户的姓名和邮箱"
            rows={4}
            disabled={disabled || generateLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              提示：按 Ctrl+Enter 快速生成 SQL
            </span>
            <button
              onClick={onGenerateSql}
              disabled={disabled || generateLoading || !naturalLanguageQuery.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generateLoading ? '生成中...' : '生成 SQL'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {explanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-1">AI 解释</h4>
              <p className="text-sm text-blue-700">{explanation}</p>
            </div>
          )}

          <textarea
            value={sql}
            onChange={(e) => onSqlChange(e.target.value)}
            onKeyDown={handleSqlKeyDown}
            placeholder="在此输入 SQL 查询语句..."
            rows={6}
            disabled={disabled || executeLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm resize-none bg-gray-50"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              提示：按 Ctrl+Enter 快速执行查询
            </span>
            <button
              onClick={onExecuteSql}
              disabled={disabled || executeLoading || !sql.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {executeLoading ? '执行中...' : '执行查询'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Step 2: 修改 Home 页面

**文件**: `frontend/src/pages/Home.tsx`

**任务**:
1. 导入新的 QueryEditor 组件
2. 移除 QueryInput 和 SqlPreview 的导入
3. 替换原有的两个组件为 QueryEditor
4. 调整布局（合并为一个卡片）

**主要变更**:

```typescript
// 移除
import QueryInput from '../components/QueryInput';
import SqlPreview from '../components/SqlPreview';

// 添加
import QueryEditor from '../components/QueryEditor';

// 替换 JSX 中的两个组件为一个
<div className="bg-white rounded-lg shadow p-4">
  <QueryEditor
    naturalLanguageQuery={naturalLanguageQuery}
    onNaturalLanguageChange={setNaturalLanguageQuery}
    onGenerateSql={handleGenerateSql}
    generateLoading={generateLoading}
    sql={generatedSql}
    explanation={explanation}
    onSqlChange={setGeneratedSql}
    onExecuteSql={handleExecuteSql}
    executeLoading={executeLoading}
    disabled={!isConnectionSelected}
  />
</div>
```

---

### Step 3: 清理旧组件（可选）

**任务**:
- 如果确认不再需要，可删除 `QueryInput.tsx` 和 `SqlPreview.tsx`
- 或保留作为备份/参考

---

## 开发顺序

```
Step 1: 创建 QueryEditor.tsx
    ↓
Step 2: 修改 Home.tsx
    ↓
Step 3: 测试验证
    ↓
Step 4: 清理旧组件（可选）
```

---

## 测试验证清单

### 功能测试

- [ ] Tab 切换
  - [ ] 点击「自然语言」Tab 显示自然语言输入界面
  - [ ] 点击「SQL 编辑」Tab 显示 SQL 编辑界面
  - [ ] Tab 切换时内容不丢失

- [ ] 自然语言生成 SQL
  - [ ] 输入自然语言后点击「生成 SQL」
  - [ ] 生成成功后自动切换到「SQL 编辑」Tab
  - [ ] SQL 编辑器中显示生成的 SQL
  - [ ] AI 解释正确显示

- [ ] 直接编写 SQL
  - [ ] 在「SQL 编辑」Tab 直接输入 SQL
  - [ ] 点击「执行查询」执行 SQL
  - [ ] Ctrl+Enter 快捷键正常工作

- [ ] 快捷键
  - [ ] 「自然语言」Tab: Ctrl+Enter 生成 SQL
  - [ ] 「SQL 编辑」Tab: Ctrl+Enter 执行查询

### 边界情况测试

- [ ] 未选择连接时，两个 Tab 都应禁用
- [ ] 生成 SQL 过程中，Tab 切换应正常
- [ ] 空输入时按钮应禁用

### UI 测试

- [ ] Tab 样式与整体 UI 风格一致
- [ ] 激活/未激活状态视觉区分明显
- [ ] 响应式布局正常

---

## 回滚方案

如果功能出现问题，可以通过以下步骤回滚：

1. 删除 `frontend/src/components/QueryEditor.tsx`
2. 恢复 `Home.tsx` 中对 `QueryInput` 和 `SqlPreview` 的使用
3. 确保 `QueryInput.tsx` 和 `SqlPreview.tsx` 未被删除

---

## 后续优化（可选）

1. **Tab 动画**: 添加 Tab 切换时的过渡动画
2. **SQL 语法高亮**: 在 SQL 编辑器中添加语法高亮
3. **历史记录**: 保存用户的查询历史
4. **模板**: 提供常用 SQL 模板

---

## 开发进度记录

### 2026-01-18 开发完成

| 步骤 | 状态 | 完成时间 | 备注 |
|------|------|----------|------|
| Step 1: 创建 QueryEditor.tsx | ✅ 完成 | 2026-01-18 | 实现 Tab 切换、自然语言输入、SQL 编辑功能 |
| Step 2: 修改 Home.tsx | ✅ 完成 | 2026-01-18 | 替换 QueryInput 和 SqlPreview 为 QueryEditor |
| Step 3: 构建验证 | ✅ 完成 | 2026-01-18 | TypeScript 编译通过，无错误 |
| Step 4: 清理旧组件 | ⏸️ 保留 | - | QueryInput.tsx 和 SqlPreview.tsx 保留作为备份 |

### 变更文件列表

```
frontend/src/components/QueryEditor.tsx  (新增) - 带 Tab 切换的查询编辑器组件
frontend/src/pages/Home.tsx              (修改) - 使用 QueryEditor 替换原有组件
frontend/src/components/QueryInput.tsx   (保留) - 原组件保留作为备份
frontend/src/components/SqlPreview.tsx   (保留) - 原组件保留作为备份
```

### 功能实现说明

1. **QueryEditor 组件** (`components/QueryEditor.tsx`)
   - Tab 切换状态管理 (`activeTab`: 'natural-language' | 'sql-editor')
   - 自然语言输入面板：文本输入 + 生成 SQL 按钮
   - SQL 编辑面板：AI 解释 + SQL 编辑器 + 执行按钮
   - 自动切换逻辑：SQL 从空变为有值时自动切换到 SQL 编辑 Tab
   - 快捷键支持：Ctrl+Enter 生成/执行

2. **Home 页面更新**
   - 移除 QueryInput 和 SqlPreview 导入
   - 使用单个 QueryEditor 组件替代
   - 布局从两个卡片合并为一个卡片

### 待手动测试项

- [ ] Tab 切换功能正常
- [ ] 自然语言生成 SQL 后自动切换 Tab
- [ ] SQL 编辑和执行功能正常
- [ ] Ctrl+Enter 快捷键正常工作
- [ ] 未选择连接时组件禁用状态正确

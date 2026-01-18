# 开发规格说明书：查询结果导出功能

## 概述

本文档详细描述了「查询结果导出」功能的开发计划，包括需要修改/新增的文件、具体的代码实现和开发步骤。

**功能目标**: 用户可以将 SQL 查询结果以 JSON 或 CSV 格式导出并下载到本地。

---

## 文件变更清单

| 操作 | 文件路径 | 说明 |
|------|----------|------|
| 新增 | `frontend/src/utils/export.ts` | 导出工具函数 |
| 修改 | `frontend/src/components/ResultTable.tsx` | 添加导出按钮和交互逻辑 |
| 修改 | `frontend/src/pages/Home.tsx` | 传递 Toast 回调给 ResultTable |

---

## 详细开发步骤

### Step 1: 创建导出工具函数

**文件**: `frontend/src/utils/export.ts`

**操作**: 新建文件

**功能说明**:
- `generateFileName(extension)`: 生成带时间戳的文件名
- `downloadFile(content, filename, mimeType)`: 触发浏览器下载
- `exportToJson(columns, rows)`: 导出为 JSON 格式
- `exportToCsv(columns, rows)`: 导出为 CSV 格式

**代码实现**:

```typescript
/**
 * 查询结果导出工具函数
 */

/**
 * 生成带时间戳的文件名
 * 格式: query_export_YYYYMMDD_HHmmss.{extension}
 */
function generateFileName(extension: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `query_export_${year}${month}${day}_${hours}${minutes}${seconds}.${extension}`;
}

/**
 * 触发浏览器下载文件
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * 将查询结果导出为 JSON 格式
 * @param columns 列名数组
 * @param rows 数据行数组
 */
export function exportToJson(columns: string[], rows: unknown[][]): void {
  // 将行数据转换为对象数组
  const data = rows.map(row => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      obj[col] = row[index];
    });
    return obj;
  });

  const jsonContent = JSON.stringify(data, null, 2);
  const filename = generateFileName('json');

  downloadFile(jsonContent, filename, 'application/json;charset=utf-8');
}

/**
 * 转义 CSV 单元格值
 * - 如果包含逗号、引号或换行符，需要用双引号包裹
 * - 双引号需要转义为两个双引号
 */
function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = String(value);

  // 检查是否需要转义
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    // 双引号转义为两个双引号，并用双引号包裹整个值
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * 将查询结果导出为 CSV 格式
 * @param columns 列名数组
 * @param rows 数据行数组
 */
export function exportToCsv(columns: string[], rows: unknown[][]): void {
  // UTF-8 BOM，确保 Excel 正确识别中文
  const BOM = '\uFEFF';

  // 生成表头行
  const headerRow = columns.map(col => escapeCsvValue(col)).join(',');

  // 生成数据行
  const dataRows = rows.map(row =>
    row.map(cell => escapeCsvValue(cell)).join(',')
  );

  // 组合所有行
  const csvContent = BOM + [headerRow, ...dataRows].join('\n');
  const filename = generateFileName('csv');

  downloadFile(csvContent, filename, 'text/csv;charset=utf-8');
}
```

**验证方式**:
- 在浏览器控制台手动调用函数测试
- 检查生成的文件格式是否正确

---

### Step 2: 修改 ResultTable 组件

**文件**: `frontend/src/components/ResultTable.tsx`

**操作**: 修改现有文件

**变更内容**:
1. 导入导出工具函数
2. 添加 `onExportSuccess` 回调 prop
3. 在记录数统计行添加导出按钮
4. 实现导出按钮点击处理

**修改后的完整代码**:

```typescript
import Loading from './common/Loading';
import { exportToJson, exportToCsv } from '../utils/export';

interface ResultTableProps {
  columns: string[];
  rows: unknown[][];
  rowCount: number;
  loading: boolean;
  onExportSuccess?: (format: 'json' | 'csv') => void;
}

export default function ResultTable({
  columns,
  rows,
  rowCount,
  loading,
  onExportSuccess
}: ResultTableProps) {

  const handleExportJson = () => {
    exportToJson(columns, rows);
    onExportSuccess?.('json');
  };

  const handleExportCsv = () => {
    exportToCsv(columns, rows);
    onExportSuccess?.('csv');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loading text="查询中..." />
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
        <p>查询结果区域</p>
        <p className="text-sm mt-1">执行 SQL 后，结果将显示在这里</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500">
        <p>查询完成，但没有返回数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* 记录数统计和导出按钮 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          共 <span className="font-medium">{rowCount}</span> 条记录
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
          >
            导出 JSON
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
          >
            导出 CSV
          </button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-2 border-b border-gray-100 whitespace-nowrap"
                    >
                      {cell === null ? (
                        <span className="text-gray-400 italic">NULL</span>
                      ) : (
                        String(cell)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

**关键变更点**:
1. 第 2 行：导入导出工具函数
2. 第 9 行：新增 `onExportSuccess` 可选回调 prop
3. 第 17-25 行：新增导出处理函数
4. 第 47-63 行：将原来的记录数统计改为 flex 布局，添加导出按钮

---

### Step 3: 修改 Home 页面

**文件**: `frontend/src/pages/Home.tsx`

**操作**: 修改现有文件

**变更内容**:
1. 添加导出成功回调函数
2. 将回调传递给 ResultTable 组件

**需要修改的代码段**:

在 `handleExecuteSql` 函数后添加导出成功回调：

```typescript
// 导出成功回调
const handleExportSuccess = (format: 'json' | 'csv') => {
  addToast('success', `已成功导出为 ${format.toUpperCase()} 格式`);
};
```

修改 ResultTable 组件调用，添加 `onExportSuccess` prop：

```tsx
<ResultTable
  columns={queryResult?.columns ?? []}
  rows={queryResult?.rows ?? []}
  rowCount={queryResult?.row_count ?? 0}
  loading={executeLoading}
  onExportSuccess={handleExportSuccess}
/>
```

**完整的修改位置**:
- 在 `Home.tsx` 约第 129 行后添加 `handleExportSuccess` 函数
- 在 `Home.tsx` 约第 183-188 行修改 `ResultTable` 组件调用

---

## 开发顺序

```
Step 1: 创建 utils/export.ts
    ↓
Step 2: 修改 ResultTable.tsx
    ↓
Step 3: 修改 Home.tsx
    ↓
Step 4: 测试验证
```

---

## 测试验证清单

### 功能测试

- [ ] JSON 导出
  - [ ] 点击「导出 JSON」按钮，文件自动下载
  - [ ] 文件名格式正确：`query_export_YYYYMMDD_HHmmss.json`
  - [ ] JSON 格式正确，可被解析
  - [ ] 数据内容与表格一致

- [ ] CSV 导出
  - [ ] 点击「导出 CSV」按钮，文件自动下载
  - [ ] 文件名格式正确：`query_export_YYYYMMDD_HHmmss.csv`
  - [ ] 用 Excel 打开，中文显示正常
  - [ ] 数据内容与表格一致

- [ ] Toast 提示
  - [ ] 导出成功后显示成功提示

### 边界情况测试

- [ ] 无查询结果时，导出按钮不显示
- [ ] 包含 NULL 值的数据正确处理
- [ ] 包含逗号的字符串在 CSV 中正确转义
- [ ] 包含双引号的字符串在 CSV 中正确转义
- [ ] 包含换行符的字符串在 CSV 中正确转义

### UI 测试

- [ ] 导出按钮样式与整体 UI 风格一致
- [ ] 按钮 hover 效果正常
- [ ] 响应式布局正常（移动端）

---

## 回滚方案

如果功能出现问题，可以通过以下步骤回滚：

1. 删除 `frontend/src/utils/export.ts`
2. 将 `ResultTable.tsx` 恢复到原版本
3. 将 `Home.tsx` 恢复到原版本

---

## 后续优化（可选）

1. **大数据量优化**: 当数据超过 10,000 行时，显示确认对话框
2. **导出进度**: 大数据量导出时显示进度条
3. **更多格式**: 支持 Excel (.xlsx) 格式导出
4. **自定义文件名**: 允许用户自定义导出文件名

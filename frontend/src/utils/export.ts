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

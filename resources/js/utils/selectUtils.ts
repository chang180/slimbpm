/**
 * Select 組件工具函數
 * 用於處理 Radix UI Select 組件的值轉換
 */

/**
 * 將空字符串轉換為 "none"，避免 Radix UI Select 錯誤
 */
export function normalizeSelectValue(value: string): string {
  return value === "" ? "none" : value;
}

/**
 * 將 "none" 轉換回空字符串或 null，用於表單提交
 */
export function denormalizeSelectValue(value: string, returnNull = false): string | null {
  if (value === "none") {
    return returnNull ? null : "";
  }
  return value;
}

/**
 * 處理 Select 組件的 onValueChange 回調
 * 自動將 "none" 轉換為空字符串
 */
export function createSelectHandler(
  setValue: (value: string) => void,
  returnNull = false
) {
  return (value: string) => {
    const normalizedValue = denormalizeSelectValue(value, returnNull);
    setValue(normalizedValue as string);
  };
}

/**
 * 處理表單提交時的 Select 值
 * 將 "none" 轉換為 null 或空字符串
 */
export function processSelectValueForSubmit(value: string, returnNull = false): string | null {
  return denormalizeSelectValue(value, returnNull);
}

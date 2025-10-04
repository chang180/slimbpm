import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface SafeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * 安全的 Select 組件
 * 自動處理空字符串值，避免 Radix UI 錯誤
 */
export function SafeSelect({
  value,
  onValueChange,
  placeholder,
  children,
  className,
}: SafeSelectProps) {
  // 將空字符串轉換為 "none" 來避免 Radix UI 錯誤
  const normalizedValue = value === "" ? "none" : value;
  
  const handleValueChange = (newValue: string) => {
    // 將 "none" 轉換回空字符串
    const denormalizedValue = newValue === "none" ? "" : newValue;
    onValueChange(denormalizedValue);
  };

  return (
    <Select
      value={normalizedValue}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  );
}

interface SafeSelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * 安全的 SelectItem 組件
 * 自動處理空字符串值
 */
export function SafeSelectItem({
  value,
  children,
  disabled,
}: SafeSelectItemProps) {
  // 將空字符串轉換為 "none"
  const normalizedValue = value === "" ? "none" : value;
  
  return (
    <SelectItem
      value={normalizedValue}
      disabled={disabled}
    >
      {children}
    </SelectItem>
  );
}

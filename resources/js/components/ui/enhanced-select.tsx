import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { normalizeSelectValue, denormalizeSelectValue } from '@/utils/selectUtils';

interface EnhancedSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
  returnNull?: boolean;
}

/**
 * 增強版 Select 組件
 * 自動處理空字符串值，避免 Radix UI 錯誤
 */
export function EnhancedSelect({
  value,
  onValueChange,
  placeholder,
  children,
  className,
  returnNull = false,
}: EnhancedSelectProps) {
  const handleValueChange = (newValue: string) => {
    const denormalizedValue = denormalizeSelectValue(newValue, returnNull);
    onValueChange(denormalizedValue as string);
  };

  return (
    <Select
      value={normalizeSelectValue(value)}
      onValueChange={handleValueChange}
      className={className}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
    </Select>
  );
}

interface EnhancedSelectItemProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * 增強版 SelectItem 組件
 * 自動處理空字符串值
 */
export function EnhancedSelectItem({
  value,
  children,
  disabled,
}: EnhancedSelectItemProps) {
  return (
    <SelectItem
      value={normalizeSelectValue(value)}
      disabled={disabled}
    >
      {children}
    </SelectItem>
  );
}

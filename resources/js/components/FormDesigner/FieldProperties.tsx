import React, { useState } from 'react';
import { FormField, SelectOption } from '../../types/FormTypes';

interface FieldPropertiesProps {
  field: FormField | undefined;
  onUpdate: (updates: Partial<FormField>) => void;
}

const FieldProperties: React.FC<FieldPropertiesProps> = ({ field, onUpdate }) => {
  const [options, setOptions] = useState<SelectOption[]>(
    field?.options || [{ value: '', label: '' }]
  );

  if (!field) {
    return (
      <div className="p-4 text-center text-gray-500">
        請選擇一個欄位來編輯屬性
      </div>
    );
  }

  const handleOptionChange = (index: number, key: keyof SelectOption, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [key]: value };
    setOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...options, { value: '', label: '' }];
    setOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      onUpdate({ options: newOptions });
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* 基本設定 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">基本設定</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              欄位標籤
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              提示文字
            </label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="請輸入提示文字"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={field.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
              必填欄位
            </label>
          </div>
        </div>
      </div>

      {/* 選項設定 (適用於 select, checkbox, radio) */}
      {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">選項設定</h3>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                  placeholder="選項標籤"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                  placeholder="選項值"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {options.length > 1 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="w-full px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50"
            >
              + 新增選項
            </button>
          </div>
        </div>
      )}

      {/* 驗證設定 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">驗證設定</h3>
        <div className="space-y-4">
          {field.type === 'text' || field.type === 'textarea' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最小長度
                  </label>
                  <input
                    type="number"
                    value={field.validation?.minLength || ''}
                    onChange={(e) => onUpdate({
                      validation: {
                        ...field.validation,
                        minLength: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最大長度
                  </label>
                  <input
                    type="number"
                    value={field.validation?.maxLength || ''}
                    onChange={(e) => onUpdate({
                      validation: {
                        ...field.validation,
                        maxLength: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          ) : field.type === 'number' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最小值
                </label>
                <input
                  type="number"
                  value={field.validation?.min || ''}
                  onChange={(e) => onUpdate({
                    validation: {
                      ...field.validation,
                      min: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最大值
                </label>
                <input
                  type="number"
                  value={field.validation?.max || ''}
                  onChange={(e) => onUpdate({
                    validation: {
                      ...field.validation,
                      max: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              自定義驗證規則
            </label>
            <input
              type="text"
              value={field.validation?.custom || ''}
              onChange={(e) => onUpdate({
                validation: {
                  ...field.validation,
                  custom: e.target.value
                }
              })}
              placeholder="正則表達式或自定義規則"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 條件式邏輯 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">條件式邏輯</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              觸發欄位
            </label>
            <select
              value={field.conditional?.field || ''}
              onChange={(e) => onUpdate({
                conditional: {
                  ...field.conditional,
                  field: e.target.value,
                  operator: 'equals',
                  value: '',
                  action: 'show'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選擇觸發欄位</option>
              {/* 這裡應該列出其他欄位 */}
            </select>
          </div>

          {field.conditional?.field && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  條件操作
                </label>
                <select
                  value={field.conditional.operator}
                  onChange={(e) => onUpdate({
                    conditional: {
                      ...field.conditional,
                      operator: e.target.value as any
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="equals">等於</option>
                  <option value="not_equals">不等於</option>
                  <option value="contains">包含</option>
                  <option value="greater_than">大於</option>
                  <option value="less_than">小於</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  觸發值
                </label>
                <input
                  type="text"
                  value={field.conditional.value || ''}
                  onChange={(e) => onUpdate({
                    conditional: {
                      ...field.conditional,
                      value: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  執行動作
                </label>
                <select
                  value={field.conditional.action}
                  onChange={(e) => onUpdate({
                    conditional: {
                      ...field.conditional,
                      action: e.target.value as any
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="show">顯示</option>
                  <option value="hide">隱藏</option>
                  <option value="require">設為必填</option>
                  <option value="optional">設為選填</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldProperties;

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormDefinition, FormField } from '../types/FormTypes';

interface DynamicFormProps {
  definition: FormDefinition;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onSave?: (data: Record<string, any>) => void;
  readOnly?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  definition,
  initialData = {},
  onSubmit,
  onSave,
  readOnly = false
}) => {
  const { control, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm({
    defaultValues: initialData
  });

  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const watchedValues = watch();

  // 計算進度
  useEffect(() => {
    if (definition.settings.showProgressBar) {
      const totalFields = definition.fields.length;
      const filledFields = Object.values(watchedValues).filter(value => 
        value !== undefined && value !== null && value !== ''
      ).length;
      setProgress((filledFields / totalFields) * 100);
    }
  }, [watchedValues, definition.settings.showProgressBar, definition.fields.length]);

  // 自動儲存
  useEffect(() => {
    if (definition.settings.autoSave && isDirty) {
      const timeoutId = setTimeout(() => {
        onSave?.(watchedValues);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, isDirty, definition.settings.autoSave, onSave]);

  // 檢查條件式邏輯
  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditional) return true;
    
    const { field: triggerField, operator, value, action } = field.conditional;
    const triggerValue = watchedValues[triggerField];
    
    let conditionMet = false;
    switch (operator) {
      case 'equals':
        conditionMet = triggerValue === value;
        break;
      case 'not_equals':
        conditionMet = triggerValue !== value;
        break;
      case 'contains':
        conditionMet = String(triggerValue).includes(String(value));
        break;
      case 'greater_than':
        conditionMet = Number(triggerValue) > Number(value);
        break;
      case 'less_than':
        conditionMet = Number(triggerValue) < Number(value);
        break;
    }
    
    return action === 'show' ? conditionMet : !conditionMet;
  };

  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null;

    const fieldError = errors[field.id];
    const isRequired = field.required || (field.conditional?.action === 'require' && shouldShowField(field));

    return (
      <div key={field.id} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>

        <Controller
          name={field.id}
          control={control}
          rules={{
            required: isRequired ? `${field.label}為必填欄位` : false,
            minLength: field.validation?.minLength ? {
              value: field.validation.minLength,
              message: `最少需要 ${field.validation.minLength} 個字元`
            } : undefined,
            maxLength: field.validation?.maxLength ? {
              value: field.validation.maxLength,
              message: `最多只能 ${field.validation.maxLength} 個字元`
            } : undefined,
            min: field.validation?.min ? {
              value: field.validation.min,
              message: `最小值為 ${field.validation.min}`
            } : undefined,
            max: field.validation?.max ? {
              value: field.validation.max,
              message: `最大值為 ${field.validation.max}`
            } : undefined,
            pattern: field.validation?.pattern ? {
              value: new RegExp(field.validation.pattern),
              message: '格式不正確'
            } : undefined
          }}
          render={({ field: formField }) => {
            const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
            const errorClasses = fieldError ? "border-red-500" : "";
            const disabledClasses = readOnly ? "bg-gray-100 cursor-not-allowed" : "";

            switch (field.type) {
              case 'text':
              case 'email':
              case 'phone':
              case 'url':
                return (
                  <input
                    {...formField}
                    type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                    placeholder={field.placeholder}
                    className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
                    disabled={readOnly}
                  />
                );

              case 'number':
                return (
                  <input
                    {...formField}
                    type="number"
                    placeholder={field.placeholder}
                    className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
                    disabled={readOnly}
                  />
                );

              case 'textarea':
                return (
                  <textarea
                    {...formField}
                    placeholder={field.placeholder}
                    rows={4}
                    className={`${baseClasses} ${errorClasses} ${disabledClasses} resize-none`}
                    disabled={readOnly}
                  />
                );

              case 'select':
                return (
                  <select
                    {...formField}
                    className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
                    disabled={readOnly}
                  >
                    <option value="">請選擇{field.label}</option>
                    {field.options?.map((option, index) => (
                      <option key={index} value={option.value} disabled={option.disabled}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                );

              case 'checkbox':
                return (
                  <div className="space-y-2">
                    {field.options?.map((option, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={formField.value?.includes(option.value) || false}
                          onChange={(e) => {
                            const currentValue = formField.value || [];
                            if (e.target.checked) {
                              formField.onChange([...currentValue, option.value]);
                            } else {
                              formField.onChange(currentValue.filter((v: string) => v !== option.value));
                            }
                          }}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          disabled={readOnly}
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                );

              case 'radio':
                return (
                  <div className="space-y-2">
                    {field.options?.map((option, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="radio"
                          value={option.value}
                          checked={formField.value === option.value}
                          onChange={(e) => formField.onChange(e.target.value)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          disabled={readOnly}
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                );

              case 'date':
                return (
                  <input
                    {...formField}
                    type="date"
                    className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
                    disabled={readOnly}
                  />
                );

              case 'file':
                return (
                  <input
                    {...formField}
                    type="file"
                    className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
                    disabled={readOnly}
                  />
                );

              default:
                return (
                  <input
                    {...formField}
                    type="text"
                    placeholder={field.placeholder}
                    className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
                    disabled={readOnly}
                  />
                );
            }
          }}
        />

        {fieldError && (
          <p className="mt-1 text-sm text-red-600">
            {typeof fieldError.message === 'string' ? fieldError.message : '此欄位有誤'}
          </p>
        )}
      </div>
    );
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    onSubmit(data);
  };

  const handleFormSave = () => {
    onSave?.(watchedValues);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      {/* 表單標題 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {definition.name}
        </h1>
        {definition.description && (
          <p className="text-gray-600">{definition.description}</p>
        )}
      </div>

      {/* 進度條 */}
      {definition.settings.showProgressBar && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>填寫進度</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* 表單欄位 */}
        {definition.fields.map(renderField)}

        {/* 提交按鈕 */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          {definition.settings.autoSave && onSave && (
            <button
              type="button"
              onClick={handleFormSave}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              儲存草稿
            </button>
          )}
          
          <button
            type="submit"
            disabled={readOnly}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {definition.settings.submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FormDefinition, FormField, FieldType } from '../types/FormTypes';
import FieldPalette from './FormDesigner/FieldPalette';
import FormCanvas from './FormDesigner/FormCanvas';
import FieldProperties from './FormDesigner/FieldProperties';
import FormSettings from './FormDesigner/FormSettings';

interface FormDesignerProps {
  initialForm?: FormDefinition;
  onSave: (form: FormDefinition) => void;
  onPreview: (form: FormDefinition) => void;
}

const FormDesigner: React.FC<FormDesignerProps> = ({ 
  initialForm, 
  onSave, 
  onPreview 
}) => {
  const [form, setForm] = useState<FormDefinition>(
    initialForm || {
      name: '',
      description: '',
      fields: [],
      layout: { sections: [] },
      settings: {
        allowMultipleSubmissions: false,
        requireAuthentication: false,
        showProgressBar: true,
        autoSave: false,
        submitButtonText: '提交',
        successMessage: '表單提交成功！'
      },
      version: '1.0.0'
    }
  );

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fields' | 'layout' | 'settings'>('fields');

  // 新增欄位
  const addField = useCallback((fieldType: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label: `新${getFieldTypeLabel(fieldType)}`,
      required: false,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 40 }
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  }, []);

  // 更新欄位
  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  }, []);

  // 刪除欄位
  const deleteField = useCallback((fieldId: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    setSelectedField(null);
  }, []);

  // 複製欄位
  const duplicateField = useCallback((fieldId: string) => {
    const field = form.fields.find(f => f.id === fieldId);
    if (field) {
      const newField: FormField = {
        ...field,
        id: `field_${Date.now()}`,
        label: `${field.label} (複製)`,
        position: { 
          x: field.position.x + 20, 
          y: field.position.y + 20 
        }
      };
      setForm(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
    }
  }, [form.fields]);

  // 更新表單設定
  const updateFormSettings = useCallback((settings: Partial<FormDefinition['settings']>) => {
    setForm(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }));
  }, []);

  // 儲存表單
  const handleSave = useCallback(() => {
    onSave(form);
  }, [form, onSave]);

  // 預覽表單
  const handlePreview = useCallback(() => {
    onPreview(form);
  }, [form, onPreview]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左側欄位面板 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">表單設計器</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <FieldPalette onAddField={addField} />
        </div>
      </div>

      {/* 中間設計區域 */}
      <div className="flex-1 flex flex-col">
        {/* 工具列 */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="表單名稱"
                className="text-lg font-semibold border-none outline-none bg-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreview}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                預覽
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                儲存
              </button>
            </div>
          </div>
        </div>

        {/* 設計畫布 */}
        <div className="flex-1 p-4">
          <FormCanvas
            form={form}
            selectedField={selectedField}
            onSelectField={setSelectedField}
            onUpdateField={updateField}
            onDeleteField={deleteField}
            onDuplicateField={duplicateField}
          />
        </div>
      </div>

      {/* 右側屬性面板 */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-1">
            {(['fields', 'layout', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'fields' && selectedField && (
            <FieldProperties
              field={form.fields.find(f => f.id === selectedField)}
              onUpdate={(updates) => updateField(selectedField, updates)}
            />
          )}
          {activeTab === 'layout' && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">表單佈局</h3>
              {/* 佈局設定內容 */}
            </div>
          )}
          {activeTab === 'settings' && (
            <FormSettings
              settings={form.settings}
              onUpdate={updateFormSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// 輔助函數
function getFieldTypeLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: '文字欄位',
    email: '電子郵件',
    number: '數字欄位',
    textarea: '多行文字',
    select: '下拉選單',
    checkbox: '核取方塊',
    radio: '單選按鈕',
    date: '日期',
    file: '檔案',
    phone: '電話號碼',
    url: '網址'
  };
  return labels[type] || type;
}

function getTabLabel(tab: string): string {
  const labels: Record<string, string> = {
    fields: '欄位屬性',
    layout: '佈局設定',
    settings: '表單設定'
  };
  return labels[tab] || tab;
}

export default FormDesigner;

import React, { useState } from 'react';
import { FormDefinition, FormField } from '../../types/FormTypes';
import FormFieldComponent from './FormFieldComponent';

interface FormCanvasProps {
  form: FormDefinition;
  selectedField: string | null;
  onSelectField: (fieldId: string | null) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
  onDeleteField: (fieldId: string) => void;
  onDuplicateField: (fieldId: string) => void;
}

const FormCanvas: React.FC<FormCanvasProps> = ({
  form,
  selectedField,
  onSelectField,
  onUpdateField,
  onDeleteField,
  onDuplicateField
}) => {
  const [draggedField, setDraggedField] = useState<string | null>(null);

  const handleFieldClick = (fieldId: string) => {
    onSelectField(fieldId);
  };

  const handleFieldMove = (fieldId: string, newPosition: { x: number; y: number }) => {
    onUpdateField(fieldId, { position: newPosition });
  };

  const handleFieldResize = (fieldId: string, newSize: { width: number; height: number }) => {
    onUpdateField(fieldId, { size: newSize });
  };

  const handleFieldDelete = (fieldId: string) => {
    onDeleteField(fieldId);
  };

  const handleFieldDuplicate = (fieldId: string) => {
    onDuplicateField(fieldId);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectField(null);
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-white border border-gray-200 rounded-lg overflow-auto"
      onClick={handleCanvasClick}
    >
      {/* 表單標題區域 */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {form.name || '未命名表單'}
        </h1>
        {form.description && (
          <p className="text-gray-600">{form.description}</p>
        )}
      </div>

      {/* 表單欄位區域 */}
      <div className="relative p-6 min-h-[400px]">
        {form.fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">開始建立表單</h3>
            <p className="text-sm text-center">
              從左側面板選擇欄位類型<br />
              開始建立您的表單
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {form.fields.map((field) => (
              <FormFieldComponent
                key={field.id}
                field={field}
                isSelected={selectedField === field.id}
                isDragging={draggedField === field.id}
                onClick={() => handleFieldClick(field.id)}
                onMove={(newPosition) => handleFieldMove(field.id, newPosition)}
                onResize={(newSize) => handleFieldResize(field.id, newSize)}
                onDelete={() => handleFieldDelete(field.id)}
                onDuplicate={() => handleFieldDuplicate(field.id)}
                onUpdate={(updates) => onUpdateField(field.id, updates)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 表單提交按鈕區域 */}
      {form.fields.length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
            {form.settings.submitButtonText}
          </button>
        </div>
      )}

      {/* 網格背景 */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
    </div>
  );
};

export default FormCanvas;

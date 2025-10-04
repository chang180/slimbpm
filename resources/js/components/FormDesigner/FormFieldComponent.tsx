import React, { useState, useRef } from 'react';
import { FormField } from '../../types/FormTypes';

interface FormFieldComponentProps {
  field: FormField;
  isSelected: boolean;
  isDragging: boolean;
  onClick: () => void;
  onMove: (position: { x: number; y: number }) => void;
  onResize: (size: { width: number; height: number }) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
}

const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  field,
  isSelected,
  isDragging,
  onClick,
  onMove,
  onResize,
  onDelete,
  onDuplicate,
  onUpdate
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStart && !isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      onMove({
        x: field.position.x + deltaX,
        y: field.position.y + deltaY
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
    setIsResizing(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMove = (e: React.MouseEvent) => {
    if (isResizing && dragStart) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      onResize({
        width: Math.max(100, (field.size?.width || 200) + deltaX),
        height: Math.max(40, (field.size?.height || 40) + deltaY)
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const renderFieldInput = () => {
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
        return (
          <input
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            placeholder={field.placeholder || `請輸入${field.label}`}
            className={baseClasses}
            disabled
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder || `請輸入${field.label}`}
            className={baseClasses}
            disabled
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder || `請輸入${field.label}`}
            className={`${baseClasses} resize-none`}
            rows={3}
            disabled
          />
        );
      
      case 'select':
        return (
          <select className={baseClasses} disabled>
            <option>請選擇{field.label}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
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
                  className="mr-2"
                  disabled
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
                  name={field.id}
                  className="mr-2"
                  disabled
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'date':
        return (
          <input
            type="date"
            className={baseClasses}
            disabled
          />
        );
      
      case 'file':
        return (
          <input
            type="file"
            className={baseClasses}
            disabled
          />
        );
      
      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder || `請輸入${field.label}`}
            className={baseClasses}
            disabled
          />
        );
    }
  };

  return (
    <div
      ref={fieldRef}
      className={`relative group cursor-move ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{
        position: 'absolute',
        left: field.position.x,
        top: field.position.y,
        width: field.size?.width || 200,
        height: field.size?.height || 40
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* 欄位標籤 */}
      <div className="mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {/* 欄位輸入 */}
      <div className="relative">
        {renderFieldInput()}
      </div>

      {/* 選中時的編輯工具列 */}
      {isSelected && (
        <div className="absolute -top-8 left-0 flex items-center space-x-1 bg-white border border-gray-200 rounded-md shadow-lg p-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="複製欄位"
          >
            📋
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
            title="刪除欄位"
          >
            🗑️
          </button>
        </div>
      )}

      {/* 調整大小控制點 */}
      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
          onMouseDown={handleResizeStart}
          onMouseMove={handleResizeMove}
          onMouseUp={handleMouseUp}
        />
      )}
    </div>
  );
};

export default FormFieldComponent;

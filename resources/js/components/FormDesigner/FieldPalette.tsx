import React from 'react';
import { FieldType } from '../../types/FormTypes';

interface FieldPaletteProps {
  onAddField: (fieldType: FieldType) => void;
}

const FieldPalette: React.FC<FieldPaletteProps> = ({ onAddField }) => {
  const fieldTypes: Array<{ type: FieldType; label: string; icon: string }> = [
    { type: 'text', label: '文字欄位', icon: '📝' },
    { type: 'email', label: '電子郵件', icon: '📧' },
    { type: 'number', label: '數字欄位', icon: '🔢' },
    { type: 'textarea', label: '多行文字', icon: '📄' },
    { type: 'select', label: '下拉選單', icon: '📋' },
    { type: 'checkbox', label: '核取方塊', icon: '☑️' },
    { type: 'radio', label: '單選按鈕', icon: '🔘' },
    { type: 'date', label: '日期', icon: '📅' },
    { type: 'file', label: '檔案', icon: '📎' },
    { type: 'phone', label: '電話號碼', icon: '📞' },
    { type: 'url', label: '網址', icon: '🔗' }
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">欄位類型</h3>
      <div className="grid grid-cols-1 gap-2">
        {fieldTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onAddField(type)}
            className="flex items-center p-3 text-left text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <span className="text-lg mr-3">{icon}</span>
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-6">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          使用說明
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• 點擊欄位類型新增到表單</p>
          <p>• 拖拽欄位調整位置</p>
          <p>• 點擊欄位編輯屬性</p>
        </div>
      </div>
    </div>
  );
};

export default FieldPalette;

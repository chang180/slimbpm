import React from 'react';
import { FormSettings as FormSettingsType } from '../../types/FormTypes';

interface FormSettingsProps {
  settings: FormSettingsType;
  onUpdate: (updates: Partial<FormSettingsType>) => void;
}

const FormSettings: React.FC<FormSettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="p-4 space-y-6">
      {/* 提交設定 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">提交設定</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowMultipleSubmissions"
              checked={settings.allowMultipleSubmissions}
              onChange={(e) => onUpdate({ allowMultipleSubmissions: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="allowMultipleSubmissions" className="ml-2 block text-sm text-gray-700">
              允許重複提交
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireAuthentication"
              checked={settings.requireAuthentication}
              onChange={(e) => onUpdate({ requireAuthentication: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="requireAuthentication" className="ml-2 block text-sm text-gray-700">
              需要登入才能提交
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSave"
              checked={settings.autoSave}
              onChange={(e) => onUpdate({ autoSave: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-700">
              自動儲存草稿
            </label>
          </div>
        </div>
      </div>

      {/* 顯示設定 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">顯示設定</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showProgressBar"
              checked={settings.showProgressBar}
              onChange={(e) => onUpdate({ showProgressBar: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showProgressBar" className="ml-2 block text-sm text-gray-700">
              顯示進度條
            </label>
          </div>
        </div>
      </div>

      {/* 文字設定 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">文字設定</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              提交按鈕文字
            </label>
            <input
              type="text"
              value={settings.submitButtonText}
              onChange={(e) => onUpdate({ submitButtonText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              成功訊息
            </label>
            <textarea
              value={settings.successMessage}
              onChange={(e) => onUpdate({ successMessage: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              重導向網址 (選填)
            </label>
            <input
              type="url"
              value={settings.redirectUrl || ''}
              onChange={(e) => onUpdate({ redirectUrl: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 進階設定 */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">進階設定</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              表單 ID
            </label>
            <input
              type="text"
              value={settings.formId || ''}
              onChange={(e) => onUpdate({ formId: e.target.value })}
              placeholder="自動生成"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              自定義 CSS 類別
            </label>
            <input
              type="text"
              value={settings.customClass || ''}
              onChange={(e) => onUpdate({ customClass: e.target.value })}
              placeholder="my-custom-form"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSettings;

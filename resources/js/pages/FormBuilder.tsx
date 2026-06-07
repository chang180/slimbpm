import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import FormDesigner from '../components/FormDesigner';
import DynamicForm from '../components/DynamicForm';
import { FormDefinition } from '../types/FormTypes';

export default function FormBuilder() {
  const [currentForm, setCurrentForm] = useState<FormDefinition | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [savedForms, setSavedForms] = useState<FormDefinition[]>([]);

  const handleSaveForm = (form: FormDefinition) => {
    const formWithId = {
      ...form,
      id: form.id || `form_${Date.now()}`,
      createdAt: form.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCurrentForm(formWithId);
    
    // 儲存到本地儲存
    const existingForms = JSON.parse(localStorage.getItem('savedForms') || '[]');
    const updatedForms = existingForms.filter((f: FormDefinition) => f.id !== formWithId.id);
    updatedForms.push(formWithId);
    localStorage.setItem('savedForms', JSON.stringify(updatedForms));
    setSavedForms(updatedForms);

    alert('表單已儲存！');
  };

  const handlePreviewForm = (form: FormDefinition) => {
    setCurrentForm(form);
    setPreviewMode(true);
  };

  const handleFormSubmit = (_data: Record<string, any>) => {
    alert('表單提交成功！');
  };

  const handleFormSave = (_data: Record<string, any>) => {
    alert('草稿已儲存！');
  };

  const loadSavedForms = () => {
    const forms = JSON.parse(localStorage.getItem('savedForms') || '[]');
    setSavedForms(forms);
  };

  const loadForm = (form: FormDefinition) => {
    setCurrentForm(form);
    setPreviewMode(false);
  };

  const createNewForm = () => {
    setCurrentForm(null);
    setPreviewMode(false);
  };

  return (
    <>
      <Head title="表單設計器" />

      {/* 開發中提示 */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-amber-800 font-medium">⚠ 開發中 / Demo</span>
          <span className="text-amber-700 text-sm">
            此頁面為 localStorage 展示用途，資料不會儲存至伺服器。
            正式建立表單請使用
          </span>
          <a href="/forms/create" className="text-amber-900 underline font-medium text-sm hover:text-amber-700">
            表單管理 → 新增表單
          </a>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50">
        {/* 頂部導航 */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">表單設計器</h1>
                {currentForm && (
                  <span className="text-sm text-gray-500">
                    {previewMode ? '預覽模式' : '編輯模式'}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={loadSavedForms}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  載入表單
                </button>
                <button
                  onClick={createNewForm}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  新建表單
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 主要內容 */}
        {!currentForm ? (
          <div className="max-w-4xl mx-auto py-12">
            <div className="text-center">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                歡迎使用表單設計器
              </h2>
              <p className="text-gray-600 mb-8">
                建立動態表單，支援多種欄位類型和條件式邏輯
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-3xl mb-4">🎨</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">拖拽式設計</h3>
                  <p className="text-gray-600 text-sm">
                    直觀的拖拽介面，輕鬆建立表單
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-3xl mb-4">⚡</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">動態驗證</h3>
                  <p className="text-gray-600 text-sm">
                    即時驗證和條件式欄位顯示
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="text-3xl mb-4">📱</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">響應式設計</h3>
                  <p className="text-gray-600 text-sm">
                    適配各種裝置和螢幕尺寸
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={createNewForm}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                >
                  開始建立表單
                </button>
              </div>
            </div>
          </div>
        ) : previewMode ? (
          <DynamicForm
            definition={currentForm}
            onSubmit={handleFormSubmit}
            onSave={handleFormSave}
          />
        ) : (
          <FormDesigner
            initialForm={currentForm}
            onSave={handleSaveForm}
            onPreview={handlePreviewForm}
          />
        )}

        {/* 載入表單模態框 */}
        {savedForms.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">選擇表單</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {savedForms.map((form) => (
                    <div
                      key={form.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{form.name}</h4>
                        <p className="text-sm text-gray-500">{form.description}</p>
                        <p className="text-xs text-gray-400">
                          建立時間: {new Date(form.createdAt || '').toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            loadForm(form);
                            setSavedForms([]);
                          }}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => {
                            setCurrentForm(form);
                            setPreviewMode(true);
                            setSavedForms([]);
                          }}
                          className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                        >
                          預覽
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setSavedForms([])}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FormTemplate, FormSubmission } from '../../types/FormTypes';
import DynamicForm from '../../components/DynamicForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';

interface FormSubmitProps {
  form: FormTemplate;
}

const FormSubmit: React.FC<FormSubmitProps> = ({ form }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      router.post(route('forms.process-submit', form.id), data, {
        onSuccess: () => {
          setSubmitSuccess(true);
        },
        onError: (errors) => {
          console.error('Submission errors:', errors);
          setSubmitError('提交失敗，請檢查表單資料');
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('提交失敗，請稍後再試');
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (data: Record<string, any>) => {
    // 實作草稿儲存功能
    console.log('Saving draft:', data);
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">提交成功！</h2>
              <p className="text-gray-600 mb-6">
                {form.definition.settings.successMessage || '您的表單已成功提交'}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  填寫另一份表單
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.get(route('forms.show', form.id))}
                  className="w-full"
                >
                  返回表單詳情
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title={`填寫表單 - ${form.name}`} />

      {/* 表單標題區域 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
              {form.description && (
                <p className="text-gray-600 mt-1">{form.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={() => router.get(route('forms.show', form.id))}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </div>
        </div>
      </div>

      {/* 表單內容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 錯誤訊息 */}
        {submitError && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* 表單資訊卡片 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">表單資訊</CardTitle>
            <CardDescription>
              請仔細填寫以下表單，標示 * 的欄位為必填項目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">建立者:</span>
                <p className="font-medium">{form.createdBy}</p>
              </div>
              <div>
                <span className="text-gray-600">分類:</span>
                <p className="font-medium">{form.category}</p>
              </div>
              <div>
                <span className="text-gray-600">欄位數量:</span>
                <p className="font-medium">{form.definition.fields.length}</p>
              </div>
              <div>
                <span className="text-gray-600">版本:</span>
                <p className="font-medium">{form.definition.version}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 動態表單 */}
        <Card>
          <CardContent className="p-0">
            <DynamicForm
              definition={form.definition}
              onSubmit={handleSubmit}
              onSave={form.definition.settings.autoSave ? handleSaveDraft : undefined}
              readOnly={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* 表單說明 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">填寫說明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div>
              <strong>必填欄位:</strong> 標示紅色 * 的欄位為必填項目，請確實填寫。
            </div>
            <div>
              <strong>資料驗證:</strong> 系統會自動驗證您輸入的資料格式，請按照提示填寫。
            </div>
            {form.definition.settings.autoSave && (
              <div>
                <strong>自動儲存:</strong> 您的填寫進度會自動儲存，可以稍後繼續填寫。
              </div>
            )}
            {form.definition.settings.allowMultipleSubmissions && (
              <div>
                <strong>多次提交:</strong> 您可以多次提交此表單。
              </div>
            )}
            {!form.definition.settings.allowMultipleSubmissions && (
              <div>
                <strong>單次提交:</strong> 每個用戶只能提交一次此表單。
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 提交狀態覆蓋層 */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">正在提交...</h3>
              <p className="text-gray-600">請稍候，我們正在處理您的表單</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FormSubmit;

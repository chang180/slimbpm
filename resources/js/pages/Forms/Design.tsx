import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FormDesigner from '@/components/FormDesigner';
import DynamicForm from '@/components/DynamicForm';
import AppLayout from '@/layouts/app-layout';
import formsRoutes from '@/routes/forms';
import { formDefinitionFromTemplate } from '@/lib/form-template';
import { Button } from '@/components/ui/button';
import { FormDefinition, FormTemplate } from '@/types/FormTypes';
import { ArrowLeft } from 'lucide-react';

interface FormDesignProps {
  form: FormTemplate;
}

export default function FormDesign({ form }: FormDesignProps) {
  const formId = Number(form.id);
  const initialDefinition = useMemo(
    () => formDefinitionFromTemplate(form),
    [form],
  );

  const [previewMode, setPreviewMode] = useState(false);
  const [previewDefinition, setPreviewDefinition] = useState<FormDefinition | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (definition: FormDefinition) => {
    setIsSaving(true);

    const payload = {
      name: definition.name,
      description: definition.description ?? '',
      definition: {
        fields: definition.fields,
        layout: definition.layout,
        settings: definition.settings,
        version: definition.version,
      },
    };

    router.put(
      formsRoutes.update.url({ form: formId }),
      JSON.parse(JSON.stringify(payload)),
      {
        preserveScroll: true,
        onFinish: () => setIsSaving(false),
      },
    );
  };

  const handlePreview = (definition: FormDefinition) => {
    setPreviewDefinition(definition);
    setPreviewMode(true);
  };

  return (
    <AppLayout>
      <Head title={`設計表單 - ${form.name}`} />

      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
          <div className="flex items-center justify-between max-w-full">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.get(formsRoutes.show.url({ form: formId }))}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回表單詳情
              </Button>
              <span className="text-sm text-gray-500">
                {previewMode ? '預覽模式（尚未儲存的變更）' : '欄位設計'}
              </span>
            </div>

            {previewMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(false)}
              >
                返回設計
              </Button>
            )}

            {isSaving && (
              <span className="text-sm text-gray-500">儲存中…</span>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0">
          {previewMode && previewDefinition ? (
            <div className="h-full overflow-y-auto bg-gray-50 p-6">
              <div className="max-w-2xl mx-auto">
                <DynamicForm
                  definition={previewDefinition}
                  onSubmit={() => {
                    alert('預覽模式：表單不會實際提交');
                  }}
                />
              </div>
            </div>
          ) : (
            <FormDesigner
              initialForm={initialDefinition}
              onSave={handleSave}
              onPreview={handlePreview}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

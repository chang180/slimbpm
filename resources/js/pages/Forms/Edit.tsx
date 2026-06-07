import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FormTemplate } from '../../types/FormTypes';
import AppLayout from '@/layouts/app-layout';
import formsRoutes from '@/routes/forms';
import { FormMetadataFields } from '@/components/forms/form-metadata-fields';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';

interface EditFormProps {
  form: FormTemplate;
  categories: string[];
  suggestedTags: string[];
}

const EditForm: React.FC<EditFormProps> = ({ form, categories, suggestedTags }) => {
  const formId = Number(form.id);

  const [formData, setFormData] = useState({
    name: form.name,
    description: form.description || '',
    category: form.category,
    tags: form.tags || [],
    isPublic: form.is_public,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.put(formsRoutes.update.url({ form: formId }), {
      name: formData.name,
      description: formData.description,
      category: formData.category || '未分類',
      tags: formData.tags,
      is_public: formData.isPublic,
    });
  };

  return (
    <AppLayout>
      <Head title={`編輯表單 - ${form.name}`} />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.get(formsRoutes.show.url({ form: formId }))}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回表單詳情
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">編輯表單</h1>
            <p className="mt-2 text-gray-600">修改表單的基本資訊和設定</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>基本資訊</CardTitle>
                    <CardDescription>
                      修改表單的基本資訊和描述
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">表單名稱 *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="輸入表單名稱"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">表單描述</Label>
                      <Textarea
                        id="description"
                        placeholder="描述此表單的用途和內容"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <FormMetadataFields
                      categories={categories}
                      suggestedTags={suggestedTags}
                      values={{ category: formData.category, tags: formData.tags }}
                      onChange={({ category, tags }) => setFormData({ ...formData, category, tags })}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>表單設定</CardTitle>
                    <CardDescription>
                      設定表單的公開性和基本選項
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isPublic">公開表單</Label>
                        <p className="text-sm text-gray-500">
                          允許組織內其他用戶查看和使用此表單
                        </p>
                      </div>
                      <Switch
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    儲存變更
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.get(formsRoutes.show.url({ form: formId }))}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditForm;

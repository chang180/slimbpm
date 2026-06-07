import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FormDefinition } from '../../types/FormTypes';
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

interface CreateFormProps {
  categories: string[];
  suggestedTags: string[];
}

const CreateForm: React.FC<CreateFormProps> = ({ categories, suggestedTags }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '未分類',
    tags: [] as string[],
    isPublic: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const definition: FormDefinition = {
      name: formData.name,
      description: formData.description,
      fields: [],
      layout: {
        sections: [{
          id: 'main',
          title: '主要區段',
          fields: [],
          order: 1,
        }],
      },
      settings: {
        allowMultipleSubmissions: true,
        requireAuthentication: false,
        showProgressBar: true,
        autoSave: true,
        submitButtonText: '提交',
        successMessage: '表單提交成功！',
      },
      version: '1.0.0',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.post(formsRoutes.store.url(), {
      name: formData.name,
      description: formData.description,
      category: formData.category || '未分類',
      tags: formData.tags,
      is_public: formData.isPublic,
      definition,
    } as any);
  };

  return (
    <AppLayout>
      <Head title="建立表單" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.get(formsRoutes.index.url())}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回表單列表
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">建立新表單</h1>
            <p className="mt-2 text-gray-600">建立一個新的表單模板</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>基本資訊</CardTitle>
                    <CardDescription>
                      設定表單的基本資訊和描述
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

                <Card>
                  <CardHeader>
                    <CardTitle>下一步</CardTitle>
                    <CardDescription>
                      建立基本表單後，您可以：
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <div>• 使用表單設計器添加欄位</div>
                    <div>• 設定欄位驗證規則</div>
                    <div>• 配置條件式邏輯</div>
                    <div>• 自訂表單樣式</div>
                    <div>• 測試表單功能</div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    建立表單
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.get(formsRoutes.index.url())}
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

export default CreateForm;

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { FormDefinition } from '../../types/FormTypes';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';

const CreateForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '未分類',
    tags: [] as string[],
    isPublic: false,
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 建立基本的表單定義
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

    router.post(route('forms.store'), {
      ...formData,
      definition,
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="建立表單" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.get(route('forms.index'))}
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
              {/* 主要設定 */}
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

                    <div>
                      <Label htmlFor="category">分類</Label>
                      <Input
                        id="category"
                        type="text"
                        placeholder="例如：申請表、調查表、回饋表"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>標籤</CardTitle>
                    <CardDescription>
                      為表單添加標籤，方便分類和搜尋
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="輸入標籤名稱"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        新增
                      </Button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 側邊欄設定 */}
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
                          允許其他用戶查看和使用此表單
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

                {/* 提交按鈕 */}
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    建立表單
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.get(route('forms.index'))}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default CreateForm;

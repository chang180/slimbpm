import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FormTemplate } from '../../types/FormTypes';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Copy, 
  Trash2, 
  Plus, 
  BarChart3, 
  Eye,
  Calendar,
  User,
  Tag,
  Globe,
  Lock
} from 'lucide-react';

interface FormShowProps {
  form: FormTemplate;
  canEdit: boolean;
}

const FormShow: React.FC<FormShowProps> = ({ form, canEdit }) => {
  const handleDuplicate = () => {
    router.post(route('forms.duplicate', form.id), {}, {
      onSuccess: () => {
        // 成功後會重導向到新表單
      }
    });
  };

  const handleDelete = () => {
    if (confirm('確定要刪除此表單嗎？此操作無法復原。')) {
      router.delete(route('forms.destroy', form.id), {
        onSuccess: () => {
          // 成功後會重導向到表單列表
        }
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFieldTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      text: '文字',
      email: '電子郵件',
      number: '數字',
      textarea: '多行文字',
      select: '下拉選單',
      checkbox: '複選框',
      radio: '單選框',
      date: '日期',
      file: '檔案',
      phone: '電話',
      url: '網址',
    };
    return typeLabels[type] || type;
  };

  return (
    <AuthenticatedLayout>
      <Head title={form.name} />

      <div className="py-12">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
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
            
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{form.name}</h1>
                  <Badge variant={form.isPublic ? "default" : "secondary"}>
                    {form.isPublic ? (
                      <>
                        <Globe className="w-3 h-3 mr-1" />
                        公開
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        私人
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-gray-600 text-lg">
                  {form.description || '無描述'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Link href={route('forms.submit', form.id)}>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    預覽
                  </Button>
                </Link>
                
                {canEdit && (
                  <Link href={route('forms.edit', form.id)}>
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      編輯
                    </Button>
                  </Link>
                )}
                
                <Button variant="outline" onClick={handleDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  複製
                </Button>
                
                {canEdit && (
                  <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    刪除
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 主要內容 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 表單資訊 */}
              <Card>
                <CardHeader>
                  <CardTitle>表單資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">建立時間:</span>
                      <span>{formatDate(form.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">更新時間:</span>
                      <span>{formatDate(form.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">建立者:</span>
                      <span>{form.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">分類:</span>
                      <span>{form.category}</span>
                    </div>
                  </div>

                  {form.tags && form.tags.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">標籤</h4>
                        <div className="flex flex-wrap gap-2">
                          {form.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 表單欄位 */}
              <Card>
                <CardHeader>
                  <CardTitle>表單欄位 ({form.definition.fields.length})</CardTitle>
                  <CardDescription>
                    此表單包含的欄位和設定
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {form.definition.fields.length > 0 ? (
                    <div className="space-y-3">
                      {form.definition.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{field.label}</span>
                              {field.required && (
                                <Badge variant="destructive" className="text-xs">
                                  必填
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              類型: {getFieldTypeLabel(field.type)}
                              {field.placeholder && ` • ${field.placeholder}`}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {field.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>此表單還沒有任何欄位</p>
                      {canEdit && (
                        <Link href={route('forms.edit', form.id)} className="inline-block mt-2">
                          <Button variant="outline" size="sm">
                            開始設計表單
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 表單設定 */}
              <Card>
                <CardHeader>
                  <CardTitle>表單設定</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">允許多次提交:</span>
                      <Badge variant={form.definition.settings.allowMultipleSubmissions ? "default" : "secondary"}>
                        {form.definition.settings.allowMultipleSubmissions ? '是' : '否'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">需要認證:</span>
                      <Badge variant={form.definition.settings.requireAuthentication ? "default" : "secondary"}>
                        {form.definition.settings.requireAuthentication ? '是' : '否'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">顯示進度條:</span>
                      <Badge variant={form.definition.settings.showProgressBar ? "default" : "secondary"}>
                        {form.definition.settings.showProgressBar ? '是' : '否'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">自動儲存:</span>
                      <Badge variant={form.definition.settings.autoSave ? "default" : "secondary"}>
                        {form.definition.settings.autoSave ? '是' : '否'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 側邊欄操作 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={route('forms.submit', form.id)} className="block">
                    <Button className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      填寫表單
                    </Button>
                  </Link>
                  
                  <Link href={route('forms.results', form.id)} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      查看結果
                    </Button>
                  </Link>
                  
                  {canEdit && (
                    <Link href={route('forms.edit', form.id)} className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="w-4 h-4 mr-2" />
                        編輯表單
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>分享表單</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        表單連結
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={`${window.location.origin}${route('forms.submit', form.id)}`}
                          readOnly
                          className="text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}${route('forms.submit', form.id)}`);
                          }}
                        >
                          複製
                        </Button>
                      </div>
                    </div>
                    
                    {form.isPublic && (
                      <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        <Globe className="w-4 h-4 inline mr-1" />
                        此表單為公開表單，任何人都可以填寫
                      </div>
                    )}
                    
                    {!form.isPublic && (
                      <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                        <Lock className="w-4 h-4 inline mr-1" />
                        此表單為私人表單，只有認證用戶可以填寫
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default FormShow;

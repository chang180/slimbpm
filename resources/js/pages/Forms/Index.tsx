import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import formsRoutes from '@/routes/forms';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Copy, Eye, Edit, Trash2, BarChart3 } from 'lucide-react';
import { type LengthAwarePaginator, formatPaginationLabel, hasMultiplePages } from '@/lib/pagination';
import { formatFormDate, formCreatorName, type FormTemplateListItem } from '@/lib/form-template';

interface FormsIndexProps {
  forms: LengthAwarePaginator<FormTemplateListItem>;
  categories: string[];
  filters: {
    search?: string;
    category?: string;
    is_public?: boolean;
  };
}

const FormsIndex: React.FC<FormsIndexProps> = ({ forms, categories, filters }) => {
  const [search, setSearch] = useState(filters.search || '');
  const [category, setCategory] = useState(filters.category || '');
  const [isPublic, setIsPublic] = useState(filters.is_public);

  const handleFilter = () => {
    router.get(formsRoutes.index.url(), {
      search: search || undefined,
      category: category === 'all' || !category ? undefined : category,
      is_public: isPublic,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDuplicate = (formId: number) => {
    router.post(formsRoutes.duplicate.url({ form: formId }), {}, {
      onSuccess: () => {
        // 成功後會重導向到新表單
      }
    });
  };

  const handleDelete = (formId: number) => {
    if (confirm('確定要刪除此表單嗎？此操作無法復原。')) {
      router.delete(formsRoutes.destroy.url({ form: formId }), {
        onSuccess: () => {
          // 成功後會重導向到表單列表
        }
      });
    }
  };

  const formatDate = formatFormDate;

  return (
    <AppLayout>
      <Head title="表單管理" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">表單管理</h1>
                <p className="mt-2 text-gray-600">建立和管理您的表單模板</p>
              </div>
              <Link href={formsRoutes.create.url()}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  新增表單
                </Button>
              </Link>
            </div>
          </div>

          {/* 篩選器 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>篩選表單</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    搜尋
                  </label>
                  <Input
                    type="text"
                    placeholder="搜尋表單名稱或描述..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分類
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇分類" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分類</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    可見性
                  </label>
                  <Select
                    value={isPublic === undefined ? 'all' : isPublic.toString()}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        setIsPublic(undefined);
                      } else {
                        setIsPublic(value === 'true');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇可見性" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="true">公開</SelectItem>
                      <SelectItem value="false">私人</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleFilter} className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    篩選
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 表單列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.data.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{form.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {form.description || '無描述'}
                      </CardDescription>
                    </div>
                    <Badge variant={form.is_public ? "default" : "secondary"}>
                      {form.is_public ? '公開' : '私人'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {/* 表單資訊 */}
                    <div className="text-sm text-gray-600">
                      <div>分類: {form.category}</div>
                      <div>建立者: {formCreatorName(form)}</div>
                      <div>更新時間: {formatDate(form.updated_at)}</div>
                    </div>

                    {/* 標籤 */}
                    {form.tags && form.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {form.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* 操作按鈕 */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Link href={formsRoutes.show.url({ form: Number(form.id) })}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          查看
                        </Button>
                      </Link>

                      <Link href={formsRoutes.edit.url({ form: Number(form.id) })}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          編輯
                        </Button>
                      </Link>

                      <Link href={formsRoutes.submit.url({ form: Number(form.id) })}>
                        <Button variant="outline" size="sm">
                          <Plus className="w-3 h-3 mr-1" />
                          提交
                        </Button>
                      </Link>

                      <Link href={formsRoutes.results.url({ form: Number(form.id) })}>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          結果
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(form.id)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        複製
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(form.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        刪除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 空狀態 */}
          {forms.data.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">沒有找到表單</h3>
                  <p className="mb-4">嘗試調整篩選條件或建立新的表單</p>
                  <Link href={formsRoutes.create.url()}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      建立第一個表單
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 分頁 */}
          {hasMultiplePages(forms) && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                {forms.links.map((link, index) => (
                  <Button
                    key={index}
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => link.url && router.get(link.url)}
                    disabled={!link.url}
                  >
                    {formatPaginationLabel(link.label)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default FormsIndex;

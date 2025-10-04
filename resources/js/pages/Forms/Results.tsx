import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FormTemplate, FormSubmission } from '../../types/FormTypes';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  BarChart3,
  FileText,
  Filter,
  Search
} from 'lucide-react';

interface FormResultsProps {
  form: FormTemplate;
  submissions: {
    data: FormSubmission[];
    links: any[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  statistics: {
    total_submissions: number;
    submissions_today: number;
    submissions_this_week: number;
    submissions_this_month: number;
  };
}

const FormResults: React.FC<FormResultsProps> = ({ form, submissions, statistics }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: '草稿', variant: 'secondary' as const },
      submitted: { label: '已提交', variant: 'default' as const },
      approved: { label: '已核准', variant: 'default' as const },
      rejected: { label: '已拒絕', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const exportToCSV = () => {
    const headers = ['提交時間', '提交者', '狀態', ...form.definition.fields.map(field => field.label)];
    const csvContent = [
      headers.join(','),
      ...submissions.data.map(submission => [
        formatDate(submission.submittedAt),
        submission.submittedBy || '匿名',
        submission.status,
        ...form.definition.fields.map(field => {
          const value = submission.data[field.id] || '';
          return typeof value === 'string' ? `"${value}"` : `"${JSON.stringify(value)}"`;
        })
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.name}_results.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubmissions = submissions.data.filter(submission => {
    const matchesSearch = searchTerm === '' || 
      (submission.submittedBy && submission.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      submission.submittedAt.includes(searchTerm);
    
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AuthenticatedLayout>
      <Head title={`${form.name} - 提交結果`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.get(route('forms.show', form.id))}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回表單詳情
              </Button>
            </div>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{form.name} - 提交結果</h1>
                <p className="mt-2 text-gray-600">查看和管理表單提交結果</p>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={exportToCSV} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  匯出 CSV
                </Button>
                <Link href={route('forms.submit', form.id)}>
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    填寫表單
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 統計卡片 */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">統計概覽</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {statistics.total_submissions}
                    </div>
                    <div className="text-sm text-gray-600">總提交數</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-green-600">
                        {statistics.submissions_today}
                      </div>
                      <div className="text-xs text-gray-600">今日</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-blue-600">
                        {statistics.submissions_this_week}
                      </div>
                      <div className="text-xs text-gray-600">本週</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-purple-600">
                        {statistics.submissions_this_month}
                      </div>
                      <div className="text-xs text-gray-600">本月</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 篩選器 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">篩選器</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      搜尋
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="搜尋提交者或日期..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      狀態
                    </label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇狀態" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部狀態</SelectItem>
                        <SelectItem value="draft">草稿</SelectItem>
                        <SelectItem value="submitted">已提交</SelectItem>
                        <SelectItem value="approved">已核准</SelectItem>
                        <SelectItem value="rejected">已拒絕</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 提交列表 */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>提交記錄 ({filteredSubmissions.length})</CardTitle>
                      <CardDescription>
                        顯示所有表單提交記錄
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredSubmissions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>提交時間</TableHead>
                            <TableHead>提交者</TableHead>
                            <TableHead>狀態</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSubmissions.map((submission) => (
                            <TableRow key={submission.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500" />
                                  {formatDate(submission.submittedAt)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  {submission.submittedBy || '匿名'}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(submission.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedSubmission(submission)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  查看
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到提交記錄</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || statusFilter ? '嘗試調整篩選條件' : '此表單還沒有任何提交記錄'}
                      </p>
                      <Link href={route('forms.submit', form.id)}>
                        <Button variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          填寫表單
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 分頁 */}
              {submissions.meta.last_page > 1 && (
                <div className="mt-6 flex justify-center">
                  <div className="flex space-x-2">
                    {submissions.links.map((link, index) => (
                      <Button
                        key={index}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        onClick={() => link.url && router.get(link.url)}
                        disabled={!link.url}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 提交詳情模態框 */}
          {selectedSubmission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>提交詳情</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSubmission(null)}
                    >
                      ×
                    </Button>
                  </div>
                  <CardDescription>
                    提交時間: {formatDate(selectedSubmission.submittedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <User className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <div className="font-medium">提交者</div>
                      <div className="text-sm text-gray-600">
                        {selectedSubmission.submittedBy || '匿名'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <div className="font-medium">提交時間</div>
                      <div className="text-sm text-gray-600">
                        {formatDate(selectedSubmission.submittedAt)}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="font-medium">狀態</div>
                      <div className="mt-2">
                        {getStatusBadge(selectedSubmission.status)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">表單資料</h4>
                    {form.definition.fields.map((field) => {
                      const value = selectedSubmission.data[field.id];
                      return (
                        <div key={field.id} className="p-4 border rounded-lg">
                          <div className="font-medium text-gray-900 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </div>
                          <div className="text-gray-700">
                            {value !== null && value !== undefined ? (
                              Array.isArray(value) ? value.join(', ') : String(value)
                            ) : (
                              <span className="text-gray-400 italic">未填寫</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            類型: {field.type}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default FormResults;

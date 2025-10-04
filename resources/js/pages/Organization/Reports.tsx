import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Organization, OrganizationStats } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Activity,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

interface OrganizationReportsProps extends PageProps {
  organization: Organization;
  stats: OrganizationStats;
}

const OrganizationReports: React.FC<OrganizationReportsProps> = ({ auth, organization, stats }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedChart, setSelectedChart] = useState('users');

  const periods = [
    { value: '7d', label: '最近 7 天' },
    { value: '30d', label: '最近 30 天' },
    { value: '90d', label: '最近 90 天' },
    { value: '1y', label: '最近 1 年' },
  ];

  const chartTypes = [
    { value: 'users', label: '用戶統計' },
    { value: 'activity', label: '活動統計' },
    { value: 'departments', label: '部門統計' },
    { value: 'workflows', label: '流程統計' },
  ];

  // 模擬圖表數據
  const userGrowthData = [
    { month: '1月', users: 10 },
    { month: '2月', users: 15 },
    { month: '3月', users: 22 },
    { month: '4月', users: 28 },
    { month: '5月', users: 35 },
    { month: '6月', users: 42 },
  ];

  const departmentData = [
    { name: '技術部', users: 15, percentage: 35 },
    { name: '行銷部', users: 12, percentage: 28 },
    { name: '人事部', users: 8, percentage: 19 },
    { name: '財務部', users: 8, percentage: 18 },
  ];

  const activityData = [
    { day: '週一', activities: 12 },
    { day: '週二', activities: 18 },
    { day: '週三', activities: 15 },
    { day: '週四', activities: 22 },
    { day: '週五', activities: 20 },
    { day: '週六', activities: 8 },
    { day: '週日', activities: 5 },
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`匯出 ${format} 格式的報表`);
    // 這裡會實作實際的匯出功能
  };

  return (
    <AppLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            組織報表
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              匯出 PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              匯出 Excel
            </Button>
          </div>
        </div>
      }
    >
      <Head title="組織報表" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* 控制面板 */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={selectedChart} onValueChange={setSelectedChart}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map((chart) => (
                        <SelectItem key={chart.value} value={chart.value}>
                          {chart.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">概覽</TabsTrigger>
              <TabsTrigger value="users">用戶分析</TabsTrigger>
              <TabsTrigger value="activity">活動分析</TabsTrigger>
              <TabsTrigger value="performance">效能分析</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* 關鍵指標 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">總用戶數</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.total_users}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Activity className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">活躍用戶</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.active_users}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">部門數量</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.total_departments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">工作流程</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.total_workflows}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 用戶成長趨勢 */}
              <Card>
                <CardHeader>
                  <CardTitle>用戶成長趨勢</CardTitle>
                  <CardDescription>
                    過去 6 個月的用戶成長情況
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {userGrowthData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div 
                          className="bg-blue-500 rounded-t w-8"
                          style={{ height: `${(data.users / 50) * 200}px` }}
                        />
                        <span className="text-xs text-gray-500">{data.month}</span>
                        <span className="text-xs font-medium">{data.users}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {/* 部門用戶分布 */}
              <Card>
                <CardHeader>
                  <CardTitle>部門用戶分布</CardTitle>
                  <CardDescription>
                    各部門的用戶數量統計
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentData.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">{dept.users} 人</span>
                          <span className="text-sm font-medium">{dept.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              {/* 活動統計 */}
              <Card>
                <CardHeader>
                  <CardTitle>每日活動統計</CardTitle>
                  <CardDescription>
                    過去一週的系統活動情況
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {activityData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div 
                          className="bg-green-500 rounded-t w-8"
                          style={{ height: `${(data.activities / 25) * 200}px` }}
                        />
                        <span className="text-xs text-gray-500">{data.day}</span>
                        <span className="text-xs font-medium">{data.activities}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 最近活動列表 */}
              <Card>
                <CardHeader>
                  <CardTitle>最近活動</CardTitle>
                  <CardDescription>
                    系統內的最新活動記錄
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recent_activity.slice(0, 5).map((activity: any) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{activity.user_name}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleDateString('zh-TW')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {/* 系統效能指標 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>系統效能</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">平均回應時間</span>
                      <span className="text-sm font-medium">120ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">系統可用性</span>
                      <span className="text-sm font-medium">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">資料庫效能</span>
                      <span className="text-sm font-medium">優秀</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>使用統計</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">本月登入次數</span>
                      <span className="text-sm font-medium">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">表單提交數</span>
                      <span className="text-sm font-medium">567</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">工作流程執行</span>
                      <span className="text-sm font-medium">89</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrganizationReports;

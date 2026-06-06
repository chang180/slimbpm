import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Organization, OrganizationStats } from '@/types';
import { route } from '@/lib/route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  Activity,
  FolderOpen,
  Workflow,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface OrganizationReportsProps extends PageProps {
  organization: Organization;
  stats: OrganizationStats;
}

const OrganizationReports: React.FC<OrganizationReportsProps> = ({ organization, stats }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const summaryCards = [
    {
      title: '總用戶數',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
    },
    {
      title: '部門數量',
      value: stats.totalDepartments,
      icon: FolderOpen,
      color: 'green',
    },
    {
      title: '工作流程',
      value: stats.totalWorkflows,
      icon: Workflow,
      color: 'purple',
    },
    {
      title: '活躍流程',
      value: stats.activeWorkflows,
      icon: Activity,
      color: 'orange',
    },
  ];

  return (
    <AppLayout>
      <Head title="組織報表" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
              組織報表
            </h2>
          </div>

          {/* 前往完整報表中心 */}
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">完整報表中心</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      查看用戶活動、工作流程效能、部門分析等詳細報表
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link href={route('reports.index')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    前往報表中心
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 組織摘要統計 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {summaryCards.map((card, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      card.color === 'blue' ? 'bg-blue-100' :
                      card.color === 'green' ? 'bg-green-100' :
                      card.color === 'purple' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      <card.icon className={`h-6 w-6 ${
                        card.color === 'blue' ? 'text-blue-600' :
                        card.color === 'green' ? 'text-green-600' :
                        card.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">{card.title}</p>
                      <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 更多統計 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>資源統計</CardTitle>
                <CardDescription>組織資源使用摘要</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">表單數量</span>
                  </div>
                  <span className="font-semibold">{stats.totalForms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Workflow className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">工作流程（全部）</span>
                  </div>
                  <span className="font-semibold">{stats.totalWorkflows}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">活躍工作流程</span>
                  </div>
                  <span className="font-semibold">{stats.activeWorkflows}</span>
                </div>
              </CardContent>
            </Card>

            {/* 最近活動 */}
            <Card>
              <CardHeader>
                <CardTitle>最近活動</CardTitle>
                <CardDescription>組織內的最新活動記錄</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500">目前尚無活動記錄</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={activity.id ?? index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Activity className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{activity.user}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(activity.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 連結至各報表 */}
          <Card>
            <CardHeader>
              <CardTitle>前往詳細分析</CardTitle>
              <CardDescription>報表中心提供更完整的資料分析功能</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" asChild className="justify-start">
                  <Link href={route('reports.user-activity')}>
                    <Users className="h-4 w-4 mr-2" />
                    用戶活動報表
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href={route('reports.workflow-performance')}>
                    <Workflow className="h-4 w-4 mr-2" />
                    工作流程效能
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href={route('reports.department-analysis')}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    部門分析
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href={route('reports.system-stats')}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    系統統計
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrganizationReports;

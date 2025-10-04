import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Organization, OrganizationStats } from '@/types';
import { route } from '@/lib/route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Settings, 
  BarChart3, 
  Users, 
  FolderOpen, 
  Workflow,
  FileText,
  Activity,
  Calendar,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  Download,
  Shield,
  Bell,
  Palette
} from 'lucide-react';

interface OrganizationIndexProps extends PageProps {
  organization: Organization;
  stats: OrganizationStats;
}

const OrganizationIndex: React.FC<OrganizationIndexProps> = ({ auth, organization, stats }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        啟用中
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        停用中
      </Badge>
    );
  };

  const managementCards = [
    {
      title: '組織設定',
      description: '管理組織基本資訊和系統設定',
      icon: Settings,
      href: route('organization.settings'),
      color: 'blue',
    },
    {
      title: '組織資訊',
      description: '查看組織詳細資訊和統計資料',
      icon: Building2,
      href: route('organization.info'),
      color: 'green',
    },
    {
      title: '偏好設定',
      description: '設定系統偏好和通知選項',
      icon: Bell,
      href: route('organization.preferences'),
      color: 'purple',
    },
    {
      title: '統計報表',
      description: '查看組織使用統計和分析報表',
      icon: BarChart3,
      href: route('organization.reports'),
      color: 'orange',
    },
  ];

  const quickStats = [
    {
      title: '總用戶數',
      value: stats.total_users,
      icon: Users,
      color: 'blue',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: '活躍用戶',
      value: stats.active_users,
      icon: Activity,
      color: 'green',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: '部門數量',
      value: stats.total_departments,
      icon: FolderOpen,
      color: 'purple',
      change: '+2',
      changeType: 'positive',
    },
    {
      title: '工作流程',
      value: stats.total_workflows,
      icon: Workflow,
      color: 'orange',
      change: '+5',
      changeType: 'positive',
    },
  ];

  return (
    <AppLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            組織管理
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('organization.settings')}>
                <Edit className="h-4 w-4 mr-2" />
                編輯設定
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={route('organization.reports')}>
                <Download className="h-4 w-4 mr-2" />
                匯出報表
              </Link>
            </Button>
          </div>
        </div>
      }
    >
      <Head title="組織管理" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* 組織概覽 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{organization.name}</CardTitle>
                    {organization.description && (
                      <CardDescription className="text-base">
                        {organization.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                {getStatusBadge(true)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {organization.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{organization.email}</span>
                  </div>
                )}
                {organization.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{organization.phone}</span>
                  </div>
                )}
                {organization.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a 
                      href={organization.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {organization.website}
                    </a>
                  </div>
                )}
                {organization.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{organization.address}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>建立於 {formatDate(organization.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="h-4 w-4" />
                  <span>更新於 {formatDate(organization.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 快速統計 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {quickStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        stat.color === 'blue' ? 'bg-blue-100' :
                        stat.color === 'green' ? 'bg-green-100' :
                        stat.color === 'purple' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        <stat.icon className={`h-6 w-6 ${
                          stat.color === 'blue' ? 'text-blue-600' :
                          stat.color === 'green' ? 'text-green-600' :
                          stat.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 管理功能 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {managementCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      card.color === 'blue' ? 'bg-blue-100' :
                      card.color === 'green' ? 'bg-green-100' :
                      card.color === 'purple' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      <card.icon className={`h-5 w-5 ${
                        card.color === 'blue' ? 'text-blue-600' :
                        card.color === 'green' ? 'text-green-600' :
                        card.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {card.description}
                  </CardDescription>
                  <Button asChild className="w-full">
                    <Link href={card.href}>
                      進入管理
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 最近活動 */}
          <Card>
            <CardHeader>
              <CardTitle>最近活動</CardTitle>
              <CardDescription>
                組織內的最新活動記錄
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
                          {formatDate(activity.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrganizationIndex;

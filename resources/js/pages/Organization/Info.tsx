import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Organization, OrganizationStats } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
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
  Download
} from 'lucide-react';

interface OrganizationInfoProps extends PageProps {
  organization: Organization;
  stats: OrganizationStats;
}

const OrganizationInfo: React.FC<OrganizationInfoProps> = ({ auth, organization, stats }) => {
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

  return (
    <AppLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            組織資訊
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              編輯
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              匯出
            </Button>
          </div>
        </div>
      }
    >
      <Head title="組織資訊" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 主要資訊 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 基本資訊 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    基本資訊
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{organization.name}</h3>
                      {organization.description && (
                        <p className="text-gray-600 mt-1">{organization.description}</p>
                      )}
                    </div>
                    {getStatusBadge(true)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
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

              {/* 統計概覽 */}
              <Card>
                <CardHeader>
                  <CardTitle>統計概覽</CardTitle>
                  <CardDescription>
                    組織的整體使用統計
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.total_users}</div>
                      <div className="text-sm text-gray-500">總用戶數</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.active_users}</div>
                      <div className="text-sm text-gray-500">活躍用戶</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                        <FolderOpen className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.total_departments}</div>
                      <div className="text-sm text-gray-500">部門數量</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                        <Workflow className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stats.total_workflows}</div>
                      <div className="text-sm text-gray-500">工作流程</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    {stats.recent_activity.map((activity: any) => (
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

            {/* 側邊欄 */}
            <div className="space-y-6">
              {/* 快速統計 */}
              <Card>
                <CardHeader>
                  <CardTitle>快速統計</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">表單數量</span>
                    </div>
                    <span className="font-semibold">{stats.total_forms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Workflow className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">工作流程</span>
                    </div>
                    <span className="font-semibold">{stats.total_workflows}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">部門數量</span>
                    </div>
                    <span className="font-semibold">{stats.total_departments}</span>
                  </div>
                </CardContent>
              </Card>

              {/* 系統資訊 */}
              <Card>
                <CardHeader>
                  <CardTitle>系統資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">組織 ID</span>
                    <span className="text-sm font-mono">{organization.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">建立時間</span>
                    <span className="text-sm">{formatDate(organization.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">最後更新</span>
                    <span className="text-sm">{formatDate(organization.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrganizationInfo;

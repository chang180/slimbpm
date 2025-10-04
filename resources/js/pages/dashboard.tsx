import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useSlug } from '@/hooks/useSlug';
import { 
  DashboardHeader,
  EnterpriseStats,
  MemberInvitation,
  WorkflowMenu,
  QuickActions
} from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle, Users, Building2 } from 'lucide-react';

interface DashboardProps {
    stats: {
        totalUsers: number;
        totalDepartments: number;
        totalForms: number;
        totalWorkflows: number;
        activeWorkflows: number;
    pendingInvitations: number;
    sentInvitations: number;
    systemHealth: number;
    };
    recentActivities: Array<{
        id: number;
        type: string;
        description: string;
        user_name: string;
        created_at: string;
    }>;
    chartData: Array<{
        month: string;
        users: number;
        forms: number;
        workflows: number;
    }>;
    departmentStats: Array<{
        name: string;
        users_count: number;
        percentage: number;
    }>;
  workflowInstances: Array<{
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
    currentStep: string;
    assignee: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
  }>;
  workflowTemplates: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    isActive: boolean;
    usageCount: number;
  }>;
  invitations: Array<{
    id: string;
    email: string;
    role: string;
    status: 'pending' | 'sent' | 'accepted' | 'expired';
    sentAt: string;
    expiresAt: string;
  }>;
  organization: {
    id: number;
    name: string;
    slug: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export default function Dashboard({ 
    stats, 
    recentActivities, 
    chartData, 
  departmentStats,
  workflowInstances,
  workflowTemplates,
  invitations,
  organization,
  user
}: DashboardProps) {
    const slug = useSlug();
  const maxUsers = 50; // 企業人數限制
  
  // 空值判斷和預設值
  if (!user) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            載入中...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            正在載入用戶資料，請稍候
          </p>
        </div>
      </div>
    );
  }

  // 為其他數據提供預設值
  const safeStats = stats || {
    totalUsers: 0,
    totalDepartments: 0,
    totalForms: 0,
    totalWorkflows: 0,
    activeWorkflows: 0,
  };

  const safeWorkflowInstances = workflowInstances || [];
  const safeWorkflowTemplates = workflowTemplates || [];
  const safeInvitations = invitations || [];
  const safeOrganization = organization || { id: 0, name: '未知組織', slug: '' };
  
  const isAdmin = user.role === 'admin';
  const isManager = user.role === 'manager' || isAdmin;
  const isUser = user.role === 'user';

  // 處理邀請功能
  const handleSendInvitation = async (data: { 
    emails: string[], 
    role: string, 
    message?: string 
  }) => {
    try {
      // 這裡應該調用 API 發送邀請
      console.log('發送邀請:', data);
      // await api.post('/invitations', data);
    } catch (error) {
      console.error('發送邀請失敗:', error);
      throw error;
    }
  };

  const handleResendInvitation = async (id: string) => {
    try {
      console.log('重新發送邀請:', id);
      // await api.post(`/invitations/${id}/resend`);
    } catch (error) {
      console.error('重新發送邀請失敗:', error);
    }
  };

  const handleCancelInvitation = async (id: string) => {
    try {
      console.log('取消邀請:', id);
      // await api.delete(`/invitations/${id}`);
    } catch (error) {
      console.error('取消邀請失敗:', error);
    }
  };

  // 處理工作流程功能
  const handleStartWorkflow = (templateId: string) => {
    console.log('啟動工作流程:', templateId);
    // 導航到工作流程啟動頁面
  };

  const handleViewWorkflow = (instanceId: string) => {
    console.log('查看工作流程:', instanceId);
    // 導航到工作流程詳情頁面
  };

  const handleEditWorkflow = (instanceId: string) => {
    console.log('編輯工作流程:', instanceId);
    // 導航到工作流程編輯頁面
  };

  const handleApproveWorkflow = (instanceId: string) => {
    console.log('批准工作流程:', instanceId);
    // 調用 API 批准工作流程
  };

  const handleRejectWorkflow = (instanceId: string) => {
    console.log('拒絕工作流程:', instanceId);
    // 調用 API 拒絕工作流程
  };

  // 處理快速操作
  const handleInviteMembers = () => {
    console.log('邀請成員');
    // 顯示邀請表單或導航到邀請頁面
  };

  const handleSendBulkInvites = () => {
    console.log('批量邀請');
    // 顯示批量邀請表單
  };

  // 根據用戶角色渲染不同的內容
  const renderUserDashboard = () => (
    <div className="space-y-6">
      {/* 用戶歡迎區域 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            歡迎回來，{user.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {safeWorkflowInstances.filter(w => w.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                進行中的流程
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {safeWorkflowInstances.filter(w => w.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                已完成的流程
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {safeWorkflowInstances.filter(w => w.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                待處理的流程
              </div>
            </div>
                        </div>
                    </CardContent>
                </Card>

      {/* 公文流程使用選單 */}
      <WorkflowMenu
        userRole={user.role}
        workflowInstances={safeWorkflowInstances}
        workflowTemplates={safeWorkflowTemplates}
        onStartWorkflow={handleStartWorkflow}
        onViewWorkflow={handleViewWorkflow}
        onEditWorkflow={handleEditWorkflow}
        onApproveWorkflow={handleApproveWorkflow}
        onRejectWorkflow={handleRejectWorkflow}
      />

      {/* 用戶快速操作 */}
      <QuickActions
        userRole={user.role}
        organizationSlug={safeOrganization.slug}
        onInviteMembers={handleInviteMembers}
        onSendBulkInvites={handleSendBulkInvites}
      />
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      {/* 管理員歡迎區域 */}
      <DashboardHeader
        organizationName={safeOrganization.name}
        userRole={user.role}
        totalUsers={safeStats.totalUsers}
        maxUsers={maxUsers}
      />

      {/* 企業統計 */}
      <EnterpriseStats
        stats={{
          ...safeStats,
          pendingInvitations: safeInvitations.filter(inv => inv.status === 'pending').length,
          sentInvitations: safeInvitations.filter(inv => inv.status === 'sent').length,
        }}
        maxUsers={maxUsers}
      />

      {/* 主要內容區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：成員邀請管理 */}
        <div className="lg:col-span-1">
          <MemberInvitation
            organizationSlug={safeOrganization.slug}
            maxUsers={maxUsers}
            currentUsers={safeStats.totalUsers}
            invitations={safeInvitations}
            onSendInvitation={handleSendInvitation}
            onResendInvitation={handleResendInvitation}
            onCancelInvitation={handleCancelInvitation}
          />
        </div>

        {/* 右側：公文流程管理 */}
        <div className="lg:col-span-2">
          <WorkflowMenu
            userRole={user.role}
            workflowInstances={safeWorkflowInstances}
            workflowTemplates={safeWorkflowTemplates}
            onStartWorkflow={handleStartWorkflow}
            onViewWorkflow={handleViewWorkflow}
            onEditWorkflow={handleEditWorkflow}
            onApproveWorkflow={handleApproveWorkflow}
            onRejectWorkflow={handleRejectWorkflow}
          />
        </div>
      </div>

      {/* 管理員快速操作 */}
      <QuickActions
        userRole={user.role}
        organizationSlug={safeOrganization.slug}
        onInviteMembers={handleInviteMembers}
        onSendBulkInvites={handleSendBulkInvites}
      />
                        </div>
  );

  return (
    <AppLayout>
      <Head title={`${isUser ? '公文流程' : '企業管理後台'} - SlimBPM`} />
      
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
        {isUser ? renderUserDashboard() : renderManagerDashboard()}
            </div>
        </AppLayout>
    );
}

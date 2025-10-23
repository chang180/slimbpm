import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UserDashboard, ManagerDashboard } from '@/components/dashboard';
import { useDashboardActions } from '@/hooks/useDashboardActions';

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
  const maxUsers = 50;
  const actions = useDashboardActions();

  // 提供安全的預設值
  const safeProps = {
    user: user || { id: 0, name: '', email: '', role: 'user' },
    organization: organization || { id: 0, name: '未知組織', slug: '' },
    stats: stats || { totalUsers: 0, totalDepartments: 0, totalForms: 0, totalWorkflows: 0, activeWorkflows: 0 },
    workflowInstances: workflowInstances || [],
    workflowTemplates: workflowTemplates || [],
    invitations: invitations || [],
  };

  if (!user) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">載入中...</h1>
          <p className="text-gray-600 dark:text-gray-400">正在載入用戶資料，請稍候</p>
        </div>
      </div>
    );
  }

  const isUser = user.role === 'user';
  const pageTitle = `${isUser ? '公文流程' : '企業管理後台'} - SlimBPM`;

  return (
    <AppLayout>
      <Head title={pageTitle} />
      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
        {isUser ? (
          <UserDashboard {...safeProps} {...actions} maxUsers={maxUsers} />
        ) : (
          <ManagerDashboard {...safeProps} {...actions} maxUsers={maxUsers} />
        )}
      </div>
    </AppLayout>
  );
}

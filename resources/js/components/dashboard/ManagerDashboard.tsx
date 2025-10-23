import {
  DashboardHeader,
  EnterpriseStats,
  MemberInvitation,
  WorkflowMenu,
  QuickActions
} from '@/components/dashboard';

interface WorkflowInstance {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  currentStep: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  usageCount: number;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'sent' | 'accepted' | 'expired';
  sentAt: string;
  expiresAt: string;
}

interface ManagerDashboardProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  organization: {
    id: number;
    name: string;
    slug: string;
  };
  stats: {
    totalUsers: number;
    totalDepartments: number;
    totalForms: number;
    totalWorkflows: number;
    activeWorkflows: number;
  };
  workflowInstances: WorkflowInstance[];
  workflowTemplates: WorkflowTemplate[];
  invitations: Invitation[];
  maxUsers: number;
  onSendInvitation: (data: { emails: string[], role: string, message?: string }) => void;
  onResendInvitation: (id: string) => void;
  onCancelInvitation: (id: string) => void;
  onStartWorkflow: (templateId: string) => void;
  onViewWorkflow: (instanceId: string) => void;
  onEditWorkflow: (instanceId: string) => void;
  onApproveWorkflow: (instanceId: string) => void;
  onRejectWorkflow: (instanceId: string) => void;
  onInviteMembers: () => void;
  onSendBulkInvites: () => void;
}

export default function ManagerDashboard({
  user,
  organization,
  stats,
  workflowInstances,
  workflowTemplates,
  invitations,
  maxUsers,
  onSendInvitation,
  onResendInvitation,
  onCancelInvitation,
  onStartWorkflow,
  onViewWorkflow,
  onEditWorkflow,
  onApproveWorkflow,
  onRejectWorkflow,
  onInviteMembers,
  onSendBulkInvites
}: ManagerDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 管理員歡迎區域 */}
      <DashboardHeader
        organizationName={organization.name}
        userRole={user.role}
        totalUsers={stats.totalUsers}
        maxUsers={maxUsers}
      />

      {/* 企業統計 */}
      <EnterpriseStats
        stats={{
          ...stats,
          pendingInvitations: invitations.filter(inv => inv.status === 'pending').length,
          sentInvitations: invitations.filter(inv => inv.status === 'sent').length,
          systemHealth: 98,
        }}
        maxUsers={maxUsers}
      />

      {/* 主要內容區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：成員邀請管理 */}
        <div className="lg:col-span-1">
          <MemberInvitation
            organizationSlug={organization.slug}
            maxUsers={maxUsers}
            currentUsers={stats.totalUsers}
            invitations={invitations}
            onSendInvitation={onSendInvitation}
            onResendInvitation={onResendInvitation}
            onCancelInvitation={onCancelInvitation}
          />
        </div>

        {/* 右側：公文流程管理 */}
        <div className="lg:col-span-2">
          <WorkflowMenu
            userRole={user.role}
            workflowInstances={workflowInstances}
            workflowTemplates={workflowTemplates}
            onStartWorkflow={onStartWorkflow}
            onViewWorkflow={onViewWorkflow}
            onEditWorkflow={onEditWorkflow}
            onApproveWorkflow={onApproveWorkflow}
            onRejectWorkflow={onRejectWorkflow}
          />
        </div>
      </div>

      {/* 管理員快速操作 */}
      <QuickActions
        userRole={user.role}
        organizationSlug={organization.slug}
        onInviteMembers={onInviteMembers}
        onSendBulkInvites={onSendBulkInvites}
      />
    </div>
  );
}

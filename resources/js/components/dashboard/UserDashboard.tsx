import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { WorkflowMenu, QuickActions } from '@/components/dashboard';

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

interface UserDashboardProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  workflowInstances: WorkflowInstance[];
  workflowTemplates: WorkflowTemplate[];
  organizationSlug: string;
  onStartWorkflow: (templateId: string) => void;
  onViewWorkflow: (instanceId: string) => void;
  onEditWorkflow: (instanceId: string) => void;
  onApproveWorkflow: (instanceId: string) => void;
  onRejectWorkflow: (instanceId: string) => void;
  onInviteMembers: () => void;
  onSendBulkInvites: () => void;
}

export default function UserDashboard({
  user,
  workflowInstances,
  workflowTemplates,
  organizationSlug,
  onStartWorkflow,
  onViewWorkflow,
  onEditWorkflow,
  onApproveWorkflow,
  onRejectWorkflow,
  onInviteMembers,
  onSendBulkInvites
}: UserDashboardProps) {
  return (
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
                {workflowInstances.filter(w => w.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                進行中的流程
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {workflowInstances.filter(w => w.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                已完成的流程
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {workflowInstances.filter(w => w.status === 'pending').length}
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
        workflowInstances={workflowInstances}
        workflowTemplates={workflowTemplates}
        onStartWorkflow={onStartWorkflow}
        onViewWorkflow={onViewWorkflow}
        onEditWorkflow={onEditWorkflow}
        onApproveWorkflow={onApproveWorkflow}
        onRejectWorkflow={onRejectWorkflow}
      />

      {/* 用戶快速操作 */}
      <QuickActions
        userRole={user.role}
        organizationSlug={organizationSlug}
        onInviteMembers={onInviteMembers}
        onSendBulkInvites={onSendBulkInvites}
      />
    </div>
  );
}

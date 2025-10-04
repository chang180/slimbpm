import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  FileText, 
  Workflow, 
  BarChart3,
  Settings,
  UserPlus,
  Mail,
  Shield,
  Database,
  Bell,
  Download
} from 'lucide-react';
import { Link } from '@inertiajs/react';

interface QuickActionsProps {
  userRole: string;
  organizationSlug: string;
  onInviteMembers: () => void;
  onSendBulkInvites: () => void;
}

export default function QuickActions({ 
  userRole, 
  organizationSlug, 
  onInviteMembers, 
  onSendBulkInvites 
}: QuickActionsProps) {
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager' || isAdmin;
  const canManageUsers = isManager;
  const canManageDepartments = isManager;
  const canManageForms = true;
  const canManageWorkflows = true;
  const canViewReports = isManager;
  const canManageSettings = isAdmin;

  const adminActions = [
    {
      title: '邀請成員',
      description: '發送邀請郵件給新成員',
      icon: UserPlus,
      onClick: onInviteMembers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
    },
    {
      title: '批次邀請',
      description: '批量發送邀請郵件',
      icon: Mail,
      onClick: onSendBulkInvites,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/30'
    },
    {
      title: '用戶管理',
      description: '管理企業成員',
      icon: Users,
      href: '/users',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
    },
    {
      title: '部門管理',
      description: '管理組織架構',
      icon: Building2,
      href: '/departments',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/30'
    }
  ];

  const managerActions = [
    {
      title: '表單設計',
      description: '創建新的表單模板',
      icon: FileText,
      href: '/form-builder',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      hoverColor: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
    },
    {
      title: '流程設計',
      description: '設計工作流程',
      icon: Workflow,
      href: '/workflows/designer',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      hoverColor: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/30'
    },
    {
      title: '查看報表',
      description: '系統統計與分析',
      icon: BarChart3,
      href: '/reports',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      hoverColor: 'hover:bg-pink-100 dark:hover:bg-pink-900/30'
    }
  ];

  const userActions = [
    {
      title: '我的表單',
      description: '查看和填寫表單',
      icon: FileText,
      href: '/forms',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      hoverColor: 'hover:bg-teal-100 dark:hover:bg-teal-900/30'
    },
    {
      title: '我的流程',
      description: '查看工作流程狀態',
      icon: Workflow,
      href: '/workflows/instances',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      hoverColor: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
    },
    {
      title: '通知中心',
      description: '查看系統通知',
      icon: Bell,
      href: '/notifications',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      hoverColor: 'hover:bg-amber-100 dark:hover:bg-amber-900/30'
    }
  ];

  const systemActions = [
    {
      title: '系統設定',
      description: '企業設定與偏好',
      icon: Settings,
      href: '/organization/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-900/30'
    },
    {
      title: '權限管理',
      description: '管理用戶權限',
      icon: Shield,
      href: '/organization/permissions',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/30'
    },
    {
      title: '數據備份',
      description: '備份與恢復數據',
      icon: Database,
      href: '/organization/backup',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
      hoverColor: 'hover:bg-violet-100 dark:hover:bg-violet-900/30'
    },
    {
      title: '匯出數據',
      description: '匯出系統數據',
      icon: Download,
      href: '/organization/export',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50 dark:bg-slate-900/20',
      hoverColor: 'hover:bg-slate-100 dark:hover:bg-slate-900/30'
    }
  ];

  const getActionsForRole = () => {
    const actions = [];
    
    if (canManageUsers) {
      actions.push(...adminActions);
    }
    
    if (canManageForms || canManageWorkflows || canViewReports) {
      actions.push(...managerActions);
    }
    
    actions.push(...userActions);
    
    if (canManageSettings) {
      actions.push(...systemActions);
    }
    
    return actions;
  };

  const actions = getActionsForRole();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          快速操作
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          根據您的權限顯示可用的操作選項
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            
            if (action.href) {
              return (
                <Link key={index} href={action.href}>
                  <div className={`
                    p-4 rounded-lg border cursor-pointer transition-all duration-200 
                    ${action.bgColor} ${action.hoverColor}
                    hover:shadow-md hover:-translate-y-1
                  `}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${action.bgColor}`}>
                        <IconComponent className={`w-5 h-5 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
            
            return (
              <div 
                key={index}
                onClick={action.onClick}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all duration-200 
                  ${action.bgColor} ${action.hoverColor}
                  hover:shadow-md hover:-translate-y-1
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 權限提示 */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                權限說明
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                您的角色是 <strong>{userRole === 'admin' ? '系統管理員' : 
                  userRole === 'manager' ? '部門主管' : '一般用戶'}</strong>，
                可以執行上述標示的操作。如需更多權限，請聯繫系統管理員。
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

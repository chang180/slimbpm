import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Building2, 
  FileText, 
  Workflow, 
  UserPlus,
  Mail,
  Shield,
  Activity
} from 'lucide-react';

interface EnterpriseStatsProps {
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
  maxUsers: number;
}

export default function EnterpriseStats({ stats, maxUsers }: EnterpriseStatsProps) {
  const statCards = [
    {
      title: '企業成員',
      value: stats.totalUsers,
      maxValue: maxUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: '已註冊成員',
      trend: stats.totalUsers > 0 ? '+' + stats.totalUsers : '0'
    },
    {
      title: '部門數量',
      value: stats.totalDepartments,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: '組織架構',
      trend: stats.totalDepartments > 0 ? '+' + stats.totalDepartments : '0'
    },
    {
      title: '表單模板',
      value: stats.totalForms,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: '可用表單',
      trend: stats.totalForms > 0 ? '+' + stats.totalForms : '0'
    },
    {
      title: '工作流程',
      value: stats.totalWorkflows,
      icon: Workflow,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: '總流程數',
      trend: stats.totalWorkflows > 0 ? '+' + stats.totalWorkflows : '0'
    },
    {
      title: '活躍流程',
      value: stats.activeWorkflows,
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: '正在執行',
      trend: stats.activeWorkflows > 0 ? '+' + stats.activeWorkflows : '0'
    },
    {
      title: '待處理邀請',
      value: stats.pendingInvitations,
      icon: UserPlus,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      description: '等待回覆',
      trend: stats.pendingInvitations > 0 ? '+' + stats.pendingInvitations : '0'
    },
    {
      title: '已發送邀請',
      value: stats.sentInvitations,
      icon: Mail,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      description: '本週發送',
      trend: stats.sentInvitations > 0 ? '+' + stats.sentInvitations : '0'
    },
    {
      title: '系統健康度',
      value: stats.systemHealth,
      icon: Shield,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      description: '運行狀態',
      trend: stats.systemHealth + '%',
      isPercentage: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.isPercentage ? `${card.value}%` : card.value}
                </div>
                {card.maxValue && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    / {card.maxValue}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {card.description}
                </p>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {card.trend}
                </span>
              </div>
              {card.maxValue && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((card.value / card.maxValue) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

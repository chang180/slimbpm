import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Building2 } from 'lucide-react';

interface DashboardHeaderProps {
  organizationName?: string;
  userRole: string;
  totalUsers: number;
  maxUsers: number;
}

export default function DashboardHeader({ 
  organizationName, 
  userRole, 
  totalUsers, 
  maxUsers 
}: DashboardHeaderProps) {
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return '系統管理員';
      case 'manager':
        return '部門主管';
      case 'user':
        return '一般用戶';
      default:
        return '未知角色';
    }
  };

  const getStatusColor = () => {
    const usagePercentage = (totalUsers / maxUsers) * 100;
    if (usagePercentage >= 90) return 'destructive';
    if (usagePercentage >= 70) return 'secondary';
    return 'default';
  };

  const getStatusText = () => {
    const usagePercentage = (totalUsers / maxUsers) * 100;
    if (usagePercentage >= 90) return '接近上限';
    if (usagePercentage >= 70) return '使用率較高';
    return '運行正常';
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            企業管理後台
          </h1>
          {organizationName && (
            <Badge variant="outline" className="text-sm">
              {organizationName}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            角色：{getRoleDisplay(userRole)}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            成員：{totalUsers}/{maxUsers} 人
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge 
          variant={getStatusColor()} 
          className="flex items-center gap-1"
        >
          <TrendingUp className="w-3 h-3" />
          {getStatusText()}
        </Badge>
      </div>
    </div>
  );
}

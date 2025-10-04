import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import { Link } from '@inertiajs/react';

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

interface WorkflowMenuProps {
  userRole: string;
  workflowInstances: WorkflowInstance[];
  workflowTemplates: WorkflowTemplate[];
  onStartWorkflow: (templateId: string) => void;
  onViewWorkflow: (instanceId: string) => void;
  onEditWorkflow: (instanceId: string) => void;
  onApproveWorkflow: (instanceId: string) => void;
  onRejectWorkflow: (instanceId: string) => void;
}

export default function WorkflowMenu({
  userRole,
  workflowInstances,
  workflowTemplates,
  onStartWorkflow,
  onViewWorkflow,
  onEditWorkflow,
  onApproveWorkflow,
  onRejectWorkflow
}: WorkflowMenuProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <Pause className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '等待處理';
      case 'in_progress':
        return '進行中';
      case 'completed':
        return '已完成';
      case 'rejected':
        return '已拒絕';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '緊急';
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '未知';
    }
  };

  const canManageWorkflows = userRole === 'admin' || userRole === 'manager';
  const canStartWorkflows = true; // 所有用戶都可以啟動工作流程

  return (
    <div className="space-y-6">
      {/* 快速操作 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            公文流程管理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/workflows/designer">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <Plus className="w-6 h-6" />
                <span>設計流程</span>
              </Button>
            </Link>
            
            <Link href="/workflows">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <FileText className="w-6 h-6" />
                <span>流程模板</span>
              </Button>
            </Link>
            
            <Link href="/workflows/instances">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <Clock className="w-6 h-6" />
                <span>我的流程</span>
              </Button>
            </Link>
            
            <Link href="/workflows/reports">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                <Eye className="w-6 h-6" />
                <span>流程報表</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 待處理流程 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            待處理流程
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workflowInstances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>目前沒有待處理的流程</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workflowInstances.slice(0, 5).map((instance) => (
                <div 
                  key={instance.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(instance.status)}
                    <div>
                      <div className="font-medium">{instance.name}</div>
                      <div className="text-sm text-gray-500">
                        當前步驟: {instance.currentStep}
                      </div>
                      <div className="text-sm text-gray-500">
                        負責人: {instance.assignee}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(instance.priority)}>
                      {getPriorityText(instance.priority)}
                    </Badge>
                    <Badge className={getStatusColor(instance.status)}>
                      {getStatusText(instance.status)}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewWorkflow(instance.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {instance.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => onApproveWorkflow(instance.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRejectWorkflow(instance.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {canManageWorkflows && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditWorkflow(instance.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {workflowInstances.length > 5 && (
                <div className="text-center pt-4">
                  <Link 
                    href="/workflows/instances"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    查看全部 {workflowInstances.length} 個流程 →
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 常用流程模板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            常用流程模板
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workflowTemplates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>目前沒有可用的流程模板</p>
              <Link 
                href="/workflows/designer"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                立即創建流程模板 →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflowTemplates.slice(0, 4).map((template) => (
                <div 
                  key={template.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? '啟用' : '停用'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      使用次數: {template.usageCount}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => onStartWorkflow(template.id)}
                      disabled={!template.isActive}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      啟動
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

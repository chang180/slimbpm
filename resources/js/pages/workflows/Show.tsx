import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    CheckSquare,
    Clock,
    GitBranch,
    History,
    Loader2,
    PauseCircle,
    ThumbsDown,
    ThumbsUp,
    User,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface StepInstance {
    id: number;
    step_id: string;
    step_key: string;
    status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'skipped';
    assigned_to: number | null;
    assigned_at: string | null;
    completed_at: string | null;
    comments: string | null;
    data: Record<string, unknown> | null;
    assigned_user: { id: number; name: string } | null;
}

interface HistoryEntry {
    id: number;
    action: string;
    comments: string | null;
    performed_at: string;
    performer: { id: number; name: string } | null;
    data: Record<string, unknown> | null;
}

interface WorkflowInstanceDetail {
    id: number;
    title: string;
    status: 'running' | 'completed' | 'cancelled' | 'suspended';
    active_steps: string[];
    parallel_mode: boolean;
    form_data: Record<string, unknown>;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    template: {
        id: number;
        name: string;
        version: string;
        definition: unknown;
    };
    starter: { id: number; name: string; email: string };
    steps: StepInstance[];
    histories: HistoryEntry[];
}

interface MyPendingStep {
    id: number;
    step_id: string;
    step_key: string;
    status: string;
}

interface WorkflowsShowProps {
    instance: WorkflowInstanceDetail;
    myPendingSteps: MyPendingStep[];
    canManage: boolean;
}

const statusConfig = {
    running: { label: '進行中', icon: Loader2, className: 'text-blue-600 dark:text-blue-400', iconClass: 'animate-spin' },
    completed: { label: '已完成', icon: CheckCircle2, className: 'text-green-600 dark:text-green-400', iconClass: '' },
    cancelled: { label: '已取消', icon: XCircle, className: 'text-red-600 dark:text-red-400', iconClass: '' },
    suspended: { label: '已暫停', icon: PauseCircle, className: 'text-yellow-600 dark:text-yellow-400', iconClass: '' },
} as const;

const stepStatusConfig = {
    pending: { label: '待處理', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    in_progress: { label: '處理中', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    approved: { label: '已批准', className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    rejected: { label: '已拒絕', className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    skipped: { label: '已跳過', className: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500' },
} as const;

const historyActionLabels: Record<string, string> = {
    workflow_started: '啟動工作流程',
    workflow_completed: '工作流程完成',
    workflow_suspended: '暫停工作流程',
    workflow_resumed: '恢復工作流程',
    workflow_cancelled: '取消工作流程',
    step_activated: '步驟已啟動',
    step_completed: '步驟已完成',
    step_updated: '步驟已更新',
    condition_evaluated: '條件評估',
};

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function ApprovalPanel({
    instanceId,
    step,
    onDone,
}: {
    instanceId: number;
    step: MyPendingStep;
    onDone: () => void;
}) {
    const [action, setAction] = useState<'approved' | 'rejected' | null>(null);
    const [comments, setComments] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!action) return;
        if (action === 'rejected' && !comments.trim()) {
            setError('請填寫拒絕原因');
            return;
        }

        setSubmitting(true);
        setError('');

        router.patch(
            `/api/v1/workflow-instances/${instanceId}/steps/${step.id}`,
            { status: action, comments: comments.trim() || null },
            {
                onSuccess: () => {
                    onDone();
                    router.reload({ only: ['instance', 'myPendingSteps'] });
                },
                onError: (errs) => {
                    setError(Object.values(errs).join(', '));
                    setSubmitting(false);
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            },
        );
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="text-sm font-medium text-foreground">
                審批步驟：<span className="font-semibold">{step.step_key}</span>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={action === 'approved' ? 'default' : 'outline'}
                    size="sm"
                    className={action === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                    onClick={() => setAction('approved')}
                >
                    <ThumbsUp className="mr-1.5 h-4 w-4" />
                    批准
                </Button>
                <Button
                    variant={action === 'rejected' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setAction('rejected')}
                >
                    <ThumbsDown className="mr-1.5 h-4 w-4" />
                    拒絕
                </Button>
            </div>

            {action && (
                <div className="flex flex-col gap-2">
                    <Textarea
                        placeholder={action === 'rejected' ? '請填寫拒絕原因（必填）' : '備註（選填）'}
                        value={comments}
                        onChange={(e) => {
                            setComments(e.target.value);
                            setError('');
                        }}
                        rows={3}
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex gap-2">
                        <Button size="sm" disabled={submitting} onClick={handleSubmit}>
                            {submitting ? (
                                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckSquare className="mr-1.5 h-4 w-4" />
                            )}
                            確認提交
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setAction(null)}>
                            取消
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function WorkflowsShow({ instance, myPendingSteps, canManage }: WorkflowsShowProps) {
    const breadcrumbs = useMemo<BreadcrumbItem[]>(
        () => [
            { title: '儀表板', href: '/dashboard' },
            { title: '工作流程', href: '/workflows' },
            { title: instance.title, href: `/workflows/${instance.id}` },
        ],
        [instance.id, instance.title],
    );

    const [managingStep, setManagingStep] = useState<MyPendingStep | null>(
        myPendingSteps.length > 0 ? myPendingSteps[0] : null,
    );
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const instanceStatus = statusConfig[instance.status] ?? {
        label: instance.status,
        icon: Clock,
        className: 'text-gray-600',
        iconClass: '',
    };
    const StatusIcon = instanceStatus.icon;

    const handleInstanceAction = (action: 'suspend' | 'resume' | 'cancel') => {
        const confirmMessages = {
            suspend: '確定要暫停此工作流程嗎？',
            resume: '確定要恢復此工作流程嗎？',
            cancel: '確定要取消此工作流程嗎？此操作無法復原。',
        };

        if (!confirm(confirmMessages[action])) return;

        setActionLoading(action);

        router.put(
            `/api/v1/workflow-instances/${instance.id}`,
            { action },
            {
                onSuccess: () => {
                    router.reload();
                },
                onFinish: () => {
                    setActionLoading(null);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={instance.title} />

            <div className="flex flex-col gap-6 p-6">
                {/* 頁首 */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-0.5 shrink-0"
                            onClick={() => router.visit('/workflows')}
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            返回
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold">{instance.title}</h1>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className={`flex items-center gap-1 font-medium ${instanceStatus.className}`}>
                                    <StatusIcon className={`h-4 w-4 ${instanceStatus.iconClass}`} />
                                    {instanceStatus.label}
                                </span>
                                <Separator orientation="vertical" className="h-4" />
                                <span>
                                    模板：{instance.template.name} v{instance.template.version}
                                </span>
                                <Separator orientation="vertical" className="h-4" />
                                <span className="flex items-center gap-1">
                                    <User className="h-3.5 w-3.5" />
                                    {instance.starter.name}
                                </span>
                                <Separator orientation="vertical" className="h-4" />
                                <span>發起：{formatDate(instance.started_at)}</span>
                            </div>
                        </div>
                    </div>

                    {canManage && instance.status !== 'completed' && instance.status !== 'cancelled' && (
                        <div className="flex shrink-0 gap-2">
                            {instance.status === 'running' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={actionLoading !== null}
                                    onClick={() => handleInstanceAction('suspend')}
                                >
                                    {actionLoading === 'suspend' && (
                                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                    )}
                                    暫停
                                </Button>
                            )}
                            {instance.status === 'suspended' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={actionLoading !== null}
                                    onClick={() => handleInstanceAction('resume')}
                                >
                                    {actionLoading === 'resume' && (
                                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                    )}
                                    恢復
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={actionLoading !== null}
                                onClick={() => handleInstanceAction('cancel')}
                            >
                                {actionLoading === 'cancel' && (
                                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                )}
                                取消流程
                            </Button>
                        </div>
                    )}
                </div>

                {/* 主要內容 */}
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* 左側 */}
                    <div className="flex flex-col gap-6">
                        {/* 待我審批 */}
                        {myPendingSteps.length > 0 && (
                            <Card className="border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                                        <CheckSquare className="h-5 w-5" />
                                        待您審批（{myPendingSteps.length} 個步驟）
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4 divide-y divide-yellow-200 dark:divide-yellow-900">
                                    {myPendingSteps.map((step) => (
                                        <div key={step.id} className="pt-4 first:pt-0">
                                            <ApprovalPanel
                                                instanceId={instance.id}
                                                step={step}
                                                onDone={() => setManagingStep(null)}
                                            />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* 步驟狀態 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GitBranch className="h-5 w-5" />
                                    流程步驟
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {instance.steps.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">尚無步驟資料</p>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {instance.steps.map((step) => {
                                            const cfg = stepStatusConfig[step.status] ?? {
                                                label: step.status,
                                                className: 'bg-gray-100 text-gray-600',
                                            };
                                            const isActive = instance.active_steps.includes(step.step_id);

                                            return (
                                                <div
                                                    key={step.id}
                                                    className={`flex items-start gap-3 rounded-lg border p-3 ${
                                                        isActive ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30' : 'border-border'
                                                    }`}
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-sm">{step.step_key}</span>
                                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}>
                                                                {cfg.label}
                                                            </span>
                                                            {isActive && (
                                                                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                                                                    進行中
                                                                </span>
                                                            )}
                                                        </div>
                                                        {step.assigned_user && (
                                                            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                                <User className="h-3 w-3" />
                                                                {step.assigned_user.name}
                                                            </div>
                                                        )}
                                                        {step.comments && (
                                                            <div className="mt-1.5 rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                                                                {step.comments}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {step.completed_at && (
                                                        <div className="shrink-0 text-xs text-muted-foreground">
                                                            {formatDate(step.completed_at)}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* 右側：歷史記錄 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <History className="h-4 w-4" />
                                操作記錄
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {instance.histories.length === 0 ? (
                                <p className="text-sm text-muted-foreground">尚無操作記錄</p>
                            ) : (
                                <div className="relative flex flex-col gap-0">
                                    {[...instance.histories].reverse().map((entry, i) => (
                                        <div key={entry.id} className="flex gap-3 pb-4 last:pb-0">
                                            <div className="flex flex-col items-center">
                                                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40" />
                                                {i < instance.histories.length - 1 && (
                                                    <div className="mt-1 w-px grow bg-border" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 pb-1">
                                                <div className="text-sm font-medium">
                                                    {historyActionLabels[entry.action] ?? entry.action}
                                                </div>
                                                {entry.performer && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {entry.performer.name}
                                                    </div>
                                                )}
                                                {entry.comments && (
                                                    <div className="mt-1 rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                                                        {entry.comments}
                                                    </div>
                                                )}
                                                <div className="mt-0.5 text-xs text-muted-foreground/60">
                                                    {formatDate(entry.performed_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

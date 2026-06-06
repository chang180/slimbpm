import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Clock, GitBranch, Loader2, PauseCircle, Play, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import { formatPaginationLabel, hasMultiplePages, type LengthAwarePaginator } from '@/lib/pagination';

interface WorkflowInstanceSummary {
    id: number;
    title: string;
    status: 'running' | 'completed' | 'cancelled' | 'suspended';
    started_at: string | null;
    completed_at: string | null;
    updated_at: string;
    template: {
        id: number;
        name: string;
        version: string;
    } | null;
    starter: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface PaginatedInstances extends LengthAwarePaginator<WorkflowInstanceSummary> {}

interface WorkflowsIndexProps {
    myInstances: PaginatedInstances;
    pendingSteps: PaginatedInstances;
    filters: { status?: string; tab?: string };
}

const statusConfig = {
    running: { label: '進行中', icon: Loader2, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', iconClass: 'animate-spin' },
    completed: { label: '已完成', icon: CheckCircle2, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', iconClass: '' },
    cancelled: { label: '已取消', icon: XCircle, className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', iconClass: '' },
    suspended: { label: '已暫停', icon: PauseCircle, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', iconClass: '' },
} as const;

function StatusBadge({ status }: { status: string }) {
    const config = statusConfig[status as keyof typeof statusConfig] ?? {
        label: status,
        icon: Clock,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        iconClass: '',
    };
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
            <Icon className={`h-3 w-3 ${config.iconClass}`} />
            {config.label}
        </span>
    );
}

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

function InstanceTable({
    instances,
    showStarter = false,
    emptyMessage,
}: {
    instances: PaginatedInstances;
    showStarter?: boolean;
    emptyMessage: string;
}) {
    if (instances.data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <GitBranch className="mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border text-left text-xs font-medium uppercase text-muted-foreground">
                            <th className="pb-3 pr-4">標題 / 模板</th>
                            {showStarter && <th className="pb-3 pr-4">發起人</th>}
                            <th className="pb-3 pr-4">狀態</th>
                            <th className="pb-3 pr-4">發起時間</th>
                            <th className="pb-3 pr-4">最後更新</th>
                            <th className="pb-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {instances.data.map((instance) => (
                            <tr key={instance.id} className="group">
                                <td className="py-3 pr-4">
                                    <div className="font-medium text-foreground">{instance.title}</div>
                                    {instance.template && (
                                        <div className="text-xs text-muted-foreground">
                                            {instance.template.name} · v{instance.template.version}
                                        </div>
                                    )}
                                </td>
                                {showStarter && (
                                    <td className="py-3 pr-4 text-muted-foreground">
                                        {instance.starter?.name ?? '-'}
                                    </td>
                                )}
                                <td className="py-3 pr-4">
                                    <StatusBadge status={instance.status} />
                                </td>
                                <td className="py-3 pr-4 text-muted-foreground">
                                    {formatDate(instance.started_at)}
                                </td>
                                <td className="py-3 pr-4 text-muted-foreground">
                                    {formatDate(instance.updated_at)}
                                </td>
                                <td className="py-3 text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/workflows/${instance.id}`}>查看詳情</Link>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {hasMultiplePages(instances) && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        共 {instances.total} 筆，顯示第 {instances.from} – {instances.to} 筆
                    </span>
                    <div className="flex gap-1">
                        {instances.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                            >
                                {formatPaginationLabel(link.label)}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function WorkflowsIndex({ myInstances, pendingSteps, filters }: WorkflowsIndexProps) {
    const breadcrumbs = useMemo<BreadcrumbItem[]>(
        () => [
            { title: '儀表板', href: '/dashboard' },
            { title: '工作流程', href: '/workflows' },
        ],
        [],
    );

    const defaultTab = filters.tab ?? (pendingSteps.total > 0 ? 'pending' : 'mine');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="工作流程" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">工作流程</h1>
                        <p className="text-sm text-muted-foreground">管理您的工作流程申請與待審批事項</p>
                    </div>
                    <Button asChild>
                        <Link href="/workflows/start">
                            <Play className="mr-2 h-4 w-4" />
                            發起申請
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold">{myInstances.total}</div>
                            <div className="text-sm text-muted-foreground">我的申請</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {pendingSteps.total}
                            </div>
                            <div className="text-sm text-muted-foreground">待我審批</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {myInstances.data.filter((i) => i.status === 'running').length}
                            </div>
                            <div className="text-sm text-muted-foreground">進行中</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {myInstances.data.filter((i) => i.status === 'completed').length}
                            </div>
                            <div className="text-sm text-muted-foreground">已完成</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <Tabs defaultValue={defaultTab}>
                        <CardHeader className="pb-0">
                            <TabsList>
                                <TabsTrigger value="mine">
                                    我的申請
                                    {myInstances.total > 0 && (
                                        <Badge variant="secondary" className="ml-1.5">
                                            {myInstances.total}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="pending">
                                    待我審批
                                    {pendingSteps.total > 0 && (
                                        <Badge className="ml-1.5 bg-yellow-500 text-white">
                                            {pendingSteps.total}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>

                        <CardContent className="pt-4">
                            <TabsContent value="mine" className="mt-0">
                                <InstanceTable
                                    instances={myInstances}
                                    emptyMessage="您尚未發起任何工作流程申請"
                                />
                            </TabsContent>
                            <TabsContent value="pending" className="mt-0">
                                <InstanceTable
                                    instances={pendingSteps}
                                    showStarter
                                    emptyMessage="目前沒有待您審批的事項"
                                />
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    CheckCircle2,
    Clock,
    Loader2,
    PauseCircle,
    Search,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatPaginationLabel, hasMultiplePages, type LengthAwarePaginator } from '@/lib/pagination';

interface InstanceRow {
    id: number;
    title: string;
    status: string;
    active_steps: unknown[] | null;
    started_at: string | null;
    completed_at: string | null;
    updated_at: string;
    created_at: string;
    template: { id: number; name: string; version: string } | null;
    starter: { id: number; name: string; email: string } | null;
}

interface PaginatedInstances extends LengthAwarePaginator<InstanceRow> {}

interface MonitorStats {
    total: number;
    running: number;
    completed: number;
    suspended: number;
    cancelled: number;
}

interface WorkflowMonitorProps {
    instances: PaginatedInstances;
    stats: MonitorStats;
    filters: { status?: string; search?: string };
}

const statusConfig = {
    running: {
        label: '進行中',
        icon: Loader2,
        iconClass: 'animate-spin text-blue-500',
        badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    pending: {
        label: '等待中',
        icon: Clock,
        iconClass: 'text-yellow-500',
        badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    },
    completed: {
        label: '已完成',
        icon: CheckCircle2,
        iconClass: 'text-green-500',
        badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    suspended: {
        label: '已暫停',
        icon: PauseCircle,
        iconClass: 'text-orange-500',
        badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    },
    cancelled: {
        label: '已取消',
        icon: XCircle,
        iconClass: 'text-red-500',
        badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    },
} as const;

function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status as keyof typeof statusConfig] ?? {
        label: status,
        icon: Clock,
        iconClass: 'text-muted-foreground',
        badgeClass: 'bg-muted text-muted-foreground',
    };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.badgeClass}`}>
            <Icon className={`h-3 w-3 ${cfg.iconClass}`} />
            {cfg.label}
        </span>
    );
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const statCards = [
    { key: 'total', label: '全部', color: 'text-foreground', bg: 'bg-muted/50' },
    { key: 'running', label: '進行中', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { key: 'completed', label: '已完成', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30' },
    { key: 'suspended', label: '已暫停', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30' },
    { key: 'cancelled', label: '已取消', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30' },
] as const;

export default function WorkflowMonitor({ instances, stats, filters }: WorkflowMonitorProps) {
    const breadcrumbs = useMemo<BreadcrumbItem[]>(
        () => [
            { title: '儀表板', href: '/dashboard' },
            { title: '工作流程監控', href: '/workflows/monitor' },
        ],
        [],
    );

    const [search, setSearch] = useState(filters.search ?? '');
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const activeStatus = filters.status ?? '';

    const applyFilters = (newFilters: Record<string, string>) => {
        router.get('/workflows/monitor', newFilters, { preserveState: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ ...(activeStatus ? { status: activeStatus } : {}), ...(search ? { search } : {}) });
    };

    const handleStatusFilter = (status: string) => {
        applyFilters({ ...(status ? { status } : {}), ...(search ? { search } : {}) });
    };

    const actionLabels: Record<string, string> = { suspend: '暫停', resume: '恢復', cancel: '取消' };

    const handleAction = async (id: number, action: 'suspend' | 'resume' | 'cancel') => {
        setActionLoading(id);
        setActionError(null);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
            const res = await fetch(`/api/v1/workflow-instances/${id}`, {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ action }),
            });
            if (res.ok) {
                router.reload({ only: ['instances', 'stats'] });
            } else {
                const label = actionLabels[action] ?? action;
                setActionError(`${label}操作失敗（狀態碼 ${res.status}），請稍後再試。`);
            }
        } catch {
            const label = actionLabels[action] ?? action;
            setActionError(`${label}操作時發生網路錯誤，請檢查連線後再試。`);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="工作流程監控" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <h1 className="text-2xl font-semibold">工作流程監控</h1>
                        <p className="text-sm text-muted-foreground">查看和管理組織內所有工作流程實例</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {statCards.map((card) => (
                        <button
                            key={card.key}
                            onClick={() => handleStatusFilter(card.key === 'total' ? '' : card.key)}
                            className={`rounded-lg p-4 text-left transition-all hover:ring-1 hover:ring-ring ${card.bg} ${
                                (card.key === 'total' && !activeStatus) || activeStatus === card.key
                                    ? 'ring-2 ring-ring'
                                    : ''
                            }`}
                        >
                            <div className={`text-2xl font-bold tabular-nums ${card.color}`}>
                                {stats[card.key]}
                            </div>
                            <div className="mt-0.5 text-xs text-muted-foreground">{card.label}</div>
                        </button>
                    ))}
                </div>

                {/* Action error */}
                {actionError && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                        {actionError}
                    </div>
                )}

                {/* Search & Filter */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="搜尋工作流程名稱…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="outline" size="sm" className="h-10">
                        搜尋
                    </Button>
                    {(search || activeStatus) && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-10"
                            onClick={() => {
                                setSearch('');
                                router.get('/workflows/monitor', {}, { replace: true });
                            }}
                        >
                            清除
                        </Button>
                    )}
                </form>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        {instances.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <Activity className="mb-3 h-10 w-10 opacity-20" />
                                <p className="text-sm">
                                    {activeStatus || search ? '沒有符合條件的工作流程' : '目前沒有工作流程'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/30 text-muted-foreground">
                                            <th className="px-4 py-3 text-left font-medium">標題</th>
                                            <th className="px-4 py-3 text-left font-medium">模板</th>
                                            <th className="px-4 py-3 text-left font-medium">申請人</th>
                                            <th className="px-4 py-3 text-left font-medium">狀態</th>
                                            <th className="px-4 py-3 text-left font-medium">建立時間</th>
                                            <th className="px-4 py-3 text-left font-medium">更新時間</th>
                                            <th className="px-4 py-3 text-right font-medium">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {instances.data.map((instance) => (
                                            <tr key={instance.id} className="transition-colors hover:bg-muted/20">
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={`/workflows/${instance.id}`}
                                                        className="font-medium text-foreground hover:underline"
                                                    >
                                                        {instance.title}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {instance.template?.name ?? '—'}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {instance.starter?.name ?? '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={instance.status} />
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                                                    {formatDate(instance.created_at)}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground tabular-nums">
                                                    {formatDate(instance.updated_at)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {instance.status === 'running' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 px-2 text-xs text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:text-orange-400"
                                                                disabled={actionLoading === instance.id}
                                                                onClick={() => handleAction(instance.id, 'suspend')}
                                                            >
                                                                {actionLoading === instance.id ? (
                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    '暫停'
                                                                )}
                                                            </Button>
                                                        )}
                                                        {instance.status === 'suspended' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400"
                                                                disabled={actionLoading === instance.id}
                                                                onClick={() => handleAction(instance.id, 'resume')}
                                                            >
                                                                {actionLoading === instance.id ? (
                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    '恢復'
                                                                )}
                                                            </Button>
                                                        )}
                                                        {['running', 'suspended', 'pending'].includes(instance.status) && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400"
                                                                disabled={actionLoading === instance.id}
                                                                onClick={() => handleAction(instance.id, 'cancel')}
                                                            >
                                                                {actionLoading === instance.id ? (
                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    '取消'
                                                                )}
                                                            </Button>
                                                        )}
                                                        <Link href={`/workflows/${instance.id}`}>
                                                            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                                                查看
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {hasMultiplePages(instances) && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            共 {instances.total} 筆，第 {instances.from}–{instances.to} 筆
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
        </AppLayout>
    );
}

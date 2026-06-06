import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    GitBranch,
    CheckCircle2,
    Clock,
    Activity,
    Loader2,
} from 'lucide-react';
import { useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface WorkflowStats {
    totalTemplates: number;
    activeTemplates: number;
    totalInstances: number;
    completedToday: number;
    running: number;
    avgCompletionDays: number | null;
}

interface PerformancePoint {
    month: string;
    started: number;
    completed: number;
    cancelled: number;
}

interface TemplateUsage {
    name: string;
    count: number;
}

interface WorkflowPerformanceProps {
    workflowStats: WorkflowStats;
    performanceData: PerformancePoint[];
    templateUsage: TemplateUsage[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: '報表中心', href: '/reports' },
    { title: '流程效能報表', href: '/reports/workflow-performance' },
];

const BAR_COLORS = ['#3b82f6', '#10b981', '#ef4444'];

function StatCard({
    title,
    value,
    sub,
    icon: Icon,
    color,
}: {
    title: string;
    value: string | number;
    sub?: string;
    icon: React.ElementType;
    color: string;
}) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold tabular-nums">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
                    </div>
                    <div className={`rounded-lg p-3 ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function WorkflowPerformance({ workflowStats, performanceData, templateUsage }: WorkflowPerformanceProps) {
    const breadcrumbsMemo = useMemo(() => breadcrumbs, []);

    return (
        <AppLayout breadcrumbs={breadcrumbsMemo}>
            <Head title="流程效能報表" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/reports">
                                <ArrowLeft className="mr-1.5 h-4 w-4" />
                                返回報表中心
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold">流程效能報表</h1>
                            <p className="text-sm text-muted-foreground">工作流程模板使用率與執行效能分析</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/reports/export/workflow-performance" method="post" as="button">
                            <Download className="mr-1.5 h-4 w-4" />
                            匯出報表
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <StatCard
                        title="流程模板數"
                        value={workflowStats.totalTemplates}
                        sub={`${workflowStats.activeTemplates} 個啟用中`}
                        icon={GitBranch}
                        color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    />
                    <StatCard
                        title="總執行次數"
                        value={workflowStats.totalInstances}
                        sub={`今日完成 ${workflowStats.completedToday} 件`}
                        icon={Activity}
                        color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    />
                    <StatCard
                        title="進行中"
                        value={workflowStats.running}
                        icon={Loader2}
                        color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    />
                    <StatCard
                        title="平均完成時間"
                        value={workflowStats.avgCompletionDays !== null ? `${workflowStats.avgCompletionDays} 天` : '—'}
                        sub="已完成流程的平均天數"
                        icon={Clock}
                        color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    />
                    <StatCard
                        title="今日完成"
                        value={workflowStats.completedToday}
                        icon={CheckCircle2}
                        color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    />
                </div>

                {/* Monthly performance chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">近 6 個月流程執行趨勢</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                    }}
                                />
                                <Bar dataKey="started" name="啟動" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="completed" name="完成" fill="#10b981" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="cancelled" name="取消" fill="#ef4444" radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-2 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" />啟動</span>
                            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />完成</span>
                            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500" />取消</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Template usage */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">最常使用的流程模板 TOP 5</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {templateUsage.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">尚無流程資料</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {templateUsage.map((tpl, i) => {
                                    const maxCount = templateUsage[0]?.count ?? 1;
                                    const pct = maxCount > 0 ? (tpl.count / maxCount) * 100 : 0;
                                    return (
                                        <div key={tpl.name} className="flex items-center gap-3">
                                            <span className="w-5 shrink-0 text-center text-sm font-bold text-muted-foreground">
                                                {i + 1}
                                            </span>
                                            <span className="w-40 shrink-0 truncate text-sm">{tpl.name}</span>
                                            <div className="flex-1 rounded-full bg-muted">
                                                <div
                                                    className="h-2 rounded-full bg-blue-500 transition-all"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="w-16 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                                                {tpl.count} 次
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

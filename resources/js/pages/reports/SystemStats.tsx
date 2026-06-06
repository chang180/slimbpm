import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    Users,
    Building2,
    FileText,
    GitBranch,
    Send,
    Activity,
} from 'lucide-react';
import { useMemo } from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface SystemStatsData {
    totalUsers: number;
    totalDepartments: number;
    totalForms: number;
    totalWorkflows: number;
    totalSubmissions: number;
    totalWorkflowInstances: number;
}

interface UsagePoint {
    month: string;
    newUsers: number;
    submissions: number;
    workflows: number;
}

interface SystemStatsProps {
    systemStats: SystemStatsData;
    usageData: UsagePoint[];
    orgName: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: '報表中心', href: '/reports' },
    { title: '系統統計報表', href: '/reports/system-stats' },
];

function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
}) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function SystemStats({ systemStats, usageData, orgName }: SystemStatsProps) {
    const breadcrumbsMemo = useMemo(() => breadcrumbs, []);

    return (
        <AppLayout breadcrumbs={breadcrumbsMemo}>
            <Head title="系統統計報表" />

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
                            <h1 className="text-2xl font-semibold">系統統計報表</h1>
                            <p className="text-sm text-muted-foreground">{orgName} — 系統整體使用概覽</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/reports/export/system-stats" method="post" as="button">
                            <Download className="mr-1.5 h-4 w-4" />
                            匯出報表
                        </Link>
                    </Button>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <StatCard
                        title="用戶總數"
                        value={systemStats.totalUsers}
                        icon={Users}
                        color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    />
                    <StatCard
                        title="部門數"
                        value={systemStats.totalDepartments}
                        icon={Building2}
                        color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    />
                    <StatCard
                        title="表單模板"
                        value={systemStats.totalForms}
                        icon={FileText}
                        color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    />
                    <StatCard
                        title="流程模板"
                        value={systemStats.totalWorkflows}
                        icon={GitBranch}
                        color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    />
                    <StatCard
                        title="表單提交次數"
                        value={systemStats.totalSubmissions}
                        icon={Send}
                        color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    />
                    <StatCard
                        title="流程執行次數"
                        value={systemStats.totalWorkflowInstances}
                        icon={Activity}
                        color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                    />
                </div>

                {/* Usage trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">近 6 個月系統使用趨勢</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={usageData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                                <Line
                                    type="monotone"
                                    dataKey="newUsers"
                                    name="新增用戶"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="submissions"
                                    name="表單提交"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="workflows"
                                    name="流程啟動"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-2 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-6 bg-blue-500" />新增用戶</span>
                            <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-6 bg-emerald-500" />表單提交</span>
                            <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-6 bg-violet-500" />流程啟動</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    TrendingUp,
    Users,
    UserPlus,
    FileText,
    GitBranch,
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

interface UserStats {
    totalUsers: number;
    newUsersThisMonth: number;
    newUsersLastMonth: number;
    totalSubmissions: number;
}

interface ActivityPoint {
    month: string;
    newUsers: number;
    submissions: number;
    workflows: number;
}

interface DeptStat {
    name: string;
    users_count: number;
    percentage: number;
}

interface UserActivityProps {
    userStats: UserStats;
    activityData: ActivityPoint[];
    departmentStats: DeptStat[];
}

const DEPT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#a4de6c'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: '報表中心', href: '/reports' },
    { title: '用戶活動報表', href: '/reports/user-activity' },
];

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
                        <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
                        {sub && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3" />
                                {sub}
                            </p>
                        )}
                    </div>
                    <div className={`rounded-lg p-3 ${color}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function UserActivityReport({ userStats, activityData, departmentStats }: UserActivityProps) {
    const breadcrumbsMemo = useMemo(() => breadcrumbs, []);

    const growthPct = userStats.newUsersLastMonth > 0
        ? Math.round(((userStats.newUsersThisMonth - userStats.newUsersLastMonth) / userStats.newUsersLastMonth) * 100)
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbsMemo}>
            <Head title="用戶活動報表" />

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
                            <h1 className="text-2xl font-semibold">用戶活動報表</h1>
                            <p className="text-sm text-muted-foreground">組織用戶成長與表單活動概覽</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/reports/export/user-activity" method="post" as="button">
                            <Download className="mr-1.5 h-4 w-4" />
                            匯出報表
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        title="總用戶數"
                        value={userStats.totalUsers}
                        icon={Users}
                        color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    />
                    <StatCard
                        title="本月新增用戶"
                        value={userStats.newUsersThisMonth}
                        sub={growthPct !== null
                            ? `${growthPct >= 0 ? '+' : ''}${growthPct}% 較上月`
                            : '本月新增'}
                        icon={UserPlus}
                        color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    />
                    <StatCard
                        title="上月新增用戶"
                        value={userStats.newUsersLastMonth}
                        icon={UserPlus}
                        color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    />
                    <StatCard
                        title="累計表單提交"
                        value={userStats.totalSubmissions}
                        icon={FileText}
                        color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    />
                </div>

                {/* Monthly activity chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">近 6 個月活動趨勢</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={activityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                                <Bar dataKey="newUsers" name="新增用戶" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="submissions" name="表單提交" fill="#10b981" radius={[3, 3, 0, 0]} />
                                <Bar dataKey="workflows" name="工作流程" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-2 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" />新增用戶</span>
                            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />表單提交</span>
                            <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-violet-500" />工作流程</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Department breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">部門用戶分佈</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {departmentStats.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">尚無部門資料</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {departmentStats.map((dept, i) => (
                                    <div key={dept.name} className="flex items-center gap-3">
                                        <div
                                            className="h-3 w-3 shrink-0 rounded-full"
                                            style={{ backgroundColor: DEPT_COLORS[i % DEPT_COLORS.length] }}
                                        />
                                        <span className="w-32 shrink-0 truncate text-sm">{dept.name}</span>
                                        <div className="flex-1 rounded-full bg-muted">
                                            <div
                                                className="h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${dept.percentage}%`,
                                                    backgroundColor: DEPT_COLORS[i % DEPT_COLORS.length],
                                                }}
                                            />
                                        </div>
                                        <span className="w-16 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                                            {dept.users_count} 人 ({dept.percentage}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

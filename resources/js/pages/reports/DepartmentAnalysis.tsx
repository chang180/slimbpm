import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Users,
    GitBranch,
    Send,
} from 'lucide-react';
import { useMemo } from 'react';

interface Department {
    id: number;
    name: string;
    users_count: number;
    percentage: number;
    submissions: number;
    workflows: number;
}

interface DeptStats {
    totalDepartments: number;
    totalUsers: number;
    avgUsersPerDept: number;
}

interface DepartmentAnalysisProps {
    departments: Department[];
    stats: DeptStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: '報表中心', href: '/reports' },
    { title: '部門分析報表', href: '/reports/department-analysis' },
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
                        <p className="text-2xl font-bold tabular-nums">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </p>
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

export default function DepartmentAnalysis({ departments, stats }: DepartmentAnalysisProps) {
    const breadcrumbsMemo = useMemo(() => breadcrumbs, []);

    const maxUsers = departments.length > 0 ? Math.max(...departments.map((d) => d.users_count)) : 1;

    return (
        <AppLayout breadcrumbs={breadcrumbsMemo}>
            <Head title="部門分析報表" />

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
                            <h1 className="text-2xl font-semibold">部門分析報表</h1>
                            <p className="text-sm text-muted-foreground">各部門人員、表單提交與流程執行分析</p>
                        </div>
                    </div>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        title="部門總數"
                        value={stats.totalDepartments}
                        icon={Building2}
                        color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    />
                    <StatCard
                        title="組織成員"
                        value={stats.totalUsers}
                        sub="所有部門合計"
                        icon={Users}
                        color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    />
                    <StatCard
                        title="每部門平均人數"
                        value={stats.avgUsersPerDept}
                        icon={Users}
                        color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    />
                </div>

                {/* Department table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">各部門詳細資料</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {departments.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">尚無部門資料</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-xs text-muted-foreground">
                                            <th className="pb-3 pr-4 font-medium">部門名稱</th>
                                            <th className="pb-3 pr-4 font-medium text-right">人員數</th>
                                            <th className="pb-3 pr-4 font-medium">佔比</th>
                                            <th className="pb-3 pr-4 font-medium text-right">表單提交</th>
                                            <th className="pb-3 font-medium text-right">流程執行</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {departments.map((dept) => {
                                            const barPct =
                                                maxUsers > 0 ? (dept.users_count / maxUsers) * 100 : 0;
                                            return (
                                                <tr key={dept.id} className="group">
                                                    <td className="py-3 pr-4">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                            <span className="font-medium">{dept.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 pr-4 text-right tabular-nums">
                                                        {dept.users_count.toLocaleString()}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                                                                <div
                                                                    className="h-full rounded-full bg-blue-500 transition-all"
                                                                    style={{ width: `${barPct}%` }}
                                                                />
                                                            </div>
                                                            <span className="tabular-nums text-muted-foreground">
                                                                {dept.percentage}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 pr-4 text-right tabular-nums">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Send className="h-3 w-3 text-muted-foreground" />
                                                            {dept.submissions.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right tabular-nums">
                                                        <span className="inline-flex items-center gap-1">
                                                            <GitBranch className="h-3 w-3 text-muted-foreground" />
                                                            {dept.workflows.toLocaleString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Visual breakdown */}
                {departments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">人員分布概覽</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                {departments.map((dept, i) => (
                                    <div key={dept.id} className="flex items-center gap-3">
                                        <span className="w-5 shrink-0 text-center text-xs font-bold text-muted-foreground">
                                            {i + 1}
                                        </span>
                                        <span className="w-36 shrink-0 truncate text-sm">{dept.name}</span>
                                        <div className="flex-1 rounded-full bg-muted">
                                            <div
                                                className="h-2 rounded-full bg-blue-500 transition-all"
                                                style={{ width: `${dept.percentage}%` }}
                                            />
                                        </div>
                                        <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                                            {dept.users_count} 人 ({dept.percentage}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

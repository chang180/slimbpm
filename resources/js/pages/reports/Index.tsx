import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    BarChart3,
    FileText,
    Users,
    TrendingUp,
    Download,
    Eye,
    Activity,
    GitBranch,
    Send,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: '報表中心',
        href: '/reports',
    },
];

interface Summary {
    totalUsers: number;
    totalWorkflowInstances: number;
    totalSubmissions: number;
    activeWorkflows: number;
}

interface ReportsIndexProps {
    summary: Summary;
}

export default function ReportsIndex({ summary }: ReportsIndexProps) {
    const reportCards = [
        {
            id: 'user-activity',
            title: '用戶活動報表',
            description: '用戶登入、操作記錄和活躍度分析',
            icon: Users,
            href: '/reports/user-activity',
            color: 'text-blue-600',
            statValue: summary.totalUsers.toLocaleString(),
            statLabel: '組織成員數',
        },
        {
            id: 'workflow-performance',
            title: '流程效能報表',
            description: '工作流程執行統計和效能分析',
            icon: TrendingUp,
            href: '/reports/workflow-performance',
            color: 'text-green-600',
            statValue: summary.activeWorkflows.toLocaleString(),
            statLabel: '進行中流程',
        },
        {
            id: 'system-stats',
            title: '系統統計報表',
            description: '系統使用情況和資源統計',
            icon: BarChart3,
            href: '/reports/system-stats',
            color: 'text-purple-600',
            statValue: summary.totalSubmissions.toLocaleString(),
            statLabel: '表單提交次數',
        },
        {
            id: 'department-analysis',
            title: '部門分析報表',
            description: '各部門活動和效能比較',
            icon: FileText,
            href: '/reports/department-analysis',
            color: 'text-orange-600',
            statValue: summary.totalWorkflowInstances.toLocaleString(),
            statLabel: '流程執行總數',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="報表中心 - SlimBPM" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">報表中心</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">查看系統使用情況和效能分析</p>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">組織成員</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {summary.totalUsers.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">流程執行</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {summary.totalWorkflowInstances.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                                    <GitBranch className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">表單提交</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {summary.totalSubmissions.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                                    <Send className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">進行中流程</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {summary.activeWorkflows.toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                                    <Activity className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Report cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {reportCards.map((report) => (
                        <Card key={report.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                                            <report.icon className={`h-6 w-6 ${report.color}`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{report.title}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {report.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="ml-auto">
                                        可用
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {report.statValue}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{report.statLabel}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button asChild className="flex-1">
                                        <Link href={report.href}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            查看報表
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

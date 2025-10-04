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
    Calendar,
    Filter,
    Eye
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: '報表中心',
        href: '/reports',
    },
];

interface ReportCard {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    color: string;
    stats?: {
        value: string;
        label: string;
        trend?: 'up' | 'down' | 'stable';
    };
}

const reportCards: ReportCard[] = [
    {
        id: 'user-activity',
        title: '用戶活動報表',
        description: '用戶登入、操作記錄和活躍度分析',
        icon: Users,
        href: '/reports/user-activity',
        color: 'text-blue-600',
        stats: {
            value: '1,234',
            label: '今日活躍用戶',
            trend: 'up'
        }
    },
    {
        id: 'workflow-performance',
        title: '流程效能報表',
        description: '工作流程執行統計和效能分析',
        icon: TrendingUp,
        href: '/reports/workflow-performance',
        color: 'text-green-600',
        stats: {
            value: '89%',
            label: '流程完成率',
            trend: 'up'
        }
    },
    {
        id: 'system-stats',
        title: '系統統計報表',
        description: '系統使用情況和資源統計',
        icon: BarChart3,
        href: '/reports/system-stats',
        color: 'text-purple-600',
        stats: {
            value: '45',
            label: '表單提交',
            trend: 'stable'
        }
    },
    {
        id: 'department-analysis',
        title: '部門分析報表',
        description: '各部門活動和效能比較',
        icon: FileText,
        href: '/reports/department-analysis',
        color: 'text-orange-600',
        stats: {
            value: '12',
            label: '活躍部門',
            trend: 'up'
        }
    }
];

export default function ReportsIndex() {
    const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-3 h-3 text-green-500" />;
            case 'down':
                return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
            default:
                return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="報表中心 - SlimBPM" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* 頁面標題 */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            報表中心
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            查看系統使用情況和效能分析
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            篩選
                        </Button>
                        <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            時間範圍
                        </Button>
                        <Button size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            匯出報表
                        </Button>
                    </div>
                </div>

                {/* 快速統計 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        總報表數
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        24
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <BarChart3 className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        本月查看
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        156
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Eye className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        匯出次數
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        89
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Download className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        最後更新
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        2分鐘前
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <Calendar className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 報表分類 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {reportCards.map((report) => (
                        <Card key={report.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <report.icon className={`w-6 h-6 ${report.color}`} />
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
                                {report.stats && (
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {report.stats.value}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {report.stats.label}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {getTrendIcon(report.stats.trend)}
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button asChild className="flex-1">
                                        <Link href={report.href}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            查看報表
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* 最近查看的報表 */}
                <Card>
                    <CardHeader>
                        <CardTitle>最近查看的報表</CardTitle>
                        <CardDescription>
                            您最近查看和匯出的報表記錄
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    name: '用戶活動報表',
                                    type: 'PDF',
                                    date: '2025-01-04 14:30',
                                    size: '2.3 MB'
                                },
                                {
                                    name: '流程效能分析',
                                    type: 'Excel',
                                    date: '2025-01-04 10:15',
                                    size: '1.8 MB'
                                },
                                {
                                    name: '系統統計月報',
                                    type: 'PDF',
                                    date: '2025-01-03 16:45',
                                    size: '3.1 MB'
                                }
                            ].map((report, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                                            <FileText className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {report.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {report.type} • {report.size} • {report.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <Eye className="w-4 h-4 mr-1" />
                                            查看
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Download className="w-4 h-4 mr-1" />
                                            下載
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

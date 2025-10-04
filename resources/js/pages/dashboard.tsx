import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    Building2, 
    FileText, 
    Workflow, 
    Activity,
    TrendingUp,
    Clock,
    BarChart3,
    PieChart
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Cell
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: '儀表板',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: {
        totalUsers: number;
        totalDepartments: number;
        totalForms: number;
        totalWorkflows: number;
        activeWorkflows: number;
    };
    recentActivities: Array<{
        id: number;
        type: string;
        description: string;
        user_name: string;
        created_at: string;
    }>;
    chartData: Array<{
        month: string;
        users: number;
        forms: number;
        workflows: number;
    }>;
    departmentStats: Array<{
        name: string;
        users_count: number;
        percentage: number;
    }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard({ 
    stats, 
    recentActivities, 
    chartData, 
    departmentStats 
}: DashboardProps) {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user_login':
                return <Users className="w-4 h-4 text-blue-500" />;
            case 'form_submit':
                return <FileText className="w-4 h-4 text-green-500" />;
            case 'workflow_complete':
                return <Workflow className="w-4 h-4 text-purple-500" />;
            case 'department_create':
                return <Building2 className="w-4 h-4 text-orange-500" />;
            default:
                return <Activity className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes} 分鐘前`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} 小時前`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)} 天前`;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="儀表板 - SlimBPM" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* 歡迎標題 */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            歡迎回來
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            這裡是您的 SlimBPM 系統概覽
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            系統運行正常
                        </Badge>
                    </div>
                </div>

                {/* 統計卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">總用戶數</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                活躍用戶
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">部門數量</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
                            <p className="text-xs text-muted-foreground">
                                組織架構
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">表單模板</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalForms}</div>
                            <p className="text-xs text-muted-foreground">
                                可用表單
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">工作流程</CardTitle>
                            <Workflow className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
                            <p className="text-xs text-muted-foreground">
                                總流程數
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">活躍流程</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeWorkflows}</div>
                            <p className="text-xs text-muted-foreground">
                                正在執行
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 圖表和活動 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 趨勢圖表 */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                系統使用趨勢
                            </CardTitle>
                            <CardDescription>
                                過去 6 個月的系統使用情況
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="users" 
                                        stroke="#8884d8" 
                                        strokeWidth={2}
                                        name="用戶數"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="forms" 
                                        stroke="#82ca9d" 
                                        strokeWidth={2}
                                        name="表單數"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="workflows" 
                                        stroke="#ffc658" 
                                        strokeWidth={2}
                                        name="流程數"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 最近活動 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                最近活動
                            </CardTitle>
                            <CardDescription>
                                系統最新動態
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                <span className="font-medium">{activity.user_name}</span>
                                                {' '}
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatTime(activity.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link 
                                    href="/reports" 
                                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                    查看所有活動 →
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 部門統計圖表 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5" />
                            部門人員分布
                        </CardTitle>
                        <CardDescription>
                            各部門人員數量統計
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Tooltip formatter={(value, name) => [value, '人數']} />
                                        <RechartsPieChart
                                            data={departmentStats}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="users_count"
                                            nameKey="name"
                                        >
                                            {departmentStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </RechartsPieChart>
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-3">
                                {departmentStats.map((dept, index) => (
                                    <div key={dept.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-3 h-3 rounded-full" 
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="text-sm font-medium">{dept.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">{dept.users_count}</div>
                                            <div className="text-xs text-gray-500">{dept.percentage}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 快速操作 */}
                <Card>
                    <CardHeader>
                        <CardTitle>快速操作</CardTitle>
                        <CardDescription>
                            常用功能的快速入口
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link 
                                href="/departments/create"
                                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Building2 className="w-8 h-8 text-blue-500" />
                                <span className="text-sm font-medium">新增部門</span>
                            </Link>
                            <Link 
                                href="/form-builder"
                                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <FileText className="w-8 h-8 text-green-500" />
                                <span className="text-sm font-medium">設計表單</span>
                            </Link>
                            <Link 
                                href="/workflows/designer"
                                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Workflow className="w-8 h-8 text-purple-500" />
                                <span className="text-sm font-medium">設計流程</span>
                            </Link>
                            <Link 
                                href="/reports"
                                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <BarChart3 className="w-8 h-8 text-orange-500" />
                                <span className="text-sm font-medium">查看報表</span>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    TrendingUp,
    Download,
    Calendar,
    Filter,
    ArrowLeft,
    Activity,
    Clock,
    BarChart3
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
    PieChart,
    Cell
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: '報表中心',
        href: '/reports',
    },
    {
        title: '用戶活動報表',
        href: '/reports/user-activity',
    },
];

// 模擬資料
const userActivityData = [
    { date: '1月', logins: 120, actions: 450, newUsers: 15 },
    { date: '2月', logins: 135, actions: 520, newUsers: 18 },
    { date: '3月', logins: 148, actions: 610, newUsers: 22 },
    { date: '4月', logins: 162, actions: 730, newUsers: 25 },
    { date: '5月', logins: 175, actions: 850, newUsers: 28 },
    { date: '6月', logins: 189, actions: 920, newUsers: 32 },
];

const dailyActivityData = [
    { time: '00:00', users: 5 },
    { time: '04:00', users: 3 },
    { time: '08:00', users: 45 },
    { time: '12:00', users: 78 },
    { time: '16:00', users: 65 },
    { time: '20:00', users: 32 },
    { time: '24:00', users: 8 },
];

const departmentActivity = [
    { name: '研發部', users: 45, activity: 89 },
    { name: '行銷部', users: 32, activity: 76 },
    { name: '人資部', users: 28, activity: 82 },
    { name: '財務部', users: 24, activity: 68 },
    { name: '客服部', users: 35, activity: 91 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function UserActivityReport() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="用戶活動報表 - SlimBPM" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* 頁面標題 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/reports">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                返回報表中心
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                用戶活動報表
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                用戶登入、操作記錄和活躍度分析
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select defaultValue="last-30-days">
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="選擇時間範圍" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="last-7-days">最近 7 天</SelectItem>
                                <SelectItem value="last-30-days">最近 30 天</SelectItem>
                                <SelectItem value="last-90-days">最近 90 天</SelectItem>
                                <SelectItem value="last-year">過去一年</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            篩選
                        </Button>
                        <Button size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            匯出報表
                        </Button>
                    </div>
                </div>

                {/* 關鍵指標 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        總用戶數
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        1,234
                                    </p>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        +12% 較上月
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        日活躍用戶
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        456
                                    </p>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        +8% 較上月
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        平均使用時間
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        2.5h
                                    </p>
                                    <p className="text-xs text-red-600 flex items-center mt-1">
                                        <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                                        -3% 較上月
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Clock className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        新用戶註冊
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        89
                                    </p>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        +15% 較上月
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 圖表區域 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 用戶活動趨勢 */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                用戶活動趨勢
                            </CardTitle>
                            <CardDescription>
                                過去 6 個月的用戶登入和操作統計
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={userActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line 
                                        type="monotone" 
                                        dataKey="logins" 
                                        stroke="#8884d8" 
                                        strokeWidth={3}
                                        name="登入次數"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="actions" 
                                        stroke="#82ca9d" 
                                        strokeWidth={3}
                                        name="操作次數"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="newUsers" 
                                        stroke="#ffc658" 
                                        strokeWidth={3}
                                        name="新用戶"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 每日活躍時間分布 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                每日活躍時間分布
                            </CardTitle>
                            <CardDescription>
                                用戶在不同時間段的活躍度
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dailyActivityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="users" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 部門活躍度 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                部門活躍度分析
                            </CardTitle>
                            <CardDescription>
                                各部門用戶數量和活動統計
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {departmentActivity.map((dept, index) => (
                                    <div key={dept.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="w-4 h-4 rounded-full" 
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="font-medium">{dept.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm font-bold">{dept.users}</div>
                                                <div className="text-xs text-gray-500">用戶</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold">{dept.activity}%</div>
                                                <div className="text-xs text-gray-500">活躍度</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 用戶行為分析 */}
                <Card>
                    <CardHeader>
                        <CardTitle>用戶行為分析</CardTitle>
                        <CardDescription>
                            用戶操作類型和頻率統計
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-medium">最常用功能</h4>
                                <div className="space-y-2">
                                    {[
                                        { name: '表單提交', count: 456, percentage: 35 },
                                        { name: '流程審批', count: 324, percentage: 25 },
                                        { name: '資料查看', count: 287, percentage: 22 },
                                        { name: '報表匯出', count: 156, percentage: 12 },
                                        { name: '設定修改', count: 87, percentage: 7 },
                                    ].map((item, index) => (
                                        <div key={item.name} className="flex items-center justify-between">
                                            <span className="text-sm">{item.name}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-500 h-2 rounded-full" 
                                                        style={{ width: `${item.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-12 text-right">
                                                    {item.count}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium">設備類型</h4>
                                <div className="space-y-2">
                                    {[
                                        { name: '桌面端', count: 789, percentage: 64 },
                                        { name: '行動端', count: 445, percentage: 36 },
                                    ].map((item, index) => (
                                        <div key={item.name} className="flex items-center justify-between">
                                            <span className="text-sm">{item.name}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-500 h-2 rounded-full" 
                                                        style={{ width: `${item.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-12 text-right">
                                                    {item.count}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium">使用時長分布</h4>
                                <div className="space-y-2">
                                    {[
                                        { name: '0-30分鐘', count: 234, percentage: 19 },
                                        { name: '30分鐘-1小時', count: 456, percentage: 37 },
                                        { name: '1-2小時', count: 378, percentage: 31 },
                                        { name: '2小時以上', count: 166, percentage: 13 },
                                    ].map((item, index) => (
                                        <div key={item.name} className="flex items-center justify-between">
                                            <span className="text-sm">{item.name}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-purple-500 h-2 rounded-full" 
                                                        style={{ width: `${item.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium w-12 text-right">
                                                    {item.count}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

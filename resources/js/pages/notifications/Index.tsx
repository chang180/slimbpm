import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Bell, BellOff, CheckCheck, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { useMemo, useState } from 'react';
import { hasMultiplePages, type LengthAwarePaginator } from '@/lib/pagination';

interface NotificationRecord {
    id: number;
    user_id: number;
    type: 'email' | 'line' | 'telegram' | 'whatsapp';
    subject: string | null;
    content: string;
    status: 'pending' | 'sent' | 'failed';
    sent_at: string | null;
    created_at: string;
    updated_at: string;
}

interface NotificationsIndexProps {
    notifications: LengthAwarePaginator<NotificationRecord>;
    unreadCount: number;
    filters: { status?: string; type?: string };
}

const typeConfig = {
    email: { label: 'Email', icon: Mail, className: 'text-blue-500' },
    line: { label: 'LINE', icon: MessageSquare, className: 'text-green-500' },
    telegram: { label: 'Telegram', icon: Smartphone, className: 'text-sky-500' },
    whatsapp: { label: 'WhatsApp', icon: MessageSquare, className: 'text-emerald-500' },
} as const;

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function NotificationsIndex({ notifications, unreadCount, filters }: NotificationsIndexProps) {
    const breadcrumbs = useMemo<BreadcrumbItem[]>(
        () => [
            { title: '儀表板', href: '/dashboard' },
            { title: '通知中心', href: '/notifications' },
        ],
        [],
    );

    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [markingAll, setMarkingAll] = useState(false);

    const handleMarkAllRead = () => {
        setMarkingAll(true);
        router.post('/api/v1/notifications/mark-all-as-read', {}, {
            onSuccess: () => router.reload(),
            onFinish: () => setMarkingAll(false),
        });
    };

    const handleMarkRead = (id: number) => {
        router.post(`/api/v1/notifications/${id}/mark-as-read`, {}, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ['notifications', 'unreadCount'] }),
        });
    };

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        router.get('/notifications', status ? { status } : {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="通知中心" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-semibold">
                            通知中心
                            {unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Badge>
                            )}
                        </h1>
                        <p className="text-sm text-muted-foreground">查看和管理您的所有通知</p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={markingAll}
                            onClick={handleMarkAllRead}
                        >
                            <CheckCheck className="mr-1.5 h-4 w-4" />
                            {markingAll ? '處理中...' : '全部標為已讀'}
                        </Button>
                    )}
                </div>

                {/* 篩選器 */}
                <div className="flex gap-2">
                    {[
                        { value: '', label: '全部' },
                        { value: 'pending', label: '未讀' },
                        { value: 'sent', label: '已讀' },
                        { value: 'failed', label: '失敗' },
                    ].map((opt) => (
                        <Button
                            key={opt.value}
                            variant={statusFilter === opt.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleFilterChange(opt.value)}
                        >
                            {opt.label}
                        </Button>
                    ))}
                </div>

                <Card>
                    <CardContent className="p-0">
                        {notifications.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <BellOff className="mb-3 h-10 w-10 opacity-30" />
                                <p className="text-sm">
                                    {statusFilter === 'pending' ? '沒有未讀通知' : '目前沒有通知'}
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-border">
                                {notifications.data.map((notif) => {
                                    const typeCfg = typeConfig[notif.type] ?? typeConfig.email;
                                    const TypeIcon = typeCfg.icon;
                                    const isUnread = notif.status === 'pending';

                                    return (
                                        <li
                                            key={notif.id}
                                            className={`flex items-start gap-4 px-6 py-4 transition-colors ${
                                                isUnread ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                                            }`}
                                        >
                                            <div className={`mt-0.5 shrink-0 ${typeCfg.className}`}>
                                                <TypeIcon className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {isUnread && (
                                                            <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                                        )}
                                                        <span className={`font-medium text-sm ${isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {notif.subject ?? typeCfg.label + ' 通知'}
                                                        </span>
                                                    </div>
                                                    <span className="shrink-0 text-xs text-muted-foreground">
                                                        {formatDate(notif.created_at)}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                    {notif.content}
                                                </p>
                                                {isUnread && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-1 -ml-2 h-7 text-xs text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleMarkRead(notif.id)}
                                                    >
                                                        標為已讀
                                                    </Button>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </CardContent>
                </Card>

                {hasMultiplePages(notifications) && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            共 {notifications.total} 則，顯示第 {notifications.from} – {notifications.to} 則
                        </span>
                        <div className="flex gap-1">
                            {notifications.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

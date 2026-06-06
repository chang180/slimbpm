import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link, router } from '@inertiajs/react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface NotificationItem {
    id: number;
    subject: string | null;
    content: string;
    type: string;
    status: 'pending' | 'sent' | 'failed';
    created_at: string;
}

function formatRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '剛才';
    if (minutes < 60) return `${minutes} 分鐘前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小時前`;
    const days = Math.floor(hours / 24);
    return `${days} 天前`;
}

export function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await fetch('/api/v1/notifications/unread-count', {
                credentials: 'same-origin',
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(data.unread_count ?? 0);
            }
        } catch {
            // silently fail
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/v1/notifications?per_page=8', {
                credentials: 'same-origin',
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.data ?? []);
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        pollRef.current = setInterval(fetchUnreadCount, 60000);
        return () => {
            if (pollRef.current) {
                clearInterval(pollRef.current);
            }
        };
    }, [fetchUnreadCount]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            fetchNotifications();
        }
    };

    const handleMarkRead = async (id: number) => {
        try {
            await fetch(`/api/v1/notifications/${id}/mark-as-read`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
            });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, status: 'sent' as const } : n)),
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch {
            // silently fail
        }
    };

    const handleMarkAllRead = async () => {
        setMarkingAll(true);
        try {
            await fetch('/api/v1/notifications/mark-all-as-read', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                },
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, status: 'sent' as const })));
            setUnreadCount(0);
        } catch {
            // silently fail
        } finally {
            setMarkingAll(false);
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
            variant="ghost"
            size="sm"
            className="relative h-8 w-8 p-0"
            data-test="notification-bell"
        >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <span className="font-semibold text-sm">
                        通知
                        {unreadCount > 0 && (
                            <span className="ml-2 rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                {unreadCount} 未讀
                            </span>
                        )}
                    </span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-muted-foreground"
                            disabled={markingAll}
                            onClick={handleMarkAllRead}
                        >
                            {markingAll ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <CheckCheck className="h-3 w-3 mr-1" />
                            )}
                            全部已讀
                        </Button>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Bell className="mb-2 h-8 w-8 opacity-20" />
                            <p className="text-sm">沒有通知</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-border">
                            {notifications.map((notif) => {
                                const isUnread = notif.status === 'pending';
                                return (
                                    <li
                                        key={notif.id}
                                        className={`flex items-start gap-3 px-4 py-3 ${
                                            isUnread ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                                        }`}
                                    >
                                        {isUnread && (
                                            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                        )}
                                        <div className={`min-w-0 flex-1 ${!isUnread ? 'ml-5' : ''}`}>
                                            <p className={`text-sm font-medium ${isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {notif.subject ?? '通知'}
                                            </p>
                                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                                {notif.content}
                                            </p>
                                            <div className="mt-1 flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground/60">
                                                    {formatRelativeTime(notif.created_at)}
                                                </span>
                                                {isUnread && (
                                                    <button
                                                        onClick={() => handleMarkRead(notif.id)}
                                                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        標為已讀
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="border-t border-border px-4 py-2.5 text-center">
                    <Link
                        href="/notifications"
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        onClick={() => setOpen(false)}
                    >
                        查看全部通知
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

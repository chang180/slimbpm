import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CheckCircle2, Clock, Loader2, Mail, Plus, RefreshCw, Trash2, UserPlus, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SafeSelect, SafeSelectItem } from '@/components/ui/safe-select';

interface InvitationRecord {
    id: number;
    email: string;
    role: string;
    status: 'pending' | 'sent' | 'accepted' | 'cancelled' | 'expired';
    sent_at: string | null;
    expires_at: string | null;
    accepted_at: string | null;
    invited_by: number;
    inviter: { id: number; name: string } | null;
    accepted_user: { id: number; name: string } | null;
}

interface InvitationsIndexProps {
    invitations: {
        data: InvitationRecord[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
}

const statusConfig = {
    pending: { label: '等待發送', icon: Clock, className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    sent: { label: '已發送', icon: Mail, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    accepted: { label: '已接受', icon: CheckCircle2, className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    cancelled: { label: '已取消', icon: XCircle, className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    expired: { label: '已過期', icon: Clock, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
} as const;

const roleLabels: Record<string, string> = { admin: '管理員', manager: '主管', user: '成員' };

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export default function InvitationsIndex({ invitations }: InvitationsIndexProps) {
    const breadcrumbs = useMemo<BreadcrumbItem[]>(
        () => [
            { title: '儀表板', href: '/dashboard' },
            { title: '邀請管理', href: '/invitations' },
        ],
        [],
    );

    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [emailsInput, setEmailsInput] = useState('');
    const [role, setRole] = useState('user');
    const [sending, setSending] = useState(false);
    const [sendErrors, setSendErrors] = useState<string[]>([]);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const handleSendInvitations = () => {
        const emails = emailsInput
            .split(/[\n,;]/)
            .map((e) => e.trim())
            .filter(Boolean);

        if (emails.length === 0) {
            setSendErrors(['請輸入至少一個電子郵件地址']);
            return;
        }

        setSending(true);
        setSendErrors([]);

        router.post(
            '/api/v1/invitations',
            { emails, role },
            {
                onSuccess: () => {
                    setShowInviteDialog(false);
                    setEmailsInput('');
                    setRole('user');
                    router.reload();
                },
                onError: (errs) => {
                    setSendErrors(Object.values(errs));
                    setSending(false);
                },
                onFinish: () => {
                    setSending(false);
                },
            },
        );
    };

    const handleCancel = (id: number) => {
        if (!confirm('確定要取消此邀請嗎？')) return;
        setActionLoading(id);
        router.delete(`/api/v1/invitations/${id}`, {
            onSuccess: () => router.reload(),
            onFinish: () => setActionLoading(null),
        });
    };

    const handleResend = (id: number) => {
        setActionLoading(id);
        router.post(`/api/v1/invitations/${id}/resend`, {}, {
            onSuccess: () => router.reload(),
            onFinish: () => setActionLoading(null),
        });
    };

    const pendingCount = invitations.data.filter((i) => ['pending', 'sent'].includes(i.status)).length;
    const acceptedCount = invitations.data.filter((i) => i.status === 'accepted').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="邀請管理" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">邀請管理</h1>
                        <p className="text-sm text-muted-foreground">管理組織成員邀請</p>
                    </div>
                    <Button onClick={() => setShowInviteDialog(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        發送邀請
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold">{invitations.total}</div>
                            <div className="text-sm text-muted-foreground">總邀請數</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingCount}</div>
                            <div className="text-sm text-muted-foreground">待處理</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{acceptedCount}</div>
                            <div className="text-sm text-muted-foreground">已接受</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>邀請記錄</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {invitations.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <UserPlus className="mb-3 h-10 w-10 opacity-30" />
                                <p className="text-sm">尚未發送任何邀請</p>
                                <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowInviteDialog(true)}>
                                    <Plus className="mr-1.5 h-4 w-4" />
                                    發送第一個邀請
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border text-left text-xs font-medium uppercase text-muted-foreground">
                                            <th className="pb-3 pr-4">電子郵件</th>
                                            <th className="pb-3 pr-4">角色</th>
                                            <th className="pb-3 pr-4">狀態</th>
                                            <th className="pb-3 pr-4">邀請人</th>
                                            <th className="pb-3 pr-4">發送時間</th>
                                            <th className="pb-3 pr-4">到期時間</th>
                                            <th className="pb-3 text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {invitations.data.map((inv) => {
                                            const cfg = statusConfig[inv.status] ?? statusConfig.cancelled;
                                            const StatusIcon = cfg.icon;
                                            const isPending = ['pending', 'sent'].includes(inv.status);
                                            const isResendable = ['pending', 'sent', 'expired'].includes(inv.status);
                                            const loading = actionLoading === inv.id;

                                            return (
                                                <tr key={inv.id}>
                                                    <td className="py-3 pr-4 font-medium">{inv.email}</td>
                                                    <td className="py-3 pr-4 text-muted-foreground">
                                                        {roleLabels[inv.role] ?? inv.role}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}>
                                                            <StatusIcon className="h-3 w-3" />
                                                            {cfg.label}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 pr-4 text-muted-foreground">
                                                        {inv.inviter?.name ?? '-'}
                                                    </td>
                                                    <td className="py-3 pr-4 text-muted-foreground">
                                                        {formatDate(inv.sent_at)}
                                                    </td>
                                                    <td className="py-3 pr-4 text-muted-foreground">
                                                        {formatDate(inv.expires_at)}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            {isResendable && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    disabled={loading}
                                                                    onClick={() => handleResend(inv.id)}
                                                                    title="重新發送"
                                                                >
                                                                    {loading ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <RefreshCw className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            )}
                                                            {isPending && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    disabled={loading}
                                                                    onClick={() => handleCancel(inv.id)}
                                                                    className="text-destructive hover:text-destructive"
                                                                    title="取消邀請"
                                                                >
                                                                    {loading ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
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
            </div>

            {/* 發送邀請 Dialog */}
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>發送邀請</DialogTitle>
                        <DialogDescription>
                            輸入要邀請的電子郵件地址，可用換行、逗號或分號分隔多個地址
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>電子郵件地址</Label>
                            <textarea
                                rows={4}
                                placeholder={'user1@example.com\nuser2@example.com'}
                                value={emailsInput}
                                onChange={(e) => setEmailsInput(e.target.value)}
                                className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>角色</Label>
                            <SafeSelect value={role} onValueChange={setRole}>
                                <SafeSelectItem value="user">成員</SafeSelectItem>
                                <SafeSelectItem value="manager">主管</SafeSelectItem>
                                <SafeSelectItem value="admin">管理員</SafeSelectItem>
                            </SafeSelect>
                        </div>
                        {sendErrors.length > 0 && (
                            <div className="flex flex-col gap-1">
                                {sendErrors.map((e, i) => (
                                    <p key={i} className="text-sm text-destructive">{e}</p>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                                取消
                            </Button>
                            <Button disabled={sending} onClick={handleSendInvitations}>
                                {sending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        發送中...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-4 w-4" />
                                        發送邀請
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

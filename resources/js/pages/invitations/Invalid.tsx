import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Clock, XCircle } from 'lucide-react';

interface InvalidProps {
    reason: 'already_accepted' | 'expired' | 'cancelled';
}

const reasonConfig = {
    already_accepted: {
        icon: AlertCircle,
        title: '邀請已被接受',
        description: '此邀請連結已被使用，無法重複使用。',
        iconClass: 'text-blue-500',
    },
    expired: {
        icon: Clock,
        title: '邀請連結已過期',
        description: '此邀請連結已超過有效期限，請聯絡管理員重新發送邀請。',
        iconClass: 'text-yellow-500',
    },
    cancelled: {
        icon: XCircle,
        title: '邀請已取消',
        description: '此邀請已被取消，請聯絡管理員重新發送邀請。',
        iconClass: 'text-red-500',
    },
};

export default function Invalid({ reason }: InvalidProps) {
    const config = reasonConfig[reason] ?? reasonConfig.cancelled;
    const Icon = config.icon;

    return (
        <>
            <Head title="邀請無效" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
                <div className="w-full max-w-sm text-center">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800`}>
                        <Icon className={`h-8 w-8 ${config.iconClass}`} />
                    </div>
                    <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{config.title}</h1>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">{config.description}</p>
                    <Button asChild variant="outline">
                        <Link href="/">返回首頁</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

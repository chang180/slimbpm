import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

interface WrongAccountProps {
    invitation: {
        email: string;
        organization_name: string;
    };
}

export default function WrongAccount({ invitation }: WrongAccountProps) {
    return (
        <>
            <Head title="帳號不符" />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
                <div className="w-full max-w-sm text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">帳號不符</h1>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        此邀請是發送給 <strong>{invitation.email}</strong> 的。
                    </p>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        請先登出目前帳號，再使用正確的電子郵件帳號接受此邀請。
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => {
                                router.post('/logout', {}, {
                                    onSuccess: () => router.reload(),
                                });
                            }}
                        >
                            登出並重新登入
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/">返回首頁</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

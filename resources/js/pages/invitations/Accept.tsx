import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { Building2, CheckCircle2, Lock, User } from 'lucide-react';
import { type FormEventHandler } from 'react';

interface InvitationInfo {
    token: string;
    email: string;
    role: string;
    organization_name: string;
    inviter_name: string;
    expires_at: string | null;
}

interface AcceptProps {
    invitation: InvitationInfo;
    hasExistingAccount: boolean;
}

const roleLabels: Record<string, string> = {
    admin: '管理員',
    manager: '主管',
    user: '成員',
};

export default function Accept({ invitation, hasExistingAccount }: AcceptProps) {
    const registerForm = useForm({
        name: '',
        password: '',
        password_confirmation: '',
    });

    const loginForm = useForm({
        password: '',
    });

    const handleRegister: FormEventHandler = (e) => {
        e.preventDefault();
        registerForm.post(`/invitations/accept/${invitation.token}`);
    };

    const handleLogin: FormEventHandler = (e) => {
        e.preventDefault();
        loginForm.post(`/invitations/login/${invitation.token}`);
    };

    return (
        <>
            <Head title={`加入 ${invitation.organization_name}`} />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            您受邀加入
                        </h1>
                        <p className="mt-1 text-lg font-semibold text-blue-600 dark:text-blue-400">
                            {invitation.organization_name}
                        </p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {invitation.inviter_name} 邀請您以「{roleLabels[invitation.role] ?? invitation.role}」身份加入
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            {invitation.email}
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {hasExistingAccount ? '使用現有帳號登入' : '建立新帳號'}
                            </CardTitle>
                            <CardDescription>
                                {hasExistingAccount
                                    ? `請輸入 ${invitation.email} 的密碼來接受邀請`
                                    : '設定您的帳號資訊以加入組織'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hasExistingAccount ? (
                                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>電子郵件</Label>
                                        <Input value={invitation.email} disabled className="bg-muted" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="login-password">密碼</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="login-password"
                                                type="password"
                                                placeholder="輸入您的密碼"
                                                className="pl-9"
                                                value={loginForm.data.password}
                                                onChange={(e) => loginForm.setData('password', e.target.value)}
                                            />
                                        </div>
                                        {loginForm.errors.password && (
                                            <p className="text-sm text-destructive">{loginForm.errors.password}</p>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loginForm.processing}>
                                        {loginForm.processing ? '登入中...' : '登入並接受邀請'}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>電子郵件</Label>
                                        <Input value={invitation.email} disabled className="bg-muted" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="name">您的姓名</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                placeholder="請輸入您的姓名"
                                                className="pl-9"
                                                value={registerForm.data.name}
                                                onChange={(e) => registerForm.setData('name', e.target.value)}
                                            />
                                        </div>
                                        {registerForm.errors.name && (
                                            <p className="text-sm text-destructive">{registerForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="password">設定密碼</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="至少 8 個字元"
                                                className="pl-9"
                                                value={registerForm.data.password}
                                                onChange={(e) => registerForm.setData('password', e.target.value)}
                                            />
                                        </div>
                                        {registerForm.errors.password && (
                                            <p className="text-sm text-destructive">{registerForm.errors.password}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="password_confirmation">確認密碼</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                placeholder="再次輸入密碼"
                                                className="pl-9"
                                                value={registerForm.data.password_confirmation}
                                                onChange={(e) =>
                                                    registerForm.setData('password_confirmation', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={registerForm.processing}>
                                        {registerForm.processing ? '建立中...' : '建立帳號並加入'}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {invitation.expires_at && (
                        <p className="mt-4 text-center text-xs text-muted-foreground">
                            邀請連結有效期至{' '}
                            {new Date(invitation.expires_at).toLocaleDateString('zh-TW', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Lock, ArrowLeft, Users } from 'lucide-react';
import { route } from '@/lib/route';

interface Organization {
    name: string;
    slug: string;
}

interface PortalLoginProps {
    organization: Organization;
}

export default function PortalLogin({ organization }: PortalLoginProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('portal.login', { slug: organization.slug }));
    };

    return (
        <>
            <Head title={`${organization.name} - 員工登入`} />
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* 返回按鈕 */}
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            返回首頁
                        </Link>
                    </div>

                    <Card className="border-0 shadow-xl">
                        <CardHeader className="text-center pb-4">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold">
                                {organization.name}
                            </CardTitle>
                            <CardDescription className="flex items-center justify-center gap-2 mt-2">
                                <Users className="w-4 h-4" />
                                員工工作台
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <Label htmlFor="email">信箱</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1"
                                        placeholder="請輸入您的信箱"
                                        autoComplete="email"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">密碼</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-1"
                                        placeholder="請輸入您的密碼"
                                        autoComplete="current-password"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            checked={data.remember}
                                            onCheckedChange={(checked) => setData('remember', !!checked)}
                                        />
                                        <Label htmlFor="remember" className="text-sm">
                                            記住我
                                        </Label>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3"
                                >
                                    {processing ? '登入中...' : '登入工作台'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    管理員請使用{' '}
                                    <Link
                                        href={route('company.login', { slug: organization.slug })}
                                        className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium"
                                    >
                                        後台登入
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            還沒有企業帳號？{' '}
                            <Link
                                href={route('company.register')}
                                className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium"
                            >
                                立即註冊
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

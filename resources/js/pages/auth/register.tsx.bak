import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout
            title="建立新帳戶"
            description="加入 SlimBPM，開始您的工作流程數位化之旅"
        >
            <Head title="註冊 - SlimBPM" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    姓名
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="請輸入您的姓名"
                                        className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    電子郵件地址
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="請輸入您的電子郵件"
                                        className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    密碼
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="請設定您的密碼"
                                        className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    確認密碼
                                </Label>
                                <div className="relative">
                                    <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="請再次輸入密碼"
                                        className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Benefits List */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
                                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    註冊即可享受：
                                </h4>
                                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                    <li>• 免費使用表單設計器</li>
                                    <li>• 建立工作流程模板</li>
                                    <li>• 用戶與部門管理</li>
                                    <li>• 數據分析報表</li>
                                </ul>
                            </div>

                            {/* Register Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                tabIndex={5}
                                data-test="register-user-button"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                        建立帳戶中...
                                    </>
                                ) : (
                                    <>
                                        建立帳戶
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                已經有帳戶了？{' '}
                                <TextLink 
                                    href={login()} 
                                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    tabIndex={6}
                                >
                                    立即登入
                                </TextLink>
                            </p>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}

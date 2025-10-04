import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { route } from '@/lib/route';

export default function RegisterCompany() {
    const { data, setData, post, processing, errors } = useForm({
        // 企業資訊
        company_name: '',
        contact_person: '',
        contact_email: '',
        industry: '',
        
        // 管理員資訊
        admin_name: '',
        admin_email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('company.register'));
    };

    const industries = [
        '科技資訊',
        '製造業',
        '金融服務',
        '醫療保健',
        '教育培訓',
        '零售貿易',
        '建築工程',
        '物流運輸',
        '餐飲服務',
        '其他',
    ];

    return (
        <>
            <Head title="企業註冊" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
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

                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            企業註冊
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            為您的企業建立 SlimBPM 工作流程管理系統
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* 企業資訊 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    企業資訊
                                </CardTitle>
                                <CardDescription>
                                    請填寫您的企業基本資訊
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="company_name">公司名稱 *</Label>
                                    <Input
                                        id="company_name"
                                        type="text"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        className="mt-1"
                                        placeholder="請輸入公司名稱"
                                    />
                                    {errors.company_name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.company_name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="contact_person">聯絡人姓名 *</Label>
                                    <Input
                                        id="contact_person"
                                        type="text"
                                        value={data.contact_person}
                                        onChange={(e) => setData('contact_person', e.target.value)}
                                        className="mt-1"
                                        placeholder="請輸入聯絡人姓名"
                                    />
                                    {errors.contact_person && (
                                        <p className="text-sm text-red-600 mt-1">{errors.contact_person}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="contact_email">聯絡人信箱 *</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        className="mt-1"
                                        placeholder="請輸入聯絡人信箱"
                                    />
                                    {errors.contact_email && (
                                        <p className="text-sm text-red-600 mt-1">{errors.contact_email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="industry">所屬行業</Label>
                                    <Select value={data.industry} onValueChange={(value) => setData('industry', value)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="請選擇所屬行業" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industries.map((industry) => (
                                                <SelectItem key={industry} value={industry}>
                                                    {industry}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.industry && (
                                        <p className="text-sm text-red-600 mt-1">{errors.industry}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 管理員帳號 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    管理員帳號
                                </CardTitle>
                                <CardDescription>
                                    設定企業管理員的登入資訊
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="admin_name">管理員姓名 *</Label>
                                    <Input
                                        id="admin_name"
                                        type="text"
                                        value={data.admin_name}
                                        onChange={(e) => setData('admin_name', e.target.value)}
                                        className="mt-1"
                                        placeholder="請輸入管理員姓名"
                                    />
                                    {errors.admin_name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.admin_name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="admin_email">管理員信箱 *</Label>
                                    <Input
                                        id="admin_email"
                                        type="email"
                                        value={data.admin_email}
                                        onChange={(e) => setData('admin_email', e.target.value)}
                                        className="mt-1"
                                        placeholder="請輸入管理員信箱"
                                    />
                                    {errors.admin_email && (
                                        <p className="text-sm text-red-600 mt-1">{errors.admin_email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">密碼 *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-1"
                                        placeholder="請輸入密碼"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">確認密碼 *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="mt-1"
                                        placeholder="請再次輸入密碼"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-600 mt-1">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 註冊按鈕 */}
                    <div className="mt-8 text-center">
                        <Button
                            onClick={submit}
                            disabled={processing}
                            className="w-full md:w-auto px-8 py-3 text-lg"
                        >
                            {processing ? '註冊中...' : '建立企業帳號'}
                        </Button>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                            註冊後您將獲得：
                            <br />
                            • 企業後台管理系統
                            <br />
                            • 企業前台用戶系統
                            <br />
                            • 專屬的登入網址
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

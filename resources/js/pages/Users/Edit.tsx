import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeSelect, SafeSelectItem } from '@/components/ui/safe-select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Key } from 'lucide-react';

interface Department {
    id: number;
    name: string;
}

interface Organization {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    organization_id?: number;
    departments: Array<{
        id: number;
        name: string;
    }>;
}

interface UsersEditProps {
    user: User;
    departments: Department[];
    organizations: Organization[];
    errors?: Record<string, string>;
}

const UsersEdit: React.FC<UsersEditProps> = ({ user, departments, organizations, errors = {} }) => {
    const { data, setData, reset } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        organization_id: user.organization_id?.toString() ?? '',
        role: user.role,
        is_active: user.is_active,
        departments: user.departments.map(d => d.id),
    });

    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submitData = {
            ...data,
            organization_id: data.organization_id === '' ? null : data.organization_id,
        };
        router.put(`/users/${user.id}`, submitData, {
            preserveState: true,
            onSuccess: () => reset(),
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleDepartmentChange = (departmentId: number, checked: boolean) => {
        if (checked) {
            setData('departments', [...data.departments, departmentId]);
        } else {
            setData('departments', data.departments.filter(id => id !== departmentId));
        }
    };

    return (
        <AppLayout>
            <Head title={`編輯用戶 - ${user.name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/users">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                返回
                            </Link>
                        </Button>
                        <h2 className="font-semibold text-xl leading-tight">
                            編輯用戶 - {user.name}
                        </h2>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>用戶資訊</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* 基本資訊 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">姓名 *</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">電子郵件 *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* 密碼重設 */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>密碼重設</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowPasswordFields(!showPasswordFields)}
                                        >
                                            <Key className="w-4 h-4 mr-2" />
                                            {showPasswordFields ? '取消重設' : '重設密碼'}
                                        </Button>
                                    </div>

                                    {showPasswordFields && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                                            <div>
                                                <Label htmlFor="password">新密碼</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className={errors.password ? 'border-red-500' : ''}
                                                />
                                                {errors.password && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="password_confirmation">確認新密碼</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className={errors.password_confirmation ? 'border-red-500' : ''}
                                                />
                                                {errors.password_confirmation && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 組織和角色 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="organization_id">組織</Label>
                                        <SafeSelect
                                            value={data.organization_id}
                                            onValueChange={(value) => setData('organization_id', value)}
                                            placeholder="選擇組織"
                                        >
                                            <SafeSelectItem value="">無</SafeSelectItem>
                                            {organizations.map((org) => (
                                                <SafeSelectItem key={org.id} value={org.id.toString()}>
                                                    {org.name}
                                                </SafeSelectItem>
                                            ))}
                                        </SafeSelect>
                                        {errors.organization_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.organization_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="role">角色 *</Label>
                                        <SafeSelect
                                            value={data.role}
                                            onValueChange={(value) => setData('role', value)}
                                            placeholder="選擇角色"
                                        >
                                            <SafeSelectItem value="user">用戶</SafeSelectItem>
                                            <SafeSelectItem value="manager">主管</SafeSelectItem>
                                            <SafeSelectItem value="admin">管理員</SafeSelectItem>
                                        </SafeSelect>
                                        {errors.role && (
                                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                                        )}
                                    </div>
                                </div>

                                {/* 部門選擇 */}
                                <div>
                                    <Label>部門</Label>
                                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                                        {departments.map((dept) => (
                                            <div key={dept.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`dept-${dept.id}`}
                                                    checked={data.departments.includes(dept.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleDepartmentChange(dept.id, checked as boolean)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`dept-${dept.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {dept.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.departments && (
                                        <p className="mt-1 text-sm text-red-600">{errors.departments}</p>
                                    )}
                                </div>

                                {/* 狀態 */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <Label
                                        htmlFor="is_active"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        啟用此用戶
                                    </Label>
                                </div>

                                {/* 提交按鈕 */}
                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/users">取消</Link>
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSubmitting ? '更新中...' : '更新用戶'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default UsersEdit;

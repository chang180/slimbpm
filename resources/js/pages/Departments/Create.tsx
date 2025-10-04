import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Department } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';

interface DepartmentsCreateProps extends PageProps {
    departments: Department[];
}

const DepartmentsCreate: React.FC<DepartmentsCreateProps> = ({ auth, departments }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        parent_id: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/departments', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const renderDepartmentOptions = (depts: Department[], level: number = 0): JSX.Element[] => {
        const options: JSX.Element[] = [];

        depts.forEach(dept => {
            options.push(
                <SelectItem key={dept.id} value={dept.id.toString()}>
                    {'\u00A0'.repeat(level * 4)}{dept.name}
                </SelectItem>
            );

            if (dept.children && dept.children.length > 0) {
                options.push(...renderDepartmentOptions(dept.children, level + 1));
            }
        });

        return options;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/departments">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            返回
                        </Link>
                    </Button>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        新增部門
                    </h2>
                </div>
            }
        >
            <Head title="新增部門" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>部門資訊</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* 部門名稱 */}
                                <div>
                                    <Label htmlFor="name">部門名稱 *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        placeholder="請輸入部門名稱"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* 部門描述 */}
                                <div>
                                    <Label htmlFor="description">部門描述</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                        placeholder="請輸入部門描述（選填）"
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* 上級部門 */}
                                <div>
                                    <Label htmlFor="parent_id">上級部門</Label>
                                    <Select
                                        value={data.parent_id}
                                        onValueChange={(value) => setData('parent_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="選擇上級部門（可選）" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">無（頂層部門）</SelectItem>
                                            {renderDepartmentOptions(departments)}
                                        </SelectContent>
                                    </Select>
                                    {errors.parent_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.parent_id}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        若不選擇，則此部門為頂層部門
                                    </p>
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
                                        啟用此部門
                                    </Label>
                                </div>

                                {/* 提交按鈕 */}
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href="/departments">取消</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? '建立中...' : '建立部門'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DepartmentsCreate;

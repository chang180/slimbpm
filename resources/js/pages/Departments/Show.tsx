import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Department } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Building, Users, Calendar } from 'lucide-react';

interface DepartmentsShowProps extends PageProps {
    department: Department;
}

const DepartmentsShow: React.FC<DepartmentsShowProps> = ({ auth, department }) => {
    const renderDepartmentTree = (dept: Department, level: number = 0) => {
        return (
            <div key={dept.id} style={{ marginLeft: `${level * 1.5}rem` }} className="mb-2">
                <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{dept.name}</span>
                    <Badge variant="outline" className="ml-auto">
                        {dept.users_count || 0} 成員
                    </Badge>
                </div>
                {dept.children && dept.children.length > 0 && (
                    <div className="mt-2">
                        {dept.children.map(child => renderDepartmentTree(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/departments">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                返回
                            </Link>
                        </Button>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            部門詳情 - {department.name}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/departments/${department.id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                編輯
                            </Link>
                        </Button>
                        <Button variant="destructive" asChild>
                            <Link href={`/departments/${department.id}`} method="delete" as="button">
                                <Trash2 className="w-4 h-4 mr-2" />
                                刪除
                            </Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={`部門詳情 - ${department.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 左側：部門基本資訊 */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="w-5 h-5" />
                                        部門資訊
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{department.name}</h3>
                                        {department.description && (
                                            <p className="text-gray-600 text-sm">{department.description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={department.is_active ? 'default' : 'secondary'}>
                                                {department.is_active ? '啟用' : '停用'}
                                            </Badge>
                                        </div>

                                        {department.parent && (
                                            <div>
                                                <label className="text-sm text-gray-500">上級部門</label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Building className="w-4 h-4 text-gray-500" />
                                                    <Link href={`/departments/${department.parent.id}`} className="text-blue-600 hover:underline">
                                                        {department.parent.name}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-sm text-gray-500">成員數量</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Users className="w-4 h-4 text-gray-500" />
                                                <span>{department.users_count || 0} 人</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm text-gray-500">建立時間</label>
                                            <div className="flex items-center gap-2 mt-1 text-sm">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span>{new Date(department.created_at).toLocaleDateString('zh-TW')}</span>
                                            </div>
                                        </div>

                                        {department.updated_at !== department.created_at && (
                                            <div>
                                                <label className="text-sm text-gray-500">最後更新</label>
                                                <div className="flex items-center gap-2 mt-1 text-sm">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    <span>{new Date(department.updated_at).toLocaleDateString('zh-TW')}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 右側：詳細資訊 */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="members" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="members">成員</TabsTrigger>
                                    <TabsTrigger value="subdepartments">子部門</TabsTrigger>
                                </TabsList>

                                <TabsContent value="members" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>部門成員</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {department.users && department.users.length > 0 ? (
                                                <div className="space-y-2">
                                                    {department.users.map((user) => (
                                                        <div
                                                            key={user.id}
                                                            className="flex items-center justify-between p-3 border rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                                    <span className="text-sm font-bold text-gray-600">
                                                                        {user.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">{user.name}</p>
                                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                                </div>
                                                            </div>
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link href={`/users/${user.id}`}>查看</Link>
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                    <p>此部門尚未有成員</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="subdepartments" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>子部門</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {department.children && department.children.length > 0 ? (
                                                <div className="space-y-2">
                                                    {department.children.map(child => renderDepartmentTree(child))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                    <p>此部門尚未有子部門</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DepartmentsShow;

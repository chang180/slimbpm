import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, Building, Users } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'user';
    is_active: boolean;
    organization?: {
        id: number;
        name: string;
    };
    departments: Array<{
        id: number;
        name: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface UsersShowProps extends PageProps {
    user: User;
}

const UsersShow: React.FC<UsersShowProps> = ({ auth, user }) => {
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'manager':
                return 'bg-blue-100 text-blue-800';
            case 'user':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return '管理員';
            case 'manager':
                return '主管';
            case 'user':
                return '用戶';
            default:
                return role;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/users">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                返回
                            </Link>
                        </Button>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            用戶詳情 - {user.name}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/users/${user.id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                編輯
                            </Link>
                        </Button>
                        <Button variant="destructive" asChild>
                            <Link href={`/users/${user.id}`} method="delete" as="button">
                                <Trash2 className="w-4 h-4 mr-2" />
                                刪除
                            </Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={`用戶詳情 - ${user.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 左側：用戶基本資訊 */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        用戶資訊
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-gray-600">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold">{user.name}</h3>
                                        <p className="text-gray-600">{user.email}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Badge className={getRoleBadgeColor(user.role)}>
                                                {getRoleLabel(user.role)}
                                            </Badge>
                                            <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                                {user.is_active ? '啟用' : '停用'}
                                            </Badge>
                                        </div>

                                        {user.organization && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building className="w-4 h-4 text-gray-500" />
                                                <span>{user.organization.name}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span>建立於 {new Date(user.created_at).toLocaleDateString('zh-TW')}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 右側：詳細資訊 */}
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="departments" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="departments">部門</TabsTrigger>
                                    <TabsTrigger value="permissions">權限</TabsTrigger>
                                    <TabsTrigger value="activity">活動</TabsTrigger>
                                </TabsList>

                                <TabsContent value="departments" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>所屬部門</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {user.departments.length > 0 ? (
                                                <div className="space-y-2">
                                                    {user.departments.map((dept) => (
                                                        <div
                                                            key={dept.id}
                                                            className="flex items-center justify-between p-3 border rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Building className="w-4 h-4 text-gray-500" />
                                                                <span className="font-medium">{dept.name}</span>
                                                            </div>
                                                            <Badge variant="outline">成員</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                    <p>此用戶尚未分配到任何部門</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="permissions" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>權限設定</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium mb-2">角色權限</h4>
                                                    <div className="space-y-2">
                                                        {user.role === 'admin' && (
                                                            <div className="flex items-center gap-2">
                                                                <Badge className="bg-red-100 text-red-800">管理員</Badge>
                                                                <span className="text-sm text-gray-600">擁有所有權限</span>
                                                            </div>
                                                        )}
                                                        {user.role === 'manager' && (
                                                            <div className="flex items-center gap-2">
                                                                <Badge className="bg-blue-100 text-blue-800">主管</Badge>
                                                                <span className="text-sm text-gray-600">可管理部門成員</span>
                                                            </div>
                                                        )}
                                                        {user.role === 'user' && (
                                                            <div className="flex items-center gap-2">
                                                                <Badge className="bg-green-100 text-green-800">用戶</Badge>
                                                                <span className="text-sm text-gray-600">基本用戶權限</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-2">系統權限</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={user.is_active}
                                                                disabled
                                                                className="rounded border-gray-300"
                                                            />
                                                            <span className="text-sm">帳號啟用</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="activity" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>最近活動</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">帳號建立</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(user.created_at).toLocaleString('zh-TW')}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">最後更新</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(user.updated_at).toLocaleString('zh-TW')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {user.departments.length > 0 && (
                                                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">加入部門</p>
                                                            <p className="text-xs text-gray-500">
                                                                分配到 {user.departments.map(d => d.name).join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
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

export default UsersShow;

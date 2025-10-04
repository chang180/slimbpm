import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SafeSelect, SafeSelectItem } from '@/components/ui/safe-select';
import { Search, Plus, Edit, Trash2, Eye, Download, Filter } from 'lucide-react';

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
    departments?: Array<{
        id: number;
        name: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface UsersIndexProps extends PageProps {
    users: {
        data: User[];
        links: any[];
        meta: any;
    };
    filters: {
        search: string;
        role: string;
        status: string;
    };
}

const UsersIndex: React.FC<UsersIndexProps> = ({ auth, users, filters }) => {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

    const handleSearch = () => {
        router.get('/users', {
            search,
            role: roleFilter === '' ? '' : roleFilter,
            status: statusFilter === '' ? '' : statusFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (userId: number) => {
        if (confirm('確定要刪除此用戶嗎？')) {
            router.delete(`/users/${userId}`, {
                onSuccess: () => {
                    // 重新載入頁面
                    router.reload();
                },
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedUsers.length === 0) return;
        
        if (confirm(`確定要刪除選中的 ${selectedUsers.length} 個用戶嗎？`)) {
            // 批量刪除邏輯
            selectedUsers.forEach(userId => {
                router.delete(`/users/${userId}`, {
                    onSuccess: () => {
                        setSelectedUsers([]);
                    },
                });
            });
        }
    };

    const handleSelectUser = (userId: number, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(users.data.map(user => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

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
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        用戶管理
                    </h2>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/users/create">
                                <Plus className="w-4 h-4 mr-2" />
                                新增用戶
                            </Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="用戶管理" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* 搜尋和篩選 */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                搜尋和篩選
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        搜尋
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="搜尋用戶名稱或電子郵件"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        角色
                                    </label>
                                    <SafeSelect value={roleFilter} onValueChange={setRoleFilter} placeholder="選擇角色">
                                        <SafeSelectItem value="">全部角色</SafeSelectItem>
                                        <SafeSelectItem value="admin">管理員</SafeSelectItem>
                                        <SafeSelectItem value="manager">主管</SafeSelectItem>
                                        <SafeSelectItem value="user">用戶</SafeSelectItem>
                                    </SafeSelect>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        狀態
                                    </label>
                                    <SafeSelect value={statusFilter} onValueChange={setStatusFilter} placeholder="選擇狀態">
                                        <SafeSelectItem value="">全部狀態</SafeSelectItem>
                                        <SafeSelectItem value="active">啟用</SafeSelectItem>
                                        <SafeSelectItem value="inactive">停用</SafeSelectItem>
                                    </SafeSelect>
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={handleSearch} className="w-full">
                                        <Search className="w-4 h-4 mr-2" />
                                        搜尋
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 批量操作 */}
                    {selectedUsers.length > 0 && (
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        已選擇 {selectedUsers.length} 個用戶
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleBulkDelete}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            批量刪除
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedUsers([])}
                                        >
                                            取消選擇
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* 用戶列表 */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>用戶列表</CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        匯出
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.length === users.data.length && users.data.length > 0}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                    className="rounded border-gray-300"
                                                />
                                            </TableHead>
                                            <TableHead>姓名</TableHead>
                                            <TableHead>電子郵件</TableHead>
                                            <TableHead>角色</TableHead>
                                            <TableHead>組織</TableHead>
                                            <TableHead>部門</TableHead>
                                            <TableHead>狀態</TableHead>
                                            <TableHead>建立時間</TableHead>
                                            <TableHead className="text-right">操作</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                                                        className="rounded border-gray-300"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge className={getRoleBadgeColor(user.role)}>
                                                        {getRoleLabel(user.role)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.organization?.name || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {user.departments?.map(dept => dept.name).join(', ') || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                                        {user.is_active ? '啟用' : '停用'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(user.created_at).toLocaleDateString('zh-TW')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link href={`/users/${user.id}`}>
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link href={`/users/${user.id}/edit`}>
                                                                <Edit className="w-4 h-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* 分頁 */}
                            {users.meta && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-600">
                                        顯示 {users.meta.from} 到 {users.meta.to} 共 {users.meta.total} 筆記錄
                                    </div>
                                    <div className="flex gap-2">
                                        {users.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                            >
                                                {link.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default UsersIndex;

import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps, Department } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Eye, Filter, ChevronRight, ChevronDown, Users } from 'lucide-react';

interface DepartmentsIndexProps extends PageProps {
    departments: Department[];
    filters: {
        search?: string;
        status?: string;
    };
}

const DepartmentsIndex: React.FC<DepartmentsIndexProps> = ({ auth, departments, filters }) => {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [expandedDepts, setExpandedDepts] = useState<Set<number>>(new Set());

    const handleSearch = () => {
        router.get('/departments', {
            search,
            status: statusFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (departmentId: number, departmentName: string) => {
        if (confirm(`確定要刪除 "${departmentName}" 部門嗎？`)) {
            router.delete(`/departments/${departmentId}`, {
                onSuccess: () => {
                    router.reload();
                },
            });
        }
    };

    const toggleExpand = (deptId: number) => {
        const newExpanded = new Set(expandedDepts);
        if (newExpanded.has(deptId)) {
            newExpanded.delete(deptId);
        } else {
            newExpanded.add(deptId);
        }
        setExpandedDepts(newExpanded);
    };

    const renderDepartmentRow = (dept: Department, level: number = 0) => {
        const hasChildren = dept.children && dept.children.length > 0;
        const isExpanded = expandedDepts.has(dept.id);

        return (
            <React.Fragment key={dept.id}>
                <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                        <div className="flex items-center" style={{ paddingLeft: `${level * 2}rem` }}>
                            {hasChildren ? (
                                <button
                                    onClick={() => toggleExpand(dept.id)}
                                    className="mr-2 p-1 hover:bg-gray-200 rounded"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </button>
                            ) : (
                                <span className="mr-2 w-6" />
                            )}
                            <span className="font-medium">{dept.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        {dept.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                        {dept.parent?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{dept.users_count || 0}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <Badge variant={dept.is_active ? 'default' : 'secondary'}>
                            {dept.is_active ? '啟用' : '停用'}
                        </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                            >
                                <Link href={`/departments/${dept.id}`}>
                                    <Eye className="w-4 h-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                            >
                                <Link href={`/departments/${dept.id}/edit`}>
                                    <Edit className="w-4 h-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(dept.id, dept.name)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </td>
                </tr>
                {hasChildren && isExpanded && dept.children!.map(child => renderDepartmentRow(child, level + 1))}
            </React.Fragment>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        部門管理
                    </h2>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/departments/create">
                                <Plus className="w-4 h-4 mr-2" />
                                新增部門
                            </Link>
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="部門管理" />

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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        搜尋
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="搜尋部門名稱或描述"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        狀態
                                    </label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="選擇狀態" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">全部狀態</SelectItem>
                                            <SelectItem value="active">啟用</SelectItem>
                                            <SelectItem value="inactive">停用</SelectItem>
                                        </SelectContent>
                                    </Select>
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

                    {/* 部門列表 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>部門列表</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                部門名稱
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                描述
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                上級部門
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                成員數量
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                狀態
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                操作
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {departments.length > 0 ? (
                                            departments.map(dept => renderDepartmentRow(dept))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                    {search || statusFilter ? '未找到符合條件的部門' : '尚未建立任何部門'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DepartmentsIndex;

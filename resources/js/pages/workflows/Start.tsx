import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, GitBranch, Loader2, Play, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface WorkflowTemplateSummary {
    id: number;
    name: string;
    description: string | null;
    version: string;
}

interface WorkflowsStartProps {
    templates: WorkflowTemplateSummary[];
    selectedTemplateId: number | null;
}

export default function WorkflowsStart({ templates, selectedTemplateId }: WorkflowsStartProps) {
    const breadcrumbs = useMemo<BreadcrumbItem[]>(
        () => [
            { title: '儀表板', href: '/dashboard' },
            { title: '工作流程', href: '/workflows' },
            { title: '發起申請', href: '/workflows/start' },
        ],
        [],
    );

    const [selectedId, setSelectedId] = useState<number | null>(selectedTemplateId);
    const [title, setTitle] = useState('');
    const [search, setSearch] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; template_id?: string }>({});

    const filtered = templates.filter(
        (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            (t.description ?? '').toLowerCase().includes(search.toLowerCase()),
    );

    const selectedTemplate = templates.find((t) => t.id === selectedId) ?? null;

    const handleSubmit = () => {
        const newErrors: typeof errors = {};

        if (!selectedId) {
            newErrors.template_id = '請選擇工作流程模板';
        }

        if (!title.trim()) {
            newErrors.title = '請填寫申請標題';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setSubmitting(true);
        setErrors({});

        router.post(
            '/api/v1/workflow-instances',
            { template_id: selectedId, title: title.trim() },
            {
                onSuccess: (page) => {
                    const data = page.props as Record<string, unknown>;
                    const id = (data?.data as Record<string, unknown>)?.id;
                    if (id) {
                        router.visit(`/workflows/${id}`);
                    } else {
                        router.visit('/workflows');
                    }
                },
                onError: (errs) => {
                    setErrors(errs as typeof errors);
                    setSubmitting(false);
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="發起工作流程申請" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.visit('/workflows')}>
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        返回
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">發起申請</h1>
                        <p className="text-sm text-muted-foreground">選擇流程模板並填寫申請資訊</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    {/* 左側：模板選擇 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>選擇工作流程模板</CardTitle>
                            <CardDescription>請選擇適合您申請的流程類型</CardDescription>
                            <div className="relative mt-2">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="搜尋模板..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {errors.template_id && (
                                <p className="mb-3 text-sm text-destructive">{errors.template_id}</p>
                            )}

                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <GitBranch className="mb-3 h-8 w-8 opacity-30" />
                                    <p className="text-sm">
                                        {templates.length === 0
                                            ? '目前沒有可用的工作流程模板，請聯絡管理員建立模板'
                                            : '找不到符合條件的模板'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {filtered.map((template) => {
                                        const isSelected = selectedId === template.id;
                                        return (
                                            <button
                                                key={template.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedId(template.id);
                                                    setErrors((e) => ({ ...e, template_id: undefined }));
                                                    if (!title) {
                                                        setTitle(template.name + ' 申請');
                                                    }
                                                }}
                                                className={`group flex flex-col items-start gap-1.5 rounded-lg border p-4 text-left transition-colors ${
                                                    isSelected
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                        : 'border-border hover:border-primary/50 hover:bg-muted/30'
                                                }`}
                                            >
                                                <div className="flex w-full items-center justify-between gap-2">
                                                    <span className="font-medium">{template.name}</span>
                                                    <Badge variant="secondary" className="shrink-0 text-xs">
                                                        v{template.version}
                                                    </Badge>
                                                </div>
                                                {template.description && (
                                                    <p className="line-clamp-2 text-xs text-muted-foreground">
                                                        {template.description}
                                                    </p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 右側：申請資訊 */}
                    <div className="flex flex-col gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>申請資訊</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="title">申請標題 *</Label>
                                    <Input
                                        id="title"
                                        placeholder="例：2024年12月請假申請"
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            setErrors((e2) => ({ ...e2, title: undefined }));
                                        }}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                {selectedTemplate && (
                                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                                        <div className="font-medium text-foreground">{selectedTemplate.name}</div>
                                        {selectedTemplate.description && (
                                            <div className="mt-1 text-muted-foreground">
                                                {selectedTemplate.description}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Button
                            size="lg"
                            className="w-full"
                            disabled={submitting || !selectedId || !title.trim()}
                            onClick={handleSubmit}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    提交中...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    發起申請
                                </>
                            )}
                        </Button>

                        <p className="text-center text-xs text-muted-foreground">
                            提交後流程將立即啟動，您可以在「我的申請」中查看進度
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

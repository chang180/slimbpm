import AppLayout from '@/layouts/app-layout';
import WorkflowDesigner from '@/components/workflow-designer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createEmptyWorkflowDefinition } from '@/hooks/use-workflow-designer';
import { type BreadcrumbItem } from '@/types';
import { type WorkflowDefinition, type WorkflowTemplate } from '@/types/workflow';
import { Head, useForm } from '@inertiajs/react';
import { type FormEvent, useMemo, useRef, useState } from 'react';

interface WorkflowDesignerPageProps {
    workflow?: WorkflowTemplate | null;
    canEdit?: boolean;
}

interface WorkflowFormData {
    name: string;
    description: string;
    definition: string;
}

export default function WorkflowDesignerPage({
    workflow,
    canEdit = true,
}: WorkflowDesignerPageProps) {
    const isEditing = Boolean(workflow?.id);

    const breadcrumbs = useMemo<BreadcrumbItem[]>(
        () => [
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Workflow Designer', href: '/workflows/designer' },
        ],
        [],
    );

    const initialDefinition = useMemo<WorkflowDefinition>(
        () => workflow?.definition ?? createEmptyWorkflowDefinition(),
        [workflow?.definition],
    );

    const hasInitialisedDefinition = useRef(false);
    const [designerDirty, setDesignerDirty] = useState(false);

    const form = useForm<WorkflowFormData>({
        name: workflow?.name ?? '',
        description: workflow?.description ?? '',
        definition: JSON.stringify(initialDefinition),
    });

    const handleDefinitionChange = (definition: WorkflowDefinition) => {
        form.setData('definition', JSON.stringify(definition));

        if (!hasInitialisedDefinition.current) {
            hasInitialisedDefinition.current = true;
            return;
        }

        setDesignerDirty(true);
    };

    const submitDefinition = async (definition: WorkflowDefinition) => {
        form.setData('definition', JSON.stringify(definition));
        setDesignerDirty(false);

        if (isEditing && workflow) {
            await form.put(`/api/v1/workflows/${workflow.id}`, {
                preserveScroll: true,
            });
        } else {
            await form.post('/api/v1/workflows', {
                preserveScroll: true,
            });
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isEditing && workflow) {
            form.put(`/api/v1/workflows/${workflow.id}`, {
                preserveScroll: true,
            });
        } else {
            form.post('/api/v1/workflows', {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? `Edit ${workflow?.name ?? 'Workflow'}` : 'New Workflow'} />
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <Card>
                        <CardHeader className="border-b border-border/60 py-3">
                            <CardTitle className="text-base font-semibold">
                                Template Details
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Provide a name and description for this workflow template.
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 p-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="workflow-name">Workflow name</Label>
                                <Input
                                    id="workflow-name"
                                    value={form.data.name}
                                    disabled={!canEdit}
                                    onChange={(event) => form.setData('name', event.target.value)}
                                    placeholder="e.g. Purchase Approval"
                                />
                                {form.errors.name ? (
                                    <p className="text-sm text-destructive">{form.errors.name}</p>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="workflow-description">Description</Label>
                                <textarea
                                    id="workflow-description"
                                    value={form.data.description ?? ''}
                                    disabled={!canEdit}
                                    onChange={(event) => form.setData('description', event.target.value)}
                                    className="min-h-[120px] rounded-md border border-border/70 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Describe how this workflow should be used"
                                />
                                {form.errors.description ? (
                                    <p className="text-sm text-destructive">{form.errors.description}</p>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs uppercase text-muted-foreground">
                                    {designerDirty ? 'Canvas has unsaved changes' : 'Canvas is synced'}
                                </div>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!canEdit || form.processing}
                                >
                                    {form.processing ? 'Saving…' : isEditing ? 'Update Template' : 'Create Template'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="min-w-0">
                        <WorkflowDesigner
                            definition={initialDefinition}
                            onDefinitionChange={handleDefinitionChange}
                            onSave={canEdit ? submitDefinition : undefined}
                            readOnly={!canEdit}
                            isSaving={form.processing}
                        />
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}

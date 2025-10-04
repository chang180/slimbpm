import { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Handle,
    MiniMap,
    NodeProps,
    Panel,
    Position,
    ReactFlowProvider,
    type Connection,
    type EdgeChange,
    type NodeChange,
    type OnSelectionChangeParams,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    createEmptyWorkflowDefinition,
    useWorkflowDesigner,
} from '@/hooks/use-workflow-designer';
import {
    type WorkflowDefinition,
    type WorkflowNode,
    type WorkflowNodeData,
    type WorkflowNodeType,
} from '@/types/workflow';

const nodeTypeStyles: Record<WorkflowNodeType, string> = {
    start: 'bg-emerald-500/10 border-emerald-400 text-emerald-600 dark:text-emerald-300',
    approval: 'bg-sky-500/10 border-sky-400 text-sky-500 dark:text-sky-300',
    condition: 'bg-amber-500/10 border-amber-400 text-amber-600 dark:text-amber-300',
    end: 'bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-300',
};

const WorkflowNodeComponent = ({ data, type }: NodeProps<WorkflowNodeData>) => {
    const nodeStyle =
        type && type in nodeTypeStyles
            ? nodeTypeStyles[type as WorkflowNodeType]
            : nodeTypeStyles.approval;

    return (
        <div className={cn('min-w-44 rounded-lg border px-4 py-3 text-sm shadow-sm transition-all', nodeStyle)}>
            <div className="font-medium capitalize">{type}</div>
            <div className="mt-1 text-base font-semibold text-foreground dark:text-neutral-100">
                {data.label}
            </div>
            {data.description ? (
                <p className="mt-1 text-xs text-muted-foreground">{data.description}</p>
            ) : null}
            {type !== 'start' ? <Handle type="target" position={Position.Left} /> : null}
            {type !== 'end' ? <Handle type="source" position={Position.Right} /> : null}
        </div>
    );
};

const nodeTypes = {
    start: WorkflowNodeComponent,
    approval: WorkflowNodeComponent,
    condition: WorkflowNodeComponent,
    end: WorkflowNodeComponent,
};

interface WorkflowDesignerProps {
    definition?: WorkflowDefinition | null;
    onSave?: (definition: WorkflowDefinition) => Promise<void> | void;
    onDefinitionChange?: (definition: WorkflowDefinition) => void;
    readOnly?: boolean;
    isSaving?: boolean;
}

const palette: Array<{ type: WorkflowNodeType; label: string }> = [
    { type: 'approval', label: 'Approval' },
    { type: 'condition', label: 'Condition' },
    { type: 'end', label: 'End' },
];

export function WorkflowDesigner({
    definition,
    onSave,
    onDefinitionChange,
    readOnly = false,
    isSaving = false,
}: WorkflowDesignerProps) {
    const initialised = useRef(false);
    const metadata = useRef<Record<string, string | number | boolean | null>>(definition?.metadata ?? {});

    const {
        nodes,
        edges,
        isDirty,
        selectedNodeId,
        setDefinition,
        setNodes,
        setEdges,
        addNode,
        updateNodeLabel,
        updateNodeDescription,
        updateNodeConfig,
        removeNode,
        connectNodes,
        selectNode,
    } = useWorkflowDesigner((store) => ({
        nodes: store.nodes,
        edges: store.edges,
        isDirty: store.isDirty,
        selectedNodeId: store.selectedNodeId,
        setDefinition: store.setDefinition,
        setNodes: store.setNodes,
        setEdges: store.setEdges,
        addNode: store.addNode,
        updateNodeLabel: store.updateNodeLabel,
        updateNodeDescription: store.updateNodeDescription,
        updateNodeConfig: store.updateNodeConfig,
        removeNode: store.removeNode,
        connectNodes: store.connectNodes,
        selectNode: store.selectNode,
    }));

    useEffect(() => {
        if (!initialised.current) {
            setDefinition(definition ?? createEmptyWorkflowDefinition());
            initialised.current = true;
        }
    }, [definition, setDefinition]);

    useEffect(() => {
        if (definition?.metadata) {
            metadata.current = definition.metadata;
        }
    }, [definition?.metadata]);

    useEffect(() => {
        if (!onDefinitionChange) {
            return;
        }

        onDefinitionChange({
            nodes,
            edges,
            metadata: metadata.current,
        });
    }, [nodes, edges, onDefinitionChange]);

    const selectedNode = useMemo(
        () => nodes.find((node) => node.id === selectedNodeId) ?? null,
        [nodes, selectedNodeId],
    );

    const handleNodesChange = useCallback(
        (changes: NodeChange[]) => {
            if (!readOnly) {
                setNodes(changes);
            }
        },
        [setNodes, readOnly],
    );

    const handleEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            if (!readOnly) {
                setEdges(changes);
            }
        },
        [setEdges, readOnly],
    );

    const handleConnect = useCallback(
        (connection: Connection) => {
            if (!readOnly) {
                connectNodes(connection);
            }
        },
        [connectNodes, readOnly],
    );

    const handleSelectionChange = useCallback(
        (params: OnSelectionChangeParams) => {
            if (!readOnly) {
                selectNode(params.nodes.at(-1)?.id ?? null);
            }
        },
        [selectNode, readOnly],
    );

    const handleAddNode = useCallback(
        (type: WorkflowNodeType) => {
            if (readOnly) {
                return;
            }

            addNode(type, {
                x: 320,
                y: 120 + nodes.length * 90,
            });
        },
        [addNode, nodes.length, readOnly],
    );

    const handleSave = useCallback(async () => {
        if (!onSave) {
            return;
        }

        const payload: WorkflowDefinition = {
            nodes,
            edges,
            metadata: metadata.current,
        };

        await Promise.resolve(onSave(payload));
        setDefinition(payload);
    }, [onSave, nodes, edges, setDefinition]);

    return (
        <ReactFlowProvider>
            <div className="flex h-[72vh] min-h-[28rem] gap-4">
                <Card className="flex-1 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/60 bg-muted/50 py-3">
                        <div>
                            <CardTitle className="text-base font-semibold">Workflow Canvas</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Drag nodes, connect steps, and configure workflow logic.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase text-muted-foreground">
                                {isDirty ? 'Unsaved changes' : 'Saved'}
                            </span>
                            {onSave ? (
                                <Button
                                    size="sm"
                                    disabled={readOnly || isSaving || !isDirty}
                                    onClick={handleSave}
                                >
                                    {isSaving ? 'Saving…' : 'Save'}
                                </Button>
                            ) : null}
                        </div>
                    </CardHeader>
                    <CardContent className="relative h-full p-0">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            nodeTypes={nodeTypes}
                            panOnScroll
                            fitView
                            nodesConnectable={!readOnly}
                            nodesDraggable={!readOnly}
                            onNodesChange={handleNodesChange}
                            onEdgesChange={handleEdgesChange}
                            onConnect={handleConnect}
                            onSelectionChange={handleSelectionChange}
                        >
                            <Background gap={16} color="var(--border)" />
                            <MiniMap pannable zoomable />
                            <Controls position="bottom-left" showInteractive={!readOnly} />
                            {!readOnly ? (
                                <Panel position="top-right" className="flex flex-col gap-2 rounded-lg bg-background/95 p-3 shadow-lg backdrop-blur">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Add step
                                    </span>
                                    <div className="flex flex-col gap-2">
                                        {palette.map((item) => (
                                            <Button
                                                key={item.type}
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAddNode(item.type)}
                                            >
                                                {item.label}
                                            </Button>
                                        ))}
                                    </div>
                                </Panel>
                            ) : null}
                        </ReactFlow>
                    </CardContent>
                </Card>
                <aside className="w-80 shrink-0">
                    <Card className="h-full">
                        <CardHeader className="border-b border-border/60 py-3">
                            <CardTitle className="text-base font-semibold">Step Details</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Configure the selected node to control workflow behaviour.
                            </p>
                        </CardHeader>
                        <CardContent className="h-full overflow-y-auto p-4">
                            {selectedNode ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="node-label">Step label</Label>
                                        <Input
                                            id="node-label"
                                            value={selectedNode.data.label}
                                            disabled={readOnly}
                                            onChange={(event) =>
                                                updateNodeLabel(selectedNode.id, event.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="node-description">Description</Label>
                                        <Input
                                            id="node-description"
                                            value={selectedNode.data.description ?? ''}
                                            disabled={readOnly}
                                            onChange={(event) =>
                                                updateNodeDescription(selectedNode.id, event.target.value)
                                            }
                                        />
                                    </div>
                                    {selectedNode.type === 'approval' ? (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="assignee-type">Assignee type</Label>
                                            <select
                                                id="assignee-type"
                                                className="h-9 rounded-md border border-border/70 bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                value={selectedNode.data.config.assigneeType ?? ''}
                                                disabled={readOnly}
                                                onChange={(event) =>
                                                    updateNodeConfig(selectedNode.id, {
                                                        assigneeType: event.target.value as WorkflowNode['data']['config']['assigneeType'],
                                                    })
                                                }
                                            >
                                                <option value="">Select assignee type</option>
                                                <option value="role">Role</option>
                                                <option value="department_manager">Department manager</option>
                                                <option value="specific_users">Specific users</option>
                                            </select>
                                        </div>
                                    ) : null}
                                    {selectedNode.type === 'condition' ? (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="condition-expression">Condition expression</Label>
                                            <Input
                                                id="condition-expression"
                                                placeholder="e.g. approval_amount > 10000"
                                                value={selectedNode.data.config.condition ?? ''}
                                                disabled={readOnly}
                                                onChange={(event) =>
                                                    updateNodeConfig(selectedNode.id, {
                                                        condition: event.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    ) : null}
                                    {!readOnly ? (
                                        <>
                                            <Separator />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => removeNode(selectedNode.id)}
                                            >
                                                Delete step
                                            </Button>
                                        </>
                                    ) : null}
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-muted-foreground">
                                    <p className="text-sm font-medium">Select a step to edit its configuration.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </ReactFlowProvider>
    );
}

export default WorkflowDesigner;

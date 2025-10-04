import type { Edge, Node } from 'reactflow';

export type WorkflowNodeType = 'start' | 'approval' | 'condition' | 'end';

export type SerializableValue = string | number | boolean | null;

export interface NodeConfig {
    assigneeType?: 'role' | 'department_manager' | 'specific_users';
    assignees?: string[];
    condition?: string;
    timeout?: number;
    metadata?: Record<string, SerializableValue>;
}

export interface WorkflowNodeData {
    label: string;
    description?: string | null;
    config: NodeConfig;
}

export type WorkflowNode = Node<WorkflowNodeData> & {
    type: WorkflowNodeType;
};

export interface WorkflowEdgeData {
    label?: string;
    condition?: string;
    isDefault?: boolean;
    metadata?: Record<string, SerializableValue>;
}

export type WorkflowEdge = Edge<WorkflowEdgeData>;

export interface WorkflowDefinition {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    metadata?: Record<string, SerializableValue>;
}

export type WorkflowStatus = 'draft' | 'active' | 'archived';

export interface WorkflowTemplate {
    id: number;
    name: string;
    description: string | null;
    definition: WorkflowDefinition;
    version: string;
    parent_id: number | null;
    is_current: boolean;
    is_active: boolean;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface WorkflowStepInstanceData {
    workflow_instance_id: number;
    step_id: string;
    step_key: string;
    status: string;
    assigned_to: number | null;
    assigned_at: string | null;
    completed_at: string | null;
    comments: string | null;
    data: Record<string, unknown> | null;
}

export interface WorkflowInstance {
    id: number;
    template_id: number;
    title: string;
    form_data: Record<string, unknown> | null;
    status: string;
    active_steps: string[];
    parallel_mode: boolean;
    started_by: number;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface WorkflowHistoryEntry {
    id: number;
    workflow_instance_id: number;
    action: string;
    performed_by: number | null;
    performed_at: string;
    data: Record<string, unknown> | null;
    comments: string | null;
}


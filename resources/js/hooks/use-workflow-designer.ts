import { create } from 'zustand';
import {
    type Connection,
    type EdgeChange,
    applyEdgeChanges,
    applyNodeChanges,
    type NodeChange,
} from 'reactflow';
import {
    type WorkflowDefinition,
    type WorkflowEdge,
    type WorkflowNode,
    type WorkflowNodeType,
} from '@/types/workflow';

const workflowNodeDefaults: Record<WorkflowNodeType, { label: string }> = {
    start: { label: 'Start' },
    approval: { label: 'Approval' },
    condition: { label: 'Condition' },
    end: { label: 'End' },
};

const createNodeId = (prefix: string): string => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
};

interface WorkflowDesignerState {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    selectedNodeId: string | null;
    isDirty: boolean;
    setDefinition: (definition: WorkflowDefinition) => void;
    setNodes: (changes: NodeChange[]) => void;
    setEdges: (changes: EdgeChange[]) => void;
    addNode: (type: WorkflowNodeType, position: { x: number; y: number }) => void;
    updateNodeLabel: (id: string, label: string) => void;
    updateNodeDescription: (id: string, description: string) => void;
    updateNodeConfig: (id: string, config: Partial<WorkflowNode['data']['config']>) => void;
    removeNode: (id: string) => void;
    connectNodes: (connection: Connection) => void;
    removeEdge: (id: string) => void;
    selectNode: (id: string | null) => void;
    reset: () => void;
}

export const useWorkflowDesigner = create<WorkflowDesignerState>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    isDirty: false,
    setDefinition: (definition) => {
        set({
            nodes: definition.nodes,
            edges: definition.edges,
            isDirty: false,
            selectedNodeId: null,
        });
    },
    setNodes: (changes) => {
        set((state) => {
            const nextNodes = applyNodeChanges(changes, state.nodes) as WorkflowNode[];
            let selectedNodeId = state.selectedNodeId;

            changes.forEach((change) => {
                if (change.type === 'select') {
                    if (change.selected) {
                        selectedNodeId = change.id ?? null;
                    } else if (selectedNodeId === change.id) {
                        selectedNodeId = null;
                    }
                }
            });

            return {
                nodes: nextNodes,
                isDirty: true,
                selectedNodeId,
            };
        });
    },
    setEdges: (changes) => {
        set((state) => ({
            edges: applyEdgeChanges(changes, state.edges) as WorkflowEdge[],
            isDirty: true,
        }));
    },
    addNode: (type, position) => {
        const defaults = workflowNodeDefaults[type];

        const newNode: WorkflowNode = {
            id: createNodeId(type),
            type,
            position,
            data: {
                label: defaults?.label ?? 'Node',
                config: {},
            },
        };

        set((state) => ({
            nodes: [...state.nodes, newNode],
            selectedNodeId: newNode.id,
            isDirty: true,
        }));
    },
    updateNodeLabel: (id, label) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === id
                    ? {
                          ...node,
                          data: {
                              ...node.data,
                              label,
                          },
                      }
                    : node,
            ),
            isDirty: true,
        }));
    },
    updateNodeDescription: (id, description) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === id
                    ? {
                          ...node,
                          data: {
                              ...node.data,
                              description,
                          },
                      }
                    : node,
            ),
            isDirty: true,
        }));
    },
    updateNodeConfig: (id, config) => {
        set((state) => ({
            nodes: state.nodes.map((node) =>
                node.id === id
                    ? {
                          ...node,
                          data: {
                              ...node.data,
                              config: {
                                  ...node.data.config,
                                  ...config,
                              },
                          },
                      }
                    : node,
            ),
            isDirty: true,
        }));
    },
    removeNode: (id) => {
        set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
            selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
            isDirty: true,
        }));
    },
    connectNodes: (connection) => {
        const { edges } = get();

        const newEdge: WorkflowEdge = {
            id: `${connection.source}-${connection.target}`,
            source: connection.source ?? '',
            target: connection.target ?? '',
            sourceHandle: connection.sourceHandle,
            targetHandle: connection.targetHandle,
            data: {},
            type: 'smoothstep',
        };

        if (!newEdge.source || !newEdge.target) {
            return;
        }

        const exists = edges.some(
            (edge) => edge.source === newEdge.source && edge.target === newEdge.target,
        );

        if (exists) {
            return;
        }

        set((state) => ({
            edges: [...state.edges, newEdge],
            isDirty: true,
        }));
    },
    removeEdge: (id) => {
        set((state) => ({
            edges: state.edges.filter((edge) => edge.id !== id),
            isDirty: true,
        }));
    },
    selectNode: (id) => {
        set({ selectedNodeId: id });
    },
    reset: () => {
        set({ nodes: [], edges: [], isDirty: false, selectedNodeId: null });
    },
}));

export const createEmptyWorkflowDefinition = (): WorkflowDefinition => ({
    nodes: [
        {
            id: createNodeId('start'),
            type: 'start',
            position: { x: 100, y: 200 },
            data: {
                label: 'Start',
                config: {},
            },
        },
        {
            id: createNodeId('end'),
            type: 'end',
            position: { x: 600, y: 200 },
            data: {
                label: 'End',
                config: {},
            },
        },
    ],
    edges: [],
});


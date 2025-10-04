<?php

return [
    'defaults' => [
        [
            'key' => 'simple_approval',
            'name' => '??????',
            'description' => '??????????????????',
            'category' => 'approvals',
            'definition' => [
                'nodes' => [
                    ['id' => 'start', 'type' => 'start', 'data' => ['label' => '????']],
                    ['id' => 'manager_approval', 'type' => 'approval', 'data' => ['label' => '??????', 'config' => ['assigneeType' => 'department_manager']]],
                    ['id' => 'end', 'type' => 'end', 'data' => ['label' => '??']],
                ],
                'edges' => [
                    ['id' => 'edge-1', 'source' => 'start', 'target' => 'manager_approval', 'data' => []],
                    ['id' => 'edge-2', 'source' => 'manager_approval', 'target' => 'end', 'data' => []],
                ],
            ],
        ],
        [
            'key' => 'parallel_approvals',
            'name' => '?????????',
            'description' => '????????????????????????????',
            'category' => 'approvals',
            'definition' => [
                'nodes' => [
                    ['id' => 'start', 'type' => 'start', 'data' => ['label' => '????']],
                    ['id' => 'finance_approval', 'type' => 'approval', 'data' => ['label' => '????', 'config' => ['assigneeType' => 'role', 'assignees' => ['finance']]]],
                    ['id' => 'manager_approval', 'type' => 'approval', 'data' => ['label' => '??????', 'config' => ['assigneeType' => 'department_manager']]],
                    ['id' => 'end', 'type' => 'end', 'data' => ['label' => '????']],
                ],
                'edges' => [
                    ['id' => 'edge-1', 'source' => 'start', 'target' => 'finance_approval', 'data' => []],
                    ['id' => 'edge-2', 'source' => 'start', 'target' => 'manager_approval', 'data' => []],
                    ['id' => 'edge-3', 'source' => 'finance_approval', 'target' => 'end', 'data' => []],
                    ['id' => 'edge-4', 'source' => 'manager_approval', 'target' => 'end', 'data' => []],
                ],
            ],
        ],
        [
            'key' => 'conditional_purchase',
            'name' => '????????',
            'description' => '???????????? CFO ??????',
            'category' => 'purchases',
            'definition' => [
                'nodes' => [
                    ['id' => 'start', 'type' => 'start', 'data' => ['label' => '??????']],
                    ['id' => 'amount_check', 'type' => 'condition', 'data' => ['label' => '????']],
                    ['id' => 'director_approval', 'type' => 'approval', 'data' => ['label' => '??????', 'config' => ['assigneeType' => 'department_manager']]],
                    ['id' => 'cfo_approval', 'type' => 'approval', 'data' => ['label' => 'CFO ??', 'config' => ['assigneeType' => 'role', 'assignees' => ['cfo']]]],
                    ['id' => 'end', 'type' => 'end', 'data' => ['label' => '??']],
                ],
                'edges' => [
                    ['id' => 'edge-1', 'source' => 'start', 'target' => 'amount_check', 'data' => []],
                    ['id' => 'edge-2', 'source' => 'amount_check', 'target' => 'cfo_approval', 'data' => ['condition' => 'amount >= 100000']],
                    ['id' => 'edge-3', 'source' => 'amount_check', 'target' => 'director_approval', 'data' => ['isDefault' => true]],
                    ['id' => 'edge-4', 'source' => 'director_approval', 'target' => 'end', 'data' => []],
                    ['id' => 'edge-5', 'source' => 'cfo_approval', 'target' => 'end', 'data' => []],
                ],
            ],
        ],
    ],
];

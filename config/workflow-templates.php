<?php

return [
    'defaults' => [
        [
            'key' => 'simple_approval',
            'name' => '簡單審核',
            'description' => '單一審核者的基本審核流程',
            'category' => 'approvals',
            'definition' => [
                'nodes' => [
                    ['id' => 'start', 'type' => 'start', 'data' => ['label' => '開始']],
                    ['id' => 'manager_approval', 'type' => 'approval', 'data' => ['label' => '經理審核', 'config' => ['assigneeType' => 'department_manager']]],
                    ['id' => 'end', 'type' => 'end', 'data' => ['label' => '結束']],
                ],
                'edges' => [
                    ['id' => 'edge-1', 'source' => 'start', 'target' => 'manager_approval', 'data' => []],
                    ['id' => 'edge-2', 'source' => 'manager_approval', 'target' => 'end', 'data' => []],
                ],
            ],
        ],
        [
            'key' => 'parallel_approvals',
            'name' => '並行審核',
            'description' => '財務和經理同時審核的並行流程',
            'category' => 'approvals',
            'definition' => [
                'nodes' => [
                    ['id' => 'start', 'type' => 'start', 'data' => ['label' => '開始']],
                    ['id' => 'finance_approval', 'type' => 'approval', 'data' => ['label' => '財務審核', 'config' => ['assigneeType' => 'role', 'assignees' => ['finance']]]],
                    ['id' => 'manager_approval', 'type' => 'approval', 'data' => ['label' => '經理審核', 'config' => ['assigneeType' => 'department_manager']]],
                    ['id' => 'end', 'type' => 'end', 'data' => ['label' => '結束']],
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
            'name' => '條件採購',
            'description' => '根據金額決定是否需要 CFO 審核',
            'category' => 'purchases',
            'definition' => [
                'nodes' => [
                    ['id' => 'start', 'type' => 'start', 'data' => ['label' => '採購申請']],
                    ['id' => 'amount_check', 'type' => 'condition', 'data' => ['label' => '金額檢查']],
                    ['id' => 'director_approval', 'type' => 'approval', 'data' => ['label' => '主管審核', 'config' => ['assigneeType' => 'department_manager']]],
                    ['id' => 'cfo_approval', 'type' => 'approval', 'data' => ['label' => 'CFO 審核', 'config' => ['assigneeType' => 'role', 'assignees' => ['cfo']]]],
                    ['id' => 'end', 'type' => 'end', 'data' => ['label' => '完成']],
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

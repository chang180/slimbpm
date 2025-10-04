<?php

use App\Models\User;
use App\Models\WorkflowTemplate;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function definitionFixture(): array
{
    return [
        'nodes' => [
            [
                'id' => 'start-1',
                'type' => 'start',
                'data' => ['label' => 'Start'],
                'position' => ['x' => 0, 'y' => 0],
            ],
            [
                'id' => 'end-1',
                'type' => 'end',
                'data' => ['label' => 'End'],
                'position' => ['x' => 320, 'y' => 0],
            ],
        ],
        'edges' => [
            [
                'id' => 'edge-1',
                'source' => 'start-1',
                'target' => 'end-1',
                'data' => [],
            ],
        ],
    ];
}

test('it lists workflow templates', function () {
    $user = User::factory()->create();

    WorkflowTemplate::query()->create([
        'name' => 'Template A',
        'description' => 'First version',
        'definition' => definitionFixture(),
        'version' => '1.0.0',
        'is_current' => true,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/workflows');

    $response->assertOk()
        ->assertJsonPath('data.0.name', 'Template A');
});

test('it stores a workflow template', function () {
    $user = User::factory()->create();

    $payload = [
        'name' => 'Purchase Approval',
        'description' => 'Handles purchase approvals',
        'definition' => definitionFixture(),
    ];

    $response = $this->actingAs($user)
        ->postJson('/api/v1/workflows', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Purchase Approval')
        ->assertJsonPath('data.created_by', $user->id)
        ->assertJsonPath('data.is_current', true);

    $this->assertDatabaseHas('workflow_templates', [
        'name' => 'Purchase Approval',
        'created_by' => $user->id,
    ]);
});

test('it updates a workflow template without creating new version', function () {
    $user = User::factory()->create();

    $template = WorkflowTemplate::query()->create([
        'name' => 'Onboarding',
        'description' => 'Employee onboarding',
        'definition' => definitionFixture(),
        'version' => '1.0.0',
        'is_current' => true,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->putJson("/api/v1/workflows/{$template->id}", [
            'name' => 'Employee Onboarding',
            'description' => 'Updated description',
        ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'Employee Onboarding')
        ->assertJsonPath('data.description', 'Updated description');

    $this->assertDatabaseHas('workflow_templates', [
        'id' => $template->id,
        'name' => 'Employee Onboarding',
        'description' => 'Updated description',
    ]);
});

test('it creates a new workflow template version when requested', function () {
    $user = User::factory()->create();

    $template = WorkflowTemplate::query()->create([
        'name' => 'Expense Flow',
        'description' => 'Base flow',
        'definition' => definitionFixture(),
        'version' => '1.0.0',
        'is_current' => true,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->putJson("/api/v1/workflows/{$template->id}", [
            'description' => 'Improved flow',
            'definition' => [
                'nodes' => [
                    [
                        'id' => 'start-1',
                        'type' => 'start',
                        'data' => ['label' => 'Start'],
                        'position' => ['x' => 0, 'y' => 0],
                    ],
                    [
                        'id' => 'approval-1',
                        'type' => 'approval',
                        'data' => ['label' => 'Manager Approval'],
                        'position' => ['x' => 240, 'y' => 40],
                    ],
                    [
                        'id' => 'end-1',
                        'type' => 'end',
                        'data' => ['label' => 'End'],
                        'position' => ['x' => 480, 'y' => 0],
                    ],
                ],
                'edges' => [
                    [
                        'id' => 'edge-1',
                        'source' => 'start-1',
                        'target' => 'approval-1',
                        'data' => [],
                    ],
                    [
                        'id' => 'edge-2',
                        'source' => 'approval-1',
                        'target' => 'end-1',
                        'data' => [],
                    ],
                ],
            ],
            'create_new_version' => true,
        ]);

    $response->assertCreated()
        ->assertJsonPath('data.is_current', true)
        ->assertJsonPath('data.parent_id', $template->id)
        ->assertJsonPath('data.version', '1.0.1');

    expect(WorkflowTemplate::query()->where('parent_id', $template->id)->count())->toBe(1);
    expect($template->fresh()->is_current)->toBeFalse();
});

test('it deactivates a workflow template on destroy', function () {
    $user = User::factory()->create();

    $template = WorkflowTemplate::query()->create([
        'name' => 'Leave Request',
        'description' => 'Leave approvals',
        'definition' => definitionFixture(),
        'version' => '1.0.0',
        'is_current' => true,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $this->actingAs($user)
        ->deleteJson("/api/v1/workflows/{$template->id}")
        ->assertNoContent();

    $this->assertDatabaseHas('workflow_templates', [
        'id' => $template->id,
        'is_active' => false,
    ]);
});

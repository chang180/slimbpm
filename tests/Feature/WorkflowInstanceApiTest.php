<?php

use App\Models\User;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function apiWorkflowDefinition(): array
{
    return [
        'nodes' => [
            ['id' => 'start', 'type' => 'start', 'data' => ['label' => 'Start']],
            ['id' => 'approval', 'type' => 'approval', 'data' => ['label' => 'Manager Approval']],
            ['id' => 'end', 'type' => 'end', 'data' => ['label' => 'Finish']],
        ],
        'edges' => [
            ['id' => 'edge-1', 'source' => 'start', 'target' => 'approval', 'data' => []],
            ['id' => 'edge-2', 'source' => 'approval', 'target' => 'end', 'data' => []],
        ],
    ];
}

function makeTemplate(User $user): WorkflowTemplate
{
    return WorkflowTemplate::query()->create([
        'name' => 'API Flow',
        'description' => 'API managed workflow',
        'definition' => apiWorkflowDefinition(),
        'version' => '1.0.0',
        'is_current' => true,
        'is_active' => true,
        'created_by' => $user->id,
    ]);
}

test('it stores workflow instances via api', function () {
    $user = User::factory()->create();
    $template = makeTemplate($user);

    $response = $this->actingAs($user)
        ->postJson('/api/v1/workflow-instances', [
            'template_id' => $template->id,
            'title' => 'Purchase Request',
            'form_data' => ['amount' => 300],
        ]);

    $response->assertCreated()
        ->assertJsonPath('data.status', 'running')
        ->assertJsonPath('data.template.id', $template->id)
        ->assertJsonPath('data.active_steps', fn (array $steps) => count($steps) === 1);

    $this->assertDatabaseHas('workflow_instances', [
        'title' => 'Purchase Request',
        'status' => 'running',
    ]);
});

test('it lists workflow instances', function () {
    $user = User::factory()->create();
    $template = makeTemplate($user);

    $instance = WorkflowInstance::query()->create([
        'template_id' => $template->id,
        'title' => 'Existing Instance',
        'form_data' => [],
        'status' => 'running',
        'active_steps' => [],
        'parallel_mode' => false,
        'started_by' => $user->id,
        'started_at' => now(),
    ]);

    $response = $this->actingAs($user)
        ->getJson('/api/v1/workflow-instances');

    $response->assertOk()
        ->assertJsonPath('data.0.id', $instance->id);
});

test('it shows workflow instance with relationships', function () {
    $user = User::factory()->create();
    $template = makeTemplate($user);

    $storeResponse = $this->actingAs($user)
        ->postJson('/api/v1/workflow-instances', [
            'template_id' => $template->id,
            'form_data' => ['amount' => 600],
        ])->assertCreated();

    $instanceId = $storeResponse->json('data.id');

    $response = $this->actingAs($user)
        ->getJson("/api/v1/workflow-instances/{$instanceId}");

    $response->assertOk()
        ->assertJsonPath('data.template.id', $template->id)
        ->assertJsonStructure(['data' => ['steps', 'histories']]);
});

test('it updates workflow instance status via action', function () {
    $user = User::factory()->create();
    $template = makeTemplate($user);

    $instanceId = $this->actingAs($user)
        ->postJson('/api/v1/workflow-instances', [
            'template_id' => $template->id,
            'form_data' => ['amount' => 950],
        ])->json('data.id');

    $suspend = $this->actingAs($user)
        ->patchJson("/api/v1/workflow-instances/{$instanceId}", [
            'action' => 'suspend',
            'reason' => 'Awaiting clarification',
        ]);

    $suspend->assertOk()->assertJsonPath('data.status', 'suspended');

    $resume = $this->actingAs($user)
        ->patchJson("/api/v1/workflow-instances/{$instanceId}", [
            'action' => 'resume',
        ]);

    $resume->assertOk()->assertJsonPath('data.status', 'running');
});

test('it cancels workflow instance via destroy route', function () {
    $user = User::factory()->create();
    $template = makeTemplate($user);

    $instanceId = $this->actingAs($user)
        ->postJson('/api/v1/workflow-instances', [
            'template_id' => $template->id,
            'form_data' => ['amount' => 350],
        ])->json('data.id');

    $this->actingAs($user)
        ->deleteJson("/api/v1/workflow-instances/{$instanceId}", ['reason' => 'Request withdrawn'])
        ->assertNoContent();

    $this->assertDatabaseHas('workflow_instances', [
        'id' => $instanceId,
        'status' => 'cancelled',
    ]);
});

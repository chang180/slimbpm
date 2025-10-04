<?php

use App\Models\User;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function stepWorkflowDefinition(): array
{
    return [
        'nodes' => [
            ['id' => 'start', 'type' => 'start', 'data' => ['label' => 'Start']],
            ['id' => 'approval', 'type' => 'approval', 'data' => ['label' => 'Approval']],
            ['id' => 'end', 'type' => 'end', 'data' => ['label' => 'End']],
        ],
        'edges' => [
            ['id' => 'edge-1', 'source' => 'start', 'target' => 'approval', 'data' => []],
            ['id' => 'edge-2', 'source' => 'approval', 'target' => 'end', 'data' => []],
        ],
    ];
}

function createStepTemplate(User $user): WorkflowTemplate
{
    return WorkflowTemplate::query()->create([
        'name' => 'Step Flow',
        'description' => 'Step execution testing',
        'definition' => stepWorkflowDefinition(),
        'version' => '1.0.0',
        'is_current' => true,
        'is_active' => true,
        'created_by' => $user->id,
    ]);
}

test('it approves a step and completes workflow through api', function () {
    $initiator = User::factory()->create();
    $approver = User::factory()->create();
    $template = createStepTemplate($initiator);

    $instanceId = $this->actingAs($initiator)
        ->postJson('/api/v1/workflow-instances', [
            'template_id' => $template->id,
            'form_data' => ['amount' => 200],
        ])->json('data.id');

    $instance = WorkflowInstance::with('stepInstances')->findOrFail($instanceId);
    $step = $instance->stepInstances->first();

    $response = $this->actingAs($approver)
        ->patchJson("/api/v1/workflow-instances/{$instance->id}/steps/{$step->id}", [
            'status' => 'approved',
            'data' => ['decision' => 'approved'],
        ]);

    $response->assertOk()
        ->assertJsonPath('data.status', 'completed')
        ->assertJsonPath('data.active_steps', []);
});

test('it suspends workflow when step is rejected', function () {
    $initiator = User::factory()->create();
    $approver = User::factory()->create();
    $template = createStepTemplate($initiator);

    $instanceId = $this->actingAs($initiator)
        ->postJson('/api/v1/workflow-instances', [
            'template_id' => $template->id,
            'form_data' => ['amount' => 900],
        ])->json('data.id');

    $instance = WorkflowInstance::with('stepInstances')->findOrFail($instanceId);
    $step = $instance->stepInstances->first();

    $response = $this->actingAs($approver)
        ->patchJson("/api/v1/workflow-instances/{$instance->id}/steps/{$step->id}", [
            'status' => 'rejected',
            'reason' => 'Insufficient data',
            'comments' => 'Need more documentation',
        ]);

    $response->assertOk()
        ->assertJsonPath('data.status', 'suspended')
        ->assertJsonPath('data.active_steps', []);
});

test('it keeps workflow running when step is marked in progress', function () {
    $initiator = User::factory()->create();
    $template = createStepTemplate($initiator);

    $instanceId = $this->actingAs($initiator)
        ->postJson('/api/v1/workflow-instances', [
            'template_id' => $template->id,
            'form_data' => ['amount' => 500],
        ])->json('data.id');

    $instance = WorkflowInstance::with('stepInstances')->findOrFail($instanceId);
    $step = $instance->stepInstances->first();

    $response = $this->actingAs($initiator)
        ->patchJson("/api/v1/workflow-instances/{$instance->id}/steps/{$step->id}", [
            'status' => 'in_progress',
            'assigned_to' => $initiator->id,
        ]);

    $response->assertOk()
        ->assertJsonPath('data.status', 'running')
        ->assertJsonPath('data.active_steps', fn ($steps) => count($steps) === 1);
});

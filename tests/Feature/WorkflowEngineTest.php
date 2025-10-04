<?php

use App\Models\User;
use App\Models\WorkflowTemplate;
use App\Services\Workflow\WorkflowEngine;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function simpleWorkflowDefinition(): array
{
    return [
        'nodes' => [
            ['id' => 'start', 'type' => 'start', 'data' => ['label' => 'Start']],
            ['id' => 'approval_manager', 'type' => 'approval', 'data' => ['label' => 'Manager Approval']],
            ['id' => 'end', 'type' => 'end', 'data' => ['label' => 'Complete']],
        ],
        'edges' => [
            ['id' => 'edge-1', 'source' => 'start', 'target' => 'approval_manager', 'data' => []],
            ['id' => 'edge-2', 'source' => 'approval_manager', 'target' => 'end', 'data' => []],
        ],
    ];
}

function conditionalWorkflowDefinition(): array
{
    return [
        'nodes' => [
            ['id' => 'start', 'type' => 'start', 'data' => ['label' => 'Start']],
            ['id' => 'condition_amount', 'type' => 'condition', 'data' => ['label' => 'Amount Check']],
            ['id' => 'approval_high', 'type' => 'approval', 'data' => ['label' => 'CFO Approval']],
            ['id' => 'approval_low', 'type' => 'approval', 'data' => ['label' => 'Manager Approval']],
            ['id' => 'end', 'type' => 'end', 'data' => ['label' => 'End']],
        ],
        'edges' => [
            ['id' => 'edge-1', 'source' => 'start', 'target' => 'condition_amount', 'data' => []],
            ['id' => 'edge-2', 'source' => 'condition_amount', 'target' => 'approval_high', 'data' => ['condition' => 'amount > 1000']],
            ['id' => 'edge-3', 'source' => 'condition_amount', 'target' => 'approval_low', 'data' => ['isDefault' => true]],
            ['id' => 'edge-4', 'source' => 'approval_high', 'target' => 'end', 'data' => []],
            ['id' => 'edge-5', 'source' => 'approval_low', 'target' => 'end', 'data' => []],
        ],
    ];
}

function complexConditionWorkflow(): array
{
    return [
        'nodes' => [
            ['id' => 'start', 'type' => 'start', 'data' => ['label' => 'Start']],
            ['id' => 'condition_priority', 'type' => 'condition', 'data' => ['label' => 'Priority Check']],
            ['id' => 'approval_cfo', 'type' => 'approval', 'data' => ['label' => 'CFO Approval']],
            ['id' => 'approval_director', 'type' => 'approval', 'data' => ['label' => 'Director Approval']],
            ['id' => 'fallback_manager', 'type' => 'approval', 'data' => ['label' => 'Manager Review']],
            ['id' => 'end', 'type' => 'end', 'data' => ['label' => 'Complete']],
        ],
        'edges' => [
            ['id' => 'edge-1', 'source' => 'start', 'target' => 'condition_priority', 'data' => []],
            ['id' => 'edge-2', 'source' => 'condition_priority', 'target' => 'approval_cfo', 'data' => ['condition' => "amount > 5000 && priority == 'urgent'"]],
            ['id' => 'edge-3', 'source' => 'condition_priority', 'target' => 'approval_director', 'data' => ['condition' => "amount > 1000 || project == 'critical'"]],
            ['id' => 'edge-4', 'source' => 'condition_priority', 'target' => 'fallback_manager', 'data' => ['isDefault' => true]],
            ['id' => 'edge-5', 'source' => 'approval_cfo', 'target' => 'end', 'data' => []],
            ['id' => 'edge-6', 'source' => 'approval_director', 'target' => 'end', 'data' => []],
            ['id' => 'edge-7', 'source' => 'fallback_manager', 'target' => 'end', 'data' => []],
        ],
    ];
}

function createWorkflowTemplate(User $user, array $definition, string $name = 'Test Workflow'): WorkflowTemplate
{
    return WorkflowTemplate::query()->create([
        'name' => $name,
        'description' => 'Demo workflow',
        'definition' => $definition,
        'version' => '1.0.0',
        'is_current' => true,
        'is_active' => true,
        'created_by' => $user->id,
    ]);
}

test('it starts a workflow instance and activates pending steps', function () {
    CarbonImmutable::setTestNow('2025-10-05 09:00:00');

    $initiator = User::factory()->create();
    $template = createWorkflowTemplate($initiator, simpleWorkflowDefinition());

    $engine = new WorkflowEngine;

    $instance = $engine->startWorkflow($template, [
        'title' => 'Purchase Request #1',
        'form_data' => ['amount' => 750],
    ], $initiator);

    expect($instance->status)->toBe('running');
    expect($instance->active_steps)->toHaveCount(1);
    expect($instance->stepInstances)->toHaveCount(1);

    $step = $instance->stepInstances->first();
    expect($step->step_key)->toBe('approval_manager');
    expect($step->status)->toBe('pending');

    expect($instance->histories()->pluck('action'))
        ->toContain('workflow_started', 'step_activated');
});

test('completing a step progresses the workflow to completion', function () {
    CarbonImmutable::setTestNow('2025-10-05 09:00:00');

    $initiator = User::factory()->create();
    $approver = User::factory()->create();
    $template = createWorkflowTemplate($initiator, simpleWorkflowDefinition());

    $engine = new WorkflowEngine;
    $instance = $engine->startWorkflow($template, [
        'title' => 'Purchase Request #2',
        'form_data' => ['amount' => 1200],
    ], $initiator);

    $step = $instance->stepInstances()->first();

    CarbonImmutable::setTestNow('2025-10-05 09:15:00');

    $engine->executeStep($step, [
        'status' => 'approved',
        'data' => ['decision' => 'approved'],
    ], $approver);

    $instance->refresh();

    expect($instance->status)->toBe('completed');
    expect($instance->completed_at)->not->toBeNull();
    expect($instance->active_steps)->toBe([]);

    expect($instance->histories()->pluck('action'))
        ->toContain('step_completed', 'workflow_completed');
});

test('condition nodes route to matching branch', function () {
    $initiator = User::factory()->create();
    $template = createWorkflowTemplate($initiator, conditionalWorkflowDefinition(), 'Conditional Flow');
    $engine = new WorkflowEngine;

    $highInstance = $engine->startWorkflow($template, [
        'title' => 'High Amount Request',
        'form_data' => ['amount' => 5000],
    ], $initiator);

    $highStep = $highInstance->stepInstances->first();
    expect($highStep->step_key)->toBe('approval_high');

    $lowInstance = $engine->startWorkflow($template, [
        'title' => 'Low Amount Request',
        'form_data' => ['amount' => 100],
    ], $initiator);

    $lowStep = $lowInstance->stepInstances->first();
    expect($lowStep->step_key)->toBe('approval_low');
});

test('parallel approvals require all branches before completion', function () {
    CarbonImmutable::setTestNow('2025-10-05 10:00:00');

    $initiator = User::factory()->create();
    $financeApprover = User::factory()->create();
    $managerApprover = User::factory()->create();

    $definition = [
        'nodes' => [
            ['id' => 'start', 'type' => 'start', 'data' => ['label' => 'Start']],
            ['id' => 'approval_finance', 'type' => 'approval', 'data' => ['label' => 'Finance Approval']],
            ['id' => 'approval_manager', 'type' => 'approval', 'data' => ['label' => 'Manager Approval']],
            ['id' => 'end', 'type' => 'end', 'data' => ['label' => 'Complete']],
        ],
        'edges' => [
            ['id' => 'edge-1', 'source' => 'start', 'target' => 'approval_finance', 'data' => []],
            ['id' => 'edge-2', 'source' => 'start', 'target' => 'approval_manager', 'data' => []],
            ['id' => 'edge-3', 'source' => 'approval_finance', 'target' => 'end', 'data' => []],
            ['id' => 'edge-4', 'source' => 'approval_manager', 'target' => 'end', 'data' => []],
        ],
    ];

    $template = createWorkflowTemplate($initiator, $definition, 'Parallel Flow');
    $engine = new WorkflowEngine;

    $instance = $engine->startWorkflow($template, [
        'title' => 'Capital Expenditure',
        'form_data' => ['amount' => 3000],
    ], $initiator);

    expect($instance->status)->toBe('running');
    expect($instance->active_steps)->toHaveCount(2);
    expect($instance->parallel_mode)->toBeTrue();

    $financeStep = $instance->stepInstances()->where('step_key', 'approval_finance')->firstOrFail();
    $managerStep = $instance->stepInstances()->where('step_key', 'approval_manager')->firstOrFail();

    CarbonImmutable::setTestNow('2025-10-05 10:15:00');

    $engine->executeStep($financeStep, [
        'status' => 'approved',
        'data' => ['finance_decision' => true],
    ], $financeApprover);

    $instance->refresh();
    expect($instance->status)->toBe('running');
    expect($instance->active_steps)->toHaveCount(1);
    expect($instance->parallel_mode)->toBeFalse();

    CarbonImmutable::setTestNow('2025-10-05 10:30:00');

    $engine->executeStep($managerStep->fresh(), [
        'status' => 'approved',
        'data' => ['manager_decision' => true],
    ], $managerApprover);

    $instance->refresh();

    expect($instance->status)->toBe('completed');
    expect($instance->active_steps)->toBe([]);
    expect($instance->histories()->pluck('action'))
        ->toContain('workflow_completed');
});

test('complex condition expressions are evaluated', function () {
    $initiator = User::factory()->create();
    $template = createWorkflowTemplate($initiator, complexConditionWorkflow(), 'Complex Flow');
    $engine = new WorkflowEngine;

    $urgentInstance = $engine->startWorkflow($template, [
        'title' => 'Urgent High Amount',
        'form_data' => ['amount' => 7000, 'priority' => 'urgent', 'project' => 'standard'],
    ], $initiator);

    expect($urgentInstance->stepInstances->first()->step_key)->toBe('approval_cfo');

    $projectCriticalInstance = $engine->startWorkflow($template, [
        'title' => 'Critical Project',
        'form_data' => ['amount' => 800, 'priority' => 'normal', 'project' => 'critical'],
    ], $initiator);

    expect($projectCriticalInstance->stepInstances->first()->step_key)->toBe('approval_director');
});

test('default conditional edge is used when no expressions match', function () {
    $initiator = User::factory()->create();
    $template = createWorkflowTemplate($initiator, complexConditionWorkflow(), 'Default Flow');
    $engine = new WorkflowEngine;

    $instance = $engine->startWorkflow($template, [
        'title' => 'Low Risk Request',
        'form_data' => ['amount' => 200, 'priority' => 'low', 'project' => 'standard'],
    ], $initiator);

    expect($instance->stepInstances->first()->step_key)->toBe('fallback_manager');
});

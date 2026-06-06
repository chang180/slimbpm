<?php

use App\Models\FormTemplate;
use App\Models\OrganizationSetting;
use App\Models\User;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('authenticated organization user can create a form and complete a workflow approval', function () {
    $organization = OrganizationSetting::factory()->create([
        'slug' => 'acme-workflows',
    ]);

    $user = User::factory()->create([
        'email_verified_at' => now(),
        'organization_id' => $organization->id,
        'role' => 'manager',
    ]);

    $formPayload = [
        'name' => '採購申請表',
        'description' => '用於 E2E 骨架測試的採購表單',
        'definition' => [
            'fields' => [
                [
                    'id' => 'amount',
                    'type' => 'number',
                    'label' => '金額',
                    'required' => true,
                ],
            ],
            'settings' => [
                'submitButtonText' => '提交',
                'successMessage' => '提交成功',
            ],
        ],
        'category' => '採購',
        'tags' => ['approval'],
        'is_public' => false,
    ];

    $this->actingAs($user)
        ->post(route('forms.store'), $formPayload)
        ->assertRedirect();

    $form = FormTemplate::query()->firstOrFail();

    expect($form->created_by)->toBe($user->id);

    $this->actingAs($user)
        ->get("/forms/{$form->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Forms/Show')
            ->where('canEdit', true)
            ->where('form.name', '採購申請表')
        );

    $workflowTemplate = WorkflowTemplate::query()->create([
        'name' => '採購審批流程',
        'description' => '採購申請需要主管核准',
        'definition' => [
            'nodes' => [
                ['id' => 'start', 'type' => 'start', 'data' => ['label' => 'Start']],
                ['id' => 'approval_manager', 'type' => 'approval', 'data' => ['label' => '主管審批']],
                ['id' => 'end', 'type' => 'end', 'data' => ['label' => '完成']],
            ],
            'edges' => [
                ['id' => 'edge-1', 'source' => 'start', 'target' => 'approval_manager', 'data' => []],
                ['id' => 'edge-2', 'source' => 'approval_manager', 'target' => 'end', 'data' => []],
            ],
        ],
        'version' => '1.0.0',
        'is_current' => true,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $this->actingAs($user)
        ->withSession(['current_organization_slug' => $organization->slug])
        ->get(route('workflows.start'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workflows/Start')
            ->has('templates', 1)
            ->where('templates.0.id', $workflowTemplate->id)
        );

    $startResponse = $this->actingAs($user)
        ->postJson('/api/v1/workflow-instances', [
            'template_id' => $workflowTemplate->id,
            'title' => '採購申請 #1001',
            'form_data' => [
                'form_template_id' => $form->id,
                'amount' => 1200,
            ],
        ]);

    $startResponse->assertCreated()
        ->assertJsonPath('data.status', 'running')
        ->assertJsonPath('data.template.id', $workflowTemplate->id);

    $instance = WorkflowInstance::query()
        ->with('stepInstances')
        ->findOrFail($startResponse->json('data.id'));

    $step = $instance->stepInstances->first();

    expect($step->status)->toBe('pending');

    $step->update([
        'assigned_to' => $user->id,
        'assigned_at' => now(),
    ]);

    $this->actingAs($user)
        ->withSession(['current_organization_slug' => $organization->slug])
        ->get('/workflows')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('workflows/Index')
            ->where('myInstances.data.0.id', $instance->id)
            ->where('pendingSteps.data.0.id', $instance->id)
        );

    $this->actingAs($user)
        ->patchJson("/api/v1/workflow-instances/{$instance->id}/steps/{$step->id}", [
            'status' => 'approved',
            'data' => ['approved_amount' => 1200],
            'comments' => '核准採購',
        ])
        ->assertOk()
        ->assertJsonPath('data.status', 'completed');

    $this->assertDatabaseHas('workflow_instances', [
        'id' => $instance->id,
        'status' => 'completed',
    ]);

    $this->assertDatabaseHas('workflow_histories', [
        'workflow_instance_id' => $instance->id,
        'action' => 'workflow_completed',
        'performed_by' => $user->id,
    ]);
});

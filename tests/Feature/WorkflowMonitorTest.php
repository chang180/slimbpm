<?php

use App\Models\OrganizationSetting;
use App\Models\User;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

function makeMonitorSetup(): array
{
    $org = OrganizationSetting::factory()->create();
    $admin = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);

    return [$org, $admin];
}

it('admin can access the workflow monitor page', function () {
    [$org, $admin] = makeMonitorSetup();

    actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->get("/dashboard/{$org->slug}")
        ->assertOk();

    actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->get('/workflows/monitor')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('workflows/Monitor')
            ->has('instances')
            ->has('stats')
            ->has('filters')
        );
});

it('non-admin cannot access the workflow monitor page', function () {
    [$org] = makeMonitorSetup();
    $user = User::factory()->create(['organization_id' => $org->id, 'role' => 'user']);

    actingAs($user)
        ->withSession(['current_organization_id' => $org->id])
        ->get('/workflows/monitor')
        ->assertForbidden();
});

it('manager can access the workflow monitor page', function () {
    [$org] = makeMonitorSetup();
    $manager = User::factory()->create(['organization_id' => $org->id, 'role' => 'manager']);

    actingAs($manager)
        ->withSession(['current_organization_id' => $org->id])
        ->get('/workflows/monitor')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('workflows/Monitor'));
});

it('shows only org instances on the monitor page', function () {
    [$org, $admin] = makeMonitorSetup();
    $otherOrg = OrganizationSetting::factory()->create();
    $otherUser = User::factory()->create(['organization_id' => $otherOrg->id, 'role' => 'user']);

    $template = WorkflowTemplate::factory()->create(['created_by' => $admin->id]);
    $ownInstance = WorkflowInstance::factory()->create(['started_by' => $admin->id, 'template_id' => $template->id]);

    $otherTemplate = WorkflowTemplate::factory()->create(['created_by' => $otherUser->id]);
    WorkflowInstance::factory()->create(['started_by' => $otherUser->id, 'template_id' => $otherTemplate->id]);

    actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->get('/workflows/monitor')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('workflows/Monitor')
            ->where('instances.total', 1)
            ->where('instances.data.0.id', $ownInstance->id)
        );
});

it('filters instances by status', function () {
    [$org, $admin] = makeMonitorSetup();
    $template = WorkflowTemplate::factory()->create(['created_by' => $admin->id]);

    WorkflowInstance::factory()->running()->create(['started_by' => $admin->id, 'template_id' => $template->id]);
    WorkflowInstance::factory()->completed()->create(['started_by' => $admin->id, 'template_id' => $template->id]);

    actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->get('/workflows/monitor?status=running')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('instances.total', 1)
            ->where('instances.data.0.status', 'running')
        );
});

it('searches instances by title', function () {
    [$org, $admin] = makeMonitorSetup();
    $template = WorkflowTemplate::factory()->create(['created_by' => $admin->id]);

    WorkflowInstance::factory()->create(['started_by' => $admin->id, 'template_id' => $template->id, 'title' => '請假申請流程']);
    WorkflowInstance::factory()->create(['started_by' => $admin->id, 'template_id' => $template->id, 'title' => '採購審批流程']);

    actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->get('/workflows/monitor?search=請假')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('instances.total', 1)
            ->where('instances.data.0.title', '請假申請流程')
        );
});

it('returns correct stats counts', function () {
    [$org, $admin] = makeMonitorSetup();
    $template = WorkflowTemplate::factory()->create(['created_by' => $admin->id]);

    WorkflowInstance::factory()->running()->create(['started_by' => $admin->id, 'template_id' => $template->id]);
    WorkflowInstance::factory()->running()->create(['started_by' => $admin->id, 'template_id' => $template->id]);
    WorkflowInstance::factory()->completed()->create(['started_by' => $admin->id, 'template_id' => $template->id]);
    WorkflowInstance::factory()->suspended()->create(['started_by' => $admin->id, 'template_id' => $template->id]);

    actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->get('/workflows/monitor')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('stats')
            ->where('stats.total', 4)
            ->where('stats.running', 2)
            ->where('stats.completed', 1)
            ->where('stats.suspended', 1)
            ->where('stats.cancelled', 0)
        );
});

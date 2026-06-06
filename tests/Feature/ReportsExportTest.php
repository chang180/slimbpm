<?php

use App\Models\Department;
use App\Models\OrganizationSetting;
use App\Models\User;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

function makeExportSetup(): array
{
    $org = OrganizationSetting::factory()->create();
    $admin = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);

    return [$org, $admin];
}

// ─── User Activity Export ────────────────────────────────────────────────────

it('exports user activity report as csv', function () {
    [$org, $admin] = makeExportSetup();

    $response = actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->post('/reports/export/user-activity');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    expect($response->headers->get('Content-Disposition'))->toContain('user_activity_report_');
});

it('user activity csv contains org users only', function () {
    [$org, $admin] = makeExportSetup();
    $orgUser = User::factory()->create(['organization_id' => $org->id, 'role' => 'user']);

    $otherOrg = OrganizationSetting::factory()->create();
    $outsider = User::factory()->create(['organization_id' => $otherOrg->id]);

    $response = actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->post('/reports/export/user-activity');

    $csv = $response->getContent();

    expect($csv)->toContain($orgUser->name);
    expect($csv)->toContain($admin->name);
    expect($csv)->not->toContain($outsider->name);
});

it('user activity csv includes workflow execution counts per user', function () {
    [$org, $admin] = makeExportSetup();

    $template = WorkflowTemplate::factory()->create(['created_by' => $admin->id]);
    WorkflowInstance::factory()->count(2)->create(['started_by' => $admin->id, 'template_id' => $template->id]);

    $response = actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->post('/reports/export/user-activity');

    $response->assertOk();
    expect($response->getContent())->toContain($admin->email);
});

// ─── System Stats Export ─────────────────────────────────────────────────────

it('exports system stats report as csv', function () {
    [$org, $admin] = makeExportSetup();

    $response = actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->post('/reports/export/system-stats');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    expect($response->headers->get('Content-Disposition'))->toContain('system_stats_report_');
});

it('system stats csv contains org name', function () {
    [$org, $admin] = makeExportSetup();

    $response = actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->post('/reports/export/system-stats');

    expect($response->getContent())->toContain($org->name);
});

it('system stats csv scopes department count to org', function () {
    [$org, $admin] = makeExportSetup();

    Department::factory()->count(2)->create(['organization_id' => $org->id]);

    $otherOrg = OrganizationSetting::factory()->create();
    Department::factory()->count(5)->create(['organization_id' => $otherOrg->id]);

    $response = actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->post('/reports/export/system-stats');

    $lines = array_filter(explode("\n", $response->getContent()));
    $deptRow = collect($lines)->first(fn ($l) => str_contains($l, '總部門數'));

    expect($deptRow)->toContain(',2,');
});

// ─── Workflow Performance Export ─────────────────────────────────────────────

it('exports workflow performance report as csv', function () {
    [$org, $admin] = makeExportSetup();

    $response = actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->post('/reports/export/workflow-performance');

    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    expect($response->headers->get('Content-Disposition'))->toContain('workflow_performance_report_');
});

it('workflow performance csv contains only org templates', function () {
    [$org, $admin] = makeExportSetup();

    WorkflowTemplate::factory()->create(['created_by' => $admin->id, 'name' => 'OrgFlow']);

    $otherOrg = OrganizationSetting::factory()->create();
    $outsider = User::factory()->create(['organization_id' => $otherOrg->id]);
    WorkflowTemplate::factory()->create(['created_by' => $outsider->id, 'name' => 'OtherFlow']);

    $response = actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->post('/reports/export/workflow-performance');

    $csv = $response->getContent();

    expect($csv)->toContain('OrgFlow');
    expect($csv)->not->toContain('OtherFlow');
});

it('workflow performance csv shows real instance counts', function () {
    [$org, $admin] = makeExportSetup();

    $template = WorkflowTemplate::factory()->create(['created_by' => $admin->id]);
    WorkflowInstance::factory()->completed()->create([
        'started_by' => $admin->id,
        'template_id' => $template->id,
        'started_at' => now()->subDays(3),
        'completed_at' => now(),
    ]);

    $response = actingAs($admin)
        ->withSession(['current_organization_id' => $org->id])
        ->post('/reports/export/workflow-performance');

    $response->assertOk();
});

// ─── Non-admin is forbidden ───────────────────────────────────────────────────

it('non-admin cannot export reports', function (string $endpoint) {
    [$org] = makeExportSetup();
    /** @var User $user */
    $user = User::factory()->create(['organization_id' => $org->id, 'role' => 'user']);

    actingAs($user)
        ->withSession(['current_organization_id' => $org->id])
        ->post($endpoint)
        ->assertForbidden();
})->with([
    '/reports/export/user-activity',
    '/reports/export/system-stats',
    '/reports/export/workflow-performance',
]);

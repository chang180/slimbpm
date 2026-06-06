<?php

use App\Models\Department;
use App\Models\FormSubmission;
use App\Models\FormTemplate;
use App\Models\OrganizationSetting;
use App\Models\User;
use App\Models\WorkflowInstance;
use App\Models\WorkflowTemplate;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

afterEach(function () {
    CarbonImmutable::setTestNow();
});

it('scopes report center summary to the current organization', function () {
    $organization = OrganizationSetting::factory()->create();
    $admin = User::factory()->create(['organization_id' => $organization->id, 'role' => 'admin']);
    $member = User::factory()->create(['organization_id' => $organization->id, 'role' => 'user']);

    $otherOrganization = OrganizationSetting::factory()->create();
    $outsider = User::factory()->create(['organization_id' => $otherOrganization->id]);

    $template = WorkflowTemplate::factory()->create(['created_by' => $admin->id]);
    WorkflowInstance::factory()->running()->create(['started_by' => $admin->id, 'template_id' => $template->id]);
    WorkflowInstance::factory()->completed()->create(['started_by' => $member->id, 'template_id' => $template->id]);

    $otherTemplate = WorkflowTemplate::factory()->create(['created_by' => $outsider->id]);
    WorkflowInstance::factory()->running()->create(['started_by' => $outsider->id, 'template_id' => $otherTemplate->id]);

    FormSubmission::factory()->submitted()->create(['submitted_by' => $member->id]);
    FormSubmission::factory()->submitted()->create(['submitted_by' => $outsider->id]);

    actingAs($admin)
        ->get('/reports')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/Index')
            ->where('summary.totalUsers', 2)
            ->where('summary.totalWorkflowInstances', 2)
            ->where('summary.totalSubmissions', 1)
            ->where('summary.activeWorkflows', 1)
        );
});

it('scopes workflow performance report props to organization users and templates', function () {
    CarbonImmutable::setTestNow('2026-06-06 10:00:00');

    $organization = OrganizationSetting::factory()->create();
    $admin = User::factory()->create(['organization_id' => $organization->id, 'role' => 'manager']);

    $otherOrganization = OrganizationSetting::factory()->create();
    $outsider = User::factory()->create(['organization_id' => $otherOrganization->id]);

    $template = WorkflowTemplate::factory()->create([
        'created_by' => $admin->id,
        'name' => 'Org Approval',
        'is_current' => true,
        'is_active' => true,
    ]);

    WorkflowInstance::factory()->running()->create([
        'started_by' => $admin->id,
        'template_id' => $template->id,
        'created_at' => now(),
    ]);

    WorkflowInstance::factory()->completed()->create([
        'started_by' => $admin->id,
        'template_id' => $template->id,
        'started_at' => now()->subDays(2),
        'completed_at' => now(),
        'created_at' => now(),
    ]);

    $otherTemplate = WorkflowTemplate::factory()->create([
        'created_by' => $outsider->id,
        'name' => 'Other Approval',
        'is_current' => true,
        'is_active' => true,
    ]);

    WorkflowInstance::factory()->completed()->create([
        'started_by' => $outsider->id,
        'template_id' => $otherTemplate->id,
        'started_at' => now()->subDay(),
        'completed_at' => now(),
        'created_at' => now(),
    ]);

    actingAs($admin)
        ->get('/reports/workflow-performance')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/WorkflowPerformance')
            ->where('workflowStats.totalTemplates', 1)
            ->where('workflowStats.activeTemplates', 1)
            ->where('workflowStats.totalInstances', 2)
            ->where('workflowStats.completedToday', 1)
            ->where('workflowStats.running', 1)
            ->where('workflowStats.avgCompletionDays', 2)
            ->has('templateUsage', 1)
            ->where('templateUsage.0.name', 'Org Approval')
            ->where('templateUsage.0.count', 2)
        );

    CarbonImmutable::setTestNow();
});

it('renders user activity report page with correct props', function () {
    $organization = OrganizationSetting::factory()->create();
    $admin = User::factory()->create(['organization_id' => $organization->id, 'role' => 'admin']);

    actingAs($admin)
        ->get('/reports/user-activity')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/UserActivity')
            ->has('userStats')
            ->has('activityData')
            ->has('departmentStats')
            ->where('userStats.totalUsers', 1)
        );
});

it('filters user activity report props by date range', function () {
    CarbonImmutable::setTestNow('2026-06-15 10:00:00');

    $organization = OrganizationSetting::factory()->create();
    $admin = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'admin',
        'created_at' => '2026-06-01 09:00:00',
    ]);
    $member = User::factory()->create([
        'organization_id' => $organization->id,
        'created_at' => '2026-06-10 09:00:00',
    ]);

    FormSubmission::factory()->submitted()->create([
        'submitted_by' => $member->id,
        'submitted_at' => '2026-06-12 09:00:00',
    ]);
    FormSubmission::factory()->submitted()->create([
        'submitted_by' => $member->id,
        'submitted_at' => '2026-05-12 09:00:00',
    ]);

    actingAs($admin)
        ->get('/reports/user-activity?date_from=2026-06-01&date_to=2026-06-30')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/UserActivity')
            ->where('filters.date_from', '2026-06-01')
            ->where('filters.date_to', '2026-06-30')
            ->where('userStats.totalUsers', 2)
            ->where('userStats.newUsersThisMonth', 2)
            ->where('userStats.totalSubmissions', 1)
            ->where('activityData.5.newUsers', 2)
            ->where('activityData.5.submissions', 1)
        );
});

it('renders system stats report page with correct props', function () {
    $organization = OrganizationSetting::factory()->create();
    $admin = User::factory()->create(['organization_id' => $organization->id, 'role' => 'admin']);

    actingAs($admin)
        ->get('/reports/system-stats')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/SystemStats')
            ->has('systemStats')
            ->has('usageData')
            ->has('orgName')
            ->where('systemStats.totalUsers', 1)
            ->where('orgName', $organization->name)
        );
});

it('filters workflow performance report props by date range', function () {
    CarbonImmutable::setTestNow('2026-06-15 10:00:00');

    $organization = OrganizationSetting::factory()->create();
    $admin = User::factory()->create(['organization_id' => $organization->id, 'role' => 'manager']);

    $template = WorkflowTemplate::factory()->create([
        'created_by' => $admin->id,
        'name' => 'June Approval',
        'is_current' => true,
        'is_active' => true,
    ]);

    WorkflowInstance::factory()->running()->create([
        'started_by' => $admin->id,
        'template_id' => $template->id,
        'created_at' => '2026-06-10 09:00:00',
    ]);
    WorkflowInstance::factory()->completed()->create([
        'started_by' => $admin->id,
        'template_id' => $template->id,
        'started_at' => '2026-06-11 09:00:00',
        'completed_at' => '2026-06-13 09:00:00',
        'created_at' => '2026-06-11 09:00:00',
    ]);
    WorkflowInstance::factory()->completed()->create([
        'started_by' => $admin->id,
        'template_id' => $template->id,
        'started_at' => '2026-05-11 09:00:00',
        'completed_at' => '2026-05-13 09:00:00',
        'created_at' => '2026-05-11 09:00:00',
    ]);

    actingAs($admin)
        ->get('/reports/workflow-performance?date_from=2026-06-01&date_to=2026-06-30')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/WorkflowPerformance')
            ->where('filters.date_from', '2026-06-01')
            ->where('filters.date_to', '2026-06-30')
            ->where('workflowStats.totalInstances', 2)
            ->where('workflowStats.running', 1)
            ->where('workflowStats.avgCompletionDays', 2)
            ->where('performanceData.5.started', 2)
            ->where('performanceData.5.completed', 1)
            ->has('templateUsage', 1)
            ->where('templateUsage.0.name', 'June Approval')
            ->where('templateUsage.0.count', 2)
        );
});

it('scopes department analysis stats and row metrics to the current organization', function () {
    $organization = OrganizationSetting::factory()->create();
    $admin = User::factory()->create(['organization_id' => $organization->id, 'role' => 'admin']);
    $member = User::factory()->create(['organization_id' => $organization->id, 'role' => 'user']);

    $otherOrganization = OrganizationSetting::factory()->create();
    $outsider = User::factory()->create(['organization_id' => $otherOrganization->id]);

    $department = Department::factory()->create([
        'organization_id' => $organization->id,
        'name' => 'Finance',
    ]);
    $department->users()->attach($member->id);

    $otherDepartment = Department::factory()->create([
        'organization_id' => $otherOrganization->id,
        'name' => 'External',
    ]);
    $otherDepartment->users()->attach($outsider->id);

    $form = FormTemplate::factory()->create(['created_by' => $admin->id]);
    FormSubmission::factory()->submitted()->create([
        'form_template_id' => $form->id,
        'submitted_by' => $member->id,
    ]);
    FormSubmission::factory()->submitted()->create(['submitted_by' => $outsider->id]);

    $template = WorkflowTemplate::factory()->create(['created_by' => $admin->id]);
    WorkflowInstance::factory()->running()->create(['started_by' => $member->id, 'template_id' => $template->id]);

    $otherTemplate = WorkflowTemplate::factory()->create(['created_by' => $outsider->id]);
    WorkflowInstance::factory()->running()->create(['started_by' => $outsider->id, 'template_id' => $otherTemplate->id]);

    actingAs($admin)
        ->get('/reports/department-analysis')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/DepartmentAnalysis')
            ->where('stats.totalDepartments', 1)
            ->where('stats.totalUsers', 2)
            ->where('stats.avgUsersPerDept', 2)
            ->has('departments', 1)
            ->where('departments.0.name', 'Finance')
            ->where('departments.0.users_count', 1)
            ->where('departments.0.percentage', 50)
            ->where('departments.0.submissions', 1)
            ->where('departments.0.workflows', 1)
        );
});

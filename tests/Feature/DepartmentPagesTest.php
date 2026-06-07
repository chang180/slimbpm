<?php

use App\Models\Department;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function departmentPagesUser(string $role = 'admin'): User
{
    $organization = OrganizationSetting::factory()->create();

    return User::factory()->create([
        'organization_id' => $organization->id,
        'role' => $role,
    ]);
}

it('renders the departments index page', function () {
    $user = departmentPagesUser();
    $orgId = $user->organization_id;

    $engineering = Department::factory()->create(['name' => 'Engineering', 'organization_id' => $orgId]);
    Department::factory()->create(['name' => 'Backend', 'parent_id' => $engineering->id, 'organization_id' => $orgId]);
    Department::factory()->create(['name' => 'Operations', 'organization_id' => $orgId]);

    $this->actingAs($user)
        ->get('/departments')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Departments/Index')
            ->has('departments', 2)
            ->has('departments.0.children')
            ->has('departments.0.users_count')
            ->has('filters')
        );
});

it('renders the departments create page', function () {
    $user = departmentPagesUser();
    $orgId = $user->organization_id;

    $parent = Department::factory()->create(['name' => 'Parent Department', 'organization_id' => $orgId]);
    Department::factory()->create(['name' => 'Child Department', 'parent_id' => $parent->id, 'organization_id' => $orgId]);
    Department::factory()->inactive()->create(['name' => 'Inactive Department', 'organization_id' => $orgId]);

    $this->actingAs($user)
        ->get('/departments/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Departments/Create')
            ->has('departments', 1)
            ->where('departments.0.name', 'Parent Department')
            ->has('departments.0.children', 1)
        );
});

it('creates a department and redirects to the index', function () {
    $user = departmentPagesUser();
    $orgId = $user->organization_id;

    $parent = Department::factory()->create(['organization_id' => $orgId]);

    $this->actingAs($user)
        ->post('/departments', [
            'name' => 'Product Operations',
            'description' => 'Coordinates product delivery work.',
            'parent_id' => $parent->id,
            'is_active' => true,
        ])
        ->assertRedirect('/departments')
        ->assertSessionHas('success', '部門建立成功！');

    $this->assertDatabaseHas('departments', [
        'name' => 'Product Operations',
        'description' => 'Coordinates product delivery work.',
        'parent_id' => $parent->id,
        'is_active' => true,
        'organization_id' => $orgId,
    ]);
});

it('renders the department show page', function () {
    $user = departmentPagesUser();
    $orgId = $user->organization_id;

    $department = Department::factory()->create(['name' => 'Finance', 'organization_id' => $orgId]);
    $department->users()->attach($user->id, ['is_manager' => true]);

    $this->actingAs($user)
        ->get("/departments/{$department->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Departments/Show')
            ->has('department')
            ->where('department.id', $department->id)
            ->where('department.name', 'Finance')
            ->where('department.users_count', 1)
            ->has('department.users', 1)
        );
});

it('renders the department edit page', function () {
    $user = departmentPagesUser();
    $orgId = $user->organization_id;

    $department = Department::factory()->create(['name' => 'Finance', 'organization_id' => $orgId]);
    $availableParent = Department::factory()->create(['name' => 'Operations', 'organization_id' => $orgId]);
    Department::factory()->create(['name' => 'Finance AP', 'parent_id' => $department->id, 'organization_id' => $orgId]);

    $this->actingAs($user)
        ->get("/departments/{$department->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Departments/Edit')
            ->has('department')
            ->where('department.id', $department->id)
            ->has('departments', 1)
            ->where('departments.0.id', $availableParent->id)
        );
});

it('filters departments by search term', function () {
    $user = departmentPagesUser();
    $orgId = $user->organization_id;

    Department::factory()->create(['name' => 'People Operations', 'organization_id' => $orgId]);
    Department::factory()->create(['name' => 'Finance', 'organization_id' => $orgId]);

    $this->actingAs($user)
        ->get('/departments?search=People')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Departments/Index')
            ->has('departments', 1)
            ->where('departments.0.name', 'People Operations')
            ->where('filters.search', 'People')
        );
});

it('filters departments by status', function () {
    $user = departmentPagesUser();
    $orgId = $user->organization_id;

    Department::factory()->create(['name' => 'Active Department', 'organization_id' => $orgId]);
    Department::factory()->inactive()->create(['name' => 'Inactive Department', 'organization_id' => $orgId]);

    $this->actingAs($user)
        ->get('/departments?status=inactive')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Departments/Index')
            ->has('departments', 1)
            ->where('departments.0.name', 'Inactive Department')
            ->where('filters.status', 'inactive')
        );
});

it('does not expose departments from another organization', function () {
    $user = departmentPagesUser();

    $otherOrg = OrganizationSetting::factory()->create();
    $otherDept = Department::factory()->create(['name' => 'Other Org Dept', 'organization_id' => $otherOrg->id]);

    // Index should not include other org's departments
    $this->actingAs($user)
        ->get('/departments')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Departments/Index')
            ->has('departments', 0)
        );
});

it('returns 404 when accessing another org department show page', function () {
    $user = departmentPagesUser();

    $otherOrg = OrganizationSetting::factory()->create();
    $otherDept = Department::factory()->create(['organization_id' => $otherOrg->id]);

    $this->actingAs($user)
        ->get("/departments/{$otherDept->id}")
        ->assertNotFound();
});

it('returns 404 when editing another org department', function () {
    $user = departmentPagesUser();

    $otherOrg = OrganizationSetting::factory()->create();
    $otherDept = Department::factory()->create(['organization_id' => $otherOrg->id]);

    $this->actingAs($user)
        ->get("/departments/{$otherDept->id}/edit")
        ->assertNotFound();
});

it('returns 404 when deleting another org department', function () {
    $user = departmentPagesUser();

    $otherOrg = OrganizationSetting::factory()->create();
    $otherDept = Department::factory()->create(['organization_id' => $otherOrg->id]);

    $this->actingAs($user)
        ->delete("/departments/{$otherDept->id}")
        ->assertNotFound();
});

it('requires authentication to access department pages', function () {
    $department = Department::factory()->create();

    $this->get('/departments')->assertRedirect('/login');
    $this->get('/departments/create')->assertRedirect('/login');
    $this->post('/departments', [])->assertRedirect('/login');
    $this->get("/departments/{$department->id}")->assertRedirect('/login');
    $this->get("/departments/{$department->id}/edit")->assertRedirect('/login');
});

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
    $engineering = Department::factory()->create(['name' => 'Engineering']);
    Department::factory()->create(['name' => 'Backend', 'parent_id' => $engineering->id]);
    Department::factory()->create(['name' => 'Operations']);

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
    $parent = Department::factory()->create(['name' => 'Parent Department']);
    Department::factory()->create(['name' => 'Child Department', 'parent_id' => $parent->id]);
    Department::factory()->inactive()->create(['name' => 'Inactive Department']);

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
    $parent = Department::factory()->create();

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
    ]);
});

it('renders the department show page', function () {
    $user = departmentPagesUser();
    $department = Department::factory()->create(['name' => 'Finance']);
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
    $department = Department::factory()->create(['name' => 'Finance']);
    $availableParent = Department::factory()->create(['name' => 'Operations']);
    Department::factory()->create(['name' => 'Finance AP', 'parent_id' => $department->id]);

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
    Department::factory()->create(['name' => 'People Operations']);
    Department::factory()->create(['name' => 'Finance']);

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
    Department::factory()->create(['name' => 'Active Department']);
    Department::factory()->inactive()->create(['name' => 'Inactive Department']);

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

it('requires authentication to access department pages', function () {
    $department = Department::factory()->create();

    $this->get('/departments')->assertRedirect('/login');
    $this->get('/departments/create')->assertRedirect('/login');
    $this->post('/departments', [])->assertRedirect('/login');
    $this->get("/departments/{$department->id}")->assertRedirect('/login');
    $this->get("/departments/{$department->id}/edit")->assertRedirect('/login');
});

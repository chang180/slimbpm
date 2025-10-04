<?php

use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can list all departments', function () {
    $user = User::factory()->create();
    Department::factory()->count(3)->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/departments');

    $response->assertSuccessful()
        ->assertJsonCount(3, 'data');
});

it('can create a department', function () {
    $user = User::factory()->create();

    $departmentData = [
        'name' => 'IT Department',
        'description' => 'Information Technology Department',
        'is_active' => true,
    ];

    $response = $this->actingAs($user)
        ->postJson('/api/v1/departments', $departmentData);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'IT Department')
        ->assertJsonPath('data.description', 'Information Technology Department');

    $this->assertDatabaseHas('departments', [
        'name' => 'IT Department',
    ]);
});

it('requires name when creating department', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/departments', [
            'description' => 'Test',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

it('can create a department with parent', function () {
    $user = User::factory()->create();
    $parentDepartment = Department::factory()->create(['name' => 'Parent Department']);

    $departmentData = [
        'name' => 'Sub Department',
        'parent_id' => $parentDepartment->id,
    ];

    $response = $this->actingAs($user)
        ->postJson('/api/v1/departments', $departmentData);

    $response->assertCreated()
        ->assertJsonPath('data.parent_id', $parentDepartment->id);

    $this->assertDatabaseHas('departments', [
        'name' => 'Sub Department',
        'parent_id' => $parentDepartment->id,
    ]);
});

it('validates parent_id exists', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/departments', [
            'name' => 'Test Department',
            'parent_id' => 999,
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['parent_id']);
});

it('can show a specific department', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();

    $response = $this->actingAs($user)
        ->getJson("/api/v1/departments/{$department->id}");

    $response->assertSuccessful()
        ->assertJsonPath('data.id', $department->id)
        ->assertJsonPath('data.name', $department->name);
});

it('can update a department', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();

    $updatedData = [
        'name' => 'Updated Department Name',
        'description' => 'Updated description',
    ];

    $response = $this->actingAs($user)
        ->putJson("/api/v1/departments/{$department->id}", $updatedData);

    $response->assertSuccessful()
        ->assertJsonPath('data.name', 'Updated Department Name');

    $this->assertDatabaseHas('departments', [
        'id' => $department->id,
        'name' => 'Updated Department Name',
    ]);
});

it('can delete a department', function () {
    $user = User::factory()->create();
    $department = Department::factory()->create();

    $response = $this->actingAs($user)
        ->deleteJson("/api/v1/departments/{$department->id}");

    $response->assertSuccessful();

    $this->assertDatabaseMissing('departments', [
        'id' => $department->id,
    ]);
});

it('can load department with parent and children', function () {
    $user = User::factory()->create();
    $parentDepartment = Department::factory()->create(['name' => 'Parent']);
    $department = Department::factory()->create([
        'name' => 'Main Department',
        'parent_id' => $parentDepartment->id,
    ]);
    Department::factory()->create([
        'name' => 'Child Department',
        'parent_id' => $department->id,
    ]);

    $response = $this->actingAs($user)
        ->getJson("/api/v1/departments/{$department->id}");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'parent',
                'children',
            ],
        ])
        ->assertJsonPath('data.parent.id', $parentDepartment->id)
        ->assertJsonCount(1, 'data.children');
});

it('requires authentication to access departments', function () {
    $response = $this->getJson('/api/v1/departments');

    $response->assertUnauthorized();
});

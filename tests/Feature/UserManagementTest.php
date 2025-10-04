<?php

use App\Models\Department;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can list all users', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->count(3)->create();

    $response = $this->actingAs($admin)
        ->getJson('/api/v1/users');

    $response->assertSuccessful()
        ->assertJsonCount(4, 'data');
});

it('can create a user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $organization = OrganizationSetting::factory()->create();

    $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'organization_id' => $organization->id,
        'role' => 'user',
        'is_active' => true,
    ];

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/users', $userData);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'John Doe')
        ->assertJsonPath('data.email', 'john@example.com')
        ->assertJsonPath('data.role', 'user');

    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);
});

it('requires name and email when creating user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/users', [
            'password' => 'password123',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email']);
});

it('requires unique email', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $existingUser = User::factory()->create(['email' => 'existing@example.com']);

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/users', [
            'name' => 'New User',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'role' => 'user',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

it('validates role must be valid', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'role' => 'invalid_role',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['role']);
});

it('can create user with departments', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $department1 = Department::factory()->create();
    $department2 = Department::factory()->create();

    $userData = [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'password123',
        'role' => 'manager',
        'departments' => [$department1->id, $department2->id],
    ];

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/users', $userData);

    $response->assertCreated()
        ->assertJsonCount(2, 'data.departments');

    $this->assertDatabaseHas('user_departments', [
        'user_id' => $response->json('data.id'),
        'department_id' => $department1->id,
    ]);
});

it('can show a specific user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $response = $this->actingAs($admin)
        ->getJson("/api/v1/users/{$user->id}");

    $response->assertSuccessful()
        ->assertJsonPath('data.id', $user->id)
        ->assertJsonPath('data.name', $user->name);
});

it('can update a user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $updatedData = [
        'name' => 'Updated Name',
        'email' => $user->email,
        'role' => 'manager',
    ];

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/users/{$user->id}", $updatedData);

    $response->assertSuccessful()
        ->assertJsonPath('data.name', 'Updated Name')
        ->assertJsonPath('data.role', 'manager');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'role' => 'manager',
    ]);
});

it('can update user without changing password', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();
    $originalPassword = $user->password;

    $updatedData = [
        'name' => 'Updated Name',
        'email' => $user->email,
        'role' => 'user',
    ];

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/users/{$user->id}", $updatedData);

    $response->assertSuccessful();

    $user->refresh();
    expect($user->password)->toBe($originalPassword);
});

it('can update user departments', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();
    $department1 = Department::factory()->create();
    $department2 = Department::factory()->create();

    $user->departments()->attach($department1->id);

    $updatedData = [
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
        'departments' => [$department2->id],
    ];

    $response = $this->actingAs($admin)
        ->putJson("/api/v1/users/{$user->id}", $updatedData);

    $response->assertSuccessful()
        ->assertJsonCount(1, 'data.departments')
        ->assertJsonPath('data.departments.0.id', $department2->id);
});

it('can delete a user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $response = $this->actingAs($admin)
        ->deleteJson("/api/v1/users/{$user->id}");

    $response->assertSuccessful();

    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});

it('requires authentication to access users', function () {
    $response = $this->getJson('/api/v1/users');

    $response->assertUnauthorized();
});

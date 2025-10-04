<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementUITest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_can_view_users_index_page(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        User::factory()->count(3)->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($user)->get('/users');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Users/Index')
                ->has('users.data', 4) // 3 created + 1 admin
                ->has('filters')
            );
    }

    public function test_can_view_user_create_page(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $user = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        Department::factory()->count(2)->create();
        OrganizationSetting::factory()->count(2)->create();

        $response = $this->actingAs($user)->get('/users/create');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Users/Create')
                ->has('departments', 2)
                ->has('organizations', 3)
            );
    }

    public function test_can_create_new_user(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        $department = Department::factory()->create();

        $userData = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'organization_id' => $organization->id,
            'role' => 'user',
            'is_active' => true,
            'departments' => [$department->id],
        ];

        $response = $this->actingAs($admin)->post('/users', $userData);

        $response->assertRedirect('/users')
            ->assertSessionHas('success', '用戶建立成功！');

        $this->assertDatabaseHas('users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'role' => 'user',
            'is_active' => true,
        ]);
    }

    public function test_can_view_user_show_page(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        $user = User::factory()->create(['organization_id' => $organization->id]);
        $user->departments()->attach(Department::factory()->create());

        $response = $this->actingAs($admin)->get("/users/{$user->id}");

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Users/Show')
                ->has('user')
                ->where('user.id', $user->id)
            );
    }

    public function test_can_view_user_edit_page(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        $user = User::factory()->create(['organization_id' => $organization->id]);
        Department::factory()->count(2)->create();
        OrganizationSetting::factory()->count(2)->create();

        $response = $this->actingAs($admin)->get("/users/{$user->id}/edit");

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Users/Edit')
                ->has('user')
                ->has('departments', 2)
                ->has('organizations', 3)
            );
    }

    public function test_can_update_user(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        $user = User::factory()->create(['organization_id' => $organization->id]);
        $department = Department::factory()->create();

        $updateData = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'manager',
            'is_active' => false,
            'departments' => [$department->id],
        ];

        $response = $this->actingAs($admin)->put("/users/{$user->id}", $updateData);

        $response->assertRedirect('/users')
            ->assertSessionHas('success', '用戶更新成功！');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role' => 'manager',
            'is_active' => false,
        ]);
    }

    public function test_can_delete_user(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($admin)->delete("/users/{$user->id}");

        $response->assertRedirect('/users')
            ->assertSessionHas('success', '用戶刪除成功！');

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_can_search_users(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com', 'organization_id' => $organization->id]);
        User::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com', 'organization_id' => $organization->id]);

        $response = $this->actingAs($admin)->get('/users?search=John');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Users/Index')
                ->has('users.data', 1)
                ->where('users.data.0.name', 'John Doe')
            );
    }

    public function test_can_filter_users_by_role(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        User::factory()->create(['role' => 'manager', 'organization_id' => $organization->id]);
        User::factory()->create(['role' => 'user', 'organization_id' => $organization->id]);

        $response = $this->actingAs($admin)->get('/users?role=manager');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Users/Index')
                ->has('users.data', 1)
                ->where('users.data.0.role', 'manager')
            );
    }

    public function test_can_filter_users_by_status(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        User::factory()->create(['is_active' => true, 'organization_id' => $organization->id]);
        User::factory()->create(['is_active' => false, 'organization_id' => $organization->id]);

        $response = $this->actingAs($admin)->get('/users?status=inactive');

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Users/Index')
                ->has('users.data', 1)
                ->where('users.data.0.is_active', false)
            );
    }

    public function test_requires_authentication_to_access_users(): void
    {
        $response = $this->get('/users');
        $response->assertRedirect('/login');

        $response = $this->get('/users/create');
        $response->assertRedirect('/login');

        $user = User::factory()->create();
        $response = $this->get("/users/{$user->id}");
        $response->assertRedirect('/login');

        $response = $this->get("/users/{$user->id}/edit");
        $response->assertRedirect('/login');
    }

    public function test_validates_user_creation_data(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);

        $response = $this->actingAs($admin)->post('/users', []);

        $response->assertSessionHasErrors(['name', 'email', 'password', 'role']);
    }

    public function test_validates_user_update_data(): void
    {
        $organization = OrganizationSetting::factory()->create();
        $admin = User::factory()->create(['role' => 'admin', 'organization_id' => $organization->id]);
        $user = User::factory()->create(['organization_id' => $organization->id]);

        $response = $this->actingAs($admin)->put("/users/{$user->id}", []);

        $response->assertSessionHasErrors(['name', 'email', 'role']);
    }
}

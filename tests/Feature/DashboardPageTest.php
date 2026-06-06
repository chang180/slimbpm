<?php

use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns 200 and renders dashboard inertia page for admin', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'admin',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard', ['slug' => $organization->slug]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats')
        ->has('organization')
        ->has('user')
    );
});

it('returns 200 and renders dashboard inertia page for manager', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'manager',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard', ['slug' => $organization->slug]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats')
        ->has('organization')
        ->has('user')
    );
});

it('includes expected stats keys in props', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'admin',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard', ['slug' => $organization->slug]));

    $response->assertInertia(fn ($page) => $page
        ->has('stats.totalUsers')
        ->has('stats.totalDepartments')
        ->has('stats.totalForms')
        ->has('stats.totalWorkflows')
        ->has('stats.activeWorkflows')
    );
});

it('includes organization slug and user id in props', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'admin',
    ]);

    $this->actingAs($user);

    $response = $this->get(route('dashboard', ['slug' => $organization->slug]));

    $response->assertInertia(fn ($page) => $page
        ->where('organization.slug', $organization->slug)
        ->where('user.id', $user->id)
    );
});

it('shares organization slug in auth on non-dashboard pages', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'admin',
    ]);

    $this->actingAs($user)
        ->get('/forms')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('auth.user.organization.slug', $organization->slug)
        );
});

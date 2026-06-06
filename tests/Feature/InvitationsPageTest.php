<?php

use App\Models\Invitation;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('admin can view the invitations page', function () {
    $organization = OrganizationSetting::factory()->create();
    $admin = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'admin',
    ]);

    $this->actingAs($admin)
        ->get('/invitations')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('invitations/Index')
            ->has('invitations.data')
            ->has('invitations.total')
        );
});

it('manager can view the invitations page', function () {
    $organization = OrganizationSetting::factory()->create();
    $manager = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'manager',
    ]);

    $this->actingAs($manager)
        ->get('/invitations')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('invitations/Index')
            ->has('invitations.data')
        );
});

it('regular user cannot view the invitations page', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'user',
    ]);

    $this->actingAs($user)
        ->get('/invitations')
        ->assertForbidden();
});

it('guest is redirected to login from invitations page', function () {
    $this->get('/invitations')
        ->assertRedirect('/login');
});

it('invitations page exposes flat paginator structure', function () {
    $organization = OrganizationSetting::factory()->create();
    $admin = User::factory()->create([
        'organization_id' => $organization->id,
        'role' => 'admin',
    ]);

    Invitation::factory()->count(3)->create([
        'organization_id' => $organization->id,
        'invited_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->get('/invitations')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('invitations/Index')
            ->has('invitations.data', 3)
            ->where('invitations.total', 3)
            ->has('invitations.current_page')
            ->has('invitations.last_page')
        );
});

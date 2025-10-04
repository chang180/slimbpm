<?php

use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can list all organizations', function () {
    $user = User::factory()->create();
    OrganizationSetting::factory()->count(3)->create();

    $response = $this->actingAs($user)
        ->getJson('/api/v1/organizations');

    $response->assertSuccessful()
        ->assertJsonCount(3, 'data');
});

it('can create an organization', function () {
    $user = User::factory()->create();

    $organizationData = [
        'name' => 'Test Organization',
        'settings' => [
            'timezone' => 'Asia/Taipei',
            'currency' => 'TWD',
        ],
    ];

    $response = $this->actingAs($user)
        ->postJson('/api/v1/organizations', $organizationData);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Test Organization')
        ->assertJsonPath('data.settings.timezone', 'Asia/Taipei');

    $this->assertDatabaseHas('organization_settings', [
        'name' => 'Test Organization',
    ]);
});

it('requires name when creating organization', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/organizations', [
            'settings' => [],
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

it('can show a specific organization', function () {
    $user = User::factory()->create();
    $organization = OrganizationSetting::factory()->create();

    $response = $this->actingAs($user)
        ->getJson("/api/v1/organizations/{$organization->id}");

    $response->assertSuccessful()
        ->assertJsonPath('data.id', $organization->id)
        ->assertJsonPath('data.name', $organization->name);
});

it('can update an organization', function () {
    $user = User::factory()->create();
    $organization = OrganizationSetting::factory()->create();

    $updatedData = [
        'name' => 'Updated Organization Name',
        'settings' => [
            'timezone' => 'America/New_York',
        ],
    ];

    $response = $this->actingAs($user)
        ->putJson("/api/v1/organizations/{$organization->id}", $updatedData);

    $response->assertSuccessful()
        ->assertJsonPath('data.name', 'Updated Organization Name');

    $this->assertDatabaseHas('organization_settings', [
        'id' => $organization->id,
        'name' => 'Updated Organization Name',
    ]);
});

it('can delete an organization', function () {
    $user = User::factory()->create();
    $organization = OrganizationSetting::factory()->create();

    $response = $this->actingAs($user)
        ->deleteJson("/api/v1/organizations/{$organization->id}");

    $response->assertSuccessful();

    $this->assertDatabaseMissing('organization_settings', [
        'id' => $organization->id,
    ]);
});

it('requires authentication to access organizations', function () {
    $response = $this->getJson('/api/v1/organizations');

    $response->assertUnauthorized();
});

it('validates settings must be an array', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/api/v1/organizations', [
            'name' => 'Test Organization',
            'settings' => 'invalid',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['settings']);
});

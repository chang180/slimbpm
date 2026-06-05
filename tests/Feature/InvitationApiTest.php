<?php

use App\Models\Invitation;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

function makeOrgAndAdmin(): array
{
    $org = OrganizationSetting::factory()->create();
    $admin = User::factory()->create(['organization_id' => $org->id, 'role' => 'admin']);

    return [$org, $admin];
}

beforeEach(function () {
    Notification::fake();
});

it('admin can send invitations', function () {
    [$org, $admin] = makeOrgAndAdmin();

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/invitations', [
            'emails' => ['newuser@example.com'],
            'role' => 'user',
        ]);

    $response->assertCreated()
        ->assertJsonPath('created', 1);

    $this->assertDatabaseHas('invitations', [
        'email' => 'newuser@example.com',
        'organization_id' => $org->id,
        'role' => 'user',
        'status' => 'sent',
    ]);
});

it('non-admin cannot send invitations', function () {
    [$org] = makeOrgAndAdmin();
    $user = User::factory()->create(['organization_id' => $org->id, 'role' => 'user']);

    $this->actingAs($user)
        ->postJson('/api/v1/invitations', [
            'emails' => ['test@example.com'],
            'role' => 'user',
        ])
        ->assertForbidden();
});

it('skips existing pending invitations', function () {
    [$org, $admin] = makeOrgAndAdmin();

    Invitation::factory()->create([
        'organization_id' => $org->id,
        'invited_by' => $admin->id,
        'email' => 'existing@example.com',
        'status' => 'sent',
    ]);

    $response = $this->actingAs($admin)
        ->postJson('/api/v1/invitations', [
            'emails' => ['existing@example.com', 'newone@example.com'],
            'role' => 'user',
        ]);

    $response->assertCreated()
        ->assertJsonPath('created', 1)
        ->assertJsonFragment(['skipped' => ['existing@example.com']]);
});

it('admin can cancel a pending invitation', function () {
    [$org, $admin] = makeOrgAndAdmin();

    $invitation = Invitation::factory()->create([
        'organization_id' => $org->id,
        'invited_by' => $admin->id,
        'status' => 'sent',
    ]);

    $this->actingAs($admin)
        ->deleteJson("/api/v1/invitations/{$invitation->id}")
        ->assertNoContent();

    $this->assertDatabaseHas('invitations', ['id' => $invitation->id, 'status' => 'cancelled']);
});

it('admin can resend an invitation', function () {
    [$org, $admin] = makeOrgAndAdmin();

    $invitation = Invitation::factory()->create([
        'organization_id' => $org->id,
        'invited_by' => $admin->id,
        'status' => 'sent',
    ]);

    $oldToken = $invitation->token;

    $this->actingAs($admin)
        ->postJson("/api/v1/invitations/{$invitation->id}/resend")
        ->assertOk()
        ->assertJsonFragment(['message' => '邀請已重新發送']);

    $invitation->refresh();
    expect($invitation->token)->not->toBe($oldToken);
});

it('validates invitation email format', function () {
    [$org, $admin] = makeOrgAndAdmin();

    $this->actingAs($admin)
        ->postJson('/api/v1/invitations', [
            'emails' => ['not-an-email'],
            'role' => 'user',
        ])
        ->assertUnprocessable();
});

it('lists invitations for the organization', function () {
    [$org, $admin] = makeOrgAndAdmin();

    Invitation::factory()->count(3)->create([
        'organization_id' => $org->id,
        'invited_by' => $admin->id,
    ]);

    // Invitations from another org should not appear
    $otherOrg = OrganizationSetting::factory()->create();
    $otherAdmin = User::factory()->create(['organization_id' => $otherOrg->id, 'role' => 'admin']);
    Invitation::factory()->create(['organization_id' => $otherOrg->id, 'invited_by' => $otherAdmin->id]);

    $this->actingAs($admin)
        ->getJson('/api/v1/invitations')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

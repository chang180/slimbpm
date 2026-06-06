<?php

use App\Models\Notification;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('authenticated user can mark a single notification as read', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create(['organization_id' => $organization->id]);
    $notification = Notification::factory()->pending()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson("/api/v1/notifications/{$notification->id}/mark-as-read")
        ->assertOk()
        ->assertJson(['message' => '通知已標記為已讀']);

    expect($notification->fresh()->status)->toBe('sent');
});

it('marking a single notification as read decreases the unread count', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create(['organization_id' => $organization->id]);

    Notification::factory()->pending()->count(3)->create(['user_id' => $user->id]);
    $notification = Notification::factory()->pending()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson("/api/v1/notifications/{$notification->id}/mark-as-read")
        ->assertOk();

    expect(
        Notification::where('user_id', $user->id)->where('status', 'pending')->count()
    )->toBe(3);
});

it('authenticated user can mark all notifications as read', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create(['organization_id' => $organization->id]);

    Notification::factory()->pending()->count(4)->create(['user_id' => $user->id]);
    Notification::factory()->sent()->count(2)->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/v1/notifications/mark-all-as-read')
        ->assertOk()
        ->assertJson(['message' => '所有通知已標記為已讀']);

    expect(
        Notification::where('user_id', $user->id)->where('status', 'pending')->count()
    )->toBe(0);
    expect(
        Notification::where('user_id', $user->id)->where('status', 'sent')->count()
    )->toBe(6);
});

it('mark all as read only affects the current user notifications', function () {
    $organization = OrganizationSetting::factory()->create();
    $userA = User::factory()->create(['organization_id' => $organization->id]);
    $userB = User::factory()->create(['organization_id' => $organization->id]);

    Notification::factory()->pending()->count(3)->create(['user_id' => $userA->id]);
    Notification::factory()->pending()->count(4)->create(['user_id' => $userB->id]);

    $this->actingAs($userA)
        ->postJson('/api/v1/notifications/mark-all-as-read')
        ->assertOk();

    expect(
        Notification::where('user_id', $userA->id)->where('status', 'pending')->count()
    )->toBe(0);
    expect(
        Notification::where('user_id', $userB->id)->where('status', 'pending')->count()
    )->toBe(4);
});

it('cannot mark another users notification as read', function () {
    $organization = OrganizationSetting::factory()->create();
    $user = User::factory()->create(['organization_id' => $organization->id]);
    $otherUser = User::factory()->create(['organization_id' => $organization->id]);
    $notification = Notification::factory()->pending()->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->postJson("/api/v1/notifications/{$notification->id}/mark-as-read")
        ->assertForbidden();

    expect($notification->fresh()->status)->toBe('pending');
});

it('unauthenticated user cannot mark a notification as read', function () {
    $notification = Notification::factory()->pending()->create();

    $this->postJson("/api/v1/notifications/{$notification->id}/mark-as-read")
        ->assertUnauthorized();
});

it('unauthenticated user cannot mark all notifications as read', function () {
    $this->postJson('/api/v1/notifications/mark-all-as-read')
        ->assertUnauthorized();
});

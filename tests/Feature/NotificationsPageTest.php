<?php

use App\Models\Notification;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makeUserWithOrg(): User
{
    $organization = OrganizationSetting::factory()->create();

    return User::factory()->create([
        'organization_id' => $organization->id,
    ]);
}

it('authenticated user can view the notifications page', function () {
    $user = makeUserWithOrg();

    $this->actingAs($user)
        ->get('/notifications')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('notifications/Index')
            ->has('notifications.data')
            ->has('unreadCount')
        );
});

it('guest is redirected to login from notifications page', function () {
    $this->get('/notifications')
        ->assertRedirect('/login');
});

it('notifications page shows user notifications only', function () {
    $user = makeUserWithOrg();
    $otherUser = makeUserWithOrg();

    Notification::factory()->count(2)->create(['user_id' => $user->id]);
    Notification::factory()->count(5)->create(['user_id' => $otherUser->id]);

    $this->actingAs($user)
        ->get('/notifications')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('notifications/Index')
            ->has('notifications.data', 2)
        );
});

it('notifications page reports correct unread count', function () {
    $user = makeUserWithOrg();

    Notification::factory()->count(3)->create([
        'user_id' => $user->id,
        'status' => 'pending',
    ]);
    Notification::factory()->count(2)->create([
        'user_id' => $user->id,
        'status' => 'sent',
    ]);

    $this->actingAs($user)
        ->get('/notifications')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('unreadCount', 3)
        );
});

it('notifications page accepts status filter', function () {
    $user = makeUserWithOrg();

    Notification::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'pending']);
    Notification::factory()->count(3)->create(['user_id' => $user->id, 'status' => 'sent']);

    $this->actingAs($user)
        ->get('/notifications?status=sent')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('notifications.data', 3)
        );
});

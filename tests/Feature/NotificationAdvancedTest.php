<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationAdvancedTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_can_mark_notification_as_read(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $user->id, 'status' => 'pending']);

        $response = $this->actingAs($user)->postJson("/api/v1/notifications/{$notification->id}/mark-as-read");

        $response->assertStatus(200)
            ->assertJson(['message' => '通知已標記為已讀']);

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'status' => 'sent',
        ]);
    }

    public function test_can_mark_all_notifications_as_read(): void
    {
        $user = User::factory()->create();
        Notification::factory()->count(3)->create(['user_id' => $user->id, 'status' => 'pending']);

        $response = $this->actingAs($user)->postJson('/api/v1/notifications/mark-all-as-read');

        $response->assertStatus(200)
            ->assertJson(['message' => '所有通知已標記為已讀']);

        $this->assertDatabaseMissing('notifications', [
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
    }

    public function test_can_get_unread_count(): void
    {
        $user = User::factory()->create();
        Notification::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'pending']);
        Notification::factory()->count(1)->create(['user_id' => $user->id, 'status' => 'sent']);

        $response = $this->actingAs($user)->getJson('/api/v1/notifications/unread-count');

        $response->assertStatus(200)
            ->assertJson(['unread_count' => 2]);
    }

    public function test_can_filter_notifications_by_status(): void
    {
        $user = User::factory()->create();
        Notification::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'pending']);
        Notification::factory()->count(1)->create(['user_id' => $user->id, 'status' => 'sent']);

        $response = $this->actingAs($user)->getJson('/api/v1/notifications?status=pending');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_notifications_by_type(): void
    {
        $user = User::factory()->create();
        Notification::factory()->count(2)->create(['user_id' => $user->id, 'type' => 'email']);
        Notification::factory()->count(1)->create(['user_id' => $user->id, 'type' => 'line']);

        $response = $this->actingAs($user)->getJson('/api/v1/notifications?type=email');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }
}

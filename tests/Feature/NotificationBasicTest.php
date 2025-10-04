<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationBasicTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_can_create_notification(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $user->id]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'id' => $notification->id,
        ]);
    }

    public function test_can_get_user_notifications(): void
    {
        $user = User::factory()->create();
        Notification::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/notifications');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_notification_via_api(): void
    {
        $user = User::factory()->create();
        $targetUser = User::factory()->create();

        $notificationData = [
            'user_id' => $targetUser->id,
            'type' => 'email',
            'subject' => '測試通知',
            'content' => '這是一個測試通知內容',
        ];

        $response = $this->actingAs($user)->postJson('/api/v1/notifications', $notificationData);

        $response->assertStatus(201)
            ->assertJsonFragment(['subject' => '測試通知']);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $targetUser->id,
            'subject' => '測試通知',
        ]);
    }

    public function test_can_get_specific_notification(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson("/api/v1/notifications/{$notification->id}");

        $response->assertStatus(200)
            ->assertJson(['id' => $notification->id]);
    }

    public function test_can_update_notification_status(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $user->id, 'status' => 'pending']);

        $response = $this->actingAs($user)->putJson("/api/v1/notifications/{$notification->id}", [
            'status' => 'sent',
        ]);

        $response->assertStatus(200)
            ->assertJson(['status' => 'sent']);

        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'status' => 'sent',
        ]);
    }

    public function test_can_delete_notification(): void
    {
        $user = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson("/api/v1/notifications/{$notification->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => '通知已刪除']);

        $this->assertDatabaseMissing('notifications', ['id' => $notification->id]);
    }

    public function test_cannot_access_other_user_notifications(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)->getJson("/api/v1/notifications/{$notification->id}");

        $response->assertStatus(403)
            ->assertJson(['message' => '無權限查看此通知']);
    }
}

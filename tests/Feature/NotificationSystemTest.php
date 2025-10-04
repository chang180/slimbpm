<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\NotificationSetting;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationSystemTest extends TestCase
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

    public function test_cannot_access_other_user_notifications(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)->getJson("/api/v1/notifications/{$notification->id}");

        $response->assertStatus(403)
            ->assertJson(['message' => '無權限查看此通知']);
    }

    public function test_can_get_notification_settings(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/v1/notification-settings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'user_id',
                'email_notifications',
                'line_notifications',
                'telegram_notifications',
                'whatsapp_notifications',
            ]);
    }

    public function test_can_update_notification_settings(): void
    {
        $user = User::factory()->create();

        // 先建立設定
        $settings = NotificationSetting::factory()->create(['user_id' => $user->id]);

        $settingsData = [
            'email_notifications' => true,
            'line_notifications' => true,
            'telegram_notifications' => false,
            'whatsapp_notifications' => false,
        ];

        $response = $this->actingAs($user)->putJson("/api/v1/notification-settings/{$settings->id}", $settingsData);

        $response->assertStatus(200)
            ->assertJson($settingsData);

        $this->assertDatabaseHas('notification_settings', [
            'user_id' => $user->id,
            'email_notifications' => true,
            'line_notifications' => true,
        ]);
    }

    public function test_can_reset_notification_settings(): void
    {
        $user = User::factory()->create();
        NotificationSetting::factory()->create([
            'user_id' => $user->id,
            'email_notifications' => false,
            'line_notifications' => true,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/notification-settings/reset');

        $response->assertStatus(200)
            ->assertJson([
                'email_notifications' => true,
                'line_notifications' => false,
                'telegram_notifications' => false,
                'whatsapp_notifications' => false,
            ]);
    }

    public function test_notification_service_can_send_notification(): void
    {
        $user = User::factory()->create();
        NotificationSetting::factory()->create([
            'user_id' => $user->id,
            'email_notifications' => true,
        ]);

        $service = new NotificationService;
        $notification = $service->sendNotification($user, 'email', '測試主題', '測試內容', false);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'type' => 'email',
            'subject' => '測試主題',
            'status' => 'sent',
        ]);
    }

    public function test_notification_service_respects_user_settings(): void
    {
        $user = User::factory()->create();
        NotificationSetting::factory()->create([
            'user_id' => $user->id,
            'email_notifications' => false,
        ]);

        $service = new NotificationService;

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('用戶未啟用 email 通知');

        $service->sendNotification($user, 'email', '測試主題', '測試內容', false);
    }
}

<?php

namespace Tests\Feature;

use App\Models\NotificationSetting;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationServiceBasicTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
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

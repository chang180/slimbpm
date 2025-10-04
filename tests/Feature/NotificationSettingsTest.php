<?php

namespace Tests\Feature;

use App\Models\NotificationSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationSettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
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
}

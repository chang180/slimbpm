<?php

namespace Database\Factories;

use App\Models\NotificationSetting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NotificationSetting>
 */
class NotificationSettingFactory extends Factory
{
    protected $model = NotificationSetting::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'email_notifications' => $this->faker->boolean(80), // 80% 機率啟用
            'line_notifications' => $this->faker->boolean(30),   // 30% 機率啟用
            'telegram_notifications' => $this->faker->boolean(20), // 20% 機率啟用
            'whatsapp_notifications' => $this->faker->boolean(15), // 15% 機率啟用
        ];
    }

    /**
     * 全部啟用的設定
     */
    public function allEnabled(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_notifications' => true,
            'line_notifications' => true,
            'telegram_notifications' => true,
            'whatsapp_notifications' => true,
        ]);
    }

    /**
     * 全部停用的設定
     */
    public function allDisabled(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_notifications' => false,
            'line_notifications' => false,
            'telegram_notifications' => false,
            'whatsapp_notifications' => false,
        ]);
    }

    /**
     * 只啟用 Email 的設定
     */
    public function emailOnly(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_notifications' => true,
            'line_notifications' => false,
            'telegram_notifications' => false,
            'whatsapp_notifications' => false,
        ]);
    }

    /**
     * 啟用社交媒體通知的設定
     */
    public function socialEnabled(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_notifications' => true,
            'line_notifications' => true,
            'telegram_notifications' => true,
            'whatsapp_notifications' => false,
        ]);
    }
}

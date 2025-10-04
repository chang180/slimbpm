<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['email', 'line', 'telegram', 'whatsapp']),
            'subject' => $this->faker->sentence(),
            'content' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['pending', 'sent', 'failed']),
            'sent_at' => $this->faker->optional(0.7)->dateTimeThisYear(),
        ];
    }

    /**
     * 已發送的通知
     */
    public function sent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
            'sent_at' => $this->faker->dateTimeThisYear(),
        ]);
    }

    /**
     * 待發送的通知
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'sent_at' => null,
        ]);
    }

    /**
     * 發送失敗的通知
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
            'sent_at' => null,
        ]);
    }

    /**
     * Email 通知
     */
    public function email(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'email',
        ]);
    }

    /**
     * Line 通知
     */
    public function line(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'line',
        ]);
    }

    /**
     * Telegram 通知
     */
    public function telegram(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'telegram',
        ]);
    }

    /**
     * WhatsApp 通知
     */
    public function whatsapp(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'whatsapp',
        ]);
    }
}

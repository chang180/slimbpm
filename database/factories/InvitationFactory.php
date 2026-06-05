<?php

namespace Database\Factories;

use App\Models\Invitation;
use App\Models\OrganizationSetting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invitation>
 */
class InvitationFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'organization_id' => OrganizationSetting::factory(),
            'invited_by' => User::factory(),
            'accepted_by' => null,
            'email' => fake()->unique()->safeEmail(),
            'role' => fake()->randomElement(['admin', 'manager', 'user']),
            'token' => Invitation::generateToken(),
            'status' => 'sent',
            'sent_at' => now(),
            'accepted_at' => null,
            'expires_at' => now()->addDays(7),
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => 'pending', 'sent_at' => null]);
    }

    public function accepted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'accepted',
            'accepted_at' => now(),
            'accepted_by' => User::factory(),
        ]);
    }

    public function expired(): static
    {
        return $this->state(['status' => 'expired', 'expires_at' => now()->subDay()]);
    }

    public function cancelled(): static
    {
        return $this->state(['status' => 'cancelled']);
    }
}
